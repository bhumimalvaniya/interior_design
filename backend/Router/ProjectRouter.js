import express from "express";

import {
  addProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectStats,
  getResidentialProjects,
  getCommercialProjects,
  getCompletedProjects,
} from "../Controller/ProjectController.js";

import upload from "../Utils/upload.js";

const router = express.Router();

router.post("/add", upload.single("image"), addProject);

router.get("/fetch", getProjects);

router.get("/residential",getResidentialProjects);

router.get("/commercial",getCommercialProjects);

router.get("/completed",getCompletedProjects);

router.get("/stats", getProjectStats);

router.get("/:id", getProjectById);

router.put("/update/:id",upload.single("image"), updateProject);

router.delete("/delete/:id", deleteProject);

export default router;