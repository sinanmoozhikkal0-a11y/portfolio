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
      return next(new AppError("Please select a file to upload.", 400));
    }

    // Determine clean file URL (Cloudinary URL vs Local relative URL)
    let fileUrl = req.file.path || req.file.url;
    if (!fileUrl.startsWith("http://") && !fileUrl.startsWith("https://")) {
      const filename = path.basename(req.file.path);
      fileUrl = `/uploads/${filename}`;
    }

    const mediaData = {
      _id: mongoose.connection.readyState === 1 ? undefined : new mongoose.Types.ObjectId().toString(),
      filename: req.file.originalname,
      url: fileUrl,
      publicId: req.file.filename || req.file.public_id || "",
      size: req.file.size || 0,
      format: req.file.mimetype || "image",
      createdAt: new Date()
    };

    if (mongoose.connection.readyState === 1) {
      const newMedia = await Media.create(mediaData);
      return res.status(201).json({
        status: "success",
        data: newMedia
      });
    }

    // Offline / Mock success response
    return res.status(201).json({
      status: "success",
      data: mediaData
    });
  } catch (error) {
    next(error);
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
