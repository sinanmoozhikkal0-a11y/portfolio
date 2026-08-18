import mongoose from "mongoose";
import dns from "dns";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Admin from "../models/Admin.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Robust multi-path .env resolution
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

// Disable Mongoose command buffering so queries fail/fall back fast when DB is offline
mongoose.set("bufferCommands", false);

try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {
  // Gracefully handle restricted execution environments
}

let cachedConnection = null;

const ensureAdminSeeded = async () => {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const username = (process.env.ADMIN_USERNAME || "admin").trim().toLowerCase();
      const password = process.env.ADMIN_PASSWORD || "password123";

      const newAdmin = new Admin({
        username,
        password
      });

      await newAdmin.save();
      console.log(`[Auto-Seed] Created initial admin user: '${username}' with default password.`);
    }
  } catch (err) {
    console.warn(`[Auto-Seed Warning] Could not auto-seed admin: ${err.message}`);
  }
};

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const dbUri = process.env.MONGODB_URI || "mongodb+srv://sinanm:sinan2007@cluster0.je1hmw2.mongodb.net/portfolio?retryWrites=true&w=majority";
  if (!dbUri) {
    console.warn("MONGODB_URI is not defined in environment variables");
    return null;
  }

  if (cachedConnection) {
    try {
      await cachedConnection;
      if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
      }
    } catch (e) {
      cachedConnection = null;
    }
  }

  try {
    cachedConnection = mongoose.connect(dbUri, {
      serverSelectionTimeoutMS: 3000,
    });

    await cachedConnection;
    console.log("MongoDB connected successfully");
    
    // Auto-seed admin user if empty
    ensureAdminSeeded();

    return mongoose.connection;
  } catch (error) {
    cachedConnection = null;
    console.warn(`[DB Status] MongoDB connection offline: ${error.message}`);
    return null;
  }
};
