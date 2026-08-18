export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let status = err.status || "error";
  let message = err.message || "Internal Server Error";

  // Handle Mongoose CastError (invalid ObjectId format)
  if (err.name === "CastError") {
    statusCode = 400;
    status = "fail";
    message = `Invalid ID format: "${err.value}" at path "${err.path}"`;
  }

  console.error("SERVER ERROR 💥:", {
    path: req.originalUrl,
    method: req.method,
    message: message
  });

  // Ensure every execution path returns valid JSON
  return res.status(statusCode).json({
    success: false,
    status: status,
    message: message
  });
};

// Custom operational error helper
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
