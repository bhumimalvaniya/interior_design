
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./AdminLogin.css";
import API_URL from "../../config/api";

// const API_URL = "http://localhost:9000/api/v1";

const AdminLogin = () => {
  const navigate = useNavigate();

  // ==========================================
  // FORM STATE
  // ==========================================

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] = useState("");

  const [loading, setLoading] =
    useState(false);


  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };


  // ==========================================
  // ADMIN LOGIN
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const email =
      formData.email
        .trim()
        .toLowerCase();

    const password =
      formData.password;


    // ==========================================
    // VALIDATION
    // ==========================================

    if (!email || !password) {
      setError(
        "Please enter email and password."
      );
      return;
    }


    try {

      setLoading(true);


      // ========================================
      // CALL BACKEND
      // ========================================

      const response = await axios.post(
        `${API_URL}/admin/login`,
        {
          email,
          password,
        }
      );


      console.log(
        "ADMIN LOGIN RESPONSE:",
        response.data
      );


      // ========================================
      // LOGIN SUCCESS
      // ========================================

      if (response.data.success) {

        const admin =
          response.data.data;

        const token =
          response.data.token;


        // ======================================
        // SAVE JWT TOKEN
        // ======================================

        sessionStorage.setItem(
          "adminToken",
          token
        );


        // ======================================
        // SAVE ADMIN INFORMATION
        // ======================================

        sessionStorage.setItem(
          "adminLoggedIn",
          "true"
        );

        sessionStorage.setItem(
          "adminName",
          admin.name
        );

        sessionStorage.setItem(
          "adminEmail",
          admin.email
        );

        sessionStorage.setItem(
          "adminId",
          admin.id
        );

        sessionStorage.setItem(
          "adminRole",
          admin.role
        );


        // ======================================
        // REDIRECT
        // ======================================

        navigate("/admin/dashboard");

      } else {

        setError(
          response.data.message ||
          "Admin login failed."
        );

      }

    } catch (error) {

      console.error(
        "ADMIN LOGIN ERROR:",
        error.response?.data ||
        error
      );


      setError(
        error.response?.data?.message ||
        "Invalid admin email or password."
      );

    } finally {

      setLoading(false);

    }
  };


  // ==========================================
  // RETURN
  // ==========================================

  return (
    <div className="admin-login-page">

      {/* =====================================
          LEFT SIDE
      ===================================== */}

      <div className="admin-login-left">

        <div className="admin-login-overlay"></div>

        <div className="admin-login-left-content">

          <div className="admin-login-logo">

            <span>◆</span>

            <div>
              <strong>
                Interior
              </strong>

              <b>
                Studio
              </b>
            </div>

          </div>


          <div className="admin-login-intro">

            <p>
              ADMINISTRATION PANEL
            </p>

            <h1>
              Manage Your
              <br />
              <span>
                InteriorStudio
              </span>
            </h1>

            <div className="admin-login-line"></div>

            <span>
              Manage events, users, bookings,
              categories and gallery from one place.
            </span>

          </div>


          <div className="admin-login-footer-text">
            © 2026 InteriorStudio
          </div>

        </div>

      </div>


      {/* =====================================
          RIGHT SIDE
      ===================================== */}

      <div className="admin-login-right">

        <div className="admin-login-card">

          {/* MOBILE LOGO */}

          <div className="admin-mobile-logo">

            <span>◆</span>

            <div>
              <strong>
                Interior
              </strong>

              <b>
                Studio
              </b>
            </div>

          </div>


          {/* HEADING */}

          <div className="admin-login-heading">

            <p>
              WELCOME BACK
            </p>

            <h2>
              Admin Login
            </h2>

            <span>
              Login to access your
              administration panel.
            </span>

          </div>


          {/* ERROR */}

          {error && (
            <div className="admin-login-error">
              ⚠ {error}
            </div>
          )}


          {/* FORM */}

          <form onSubmit={handleSubmit}>

            {/* EMAIL */}

            <div className="admin-form-group">

              <label>
                EMAIL ADDRESS
              </label>

              <div className="admin-input-wrapper">

                <span className="admin-input-icon">
                  ✉
                </span>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter admin email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="username"
                  required
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="admin-form-group">

              <div className="admin-password-label">

                <label>
                  PASSWORD
                </label>

                <Link to="/admin/forgot-password">
                  Forgot Password?
                </Link>

              </div>


              <div className="admin-input-wrapper">

                <span className="admin-input-icon">
                  🔒
                </span>


                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />


                <button
                  type="button"
                  className="admin-show-password"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                >
                  {showPassword
                    ? "🙈"
                    : "👁"}
                </button>

              </div>

            </div>


            {/* REMEMBER */}

            <div className="admin-login-options">

              <label className="admin-remember">

                <input
                  type="checkbox"
                />

                <span>
                  Remember me
                </span>

              </label>

            </div>


            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="admin-login-button"
              disabled={loading}
            >

              {loading
                ? "Logging in..."
                : "Login to Dashboard"}

              <span>
                →
              </span>

            </button>

          </form>


          {/* BACK WEBSITE */}

          <Link
            to="/"
            className="back-to-website"
          >
            ← Back to Website
          </Link>

        </div>

      </div>

    </div>
  );
};

export default AdminLogin;

