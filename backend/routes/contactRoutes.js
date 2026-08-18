import express from "express";
import { 
  submitMessage, 
  getAllMessages, 
  markAsRead, 
  deleteMessage 
} from "../controllers/contactController.js";
import { protect } from "../middleware/auth.js";
import { contactLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.route("/")
  .post(contactLimiter, submitMessage)
  .get(protect, getAllMessages);

router.patch("/:id/read", protect, markAsRead);
router.delete("/:id", protect, deleteMessage);

export default router;
