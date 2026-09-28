import User from "../Model/UserSchema.js";
import bcrypt from "bcrypt";
import jwt  from "jsonwebtoken";
import fs from "fs";
import path from "path";

import twilioClient from "../Utils/twilio.js";

// const verifySid = process.env.TWILIO_VERIFY_SID;

export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      gender,
      city,
      address,
      password,
      confirmPassword,
    } = req.body;

    // ==============================
    // CHECK REQUIRED FIELDS
    // ==============================

    if (
      !name ||
      !email ||
      !phone ||
      !gender ||
      !city||
      !address||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields.",
      });
    }

    // ==============================
    // PHONE VALIDATION
    // ==============================

    if (!/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit phone number.",
      });
    }

    // ==============================
    // PASSWORD VALIDATION
    // ==============================

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    // ==============================
    // PASSWORD MATCH
    // ==============================

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password do not match.",
      });
    }

    // ==============================
    // CHECK EMAIL
    // ==============================

    const existingEmail = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "Email already registered.",
      });
    }

    // ==============================
    // CHECK PHONE
    // ==============================

    const existingPhone = await User.findOne({
      phone,
    });

    if (existingPhone) {
      return res.status(409).json({
        success: false,
        message: "Phone number already registered.",
      });
    }

    // ==============================
    // HASH PASSWORD
    // ==============================

    const hashedPassword = await bcrypt.hash(password, 10);

     // ==============================
    // AUTOMATIC AVATAR
    // ==============================

    let avatar = "";

    if (gender.toLowerCase() === "male") {
      avatar = "/uploads/male.jpg";
    } else if (gender.toLowerCase() === "female") {
      avatar = "/uploads/female.jpg";
    } else {
      avatar = "/uploads/default.jpg";
    }
    // ==============================
    // CREATE USER
    // ==============================

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      phone,
      gender,
      city,
      address,
      password: hashedPassword,
      avatar:avatar,
    });

    await newUser.save();

    // ==============================
    // RESPONSE
    // ==============================

    return res.status(201).json({
      success: true,
      message: "Registration successful!",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        gender: newUser.gender,
        city: newUser.city,
        address:newUser.address,
        avatar:newUser.avatar,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during registration.",
      error: error.message,
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -otp -otpExpire");

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.log("Fetch users error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

// =====================================================
// BLOCK / UNBLOCK USER
// =====================================================

export const toggleUserStatus = async (req, res) => {
  try {

    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Toggle status
    if (user.isblocked) {
      user.isblocked = false;
      user.status = "active";
    } else {
      user.isblocked = true;
      user.status = "blocked";
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: user.isblocked
        ? "User blocked successfully"
        : "User unblocked successfully",
      data: user,
    });

  } catch (error) {

    console.log("Toggle user error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update user status",
      error: error.message,
    });
  }
};


// =====================================================
// DELETE USER
// =====================================================

export const deleteUser = async (req, res) => {
  try {

    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });

  } catch (error) {

    console.log("Delete user error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to delete user",
      error: error.message,
    });
  }
};


// =====================================================
// LOGIN
// =====================================================

export const login = async (req, res) => {

  try {

    const {
      email,
      password,
    } = req.body;


    // -------------------------------------------------
    // VALIDATION
    // -------------------------------------------------

    if (!email || !password) {

      return res.status(400).json({

        success: false,

        message:
          "Email and password are required",

      });

    }


    // -------------------------------------------------
    // FIND USER
    // -------------------------------------------------

    const user = await User.findOne({

      email: email.toLowerCase().trim(),

    });


    if (!user) {

      return res.status(404).json({

        success: false,

        message:
          "User not found. Please register first.",

      });

    }


    // -------------------------------------------------
    // CHECK BLOCKED
    // -------------------------------------------------

    if (
      user.isblocked === true ||
      user.status === "blocked"
    ) {

      return res.status(403).json({

        success: false,

        message:
          "Your account has been blocked by admin.",

      });

    }


    // -------------------------------------------------
    // CHECK PASSWORD
    // -------------------------------------------------

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );


    if (!passwordMatch) {

      return res.status(401).json({

        success: false,

        message:
          "Invalid email or password",

      });

    }


    // -------------------------------------------------
    // JWT TOKEN
    // -------------------------------------------------

    const token = jwt.sign(

      {
        id: user._id,
        email: user.email,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d",
      }

    );


    // -------------------------------------------------
    // USER DATA
    // -------------------------------------------------

    const userData = {

      id: user._id,

      name: user.name,

      email: user.email,

      phone: user.phone,

      gender: user.gender,

      city: user.city,

      address: user.address,

      avatar: user.avatar,

      status: user.status,

      isblocked: user.isblocked,

    };


    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------

    return res.status(200).json({

      success: true,

      message: "Login successful",

      token,

      data: userData,

    });

  } catch (error) {

    console.log(
      "Login Error:",
      error
    );

    return res.status(500).json({

      success: false,

      message: "Login failed",

      error: error.message,

    });

  }

};



