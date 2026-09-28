import express from "express";

import {
  addEvent,
  getEvents,
  getSingleEvent,
  updateEvent,
  deleteEvent,
  getEventsByCategory,
} from "../Controller/EventController.js";

import upload from "../Utils/upload.js";

const router = express.Router();


// ==========================================
// ADD EVENT
// ==========================================

router.post(
  "/addevent",
  upload.single("image"),
  addEvent
);


// ==========================================
// GET ALL EVENTS
// ==========================================

router.get(
  "/featch",
  getEvents
);


// ==========================================
// GET SINGLE EVENT
// ==========================================

router.get(
  "/details/:id",
  getSingleEvent
);


// ==========================================
// UPDATE EVENT
// ==========================================

router.put(
  "/update/:id",
  upload.single("image"),
  updateEvent
);


// ==========================================
// DELETE EVENT
// ==========================================

router.delete(
  "/delete/:id",
  deleteEvent
);


// ==========================================
// GET EVENTS BY CATEGORY
// ==========================================

router.get(
  "/:cate_nm",
  getEventsByCategory
);


export default router;