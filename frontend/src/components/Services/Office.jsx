
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Office.css";

const API_URL = "http://localhost:9000/api/v1";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=85";

const Office = () => {

  // =========================================================
  // DYNAMIC OFFICE SERVICES
  // =========================================================

  const [officeServices, setOfficeServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // FETCH OFFICE INTERIOR DATA
  // =========================================================

  useEffect(() => {

    const fetchOfficeServices = async () => {

      try {

        setLoading(true);
        setError("");

        const response = await axios.get(
          `${API_URL}/services/category/${encodeURIComponent(
            "Office Interior"
          )}`
        );

        console.log(
          "Office Interior Services:",
          response.data
        );

        setOfficeServices(
          response.data.data || []
        );

      } catch (err) {

        console.error(
          "Office services fetch error:",
          err
        );

        setError(
          "Unable to load office interior services."
        );

      } finally {

        setLoading(false);

      }

    };

    fetchOfficeServices();

  }, []);


  // =========================================================
  // IMAGE URL
  // =========================================================

  const getImageUrl = (image) => {

    if (!image) {
      return DEFAULT_IMAGE;
    }

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    return `http://localhost:9000/${image.replace(
      /^\/+/,
      ""
    )}`;

  };


  // =========================================================
  // STATIC OFFICE FEATURES
  // =========================================================

  const officeFeatures = [
    {
      number: "01",
      title: "Productive Workspace",
      text: "Create an organized workspace that improves concentration, productivity and everyday comfort.",
    },
    {
      number: "02",
      title: "Ergonomic Design",
      text: "We carefully plan furniture and layouts to provide a comfortable and healthy working environment.",
    },
    {
      number: "03",
      title: "Professional Look",
      text: "Elegant materials, furniture and finishes create a professional environment that represents your brand.",
    },
    {
      number: "04",
      title: "Smart Storage",
      text: "Customized cabinets, shelves and storage solutions keep your office organized and clutter-free.",
    },
  ];


  // =========================================================
  // PAGE
  // =========================================================

  return (

    <div className="office-page">


      {/* =====================================================
          HERO SECTION
      ===================================================== */}

      <section className="office-hero">

        <div className="office-hero-overlay">

          <div className="office-hero-content">

            <p className="office-small-title">
              OFFICE INTERIOR DESIGN
            </p>

            <h1>
              Inspiring
              <span> Office Spaces</span>
            </h1>

            <p className="office-hero-text">
              Modern, productive and professional office interiors
              designed around your people and your business.
            </p>

            <Link
              to="/contactus"
              className="office-hero-btn"
            >
              Start Your Project
            </Link>

          </div>

        </div>

      </section>


      {/* =====================================================
          INTRO SECTION
      ===================================================== */}

      <section className="office-intro">

        <div className="office-intro-image">

          <img
            src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85"
            alt="Modern office interior"
          />

          <div className="office-experience-box">

            <strong>10+</strong>

            <span>
              Years of
              <br />
              Experience
            </span>

          </div>

        </div>


        <div className="office-intro-content">

          <p className="office-section-label">
            OFFICE INTERIORS
          </p>

          <h2>
            Work Better In A
            <span> Better Space</span>
          </h2>

          <p>
            A thoughtfully designed office can improve productivity,
            employee comfort and the overall image of your business.
          </p>

          <p>
            We create office environments that combine functionality,
            aesthetics and brand identity to give your team a space
            they enjoy working in every day.
          </p>


          <div className="office-check-list">

            <div>
              <span>✓</span>
              Customized Office Layouts
            </div>

            <div>
              <span>✓</span>
              Ergonomic Furniture
            </div>

            <div>
              <span>✓</span>
              Smart Storage Solutions
            </div>

            <div>
              <span>✓</span>
              Professional Lighting
            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          FEATURES SECTION
      ===================================================== */}

      <section className="office-features-section">

        <div className="office-section-heading">

          <p className="office-section-label">
            OUR EXPERTISE
          </p>

          <h2>
            Designed For
            <span> Better Work</span>
          </h2>

          <p>
            We combine functionality, comfort and aesthetics to
            create workspaces that support your business goals.
          </p>

        </div>


        <div className="office-features-grid">

          {officeFeatures.map((feature) => (

            <div
              className="office-feature-card"
              key={feature.number}
            >

              <span className="office-feature-number">
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
          DYNAMIC OFFICE STYLES
      ===================================================== */}

      <section className="office-styles-section">

        <div className="office-section-heading">

          <p className="office-section-label">
            OFFICE STYLES
          </p>

          <h2>
            Find Your Perfect
            <span> Workspace</span>
          </h2>

          <p>
            Explore our latest office interior designs
            created for modern businesses.
          </p>

        </div>


        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (

          <div className="office-loading">

            <p>
              Loading office interior designs...
            </p>

          </div>

        )}


        {/* =================================================
            ERROR
        ================================================= */}

        {!loading && error && (

          <div className="office-error">

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
          officeServices.length === 0 && (

            <div className="office-no-data">

              <p>
                No office interior services found.
              </p>

            </div>

          )}


        {/* =================================================
            DYNAMIC CARDS
        ================================================= */}

        {!loading &&
          !error &&
          officeServices.length > 0 && (

            <div className="office-styles-grid">

              {officeServices.map(
                (service, index) => (

                  <div
                    className="office-style-card"
                    key={
                      service._id || index
                    }
                  >

                    {/* IMAGE */}

                    <div className="office-style-image">

                      <img
                        src={getImageUrl(
                          service.image
                        )}
                        alt={
                          service.title ||
                          "Office Interior"
                        }
                        onError={(e) => {
                          e.currentTarget.src =
                            DEFAULT_IMAGE;
                        }}
                      />

                    </div>


                    {/* CONTENT */}

                    <div className="office-style-content">

                      {service.number && (

                        <span className="office-style-number">
                          {service.number}
                        </span>

                      )}


                      <h3>
                        {service.title}
                      </h3>


                      {service.subtitle && (

                        <h4>
                          {service.subtitle}
                        </h4>

                      )}


                      {service.description && (

                        <p>
                          {service.description}
                        </p>

                      )}


                      {service.link && (

                        <Link to={service.link}>
                          Explore Design
                        </Link>

                      )}

                    </div>

                  </div>

                )
              )}

            </div>

          )}

      </section>


      {/* =====================================================
          OFFICE AREAS
      ===================================================== */}

      <section className="office-areas-section">

        <div className="office-areas-content">

          <p className="office-section-label">
            COMPLETE OFFICE SOLUTIONS
          </p>

          <h2>
            Every Area,
            <span> Thoughtfully Designed</span>
          </h2>

          <p>
            We design every part of your office to create a
            consistent and functional environment.
          </p>


          <div className="office-area-list">


            <div className="office-area-item">

              <span>01</span>

              <div>

                <h3>
                  Reception Area
                </h3>

                <p>
                  Create a welcoming first impression for your
                  clients and visitors.
                </p>

              </div>

            </div>


            <div className="office-area-item">

              <span>02</span>

              <div>

                <h3>
                  Workstations
                </h3>

                <p>
                  Comfortable and efficient workspaces designed
                  around your team's needs.
                </p>

              </div>

            </div>


            <div className="office-area-item">

              <span>03</span>

              <div>

                <h3>
                  Meeting Rooms
                </h3>

                <p>
                  Professional meeting spaces designed for
                  communication and collaboration.
                </p>

              </div>

            </div>


            <div className="office-area-item">

              <span>04</span>

              <div>

                <h3>
                  Executive Office
                </h3>

                <p>
                  Sophisticated private offices that combine
                  comfort, functionality and elegance.
                </p>

              </div>

            </div>


          </div>

        </div>


        <div className="office-areas-image">

          <img
            src="https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=1200&q=85"
            alt="Office workspace"
          />

        </div>

      </section>


      {/* =====================================================
          PROCESS SECTION
      ===================================================== */}

      <section className="office-process-section">

        <div className="office-process-image">

          <img
            src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=85"
            alt="Office design"
          />

        </div>


        <div className="office-process-content">

          <p className="office-section-label">
            OUR PROCESS
          </p>

          <h2>
            From Concept To
            <span> Complete Office</span>
          </h2>

          <p>
            Our complete office interior process ensures that
            every detail is planned and executed professionally.
          </p>


          <div className="office-process-list">


            <div className="office-process-item">

              <span>01</span>

              <div>

                <h3>
                  Consultation
                </h3>

                <p>
                  We understand your business, team requirements,
                  workspace needs and budget.
                </p>

              </div>

            </div>


            <div className="office-process-item">

              <span>02</span>

              <div>

                <h3>
                  Space Planning
                </h3>

                <p>
                  We plan workstations, meeting rooms, reception
                  and other areas for maximum efficiency.
                </p>

              </div>

            </div>


            <div className="office-process-item">

              <span>03</span>

              <div>

                <h3>
                  Design & Material
                </h3>

                <p>
                  Furniture, colors, lighting, materials and
                  finishes are selected according to your brand.
                </p>

              </div>

            </div>


            <div className="office-process-item">

              <span>04</span>

              <div>

                <h3>
                  Execution
                </h3>

                <p>
                  Our team manages the installation and completes
                  your office interior with attention to detail.
                </p>

              </div>

            </div>


          </div>

        </div>

      </section>


      {/* =====================================================
          CTA SECTION
      ===================================================== */}

      <section className="office-cta">

        <div className="office-cta-content">

          <p>
            READY TO TRANSFORM YOUR WORKSPACE?
          </p>

          <h2>
            Let's Create Your
            <span> Dream Office</span>
          </h2>

          <p>
            Tell us about your office requirements and let our
            interior designers create a productive and professional
            workspace for your business.
          </p>

          <Link
            to="/contactus"
            className="office-cta-btn"
          >
            Contact Us
          </Link>

        </div>

      </section>

    </div>
  );
};

export default Office;

