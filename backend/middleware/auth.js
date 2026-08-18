import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import { connectDB } from "../config/db.js";

export const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "You are not logged in. Please log in to gain access."
    });
  }

  try {
    const secret = process.env.ACCESS_TOKEN_SECRET || "dev_access_token_secret_string_32_characters_long_key";
    const decoded = jwt.verify(token, secret);
    
    // Ensure DB connection is active before querying Admin model
    await connectDB();
    
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: "Database offline. Please whitelist your IP in MongoDB Atlas."
      });
    }

    const currentAdmin = await Admin.findById(decoded.id);
    if (!currentAdmin) {
      return res.status(401).json({
        success: false,
        message: "The user belonging to this session no longer exists."
      });
    }

    req.admin = currentAdmin;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Your session token has expired. Please log in again."
      });
    }
    return res.status(401).json({
      success: false,
      message: "Invalid session token. Please authenticate again."
    });
  }
};
