import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  url: { type: String, required: true },
  publicId: { type: String, default: "" },
  size: { type: Number, default: 0 },
  format: { type: String, default: "image" }
}, { timestamps: true });

const Media = mongoose.model("Media", mediaSchema);

export default Media;
