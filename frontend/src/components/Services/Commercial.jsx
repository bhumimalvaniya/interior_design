import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Commercial.css";

const API_URL = "http://localhost:9000/api/v1";

const Commercial = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH COMMERCIAL SERVICES
  // ==========================================

  useEffect(() => {
    fetchCommercialServices();
  }, []);

  const fetchCommercialServices = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/services/category/${encodeURIComponent(
          "Commercial Interior"
        )}`
      );

      console.log(
        "Commercial Services:",
        response.data
      );

      if (response.data.success) {
        setServices(response.data.data || []);
      } else {
        setError(
          response.data.message ||
            "Unable to fetch commercial services"
        );
      }
    } catch (error) {
      console.error(
        "Commercial Fetch Error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Unable to load commercial services."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="commercial-page">

      {/* =====================================
          HERO SECTION
      ===================================== */}

      <section className="commercial-hero">

        <div className="commercial-hero-overlay">

          <div className="commercial-hero-content">

            <p className="commercial-small-title">
              COMMERCIAL INTERIOR DESIGN
            </p>

            <h1>
              Spaces That
              <span> Grow Business</span>
            </h1>

            <p className="commercial-hero-text">
              Creative, functional and impressive
              commercial interiors designed to attract
              customers and strengthen your brand.
            </p>

            <Link
              to="/contactus"
              className="commercial-hero-btn"
            >
              Start Your Project
            </Link>

          </div>

        </div>

      </section>


      {/* =====================================
          INTRO SECTION
      ===================================== */}

      <section className="commercial-intro">

        <div className="commercial-intro-image">

          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=85"
            alt="Commercial interior"
          />

          <div className="commercial-experience-box">

            <strong>10+</strong>

            <span>
              Years of
              <br />
              Experience
            </span>

          </div>

        </div>


        <div className="commercial-intro-content">

          <p className="commercial-section-label">
            COMMERCIAL INTERIORS
          </p>

          <h2>
            Design That
            <span> Drives Success</span>
          </h2>

          <p>
            A commercial interior is more than
            decoration. It is an important part of
            your customer's experience and your
            brand identity.
          </p>

          <p>
            We create commercial environments that
            combine aesthetics, functionality and
            business requirements to create spaces
            that work for your customers and team.
          </p>

        </div>

      </section>


      {/* =====================================
          DYNAMIC COMMERCIAL SERVICES
      ===================================== */}

      <section className="commercial-spaces-section">

        <div className="commercial-section-heading">

          <p className="commercial-section-label">
            OUR SERVICES
          </p>

          <h2>
            Commercial Spaces We
            <span> Design</span>
          </h2>

          <p>
            Explore our professionally designed
            commercial interior services.
          </p>

        </div>


        {/* LOADING */}

        {loading && (
          <div className="commercial-loading">
            <div className="commercial-spinner"></div>

            <p>
              Loading commercial services...
            </p>
          </div>
        )}


        {/* ERROR */}

        {!loading && error && (
          <div className="commercial-error">

            <p>{error}</p>

            <button onClick={fetchCommercialServices}>
              Try Again
            </button>

          </div>
        )}


        {/* NO DATA */}

        {!loading &&
          !error &&
          services.length === 0 && (
            <div className="commercial-no-services">

              <h3>
                No Commercial Services Found
              </h3>

              <p>
                Please add Commercial services
                from the admin panel.
              </p>

            </div>
          )}


        {/* DYNAMIC DATA */}

        {!loading &&
          !error &&
          services.length > 0 && (

            <div className="commercial-spaces-grid">

              {services.map((service, index) => (

                <article
                  className="commercial-space-card"
                  key={service._id}
                >

                  {/* IMAGE */}

                  <div className="commercial-space-image">

                    <img
                      src={
                        service.image ||
                        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=85"
                      }
                      alt={service.title}
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=85";
                      }}
                    />

                    <span className="commercial-service-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                  </div>


                  {/* CONTENT */}

                  <div className="commercial-space-content">

                    <p className="commercial-service-category">
                      {service.section || "Commercial"}
                    </p>

                    <h3>
                      {service.title}
                    </h3>

                    {service.subtitle && (
                      <h4>
                        {service.subtitle}
                      </h4>
                    )}

                    <p>
                      {service.description}
                    </p>

                    <Link
                      to="/contactus"
                      className="commercial-space-link"
                    >
                      Explore Design →
                    </Link>

                  </div>

                </article>

              ))}

            </div>

          )}

      </section>


      {/* =====================================
          PROCESS SECTION
      ===================================== */}

      <section className="commercial-process-section">

        <div className="commercial-process-image">

          <img
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85"
            alt="Commercial design planning"
          />

        </div>


        <div className="commercial-process-content">

          <p className="commercial-section-label">
            OUR PROCESS
          </p>

          <h2>
            From Concept To
            <span> Completion</span>
          </h2>

          <p>
            Our structured process ensures your
            commercial project is carefully planned
            and professionally executed.
          </p>

        </div>

      </section>


      {/* =====================================
          CTA
      ===================================== */}

      <section className="commercial-cta">

        <div className="commercial-cta-content">

          <p>
            READY TO TRANSFORM YOUR BUSINESS SPACE?
          </p>

          <h2>
            Let's Build A
            <span> Space That Stands Out</span>
          </h2>

          <p>
            Tell us about your commercial project
            and let our interior designers create a
            space designed for your business success.
          </p>

          <Link
            to="/contactus"
            className="commercial-cta-btn"
          >
            Contact Us
          </Link>

        </div>

      </section>

    </div>
  );
};

export default Commercial;