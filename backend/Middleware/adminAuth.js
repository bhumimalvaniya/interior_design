
import jwt from "jsonwebtoken";

const adminAuth = (req, res, next) => {
  try {
    // ==========================================
    // GET AUTHORIZATION HEADER
    // ==========================================

    const authHeader =
      req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Admin authentication required",
      });
    }

    // ==========================================
    // CHECK BEARER
    // ==========================================

    if (
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format",
      });
    }

    const token =
      authHeader.split(" ")[1];

    // ==========================================
    // VERIFY TOKEN
    // ==========================================

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // ==========================================
    // CHECK ADMIN ROLE
    // ==========================================

    if (decoded.role !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    // ==========================================
    // SAVE ADMIN DATA
    // ==========================================

    req.admin = decoded;

    next();

  } catch (error) {
    console.error(
      "ADMIN AUTH ERROR:",
      error
    );

    return res.status(401).json({
      success: false,
      message: "Invalid or expired admin token",
    });
  }
};

export default adminAuth;

