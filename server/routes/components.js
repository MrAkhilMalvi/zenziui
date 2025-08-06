const express = require("express");
const { z } = require("zod");
const { PrismaClient } = require("@prisma/client");
const { authenticateToken, optionalAuth } = require("../middleware/auth.js");

const prisma = new PrismaClient();
const router = express.Router();

// Validation schemas
const createComponentSchema = z.object({
  name: z.string().min(1, "Component name is required").max(100),
  description: z.string().max(500).optional(),
  code: z.string().min(1, "Component code is required"),
  preview: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).default([]),
  complexity: z.enum(["SIMPLE", "INTERMEDIATE", "ADVANCED", "EXPERT"]).default("SIMPLE"),
  isPublic: z.boolean().default(true),
  framework: z.enum(["REACT", "VUE", "ANGULAR", "SVELTE", "VANILLA"]).default("REACT"),
  version: z.string().default("1.0.0"),
});
const updateComponentSchema = createComponentSchema.partial();

const complexityMap = {
  SIMPLE: "Simple",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
  EXPERT: "Expert",
};
const frameworkMap = {
  REACT: "React",
  VUE: "Vue",
  ANGULAR: "Angular",
  SVELTE: "Svelte",
  VANILLA: "Vanilla",
};

// ---------------- GET ALL COMPONENTS ----------------
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

    const where = { isPublic: true };
    if (category) where.category = category;
    if (complexity) where.complexity = complexity.toUpperCase();
    if (framework) where.framework = framework.toUpperCase();

    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      where.OR = tagArray.map((tag) => ({
        tags: { contains: `"${tag}"` },
      }));
    }

    if (search) {
      const searchOR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { tags: { contains: `"${search}"` } },
      ];
      where.OR = where.OR ? [...where.OR, ...searchOR] : searchOR;
    }

    let orderBy =
      sortBy === "popularity"
        ? { likes: { _count: sortOrder } }
        : { [sortBy]: sortOrder };

        const include = {
  author: {
    select: { id: true, username: true, avatar: true, isVerified: true },
  },
  _count: { select: { likes: true, comments: true } },
};

if (req.user) {
  include.likes = {
    where: { userId: req.user.id },
    select: { id: true },
  };
}

 const [components, total] = await Promise.all([
  prisma.component.findMany({
    where,
    skip,
    take: limitNum,
    orderBy,
    include,
  }),
  prisma.component.count({ where }),
]);

    const componentsWithLabels = components.map((c) => ({
      ...c,
      complexityLabel: complexityMap[c.complexity] || c.complexity,
      frameworkLabel: frameworkMap[c.framework] || c.framework,
      tags: Array.isArray(c.tags) ? c.tags : JSON.parse(c.tags || "[]"),
      isLiked: req.user ? c.likes?.length > 0 : false,
      likes: undefined,
    }));

    res.json({
      components: componentsWithLabels,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  } catch (error) {
    console.error("Get components error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ---------------- GET COMPONENT BY ID ----------------
router.get("/:id", optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const component = await prisma.component.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, username: true, avatar: true, isVerified: true } },
        _count: { select: { likes: true, comments: true } },
        comments: {
          include: { author: { select: { id: true, username: true, avatar: true } } },
          orderBy: { createdAt: "desc" },
        },
        ...(req.user && {
          likes: { where: { userId: req.user.id }, select: { id: true } },
        }),
      },
    });

    if (!component) return res.status(404).json({ error: "Component not found" });
    if (!component.isPublic && (!req.user || req.user.id !== component.authorId))
      return res.status(403).json({ error: "Access denied" });

    await prisma.component.update({ where: { id }, data: { views: { increment: 1 } } });

    res.json({
      component: {
        ...component,
        complexityLabel: complexityMap[component.complexity] || component.complexity,
        frameworkLabel: frameworkMap[component.framework] || component.framework,
        tags: JSON.parse(component.tags || "[]"),
        isLiked: req.user ? component.likes?.length > 0 : false,
        likes: undefined,
      },
    });
  } catch (error) {
    console.error("Get component error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ---------------- CREATE COMPONENT ----------------
router.post("/", authenticateToken, async (req, res) => {
  try {
    const validatedData = createComponentSchema.parse(req.body);
    const component = await prisma.component.create({
      data: { ...validatedData, tags: validatedData.tags ?? [], authorId: req.user.id },
      include: {
        author: { select: { id: true, username: true, avatar: true, isVerified: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });
    res.status(201).json({ message: "Component created", component });
  } catch (error) {
    console.error("Create component error:", error);
    if (error instanceof z.ZodError)
      return res.status(400).json({ error: "Validation error", details: error.errors });
    res.status(500).json({ error: "Internal server error" });
  }
});

// ---------------- UPDATE COMPONENT ----------------
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = updateComponentSchema.parse(req.body);
    const existing = await prisma.component.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Component not found" });
    if (existing.authorId !== req.user.id) return res.status(403).json({ error: "Access denied" });

    const component = await prisma.component.update({
      where: { id },
      data: validatedData,
      include: {
        author: { select: { id: true, username: true, avatar: true, isVerified: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });

    res.json({
      message: "Component updated successfully",
      component: { ...component, tags: JSON.parse(component.tags || "[]") },
    });
  } catch (error) {
    console.error("Update component error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ---------------- DELETE COMPONENT ----------------
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.component.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Component not found" });
    if (existing.authorId !== req.user.id && req.user.role !== "ADMIN")
      return res.status(403).json({ error: "Access denied" });

    await prisma.component.delete({ where: { id } });
    res.json({ message: "Component deleted successfully" });
  } catch (error) {
    console.error("Delete component error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ---------------- LIKE / UNLIKE COMPONENT ----------------
router.post("/:id/like", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const component = await prisma.component.findUnique({ where: { id } });
    if (!component) return res.status(404).json({ error: "Component not found" });

    const existingLike = await prisma.componentLike.findUnique({
      where: { userId_componentId: { userId: req.user.id, componentId: id } },
    });

    if (existingLike) {
      await prisma.componentLike.delete({ where: { id: existingLike.id } });
      return res.json({ message: "Component unliked", isLiked: false });
    }

    await prisma.componentLike.create({ data: { userId: req.user.id, componentId: id } });
    res.json({ message: "Component liked", isLiked: true });
  } catch (error) {
    console.error("Like component error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ---------------- USER COMPONENTS ----------------
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = "1", limit = "20", includePrivate = "false" } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const where = { authorId: userId, ...(includePrivate !== "true" && { isPublic: true }) };

    const [components, total] = await Promise.all([
      prisma.component.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limitNum,
        include: {
          author: { select: { id: true, username: true, avatar: true, isVerified: true } },
          _count: { select: { likes: true, comments: true } },
        },
      }),
      prisma.component.count({ where }),
    ]);

    res.json({
      components: components.map((c) => ({
        ...c,
        complexityLabel: complexityMap[c.complexity] || c.complexity,
        frameworkLabel: frameworkMap[c.framework] || c.framework,
        tags: Array.isArray(c.tags) ? c.tags : JSON.parse(c.tags || "[]"),
      })),
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  } catch (error) {
    console.error("Get user components error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
