import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";
import API_URL from "../config/api";

const Register = () => {
  const navigate = useNavigate();

  // =========================================
  // FORM DATA
  // =========================================

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    city:"",
    address:"",
    password: "",
    confirmPassword: "",
  });

  // =========================================
  // STATES
  // =========================================

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  // =========================================
  // HANDLE INPUT CHANGE
  // =========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================
  // HANDLE PHONE CHANGE
  // =========================================

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");

    if (value.length <= 10) {
      setFormData((prev) => ({
        ...prev,
        phone: value,
      }));
    }
  };

  // =========================================
  // HANDLE REGISTER
  // =========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ==============================
    // REQUIRED FIELD VALIDATION
    // ==============================

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone ||
      !formData.gender ||
      !formData.city.trim() ||
      !formData.address.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert("Please fill all fields.");
      return;
    }

    // ==============================
    // PHONE VALIDATION
    // ==============================

    if (!/^[0-9]{10}$/.test(formData.phone)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    // ==============================
    // EMAIL VALIDATION
    // ==============================

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    // ==============================
    // PASSWORD VALIDATION
    // ==============================

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    // ==============================
    // CONFIRM PASSWORD
    // ==============================

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      alert(
        "Password and confirm password do not match."
      );
      return;
    }

    try {
      setLoading(true);

      // =========================================
      // SEND DATA TO NODE.JS
      // =========================================

      const response = await axios.post(
        `${API_URL}/cust/register`,
        // "http://localhost:9000/api/v1/cust/register",
        formData
      );

      console.log(
        "Registration Response:",
        response.data
      );

      // =========================================
      // SUCCESS
      // =========================================

      if (response.data.success) {
        alert(
          response.data.message ||
            "Registration successful!"
        );

        // Clear form
        setFormData({
          name: "",
          email: "",
          phone: "",
          gender: "",
          city:"",
          address:"",
          password: "",
          confirmPassword: "",
        });

        // Go to login
        navigate("/login");
      }
    } catch (error) {
      console.error(
        "Registration Error:",
        error
      );

      // =========================================
      // BACKEND ERROR
      // =========================================

      if (error.response) {
        alert(
          error.response.data?.message ||
            "Registration failed."
        );
      } else if (error.request) {
        alert(
          "Unable to connect to server. Please make sure your Node.js server is running."
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

  return (
    <div className="register-page">

      {/* =========================================
          LEFT IMAGE SECTION
      ========================================= */}

      <div className="register-image-section">

        <div className="register-image-overlay"></div>

        <div className="register-image-content">

          <p className="register-image-label">
            INTERIOR DESIGN
          </p>

          <h1>
            Create Your
            <span> Perfect Space</span>
          </h1>

          <p>
            Join our design community and discover
            inspiring interiors, creative ideas and
            beautiful spaces designed around your
            lifestyle.
          </p>

          <div className="register-image-line"></div>

          <span>
            Create • Design • Inspire
          </span>

        </div>

      </div>


      {/* =========================================
          RIGHT REGISTER SECTION
      ========================================= */}

      <div className="register-form-section">

        <div className="register-container">

          {/* =========================================
              LOGO
          ========================================= */}

          <Link
            to="/"
            className="register-logo"
          >
            <span>INTERIOR</span>

            <small>
              DESIGN STUDIO
            </small>
          </Link>


          {/* =========================================
              HEADING
          ========================================= */}

          <div className="register-heading">

            <p>
              GET STARTED
            </p>

            <h2>
              Create Account
            </h2>

            <span>
              Create your account and start your
              design journey.
            </span>

          </div>


          {/* =========================================
              REGISTER FORM
          ========================================= */}

          <form
            className="register-form"
            onSubmit={handleSubmit}
          >

            {/* =====================================
                NAME
            ===================================== */}

            <div className="register-input-group">

              <label htmlFor="name">
                Full Name
              </label>

              <div className="register-input-wrapper">

                <span className="register-input-icon">
                  👤
                </span>

                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                />

              </div>

            </div>


            {/* =====================================
                EMAIL
            ===================================== */}

            <div className="register-input-group">

              <label htmlFor="email">
                Email Address
              </label>

              <div className="register-input-wrapper">

                <span className="register-input-icon">
                  ✉
                </span>

                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />

              </div>

            </div>


            {/* =====================================
                PHONE
            ===================================== */}

            <div className="register-input-group">

              <label htmlFor="phone">
                Phone Number
              </label>

              <div className="register-input-wrapper">

                <span className="register-input-icon">
                  ☎
                </span>

                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Enter 10-digit phone number"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  inputMode="numeric"
                  maxLength="10"
                  autoComplete="tel"
                />

              </div>

            </div>


            {/* =====================================
                GENDER
            ===================================== */}

            <div className="register-input-group">

              <label htmlFor="gender">
                Gender
              </label>

              <div className="register-input-wrapper">

                <span className="register-input-icon">
                  ⚥
                </span>

                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >

                  <option value="">
                    Select Gender
                  </option>

                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>

            </div>


              {/* =====================================
    CITY
===================================== */}

<div className="register-input-group">

  <label htmlFor="city">
    City
  </label>

  <div className="register-input-wrapper">

    <span className="register-input-icon">
      📍
    </span>

    <input
      type="text"
      id="city"
      name="city"
      placeholder="Enter your city"
      value={formData.city}
      onChange={handleChange}
      autoComplete="address-level2"
    />

  </div>

</div>


{/* =====================================
    ADDRESS
===================================== */}

<div className="register-input-group">

  <label htmlFor="address">
    Address
  </label>

  <div className="register-input-wrapper">

    <span className="register-input-icon">
      🏠
    </span>

    <input
      type="text"
      id="address"
      name="address"
      placeholder="Enter your address"
      value={formData.address}
      onChange={handleChange}
      autoComplete="street-address"
    />

  </div>

</div>
            {/* =====================================
                PASSWORD
            ===================================== */}

            <div className="register-input-group">

              <label htmlFor="password">
                Password
              </label>

              <div className="register-input-wrapper">

                <span className="register-input-icon">
                  🔒
                </span>

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  id="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword
                    ? "🙈"
                    : "👁"}
                </button>

              </div>

            </div>


            {/* =====================================
                CONFIRM PASSWORD
            ===================================== */}

            <div className="register-input-group">

              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <div className="register-input-wrapper">

                <span className="register-input-icon">
                  🔒
                </span>

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={
                    formData.confirmPassword
                  }
                  onChange={handleChange}
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirmPassword
                    ? "🙈"
                    : "👁"}
                </button>

              </div>

            </div>


            {/* =====================================
                TERMS
            ===================================== */}

            <label className="register-terms">

              <input
                type="checkbox"
                required
              />

              <span>
                I agree to the Terms & Conditions
              </span>

            </label>


            {/* =====================================
                REGISTER BUTTON
            ===================================== */}

            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >

              {loading
                ? "Creating Account..."
                : "Create Account"}

            </button>

          </form>


          {/* =========================================
              LOGIN
          ========================================= */}

          <div className="register-login">

            <p>
              Already have an account?
            </p>

            <Link to="/login">
              Sign In
            </Link>

          </div>


          {/* =========================================
              HOME
          ========================================= */}

          <Link
            to="/"
            className="register-home-link"
          >
            ← Back to Home
          </Link>

        </div>

      </div>

    </div>
  );
};

export default Register;