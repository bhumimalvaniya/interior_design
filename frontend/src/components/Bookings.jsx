import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Bookings.css";

const API_URL = "http://localhost:9000/api/v1";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // GET LOGGED-IN USER EMAIL
  // ==========================================

  const getLoggedInUserEmail = () => {
    const localEmail = localStorage.getItem("userEmail");
    const sessionEmail = sessionStorage.getItem("userEmail");

    return (localEmail || sessionEmail || "")
      .trim()
      .toLowerCase();
  };

  // ==========================================
  // FETCH ONLY LOGGED-IN USER BOOKINGS
  // ==========================================

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      // Get logged-in user's email
      const loggedInEmail = getLoggedInUserEmail();

      console.log("LOGGED-IN USER EMAIL:", loggedInEmail);

      // User is not logged in
      if (!loggedInEmail) {
        setBookings([]);
        setError("Please login to view your bookings.");
        return;
      }

      // Fetch all bookings from backend
      const response = await axios.get(
        `${API_URL}/consultation/featch`
      );

      console.log("ALL BOOKINGS RESPONSE:", response.data);

      if (response.data.success) {
        const allBookings = response.data.data || [];

        // ==========================================
        // FILTER BOOKINGS BY LOGGED-IN USER EMAIL
        // ==========================================

        const userBookings = allBookings.filter((booking) => {
          const bookingEmail = (booking.email || "")
            .trim()
            .toLowerCase();

          return bookingEmail === loggedInEmail;
        });

        console.log("USER BOOKINGS:", userBookings);

        setBookings(userBookings);
      } else {
        setBookings([]);

        setError(
          response.data.message ||
            "Unable to fetch bookings."
        );
      }
    } catch (error) {
      console.error(
        "FETCH BOOKINGS ERROR:",
        error
      );

      setBookings([]);

      setError(
        error.response?.data?.message ||
          "Unable to connect to server."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "Not Available";
    }

    const newDate = new Date(date);

    if (isNaN(newDate.getTime())) {
      return date;
    }

    return newDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // BOOKING ID
  // ==========================================

  const getBookingId = (booking, index) => {
    if (booking.ticketId) {
      return booking.ticketId;
    }

    if (booking._id) {
      return booking._id
        .slice(-6)
        .toUpperCase();
    }

    return String(index + 1).padStart(
      3,
      "0"
    );
  };

  // ==========================================
  // STATUS
  // ==========================================

  const getStatus = (booking) => {
    return booking.status || "Pending";
  };

  // ==========================================
  // VIEW DETAILS
  // ==========================================

  const viewDetails = (booking, index) => {
    alert(
      `Booking ID: #${getBookingId(
        booking,
        index
      )}\n\n` +

      `Name: ${
        booking.name || "N/A"
      }\n` +

      `Email: ${
        booking.email || "N/A"
      }\n` +

      `Phone: ${
        booking.phone || "N/A"
      }\n` +

      `Consultation: ${
        booking.consultationType ||
        "N/A"
      }\n` +

      `Date: ${formatDate(
        booking.preferredDate
      )}\n` +

      `Time: ${
        booking.preferredTime ||
        "N/A"
      }\n` +

      `Budget: ${
        booking.budget ||
        "Not specified"
      }\n` +

      `Status: ${getStatus(
        booking
      )}`
    );
  };

  return (
    <div className="bookings-page">

      {/* =====================================
          BANNER
      ===================================== */}

      <section className="bookings-banner">

        <div className="bookings-banner-overlay"></div>

        <div className="bookings-banner-content">

          <p>MY ACCOUNT</p>

          <h1>
            My <span>Bookings</span>
          </h1>

          <div className="bookings-banner-line"></div>

          <span>
            View and manage your bookings
          </span>

        </div>

      </section>


      {/* =====================================
          MAIN SECTION
      ===================================== */}

      <section className="bookings-section">

        <div className="bookings-container">

          {/* SIDEBAR */}

          <aside className="bookings-sidebar">

            <div className="bookings-sidebar-title">

              <p>MY ACCOUNT</p>

              <h3>
                Account Menu
              </h3>

            </div>


            <nav className="bookings-navigation">

              <Link to="/account">
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

              <Link
                to="/bookings"
                className="bookings-nav-active"
              >
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


          {/* CONTENT */}

          <main className="bookings-content">

            {/* HEADER */}

            <div className="bookings-content-header">

              <div>

                <p>
                  BOOKING HISTORY
                </p>

                <h2>
                  My Bookings
                </h2>

                <span>
                  View all your interior
                  design bookings and
                  consultations.
                </span>

              </div>


              <Link
                to="/consultation"
                className="new-booking-button"
              >
                + New Booking
              </Link>

            </div>


            {/* ERROR */}

            {error && (
              <div className="bookings-error">
                {error}
              </div>
            )}


            {/* LOADING */}

            {loading && (

              <div className="bookings-message">

                <div className="booking-loader">
                  Loading...
                </div>

                <p>
                  Loading your bookings...
                </p>

              </div>

            )}


            {/* EMPTY */}

            {!loading &&
              bookings.length === 0 &&
              !error && (

                <div className="bookings-empty">

                  <div className="empty-booking-icon">
                    📋
                  </div>

                  <h3>
                    No Bookings Yet
                  </h3>

                  <p>
                    You don't have any
                    bookings yet. Book a
                    consultation with our
                    design team to get started.
                  </p>

                  <Link
                    to="/consultation"
                    className="empty-booking-button"
                  >
                    Book a Consultation →
                  </Link>

                </div>

              )}


            {/* BOOKING LIST */}

            {!loading &&
              bookings.length > 0 && (

                <div className="booking-list">

                  {bookings.map(
                    (booking, index) => (

                      <div
                        className="booking-card"
                        key={
                          booking._id ||
                          index
                        }
                      >

                        {/* TOP */}

                        <div className="booking-card-top">

                          <div className="booking-number">

                            <span>
                              BOOKING ID
                            </span>

                            <strong>
                              #
                              {getBookingId(
                                booking,
                                index
                              )}
                            </strong>

                          </div>


                          <div
                            className={`booking-status ${getStatus(
                              booking
                            )
                              .toLowerCase()
                              .replace(
                                /\s+/g,
                                "-"
                              )}`}
                          >
                            {getStatus(
                              booking
                            )}
                          </div>

                        </div>


                        {/* BODY */}

                        <div className="booking-card-body">

                          <div className="booking-main-info">

                            <div className="booking-icon">
                              🏠
                            </div>

                            <div>

                              <p>
                                INTERIOR DESIGN
                              </p>

                              <h3>
                                {booking.consultationType ||
                                  "Interior Design Consultation"}
                              </h3>

                              <div className="booking-location">

                                <span>
                                  📍
                                </span>

                                Online
                                Consultation

                              </div>

                            </div>

                          </div>


                          {/* DETAILS */}

                          <div className="booking-details">

                            <div className="booking-detail-item">

                              <span>
                                DATE
                              </span>

                              <strong>
                                {formatDate(
                                  booking.preferredDate
                                )}
                              </strong>

                            </div>


                            <div className="booking-detail-item">

                              <span>
                                TIME
                              </span>

                              <strong>
                                {booking.preferredTime ||
                                  "Not Available"}
                              </strong>

                            </div>


                            <div className="booking-detail-item">

                              <span>
                                BUDGET
                              </span>

                              <strong>
                                {booking.budget ||
                                  "Not Specified"}
                              </strong>

                            </div>


                            <div className="booking-detail-item">

                              <span>
                                BOOKED ON
                              </span>

                              <strong>
                                {formatDate(
                                  booking.createdAt
                                )}
                              </strong>

                            </div>

                          </div>

                        </div>


                        {/* FOOTER */}

                        <div className="booking-card-footer">

                          <div className="booking-confirmation">

                            <span className="confirmation-icon">
                              ✓
                            </span>

                            <span>
                              {booking.name ||
                                "Customer"}

                              {" • "}

                              {booking.email ||
                                "No email"}
                            </span>

                          </div>


                          <div className="booking-actions">

                            <button
                              className="booking-details-button"
                              onClick={() =>
                                viewDetails(
                                  booking,
                                  index
                                )
                              }
                            >
                              View Details
                            </button>


                            <Link
                              to="/consultation"
                              className="booking-consult-button"
                            >
                              Book Again
                            </Link>

                          </div>

                        </div>

                      </div>

                    )
                  )}

                </div>

              )}


            {/* HELP */}

            <div className="booking-help-box">

              <div className="booking-help-icon">
                ?
              </div>

              <div>

                <h4>
                  Need help with your booking?
                </h4>

                <p>
                  If you have any questions
                  about your booking, please
                  contact our design team.
                </p>

              </div>

              <Link to="/contact">
                Contact Us →
              </Link>

            </div>

          </main>

        </div>

      </section>

    </div>
  );
};

export default Bookings;

