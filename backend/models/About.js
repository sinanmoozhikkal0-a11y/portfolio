import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema({
  bioTitle: { type: String, default: "ABOUT" },
  bioParagraph1: { type: String, required: true },
  bioParagraph2: { type: String, required: true },
  philosophyQuote: { type: String, required: true },
  yearsExperience: { type: Number, default: 2 },
  location: { type: String, default: "Malappuram, Kerala" },
  email: { type: String, default: "sinan@example.com" },
  phone: { type: String, default: "" },
  profileImage: { type: String, default: "/bw_about.png" }, // Upload OR URL
  resumeUrl: { type: String, default: "" },
  experienceTimeline: [{
    role: { type: String, required: true },
    company: { type: String, required: true },
    period: { type: String, required: true }
  }]
}, { timestamps: true });

const About = mongoose.model("About", aboutSchema);

export default About;
