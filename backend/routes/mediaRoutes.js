import express from "express";
import { getAllMedia, uploadMedia, deleteMedia } from "../controllers/mediaController.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

router.use(protect); // Protect all media endpoints

router.route("/")
  .get(getAllMedia)
  .post(upload.single("file"), uploadMedia);

router.route("/:id")
  .delete(deleteMedia);

export default router;
