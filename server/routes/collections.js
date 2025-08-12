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

    let where = {};

    // If user is authenticated, show public collections + their own collections
    // If not authenticated, show only public collections
    if (req.user) {
      where = {
        OR: [
          { isPublic: true },
          { authorId: req.user.id }
        ]
      };
    } else {
      where = {
        isPublic: true,
      };
    }

    if (search) {
      const searchCondition = {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ]
      };

      if (req.user) {
        where = {
          AND: [
            {
              OR: [
                { isPublic: true },
                { authorId: req.user.id }
              ]
            },
            searchCondition
          ]
        };
      } else {
        where = {
          AND: [
            { isPublic: true },
            searchCondition
          ]
        };
      }
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

// Update collection
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = updateCollectionSchema.parse(req.body);

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
        message: "You can only update your own collections",
      });
    }

    // Update collection
    const updatedCollection = await prisma.collection.update({
      where: { id },
      data: validatedData,
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

    res.json({
      collection: updatedCollection,
      message: "Collection updated successfully",
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        error: "Validation error",
        message: error.errors[0]?.message || "Invalid input",
      });
    }

    console.error("Update collection error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to update collection",
    });
  }
});

// Add component to collection
router.post("/:id/components", authenticateToken, async (req, res) => {
  try {
    const { id: collectionId } = req.params;
    const { componentId } = req.body;

    if (!componentId) {
      return res.status(400).json({
        error: "Validation error",
        message: "Component ID is required",
      });
    }

    // Check if collection exists and user owns it
    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
    });

    if (!collection) {
      return res.status(404).json({
        error: "Collection not found",
        message: "The requested collection does not exist",
      });
    }

    if (collection.authorId !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({
        error: "Access denied",
        message: "You can only modify your own collections",
      });
    }

    // Check if component exists
    const component = await prisma.component.findUnique({
      where: { id: componentId },
    });

    if (!component) {
      return res.status(404).json({
        error: "Component not found",
        message: "The requested component does not exist",
      });
    }

    // Check if component is already in collection
    const existingEntry = await prisma.componentCollection.findUnique({
      where: {
        collectionId_componentId: {
          collectionId,
          componentId,
        },
      },
    });

    if (existingEntry) {
      return res.status(409).json({
        error: "Component already in collection",
        message: "This component is already in the collection",
      });
    }

    // Add component to collection
    await prisma.componentCollection.create({
      data: {
        collectionId,
        componentId,
      },
    });

    res.json({
      message: "Component added to collection successfully",
    });
  } catch (error) {
    console.error("Add component to collection error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to add component to collection",
    });
  }
});

// Remove component from collection
router.delete("/:id/components/:componentId", authenticateToken, async (req, res) => {
  try {
    const { id: collectionId, componentId } = req.params;

    // Check if collection exists and user owns it
    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
    });

    if (!collection) {
      return res.status(404).json({
        error: "Collection not found",
        message: "The requested collection does not exist",
      });
    }

    if (collection.authorId !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({
        error: "Access denied",
        message: "You can only modify your own collections",
      });
    }

    // Check if component is in collection
    const existingEntry = await prisma.componentCollection.findUnique({
      where: {
        collectionId_componentId: {
          collectionId,
          componentId,
        },
      },
    });

    if (!existingEntry) {
      return res.status(404).json({
        error: "Component not in collection",
        message: "This component is not in the collection",
      });
    }

    // Remove component from collection
    await prisma.componentCollection.delete({
      where: {
        collectionId_componentId: {
          collectionId,
          componentId,
        },
      },
    });

    res.json({
      message: "Component removed from collection successfully",
    });
  } catch (error) {
    console.error("Remove component from collection error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to remove component from collection",
    });
  }
});


module.exports = router;