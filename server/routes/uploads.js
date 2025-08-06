const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { authenticateToken } = require("../middleware/auth.js");
const { PrismaClient, UploadType } = require("@prisma/client");
// import cloudinary from "../config/cloudinary.js";

const prisma = new PrismaClient();
const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = "uploads";
const imagesDir = path.join(uploadsDir, "images");
const documentsDir = path.join(uploadsDir, "documents");

[uploadsDir, imagesDir, documentsDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, imagesDir);
    } else {
      cb(null, documentsDir);
    }
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedImageTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  const allowedDocTypes = ["application/pdf", "text/plain", "application/json"];

  if (
    allowedImageTypes.includes(file.mimetype) ||
    allowedDocTypes.includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPEG, PNG, GIF, WebP, PDF, and text files are allowed."
      )
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || "5242880"), // 5MB default
  },
});

// Upload single file
router.post("/", authenticateToken, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded",
        message: "Please select a file to upload",
      });
    }

    // Determine file type
    let uploadType = "DOCUMENT";
    if (req.file.mimetype.startsWith("image/")) {
      uploadType = "IMAGE";
    }

    // Generate public URL
    const publicUrl = `/uploads/${uploadType.toLowerCase()}s/${
      req.file.filename
    }`;

    // Save to database
    const uploadRecord = await prisma.upload.create({
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: publicUrl,
        type: uploadType,
        authorId: req.user.id,
      },
    });

    res.status(201).json({
      message: "File uploaded successfully",
      upload: uploadRecord,
    });
  } catch (error) {
    console.error("Upload error:", error);

    // Clean up file if database save failed
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        error: "File too large",
        message: "File size must be less than 5MB",
      });
    }

    res.status(500).json({
      error: "Internal server error",
      message: "Failed to upload file",
    });
  }
});

// Get user's uploads
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { page = "1", limit = "20", type } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const where = {
      authorId: req.user.id,
    };

    if (type && ["IMAGE", "DOCUMENT"].includes(type)) {
      where.type = type;
    }

    const [uploads, total] = await Promise.all([
      prisma.upload.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limitNum,
      }),
      prisma.upload.count({ where }),
    ]);

    res.json({
      uploads,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Get uploads error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to fetch uploads",
    });
  }
});

// Delete upload
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Find upload
    const upload = await prisma.upload.findUnique({
      where: { id },
    });

    if (!upload) {
      return res.status(404).json({
        error: "Upload not found",
        message: "The requested upload does not exist",
      });
    }

    // Check ownership
    if (upload.authorId !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({
        error: "Access denied",
        message: "You can only delete your own uploads",
      });
    }

    // Delete file from filesystem
    const filePath = path.join(
      uploadsDir,
      upload.type === "IMAGE" ? "images" : "documents",
      upload.filename
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from database
    await prisma.upload.delete({
      where: { id },
    });

    res.json({
      message: "Upload deleted successfully",
    });
  } catch (error) {
    console.error("Delete upload error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to delete upload",
    });
  }
});

router.post(
  "/avatar",
  authenticateToken,
  upload.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: "No file uploaded",
          message: "Please select an avatar image",
        });
      }

      if (!req.file.mimetype.startsWith("image/")) {
        return res.status(400).json({
          error: "Invalid file type",
          message: "Avatar must be an image (JPEG, PNG, GIF, WebP)",
        });
      }

      // Generate public URL
      const avatarUrl = `${req.protocol}://${req.get("host")}/uploads/images/${req.file.filename}`;

      // Optionally update user's avatar in DB directly:
      const updatedUser = await prisma.user.update({
        where: { id: req.user.id },
        data: { avatar: avatarUrl },
      });

      res.status(200).json({
        message: "Avatar uploaded successfully",
        user: updatedUser,
        avatarUrl,
      });
    } catch (error) {
      console.error("Avatar upload error:", error);

      // Clean up on error
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      res.status(500).json({
        error: "Internal server error",
        message: "Failed to upload avatar",
      });
    }
  }
);

module.exports = router;
