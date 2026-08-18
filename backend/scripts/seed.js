import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";
import Admin from "../models/Admin.js";

// Set Node DNS to use public Google servers to resolve SRV records properly
try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {
  console.warn("Could not set custom DNS servers:", e.message);
}

dotenv.config();

const seedAdmin = async () => {
  const dbUri = process.env.MONGODB_URI;
  if (!dbUri) {
    console.error("Please configure MONGODB_URI in your environment / .env file");
    process.exit(1);
  }

  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "password123";

  try {
    console.log("Connecting to database for seeding...");
    await mongoose.connect(dbUri);
    console.log("Connected to MongoDB successfully.");

    // Delete existing admin accounts to avoid duplication
    console.log("Clearing existing admin collections...");
    await Admin.deleteMany({});

    // Create the seed admin
    console.log(`Creating default admin user: ${username}`);
    const admin = new Admin({
      username,
      password // Password will be automatically hashed by pre-save schema middleware
    });

    await admin.save();
    console.log("-----------------------------------------");
    console.log("Admin account created successfully!");
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    console.log("-----------------------------------------");
    console.log("Please delete or update this default account in production.");

    await mongoose.disconnect();
    console.log("Disconnected from database.");
    process.exit(0);
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
