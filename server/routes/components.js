const express = require("express");
const { z } = require("zod");
const { PrismaClient } = require("@prisma/client");
const { authenticateToken, optionalAuth } = require("../middleware/auth.js");

const prisma = new PrismaClient();
const router = express.Router();

// Validation schemas
const createComponentSchema = z.object({
  name: z
    .string()
    .min(1, "Component name is required")
    .max(100, "Name too long"),
  description: z.string().max(500, "Description too long").optional(),
  code: z.string().min(1, "Component code is required"),
  preview: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  tags: z
    .array(z.string())
    .default([]),
  complexity: z
    .enum(["SIMPLE", "INTERMEDIATE", "ADVANCED", "EXPERT"])
    .default("SIMPLE"),
  isPublic: z.boolean().default(true),
  framework: z
    .enum(["REACT", "VUE", "ANGULAR", "SVELTE", "VANILLA"])
    .default("REACT"),
  version: z.string().default("1.0.0"),
});

const updateComponentSchema = createComponentSchema.partial();

// Get all public components with filtering and pagination
router.get("/", optionalAuth, async (req, res) => {
  try {
    const {
      page = "1",
      limit = "20",
      category,
      tags,
      complexity,
      framework,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where = {
      isPublic: true,
    };

    if (category) {
      where.category = category;
    }

    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      // For SQLite, we need to use JSON contains with LIKE for tag search
      where.OR = where.OR || [];
      tagArray.forEach((tag) => {
        where.OR.push({
          tags: {
            contains: `"${tag}"`,
          },
        });
      });
    }

    if (complexity) {
      where.complexity = complexity;
    }

    if (framework) {
      where.framework = framework;
    }

    if (search) {
      const searchOR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { tags: { contains: `"${search}"` } },
      ];

      if (where.OR) {
        // Combine with existing OR conditions (from tags)
        where.OR = [...where.OR, ...searchOR];
      } else {
        where.OR = searchOR;
      }
    }

    // Build orderBy
   let orderBy;
if (sortBy === "popularity") {
  orderBy = { likes: { _count: sortOrder } };   // ✅ proper Prisma syntax
} else if (sortBy === "downloads") {
  orderBy = { downloads: sortOrder };
} else if (sortBy === "views") {
  orderBy = { views: sortOrder };
} else {
  orderBy = { [sortBy]: sortOrder };
}


const [components, total] = await Promise.all([
  prisma.component.findMany({
    where: { isPublic: true },
    orderBy: {
      likes: { _count: 'desc' }   // FIXED
    },
    skip: 0,
    take: 12,
    include: {
      author: {
        select: {
          id: true,
          username: true,
          avatar: true,
          isVerified: true
        }
      },
      _count: {
        select: {
          likes: true,
          comments: true
        }
      },
      likes: {
        where: {
          userId: "cmdtxgmke0000vr8whvrv485o"
        },
        select: {
          id: true
        }
      }
    }
  }),
  prisma.component.count({ where: { isPublic: true } })
]);


    // Add isLiked field for authenticated users and parse tags
const componentsWithLikes = components.map((component) => ({
  ...component,
  tags: Array.isArray(component.tags)
    ? component.tags
    : JSON.parse(component.tags || "[]"), // fallback if some legacy string exists
  isLiked: req.user ? component.likes?.length > 0 : false,
  likes: undefined,
}));


    res.json({
      components: componentsWithLikes,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Get components error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to fetch components",
    });
  }
});

// Get component by ID
router.get("/:id", optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const component = await prisma.component.findUnique({
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
            likes: true,
            comments: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        ...(req.user && {
          likes: {
            where: { userId: req.user.id },
            select: { id: true },
          },
        }),
      },
    });

    if (!component) {
      return res.status(404).json({
        error: "Component not found",
        message: "The requested component does not exist",
      });
    }

    // Check if user can view this component
    if (
      !component.isPublic &&
      (!req.user || req.user.id !== component.authorId)
    ) {
      return res.status(403).json({
        error: "Access denied",
        message: "This component is private",
      });
    }

    // Increment view count
    await prisma.component.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    const componentWithLike = {
      ...component,
      tags: JSON.parse(component.tags || "[]"),
      isLiked: req.user ? component.likes?.length > 0 : false,
      likes: undefined,
    };

    res.json({ component: componentWithLike });
  } catch (error) {
    console.error("Get component error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to fetch component",
    });
  }
});

