import express from "express";

import {
  uploadGallary,
  getGallary,
  getSingleGallary,
  updateGallary,
  deleteGallary,
} from "../Controller/GalleryController.js";

import upload from "../Utils/upload.js";

const router = express.Router();

router.post(
  "/add",
  upload.single("image"),
  uploadGallary
);

router.get(
  "/featch",
  getGallary
);

router.get(
  "/single/:id",
  getSingleGallary
);

router.put(
  "/update/:id",
  upload.single("image"),
  updateGallary
);

router.delete(
  "/delete/:id",
  deleteGallary
);

export default router;