import express from "express";
import {changePassword,updateUserProfile,sendForgotPasswordOtp,verifyForgotPasswordOtp,resetPassword,login,toggleUserStatus,deleteUser,getUsers,register,getUserProfile } from "../Controller/UserController.js";
import upload from "../Utils/upload.js";

const router = express.Router();

router.post("/register", register);
router.get("/featch",getUsers);
router.delete("/delete/:id", deleteUser);
router.put("/toggle/:id", toggleUserStatus);
router.post("/login",login);


router.post("/forgot-password/send-otp", sendForgotPasswordOtp);
router.post("/forgot-password/verify-otp", verifyForgotPasswordOtp);
router.post("/forgot-password/reset", resetPassword);


router.get("/profile/:id", getUserProfile);

// Update profile
router.put("/updateprofile/:id",upload.single("avatar"),updateUserProfile);

router.put("/change-password/:id",changePassword);

export default router;