// =====================================================
// SEND FORGOT PASSWORD OTP
// =====================================================

export const sendForgotPasswordOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    // ==========================================
    // CHECK PHONE
    // ==========================================

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    // Remove spaces
    const cleanPhone = phone.toString().trim();

    // ==========================================
    // VALIDATE PHONE
    // ==========================================

    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid 10-digit Indian phone number",
      });
    }

    // ==========================================
    // CHECK USER
    // ==========================================

    const user = await User.findOne({
      phone: cleanPhone,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this phone number",
      });
    }

    // ==========================================
    // CHECK BLOCKED USER
    // ==========================================

    if (
      user.isblocked === true ||
      user.status === "blocked"
    ) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked by admin.",
      });
    }

    // ==========================================
    // TWILIO VERIFY SID
    // ==========================================

    const verifySid = process.env.TWILIO_VERIFY_SID;

    console.log("=================================");
    console.log("TWILIO VERIFY SID:", verifySid);
    console.log("PHONE:", `+91${cleanPhone}`);
    console.log("=================================");

    if (!verifySid) {
      return res.status(500).json({
        success: false,
        message: "TWILIO_VERIFY_SID is missing",
      });
    }

    // ==========================================
    // INDIAN PHONE NUMBER
    // ==========================================

    const phoneNumber = `+91${cleanPhone}`;

    // ==========================================
    // SEND OTP USING TWILIO VERIFY
    // ==========================================

    const verification = await twilioClient.verify.v2
      .services(verifySid)
      .verifications.create({
        to: phoneNumber,
        channel: "sms",
      });

    console.log(
      "Twilio verification status:",
      verification.status
    );

    // ==========================================
    // SUCCESS
    // ==========================================

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      status: verification.status,
    });

  } catch (error) {

    console.error("========== TWILIO ERROR ==========");
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("Status:", error.status);
    console.error("More Info:", error.moreInfo);
    console.error("==================================");

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to send OTP",
      code: error.code,
    });
  }
};


// =====================================================
// VERIFY FORGOT PASSWORD OTP
// =====================================================

export const verifyForgotPasswordOtp = async (req, res) => {
  try {

    const { phone, otp } = req.body;

    // ==========================================
    // CHECK REQUIRED FIELDS
    // ==========================================

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: "Phone number and OTP are required",
      });
    }

    // ==========================================
    // CLEAN PHONE
    // ==========================================

    const cleanPhone = phone.toString().trim();

    // ==========================================
    // VALIDATE PHONE
    // ==========================================

    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number",
      });
    }

    // ==========================================
    // CHECK OTP
    // ==========================================

    const verifySid = process.env.TWILIO_VERIFY_SID;

    if (!verifySid) {
      return res.status(500).json({
        success: false,
        message: "TWILIO_VERIFY_SID is missing",
      });
    }

    const phoneNumber = `+91${cleanPhone}`;

    console.log("=================================");
    console.log("VERIFY OTP");
    console.log("VERIFY SID:", verifySid);
    console.log("PHONE:", phoneNumber);
    console.log("OTP:", otp);
    console.log("=================================");

    // ==========================================
    // VERIFY OTP USING TWILIO
    // ==========================================

    const verificationCheck =
      await twilioClient.verify.v2
        .services(verifySid)
        .verificationChecks.create({
          to: phoneNumber,
          code: otp.toString().trim(),
        });

    console.log(
      "Verification status:",
      verificationCheck.status
    );

    // ==========================================
    // OTP NOT APPROVED
    // ==========================================

    if (verificationCheck.status !== "approved") {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // ==========================================
    // OTP SUCCESS
    // ==========================================

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });

  } catch (error) {

    console.error(
      "OTP Verification Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message || "OTP verification failed",
      code: error.code,
    });
  }
};


