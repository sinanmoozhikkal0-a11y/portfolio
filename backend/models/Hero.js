import mongoose from "mongoose";

const heroSchema = new mongoose.Schema({
  heading: { type: String, default: "HI, I'M SINAN —" },
  highlightText: { type: String, default: "A UI/UX DESIGNER & FRONTEND DEVELOPER" },
  description: { 
    type: String, 
    default: "I DESIGN INTUITIVE DIGITAL EXPERIENCES AND BUILD MODERN, HIGH-PERFORMANCE WEBSITES USING REACT, JAVASCRIPT, AND THOUGHTFUL USER-CENTERED DESIGN." 
  },
  marqueeText: {
    type: String,
    default: "FIGMA • REACT • JAVASCRIPT • FRAMER MOTION • TAILWIND • UI/UX"
  },
  badgeText: {
    type: String,
    default: "AVAILABLE FOR FREELANCE PROJECTS"
  },
  cta1Text: { type: String, default: "EXPLORE WORK" },
  cta1Link: { type: String, default: "#projects" },
  cta2Text: { type: String, default: "GET IN TOUCH" },
  cta2Link: { type: String, default: "#contact" },
  image: { type: String, default: "" }, // Upload OR URL
  resumeUrl: { type: String, default: "" } // PDF file URL
}, { timestamps: true });

const Hero = mongoose.model("Hero", heroSchema);

export default Hero;
