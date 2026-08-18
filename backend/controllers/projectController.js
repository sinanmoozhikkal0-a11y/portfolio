import mongoose from "mongoose";
import Project from "../models/Project.js";
import { cloudinary } from "../config/cloudinary.js";

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80";

const FALLBACK_PROJECTS = [
  {
    _id: "p1",
    num: "01",
    title: "PUNTO PAGO ECOSYSTEM",
    description: "Building a connected ecosystem where discovering, learning and buying digital financial services feels effortless.",
    image: "/project4.png",
    stack: ["REACT", "TAILWIND", "FINTECH API"],
    demo: "https://demo.example.com",
    github: "https://github.com",
    role: "Lead UI/UX Designer & Engineer",
    duration: "3 Months (Q2 2025)",
    outcome: "+55% active user engagement"
  },
  {
    _id: "p2",
    num: "02",
    title: "VERDANT REAL ESTATE",
    description: "Building a complete luxury real estate brand, high-rise architectural presentation, and digital experience.",
    image: "/project2.png",
    stack: ["NEXT.JS", "FRAMER MOTION", "THREE.JS"],
    demo: "https://demo.example.com",
    github: "https://github.com",
    role: "UI/UX Designer & Dev",
    duration: "2 Months (Q4 2025)",
    outcome: "+40% property inquiry conversion"
  },
  {
    _id: "p3",
    num: "03",
    title: "ZOUTE LUXURY FASHION",
    description: "A minimalist e-commerce editorial storefront for a high-end fashion house with high-accuracy typographic composition.",
    image: "/project1.png",
    stack: ["REACT", "TAILWIND", "FRAMER MOTION"],
    demo: "https://demo.example.com",
    github: "https://github.com",
    role: "Lead Frontend Engineer",
    duration: "3 Months (Q1 2026)",
    outcome: "+45% collection dwell time"
  },
  {
    _id: "p4",
    num: "04",
    title: "SCRIBE AI WORKSPACE",
    description: "An advanced chat playground dashboard for AI prompt engineering with dynamic markdown parsing and split views.",
    image: "/project3.png",
    stack: ["REACT", "TYPESCRIPT", "OPENAI"],
    demo: "https://demo.example.com",
    github: "https://github.com",
    role: "Full-Stack UX Engineer",
    duration: "4 Months (Q2 2026)",
    outcome: "Fluid multi-view split panes"
  }
];

const getPublicIdFromUrl = (url) => {
  if (!url || !url.includes("res.cloudinary.com")) return null;
  try {
    const parts = url.split("/");
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) return null;
    const relativeParts = parts.slice(uploadIndex + 2);
    const fileWithExtension = relativeParts.join("/");
    return fileWithExtension.split(".")[0];
  } catch (err) {
    return null;
  }
};

export const getAllProjects = async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(200).json({
      success: true,
      status: "success",
      results: FALLBACK_PROJECTS.length,
      data: FALLBACK_PROJECTS
    });
  }

  try {
    const projects = await Project.find({}).sort({ order: 1, createdAt: -1 });
    return res.status(200).json({
      success: true,
      status: "success",
      results: projects.length > 0 ? projects.length : FALLBACK_PROJECTS.length,
      data: projects.length > 0 ? projects : FALLBACK_PROJECTS
    });
  } catch (error) {
    return res.status(200).json({
      success: true,
      status: "success",
      results: FALLBACK_PROJECTS.length,
      data: FALLBACK_PROJECTS
    });
  }
};

export const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "No project found with that ID"
      });
    }
    return res.status(200).json({
      success: true,
      status: "success",
      data: project
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve project."
    });
  }
};

