import mongoose from "mongoose";
import Hero from "../models/Hero.js";
import { processImageInput } from "../utils/imageHandler.js";

const FALLBACK_HERO = {
  heading: "CREATIVE DEVELOPER & UI/UX DESIGNER",
  highlightText: "SINAN M",
  description: "CRAFTING HIGH-IMPACT DIGITAL EXPERIENCES, INTERACTIVE WEB PLATFORMS, AND EDITORIAL DESIGN SYSTEMS WITH UNCOMPROMISING PRECISION.",
  marqueeText: "UI/UX DESIGN • FULL-STACK DEVELOPMENT • MOTION GRAPHICS • EDITORIAL LAYOUTS • BRAND IDENTITY • ",
  badgeText: "AVAILABLE FOR FREELANCE & FULL-TIME ROLES",
  cta1Text: "VIEW PROJECTS",
  cta1Link: "#projects",
  cta2Text: "CONTACT ME",
  cta2Link: "#contact",
  image: "/hero-avatar.png",
  resumeUrl: "/resume.pdf"
};

export const getHero = async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(200).json({
      status: "success",
      data: FALLBACK_HERO
    });
  }

  try {
    let hero = await Hero.findOne();
    if (!hero) {
      hero = FALLBACK_HERO;
    }
    res.status(200).json({
      status: "success",
      data: hero
    });
  } catch (error) {
    res.status(200).json({
      status: "success",
      data: FALLBACK_HERO
    });
  }
};

export const updateHero = async (req, res, next) => {
  try {
    let hero = await Hero.findOne();
    if (!hero) {
      hero = new Hero({});
    }

    const { 
      heading, 
      highlightText, 
      description, 
      marqueeText, 
      badgeText, 
      cta1Text, 
      cta1Link, 
      cta2Text, 
      cta2Link,
      imageUrl,
      resumeFileUrl
    } = req.body;

    // Dual mode handling for Hero image
    let finalImageUrl = hero.image;
    if (req.files && req.files.image && req.files.image[0]) {
      req.file = req.files.image[0];
      finalImageUrl = await processImageInput(req, "image", "imageUrl", hero.image);
    } else if (imageUrl !== undefined) {
      finalImageUrl = imageUrl.trim();
    }

    // Dual mode handling for Resume PDF
    let finalResumeUrl = hero.resumeUrl;
    if (req.files && req.files.resume && req.files.resume[0]) {
      finalResumeUrl = req.files.resume[0].path;
    } else if (resumeFileUrl !== undefined) {
      finalResumeUrl = resumeFileUrl.trim();
    }

    hero.heading = heading || hero.heading;
    hero.highlightText = highlightText || hero.highlightText;
    hero.description = description || hero.description;
    hero.marqueeText = marqueeText || hero.marqueeText;
    hero.badgeText = badgeText || hero.badgeText;
    hero.cta1Text = cta1Text || hero.cta1Text;
    hero.cta1Link = cta1Link || hero.cta1Link;
    hero.cta2Text = cta2Text || hero.cta2Text;
    hero.cta2Link = cta2Link || hero.cta2Link;
    hero.image = finalImageUrl;
    hero.resumeUrl = finalResumeUrl;

    const updatedHero = await hero.save();

    res.status(200).json({
      status: "success",
      data: updatedHero
    });
  } catch (error) {
    next(error);
  }
};
