
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Account.css";

const Account = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // GET LOGGED-IN USER DATA
  // =====================================================

  useEffect(() => {
    const storedUser =
      localStorage.getItem("userData") ||
      sessionStorage.getItem("userData");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);

        console.log("Logged-in User:", parsedUser);

        setUser(parsedUser);
      } catch (error) {
        console.error("User data parsing error:", error);
      }
    }

    setLoading(false);
  }, []);

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();

    navigate("/login");
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="account-loading">
        Loading account...
      </div>
    );
  }

  // =====================================================
  // USER NOT LOGGED IN
  // =====================================================

  if (!user) {
    return (
      <div className="account-login-required">
        <h2>Please Login First</h2>

        <p>
          You need to login to access your account.
        </p>

        <Link to="/login">
          Go to Login
        </Link>
      </div>
    );
  }

  // =====================================================
  // USER DATA
  // =====================================================

  const userName =
    user.name ||
    user.fnm ||
    "Your Name";

  const userEmail =
    user.email ||
    "your@email.com";

  const userPhone =
    user.phone ||
    user.phone_no ||
    "Not Added";

  const userGender =
    user.gender ||
    "Not Added";

    const userCity =
    user.city ||
    "Not Added";

    const userAddress =
    user.address ||
    "Not Added";

    const API_URL = "http://localhost:9000";
 const getAvatarUrl = (user) => {
  const avatar =
    user?.avatar ||
    user?.image ||
    user?.profileImage ||
    user?.profile_image ||
    "";

  if (!avatar) {
    return "";
  }

  // Cloudinary / external URL
  if (avatar.startsWith("http://") || avatar.startsWith("https://")) {
    return avatar;
  }

  // Backend local image
  if (avatar.startsWith("/")) {
    return `${API_URL}${avatar}`;
  }

  return `${API_URL}/${avatar}`;
};

const userAvatar = getAvatarUrl(user);

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="account-page">

      {/* =========================================
          PAGE BANNER
      ========================================= */}

      <section className="account-banner">

        <div className="account-banner-overlay"></div>

        <div className="account-banner-content">

          <p>MY ACCOUNT</p>

          <h1>
            Welcome <span>Back</span>
          </h1>

          <div className="account-banner-line"></div>

          <span>
            Manage your profile and account
          </span>

        </div>

      </section>


      {/* =========================================
          ACCOUNT SECTION
      ========================================= */}

      <section className="account-section">

        <div className="account-container">

          {/* =====================================
              SIDEBAR
          ===================================== */}

          <aside className="account-sidebar">

            <div className="account-sidebar-header">

              <div className="account-avatar-small">

                {userAvatar ? (

                  <img
                    src={userAvatar}
                    alt="Profile"
                     onError={(e) => {
                     console.log("Avatar image failed:", userAvatar);
                      e.currentTarget.style.display = "none";
                    }}
                  />

                ) : (

                  <span>👤</span>

                )}

              </div>

              <div>

                <h3>
                  {userName}
                </h3>

                <p>
                  {userEmail}
                </p>

              </div>

            </div>


            {/* Navigation */}

            <nav className="account-navigation">

              <Link
                to="/account"
                className="account-nav-active"
              >
                <span>⌂</span>
                My Account
              </Link>


              <Link to="/setprofile">

                <span>👤</span>

                Set Profile

              </Link>


              <Link to="/change-password">

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


              <button
                onClick={handleLogout}
                className="account-logout"
              >

                <span>↪</span>

                Logout

              </button>

            </nav>

          </aside>


          {/* =====================================
              MAIN CONTENT
          ===================================== */}

          <main className="account-content">


            {/* Welcome */}

            <div className="account-welcome">

              <div>

                <p>
                  WELCOME TO YOUR ACCOUNT
                </p>

                <h2>
                  Hello, {userName}
                </h2>

                <span>
                  Manage your personal information,
                  bookings and preferences from here.
                </span>

              </div>


              <Link
                to="/setprofile"
                className="edit-profile-button"
              >
                Edit Profile →
              </Link>

            </div>


            {/* =================================
                PROFILE CARD
            ================================= */}

            <div className="account-card profile-card">

              <div className="account-card-title">

                <div>

                  <p>
                    PROFILE
                  </p>

                  <h3>
                    Personal Information
                  </h3>

                </div>

                <Link to="/setprofile">
                  Edit
                </Link>

              </div>


              <div className="account-profile-details">


                {/* Avatar */}

                <div className="account-avatar-large">

                  {userAvatar ? (

                    <img
                      src={userAvatar}
                      alt="Profile"
                      onError={(e) => {
        console.log("Avatar failed to load:", userAvatar);
        e.currentTarget.style.display = "none";
      }}
                    />

                  ) : (

                    <span>👤</span>

                  )}

                </div>


                {/* Details */}

                <div className="account-details-grid">


                  {/* Full Name */}

                  <div className="account-detail">

                    <span>
                      FULL NAME
                    </span>

                    <strong>
                      {userName}
                    </strong>

                  </div>


                  {/* Email */}

                  <div className="account-detail">

                    <span>
                      EMAIL ADDRESS
                    </span>

                    <strong>
                      {userEmail}
                    </strong>

                  </div>


                  {/* Phone */}

                  <div className="account-detail">

                    <span>
                      PHONE NUMBER
                    </span>

                    <strong>
                      {userPhone}
                    </strong>

                  </div>


                  {/* Gender */}

                  <div className="account-detail">

                    <span>
                      GENDER
                    </span>

                    <strong>
                      {userGender}
                    </strong>

                  </div>

                  {/* City */}

