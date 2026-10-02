import express from "express";

import {
  addAbout,
  getAbout,
  getActiveAbout,
  getAboutById,
  updateAbout,
  deleteAbout,
} from "../Controller/AboutController.js";

// ======================================================
// CLOUDINARY UPLOAD
// ======================================================

import upload from "../Utils/upload.js";

const router = express.Router();

// ======================================================
// FRONTEND
// ======================================================

// Get active About
router.get(
  "/active",
  getActiveAbout
);

// ======================================================
// ADMIN
// ======================================================

// Get all About
router.get(
  "/featch",
  getAbout
);

// Get About by ID
router.get(
  "/:id",
  getAboutById
);

// Add About
router.post(
  "/add",
  upload.single("image"),
  addAbout
);

// Update About
router.put(
  "/update/:id",
  upload.single("image"),
  updateAbout
);

// Delete About
router.delete(
  "/delete/:id",
  deleteAbout
);

export default router;