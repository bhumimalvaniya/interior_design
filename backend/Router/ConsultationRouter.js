import express from "express";

import {
  bookConsultation,
  getConsultations,
  updateConsultationStatus,
  deleteBooking,
} from "../Controller/ConsultationController.js";

const router = express.Router();

// Book consultation
router.post("/book", bookConsultation);

// Get all consultations
router.get("/featch", getConsultations);

// Update booking status
router.put("/status/:id",updateConsultationStatus);

// DELETE BOOKING 
 router.delete("/delete/:id", deleteBooking);
 
export default router;