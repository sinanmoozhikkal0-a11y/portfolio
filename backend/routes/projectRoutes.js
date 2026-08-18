import express from "express";
import { getAllProjects, getProject, createProject, updateProject, deleteProject } from "../controllers/projectController.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

const uploadFields = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "banner", maxCount: 1 },
  { name: "mockups", maxCount: 10 }
]);

router.route("/")
  .get(getAllProjects)
  .post(protect, uploadFields, createProject);

router.route("/:id")
  .get(getProject)
  .put(protect, uploadFields, updateProject)
  .delete(protect, deleteProject);

export default router;
