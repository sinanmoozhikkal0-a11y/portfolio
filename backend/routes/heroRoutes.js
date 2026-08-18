import express from "express";
import { getHero, updateHero } from "../controllers/heroController.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

router.route("/")
  .get(getHero)
  .put(protect, upload.fields([{ name: "image", maxCount: 1 }, { name: "resume", maxCount: 1 }]), updateHero)
  .post(protect, upload.fields([{ name: "image", maxCount: 1 }, { name: "resume", maxCount: 1 }]), updateHero);

export default router;
