import express from "express";
import { login, refresh, logout } from "../controllers/authController.js";
import { loginLimiter } from "../middleware/rateLimiter.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", loginLimiter, login);
router.post("/refresh", refresh);
router.post("/logout", protect, logout);

export default router;
