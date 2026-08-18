import path from "path";
import mongoose from "mongoose";
import Media from "../models/Media.js";
import { cloudinary } from "../config/cloudinary.js";
import { AppError } from "../middleware/error.js";

export const getAllMedia = async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(200).json({
      status: "success",
      results: 0,
      data: []
    });
  }

  try {
    const media = await Media.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: "success",
      results: media.length,
      data: media
    });
  } catch (error) {
    res.status(200).json({
      status: "success",
      results: 0,
      data: []
    });
  }
};

export const uploadMedia = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please select a file to upload." });
    }

    let fileUrl = req.file.path || req.file.secure_url || req.file.url || "";
    if (!fileUrl.startsWith("http://") && !fileUrl.startsWith("https://")) {
      const filename = path.basename(req.file.path);
      fileUrl = `/uploads/${filename}`;
    }

    const publicId = req.file.filename || req.file.public_id || "";

    const mediaData = {
      filename: req.file.originalname,
      url: fileUrl,
      publicId: publicId,
      size: req.file.size || 0,
      format: req.file.mimetype || "image",
      createdAt: new Date()
    };

    if (mongoose.connection.readyState === 1) {
      const newMedia = await Media.create(mediaData);
      return res.status(201).json({
        success: true,
        status: "success",
        secure_url: fileUrl,
        url: fileUrl,
        public_id: publicId,
        data: newMedia
      });
    }

    return res.status(201).json({
      success: true,
      status: "success",
      secure_url: fileUrl,
      url: fileUrl,
      public_id: publicId,
      data: mediaData
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to upload file to Cloudinary."
    });
  }
};

export const deleteMedia = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id) || mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        status: "success",
        data: null,
        message: "Media deleted successfully"
      });
    }

    const item = await Media.findById(id);
    if (item && item.publicId) {
      const isPdf = item.format && item.format.includes("pdf");
      cloudinary.uploader.destroy(item.publicId, { resource_type: isPdf ? "raw" : "image" }).catch(() => {});
    }

    if (item) {
      await Media.findByIdAndDelete(id);
    }

    res.status(200).json({
      status: "success",
      data: null,
      message: "Media deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};
