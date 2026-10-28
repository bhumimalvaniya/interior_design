import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SetProfile.css";
import API_URL from "../config/api";

// const API_URL = "http://localhost:9000/api/v1/cust";

const SetProfile = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    city: "",
    address: "",
    bio: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ==========================================
  // GET LOGGED-IN USER
  // ==========================================

  const getStoredUser = () => {
    const userData =
      localStorage.getItem("userData") ||
      sessionStorage.getItem("userData");

    if (!userData) {
      return null;
    }

    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error("Invalid userData:", error);
      return null;
    }
  };

  
const getAvatarUrl = (user) => {
  const image =
    user?.avatar ||
    user?.image ||
    user?.profileImage ||
    user?.profile_image ||
    "";

  if (!image || typeof image !== "string") {
    return "";
  }

  if (/^https?:\/\//i.test(image)) {
    return image;
  }

  const backendBaseUrl = API_URL.replace(/\/api\/v1\/?$/, "");

  if (image.startsWith("/")) {
    return `${backendBaseUrl}${image}`;
  }

  return `${backendBaseUrl}/${image}`;
};

  // ==========================================
  // FETCH PROFILE FROM MONGODB
  // ==========================================

 
useEffect(() => {
  let cancelled = false;

  const fetchProfile = async () => {
    try {
      const storedUser = getStoredUser();

      if (!storedUser) {
        navigate("/login");
        return;
      }

      const userId = storedUser.id || storedUser._id;

      if (!userId) {
        console.error("Stored user has no ID:", storedUser);
        alert("User ID not found. Please log in again.");
        navigate("/login");
        return;
      }

      const token =
        storedUser.token ||
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/cust/profile/${userId}`,
        {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : {},
        }
      );

      console.log("PROFILE API RESPONSE:", response.data);

      const body = response.data;

      const user =
        body?.data?.user ||
        body?.user ||
        body?.data;

      if (
        !body?.success ||
        !user ||
        typeof user !== "object" ||
        Array.isArray(user)
      ) {
        throw new Error(
          body?.message || "User profile was not returned by the API."
        );
      }

      if (cancelled) return;

      setProfile({
        name: user.name || user.fnm || "",
        email: user.email || "",
        phone: user.phone || user.phone_no || "",
        gender: user.gender || "",
        city: user.city || "",
        address: user.address || "",
        bio: user.bio || "",
      });

      const avatarUrl = getAvatarUrl(user);

      setPreview(avatarUrl || null);

      // Keep the stored login data in sync with the latest profile.
      const updatedUser = {
        ...storedUser,
        ...user,
        id: user._id || user.id || userId,
      };

      if (localStorage.getItem("userData")) {
        localStorage.setItem("userData", JSON.stringify(updatedUser));
      }

      if (sessionStorage.getItem("userData")) {
        sessionStorage.setItem("userData", JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error("FETCH PROFILE ERROR:", {
        message: error.message,
        status: error.response?.status,
        response: error.response?.data,
      });

      if (!cancelled) {
        alert(
          error.response?.data?.message ||
          error.message ||
          "Unable to fetch profile."
        );
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  };

  fetchProfile();

  return () => {
    cancelled = true;
  };
}, [navigate]);


  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // PHONE CHANGE
  // ==========================================

  const handlePhoneChange = (e) => {
    const value =
      e.target.value.replace(/\D/g, "");

    if (value.length <= 10) {
      setProfile((previous) => ({
        ...previous,
        phone: value,
      }));
    }
  };

  // ==========================================
  // AVATAR CHANGE
  // ==========================================

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB.");
      return;
    }

    setAvatar(file);

    const imageUrl =
      URL.createObjectURL(file);

    setPreview(imageUrl);
  };

  // ==========================================
  // SAVE PROFILE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !profile.name.trim() ||
      !profile.email.trim() ||
      !profile.phone.trim()
    ) {
      alert(
        "Please fill all required fields."
      );
      return;
    }

    if (profile.phone.length !== 10) {
      alert(
        "Please enter a valid 10-digit phone number."
      );
      return;
    }

    try {
      setSaving(true);

      const storedUser = getStoredUser();

      if (!storedUser) {
        alert("Please login first.");
        navigate("/login");
        return;
      }

      const userId =
        storedUser.id ||
        storedUser._id;

      if (!userId) {
        alert(
          "User ID not found. Please login again."
        );
        navigate("/login");
        return;
      }

      // ======================================
      // FORM DATA
      // ======================================

      const formData = new FormData();

      formData.append(
        "name",
        profile.name.trim()
      );

      formData.append(
        "email",
        profile.email.trim()
      );

      formData.append(
        "phone",
        profile.phone.trim()
      );

      formData.append(
        "gender",
        profile.gender
      );

      formData.append(
        "city",
        profile.city
      );

      formData.append(
        "address",
        profile.address
      );

      formData.append(
        "bio",
        profile.bio
      );

      if (avatar) {
        formData.append(
          "avatar",
          avatar
        );
      }

      console.log(
        "Updating user:",
        userId
      );

      // ======================================
      // API CALL
      // ======================================

      const response = await axios.put(
        `${API_URL}/cust/updateprofile/${userId}`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      console.log(
        "UPDATE RESPONSE:",
        response.data
      );

      if (response.data.success) {
        const updatedUser =
          response.data.data;

        // ==================================
        // UPDATE LOCAL STORAGE
        // ==================================

        const newUserData = {
          ...storedUser,
          ...updatedUser,
          id:
            updatedUser.id ||
            userId,
        };

        localStorage.setItem(
          "userData",
          JSON.stringify(newUserData)
        );

        sessionStorage.setItem(
          "userData",
          JSON.stringify(newUserData)
        );

        alert(
          "Profile updated successfully!"
        );

        navigate("/account");
      }

    } catch (error) {
      console.error(
        "UPDATE PROFILE ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="profile-loading">
        <h2>Loading Profile...</h2>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="set-profile-page">

      {/* =========================================
          PAGE HEADER
      ========================================= */}

      <section className="set-profile-header">

        <div className="set-profile-header-overlay"></div>

        <div className="set-profile-header-content">

          <p>
            MY ACCOUNT
          </p>

          <h1>
            Set Your
            <span>Profile</span>
          </h1>

          <div className="set-profile-header-line"></div>

          <span>
            Personalize Your Interior Design Experience
          </span>

        </div>

      </section>


      {/* =========================================
          PROFILE SECTION
      ========================================= */}

      <section className="set-profile-section">

        <div className="set-profile-wrapper">

          {/* SIDEBAR */}

          <aside className="profile-sidebar">

            <div className="profile-sidebar-title">

              <p>
                MY ACCOUNT
              </p>

              <h3>
                Account Menu
              </h3>

            </div>

            <nav className="profile-navigation">

              <Link to="/account">
                <span>⌂</span>
                My Account
              </Link>

              <Link
                to="/set-profile"
                className="active"
              >
                <span>👤</span>
                Set Profile
              </Link>

              <Link to="/change-password">
                <span>🔒</span>
                Change Password
              </Link>

              <Link to="/bookings">
                <span>▣</span>
                My Bookings
              </Link>

              <Link to="/">
                <span>←</span>
                Back to Home
              </Link>

            </nav>

          </aside>


          {/* PROFILE FORM */}

          <main className="set-profile-content">

            <div className="profile-form-header">

              <div>

                <p>
                  PROFILE SETTINGS
                </p>

                <h2>
                  Personal Information
                </h2>

                <span>
                  Update your personal details and profile information.
                </span>

              </div>

            </div>


            <form
              className="set-profile-form"
              onSubmit={handleSubmit}
            >

              {/* PROFILE PHOTO */}

              <div className="profile-photo-section">

                <div className="profile-photo">

                  {preview ? (

                    <img
                      src={preview}
                      alt="Profile Preview"
                    />

                  ) : (

                    <span>
                      👤
                    </span>

                  )}

                </div>

                <div className="profile-photo-info">

                  <h3>
                    Profile Photo
                  </h3>

                  <p>
                    Upload a clear image for your profile.
                  </p>

                  <label
                    htmlFor="avatar"
                    className="upload-photo-button"
                  >
                    Choose Photo
                  </label>

                  <input
                    type="file"
                    id="avatar"
                    accept="image/*"
                    onChange={
                      handleAvatarChange
                    }
                  />

                </div>

              </div>


              {/* PERSONAL DETAILS */}

              <div className="profile-section-title">

                <h3>
                  Personal Details
                </h3>

                <span>
                  Basic information about you
                </span>

              </div>


              <div className="profile-form-row">

                <div className="profile-input-group">

                  <label>
                    Full Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={profile.name}
                    onChange={handleChange}
                    required
                  />

                </div>


                <div className="profile-input-group">

                  <label>
                    Email Address *
                  </label>

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={profile.email}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>


              <div className="profile-form-row">

                <div className="profile-input-group">

                  <label>
                    Phone Number *
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter phone number"
                    value={profile.phone}
                    onChange={handlePhoneChange}
                    required
                  />

                </div>


                <div className="profile-input-group">

                  <label>
                    Gender
                  </label>

                  <select
                    name="gender"
                    value={profile.gender}
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


              {/* LOCATION */}

              <div className="profile-section-title profile-location-title">

                <h3>
                  Location
                </h3>

                <span>
                  Where are you located?
                </span>

              </div>


              <div className="profile-form-row">

                <div className="profile-input-group">

                  <label>
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    placeholder="Enter your city"
                    value={profile.city}
                    onChange={handleChange}
                  />

                </div>


                <div className="profile-input-group">

                  <label>
                    Address
                  </label>

                  <input
                    type="text"
                    name="address"
                    placeholder="Enter your address"
                    value={profile.address}
                    onChange={handleChange}
                  />

                </div>

              </div>


            

              

              {/* BUTTONS */}

              <div className="profile-form-actions">

                <Link
                  to="/account"
                  className="profile-cancel-button"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  className="profile-save-button"
                  disabled={saving}
                >

                  {saving
                    ? "Saving..."
                    : "Save Profile"}

                  {!saving && (
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

export default SetProfile;