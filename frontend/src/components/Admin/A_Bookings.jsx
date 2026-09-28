
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./A_Bookings.css";

const API_URL = "http://localhost:9000/api/v1";

const A_Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // PAGINATION
  // ==========================================

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // ==========================================
  // FETCH BOOKINGS
  // ==========================================

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/consultation/featch`
      );

      console.log(
        "ADMIN BOOKINGS RESPONSE:",
        response.data
      );

      if (response.data.success) {
        setBookings(response.data.data || []);
      } else {
        setError(
          response.data.message ||
            "Failed to fetch bookings."
        );
      }
    } catch (error) {
      console.error(
        "FETCH ADMIN BOOKINGS ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to connect to server."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // PAGINATION CALCULATIONS
  // ==========================================

  const totalBookings = bookings.length;

  const totalPages = Math.ceil(
    totalBookings / itemsPerPage
  );

  const indexOfLastBooking =
    currentPage * itemsPerPage;

  const indexOfFirstBooking =
    indexOfLastBooking - itemsPerPage;

  const currentBookings = bookings.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );

  // ==========================================
  // RESET PAGE WHEN ITEMS PER PAGE CHANGES
  // ==========================================

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  // ==========================================
  // CHANGE PAGE
  // ==========================================

  const goToPage = (page) => {
    if (
      page >= 1 &&
      page <= totalPages
    ) {
      setCurrentPage(page);
    }
  };

  // ==========================================
  // PAGE NUMBERS
  // ==========================================

  const getPageNumbers = () => {
    const pages = [];

    // If 7 or fewer pages,
    // show all pages.
    if (totalPages <= 7) {
      for (
        let i = 1;
        i <= totalPages;
        i++
      ) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Show dots if current page is far
      if (currentPage > 4) {
        pages.push("...");
      }

      const startPage = Math.max(
        2,
        currentPage - 1
      );

      const endPage = Math.min(
        totalPages - 1,
        currentPage + 1
      );

      for (
        let i = startPage;
        i <= endPage;
        i++
      ) {
        pages.push(i);
      }

      // Show dots before last page
      if (
        currentPage <
        totalPages - 3
      ) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  // ==========================================
  // DELETE CONSULTATION BOOKING
  // ==========================================

  const handleDelete = async (bookingId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this consultation booking?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      console.log(
        "Deleting booking:",
        bookingId
      );

      const response = await axios.delete(
        `${API_URL}/consultation/delete/${bookingId}`
      );

      console.log(
        "DELETE BOOKING RESPONSE:",
        response.data
      );

      if (response.data.success) {
        alert(
          "Consultation booking deleted successfully."
        );

        setBookings(
          (previousBookings) =>
            previousBookings.filter(
              (booking) =>
                booking._id !== bookingId
            )
        );

        // If last booking on current page
        // was deleted, move to previous page.
        if (
          currentBookings.length === 1 &&
          currentPage > 1
        ) {
          setCurrentPage(
            (previousPage) =>
              previousPage - 1
          );
        }
      } else {
        alert(
          response.data.message ||
            "Failed to delete consultation booking."
        );
      }
    } catch (error) {
      console.error(
        "DELETE CONSULTATION BOOKING ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete consultation booking."
      );
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
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
  // STATUS CLASS
  // ==========================================

  const getStatusClass = (status) => {
    return String(status || "Pending")
      .toLowerCase()
      .replace(/\s+/g, "-");
  };

  // ==========================================
  // VIEW BOOKING
  // ==========================================

  const viewBooking = (booking) => {
    alert(
      `Booking Details\n\n` +

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

        `Date: ${
          formatDate(
            booking.preferredDate
          )
        }\n` +

        `Time: ${
          booking.preferredTime ||
          "N/A"
        }\n` +

        `Budget: ${
          booking.budget ||
          "Not specified"
        }\n` +

        `Message: ${
          booking.message ||
          "No message"
        }\n` +

        `Status: ${
          booking.status ||
          "Pending"
        }`
    );
  };

  // ==========================================
  // UPDATE BOOKING STATUS
  // ==========================================

  const updateBookingStatus = async (
    bookingId,
    newStatus
  ) => {
    try {
      const response = await axios.put(
        `${API_URL}/consultation/status/${bookingId}`,
        {
          status: newStatus,
        }
      );

      console.log(
        "STATUS UPDATE RESPONSE:",
        response.data
      );

      if (response.data.success) {
        setBookings(
          (previousBookings) =>
            previousBookings.map(
              (booking) =>
                booking._id === bookingId
                  ? {
                      ...booking,
                      status: newStatus,
                    }
                  : booking
            )
        );

        alert(
          "Booking status updated successfully."
        );
      } else {
        alert(
          response.data.message ||
            "Failed to update status."
        );
      }
    } catch (error) {
      console.error(
        "UPDATE BOOKING STATUS ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update booking status."
      );
    }
  };

  // ==========================================
  // RETURN
  // ==========================================

  return (
    <div className="admin-bookings-page">

      {/* =====================================
          PAGE HEADER
      ===================================== */}

      <div className="admin-bookings-header">

        <div>
          <p className="admin-page-subtitle">
            BOOKING MANAGEMENT
          </p>

          <h1>
            Bookings
          </h1>

          <span>
            Manage all interior design
            consultation bookings.
          </span>
        </div>

        <button
          className="admin-refresh-button"
          onClick={fetchBookings}
          disabled={loading}
        >
          ↻ Refresh
        </button>

      </div>

      {/* =====================================
          STATISTICS
      ===================================== */}

      <div className="admin-booking-stats">

        {/* TOTAL */}

        <div className="admin-booking-stat-card">

          <div className="admin-stat-icon">
            📋
          </div>

          <div>
            <span>
              Total Bookings
            </span>

            <strong>
              {bookings.length}
            </strong>
          </div>

        </div>

        {/* PENDING */}

        <div className="admin-booking-stat-card">

          <div className="admin-stat-icon pending">
            ⏳
          </div>

          <div>
            <span>
              Pending
            </span>

            <strong>
              {
                bookings.filter(
                  (booking) =>
                    booking.status ===
                    "Pending"
                ).length
              }
            </strong>
          </div>

        </div>

        {/* CONFIRMED */}

        <div className="admin-booking-stat-card">

          <div className="admin-stat-icon confirmed">
            ✓
          </div>

          <div>
            <span>
              Confirmed
            </span>

            <strong>
              {
                bookings.filter(
                  (booking) =>
                    booking.status ===
                    "Confirmed"
                ).length
              }
            </strong>
          </div>

        </div>

        {/* COMPLETED */}

        <div className="admin-booking-stat-card">

          <div className="admin-stat-icon completed">
            ★
          </div>

          <div>
            <span>
              Completed
            </span>

            <strong>
              {
                bookings.filter(
                  (booking) =>
                    booking.status ===
                    "Completed"
                ).length
              }
            </strong>
          </div>

        </div>

      </div>

      {/* =====================================
          ERROR
      ===================================== */}

      {error && (
        <div className="admin-booking-error">
          {error}
        </div>
      )}

      {/* =====================================
          LOADING
      ===================================== */}

      {loading ? (

        <div className="admin-booking-loading">

          <div className="admin-booking-loader">
            Loading...
          </div>

          <p>
            Loading bookings from database...
          </p>

        </div>

      ) : bookings.length === 0 ? (

        /* =====================================
            EMPTY
        ===================================== */

        <div className="admin-booking-empty">

          <div>
            📋
          </div>

          <h3>
            No Bookings Found
          </h3>

          <p>
            There are currently no consultation
            bookings in the database.
          </p>

        </div>

      ) : (

        /* =====================================
            TABLE
        ===================================== */

        <div className="admin-bookings-table-card">

          {/* TABLE HEADER */}

          <div className="admin-table-header">

            <div>

              <h2>
                All Bookings
              </h2>

              <span>
                {bookings.length} booking
                {bookings.length !== 1
                  ? "s"
                  : ""}
              </span>

            </div>

            {/* ITEMS PER PAGE */}

            <div className="booking-page-size">

              <span>
                Show
              </span>

              <select
                value={itemsPerPage}
                onChange={(e) =>
                  setItemsPerPage(
                    Number(
                      e.target.value
                    )
                  )
                }
              >
                <option value={5}>
                  5
                </option>

                <option value={10}>
                  10
                </option>

                <option value={20}>
                  20
                </option>

                <option value={50}>
                  50
                </option>
              </select>

              <span>
                entries
              </span>

            </div>

          </div>

          {/* =====================================
              TABLE
          ===================================== */}

          <div className="admin-table-wrapper">

            <table className="admin-bookings-table">

              <thead>

                <tr>

                  <th>
                    #
                  </th>

                  <th>
                    CUSTOMER
                  </th>

                  <th>
                    CONSULTATION
                  </th>

                  <th>
                    DATE
                  </th>

                  <th>
                    TIME
                  </th>

                  <th>
                    BUDGET
                  </th>

                  <th>
                    STATUS
                  </th>

                  <th>
                    BOOKED ON
                  </th>

                  <th>
                    ACTION
                  </th>

                </tr>

              </thead>

              <tbody>

                {currentBookings.map(
                  (booking, index) => (

                    <tr
                      key={
                        booking._id ||
                        index
                      }
                    >

                      {/* NUMBER */}

                      <td>

                        <span className="booking-row-number">
                          {indexOfFirstBooking +
                            index +
                            1}
                        </span>

                      </td>

                      {/* CUSTOMER */}

                      <td>

                        <div className="admin-customer">

                          <div className="customer-avatar">

                            {booking.avatar ? (

                              <img
                                src={
                                  booking.avatar.startsWith(
                                    "http"
                                  )
                                    ? booking.avatar
                                    : `http://localhost:9000${booking.avatar}`
                                }
                                alt={
                                  booking.name ||
                                  "User"
                                }
                                onError={(e) => {
                                  e.target.style.display =
                                    "none";

                                  e.target.parentElement.classList.add(
                                    "avatar-fallback"
                                  );
                                }}
                              />

                            ) : (

                              booking.name
                                ?.charAt(
                                  0
                                )
                                ?.toUpperCase() ||
                              "U"

                            )}

                          </div>

                          <div>

                            <strong>
                              {booking.name ||
                                "Unknown"}
                            </strong>

                            <span>
                              {booking.email ||
                                "No email"}
                            </span>

                            <small>
                              {booking.phone ||
                                "No phone"}
                            </small>

                          </div>

                        </div>

                      </td>

                      {/* CONSULTATION */}

                      <td>

                        <div className="consultation-name">

                          <strong>
                            {
                              booking.consultationType ||
                              "Interior Design"
                            }
                          </strong>

                          {booking.message && (
                            <span>
                              {booking.message
                                .length >
                              35
                                ? booking.message.substring(
                                    0,
                                    35
                                  ) + "..."
                                : booking.message}
                            </span>
                          )}

                        </div>

                      </td>

                      {/* DATE */}

                      <td>

                        <span className="booking-date">
                          {formatDate(
                            booking.preferredDate
                          )}
                        </span>

                      </td>

                      {/* TIME */}

                      <td>

                        <span className="booking-time">
                          {booking.preferredTime ||
                            "N/A"}
                        </span>

                      </td>

                      {/* BUDGET */}

                      <td>

                        <strong className="booking-budget">
                          {booking.budget ||
                            "Not specified"}
                        </strong>

                      </td>

                      {/* STATUS */}

                      <td>

                        <select
                          className={`admin-booking-status-select ${getStatusClass(
                            booking.status
                          )}`}
                          value={
                            booking.status ||
                            "Pending"
                          }
                          onChange={(e) =>
                            updateBookingStatus(
                              booking._id,
                              e.target.value
                            )
                          }
                        >

                          <option value="Pending">
                            Pending
                          </option>

                          <option value="Confirmed">
                            Confirmed
                          </option>

                          <option value="Completed">
                            Completed
                          </option>

                          <option value="Cancelled">
                            Cancelled
                          </option>

                        </select>

                      </td>

                      {/* CREATED DATE */}

                      <td>

                        <span className="booking-created">
                          {formatDate(
                            booking.createdAt
                          )}
                        </span>

                      </td>

                      {/* ACTION */}

                      <td>

                        <div className="booking-action-buttons">

                          <button
                            className="admin-view-booking"
                            onClick={() =>
                              viewBooking(
                                booking
                              )
                            }
                          >
                            View
                          </button>

                          <button
                            className="admin-delete-booking"
                            onClick={() =>
                              handleDelete(
                                booking._id
                              )
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

          {/* =====================================
              PAGINATION
          ===================================== */}

          {totalBookings > 0 && (

            <div className="booking-pagination">

              {/* PAGINATION INFO */}

              <div className="booking-pagination-info">

                Showing{" "}

                <strong>
                  {indexOfFirstBooking + 1}
                </strong>

                {" "}to{" "}

                <strong>
                  {Math.min(
                    indexOfLastBooking,
                    totalBookings
                  )}
                </strong>

                {" "}of{" "}

                <strong>
                  {totalBookings}
                </strong>

                {" "}bookings

              </div>

              {/* PAGINATION BUTTONS */}

              <div className="booking-pagination-controls">

                {/* PREVIOUS */}

                <button
                  className="booking-pagination-arrow"
                  onClick={() =>
                    goToPage(
                      currentPage - 1
                    )
                  }
                  disabled={
                    currentPage === 1
                  }
                  title="Previous Page"
                >
                  ‹
                </button>

                {/* PAGE NUMBERS */}

                {getPageNumbers().map(
                  (page, index) =>

                    page === "..." ? (

                      <span
                        key={`dots-${index}`}
                        className="booking-pagination-dots"
                      >
                        ...
                      </span>

                    ) : (

                      <button
                        key={page}
                        className={`booking-pagination-number ${
                          currentPage === page
                            ? "active"
                            : ""
                        }`}
                        onClick={() =>
                          goToPage(page)
                        }
                      >
                        {page}
                      </button>

                    )
                )}

                {/* NEXT */}

                <button
                  className="booking-pagination-arrow"
                  onClick={() =>
                    goToPage(
                      currentPage + 1
                    )
                  }
                  disabled={
                    currentPage ===
                    totalPages
                  }
                  title="Next Page"
                >
                  ›
                </button>

              </div>

            </div>

          )}

        </div>

      )}

    </div>
  );
};

export default A_Bookings;

