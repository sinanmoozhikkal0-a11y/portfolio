import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import { AppError } from "../middleware/error.js";

// Helper to generate access tokens (short-lived: 15m)
const generateAccessToken = (id) => {
  const secret = process.env.ACCESS_TOKEN_SECRET || "dev_access_token_secret_string_32_characters_long_key";
  return jwt.sign({ id }, secret, {
    expiresIn: "15m"
  });
};

// Helper to generate refresh tokens (longer-lived: 7d)
const generateRefreshToken = (id) => {
  const secret = process.env.REFRESH_TOKEN_SECRET || "dev_refresh_token_secret_string_64_characters_long_key";
  return jwt.sign({ id }, secret, {
    expiresIn: "7d"
  });
};

export const login = async (req, res, next) => {
  const { username, password } = req.body || {};

  console.log("--> AUTH LOGIN INCOMING REQUEST:", { username });

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide both username and password."
    });
  }

  // If MongoDB is offline, provide local fallback authentication for default admin credentials
  if (mongoose.connection.readyState !== 1) {
    const defaultUser = (process.env.ADMIN_USERNAME || "admin").trim().toLowerCase();
    const defaultPass = process.env.ADMIN_PASSWORD || "password123";
    const inputUser = String(username).trim().toLowerCase();

    if (inputUser === defaultUser && password === defaultPass) {
      const mockId = "000000000000000000000001";
      const accessToken = generateAccessToken(mockId);
      const refreshToken = generateRefreshToken(mockId);

      return res.status(200).json({
        success: true,
        status: "success",
        token: accessToken,
        accessToken: accessToken,
        admin: {
          _id: mockId,
          id: mockId,
          username: defaultUser
        }
      });
    }

    return res.status(400).json({
      success: false,
      message: "Database offline. Please check MongoDB connection or use default admin credentials."
    });
  }

  try {
    const searchUsername = String(username).trim().toLowerCase();
    const admin = await Admin.findOne({ username: searchUsername }).select("+password");

    if (!admin) {
      console.warn(`--> AUTH LOGIN FAIL: Admin user '${searchUsername}' not found in database.`);
      return res.status(401).json({
        success: false,
        message: "Invalid username or password."
      });
    }

    const isMatch = await admin.comparePassword(password, admin.password);
    console.log(`--> AUTH LOGIN COMPARE RESULT:`, { isMatch });

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password."
      });
    }

    const accessToken = generateAccessToken(admin._id);
    const refreshToken = generateRefreshToken(admin._id);

    if (!Array.isArray(admin.refreshTokens)) {
      admin.refreshTokens = [];
    }

    admin.refreshTokens.push(refreshToken);
    await admin.save();

    try {
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
    } catch (e) {}

    return res.status(200).json({
      success: true,
      status: "success",
      token: accessToken,
      accessToken: accessToken,
      admin: {
        _id: admin._id,
        id: admin._id,
        username: admin.username
      }
    });
  } catch (error) {
    console.error("--> AUTH LOGIN ERROR:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Authentication failed. Please check database connection."
    });
  }
};

export const refresh = async (req, res, next) => {
  const cookies = req.headers.cookie;
  let refreshToken;
  
  if (cookies) {
    const match = cookies.split("; ").find(row => row.startsWith("refreshToken="));
    if (match) {
      refreshToken = match.split("=")[1];
    }
  }

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "No refresh token provided."
    });
  }

  try {
    const secret = process.env.REFRESH_TOKEN_SECRET || "dev_refresh_token_secret_string_64_characters_long_key";
    const decoded = jwt.verify(refreshToken, secret);
    
    const admin = await Admin.findById(decoded.id);
    if (!admin || !Array.isArray(admin.refreshTokens) || !admin.refreshTokens.includes(refreshToken)) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh session."
      });
    }

    const newAccessToken = generateAccessToken(admin._id);
    const newRefreshToken = generateRefreshToken(admin._id);

    admin.refreshTokens = admin.refreshTokens.filter(t => t !== refreshToken);
    admin.refreshTokens.push(newRefreshToken);
    await admin.save();

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      success: true,
      status: "success",
      token: newAccessToken,
      accessToken: newAccessToken
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token verification failed."
    });
  }
};

export const logout = async (req, res, next) => {
  const cookies = req.headers.cookie;
  let refreshToken;

  if (cookies) {
    const match = cookies.split("; ").find(row => row.startsWith("refreshToken="));
    if (match) {
      refreshToken = match.split("=")[1];
    }
  }

  try {
    if (refreshToken) {
      try {
        const secret = process.env.REFRESH_TOKEN_SECRET || "dev_refresh_token_secret_string_64_characters_long_key";
        const decoded = jwt.verify(refreshToken, secret);
        const admin = await Admin.findById(decoded.id);
        if (admin && Array.isArray(admin.refreshTokens)) {
          admin.refreshTokens = admin.refreshTokens.filter(t => t !== refreshToken);
          await admin.save();
        }
      } catch (err) {}
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });

    return res.status(200).json({
      success: true,
      status: "success",
      message: "Successfully logged out."
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Logout failed."
    });
  }
};
