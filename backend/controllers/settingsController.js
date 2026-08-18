import Admin from "../models/Admin.js";
import Project from "../models/Project.js";
import Skill from "../models/Skill.js";
import Contact from "../models/Contact.js";
import Media from "../models/Media.js";

export const getSettings = async (req, res, next) => {
  try {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access. Please log in."
      });
    }

    const admin = await Admin.findById(req.admin._id).select("-password");
    
    let totalProjects = 0;
    let totalSkills = 0;
    let unreadMessages = 0;
    let totalMedia = 0;

    try { totalProjects = await Project.countDocuments(); } catch (e) {}
    try { totalSkills = await Skill.countDocuments(); } catch (e) {}
    try { unreadMessages = await Contact.countDocuments({ isRead: false }); } catch (e) {}
    try { totalMedia = await Media.countDocuments(); } catch (e) {}

    return res.status(200).json({
      success: true,
      status: "success",
      data: {
        admin: admin || { username: req.admin.username },
        stats: {
          totalProjects,
          totalSkills,
          unreadMessages,
          totalMedia
        }
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve dashboard settings."
    });
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access."
      });
    }

    const { username, currentPassword, newPassword } = req.body || {};
    
    const admin = await Admin.findById(req.admin._id).select("+password");
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin account not found."
      });
    }

    if (username) {
      admin.username = username.trim().toLowerCase();
    }

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: "Please provide your current password to change it."
        });
      }
      
      const isMatch = await admin.comparePassword(currentPassword, admin.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Current password is incorrect."
        });
      }

      admin.password = newPassword;
    }

    await admin.save();

    return res.status(200).json({
      success: true,
      status: "success",
      message: "Admin credentials updated successfully.",
      data: {
        username: admin.username
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update admin credentials."
    });
  }
};
