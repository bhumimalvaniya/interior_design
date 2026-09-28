import express from "express";

import {
  addHeaderMenu,
  getHeaderMenus,
  getActiveHeaderMenus,
  getHeaderMenuById,
  updateHeaderMenu,
  deleteHeaderMenu,
} from "../Controller/HeaderMenuController.js";

const router = express.Router();

// =====================================================
// GET ACTIVE MENUS FOR FRONTEND
// =====================================================

router.get("/active", getActiveHeaderMenus);

// =====================================================
// GET ALL MENUS FOR ADMIN
// =====================================================

router.get("/featch", getHeaderMenus);

// =====================================================
// GET SINGLE MENU
// =====================================================

router.get("/:id", getHeaderMenuById);

// =====================================================
// ADD MENU
// =====================================================

router.post("/add", addHeaderMenu);

// =====================================================
// UPDATE MENU
// =====================================================

router.put("/update/:id", updateHeaderMenu);

// =====================================================
// DELETE MENU
// =====================================================

router.delete("/delete/:id", deleteHeaderMenu);

export default router;