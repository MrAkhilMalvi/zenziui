require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const session = require("express-session");
const passport = require("./config/passport.js");
const { PrismaClient } = require("@prisma/client");
const path = require("path");

// Route imports
const authRoutes = require("./routes/auth.js");
const userRoutes = require("./routes/users.js");
const componentRoutes = require("./routes/components.js");
const uploadRoutes = require("./routes/uploads.js");
const collectionRoutes = require("./routes/collections.js");

// Initialize Prisma
const prisma = new PrismaClient();

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"), // Limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

function createServer() {
  const app = express();

  // Security middleware
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: false,
    }),
  );

  // CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:8081",
  "http://localhost:8080",
  "http://192.168.0.69:8081",
  "http://192.168.0.69:8080"
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS not allowed for this origin"), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

  // Session middleware (required for passport)
  app.use(session({
    secret: process.env.SESSION_SECRET || 'zenziui-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());


  // General middleware
  app.use(compression());
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Rate limiting
  app.use("/api", limiter);

  // Static file serving for uploads
  app.use("/uploads", express.static(path.join(__dirname, "uploads"), {
  setHeaders: (res) => {
    res.set("Cross-Origin-Resource-Policy", "cross-origin");
  }
}));

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "pong";
    res.json({ message: ping });
  });

  // Main API routes
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/components", componentRoutes);
  app.use("/api/uploads", uploadRoutes);
  app.use("/api/collections", collectionRoutes);

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error("Error:", err);

    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        error: "File too large",
        message: "Please upload a file smaller than 5MB",
      });
    }

    if (err.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation Error",
        message: err.message,
      });
    }

    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        error: "Invalid token",
        message: "Please log in again",
      });
    }

    res.status(err.status || 500).json({
      error:
        process.env.NODE_ENV === "production"
          ? "Internal Server Error"
          : err.message,
      ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
    });
  });

  // 404 handler
  app.use("*", (req, res) => {
    res.status(404).json({
      error: "Not Found",
      message: `Route ${req.originalUrl} not found`,
    });
  });

  return app;
}

// Start server
const app = createServer();
const PORT = process.env.PORT || 3001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🎯 API docs: http://localhost:${PORT}/api/ping`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Received SIGINT, shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Received SIGTERM, shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

module.exports = { createServer, prisma };
