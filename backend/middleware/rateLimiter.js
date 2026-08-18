import rateLimit from "express-rate-limit";

// Rate limit login endpoint to protect against brute force
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 login requests per windowMs
  message: {
    success: false,
    status: "fail",
    message: "Too many login attempts from this IP, please try again after 15 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false }
});

// Rate limit contact message submissions to prevent mailer/database spam
export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit each IP to 20 message submissions per windowMs
  message: {
    success: false,
    status: "fail",
    message: "Too many messages sent from this IP, please try again in an hour."
  },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false }
});

// General api rate limiting
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 500 requests per windowMs
  message: {
    success: false,
    status: "fail",
    message: "Too many requests from this IP. Please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false }
});
