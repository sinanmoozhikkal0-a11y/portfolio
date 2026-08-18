import express from "express";
import { getAllSkills, createSkill, updateSkill, deleteSkill } from "../controllers/skillController.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

router.route("/")
  .get(getAllSkills)
  .post(protect, upload.single("icon"), createSkill);

router.route("/:id")
  .put(protect, upload.single("icon"), updateSkill)
  .delete(protect, deleteSkill);

export default router;
