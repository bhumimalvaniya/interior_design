import express from "express";

import {
  addCategory,
  getCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
} from "../Controller/CategoryController.js";

const router = express.Router();

// ADD CATEGORY
router.post("/add", addCategory);

// GET ALL CATEGORIES
router.get("/featch", getCategories);

// GET SINGLE CATEGORY
router.get("/single/:id", getSingleCategory);

// UPDATE CATEGORY
router.put("/update/:id", updateCategory);

// DELETE CATEGORY
router.delete("/delete/:id", deleteCategory);

export default router;