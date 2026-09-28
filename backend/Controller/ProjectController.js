import Project from "../Model/ProjectSchema.js";

// ==========================================
// ADD PROJECT
// ==========================================

export const addProject = async (req, res) => {
  try {

    console.log("PROJECT BODY:", req.body);
    console.log("PROJECT FILE:", req.file);


    const {
      title,
      category,
      style,
      location,
      status,
      description,
    } = req.body;


    if (
      !title ||
      !category ||
      !style ||
      !location
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }


    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Project image is required",
      });
    }


    const project = new Project({

      title,

      category,

      style,

      location,

      status: status || "Ongoing",

      description,

      image: `/uploads/${req.file.filename}`,

    });


    const savedProject =
      await project.save();


    console.log(
      "PROJECT SAVED:",
      savedProject
    );


    return res.status(201).json({

      success: true,

      message: "Project added successfully",

      data: savedProject,

    });


  } catch (error) {

    console.log(
      "ADD PROJECT ERROR:",
      error
    );


    return res.status(500).json({

      success: false,

      message: "Failed to add project",

      error: error.message,

    });

  }
};

// ==========================================
// GET ALL PROJECTS
// ==========================================

export const getProjects = async (req, res) => {
  try {

    const projects = await Project.find()
      .sort({ createdAt: -1 });

    console.log("PROJECTS FROM DATABASE:", projects);

    return res.status(200).json({
      success: true,
      message: "Projects fetched successfully",
      data: projects,
    });

  } catch (error) {

    console.log("GET PROJECT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
      error: error.message,
    });
  }
};


// ==========================================
// GET PROJECT BY ID
// ==========================================

export const getProjectById = async (req, res) => {
  try {

    const project =
      await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: project,
    });

  } catch (error) {

    console.log(
      "GET PROJECT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch project",
      error: error.message,
    });

  }
};


// ==========================================
// UPDATE PROJECT
// ==========================================

export const updateProject = async (req, res) => {
  try {

    const {
      title,
      category,
      style,
      location,
      status,
      description,
    } = req.body;


    const project =
      await Project.findById(
        req.params.id
      );


    if (!project) {

      return res.status(404).json({
        success: false,
        message: "Project not found",
      });

    }


    // Update normal fields

    project.title =
      title ?? project.title;

    project.category =
      category ?? project.category;

    project.style =
      style ?? project.style;

    project.location =
      location ?? project.location;

    project.status =
      status ?? project.status;

    project.description =
      description ?? project.description;


    // =====================================
    // UPDATE IMAGE ONLY IF NEW IMAGE EXISTS
    // =====================================

    if (req.file) {

      project.image =
        `/uploads/${req.file.filename}`;

    }


    const updatedProject =
      await project.save();


    return res.status(200).json({

      success: true,

      message:
        "Project updated successfully",

      data: updatedProject,

    });


  } catch (error) {

    console.log(
      "UPDATE PROJECT ERROR:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to update project",

      error: error.message,

    });

  }
};


// ==========================================
// DELETE PROJECT
// ==========================================

export const deleteProject = async (req, res) => {
  try {

    const deletedProject =
      await Project.findByIdAndDelete(req.params.id);

    if (!deletedProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });

  } catch (error) {

    console.log("DELETE PROJECT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete project",
      error: error.message,
    });
  }
};


// ==========================================
// PROJECT STATS
// ==========================================

export const getProjectStats = async (req, res) => {
  try {

    const totalProjects =
      await Project.countDocuments();

    const residential =
      await Project.countDocuments({
        category: "Residential",
      });

    const commercial =
      await Project.countDocuments({
        category: "Commercial",
      });

    const completed =
      await Project.countDocuments({
        status: "Completed",
      });

    const ongoing =
      await Project.countDocuments({
        status: "Ongoing",
      });

    return res.status(200).json({
      success: true,
      data: {
        totalProjects,
        residential,
        commercial,
        completed,
        ongoing,
      },
    });

  } catch (error) {

    console.log("STATS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch statistics",
      error: error.message,
    });
  }
};

export const getResidentialProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      category: "Residential",
    }).sort({
      createdAt: -1,
    });

    console.log("Residential Projects:", projects);

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    console.error(
      "Fetch Residential Projects Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to fetch residential projects",
      error: error.message,
    });
  }
};

// GET COMMERCIAL PROJECTS
export const getCommercialProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      category: "Commercial",
    }).sort({ createdAt: -1 });

    console.log("Commercial Projects:", projects);

    return res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    console.error("Fetch Commercial Projects Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch commercial projects",
      error: error.message,
    });
  }
};

// GET COMPLETED PROJECTS
export const getCompletedProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      status: "Completed",
    }).sort({ createdAt: -1 });

    console.log("COMPLETED PROJECTS:", projects);

    return res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });

  } catch (error) {
    console.error("FETCH COMPLETED PROJECTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch completed projects",
      error: error.message,
    });
  }
};