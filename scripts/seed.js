const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

// Load .env.local variables
const envPath = path.join(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, "utf-8");
  envConfig.split("\n").forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || "";
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      }
      process.env[key] = value;
    }
  });
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI not found in env.local");
  process.exit(1);
}

// Inline model schemas
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, default: "admin" }
});

const HeroSchema = new mongoose.Schema({
  badgeText: String,
  titleLine1: String,
  titleLine2: String,
  titleLine3: String,
  subtitle: String,
  marqueeText: String
});

const AboutSchema = new mongoose.Schema({
  bioTitle: String,
  bioParagraph1: String,
  bioParagraph2: String,
  philosophyQuote: String,
  experience: Array
});

const SkillSchema = new mongoose.Schema({
  name: String,
  desc: String,
  order: Number
});

const ProjectSchema = new mongoose.Schema({
  num: String,
  title: String,
  description: String,
  image: String,
  stack: Array,
  demo: String,
  github: String,
  order: Number
});

const FooterSchema = new mongoose.Schema({
  copyrightText: String,
  showMonochromeBadge: Boolean,
  socialLinks: Array
});

const SiteSchema = new mongoose.Schema({
  metaTitle: String,
  metaDescription: String,
  favicon: String
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const HeroSection = mongoose.models.HeroSection || mongoose.model("HeroSection", HeroSchema);
const AboutSection = mongoose.models.AboutSection || mongoose.model("AboutSection", AboutSchema);
const Skill = mongoose.models.Skill || mongoose.model("Skill", SkillSchema);
const Project = mongoose.models.Project || mongoose.model("Project", ProjectSchema);
const FooterSettings = mongoose.models.FooterSettings || mongoose.model("FooterSettings", FooterSchema);
const SiteSettings = mongoose.models.SiteSettings || mongoose.model("SiteSettings", SiteSchema);

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB for seeding...");

  // 1. Seed Admin User
  await User.deleteMany({});
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await User.create({
    email: "admin@sinan.com",
    password: hashedPassword,
    name: "Sinan Admin",
    role: "admin"
  });
  console.log("Seeded default admin user: email=admin@sinan.com, password=admin123");

  // 2. Seed Hero Section
  await HeroSection.deleteMany({});
  await HeroSection.create({
    badgeText: "AVAILABLE FOR FREELANCE PROJECTS",
    titleLine1: "HI, I'M SINAN —",
    titleLine2: "A UI/UX DESIGNER &",
    titleLine3: "FRONTEND DEVELOPER",
    subtitle: "I DESIGN INTUITIVE DIGITAL EXPERIENCES AND BUILD MODERN, HIGH-PERFORMANCE WEBSITES USING REACT, NEXT.JS, AND THOUGHTFUL USER-CENTERED DESIGN.",
    marqueeText: "FIGMA • REACT • NEXT.JS • FRAMER MOTION • TAILWIND • UI/UX"
  });
  console.log("Seeded Hero Section content");

  // 3. Seed About Section
  await AboutSection.deleteMany({});
  await AboutSection.create({
    bioTitle: "ABOUT",
    bioParagraph1: "HI, I'M SINAN M. I AM A CREATIVE AND PASSIONATE UI/UX DESIGNER WITH A STRONG INTEREST IN FRONT-END DEVELOPMENT.",
    bioParagraph2: "I ENJOY CREATING INTUITIVE, USER-CENTERED DIGITAL EXPERIENCES AND BUILDING SIMPLE YET EFFECTIVE PROTOTYPES. CURRENTLY LEARNING REACT TO DEVELOP INTERACTIVE WEB APPLICATIONS.",
    philosophyQuote: "MY GOAL IS TO GROW AS A DESIGNER-DEVELOPER WHO CAN DESIGN AND BUILD FULLY FUNCTIONAL WEBSITES AND APPLICATIONS.",
    experience: [
      {
        role: "UI/UX DESIGNER & FRONT-END DEVELOPER (INTERN)",
        company: "FEBNO TECHNOLOGIES — MALAPPURAM",
        period: "10/2025 — PRESENT"
      }
    ]
  });
  console.log("Seeded About Section content");

  // 4. Seed Skills
  await Skill.deleteMany({});
  const initialSkills = [
    { name: "FIGMA", desc: "HIGH-FIDELITY WIREFRAMES, VECTOR LAYOUTS, DESIGN SYSTEM LIBRARIES, PROTOTYPING.", order: 1 },
    { name: "UI/UX DESIGN & USER RESEARCH", desc: "AESTHETIC WIREFRAMES, USER JOURNEY MAPS, PERSONAS, RESEARCH LOOPS.", order: 2 },
    { name: "WIREFRAMING & PROTOTYPING", desc: "INTERACTIVE PROTOTYPES, LOW-TO-HIGH FIDELITY WIREFRAMES, USER FLOWS.", order: 3 },
    { name: "VISUAL DESIGN & LAYOUT", desc: "BALANCED GRID SYSTEMS, VISUAL HIERARCHIES, SLEEK DARK/LIGHT LAYOUTS.", order: 4 },
    { name: "TYPOGRAPHY & COLOR THEORY", desc: "HARMONIOUS COLOR PALETTES, READABLE SIZING SCALES, FONT COMBINATIONS.", order: 5 },
    { name: "INFORMATION ARCHITECTURE", desc: "USER NAVIGATION FLOWS, SITEMAPS, SYSTEM FLOWCHARTS, DATA TAXONOMIES.", order: 6 },
    { name: "RESPONSIVE WEB DESIGN", desc: "FLEXIBLE RESPONSIVE LAYOUTS, MOBILE-FIRST DESIGN, GRID CONSTRAINTS.", order: 7 },
    { name: "HTML, CSS, JS, BOOTSTRAP, REACT", desc: "MODULAR INTERFACE LOGIC, STYLED WEB STRUCTURES, INTERACTIVE ELEMENTS.", order: 8 }
  ];
  await Skill.insertMany(initialSkills);
  console.log("Seeded Skills list");

  // 5. Seed Projects
  await Project.deleteMany({});
  const initialProjects = [
    {
      num: "01",
      title: "ZOUTE LUXURY FASHION",
      description: "A MINIMALIST E-COMMERCE EDITORIAL STOREFRONT FOR A HIGH-END FASHION HOUSE. FEATURES HIGH-ACCURACY TYPOGRAPHIC COMPOSITION, SMOOTH PARALLAX PRODUCT SCROLLING, AND ARCHIVAL COLLECTION NAVIGATION.",
      image: "/project1.png",
      stack: ["REACT", "NEXT.JS", "TAILWIND", "FRAMER MOTION"],
      demo: "https://demo.example.com",
      github: "https://github.com",
      order: 1
    },
    {
      num: "02",
      title: "VELLUM LUXURY FASHION",
      description: "A PREMIUM E-COMMERCE STOREFRONT FOR A LUXURY FASHION BRAND. BUILT WITH OPTIMIZED PRODUCT QUERY CACHING, IMAGE LAZY LOADING SYSTEMS, AND LAYOUT MICRO-INTERACTIONS TO EMPHASIZE HIGH-END PRODUCT PRESENTATION.",
      image: "/project2.png",
      stack: ["REACT", "FRAMER MOTION", "COMMERCE API", "TAILWIND"],
      demo: "https://demo.example.com",
      github: "https://github.com",
      order: 2
    },
    {
      num: "03",
      title: "SCRIBE AI WORKSPACE",
      description: "AN ADVANCED CHAT PLAYGROUND DASHBOARD FOR AI PROMPT ENGINEERING. INTEGRATED DYNAMIC MARKDOWN PARSERS, SESSION HISTORY CACHING, AND CUSTOM WORKSPACE PANELS FOR TESTING LARGE LANGUAGE MODEL OUTPUTS.",
      image: "/project3.png",
      stack: ["NEXT.JS", "TYPESCRIPT", "OPENAI", "CSS MODULES"],
      demo: "https://demo.example.com",
      github: "https://github.com",
      order: 3
    }
  ];
  await Project.insertMany(initialProjects);
  console.log("Seeded Projects list");

  // 6. Seed Footer Settings
  await FooterSettings.deleteMany({});
  await FooterSettings.create({
    copyrightText: "Sinan. All rights reserved.",
    showMonochromeBadge: true,
    socialLinks: [
      { label: "GitHub", url: "https://github.com" },
      { label: "LinkedIn", url: "https://linkedin.com" }
    ]
  });
  console.log("Seeded Footer settings");

  // 7. Seed Site Settings
  await SiteSettings.deleteMany({});
  await SiteSettings.create({
    metaTitle: "Sinan | UI/UX Designer & React Frontend Developer",
    metaDescription: "A dynamic premium monochrome portfolio for Sinan, designed in a strict ultra-minimal style using the Comic Neue font.",
    favicon: "/favicon.ico"
  });
  console.log("Seeded Site settings");

  console.log("Database seeded successfully!");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
