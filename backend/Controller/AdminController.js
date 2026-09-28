
import Admin from "../Model/AdminModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import twilioClient from "../Utils/twilio.js";

// ==========================================
// ADMIN REGISTER
// ==========================================

export const registerAdmin = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
    } = req.body;

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name, email ,phone and password are required",
      });
    }

    // ==========================================
    // CHECK EXISTING ADMIN
    // ==========================================

    const existingAdmin = await Admin.findOne({
      email: email.trim().toLowerCase(),
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin email already exists",
      });
    }

    // ==========================================
    // HASH PASSWORD
    // ==========================================

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // ==========================================
    // CREATE ADMIN
    // ==========================================

    const admin = await Admin.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      phone:phone.trim()
    });

    return res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone:admin.phone,
        role: admin.role,
      },
    });

  } catch (error) {
    console.error("ADMIN REGISTER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to register admin",
      error: error.message,
    });
  }
};


// ==========================================
// ADMIN LOGIN
// ==========================================

export const loginAdmin = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    console.log("ADMIN LOGIN REQUEST:", {
      email,
    });

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const cleanEmail = email
      .trim()
      .toLowerCase();

    // ==========================================
    // FIND ADMIN
    // ==========================================

    const admin = await Admin.findOne({
      email: cleanEmail,
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin email or password",
      });
    }

    // ==========================================
    // CHECK STATUS
    // ==========================================

    if (admin.status === "Blocked") {
      return res.status(403).json({
        success: false,
        message: "Admin account is blocked",
      });
    }

    // ==========================================
    // CHECK PASSWORD
    // ==========================================

    const passwordMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin email or password",
      });
    }

    // ==========================================
    // CREATE JWT
    // ==========================================

    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // ==========================================
    // SUCCESS
    // ==========================================

    return res.status(200).json({
      success: true,
      message: "Admin login successful",

      token,

      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone:admin.phone,
        role: admin.role,
        status: admin.status,
      },
    });

  } catch (error) {
    console.error("ADMIN LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Admin login failed",
      error: error.message,
    });
  }
};


// ==========================================
// GET ADMIN PROFILE
// ==========================================

export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(
      req.admin.id
    ).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: admin,
    });

  } catch (error) {
    console.error(
      "GET ADMIN PROFILE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin profile",
      error: error.message,
    });
  }
};



// ==========================================
// ADMIN FORGOT PASSWORD - SEND OTP TO MOBILE
// ==========================================

export const sendAdminForgotOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    const cleanPhone = phone.replace(/\D/g, "");

    if (cleanPhone.length !== 10) {
      return res.status(400).json({
        success: false,
        message: "Enter valid 10 digit phone number",
      });
    }

    const verifySid = process.env.TWILIO_VERIFY_SID;

    if (!verifySid) {
      return res.status(500).json({
        success: false,
        message: "TWILIO_VERIFY_SID is missing",
      });
    }

    const verification = await twilioClient.verify.v2
      .services(verifySid)
      .verifications.create({
        to: `+91${cleanPhone}`,
        channel: "sms",
      });

    console.log("ADMIN OTP STATUS:", verification.status);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      status: verification.status,
    });

  } catch (error) {
    console.error("SEND ADMIN OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// ADMIN FORGOT PASSWORD - VERIFY OTP
// ==========================================

export const verifyAdminForgotOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: "Mobile number and OTP are required",
      });
    }

    const cleanPhone = phone.trim();
    const cleanOtp = otp.trim();

    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mobile number",
      });
    }

    if (!/^\d{6}$/.test(cleanOtp)) {
      return res.status(400).json({
        success: false,
        message: "OTP must contain 6 digits",
      });
    }

    // ==========================================
    // FIND ADMIN
    // ==========================================

    const admin = await Admin.findOne({
      phone: cleanPhone,
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // ==========================================
    // TWILIO VERIFY
    // ==========================================

    if (!process.env.TWILIO_VERIFY_SID) {
      return res.status(500).json({
        success: false,
        message: "Twilio Verify SID is not configured",
      });
    }

    // ==========================================
    // VERIFY OTP
    // ==========================================

    const verificationCheck =
      await twilioClient.verify.v2
        .services(process.env.TWILIO_VERIFY_SID)
        .verificationChecks.create({
          to: `+91${cleanPhone}`,
          code: cleanOtp,
        });

    console.log(
      "TWILIO VERIFICATION STATUS:",
      verificationCheck.status
    );

    if (verificationCheck.status !== "approved") {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // ==========================================
    // MARK OTP VERIFIED
    // ==========================================

    admin.resetOtpVerified = true;

    await admin.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });

  } catch (error) {
    console.error(
      "VERIFY ADMIN OTP ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to verify OTP",
      error: error.message,
    });
  }
};

// ==========================================
// ADMIN FORGOT PASSWORD - RESET PASSWORD
// ==========================================

// ==========================================
// ADMIN FORGOT PASSWORD - RESET PASSWORD
// ==========================================

export const resetAdminPassword = async (req, res) => {
  try {
    const {
      phone,
      password,
      confirmPassword,
    } = req.body;

    // ==========================================
    // VALIDATION
    // ==========================================

    if (
      !phone ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const cleanPhone = phone.trim();

    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mobile number",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least 6 characters",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // ==========================================
    // FIND ADMIN BY PHONE
    // ==========================================

    const admin = await Admin.findOne({
      phone: cleanPhone,
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // ==========================================
    // OTP MUST BE VERIFIED
    // ==========================================

    if (!admin.resetOtpVerified) {
      return res.status(403).json({
        success: false,
        message:
          "Please verify OTP before resetting password",
      });
    }

    // ==========================================
    // HASH NEW PASSWORD
    // ==========================================

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    admin.password = hashedPassword;

    // ==========================================
    // CLEAR OTP VERIFICATION
    // ==========================================

    admin.resetOtpVerified = false;

    await admin.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });

  } catch (error) {
    console.error(
      "RESET ADMIN PASSWORD ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to reset password",
      error: error.message,
    });
  }
};