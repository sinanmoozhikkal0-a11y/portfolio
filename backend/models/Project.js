import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  num: { type: String, default: "01" },
  title: { type: String, required: [true, "Project title is required"], uppercase: true, trim: true },
  description: { type: String, required: [true, "Short description is required"] },
  fullDescription: { type: String, default: "" },
  role: { type: String, default: "Full Stack Developer" },
  category: { type: String, default: "UI/UX & Web Development" },
  stack: [{ type: String }],
  features: [{ type: String }],
  challenges: { type: String, default: "" },
  solutions: { type: String, default: "" },
  duration: { type: String, default: "3 Months" },
  outcome: { type: String, default: "High Engagement" },
  status: { type: String, default: "Completed" },
  demo: { type: String, default: "" },
  github: { type: String, default: "" },
  figma: { type: String, default: "" },
  caseStudyLink: { type: String, default: "" },
  order: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: true },
  image: { 
    type: String, 
    default: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80" 
  },
  banner: { type: String, default: "" },
  mockups: [{ type: String }]
}, { timestamps: true });

const Project = mongoose.model("Project", projectSchema);

export default Project;