// Create new component
router.post("/", authenticateToken, async (req, res) => {
  try {
    const validatedData = createComponentSchema.parse(req.body);

    const component = await prisma.component.create({
      data: {
        ...validatedData,
        tags: validatedData.tags ?? [], // ensures tags is array
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
            likes: true,
            comments: true,
          },
        },
      },
    });

    res.status(201).json({
      message: "Component created successfully",
      component, // send as is, tags already array
    });
  } catch (error) {
    console.error("Create component error:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation error",
        message: error.errors[0].message,
        details: error.errors,
      });
    }

    res.status(500).json({
      error: "Internal server error",
      message: "Failed to create component",
    });
  }
});


// Update component
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = updateComponentSchema.parse(req.body);

    // Check if component exists and user owns it
    const existingComponent = await prisma.component.findUnique({
      where: { id },
    });

    if (!existingComponent) {
      return res.status(404).json({
        error: "Component not found",
        message: "The requested component does not exist",
      });
    }

    if (existingComponent.authorId !== req.user.id) {
      return res.status(403).json({
        error: "Access denied",
        message: "You can only update your own components",
      });
    }

    const component = await prisma.component.update({
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
            likes: true,
            comments: true,
          },
        },
      },
    });

    res.json({
      message: "Component updated successfully",
      component: {
        ...component,
        tags: JSON.parse(component.tags || "[]"),
      },
    });
  } catch (error) {
    console.error("Update component error:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation error",
        message: error.errors[0].message,
        details: error.errors,
      });
    }

    res.status(500).json({
      error: "Internal server error",
      message: "Failed to update component",
    });
  }
});

// Delete component
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if collection exists and user owns it
    const existingCollection = await prisma.collection.findUnique({
      where: { id },
    });

    if (!existingCollection) {
      return res.status(404).json({
        error: "Collection not found",
        message: "The requested collection does not exist",
      });
    }

    if (
      existingCollection.userId !== req.user.id &&
      req.user.role !== "ADMIN"
    ) {
      return res.status(403).json({
        error: "Access denied",
        message: "You can only delete your own collections",
      });
    }

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


// Like/Unlike component
router.post("/:id/like", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if component exists
    const component = await prisma.component.findUnique({
      where: { id },
    });

    if (!component) {
      return res.status(404).json({
        error: "Component not found",
        message: "The requested component does not exist",
      });
    }

    // Check if already liked
    const existingLike = await prisma.componentLike.findUnique({
      where: {
        userId_componentId: {
          userId: req.user.id,
          componentId: id,
        },
      },
    });

    if (existingLike) {
      // Unlike
      await prisma.componentLike.delete({
        where: { id: existingLike.id },
      });

      res.json({
        message: "Component unliked successfully",
        isLiked: false,
      });
    } else {
      // Like
      await prisma.componentLike.create({
        data: {
          userId: req.user.id,
          componentId: id,
        },
      });

      res.json({
        message: "Component liked successfully",
        isLiked: true,
      });
    }
  } catch (error) {
    console.error("Like component error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to like/unlike component",
    });
  }
});

// Get user's components
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = "1", limit = "20", includePrivate = "false" } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where = {
      authorId: userId,
    };

    // Only include private components if it's the user's own profile
    if (includePrivate !== "true") {
      where.isPublic = true;
    }

    const [components, total] = await Promise.all([
      prisma.component.findMany({
        where,
        orderBy: { createdAt: "desc" },
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
              likes: true,
              comments: true,
            },
          },
        },
      }),
      prisma.component.count({ where }),
    ]);

    res.json({
      components,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Get user components error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to fetch user components",
    });
  }
});

module.exports = router;
