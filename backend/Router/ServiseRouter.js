
import express from "express";

import {
  addServices,
  getServices,
  getSingleServices,
  updateServices,
  deleteServices,
  getServicesByCategory,
} from "../Controller/ServicesController.js";

import upload from "../Utils/upload.js";

const router = express.Router();


// ADD SERVICE
router.post(
  "/add",
  upload.single("image"),
  addServices
);


// FETCH SERVICES
router.get(
  "/featch",
  getServices
);

router.get(
  "/single/:id",
  getSingleServices
);

router.get("/category/:category",getServicesByCategory);

router.put(
  "/update/:id",
  upload.single("image"),
  updateServices
);

router.delete(
  "/delete/:id",
  deleteServices
);

export default router;

