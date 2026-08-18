import express from "express";
import { getFooter, updateFooter } from "../controllers/footerController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.route("/")
  .get(getFooter)
  .put(protect, updateFooter)
  .post(protect, updateFooter);

export default router;
