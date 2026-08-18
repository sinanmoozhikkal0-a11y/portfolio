import Media from "../models/Media.js";

/**
 * Handles dual-mode image inputs (File Upload vs URL string paste)
 * If a file was uploaded via Multer, saves metadata to Media collection and returns Cloudinary URL.
 * Otherwise, if a URL string was provided in body, returns that URL.
 * Fallback to existing or default URL.
 */
export const processImageInput = async (req, fileField, bodyUrlField, fallbackValue = "") => {
  // Option 1: File was uploaded via Multer to Cloudinary
  if (req.file && (fileField === "image" || req.file.fieldname === fileField)) {
    const fileUrl = req.file.path;
    const publicId = req.file.filename || req.file.public_id || "";

    // Save record in Media library if not already present
    try {
      if (publicId) {
        await Media.create({
          filename: req.file.originalname || "Upload",
          url: fileUrl,
          publicId: publicId,
          size: req.file.size || 0,
          format: req.file.mimetype || "image"
        });
      }
    } catch (err) {
      // Ignore duplicate media log error
    }

    return fileUrl;
  }

  // Option 2: Image URL was pasted in body
  if (req.body && req.body[bodyUrlField] && typeof req.body[bodyUrlField] === "string" && req.body[bodyUrlField].trim() !== "") {
    return req.body[bodyUrlField].trim();
  }

  // Option 3: Fallback
  return fallbackValue;
};

/**
 * Process multiple file uploads or array of URL strings (e.g., project mockups)
 */
export const processMultipleImages = async (req, filesField, bodyUrlsField, fallbackArray = []) => {
  let urls = [];

  // Option 1: Files uploaded in req.files
  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    for (const file of req.files) {
      urls.push(file.path);
      try {
        await Media.create({
          filename: file.originalname || "Gallery Upload",
          url: file.path,
          publicId: file.filename || file.public_id || "",
          size: file.size || 0,
          format: file.mimetype || "image"
        });
      } catch (e) {}
    }
  }

  // Option 2: Array or comma-separated string of URLs in body
  if (req.body && req.body[bodyUrlsField]) {
    const bodyUrls = req.body[bodyUrlsField];
    if (Array.isArray(bodyUrls)) {
      const parsed = bodyUrls.filter(u => typeof u === "string" && u.trim() !== "");
      urls = [...urls, ...parsed];
    } else if (typeof bodyUrls === "string" && bodyUrls.trim() !== "") {
      const parsed = bodyUrls.split(",").map(u => u.trim()).filter(u => u !== "");
      urls = [...urls, ...parsed];
    }
  }

  return urls.length > 0 ? urls : fallbackArray;
};
