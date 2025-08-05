const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

// Get user profile by username
router.get("/:username", async (req, res) => {
  try {
    const { username } = req.params;

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        bio: true,
        website: true,
        github: true,
        twitter: true,
        isVerified: true,
        createdAt: true,
        _count: {
          select: {
            components: true,
            likes: true,
            collections: {
              where: { isPublic: true },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
        message: "The requested user does not exist",
      });
    }

    res.json({ user });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to fetch user",
    });
  }
});

// Search users
router.get("/", async (req, res) => {
  try {
    const { q: query = "", page = "1", limit = "20" } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const where = query
      ? {
          OR: [
            { username: { contains: query, mode: "insensitive" } },
            { firstName: { contains: query, mode: "insensitive" } },
            { lastName: { contains: query, mode: "insensitive" } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limitNum,
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          avatar: true,
          bio: true,
          isVerified: true,
          createdAt: true,
          _count: {
            select: {
              components: {
                where: { isPublic: true },
              },
              likes: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      users,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Search users error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to search users",
    });
  }
});

module.exports = router;
