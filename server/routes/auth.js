const express = require("express");
const { z } = require("zod");
const { PrismaClient } = require("@prisma/client");
const { hashPassword, comparePassword, generateToken } = require("../utils/auth.js");
const { authenticateToken } = require("../middleware/auth.js");
const passport = require("../config/passport.js");

const prisma = new PrismaClient();
const router = express.Router();

// Validation schemas
const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

// Register
router.post("/register", async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: validatedData.email },
          { username: validatedData.username },
        ],
      },
    });

    if (existingUser) {
      return res.status(400).json({
        error: "User already exists",
        message:
          existingUser.email === validatedData.email
            ? "Email already registered"
            : "Username already taken",
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        username: validatedData.username,
        password: hashedPassword,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        role: true,
        createdAt: true,
      },
    });

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
      message: "User created successfully",
      user,
      token,
    });
  } catch (error) {
    console.error("Register error:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation error",
        message: error.errors[0].message,
        details: error.errors,
      });
    }

    res.status(500).json({
      error: "Internal server error",
      message: "Failed to create user",
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials",
        message: "Email or password is incorrect",
      });
    }

    // Check password
    const isPasswordValid = await comparePassword(
      validatedData.password,
      user.password,
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid credentials",
        message: "Email or password is incorrect",
      });
    }

    // Generate token
    const token = generateToken(user.id);

    // Return user without password
    const { password, ...userWithoutPassword } = user;

    res.json({
      message: "Login successful",
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation error",
        message: error.errors[0].message,
        details: error.errors,
      });
    }

    res.status(500).json({
      error: "Internal server error",
      message: "Failed to login",
    });
  }
});

// Get current user profile
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        bio: true,
        website: true,
        github: true,
        twitter: true,
        isVerified: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            components: true,
            likes: true,
            collections: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
        message: "User profile not found",
      });
    }

    res.json({ user });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to get user profile",
    });
  }
});

// Update profile
const updateProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  github: z.string().optional(),
  twitter: z.string().optional(),
});

router.patch("/profile", authenticateToken, async (req, res) => {
  try {
    const validatedData = updateProfileSchema.parse(req.body);

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...validatedData,
        website: validatedData.website === "" ? null : validatedData.website,
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        bio: true,
        website: true,
        github: true,
        twitter: true,
        isVerified: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation error",
        message: error.errors[0].message,
        details: error.errors,
      });
    }

    res.status(500).json({
      error: "Internal server error",
      message: "Failed to update profile",
    });
  }
});

// Logout (for completeness, though JWT is stateless)
router.post("/logout", authenticateToken, (req, res) => {
  res.json({
    message: "Logged out successfully",
  });
});

// OAuth Routes

// Google OAuth
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  async (req, res) => {
    try {
      // Generate JWT token for the user
      const token = generateToken(req.user.id);

      // Redirect to frontend with token
      const frontendURL = process.env.FRONTEND_URL || 'http://localhost:8081';
      res.redirect(`${frontendURL}/auth/callback?token=${token}&provider=google`);
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8081'}/login?error=oauth_failed`);
    }
  }
);

// GitHub OAuth
router.get('/github', passport.authenticate('github', {
  scope: ['user:email']
}));

router.get('/github/callback',
  passport.authenticate('github', { session: false }),
  async (req, res) => {
    try {
      // Generate JWT token for the user
      const token = generateToken(req.user.id);

      // Redirect to frontend with token
      const frontendURL = process.env.FRONTEND_URL || 'http://localhost:8081';
      res.redirect(`${frontendURL}/auth/callback?token=${token}&provider=github`);
    } catch (error) {
      console.error('GitHub OAuth callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8081'}/login?error=oauth_failed`);
    }
  }
);

module.exports = router;
