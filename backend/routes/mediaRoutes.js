import express from "express";
import { getAllMedia, uploadMedia, deleteMedia } from "../controllers/mediaController.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

// Fallback upload endpoint accessible for admin & image uploads
router.post("/upload", upload.single("file"), uploadMedia);

router.use(protect); // Protect remaining media management endpoints

router.route("/")
  .get(getAllMedia)
  .post(upload.single("file"), uploadMedia);

router.route("/:id")
  .delete(deleteMedia);

export default router;
