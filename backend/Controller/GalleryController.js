import dotenv from "dotenv";
dotenv.config();

import Gallary from "../Model/GalleryModel.js";
import cloudinary from "cloudinary";


// ==========================================
// CLOUDINARY CONFIGURATION
// ==========================================

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("Cloudinary Config:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? "YES" : "NO",
  api_secret: process.env.CLOUDINARY_API_SECRET ? "YES" : "NO",
});
// ==========================================
// ADD GALLERY
// ==========================================

export const uploadGallary = async (req, res) => {
  try {
    console.log("================================");
    console.log("GALLERY ADD API");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    console.log("================================");

    const { title, category, type } = req.body;

    if (!title || !category || !type) {
      return res.status(400).json({
        success: false,
        message: "Title, category and type are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    console.log("Uploading to Cloudinary...");

    const result = await cloudinary.v2.uploader.upload(
      req.file.path,
      {
        folder: "interior_design/gallery",
      }
    );

    console.log("Cloudinary URL:", result.secure_url);
    console.log("Cloudinary ID:", result.public_id);

    console.log("Saving to MongoDB...");

    const gallery = await Gallary.create({
      title,
      category,
      type,
      image: result.secure_url,
      cloudinary_id: result.public_id,
    });

    console.log("MONGODB SAVED:");
    console.log(gallery);

    return res.status(201).json({
      success: true,
      message: "Gallery added successfully",
      data: gallery,
    });

  } catch (error) {
    console.error("GALLERY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add gallery",
      error: error.message,
    });
  }
};
// ==========================================
// GET ALL GALLERY
// ==========================================

export const getGallary = async (
  req,
  res
) => {

  try {

    const gallery =
      await Gallary.find()
        .sort({
          createdAt: -1,
        });


    return res.status(200).json({

      success: true,

      message:
        "Gallery fetched successfully",

      data: gallery,

    });


  } catch (error) {

    console.error(
      "GET GALLERY ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch gallery",

      error: error.message,

    });

  }

};


// ==========================================
// GET SINGLE GALLERY
// ==========================================

export const getSingleGallary = async (
  req,
  res
) => {

  try {

    const { id } = req.params;


    const gallery =
      await Gallary.findById(id);


    if (!gallery) {

      return res.status(404).json({

        success: false,

        message:
          "Gallery image not found",

      });

    }


    return res.status(200).json({

      success: true,

      data: gallery,

    });


  } catch (error) {

    console.error(
      "GET SINGLE GALLERY ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch gallery",

      error: error.message,

    });

  }

};


// ==========================================
// UPDATE GALLERY
// ==========================================

export const updateGallary = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    const {
      title,
      category,
      type,
    } = req.body;


    const gallery =
      await Gallary.findById(id);


    if (!gallery) {

      return res.status(404).json({

        success: false,

        message:
          "Gallery image not found",

      });

    }


    gallery.title =
      title || gallery.title;

    gallery.category =
      category || gallery.category;

    gallery.type =
      type || gallery.type;


    // ==========================================
    // NEW IMAGE
    // ==========================================

    if (req.file) {

      // Delete old Cloudinary image

      if (gallery.cloudinary_id) {

        await cloudinary.v2.uploader.destroy(
          gallery.cloudinary_id
        );

      }


      // Upload new image

      const result =
        await cloudinary.v2.uploader.upload(
          req.file.path,
          {
            folder:
              "interior_design/gallery",
          }
        );


      gallery.image =
        result.secure_url;

      gallery.cloudinary_id =
        result.public_id;

    }


    await gallery.save();


    return res.status(200).json({

      success: true,

      message:
        "Gallery updated successfully",

      data: gallery,

    });


  } catch (error) {

    console.error(
      "UPDATE GALLERY ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to update gallery",

      error: error.message,

    });

  }

};


// ==========================================
// DELETE GALLERY
// ==========================================

export const deleteGallary = async (
  req,
  res
) => {

  try {

    const { id } = req.params;


    const gallery =
      await Gallary.findById(id);


    if (!gallery) {

      return res.status(404).json({

        success: false,

        message:
          "Gallery image not found",

      });

    }


    // ==========================================
    // DELETE CLOUDINARY IMAGE
    // ==========================================

    if (gallery.cloudinary_id) {

      await cloudinary.v2.uploader.destroy(
        gallery.cloudinary_id
      );

    }


    // ==========================================
    // DELETE MONGODB DATA
    // ==========================================

    await Gallary.findByIdAndDelete(id);


    return res.status(200).json({

      success: true,

      message:
        "Gallery deleted successfully",

    });


  } catch (error) {

    console.error(
      "DELETE GALLERY ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to delete gallery",

      error: error.message,

    });

  }

};