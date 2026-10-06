import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./ChangePassword.css";
import API_URL from "../config/api";

// const API_URL = "http://localhost:9000/api/v1/cust";

const ChangePassword = () => {
  const navigate = useNavigate();

  // =====================================================
  // SHOW / HIDE PASSWORD
  // =====================================================

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // =====================================================
  // USER
  // =====================================================

  const [user, setUser] = useState(null);

  // =====================================================
  // FORM DATA
  // =====================================================

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // =====================================================
  // LOADING
  // =====================================================

  const [loading, setLoading] = useState(false);

  // =====================================================
  // USER ERROR
  // =====================================================

  const [userError, setUserError] = useState("");

  // =====================================================
  // GET LOGGED-IN USER
  // =====================================================

  useEffect(() => {
    try {
      const storedUser =
        localStorage.getItem("userData") ||
        sessionStorage.getItem("userData");

      if (!storedUser) {
        setUserError("Please login to change your password.");
        return;
      }

      const parsedUser = JSON.parse(storedUser);

      console.log("Logged-in user:", parsedUser);

      setUser(parsedUser);
    } catch (error) {
      console.error("User data error:", error);

      setUserError(
        "Unable to read your account information."
      );
    }
  }, []);

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // =====================================================
  // SUBMIT CHANGE PASSWORD
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = formData;

    // ---------------------------------------------------
    // CHECK USER LOGIN
    // ---------------------------------------------------

    if (!user) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    // ---------------------------------------------------
    // GET USER ID
    // ---------------------------------------------------

    const userId =
      user.id ||
      user._id;

    if (!userId) {
      console.error("User ID not found:", user);

      alert(
        "User ID not found. Please login again."
      );

      navigate("/login");
      return;
    }

    // ---------------------------------------------------
    // REQUIRED FIELDS
    // ---------------------------------------------------

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      alert("Please fill all fields.");
      return;
    }

    // ---------------------------------------------------
    // PASSWORD LENGTH
    // ---------------------------------------------------

    if (newPassword.length < 6) {
      alert(
        "New password must be at least 6 characters."
      );
      return;
    }

    // ---------------------------------------------------
    // CONFIRM PASSWORD
    // ---------------------------------------------------

    if (newPassword !== confirmPassword) {
      alert(
        "New password and confirm password do not match."
      );
      return;
    }

    // ---------------------------------------------------
    // SAME PASSWORD CHECK
    // ---------------------------------------------------

    if (currentPassword === newPassword) {
      alert(
        "New password must be different from current password."
      );
      return;
    }

    try {
      setLoading(true);

      console.log(
        "Changing password for user:",
        userId
      );

      // =================================================
      // SEND DATA TO NODE.JS
      // =================================================

      const response = await axios.put(
        `${API_URL}/change-password/${userId}`,
        {
          currentPassword,
          newPassword,
        }
      );

      console.log(
        "Change password response:",
        response.data
      );

      // =================================================
      // SUCCESS
      // =================================================

      if (response.data.success) {
        alert(
          response.data.message ||
          "Password changed successfully!"
        );

        // Clear form
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        // Go account page
        navigate("/account");
      } else {
        alert(
          response.data.message ||
          "Unable to change password."
        );
      }
    } catch (error) {
      console.error(
        "Change password error:",
        error
      );

      // Backend error
      if (error.response) {
        console.error(
          "Backend response:",
          error.response.data
        );

        alert(
          error.response.data.message ||
          "Unable to change password."
        );
      } else if (error.request) {
        alert(
          "Server is not responding. Please check your backend."
        );
      } else {
        alert(
          "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // IF USER NOT FOUND
  // =====================================================

  if (userError) {
    return (
      <div className="change-password-page">

        <section className="change-password-banner">
          <div className="change-password-banner-overlay"></div>

          <div className="change-password-banner-content">
            <p>ACCOUNT SECURITY</p>

            <h1>
              Change <span>Password</span>
            </h1>

            <div className="change-password-banner-line"></div>

            <span>
              Keep your account secure and protected
            </span>
          </div>
        </section>

        <section className="change-password-section">

          <div className="change-password-container">

            <main className="change-password-content">

              <div className="password-security-box">

                <div className="security-icon">
                  🔐
                </div>

                <div>
                  <h4>
                    Login Required
                  </h4>

                  <p>
                    {userError}
                  </p>

                  <button
                    type="button"
                    className="password-save-button"
                    onClick={() => navigate("/login")}
                  >
                    Go to Login →
                  </button>
                </div>

              </div>

            </main>

          </div>

        </section>

      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="change-password-page">

      {/* =========================================
          PAGE BANNER
      ========================================= */}

      <section className="change-password-banner">

        <div className="change-password-banner-overlay"></div>

        <div className="change-password-banner-content">

          <p>
            ACCOUNT SECURITY
          </p>

          <h1>
            Change <span>Password</span>
          </h1>

          <div className="change-password-banner-line"></div>

          <span>
            Keep your account secure and protected
          </span>

        </div>

      </section>


      {/* =========================================
          MAIN SECTION
      ========================================= */}

      <section className="change-password-section">

        <div className="change-password-container">

          {/* =====================================
              SIDEBAR
          ===================================== */}

          <aside className="password-sidebar">

            <div className="password-sidebar-title">

              <p>
                MY ACCOUNT
              </p>

              <h3>
                Account Menu
              </h3>

            </div>


            <nav className="password-navigation">

              <Link to="/account">
                <span>⌂</span>
                My Account
              </Link>

              <Link to="/setprofile">
                <span>👤</span>
                Set Profile
              </Link>

              <Link
                to="/change-password"
                className="password-nav-active"
              >
                <span>🔒</span>
                Change Password
              </Link>

              <Link to="/bookings">
                <span>📋</span>
                My Bookings
              </Link>

              <Link to="/consultation">
                <span>📅</span>
                Book Consultation
              </Link>

              <Link to="/">
                <span>←</span>
                Back to Home
              </Link>

            </nav>

          </aside>


          {/* =====================================
              PASSWORD CONTENT
          ===================================== */}

          <main className="change-password-content">

            <div className="password-form-header">

              <div className="password-lock-icon">
                🔒
              </div>

              <div>

                <p>
                  SECURITY SETTINGS
                </p>

                <h2>
                  Change Your Password
                </h2>

                <span>
                  Update your password regularly to keep
                  your account secure.
                </span>

              </div>

            </div>


            {/* =================================
                PASSWORD FORM
            ================================= */}

            <form
              className="change-password-form"
              onSubmit={handleSubmit}
            >

              {/* =================================
                  CURRENT PASSWORD
              ================================= */}

              <div className="password-input-group">

                <label>
                  Current Password *
                </label>

                <div className="password-input-wrapper">

                  <input
                    type={
                      showCurrent
                        ? "text"
                        : "password"
                    }
                    name="currentPassword"
                    value={
                      formData.currentPassword
                    }
                    onChange={handleChange}
                    placeholder="Enter your current password"
                    required
                  />

                  <button
                    type="button"
                    className="password-show-button"
                    onClick={() =>
                      setShowCurrent(
                        !showCurrent
                      )
                    }
                  >
                    {
                      showCurrent
                        ? "Hide"
                        : "Show"
                    }
                  </button>

                </div>

              </div>


              {/* =================================
                  NEW PASSWORD
              ================================= */}

              <div className="password-input-group">

                <label>
                  New Password *
                </label>

                <div className="password-input-wrapper">

                  <input
                    type={
                      showNew
                        ? "text"
                        : "password"
                    }
                    name="newPassword"
                    value={
                      formData.newPassword
                    }
                    onChange={handleChange}
                    placeholder="Enter your new password"
                    required
                  />

                  <button
                    type="button"
                    className="password-show-button"
                    onClick={() =>
                      setShowNew(
                        !showNew
                      )
                    }
                  >
                    {
                      showNew
                        ? "Hide"
                        : "Show"
                    }
                  </button>

                </div>

                <p className="password-hint">
                  Password must contain at least 6 characters.
                </p>

              </div>


              {/* =================================
                  CONFIRM PASSWORD
              ================================= */}

              <div className="password-input-group">

                <label>
                  Confirm New Password *
                </label>

                <div className="password-input-wrapper">

                  <input
                    type={
                      showConfirm
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    value={
                      formData.confirmPassword
                    }
                    onChange={handleChange}
                    placeholder="Confirm your new password"
                    required
                  />

                  <button
                    type="button"
                    className="password-show-button"
                    onClick={() =>
                      setShowConfirm(
                        !showConfirm
                      )
                    }
                  >
                    {
                      showConfirm
                        ? "Hide"
                        : "Show"
                    }
                  </button>

                </div>


                {/* PASSWORD MATCH ERROR */}

                {formData.confirmPassword &&
                  formData.newPassword !==
                    formData.confirmPassword && (

                    <p className="password-error">
                      Passwords do not match.
                    </p>

                  )}

              </div>


              {/* =================================
                  SECURITY INFORMATION
              ================================= */}

              <div className="password-security-box">

                <div className="security-icon">
                  🔐
                </div>

                <div>

                  <h4>
                    Password Security
                  </h4>

                  <p>
                    Choose a strong password that you
                    don't use on other websites.
                  </p>

                </div>

              </div>


              {/* =================================
                  BUTTONS
              ================================= */}

              <div className="password-form-actions">

                <Link
                  to="/account"
                  className="password-cancel-button"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  className="password-save-button"
                  disabled={loading}
                >

                  {loading
                    ? "Updating..."
                    : "Update Password"}

                  {!loading && (
                    <span>→</span>
                  )}

                </button>

              </div>

            </form>

          </main>

        </div>

      </section>

    </div>
  );
};

export default ChangePassword;