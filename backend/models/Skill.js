import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  category: { type: String, default: "Frontend" },
  categoryNum: { type: String, default: "01" },
  categoryTitle: { type: String, uppercase: true, trim: true },
  description: { type: String, default: "" },
  tags: [{ type: String }],
  icon: { type: String, default: "" }, // SVG string, Image URL, or Icon Name
  iconColor: { type: String, default: "#ffffff" },
  order: { type: Number, default: 0 },
  isEnabled: { type: Boolean, default: true }
}, { timestamps: true });

const Skill = mongoose.model("Skill", skillSchema);

export default Skill;
