import express from "express";
import { getAbout, updateAbout } from "../controllers/aboutController.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

router.route("/")
  .get(getAbout)
  .put(protect, upload.fields([{ name: "profileImage", maxCount: 1 }, { name: "resume", maxCount: 1 }]), updateAbout)
  .post(protect, upload.fields([{ name: "profileImage", maxCount: 1 }, { name: "resume", maxCount: 1 }]), updateAbout);

export default router;