<div className="account-detail">

  <span>
    CITY
  </span>

  <strong>
    {userCity}
  </strong>

</div>


{/* Address */}

<div className="account-detail">

  <span>
    ADDRESS
  </span>

  <strong>
    {userAddress}
  </strong>

</div>

                  {/* Account Status */}

                  <div className="account-detail">

                    <span>
                      ACCOUNT STATUS
                    </span>

                    <strong className="account-status">
                      Active
                    </strong>

                  </div>

                </div>

              </div>

            </div>


            {/* =================================
                QUICK ACTIONS
            ================================= */}

            <div className="account-card">

              <div className="account-card-title">

                <div>

                  <p>
                    QUICK ACTIONS
                  </p>

                  <h3>
                    Manage Your Account
                  </h3>

                </div>

              </div>


              <div className="account-actions-grid">


                {/* Set Profile */}

                <Link
                  to="/setprofile"
                  className="account-action-card"
                >

                  <div className="account-action-icon">
                    👤
                  </div>

                  <div>

                    <h4>
                      Set Profile
                    </h4>

                    <p>
                      Update your personal
                      information and photo.
                    </p>

                  </div>

                  <span className="account-action-arrow">
                    →
                  </span>

                </Link>


                {/* Change Password */}

                <Link
                  to="/change-password"
                  className="account-action-card"
                >

                  <div className="account-action-icon">
                    🔒
                  </div>

                  <div>

                    <h4>
                      Change Password
                    </h4>

                    <p>
                      Keep your account
                      password secure.
                    </p>

                  </div>

                  <span className="account-action-arrow">
                    →
                  </span>

                </Link>


                {/* Bookings */}

                <Link
                  to="/bookings"
                  className="account-action-card"
                >

                  <div className="account-action-icon">
                    📋
                  </div>

                  <div>

                    <h4>
                      My Bookings
                    </h4>

                    <p>
                      View your consultation
                      and project bookings.
                    </p>

                  </div>

                  <span className="account-action-arrow">
                    →
                  </span>

                </Link>


                {/* Consultation */}

                <Link
                  to="/consultation"
                  className="account-action-card"
                >

                  <div className="account-action-icon">
                    📅
                  </div>

                  <div>

                    <h4>
                      Book Consultation
                    </h4>

                    <p>
                      Schedule a consultation
                      with our design team.
                    </p>

                  </div>

                  <span className="account-action-arrow">
                    →
                  </span>

                </Link>

              </div>

            </div>


            {/* =================================
                LOGOUT CARD
            ================================= */}

            <div className="account-logout-card">

              <div>

                <h3>
                  Ready to leave?
                </h3>

                <p>
                  You can safely logout from your account.
                </p>

              </div>

              <button
                onClick={handleLogout}
              >
                Logout
              </button>

            </div>

          </main>

        </div>

      </section>

    </div>
  );
};

export default Account;

