import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Robust multi-path .env resolution
dotenv.config({ path: path.resolve(__dirname, "./.env") });
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas asynchronously
connectDB().catch((err) => {
  console.warn("[DB Status] Initial connection warning:", err.message);
});

const server = app.listen(PORT, () => {
  console.log(`[Backend Server] Express API running on port ${PORT}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.log(`[Backend Server] Port ${PORT} already active.`);
  } else {
    console.error("[Backend Server Error]", err.message);
  }
});

// Handle unhandled promise rejections gracefully without killing Express
process.on("unhandledRejection", (err) => {
  console.warn("[Backend System Warning] Unhandled rejection logged:", err ? err.message : err);
});

export default server;
