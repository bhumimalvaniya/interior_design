import Category from "../Model/CategoryModel.js";
import Project from "../Model/ProjectSchema.js";

// =========================================
// ADD CATEGORY
// =========================================

export const addCategory = async (req, res) => {
  try {
    console.log("================================");
    console.log("ADD CATEGORY API");
    console.log("BODY:", req.body);
    console.log("================================");

    const {
      name,
      description,
      status,
      image,
    } = req.body;

    // Validation
    if (!name || !description || !image) {
      return res.status(400).json({
        success: false,
        message: "Name, description and image are required",
      });
    }

    // Check duplicate category
    const existingCategory = await Category.findOne({
      name: name.trim(),
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    // Create category
    const category = await Category.create({
      name: name.trim(),
      description: description.trim(),
      status: status || "Active",
      image: image.trim(),
    });

    console.log("CATEGORY SAVED:");
    console.log(category);

    return res.status(201).json({
      success: true,
      message: "Category added successfully",
      data: category,
    });
  } catch (error) {
    console.error("ADD CATEGORY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add category",
      error: error.message,
    });
  }
};


// =========================================
// GET ALL CATEGORIES
// =========================================

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find() 
    .sort({ createdAt: -1 }) 
    .lean();

    // Add project count to every category 
    const categoriesWithProjects = await Promise.all( 
      categories.map(async (category) => { 
        
        const totalProjects = await Project.countDocuments({ 
          category: category.name,
         }); 
         
         return { 
          ...category, 
          totalProjects,
         }; 
        })
       );
       return res.status(200).json({ 
        success: true,
         message: "Categories fetched successfully", 
         data: categoriesWithProjects,
       });
  } catch (error) {
    console.error("GET CATEGORY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};


// =========================================
// GET SINGLE CATEGORY
// =========================================

export const getSingleCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("GET SINGLE CATEGORY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch category",
      error: error.message,
    });
  }
};


// =========================================
// UPDATE CATEGORY
// =========================================

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      description,
      status,
      image,
    } = req.body;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    category.name = name || category.name;
    category.description =
      description || category.description;
    category.status = status || category.status;
    category.image = image || category.image;

    await category.save();

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    console.error("UPDATE CATEGORY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update category",
      error: error.message,
    });
  }
};


// =========================================
// DELETE CATEGORY
// =========================================

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    await Category.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("DELETE CATEGORY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete category",
      error: error.message,
    });
  }
};