import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Commercial2.css";

const API_URL = "http://localhost:9000/api/v1";
const BACKEND_URL = "http://localhost:9000";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=85";

const Commercial2 = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================
  // FETCH COMMERCIAL PROJECTS
  // =========================================

  useEffect(() => {
    fetchCommercialProjects();
  }, []);

  const fetchCommercialProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/project/commercial`
      );

      console.log(
        "COMMERCIAL PROJECT API RESPONSE:",
        response.data
      );

      if (response.data.success) {
        const commercialProjects = response.data.data || [];

        console.log(
          "COMMERCIAL PROJECTS:",
          commercialProjects
        );

        setProjects(commercialProjects);
      } else {
        setError(
          response.data.message ||
            "Unable to fetch commercial projects."
        );
      }
    } catch (error) {
      console.error(
        "FETCH COMMERCIAL PROJECT ERROR:",
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

  // =========================================
  // IMAGE URL
  // =========================================

  const getImageUrl = (image) => {
    if (!image) {
      return DEFAULT_IMAGE;
    }

    // Cloudinary / Unsplash / external image
    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    // Local backend image
    return `${BACKEND_URL}${image}`;
  };

  // =========================================
  // STATIC SERVICES
  // =========================================

  const services = [
    {
      number: "01",
      title: "Office Design",
      text: "Professional workspaces designed to improve productivity, comfort and collaboration.",
    },
    {
      number: "02",
      title: "Retail Design",
      text: "Attractive retail environments designed to strengthen your brand and customer experience.",
    },
    {
      number: "03",
      title: "Hospitality Design",
      text: "Welcoming restaurants, cafes and hospitality spaces designed around your customers.",
    },
    {
      number: "04",
      title: "Brand Spaces",
      text: "Unique commercial environments that communicate your company's identity and values.",
    },
  ];

  return (
    <div className="commercial-page">

      {/* =========================================
          HERO
      ========================================= */}

      <section className="commercial-hero">

        <div className="commercial-hero-content">

          <p className="commercial-label">
            COMMERCIAL INTERIORS
          </p>

          <h1>
            Spaces Designed
            <span> For Business</span>
          </h1>

          <p className="commercial-hero-description">
            Inspiring commercial interiors that combine brand
            identity, functionality and modern design to create
            spaces where businesses can grow.
          </p>

          <Link
            to="/contactus"
            className="commercial-hero-btn"
          >
            Start Your Project
          </Link>

        </div>

      </section>

      {/* =========================================
          INTRO
      ========================================= */}

      <section className="commercial-intro">

        <div className="commercial-intro-image">

          <img
            src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=85"
            alt="Commercial interior"
          />

          <div className="commercial-intro-badge">
            <strong>40+</strong>

            <span>
              Business
              <br />
              Spaces
            </span>
          </div>

        </div>

        <div className="commercial-intro-content">

          <p className="commercial-label">
            COMMERCIAL DESIGN
          </p>

          <h2>
            Designed For
            <span> Your Business</span>
          </h2>

          <p>
            A commercial space is more than just a place to work.
            It represents your brand, your people and the experience
            you provide to your customers.
          </p>

          <p>
            Our commercial interior design solutions combine
            functionality, aesthetics and brand identity to create
            environments that are both impressive and practical.
          </p>

          <div className="commercial-check-list">

            <div>
              <span>✓</span>
              Brand-Focused Design
            </div>

            <div>
              <span>✓</span>
              Smart Space Planning
            </div>

            <div>
              <span>✓</span>
              Professional Execution
            </div>

            <div>
              <span>✓</span>
              Modern Materials
            </div>

          </div>

        </div>

      </section>

      {/* =========================================
          PROJECTS - DYNAMIC
      ========================================= */}

      <section className="commercial-projects">

        <div className="commercial-section-heading">

          <p className="commercial-label">
            OUR COMMERCIAL WORK
          </p>

          <h2>
            Spaces That
            <span> Make An Impact</span>
          </h2>

          <p>
            Explore our collection of commercial interior projects
            created for businesses across different industries.
          </p>

        </div>

        {/* LOADING */}

        {loading && (
          <div className="commercial-loading">
            <p>Loading commercial projects...</p>
          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div className="commercial-error">
            <p>{error}</p>
          </div>
        )}

        {/* EMPTY */}

        {!loading &&
          !error &&
          projects.length === 0 && (
            <div className="commercial-empty">
              <h3>No Commercial Projects Found</h3>

              <p>
                Commercial projects will appear here after
                adding them from the admin panel.
              </p>
            </div>
          )}

        {/* PROJECT GRID */}

        {!loading &&
          !error &&
          projects.length > 0 && (
            <div className="commercial-project-grid">

              {projects.map((project, index) => (

                <div
                  className="commercial-project-card"
                  key={project._id || index}
                >

                  <div className="commercial-project-image">

                    <img
                      src={getImageUrl(project.image)}
                      alt={project.title}
                      onError={(e) => {
                        e.target.src = DEFAULT_IMAGE;
                      }}
                    />

                    <span className="commercial-project-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                  </div>

                  <div className="commercial-project-content">

                    <span className="commercial-project-category">
                      {project.style || "Commercial Interior"}
                    </span>

                    <h3>
                      {project.title}
                    </h3>

                    <p>
                      {project.description ||
                        "A professionally designed commercial interior created to combine functionality, comfort and modern design."}
                    </p>

                    <div className="commercial-project-location">
                      📍 {project.location}
                    </div>

                    {project.status && (
                      <span
                        className={`commercial-project-status ${
                          project.status.toLowerCase()
                        }`}
                      >
                        {project.status}
                      </span>
                    )}

                    <Link
                      to="/contactus"
                      className="commercial-project-link"
                    >
                      Discuss Similar Project →
                    </Link>

                  </div>

                </div>

              ))}

            </div>
          )}

      </section>

      {/* =========================================
          SERVICES
      ========================================= */}

      <section className="commercial-services">

        <div className="commercial-section-heading">

          <p className="commercial-label">
            WHAT WE DESIGN
          </p>

          <h2>
            Commercial
            <span> Design Solutions</span>
          </h2>

          <p>
            From offices to retail spaces, we create interiors
            that support your business goals.
          </p>

        </div>

        <div className="commercial-services-grid">

          {services.map((service) => (

            <div
              className="commercial-service-card"
              key={service.number}
            >

              <span className="commercial-service-number">
                {service.number}
              </span>

              <h3>
                {service.title}
              </h3>

              <p>
                {service.text}
              </p>

            </div>

          ))}

        </div>

      </section>

      {/* =========================================
          BUSINESS SPACE SECTION
      ========================================= */}

      <section className="commercial-business">

        <div className="commercial-business-content">

          <p className="commercial-label">
            SMART COMMERCIAL SPACES
          </p>

          <h2>
            Every Detail
            <span> Has A Purpose</span>
          </h2>

          <p>
            We carefully plan layouts, lighting, furniture,
            materials and finishes to create commercial interiors
            that are comfortable, efficient and visually impressive.
          </p>

          <div className="commercial-business-list">

            <div className="commercial-business-item">

              <span>01</span>

              <div>
                <h3>Efficient Layouts</h3>

                <p>
                  Smart layouts that make the best use of available
                  commercial space.
                </p>
              </div>

            </div>

            <div className="commercial-business-item">

              <span>02</span>

              <div>
                <h3>Brand Identity</h3>

                <p>
                  Interior elements that communicate your brand
                  personality and values.
                </p>
              </div>

            </div>

            <div className="commercial-business-item">

              <span>03</span>

              <div>
                <h3>Customer Experience</h3>

                <p>
                  Spaces designed to make customers feel comfortable
                  and connected with your business.
                </p>
              </div>

            </div>

            <div className="commercial-business-item">

              <span>04</span>

              <div>
                <h3>Future Ready</h3>

                <p>
                  Flexible interiors that can adapt to your business
                  as it grows.
                </p>
              </div>

            </div>

          </div>

        </div>

        <div className="commercial-business-image">

          <img
            src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85"
            alt="Modern office interior"
          />

        </div>

      </section>

      {/* =========================================
          PROCESS
      ========================================= */}

      <section className="commercial-process">

        <div className="commercial-section-heading">

          <p className="commercial-label">
            OUR PROCESS
          </p>

          <h2>
            From Business Idea
            <span> To Finished Space</span>
          </h2>

          <p>
            A structured design process that keeps your project
            clear, efficient and focused.
          </p>

        </div>

        <div className="commercial-process-grid">

          <div className="commercial-process-card">
            <span>01</span>

            <h3>Understand</h3>

            <p>
              We understand your business, requirements,
              target audience and budget.
            </p>
          </div>

          <div className="commercial-process-card">
            <span>02</span>

            <h3>Plan</h3>

            <p>
              We develop layouts and space plans based on
              your business requirements.
            </p>
          </div>

          <div className="commercial-process-card">
            <span>03</span>

            <h3>Design</h3>

            <p>
              Materials, colors, furniture and lighting are
              selected to create your final design.
            </p>
          </div>

          <div className="commercial-process-card">
            <span>04</span>

            <h3>Execute</h3>

            <p>
              Our team manages the implementation and
              delivers your completed commercial space.
            </p>
          </div>

        </div>

      </section>

      {/* =========================================
          CTA
      ========================================= */}

      <section className="commercial-cta">

        <div className="commercial-cta-content">

          <p>
            HAVE A COMMERCIAL PROJECT?
          </p>

          <h2>
            Let's Design A Space
            <span> That Works</span>
          </h2>

          <p>
            Tell us about your business and let our designers
            create a commercial interior that supports your
            brand and goals.
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

export default Commercial2;