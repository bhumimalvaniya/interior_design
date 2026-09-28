
import Services from "../Model/ServiceModel.js";
import cloudinary from "../Utils/Cloudinary.js";
import fs from "fs";
import mongoose from "mongoose";

// ==========================================
// ADD SERVICE
// ==========================================

export const addServices = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);
    console.log("REQ FILE:", req.file);

    const {
      section,
      number,
      title,
      subtitle,
      description,
      link,
      status,
    } = req.body;

    // ======================================
    // VALIDATION
    // ======================================

    if (!section || !title) {
      return res.status(400).json({
        success: false,
        message: "Section and title are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Service image is required",
      });
    }

    // ======================================
    // UPLOAD IMAGE TO CLOUDINARY
    // ======================================

    console.log(
      "Uploading image to Cloudinary..."
    );

    const uploadResult =
      await cloudinary.uploader.upload(
        req.file.path,
        {
          folder: "services",
        }
      );

    console.log(
      "Cloudinary URL:",
      uploadResult.secure_url
    );

    // ======================================
    // DELETE TEMPORARY LOCAL FILE
    // ======================================

    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    // ======================================
    // SAVE DATA IN MONGODB
    // ======================================

    const service = await Services.create({
      section,
      number: number || "",
      title,
      subtitle: subtitle || "",
      description: description || "",

      // Cloudinary URL stored in MongoDB
      image: uploadResult.secure_url,

      link: link || "",
      status: status || "active",
    });

    console.log(
      "SERVICE SAVED:",
      service
    );

    // ======================================
    // RESPONSE
    // ======================================

    return res.status(201).json({
      success: true,
      message: "Service added successfully",
      data: service,
    });

  } catch (error) {

    console.error(
      "ADD SERVICES ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// ==========================================
// FETCH ALL SERVICES
// ==========================================

export const getServices = async (req, res) => {
  try {

    const services = await Services.find()
      .sort({
        createdAt: -1,
      });

    console.log(
      "SERVICES FROM DB:",
      services
    );

    return res.status(200).json({
      success: true,
      message: "Services data fetched successfully",
      data: services,
    });

  } catch (error) {

    console.error(
      "FETCH SERVICES ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// ==========================================
// UPDATE SERVICE
// ==========================================

export const updateServices = async (req, res) => {
  try {
    console.log("UPDATE SERVICE ID:", req.params.id);
    console.log("UPDATE REQ BODY:", req.body);
    console.log("UPDATE REQ FILE:", req.file);

    const { id } = req.params;

    // ======================================
    // CHECK MONGODB ID
    // ======================================

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID",
      });
    }

    // ======================================
    // FIND EXISTING SERVICE
    // ======================================

    const existingService = await Services.findById(id);

    if (!existingService) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    // ======================================
    // GET FORM DATA
    // ======================================

    const {
      section,
      number,
      title,
      subtitle,
      description,
      link,
      status,
    } = req.body;

    // ======================================
    // VALIDATION
    // ======================================

    if (!section || !title) {
      return res.status(400).json({
        success: false,
        message: "Section and title are required",
      });
    }

    // ======================================
    // UPDATE DATA
    // ======================================

    const updateData = {
      section,
      number: number || "",
      title,
      subtitle: subtitle || "",
      description: description || "",
      link: link || "",
      status: status || "active",
    };

    // ======================================
    // IF NEW IMAGE IS SELECTED
    // ======================================

    if (req.file) {
      console.log("New image received");

      // Upload new image to Cloudinary
      const uploadResult =
        await cloudinary.uploader.upload(
          req.file.path,
          {
            folder: "services",
          }
        );

      console.log(
        "NEW CLOUDINARY URL:",
        uploadResult.secure_url
      );

      // Save new image URL
      updateData.image = uploadResult.secure_url;

      // ====================================
      // DELETE TEMPORARY LOCAL FILE
      // ====================================

      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      // ====================================
      // DELETE OLD CLOUDINARY IMAGE
      // ====================================

      if (existingService.image) {
        try {
          // Extract public_id from old Cloudinary URL
          const urlParts =
            existingService.image.split("/upload/");

          if (urlParts.length > 1) {
            let publicIdWithExtension =
              urlParts[1];

            // Remove version
            publicIdWithExtension =
              publicIdWithExtension.replace(
                /^v\d+\//,
                ""
              );

            // Remove extension
            const publicId =
              publicIdWithExtension.replace(
                /\.[^/.]+$/,
                ""
              );

            console.log(
              "OLD CLOUDINARY PUBLIC ID:",
              publicId
            );

            await cloudinary.uploader.destroy(
              publicId
            );

            console.log(
              "OLD CLOUDINARY IMAGE DELETED"
            );
          }
        } catch (cloudinaryError) {
          console.error(
            "OLD CLOUDINARY DELETE ERROR:",
            cloudinaryError.message
          );
        }
      }
    }

    // ======================================
    // UPDATE MONGODB
    // ======================================

    const updatedService =
      await Services.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

    console.log(
      "SERVICE UPDATED:",
      updatedService
    );

    // ======================================
    // RESPONSE
    // ======================================

    return res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: updatedService,
    });

  } catch (error) {
    console.error(
      "UPDATE SERVICES ERROR:",
      error
    );

    // Delete temporary file if an error occurs
    if (req.file?.path) {
      try {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      } catch (fileError) {
        console.error(
          "TEMP FILE DELETE ERROR:",
          fileError.message
        );
      }
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// ==========================================
// DELETE SERVICE
// ==========================================

export const deleteServices = async (req, res) => {
  try {
    console.log(
      "DELETE SERVICE ID:",
      req.params.id
    );

    const { id } = req.params;

    // ======================================
    // CHECK MONGODB ID
    // ======================================

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID",
      });
    }

    // ======================================
    // FIND SERVICE
    // ======================================

    const service = await Services.findById(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    // ======================================
    // DELETE CLOUDINARY IMAGE
    // ======================================

    if (service.image) {
      try {
        // Example Cloudinary URL:
        // https://res.cloudinary.com/xxx/image/upload/v123/services/abc.jpg

        const urlParts =
          service.image.split("/upload/");

        if (urlParts.length > 1) {
          let publicIdWithExtension =
            urlParts[1];

          // Remove version
          publicIdWithExtension =
            publicIdWithExtension.replace(
              /^v\d+\//,
              ""
            );

          // Remove extension
          const publicId =
            publicIdWithExtension.replace(
              /\.[^/.]+$/,
              ""
            );

          console.log(
            "CLOUDINARY PUBLIC ID:",
            publicId
          );

          await cloudinary.uploader.destroy(
            publicId
          );

          console.log(
            "CLOUDINARY IMAGE DELETED"
          );
        }
      } catch (cloudinaryError) {
        console.error(
          "CLOUDINARY DELETE ERROR:",
          cloudinaryError.message
        );
      }
    }

    // ======================================
    // DELETE FROM MONGODB
    // ======================================

    await Services.findByIdAndDelete(id);

    console.log(
      "SERVICE DELETED FROM DATABASE:",
      id
    );

    // ======================================
    // RESPONSE
    // ======================================

    return res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });

  } catch (error) {
    console.error(
      "DELETE SERVICES ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getSingleServices = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Services.findById(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Service fetched successfully",
      data: service,
    });

  } catch (error) {
    console.error("GET SINGLE SERVICE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
// ==========================================
// GET SERVICES BY CATEGORY / SECTION
// ==========================================

export const getServicesByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    console.log("====================================");
    console.log("REQUESTED CATEGORY:", category);
    console.log("====================================");

    const services = await Services.find({
      section: category,
      status: "active",
    }).sort({ createdAt: -1 });

    console.log("TOTAL SERVICES FOUND:", services.length);

    services.forEach((service, index) => {
      console.log(`SERVICE ${index + 1}:`);
      console.log("ID:", service._id);
      console.log("SECTION:", service.section);
      console.log("TITLE:", service.title);
      console.log("STATUS:", service.status);
    });

    return res.status(200).json({
      success: true,
      category,
      count: services.length,
      data: services,
    });

  } catch (error) {
    console.error("GET SERVICES BY CATEGORY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch services",
      error: error.message,
    });
  }
};