import mongoose from "mongoose";

const footerSchema = new mongoose.Schema({
  copyrightText: { type: String, default: "SINAN M. ALL RIGHTS RESERVED. | MONOCHROME PORTFOLIO" },
  description: { type: String, default: "CRAFTING INTUITIVE INTERFACES & PERFORMANCE ARCHITECTURES FROM SYSTEM TO SCREEN." },
  email: { type: String, default: "sinan@example.com" },
  phone: { type: String, default: "+91 9876543210" },
  location: { type: String, default: "Malappuram, Kerala, India" },
  workingHours: { type: String, default: "Mon - Fri: 9am - 6pm IST" },
  googleMapsUrl: { type: String, default: "" },
  contactButtonText: { type: String, default: "LET'S TALK" },
  socials: [{
    platform: { type: String, required: true }, // GitHub, LinkedIn, Instagram, Behance, Dribbble, Twitter, Facebook, YouTube, Threads, Medium
    url: { type: String, default: "" },
    icon: { type: String, default: "" },
    isEnabled: { type: Boolean, default: true },
    openInNewTab: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
  }]
}, { timestamps: true });

const Footer = mongoose.model("Footer", footerSchema);

export default Footer;
