import express from "express";

import {
  addContact,
  getContacts,
  getSingleContact,
  updateContactStatus,
  deleteContact,
} from "../Controller/ContactController.js";

const router = express.Router();

// =====================================================
// ADD CONTACT
// =====================================================

router.post("/add", addContact);

// =====================================================
// GET ALL CONTACTS
// =====================================================

router.get("/featch", getContacts);

// =====================================================
// GET SINGLE CONTACT
// =====================================================

router.get("/single/:id", getSingleContact);

// =====================================================
// UPDATE STATUS
// =====================================================

router.put("/status/:id", updateContactStatus);

// =====================================================
// DELETE CONTACT
// =====================================================

router.delete("/delete/:id", deleteContact);

export default router;