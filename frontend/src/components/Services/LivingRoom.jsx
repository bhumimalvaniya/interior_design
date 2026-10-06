import React, { useEffect, useState } from "react";
import axios from "axios";
import "./LivingRoom.css";
import { Link } from "react-router-dom";
import API_URL from "../../config/api";

// const API_URL = "http://localhost:9000/api/v1";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=90";

const LivingRoom = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLivingRoomServices();
  }, []);

  const fetchLivingRoomServices = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/services/category/${encodeURIComponent("Living Room")}`
      );

      console.log("Living Room Services:", response.data);

      if (response.data?.success) {
        setServices(response.data.data || []);
      } else {
        setServices([]);
        setError(
          response.data?.message || "Unable to fetch Living Room services."
        );
      }
    } catch (err) {
      console.error(
        "Living Room Fetch Error:",
        err.response?.data || err.message
      );

      setServices([]);

      setError(
        err.response?.data?.message ||
          "Unable to load Living Room services."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="living-page">

      {/* =====================================================
          HERO SECTION
      ====================================================== */}
      <section className="living-hero">

        <img
          src={HERO_IMAGE}
          alt="Luxury living room interior"
          className="living-hero-image"
        />

        <div className="living-hero-overlay"></div>

        <div className="living-hero-content">

          <span className="living-hero-label">
            INTERIOR DESIGN SERVICES
          </span>

          <h1>
            Living Room
            <span> Design</span>
          </h1>

          <p>
            Create a living room that feels elegant, comfortable,
            functional and uniquely yours.
          </p>

          <div className="living-hero-line"></div>

        </div>
      </section>


      {/* =====================================================
          SERVICES SECTION
      ====================================================== */}
      <section className="living-services">

        <div className="living-container">

          {/* Section Header */}
          <div className="living-section-heading">

            <div className="living-heading-content">

              <span className="living-label">
                OUR SERVICES
              </span>

              <h2>
                Everything Your
                <span> Living Room Needs</span>
              </h2>

              <p>
                From elegant furniture arrangements to thoughtful
                lighting and beautiful finishes, we create living
                spaces designed around your lifestyle.
              </p>

            </div>

            {!loading && !error && services.length > 0 && (
              <div className="service-count">

                <strong>
                  {String(services.length).padStart(2, "0")}
                </strong>

                <span>
                  Available
                  <br />
                  Services
                </span>

              </div>
            )}

          </div>


          {/* =================================================
              LOADING
          ================================================== */}
          {loading && (
            <div className="living-loading">

              <div className="loading-spinner"></div>

              <h3>Loading Services</h3>

              <p>
                Please wait while we load our Living Room services...
              </p>

            </div>
          )}


          {/* =================================================
              ERROR
          ================================================== */}
          {!loading && error && (
            <div className="living-error">

              <div className="error-icon">!</div>

              <h3>Something went wrong</h3>

              <p>{error}</p>

              <button
                type="button"
                onClick={fetchLivingRoomServices}
                className="retry-button"
              >
                Try Again
              </button>

            </div>
          )}


          {/* =================================================
              NO DATA
          ================================================== */}
          {!loading && !error && services.length === 0 && (
            <div className="no-services">

              <div className="no-services-icon">
                ✦
              </div>

              <h3>No Services Available</h3>

              <p>
                There are currently no Living Room services
                available. Please check again later.
              </p>

              <button
                type="button"
                onClick={fetchLivingRoomServices}
                className="retry-button"
              >
                Refresh
              </button>

            </div>
          )}


          {/* =================================================
              SERVICE CARDS
          ================================================== */}
          {!loading && !error && services.length > 0 && (
            <div className="living-service-grid">

              {services.map((service, index) => (

                <article
                  className="living-service-card"
                  key={service._id || index}
                >

                  {/* IMAGE */}
                  <div className="service-image">

                    <img
                      src={service.image || FALLBACK_IMAGE}
                      alt={service.title || "Living Room Interior"}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = FALLBACK_IMAGE;
                      }}
                    />

                    <div className="service-image-overlay"></div>

                    <div className="service-number">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="service-category-badge">
                      {service.section || "Living Room"}
                    </div>

                  </div>


                  {/* CONTENT */}
                  <div className="service-content">

                    <span className="service-category">
                      {service.section || "Living Room"}
                    </span>

                    <h3>
                      {service.title || "Living Room Design"}
                    </h3>

                    {service.subtitle && (
                      <h4>
                        {service.subtitle}
                      </h4>
                    )}

                    {service.description && (
                      <p className="service-description">
                        {service.description}
                      </p>
                    )}

                    <Link to="/contact" className="arrow">
                    <div className="service-bottom">

                      <span className="service-line"></span>

                      <span className="service-arrow">
                       →
                      </span>

                    </div>
                      </Link> 
                  </div>

                </article>

              ))}

            </div>
          )}

        </div>

      </section>

    </main>
  );
};

export default LivingRoom;