export const createProject = async (req, res, next) => {
  try {
    const { 
      num, title, description, fullDescription, role, category, 
      stack, features, challenges, solutions, duration, outcome, 
      status, demo, github, figma, caseStudyLink, order, isFeatured,
      imageUrl, bannerUrl, mockupUrls 
    } = req.body || {};

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Please provide both Project Title and Short Description."
      });
    }

    // Dual-mode Image Thumbnail
    let finalImage = "";
    if (req.files && req.files.image && req.files.image[0]) {
      finalImage = req.files.image[0].path;
    } else if (imageUrl && String(imageUrl).trim() !== "") {
      finalImage = String(imageUrl).trim();
    }
    if (!finalImage) {
      finalImage = DEFAULT_IMAGE;
    }

    // Dual-mode Banner Image
    let finalBanner = "";
    if (req.files && req.files.banner && req.files.banner[0]) {
      finalBanner = req.files.banner[0].path;
    } else if (bannerUrl) {
      finalBanner = String(bannerUrl).trim();
    }

    // Dual-mode Mockups
    let finalMockups = [];
    if (req.files && req.files.mockups) {
      finalMockups = req.files.mockups.map(f => f.path);
    }
    if (mockupUrls) {
      const parsedUrls = typeof mockupUrls === "string" ? mockupUrls.split(",").map(u => u.trim()).filter(Boolean) : mockupUrls;
      finalMockups = [...finalMockups, ...parsedUrls];
    }

    const parsedStack = typeof stack === "string" ? stack.split(",").map(s => s.trim()).filter(Boolean) : (Array.isArray(stack) ? stack : []);
    const parsedFeatures = typeof features === "string" ? features.split(",").map(f => f.trim()).filter(Boolean) : (Array.isArray(features) ? features : []);

    const newProject = await Project.create({
      num: num || "01",
      title: String(title).toUpperCase().trim(),
      description,
      fullDescription: fullDescription || "",
      role: role || "Lead UI/UX Designer & Dev",
      category: category || "UI/UX & Web Development",
      stack: parsedStack,
      features: parsedFeatures,
      challenges: challenges || "",
      solutions: solutions || "",
      duration: duration || "3 Months",
      outcome: outcome || "High Dwell Time",
      status: status || "Completed",
      demo: demo || "",
      github: github || "",
      figma: figma || "",
      caseStudyLink: caseStudyLink || "",
      order: order ? Number(order) : 0,
      isFeatured: isFeatured !== undefined ? (isFeatured === "true" || isFeatured === true) : true,
      image: finalImage,
      banner: finalBanner,
      mockups: finalMockups
    });

    return res.status(201).json({
      success: true,
      status: "success",
      data: newProject
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create new project."
    });
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "No project found with that ID"
      });
    }

    const { 
      num, title, description, fullDescription, role, category, 
      stack, features, challenges, solutions, duration, outcome, 
      status, demo, github, figma, caseStudyLink, order, isFeatured,
      imageUrl, bannerUrl, mockupUrls 
    } = req.body || {};

    let finalImage = project.image;
    if (req.files && req.files.image && req.files.image[0]) {
      finalImage = req.files.image[0].path;
    } else if (imageUrl !== undefined && String(imageUrl).trim() !== "") {
      finalImage = String(imageUrl).trim();
    }
    if (!finalImage) {
      finalImage = DEFAULT_IMAGE;
    }

    let finalBanner = project.banner;
    if (req.files && req.files.banner && req.files.banner[0]) {
      finalBanner = req.files.banner[0].path;
    } else if (bannerUrl !== undefined) {
      finalBanner = String(bannerUrl).trim();
    }

    let finalMockups = project.mockups || [];
    if (req.files && req.files.mockups && req.files.mockups.length > 0) {
      const uploadedMockups = req.files.mockups.map(f => f.path);
      finalMockups = [...finalMockups, ...uploadedMockups];
    }
    if (mockupUrls !== undefined) {
      const parsedUrls = typeof mockupUrls === "string" ? mockupUrls.split(",").map(u => u.trim()).filter(Boolean) : mockupUrls;
      if (Array.isArray(parsedUrls)) {
        finalMockups = parsedUrls;
      }
    }

    const parsedStack = typeof stack === "string" ? stack.split(",").map(s => s.trim()).filter(Boolean) : (Array.isArray(stack) ? stack : project.stack);
    const parsedFeatures = typeof features === "string" ? features.split(",").map(f => f.trim()).filter(Boolean) : (Array.isArray(features) ? features : project.features);

    project.num = num || project.num;
    project.title = title ? String(title).toUpperCase().trim() : project.title;
    project.description = description || project.description;
    project.fullDescription = fullDescription !== undefined ? fullDescription : project.fullDescription;
    project.role = role || project.role;
    project.category = category || project.category;
    project.stack = parsedStack;
    project.features = parsedFeatures;
    project.challenges = challenges !== undefined ? challenges : project.challenges;
    project.solutions = solutions !== undefined ? solutions : project.solutions;
    project.duration = duration || project.duration;
    project.outcome = outcome || project.outcome;
    project.status = status || project.status;
    project.demo = demo !== undefined ? demo : project.demo;
    project.github = github !== undefined ? github : project.github;
    project.figma = figma !== undefined ? figma : project.figma;
    project.caseStudyLink = caseStudyLink !== undefined ? caseStudyLink : project.caseStudyLink;
    project.order = order !== undefined ? Number(order) : project.order;
    project.isFeatured = isFeatured !== undefined ? (isFeatured === "true" || isFeatured === true) : project.isFeatured;
    project.image = finalImage;
    project.banner = finalBanner;
    project.mockups = finalMockups;

    const updatedProject = await project.save();

    return res.status(200).json({
      success: true,
      status: "success",
      data: updatedProject
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update project."
    });
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "No project found with that ID"
      });
    }

    const publicId = getPublicIdFromUrl(project.image);
    if (publicId) {
      cloudinary.uploader.destroy(publicId).catch(err => {});
    }

    await Project.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      status: "success",
      message: "Project deleted successfully.",
      data: null
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete project."
    });
  }
};
