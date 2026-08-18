import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Sender name is required"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "Sender email address is required"],
    lowercase: true,
    trim: true
  },
  message: {
    type: String,
    required: [true, "Inquiry message body is required"]
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