// =====================================================
// RESET PASSWORD
// =====================================================

export const resetPassword = async (req, res) => {
  try {
    const {
      phone,
      password,
      confirmPassword,
    } = req.body;

    console.log("========== RESET PASSWORD ==========");
    console.log("PHONE:", phone);
    console.log("PASSWORD RECEIVED:", !!password);
    console.log("CONFIRM PASSWORD RECEIVED:", !!confirmPassword);

    if (!phone || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Phone number, password and confirm password are required",
      });
    }

    const cleanPhone = phone.toString().trim();

    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password and confirm password do not match",
      });
    }

    const user = await User.findOne({
      phone: cleanPhone,
    });

    console.log("USER FOUND:", !!user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    user.password = hashedPassword;

    await user.save();

    console.log("PASSWORD UPDATED SUCCESSFULLY");

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });

  } catch (error) {
    console.error(
      "RESET PASSWORD ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to reset password",
    });
  }
};



// ==========================================
// GET LOGGED-IN USER PROFILE
// ==========================================
export const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error("GET USER PROFILE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch user profile",
      error: error.message,
    });
  }
};



export const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Updating profile for user ID:", id);
    console.log("Body:", req.body);
    console.log("File:", req.file);

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const {
      name,
      email,
      phone,
      gender,
      city,
      address,
     
    } = req.body;

    // -----------------------------
    // VALIDATION
    // -----------------------------

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name, email and phone are required",
      });
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit phone number",
      });
    }

    // -----------------------------
    // CHECK EMAIL
    // -----------------------------

    const existingEmail = await User.findOne({
      email: email.toLowerCase().trim(),
      _id: { $ne: id },
    });

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "Email is already used by another account",
      });
    }

    // -----------------------------
    // CHECK PHONE
    // -----------------------------

    const existingPhone = await User.findOne({
      phone: phone.trim(),
      _id: { $ne: id },
    });

    if (existingPhone) {
      return res.status(409).json({
        success: false,
        message: "Phone number is already used by another account",
      });
    }

    // -----------------------------
    // UPDATE TEXT DATA
    // -----------------------------

    user.name = name.trim();
    user.email = email.toLowerCase().trim();
    user.phone = phone.trim();
    user.gender = gender || "";
    user.city = city || "";
    user.address = address || "";
    

    // -----------------------------
    // UPDATE AVATAR
    // -----------------------------

    if (req.file) {
      // Delete old local image if it exists
      if (
        user.avatar &&
        user.avatar.startsWith("/uploads/")
      ) {
        const oldImagePath = path.join(
          process.cwd(),
          "public",
          user.avatar
        );

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Save new image path
      user.avatar = `/uploads/${req.file.filename}`;
    }

    await user.save();

    // -----------------------------
    // RESPONSE
    // -----------------------------

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        city: user.city,
        address: user.address,
        avatar: user.avatar,
        status: user.status,
        isblocked: user.isblocked,
      },
    });

  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

// =====================================================
// CHANGE PASSWORD
// =====================================================

export const changePassword = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      currentPassword,
      newPassword,
    } = req.body;

    console.log(
      "Change password user ID:",
      id
    );

    // =================================================
    // VALIDATION
    // =================================================

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Current password and new password are required.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be at least 6 characters.",
      });
    }

    // =================================================
    // FIND USER
    // =================================================

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // =================================================
    // CHECK CURRENT PASSWORD
    // =================================================

    const isPasswordCorrect =
      await bcrypt.compare(
        currentPassword,
        user.password
      );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message:
          "Current password is incorrect.",
      });
    }

    // =================================================
    // CHECK SAME PASSWORD
    // =================================================

    const isSamePassword =
      await bcrypt.compare(
        newPassword,
        user.password
      );

    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be different from current password.",
      });
    }

    // =================================================
    // HASH NEW PASSWORD
    // =================================================

    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        10
      );

    // =================================================
    // UPDATE PASSWORD
    // =================================================

    user.password = hashedPassword;

    await user.save();

    // =================================================
    // SUCCESS RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,
      message:
        "Password changed successfully.",
    });

  } catch (error) {

    console.error(
      "CHANGE PASSWORD ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to change password.",
      error: error.message,
    });
  }
};