import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import API_URL from "../config/api";

// const API_URL = "http://localhost:9000/api/v1/cust";

const Login = () => {
  const navigate = useNavigate();

  // =====================================================
  // FORM DATA
  // =====================================================

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // =====================================================
  // STATES
  // =====================================================

  const [showPassword, setShowPassword] = useState(false);

  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");


  // =====================================================
  // LOAD REMEMBERED EMAIL
  // =====================================================

  useEffect(() => {
    const savedEmail =
      localStorage.getItem("userEmail");

    if (savedEmail) {
      setFormData((prev) => ({
        ...prev,
        email: savedEmail,
      }));

      setRememberMe(true);
    }
  }, []);


  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };


  // =====================================================
  // LOGIN
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");


    // ===================================================
    // VALIDATION
    // ===================================================

    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!formData.password) {
      setError("Please enter your password.");
      return;
    }


    try {

      setLoading(true);


      console.log(
        "Login Data:",
        formData
      );


      // =================================================
      // API CALL
      // =================================================

      const response = await axios.post(
        `${API_URL}/cust/login`,
        {
          email: formData.email.trim(),
          password: formData.password,
        }
      );


      console.log(
        "Login Response:",
        response.data
      );


      // =================================================
      // CHECK SUCCESS
      // =================================================

      if (!response.data.success) {

        setError(
          response.data.message ||
          "Login failed."
        );

        return;
      }


      // =================================================
      // GET USER DATA
      // =================================================

      const userData =
        response.data.data ||
        response.data.user ||
        null;


      // =================================================
      // GET TOKEN
      // =================================================

      const token =
        response.data.token || "";


      // =================================================
      // SAVE EMAIL
      // =================================================

      if (rememberMe) {

        localStorage.setItem(
          "userEmail",
          formData.email.trim()
        );

      } else {

        localStorage.removeItem(
          "userEmail"
        );

      }


      // =================================================
      // SAVE TOKEN
      // =================================================

      if (token) {

        if (rememberMe) {

          localStorage.setItem(
            "userToken",
            token
          );

        } else {

          sessionStorage.setItem(
            "userToken",
            token
          );

        }

      }


      // =================================================
      // SAVE USER DATA
      // =================================================

      if (userData) {

        if (rememberMe) {

          localStorage.setItem(
            "userData",
            JSON.stringify(userData)
          );

        } else {

          sessionStorage.setItem(
            "userData",
            JSON.stringify(userData)
          );

        }

      }


      // =================================================
      // SUCCESS MESSAGE
      // =================================================

      setSuccess(
        response.data.message ||
        "Login successful!"
      );


      // =================================================
      // REDIRECT
      // =================================================

      setTimeout(() => {
        navigate("/");
      }, 700);


    } catch (error) {

      console.error(
        "Login Error:",
        error
      );


      // =================================================
      // SERVER RESPONSE ERROR
      // =================================================

      if (error.response) {

        setError(
          error.response.data?.message ||
          "Invalid email or password."
        );

      }


      // =================================================
      // SERVER NOT CONNECTED
      // =================================================

      else if (error.request) {

        setError(
          "Unable to connect to server. Please make sure Node.js server is running."
        );

      }


      // =================================================
      // OTHER ERROR
      // =================================================

      else {

        setError(
          "Something went wrong. Please try again."
        );

      }

    } finally {

      setLoading(false);

    }
  };


  return (

    <div className="login-page">


      {/* =================================================
          LEFT IMAGE SECTION
      ================================================= */}

      <div className="login-image-section">

        <div className="login-image-overlay"></div>

        <div className="login-image-content">

          <p className="login-image-label">
            INTERIOR DESIGN
          </p>

          <h1>
            Design Your
            <span> Dream Space</span>
          </h1>

          <p>
            Beautiful interiors are created with thoughtful
            design, elegant details and a vision that reflects
            your personality.
          </p>

          <div className="login-image-line"></div>

          <span>
            Create • Design • Inspire
          </span>

        </div>

      </div>


      {/* =================================================
          RIGHT LOGIN SECTION
      ================================================= */}

      <div className="login-form-section">

        <div className="login-container">


          {/* =================================================
              LOGO
          ================================================= */}

          <Link
            to="/"
            className="login-logo"
          >

            <span>
              INTERIOR
            </span>

            <small>
              DESIGN STUDIO
            </small>

          </Link>


          {/* =================================================
              HEADING
          ================================================= */}

          <div className="login-heading">

            <p>
              WELCOME BACK
            </p>

            <h2>
              Sign In
            </h2>

            <span>
              Login to continue your journey with us.
            </span>

          </div>


          {/* =================================================
              ERROR MESSAGE
          ================================================= */}

          {error && (

            <div className="login-error">
              {error}
            </div>

          )}


          {/* =================================================
              SUCCESS MESSAGE
          ================================================= */}

          {success && (

            <div className="login-success">
              {success}
            </div>

          )}


          {/* =================================================
              LOGIN FORM
          ================================================= */}

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >


            {/* =================================================
                EMAIL
            ================================================= */}

            <div className="login-input-group">

              <label htmlFor="email">
                Email Address
              </label>

              <div className="login-input-wrapper">

                <span className="login-input-icon">
                  ✉
                </span>

                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />

              </div>

            </div>


            {/* =================================================
                PASSWORD
            ================================================= */}

            <div className="login-input-group">

              <div className="login-password-label">

                <label htmlFor="password">
                  Password
                </label>

                <Link to="/forgot-password">
                  Forgot Password?
                </Link>

              </div>


              <div className="login-input-wrapper">

                <span className="login-input-icon">
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
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />


                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  disabled={loading}
                  aria-label="Toggle password visibility"
                >

                  {showPassword
                    ? "🙈"
                    : "👁"}

                </button>

              </div>

            </div>


            {/* =================================================
                REMEMBER ME
            ================================================= */}

            <div className="login-options">

              <label className="remember-me">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(
                      e.target.checked
                    )
                  }
                  disabled={loading}
                />

                <span>
                  Remember me
                </span>

              </label>

            </div>


            {/* =================================================
                LOGIN BUTTON
            ================================================= */}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >

              {loading
                ? "Signing In..."
                : "Sign In"}

            </button>

          </form>


          {/* =================================================
              DIVIDER
          ================================================= */}

          <div className="login-divider">

            <span></span>

            <p>
              OR
            </p>

            <span></span>

          </div>


          {/* =================================================
              REGISTER
          ================================================= */}

          <div className="login-register">

            <p>
              Don't have an account?
            </p>

            <Link to="/register">
              Create an Account
            </Link>

          </div>


          {/* =================================================
              HOME
          ================================================= */}

          <Link
            to="/"
            className="login-home-link"
          >
            ← Back to Home
          </Link>


        </div>

      </div>

    </div>
  );
};

export default Login;