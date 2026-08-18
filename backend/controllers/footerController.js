import Footer from "../models/Footer.js";

const defaultSocials = [
  { platform: "GitHub", url: "https://github.com", icon: "github", isEnabled: true, openInNewTab: true, order: 1 },
  { platform: "LinkedIn", url: "https://linkedin.com", icon: "linkedin", isEnabled: true, openInNewTab: true, order: 2 },
  { platform: "Instagram", url: "https://instagram.com", icon: "instagram", isEnabled: true, openInNewTab: true, order: 3 },
  { platform: "Behance", url: "https://behance.net", icon: "behance", isEnabled: false, openInNewTab: true, order: 4 },
  { platform: "Dribbble", url: "https://dribbble.com", icon: "dribbble", isEnabled: false, openInNewTab: true, order: 5 },
  { platform: "Twitter/X", url: "https://x.com", icon: "twitter", isEnabled: false, openInNewTab: true, order: 6 }
];

export const getFooter = async (req, res, next) => {
  try {
    let footer = await Footer.findOne();
    if (!footer) {
      footer = await Footer.create({
        socials: defaultSocials
      });
    }
    res.status(200).json({
      status: "success",
      data: footer
    });
  } catch (error) {
    next(error);
  }
};

export const updateFooter = async (req, res, next) => {
  try {
    let footer = await Footer.findOne();
    if (!footer) {
      footer = new Footer({});
    }

    const { 
      copyrightText, 
      description, 
      email, 
      phone, 
      location, 
      workingHours, 
      googleMapsUrl, 
      contactButtonText, 
      socials 
    } = req.body;

    let parsedSocials = footer.socials;
    if (socials) {
      parsedSocials = typeof socials === "string" ? JSON.parse(socials) : socials;
    }

    footer.copyrightText = copyrightText || footer.copyrightText;
    footer.description = description || footer.description;
    footer.email = email || footer.email;
    footer.phone = phone || footer.phone;
    footer.location = location || footer.location;
    footer.workingHours = workingHours || footer.workingHours;
    footer.googleMapsUrl = googleMapsUrl !== undefined ? googleMapsUrl : footer.googleMapsUrl;
    footer.contactButtonText = contactButtonText || footer.contactButtonText;
    footer.socials = parsedSocials;

    const updatedFooter = await footer.save();

    res.status(200).json({
      status: "success",
      data: updatedFooter
    });
  } catch (error) {
    next(error);
  }
};
