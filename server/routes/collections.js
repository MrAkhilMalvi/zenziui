const express = require("express");
const { z } = require("zod");
const { PrismaClient } = require("@prisma/client");
const { authenticateToken, optionalAuth } = require("../middleware/auth.js");

const prisma = new PrismaClient();
const router = express.Router();

// Validation schemas
const createCollectionSchema = z.object({
  name: z
    .string()
    .min(1, "Collection name is required")
    .max(100, "Name too long"),
  description: z.string().max(500, "Description too long").optional(),
  isPublic: z.boolean().default(false),
});

const updateCollectionSchema = createCollectionSchema.partial();

// Get all public collections
router.get("/", optionalAuth, async (req, res) => {
  try {
    const { page = "1", limit = "20", search } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const where = {
      isPublic: true,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [collections, total] = await Promise.all([
      prisma.collection.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip,
        take: limitNum,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              avatar: true,
              isVerified: true,
            },
          },
          _count: {
            select: {
              components: true,
            },
          },
          components: {
            take: 3, // Preview first 3 components
            include: {
              component: {
                select: {
                  id: true,
                  name: true,
                  preview: true,
                },
              },
            },
          },
        },
      }),
      prisma.collection.count({ where }),
    ]);

    res.json({
      collections,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Get collections error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to fetch collections",
    });
  }
});

// Get collection by ID
router.get("/:id", optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const collection = await prisma.collection.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
            isVerified: true,
          },
        },
        _count: {
          select: {
            components: true,
          },
        },
        components: {
          include: {
            component: {
              include: {
                author: {
                  select: {
                    id: true,
                    username: true,
                    avatar: true,
                  },
                },
                _count: {
                  select: {
                    likes: true,
                  },
                },
              },
            },
          },
          orderBy: { addedAt: "desc" },
        },
      },
    });

    if (!collection) {
      return res.status(404).json({
        error: "Collection not found",
        message: "The requested collection does not exist",
      });
    }

    // Check if user can view this collection
    if (
      !collection.isPublic &&
      (!req.user || req.user.id !== collection.authorId)
    ) {
      return res.status(403).json({
        error: "Access denied",
        message: "This collection is private",
      });
    }

    res.json({ collection });
  } catch (error) {
    console.error("Get collection error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to fetch collection",
    });
  }
});

// Create new collection
router.post("/", authenticateToken, async (req, res) => {
  try {
    const validatedData = createCollectionSchema.parse(req.body);

    const collection = await prisma.collection.create({
      data: {
        ...validatedData,
        authorId: req.user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
            isVerified: true,
          },
        },
        _count: {
          select: {
            components: true,
          },
        },
      },
    });

    res.status(201).json({
      message: "Collection created successfully",
      collection,
    });
  } catch (error) {
    console.error("Create collection error:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation error",
        message: error.errors[0].message,
        details: error.errors,
      });
    }

    res.status(500).json({
      error: "Internal server error",
      message: "Failed to create collection",
    });
  }
});

// Delete collection by ID
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if collection exists
    const collection = await prisma.collection.findUnique({
      where: { id },
    });

    if (!collection) {
      return res.status(404).json({
        error: "Collection not found",
        message: "The requested collection does not exist",
      });
    }

    // Check if user owns it or is admin
    if (collection.authorId !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({
        error: "Access denied",
        message: "You can only delete your own collections",
      });
    }

    // Delete collection
    await prisma.collection.delete({
      where: { id },
    });

    res.json({
      message: "Collection deleted successfully",
    });
  } catch (error) {
    console.error("Delete collection error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to delete collection",
    });
  }
});


module.exports = router;
