
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./AdminDashboard.css";
import API_URL from "../../config/api";

const AdminDashboard = () => {

  // =========================================
  // API URL
  // =========================================

  // const API_BASE_URL = "http://localhost:9000/api/v1";


  // =========================================
  // STATES
  // =========================================

  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [consultations, setConsultations] = useState([]);
 const [adminName, setAdminName] = useState("Admin");

  const [loading, setLoading] = useState(true);


  // =========================================
  // FETCH USERS
  // =========================================

  const fetchUsers = async () => {
    try {

      const response = await axios.get(
        // `${API_BASE_URL}/cust/featch`
         `${API_URL}/cust/featch`
      );

      console.log("USERS:", response.data);

      if (response.data.success) {
        setUsers(response.data.data || []);
      } else {
        setUsers([]);
      }

    } catch (error) {

      console.error(
        "GET USERS ERROR:",
        error.response?.data || error
      );

      setUsers([]);
    }
  };


  // =========================================
  // FETCH EVENTS
  // =========================================

  const fetchEvents = async () => {
    try {

      const response = await axios.get(
        // `${API_BASE_URL}/event/featch`
       `${API_URL}/event/featch`
      );

      console.log("EVENTS:", response.data);

      if (response.data.success) {
        setEvents(response.data.data || []);
      } else {
        setEvents([]);
      }

    } catch (error) {

      console.error(
        "GET EVENTS ERROR:",
        error.response?.data || error
      );

      setEvents([]);
    }
  };


  // =========================================
  // FETCH EVENT BOOKINGS
  // =========================================

  const fetchBookings = async () => {
    try {

      const response = await axios.get(
        // `${API_BASE_URL}/event/showallbook`
         `${API_URL}/event/showallbook`
      );

      console.log(
        "EVENT BOOKINGS:",
        response.data
      );

      if (response.data.success) {
        setBookings(response.data.data || []);
      } else {
        setBookings([]);
      }

    } catch (error) {

      console.error(
        "GET EVENT BOOKINGS ERROR:",
        error.response?.data || error
      );

      setBookings([]);
    }
  };


  // =========================================
  // FETCH CONSULTATION BOOKINGS
  // =========================================

  const fetchConsultations = async () => {
    try {

      const response = await axios.get(
        // `${API_BASE_URL}/consultation/featch`
        `${API_URL}/consultation/featch`
      );

      console.log(
        "CONSULTATIONS:",
        response.data
      );

      if (response.data.success) {
        setConsultations(
          response.data.data || []
        );
      } else {
        setConsultations([]);
      }

    } catch (error) {

      console.error(
        "GET CONSULTATIONS ERROR:",
        error.response?.data || error
      );

      setConsultations([]);
    }
  };


  

  // =========================================
  // FETCH ALL DASHBOARD DATA
  // =========================================

  const fetchDashboardData = async () => {

    try {

      setLoading(true);

      await Promise.all([
        fetchUsers(),
        fetchEvents(),
        fetchBookings(),
        fetchConsultations(),
        
      ]);

    } catch (error) {

      console.error(
        "DASHBOARD ERROR:",
        error
      );

    } finally {

      setLoading(false);

    }
  };


  // =========================================
  // LOAD DASHBOARD
  // =========================================

 useEffect(() => {
  const name = sessionStorage.getItem("adminName");

  if (name) {
    setAdminName(name);
  }

  fetchDashboardData();
}, []);


  // =========================================
  // COUNTS
  // =========================================

  const totalUsers = users.length;

  const totalEvents = events.length;

  const totalEventBookings = bookings.length;

  const totalConsultations =
    consultations.length;

  

  // =========================================
  // RECENT CONSULTATIONS
  // =========================================

  const recentConsultations =
    [...consultations]
      .sort((a, b) => {

        const dateA = new Date(
          a.createdAt || 0
        );

        const dateB = new Date(
          b.createdAt || 0
        );

        return dateB - dateA;

      })
      .slice(0, 5);


  // =========================================
  // RECENT EVENT BOOKINGS
  // =========================================

  const recentBookings =
    [...bookings]
      .sort((a, b) => {

        const dateA = new Date(
          a.bookingDate ||
          a.createdAt ||
          0
        );

        const dateB = new Date(
          b.bookingDate ||
          b.createdAt ||
          0
        );

        return dateB - dateA;

      })
      .slice(0, 5);


  // =========================================
  // FORMAT DATE
  // =========================================

  const formatDate = (date) => {

    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (
      isNaN(parsedDate.getTime())
    ) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  // =========================================
  // FORMAT PRICE
  // =========================================

  const formatPrice = (price) => {

    if (
      price === undefined ||
      price === null
    ) {
      return "₹0";
    }

    return `₹${Number(price).toLocaleString(
      "en-IN"
    )}`;
  };


  // =========================================
  // GET EVENT CUSTOMER NAME
  // =========================================

  const getCustomerName = (booking) => {

    return (
      booking.userId?.fnm ||
      booking.userId?.name ||
      booking.user?.fnm ||
      booking.user?.name ||
      booking.name ||
      booking.customerName ||
      "Customer"
    );
  };


  // =========================================
  // GET EVENT NAME
  // =========================================

  const getEventName = (booking) => {

    return (
      booking.eventId?.title ||
      booking.event?.title ||
      booking.title ||
      "Event"
    );
  };


  // =========================================
  // GET BOOKING STATUS
  // =========================================

  const getBookingStatus = (booking) => {

    return (
      booking.status ||
      booking.paymentStatus ||
      "Confirmed"
    );
  };


  // =========================================
  // GET CONSULTATION STATUS
  // =========================================

  const getConsultationStatus = (
    consultation
  ) => {

    return (
      consultation.status ||
      "Pending"
    );
  };


  // =========================================
  // LOADING
  // =========================================

  if (loading) {

    return (

      <div className="admin-dashboard">

        <div
          style={{
            padding: "50px",
            textAlign: "center",
            fontSize: "20px",
          }}
        >
          Loading Dashboard...
        </div>

      </div>

    );
  }


  // =========================================
  // RETURN
  // =========================================

  return (

    <div className="admin-dashboard">


      {/* =====================================
          WELCOME
      ===================================== */}

      <section className="admin-welcome">

        <div>

          <p>
            WELCOME BACK
          </p>

          <h2>
            Good Morning, {adminName}
          </h2>

          <span>
            Here's what's happening with your
            InteriorStudio today.
          </span>

        </div>


        <Link
          to="/admin/events/add"
          className="admin-add-button"
        >
          + Add New Event
        </Link>

      </section>


      {/* =====================================
          STATISTICS
      ===================================== */}

      <section className="admin-stats">


        {/* USERS */}

        <div className="admin-stat-card">

          <div className="admin-stat-top">

            <div className="admin-stat-icon">
              👥
            </div>

            <span className="admin-stat-change">
              Live
            </span>

          </div>

          <p>
            Total Users
          </p>

          <h3>
            {totalUsers}
          </h3>

          <span className="admin-stat-text">
            Registered users
          </span>

        </div>


        {/* EVENTS */}

        <div className="admin-stat-card">

          <div className="admin-stat-top">

            <div className="admin-stat-icon">
              📅
            </div>

            <span className="admin-stat-change">
              Live
            </span>

          </div>

          <p>
            Total Events
          </p>

          <h3>
            {totalEvents}
          </h3>

          <span className="admin-stat-text">
            Events in database
          </span>

        </div>


        {/* EVENT BOOKINGS */}

        <div className="admin-stat-card">

          <div className="admin-stat-top">

            <div className="admin-stat-icon">
              🎟️
            </div>

            <span className="admin-stat-change">
              Live
            </span>

          </div>

          <p>
            Event Bookings
          </p>

          <h3>
            {totalEventBookings}
          </h3>

          <span className="admin-stat-text">
            Customer event bookings
          </span>

        </div>


        {/* CONSULTATIONS */}

        <div className="admin-stat-card">

          <div className="admin-stat-top">

            <div className="admin-stat-icon">
              💬
            </div>

            <span className="admin-stat-change">
              Live
            </span>

          </div>

          <p>
            Consultations
          </p>

          <h3>
            {totalConsultations}
          </h3>

          <span className="admin-stat-text">
            Interior consultations
          </span>

        </div>


       
      </section>


      {/* =====================================
          CONTENT GRID
      ===================================== */}

      <section className="admin-content-grid">


        {/* =================================
            RECENT CONSULTATIONS
        ================================= */}

        <div className="admin-panel recent-bookings">

          <div className="admin-panel-header">

            <div>

              <p>
                CONSULTATION MANAGEMENT
              </p>

              <h2>
                Recent Consultations
              </h2>

            </div>

            <Link to="/admin/bookings">
              View All →
            </Link>

          </div>


          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>

                <tr>

                  <th>
                    #
                  </th>

                  <th>
                    Customer
                  </th>

                  <th>
                    Consultation
                  </th>

                  <th>
                    Date
                  </th>

                  <th>
                    Time
                  </th>

                  <th>
                    Budget
                  </th>

                  <th>
                    Status
                  </th>

                </tr>

              </thead>


              <tbody>

                {recentConsultations.length === 0 ? (

                  <tr>

                    <td
                      colSpan="7"
                      style={{
                        textAlign: "center",
                        padding: "30px",
                      }}
                    >
                      No consultation bookings found
                    </td>

                  </tr>

                ) : (

                  recentConsultations.map(
                    (consultation, index) => (

                      <tr
                        key={
                          consultation._id ||
                          index
                        }
                      >

                        <td>

                          <strong>
                            {index + 1}
                          </strong>

                        </td>


                        <td>

                          <strong>
                            {consultation.name ||
                              "Customer"}
                          </strong>

                          <br />

                          <small>
                            {consultation.email ||
                              "No email"}
                          </small>

                        </td>


                        <td>

                          {consultation.consultationType ||
                            "Interior Design"}

                        </td>


                        <td>

                          {formatDate(
                            consultation.preferredDate
                          )}

                        </td>


                        <td>

                          {consultation.preferredTime ||
                            "N/A"}

                        </td>


                        <td>

                          {consultation.budget ||
                            "Not specified"}

                        </td>


                        <td>

                          <span
                            className={`admin-status ${getConsultationStatus(
                              consultation
                            )
                              .toLowerCase()
                              .replace(
                                /\s+/g,
                                "-"
                              )}`}
                          >

                            {getConsultationStatus(
                              consultation
                            )}

                          </span>

                        </td>

                      </tr>

                    )
                  )

                )}

              </tbody>

            </table>

          </div>

        </div>


        

     


        {/* =================================
            RECENT EVENT BOOKINGS
        ================================= */}

        <div className="admin-panel recent-bookings">

          <div className="admin-panel-header">

            <div>

              <p>
                EVENT MANAGEMENT
              </p>

              <h2>
                Recent Event Bookings
              </h2>

            </div>

            <Link to="/admin/event-bookings">
              View All →
            </Link>

          </div>


          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>

                <tr>

                  <th>
                    ID
                  </th>

                  <th>
                    Customer
                  </th>

                  <th>
                    Event
                  </th>

                  <th>
                    Date
                  </th>

                  <th>
                    Price
                  </th>

                  <th>
                    Status
                  </th>

                </tr>

              </thead>


              <tbody>

                {recentBookings.length === 0 ? (

                  <tr>

                    <td
                      colSpan="6"
                      style={{
                        textAlign: "center",
                        padding: "30px",
                      }}
                    >
                      No event bookings found
                    </td>

                  </tr>

                ) : (

                  recentBookings.map(
                    (booking, index) => (

                      <tr
                        key={
                          booking._id ||
                          booking.id ||
                          index
                        }
                      >

                        <td>

                          <strong>
                            {booking.ticketId ||
                              booking._id ||
                              `#BK${index + 1}`}
                          </strong>

                        </td>


                        <td>

                          {getCustomerName(
                            booking
                          )}

                        </td>


                        <td>

                          {getEventName(
                            booking
                          )}

                        </td>


                        <td>

                          {formatDate(
                            booking.bookingDate ||
                            booking.createdAt
                          )}

                        </td>


                        <td>

                          {formatPrice(
                            booking.price
                          )}

                        </td>


                        <td>

                          <span
                            className={`admin-status ${getBookingStatus(
                              booking
                            )
                              .toLowerCase()
                              .replace(
                                /\s+/g,
                                "-"
                              )}`}
                          >

                            {getBookingStatus(
                              booking
                            )}

                          </span>

                        </td>

                      </tr>

                    )
                  )

                )}

              </tbody>

            </table>

          </div>

        </div>


      </section>


      {/* =====================================
          QUICK ACTIONS
      ===================================== */}

      <section className="quick-actions">

        <div className="quick-actions-header">

          <p>
            QUICK ACCESS
          </p>

          <h2>
            Quick Actions
          </h2>

        </div>


        <div className="quick-actions-grid">


          {/* ADD EVENT */}

          <Link
            to="/admin/events/add"
            className="quick-action"
          >

            <span>
              ＋
            </span>

            <div>

              <strong>
                Add Event
              </strong>

              <small>
                Create a new event
              </small>

            </div>

          </Link>


          {/* CONSULTATIONS */}

          <Link
            to="/admin/bookings"
            className="quick-action"
          >

            <span>
              💬
            </span>

            <div>

              <strong>
                Manage Consultations
              </strong>

              <small>
                View consultation bookings
              </small>

            </div>

          </Link>


          {/* CATEGORIES */}

          <Link
            to="/admin/categories"
            className="quick-action"
          >

            <span>
              ▤
            </span>

            <div>

              <strong>
                Manage Categories
              </strong>

              <small>
                Manage event categories
              </small>

            </div>

          </Link>


          {/* GALLERY */}

          <Link
            to="/admin/gallery/add"
            className="quick-action"
          >

            <span>
              ▧
            </span>

            <div>

              <strong>
                Add Gallery
              </strong>

              <small>
                Upload new images
              </small>

            </div>

          </Link>


          {/* USERS */}

          <Link
            to="/admin/users"
            className="quick-action"
          >

            <span>
              👥
            </span>

            <div>

              <strong>
                Manage Users
              </strong>

              <small>
                View all users
              </small>

            </div>

          </Link>


        </div>

      </section>


      {/* =====================================
          FOOTER
      ===================================== */}

      <footer className="admin-footer">

        <span>
          © 2026 InteriorStudio Admin Panel
        </span>

        <span>
          Dashboard
        </span>

      </footer>


    </div>

  );
};


export default AdminDashboard;
