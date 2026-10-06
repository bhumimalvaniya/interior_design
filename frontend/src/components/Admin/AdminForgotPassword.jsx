
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./AdminForgotPassword.css";
import API_URL from "../../config/api";

// const API_URL = "http://localhost:9000/api/v1/admin";

const AdminForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  // ==========================================
  // FORM STATES
  // ==========================================

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  // ==========================================
  // SEND OTP
  // ==========================================

  const handleSendOtp = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    // Validate phone
    if (!phone.trim()) {
      setError("Please enter your mobile number.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        // `${API_URL}/forgot-password/send-otp`,
        `${API_URL}/admin/forgot-password/send-otp`,
        {
          phone: phone.trim(),
        }
      );

      if (response.data.success) {
        setMessage(
          response.data.message ||
            "OTP has been sent successfully to your mobile number."
        );

        // Move to OTP verification
        setStep(2);
      }
    } catch (error) {
      console.error("SEND OTP ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to send OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // VERIFY OTP
  // ==========================================

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!otp.trim()) {
      setError("Please enter the OTP.");
      return;
    }

    if (!/^\d{6}$/.test(otp.trim())) {
      setError("OTP must contain exactly 6 digits.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        // `${API_URL}/forgot-password/verify-otp`,
         `${API_URL}/admin/forgot-password/verify-otp`,
        {
          phone: phone.trim(),
          otp: otp.trim(),
        }
      );

      if (response.data.success) {
        setMessage(
          response.data.message ||
            "OTP verified successfully."
        );

        setStep(3);
      }
    } catch (error) {
      console.error("VERIFY OTP ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Invalid or expired OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // RESET PASSWORD
  // ==========================================

  const handleResetPassword = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!password || !confirmPassword) {
      setError("Please enter both passwords.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        // `${API_URL}/forgot-password/reset-password`,
         `${API_URL}/admin/forgot-password/reset-password`,
        {
          phone: phone.trim(),
          password,
          confirmPassword,
        }
      );

      if (response.data.success) {
        setMessage(
          response.data.message ||
            "Password changed successfully."
        );

        setTimeout(() => {
          navigate("/admin/login");
        }, 1500);
      }
    } catch (error) {
      console.error("RESET PASSWORD ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CHANGE MOBILE NUMBER
  // ==========================================

  const handleChangePhone = () => {
    setStep(1);
    setOtp("");
    setError("");
    setMessage("");
  };

  return (
    <div className="admin-forgot-page">

      {/* =====================================
          LEFT SIDE
      ===================================== */}

      <div className="admin-forgot-left">

        <div className="admin-forgot-overlay"></div>

        <div className="admin-forgot-left-content">

          {/* Logo */}

          <Link
            to="/admin/login"
            className="admin-forgot-logo"
          >
            <span>◆</span>

            <div>
              <strong>Interior</strong>
              <b>Studio</b>
            </div>
          </Link>

          {/* Content */}

          <div className="admin-forgot-intro">

            <p>ACCOUNT RECOVERY</p>

            <h1>
              Reset Your
              <br />
              <span>Password</span>
            </h1>

            <div className="admin-forgot-line"></div>

            <span>
              Securely recover your admin account
              and create a new password.
            </span>

          </div>

          <div className="admin-forgot-footer">
            © 2026 InteriorStudio
          </div>

        </div>
      </div>

      {/* =====================================
          RIGHT SIDE
      ===================================== */}

      <div className="admin-forgot-right">

        <div className="admin-forgot-card">

          {/* Mobile Logo */}

          <div className="admin-forgot-mobile-logo">

            <span>◆</span>

            <div>
              <strong>Interior</strong>
              <b>Studio</b>
            </div>

          </div>

          {/* ==================================
              STEP INDICATOR
          ================================== */}

          <div className="forgot-steps">

            <div
              className={`forgot-step ${
                step >= 1 ? "active" : ""
              }`}
            >
              <span>1</span>
              <small>Mobile</small>
            </div>

            <div className="forgot-step-line"></div>

            <div
              className={`forgot-step ${
                step >= 2 ? "active" : ""
              }`}
            >
              <span>2</span>
              <small>Verify</small>
            </div>

            <div className="forgot-step-line"></div>

            <div
              className={`forgot-step ${
                step >= 3 ? "active" : ""
              }`}
            >
              <span>3</span>
              <small>Reset</small>
            </div>

          </div>

          {/* ==================================
              HEADING
          ================================== */}

          <div className="admin-forgot-heading">

            <p>ACCOUNT RECOVERY</p>

            <h2>

              {step === 1 &&
                "Forgot Password?"}

              {step === 2 &&
                "Verify OTP"}

              {step === 3 &&
                "Create New Password"}

            </h2>

            <span>

              {step === 1 &&
                "Enter your admin mobile number to receive a verification code."}

              {step === 2 &&
                `Enter the OTP sent to +91 ${phone}.`}

              {step === 3 &&
                "Create a strong password for your admin account."}

            </span>

          </div>

          {/* ==================================
              ERROR
          ================================== */}

          {error && (
            <div className="admin-forgot-error">
              ⚠ {error}
            </div>
          )}

          {/* ==================================
              SUCCESS MESSAGE
          ================================== */}

          {message && (
            <div className="admin-forgot-success">
              ✓ {message}
            </div>
          )}

          {/* ==================================
              STEP 1 - MOBILE NUMBER
          ================================== */}

          {step === 1 && (

            <form onSubmit={handleSendOtp}>

              <div className="forgot-form-group">

                <label>
                  ADMIN MOBILE NUMBER
                </label>

                <div className="forgot-input-wrapper">

                  <span>📱</span>

                  <input
                    type="tel"
                    maxLength="10"
                    placeholder="Enter your mobile number"
                    value={phone}
                    onChange={(e) =>
                      setPhone(
                        e.target.value.replace(/\D/g, "")
                      )
                    }
                    disabled={loading}
                  />

                </div>

              </div>

              <button
                type="submit"
                className="forgot-main-button"
                disabled={loading}
              >
                {loading
                  ? "Sending..."
                  : "Send Verification Code"}

                {!loading && <span>→</span>}
              </button>

            </form>

          )}

          {/* ==================================
              STEP 2 - OTP
          ================================== */}

          {step === 2 && (

            <form onSubmit={handleVerifyOtp}>

              <div className="forgot-form-group">

                <label>
                  VERIFICATION CODE
                </label>

                <div className="forgot-input-wrapper">

                  <span>🔢</span>

                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength="6"
                    placeholder="Enter 6 digit OTP"
                    value={otp}
                    onChange={(e) =>
                      setOtp(
                        e.target.value.replace(
                          /\D/g,
                          ""
                        )
                      )
                    }
                    disabled={loading}
                  />

                </div>

              </div>

              <button
                type="submit"
                className="forgot-main-button"
                disabled={loading}
              >
                {loading
                  ? "Verifying..."
                  : "Verify OTP"}

                {!loading && <span>→</span>}
              </button>

              <button
                type="button"
                className="forgot-back-button"
                disabled={loading}
                onClick={handleChangePhone}
              >
                ← Change Mobile Number
              </button>

            </form>

          )}

          {/* ==================================
              STEP 3 - RESET PASSWORD
          ================================== */}

          {step === 3 && (

            <form onSubmit={handleResetPassword}>

              {/* New Password */}

              <div className="forgot-form-group">

                <label>
                  NEW PASSWORD
                </label>

                <div className="forgot-input-wrapper">

                  <span>🔒</span>

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    disabled={loading}
                  />

                  <button
                    type="button"
                    className="forgot-show-password"
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

              {/* Confirm Password */}

              <div className="forgot-form-group">

                <label>
                  CONFIRM PASSWORD
                </label>

                <div className="forgot-input-wrapper">

                  <span>🔒</span>

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    disabled={loading}
                  />

                  <button
                    type="button"
                    className="forgot-show-password"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                  >
                    {showConfirmPassword
                      ? "🙈"
                      : "👁"}
                  </button>

                </div>

              </div>

              <button
                type="submit"
                className="forgot-main-button"
                disabled={loading}
              >
                {loading
                  ? "Resetting..."
                  : "Reset Password"}

                {!loading && <span>→</span>}
              </button>

            </form>

          )}

          {/* ==================================
              BACK TO LOGIN
          ================================== */}

          <Link
            to="/admin/login"
            className="forgot-login-link"
          >
            ← Back to Admin Login
          </Link>

        </div>
      </div>

    </div>
  );
};

export default AdminForgotPassword;
