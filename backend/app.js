import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Robust multi-path .env resolution
dotenv.config({ path: path.resolve(__dirname, "./.env") });
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import heroRoutes from "./routes/heroRoutes.js";
import aboutRoutes from "./routes/aboutRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import footerRoutes from "./routes/footerRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import mediaRoutes from "./routes/mediaRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import { errorHandler } from "./middleware/error.js";
import { apiLimiter } from "./middleware/rateLimiter.js";

const app = express();

// Trust reverse proxies (Vite dev server, Vercel, Render, Nginx)
app.set("trust proxy", 1);

// Set security HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// Configure dynamic CORS for production & local development
const getAllowedOrigins = () => {
  const envOrigins = process.env.FRONTEND_URL 
    ? process.env.FRONTEND_URL.split(",").map(url => url.trim().replace(/\/+$/, ""))
    : [];
  
  return [...envOrigins, "http://localhost:5173", "http://localhost:3000"];
};

const corsOptions = {
  origin: (origin, callback) => {
    const allowed = getAllowedOrigins();
    if (!origin || allowed.includes("*") || allowed.includes(origin) || allowed.some(a => origin.endsWith(a))) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(mongoSanitize());
app.use("/api", apiLimiter);

// Serve uploaded local media files statically
const uploadsDir = path.resolve(__dirname, "../public/uploads");
app.use("/uploads", express.static(uploadsDir));
app.use("/public/uploads", express.static(uploadsDir));

// Middleware to ensure DB connection is attempted asynchronously without blocking requests
app.use((req, res, next) => {
  connectDB().catch(() => {});
  next();
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/hero", heroRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/footer", footerRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/settings", settingsRoutes);

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Portfolio CMS API is online and healthy.",
    timestamp: new Date().toISOString()
  });
});

// Root API Endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Portfolio CMS API is online."
  });
});

// Wildcard / 404 Route handler for unknown API routes
app.all("*", (req, res) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

// Global error handling middleware
app.use(errorHandler);

export default app;
