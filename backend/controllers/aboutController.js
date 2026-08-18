import About from "../models/About.js";
import { processImageInput } from "../utils/imageHandler.js";

export const getAbout = async (req, res, next) => {
  try {
    let about = await About.findOne();
    if (!about) {
      about = await About.create({
        bioTitle: "ABOUT",
        bioParagraph1: "HI, I'M SINAN M. I AM A CREATIVE AND PASSIONATE UI/UX DESIGNER WITH A STRONG INTEREST IN FRONT-END DEVELOPMENT.",
        bioParagraph2: "I ENJOY CREATING INTUITIVE, USER-CENTERED DIGITAL EXPERIENCES AND BUILDING SIMPLE YET EFFECTIVE PROTOTYPES.",
        philosophyQuote: "MY GOAL IS TO GROW AS A DESIGNER-DEVELOPER WHO CAN DESIGN AND BUILD FULLY FUNCTIONAL WEBSITES AND APPLICATIONS."
      });
    }
    res.status(200).json({
      status: "success",
      data: about
    });
  } catch (error) {
    next(error);
  }
};

export const updateAbout = async (req, res, next) => {
  try {
    let about = await About.findOne();
    if (!about) {
      about = new About({});
    }

    const { 
      bioTitle, 
      bioParagraph1, 
      bioParagraph2, 
      philosophyQuote,
      yearsExperience,
      location,
      email,
      phone,
      profileImageUrl,
      resumeUrl,
      experienceTimeline
    } = req.body;

    // Dual-mode Profile Image processing
    let finalProfileImage = about.profileImage;
    if (req.files && req.files.profileImage && req.files.profileImage[0]) {
      req.file = req.files.profileImage[0];
      finalProfileImage = await processImageInput(req, "profileImage", "profileImageUrl", about.profileImage);
    } else if (profileImageUrl !== undefined) {
      finalProfileImage = profileImageUrl.trim();
    }

    // Dual-mode Resume PDF processing
    let finalResumeUrl = about.resumeUrl;
    if (req.files && req.files.resume && req.files.resume[0]) {
      finalResumeUrl = req.files.resume[0].path;
    } else if (resumeUrl !== undefined) {
      finalResumeUrl = resumeUrl.trim();
    }

    let parsedTimeline = about.experienceTimeline;
    if (experienceTimeline) {
      parsedTimeline = typeof experienceTimeline === "string" ? JSON.parse(experienceTimeline) : experienceTimeline;
    }

    about.bioTitle = bioTitle || about.bioTitle;
    about.bioParagraph1 = bioParagraph1 || about.bioParagraph1;
    about.bioParagraph2 = bioParagraph2 || about.bioParagraph2;
    about.philosophyQuote = philosophyQuote || about.philosophyQuote;
    about.yearsExperience = yearsExperience !== undefined ? Number(yearsExperience) : about.yearsExperience;
    about.location = location || about.location;
    about.email = email || about.email;
    about.phone = phone !== undefined ? phone : about.phone;
    about.profileImage = finalProfileImage;
    about.resumeUrl = finalResumeUrl;
    about.experienceTimeline = parsedTimeline;

    const updatedAbout = await about.save();

    res.status(200).json({
      status: "success",
      data: updatedAbout
    });
  } catch (error) {
    next(error);
  }
};
