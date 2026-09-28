import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Bedroom.css";

const API_URL = "http://localhost:9000/api/v1";

const Bedroom = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBedroomServices();
  }, []);

  const fetchBedroomServices = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/services/category/${encodeURIComponent("Bedroom")}`
      );

      console.log("Bedroom Services:", response.data);

      if (response.data.success) {
        setServices(response.data.data || []);
      } else {
        setError(
          response.data.message || "Unable to fetch bedroom services"
        );
      }
    } catch (error) {
      console.error(
        "Bedroom Fetch Error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Unable to load bedroom services."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bedroom-page">

      {/* =====================================
          HERO SECTION
      ===================================== */}

      <section className="bedroom-hero">

        <div className="bedroom-hero-overlay">

          <div className="bedroom-hero-content">

            <p className="bedroom-small-title">
              INTERIOR DESIGN
            </p>

            <h1>
              Beautiful
              <span> Bedroom Design</span>
            </h1>

            <p className="bedroom-hero-text">
              Peaceful, comfortable and personalized bedrooms
              designed to help you relax and feel at home.
            </p>

            <Link
              to="/contactus"
              className="bedroom-hero-btn"
            >
              Start Your Project
            </Link>

          </div>

        </div>

      </section>


      {/* =====================================
          INTRO SECTION
      ===================================== */}

      <section className="bedroom-intro">

        <div className="bedroom-intro-image">

          <img
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85"
            alt="Modern bedroom interior"
          />

          <div className="bedroom-experience-box">
            <strong>10+</strong>

            <span>
              Years of
              <br />
              Experience
            </span>
          </div>

        </div>


        <div className="bedroom-intro-content">

          <p className="bedroom-section-label">
            BEDROOM INTERIORS
          </p>

          <h2>
            Your Personal
            <span> Retreat</span>
          </h2>

          <p>
            Your bedroom should be more than just a place to sleep.
            It should be a peaceful retreat where you can relax,
            recharge and enjoy your personal space.
          </p>

          <p>
            We carefully combine furniture, colors, textures,
            lighting and storage to create bedrooms that are both
            beautiful and functional.
          </p>

          <div className="bedroom-check-list">

            <div>
              <span>✓</span>
              Customized Bedroom Layouts
            </div>

            <div>
              <span>✓</span>
              Premium Furniture
            </div>

            <div>
              <span>✓</span>
              Smart Storage Solutions
            </div>

            <div>
              <span>✓</span>
              Relaxing Lighting Design
            </div>

          </div>

        </div>

      </section>


      {/* =====================================
          DYNAMIC BEDROOM SERVICES
      ===================================== */}

      <section className="bedroom-services-section">

        <div className="bedroom-section-heading">

          <p className="bedroom-section-label">
            OUR SERVICES
          </p>

          <h2>
            Everything Your
            <span> Bedroom Needs</span>
          </h2>

          <p>
            Explore our professionally designed bedroom
            interior services tailored to your lifestyle.
          </p>

        </div>


        {/* LOADING */}

        {loading && (
          <div className="bedroom-loading">
            <div className="bedroom-spinner"></div>
            <p>Loading bedroom services...</p>
          </div>
        )}


        {/* ERROR */}

        {!loading && error && (
          <div className="bedroom-error">

            <p>{error}</p>

            <button onClick={fetchBedroomServices}>
              Try Again
            </button>

          </div>
        )}


        {/* NO DATA */}

        {!loading &&
          !error &&
          services.length === 0 && (
            <div className="bedroom-no-services">

              <h3>No Bedroom Services Found</h3>

              <p>
                Please add Bedroom services from the admin panel.
              </p>

            </div>
          )}


        {/* SERVICES */}

        {!loading &&
          !error &&
          services.length > 0 && (

            <div className="bedroom-services-grid">

              {services.map((service, index) => (

                <article
                  className="bedroom-service-card"
                  key={service._id}
                >

                  {/* IMAGE */}

                  <div className="bedroom-service-image">

                    <img
                      src={
                        service.image ||
                        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=85"
                      }
                      alt={service.title}
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=85";
                      }}
                    />

                    <span className="bedroom-service-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                  </div>


                  {/* CONTENT */}

                  <div className="bedroom-service-content">

                    <p className="bedroom-service-category">
                      {service.section || "Bedroom"}
                    </p>

                    <h3>
                      {service.title}
                    </h3>

                    {service.subtitle && (
                      <h4>
                        {service.subtitle}
                      </h4>
                    )}

                    <p className="bedroom-service-description">
                      {service.description}
                    </p>

                    <div className="bedroom-service-footer">

                      <span></span>

                      <span className="bedroom-service-arrow">
                        →
                      </span>

                    </div>

                  </div>

                </article>

              ))}

            </div>

          )}

      </section>


      {/* =====================================
          PROCESS SECTION
      ===================================== */}

      <section className="bedroom-process-section">

        <div className="bedroom-process-image">

          <img
            src="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=85"
            alt="Bedroom interior planning"
          />

        </div>

        <div className="bedroom-process-content">

          <p className="bedroom-section-label">
            OUR PROCESS
          </p>

          <h2>
            From Idea To
            <span> Your Dream Bedroom</span>
          </h2>

          <p>
            We make your bedroom design journey simple and
            comfortable, from the first consultation to final
            installation.
          </p>

          <div className="bedroom-process-list">

            <div className="bedroom-process-item">
              <span>01</span>

              <div>
                <h3>Consultation</h3>

                <p>
                  We understand your lifestyle, preferences,
                  requirements and budget.
                </p>
              </div>
            </div>

            <div className="bedroom-process-item">
              <span>02</span>

              <div>
                <h3>Planning</h3>

                <p>
                  We create an efficient bedroom layout with
                  furniture and storage placement.
                </p>
              </div>
            </div>

            <div className="bedroom-process-item">
              <span>03</span>

              <div>
                <h3>Design</h3>

                <p>
                  Colors, materials, furniture, lighting and
                  decorative elements are finalized.
                </p>
              </div>
            </div>

            <div className="bedroom-process-item">
              <span>04</span>

              <div>
                <h3>Installation</h3>

                <p>
                  Our team completes the installation and brings
                  your bedroom design to life.
                </p>
              </div>
            </div>

          </div>

        </div>

      </section>


      {/* =====================================
          CTA
      ===================================== */}

      <section className="bedroom-cta">

        <div className="bedroom-cta-content">

          <p>
            READY TO TRANSFORM YOUR BEDROOM?
          </p>

          <h2>
            Let's Create Your
            <span> Dream Bedroom</span>
          </h2>

          <p>
            Tell us about your bedroom requirements and let our
            interior designers create a beautiful and relaxing space.
          </p>

          <Link
            to="/contactus"
            className="bedroom-cta-btn"
          >
            Contact Us
          </Link>

        </div>

      </section>

    </div>
  );
};

export default Bedroom; 