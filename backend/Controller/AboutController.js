import dotenv from "dotenv";
dotenv.config();

import AboutModel from "../Model/AboutModel.js";
import cloudinary from "cloudinary";

// ======================================================
// CLOUDINARY CONFIGURATION
// ======================================================

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("Cloudinary Config:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY
    ? "YES"
    : "NO",
  api_secret: process.env.CLOUDINARY_API_SECRET
    ? "YES"
    : "NO",
});

// ======================================================
// ADD ABOUT
// ======================================================

export const addAbout = async (req, res) => {
  try {
    console.log("================================");
    console.log("ABOUT ADD API");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    console.log("================================");

    const {
      title,
      subtitle,
      description,
      experience,
      projects,
      clients,
      status,
    } = req.body;

    // ==================================================
    // VALIDATION
    // ==================================================

    if (!title || !subtitle || !description) {
      return res.status(400).json({
        success: false,
        message:
          "Title, subtitle and description are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "About image is required",
      });
    }

    // ==================================================
    // UPLOAD IMAGE TO CLOUDINARY
    // ==================================================

    console.log("Uploading About image to Cloudinary...");

    const result = await cloudinary.v2.uploader.upload(
      req.file.path,
      {
        folder: "interior_design/about",
      }
    );

    console.log(
      "Cloudinary URL:",
      result.secure_url
    );

    console.log(
      "Cloudinary ID:",
      result.public_id
    );

    // ==================================================
    // SAVE DATA TO MONGODB
    // ==================================================

    const about = await AboutModel.create({
      title,
      subtitle,
      description,
      experience: experience || "",
      projects: projects || "",
      clients: clients || "",
      image: result.secure_url,
      cloudinary_id: result.public_id,
      status: status || "active",
    });

    console.log("ABOUT SAVED:");
    console.log(about);

    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(201).json({
      success: true,
      message: "About added successfully",
      data: about,
    });

  } catch (error) {
    console.error("ABOUT ADD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add About",
      error: error.message,
    });
  }
};

// ======================================================
// GET ALL ABOUT
// ======================================================

export const getAbout = async (req, res) => {
  try {
    console.log("================================");
    console.log("GET ABOUT API");
    console.log("================================");

    const about = await AboutModel.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      message: "About fetched successfully",
      count: about.length,
      data: about,
    });

  } catch (error) {
    console.error("GET ABOUT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch About",
      error: error.message,
    });
  }
};

// ======================================================
// GET ACTIVE ABOUT
// ======================================================

export const getActiveAbout = async (req, res) => {
  try {
    console.log("================================");
    console.log("GET ACTIVE ABOUT API");
    console.log("================================");

    const about = await AboutModel.findOne({
      status: "active",
    }).sort({
      createdAt: -1,
    });

    if (!about) {
      return res.status(404).json({
        success: false,
        message: "No active About data found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Active About fetched successfully",
      data: about,
    });

  } catch (error) {
    console.error(
      "GET ACTIVE ABOUT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch active About",
      error: error.message,
    });
  }
};

// ======================================================
// GET SINGLE ABOUT
// ======================================================

export const getAboutById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Getting About ID:", id);

    const about = await AboutModel.findById(id);

    if (!about) {
      return res.status(404).json({
        success: false,
        message: "About data not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "About fetched successfully",
      data: about,
    });

  } catch (error) {
    console.error(
      "GET SINGLE ABOUT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch About",
      error: error.message,
    });
  }
};

// ======================================================
// UPDATE ABOUT
// ======================================================

export const updateAbout = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("================================");
    console.log("UPDATE ABOUT API");
    console.log("ID:", id);
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    console.log("================================");

    const {
      title,
      subtitle,
      description,
      experience,
      projects,
      clients,
      status,
    } = req.body;

    // ==================================================
    // FIND ABOUT
    // ==================================================

    const about = await AboutModel.findById(id);

    if (!about) {
      return res.status(404).json({
        success: false,
        message: "About data not found",
      });
    }

    // ==================================================
    // UPDATE TEXT DATA
    // ==================================================

    about.title = title || about.title;

    about.subtitle =
      subtitle || about.subtitle;

    about.description =
      description || about.description;

    about.experience =
      experience !== undefined
        ? experience
        : about.experience;

    about.projects =
      projects !== undefined
        ? projects
        : about.projects;

    about.clients =
      clients !== undefined
        ? clients
        : about.clients;

    about.status =
      status || about.status;

    // ==================================================
    // UPDATE IMAGE
    // ==================================================

    if (req.file) {

      console.log(
        "New About image found"
      );

      // ----------------------------------------------
      // DELETE OLD CLOUDINARY IMAGE
      // ----------------------------------------------

      if (about.cloudinary_id) {

        console.log(
          "Deleting old Cloudinary image:",
          about.cloudinary_id
        );

        try {

          const deleteResult =
            await cloudinary.v2.uploader.destroy(
              about.cloudinary_id
            );

          console.log(
            "Old Cloudinary delete result:",
            deleteResult
          );

        } catch (deleteError) {

          console.error(
            "Old Cloudinary delete error:",
            deleteError.message
          );

        }
      }

      // ----------------------------------------------
      // UPLOAD NEW IMAGE
      // ----------------------------------------------

      console.log(
        "Uploading new About image..."
      );

      const result =
        await cloudinary.v2.uploader.upload(
          req.file.path,
          {
            folder:
              "interior_design/about",
          }
        );

      console.log(
        "New Cloudinary URL:",
        result.secure_url
      );

      console.log(
        "New Cloudinary ID:",
        result.public_id
      );

      // ----------------------------------------------
      // SAVE NEW CLOUDINARY DATA
      // ----------------------------------------------

      about.image =
        result.secure_url;

      about.cloudinary_id =
        result.public_id;
    }

    // ==================================================
    // SAVE
    // ==================================================

    await about.save();

    console.log(
      "ABOUT UPDATED:",
      about
    );

    return res.status(200).json({
      success: true,
      message: "About updated successfully",
      data: about,
    });

  } catch (error) {

    console.error(
      "UPDATE ABOUT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update About",
      error: error.message,
    });
  }
};

// ======================================================
// DELETE ABOUT
// ======================================================

export const deleteAbout = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("================================");
    console.log("DELETE ABOUT API");
    console.log("ID:", id);
    console.log("================================");

    // ==================================================
    // FIND ABOUT
    // ==================================================

    const about = await AboutModel.findById(id);

    if (!about) {
      return res.status(404).json({
        success: false,
        message: "About data not found",
      });
    }

    // ==================================================
    // DELETE CLOUDINARY IMAGE
    // ==================================================

    if (about.cloudinary_id) {

      console.log(
        "Deleting Cloudinary image:",
        about.cloudinary_id
      );

      try {

        const deleteResult =
          await cloudinary.v2.uploader.destroy(
            about.cloudinary_id
          );

        console.log(
          "Cloudinary delete result:",
          deleteResult
        );

      } catch (deleteError) {

        console.error(
          "Cloudinary delete error:",
          deleteError.message
        );
      }
    }

    // ==================================================
    // DELETE MONGODB DATA
    // ==================================================

    await AboutModel.findByIdAndDelete(id);

    console.log(
      "About deleted from MongoDB"
    );

    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(200).json({
      success: true,
      message: "About deleted successfully",
    });

  } catch (error) {

    console.error(
      "DELETE ABOUT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete About",
      error: error.message,
    });
  }
};