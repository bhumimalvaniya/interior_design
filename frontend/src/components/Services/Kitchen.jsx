
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Kitchen.css";
import API_URL from "../../config/api";

// const API_URL = "http://localhost:9000/api/v1";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=85";

const Kitchen = () => {
  // =========================================================
  // DYNAMIC SERVICES STATE
  // =========================================================

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // FETCH KITCHEN SERVICES FROM NODE.JS
  // =========================================================

  useEffect(() => {
    const fetchKitchenServices = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `${API_URL}/services/category/${encodeURIComponent("Kitchen")}`
        );

        console.log("Kitchen Services:", response.data);

        setServices(response.data.data || []);
      } catch (err) {
        console.error("Kitchen services fetch error:", err);

        setError("Unable to load kitchen services.");
      } finally {
        setLoading(false);
      }
    };

    fetchKitchenServices();
  }, []);

  // =========================================================
  // STATIC EXPERTISE FEATURES
  // =========================================================

  const kitchenFeatures = [
    {
      number: "01",
      title: "Smart Storage",
      text: "Maximize every corner with intelligent cabinets, drawers and organized storage solutions.",
    },
    {
      number: "02",
      title: "Premium Materials",
      text: "We select durable and beautiful materials that create a sophisticated kitchen environment.",
    },
    {
      number: "03",
      title: "Modern Lighting",
      text: "Layered lighting solutions create the perfect balance of functionality and atmosphere.",
    },
    {
      number: "04",
      title: "Functional Layout",
      text: "Every kitchen is planned carefully to make cooking, cleaning and movement effortless.",
    },
  ];

  // =========================================================
  // IMAGE HELPER
  // =========================================================

  const getImageUrl = (image) => {
    if (!image) {
      return DEFAULT_IMAGE;
    }

    // If backend returns complete URL
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    // If backend returns local upload path
    return `http://localhost:9000/${image.replace(/^\/+/, "")}`;
  };

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="kitchen-page">

      {/* =====================================================
          HERO SECTION
      ===================================================== */}

      <section className="kitchen-hero">

        <div className="kitchen-hero-overlay">

          <div className="kitchen-hero-content">

            <p className="kitchen-small-title">
              INTERIOR DESIGN
            </p>

            <h1>
              Beautiful
              <span> Kitchen Design</span>
            </h1>

            <p className="kitchen-hero-text">
              Functional, elegant and modern kitchens designed
              around the way you live.
            </p>

            <Link
              to="/contactus"
              className="kitchen-hero-btn"
            >
              Start Your Project
            </Link>

          </div>

        </div>

      </section>


      {/* =====================================================
          INTRO SECTION
      ===================================================== */}

      <section className="kitchen-intro">

        <div className="kitchen-intro-image">

          <img
            src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85"
            alt="Modern kitchen interior"
          />

          <div className="kitchen-experience-box">

            <strong>10+</strong>

            <span>
              Years of
              <br />
              Experience
            </span>

          </div>

        </div>


        <div className="kitchen-intro-content">

          <p className="kitchen-section-label">
            KITCHEN INTERIORS
          </p>

          <h2>
            Where Style Meets
            <span> Functionality</span>
          </h2>

          <p>
            Your kitchen is more than just a place to prepare food.
            It is the heart of your home where family and friends
            come together.
          </p>

          <p>
            We design kitchens that combine practical layouts,
            beautiful materials and thoughtful details to create
            spaces that are enjoyable to use every day.
          </p>


          <div className="kitchen-check-list">

            <div>
              <span>✓</span>
              Customized Kitchen Layouts
            </div>

            <div>
              <span>✓</span>
              High Quality Materials
            </div>

            <div>
              <span>✓</span>
              Smart Storage Solutions
            </div>

            <div>
              <span>✓</span>
              Modern Lighting Design
            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          FEATURES SECTION
      ===================================================== */}

      <section className="kitchen-features-section">

        <div className="kitchen-section-heading">

          <p className="kitchen-section-label">
            OUR EXPERTISE
          </p>

          <h2>
            Designed For
            <span> Everyday Living</span>
          </h2>

          <p>
            Every detail is carefully planned to create a kitchen
            that is beautiful, practical and comfortable.
          </p>

        </div>


        <div className="kitchen-features-grid">

          {kitchenFeatures.map((feature) => (

            <div
              className="kitchen-feature-card"
              key={feature.number}
            >

              <span className="kitchen-feature-number">
                {feature.number}
              </span>

              <h3>
                {feature.title}
              </h3>

              <p>
                {feature.text}
              </p>

            </div>

          ))}

        </div>

      </section>


      {/* =====================================================
          DYNAMIC KITCHEN SERVICES
      ===================================================== */}

      <section className="kitchen-styles-section">

        <div className="kitchen-section-heading">

          <p className="kitchen-section-label">
            DESIGN STYLES
          </p>

          <h2>
            Find Your Perfect
            <span> Kitchen Style</span>
          </h2>

          <p>
            Explore our kitchen designs and discover the perfect
            style for your home.
          </p>

        </div>


        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (

          <div className="kitchen-loading">

            <p>
              Loading kitchen designs...
            </p>

          </div>

        )}


        {/* =================================================
            ERROR
        ================================================= */}

        {!loading && error && (

          <div className="kitchen-error">

            <p>
              {error}
            </p>

          </div>

        )}


        {/* =================================================
            NO DATA
        ================================================= */}

        {!loading &&
          !error &&
          services.length === 0 && (

            <div className="kitchen-no-data">

              <p>
                No kitchen services found.
              </p>

            </div>

          )}


        {/* =================================================
            DYNAMIC SERVICE CARDS
        ================================================= */}

        {!loading &&
          !error &&
          services.length > 0 && (

            <div className="kitchen-styles-grid">

              {services.map((service, index) => (

                <div
                  className="kitchen-style-card"
                  key={service._id || index}
                >

                  {/* IMAGE */}

                  <div className="kitchen-style-image">

                    <img
                      src={getImageUrl(service.image)}
                      alt={service.title || "Kitchen Design"}
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_IMAGE;
                      }}
                    />

                  </div>


                  {/* CONTENT */}

                  <div className="kitchen-style-content">

                    {/* NUMBER */}

                    {service.number && (
                      <span className="kitchen-style-number">
                        {service.number}
                      </span>
                    )}


                    {/* TITLE */}

                    <h3>
                      {service.title}
                    </h3>


                    {/* SUBTITLE */}

                    {service.subtitle && (
                      <h4>
                        {service.subtitle}
                      </h4>
                    )}


                    {/* DESCRIPTION */}

                    {service.description && (
                      <p>
                        {service.description}
                      </p>
                    )}


                    {/* LINK */}

                    {service.link && (

                      <Link to={service.link}>
                        Explore Design
                      </Link>

                    )}

                  </div>

                </div>

              ))}

            </div>

          )}

      </section>


      {/* =====================================================
          PROCESS SECTION
      ===================================================== */}

      <section className="kitchen-process-section">

        <div className="kitchen-process-image">

          <img
            src="https://images.unsplash.com/photo-1556912167-f556f1f39fdf?auto=format&fit=crop&w=1200&q=85"
            alt="Kitchen planning"
          />

        </div>


        <div className="kitchen-process-content">

          <p className="kitchen-section-label">
            OUR PROCESS
          </p>

          <h2>
            From Idea To
            <span> Your Dream Kitchen</span>
          </h2>

          <p>
            We make the kitchen design process simple and transparent,
            from the first consultation to final installation.
          </p>


          <div className="kitchen-process-list">

            <div className="kitchen-process-item">

              <span>01</span>

              <div>

                <h3>
                  Consultation
                </h3>

                <p>
                  We understand your lifestyle, requirements,
                  preferences and budget.
                </p>

              </div>

            </div>


            <div className="kitchen-process-item">

              <span>02</span>

              <div>

                <h3>
                  Planning
                </h3>

                <p>
                  We create an efficient layout and plan every
                  element of your kitchen.
                </p>

              </div>

            </div>


            <div className="kitchen-process-item">

              <span>03</span>

              <div>

                <h3>
                  Design
                </h3>

                <p>
                  Materials, colors, cabinets, lighting and
                  finishes are finalized.
                </p>

              </div>

            </div>


            <div className="kitchen-process-item">

              <span>04</span>

              <div>

                <h3>
                  Installation
                </h3>

                <p>
                  Our team brings the complete kitchen design
                  to life with professional installation.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          CTA SECTION
      ===================================================== */}

      <section className="kitchen-cta">

        <div className="kitchen-cta-content">

          <p>
            READY TO TRANSFORM YOUR KITCHEN?
          </p>

          <h2>
            Let's Create Your
            <span> Dream Kitchen</span>
          </h2>

          <p>
            Tell us about your kitchen requirements and let our
            designers create a beautiful space for you.
          </p>

          <Link
            to="/contactus"
            className="kitchen-cta-btn"
          >
            Contact Us
          </Link>

        </div>

      </section>

    </div>
  );
};

export default Kitchen;

