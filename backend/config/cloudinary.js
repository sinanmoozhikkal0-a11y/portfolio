import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const cloudName = (process.env.CLOUDINARY_CLOUD_NAME || "").trim();
const apiKey = (process.env.CLOUDINARY_API_KEY || "").trim();
const apiSecret = (process.env.CLOUDINARY_API_SECRET || "").trim();

const isCloudinaryConfigured = Boolean(cloudName && apiKey && apiSecret);

let storage;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret
  });

  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "portfolio",
      allowed_formats: ["jpg", "jpeg", "png", "webp", "pdf", "mp4", "svg"],
      resource_type: "auto",
      public_id: (req, file) => {
        const cleanName = file.originalname.split(".")[0].replace(/[^a-zA-Z0-9]/g, "_");
        return `${cleanName}_${Date.now()}`;
      }
    }
  });
} else {
  // Local Disk Storage fallback for offline / development upload support
  const uploadsPath = path.resolve(__dirname, "../../public/uploads");
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
  }

  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsPath);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, "_");
      cb(null, `${cleanName}_${Date.now()}${ext}`);
    }
  });
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 20 * 1024 * 1024 // 20MB maximum file size
  }
});

export { cloudinary, upload };
