
import express from "express";

import {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  sendAdminForgotOtp,
  verifyAdminForgotOtp,
  resetAdminPassword,
} from "../Controller/AdminController.js";

import adminAuth from "../Middleware/adminAuth.js";

const router = express.Router();


// ==========================================
// ADMIN AUTH
// ==========================================

router.post("/register", registerAdmin);

router.post("/login", loginAdmin);


// ==========================================
// ADMIN PROFILE
// ==========================================

router.get(
  "/profile",
  adminAuth,
  getAdminProfile
);


// ==========================================
// ADMIN FORGOT PASSWORD
// ==========================================

router.post(
  "/forgot-password/send-otp",
  sendAdminForgotOtp
);

router.post(
  "/forgot-password/verify-otp",
  verifyAdminForgotOtp
);

router.post(
  "/forgot-password/reset-password",
  resetAdminPassword
);


export default router;

