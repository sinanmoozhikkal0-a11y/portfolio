import Contact from "../models/Contact.js";
import { AppError } from "../middleware/error.js";

export const submitMessage = async (req, res, next) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return next(new AppError("Please fill in all message details.", 400));
  }

  try {
    const newMessage = await Contact.create({
      name,
      email,
      message
    });

    res.status(201).json({
      status: "success",
      message: "Message received. Thank you for connecting!",
      data: newMessage
    });
  } catch (error) {
    next(error);
  }
};

export const getAllMessages = async (req, res, next) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: "success",
      results: messages.length,
      data: messages
    });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const message = await Contact.findById(req.params.id);
    if (!message) {
      return next(new AppError("No message found with that ID", 404));
    }

    message.isRead = true;
    await message.save();

    res.status(200).json({
      status: "success",
      data: message
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async (req, res, next) => {
  try {
    const message = await Contact.findByIdAndDelete(req.params.id);
    if (!message) {
      return next(new AppError("No message found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null
    });
  } catch (error) {
    next(error);
  }
};
