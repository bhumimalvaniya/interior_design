
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Services.css";

// const API_URL = "http://localhost:9000";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:9000/api/v1";


const Services = () => {
  const [servicesData, setServicesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH SERVICES
  // ==========================================

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/api/v1/services/featch`
      );

      console.log("SERVICES API RESPONSE:", response.data);

      if (response.data.success) {
        setServicesData(response.data.data || []);
      } else {
        setError(
          response.data.message || "Unable to fetch services"
        );
      }
    } catch (error) {
      console.error("SERVICES FETCH ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Unable to connect with server"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="services-loading">
        Loading Services...
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="services-error">
        <h3>Unable to Load Services</h3>
        <p>{error}</p>

        <button onClick={fetchServices}>
          Try Again
        </button>
      </div>
    );
  }

  // ==========================================
  // NO DATA
  // ==========================================

  if (servicesData.length === 0) {
    return (
      <div className="services-empty">
        <h3>No Services Found</h3>
        <p>
          No active services are available in the database.
        </p>
      </div>
    );
  }

  // ==========================================
  // SERVICES
  // ==========================================

  return (
    <div className="services-page">

      {/* =====================================
          HERO
      ===================================== */}

      <section className="services-hero">

        <div className="services-hero-content">

          <p>OUR SERVICES</p>

          <h1>
            Designing Spaces
            <span> That Inspire</span>
          </h1>

          <p className="services-hero-description">
            From beautiful homes to inspiring workplaces,
            we create interiors that combine functionality,
            comfort and timeless design.
          </p>

          <Link
            to="/contact"
            className="services-hero-btn"
          >
            Start Your Project
          </Link>

        </div>

      </section>


      {/* =====================================
          INTRO
      ===================================== */}

      <section className="services-intro">

        <div className="services-intro-content">

          <p className="services-label">
            WHAT WE DO
          </p>

          <h2>
            Interior Design
            <span> With Purpose</span>
          </h2>

          <p>
            We create interiors that are beautiful,
            practical and completely personalized to
            your lifestyle.
          </p>

          <p>
            Every project begins with understanding
            your vision and ends with a space you are
            proud to call your own.
          </p>

          <Link
            to="/contact"
            className="services-text-link"
          >
            Discuss Your Project →
          </Link>

        </div>

      </section>


      {/* =====================================
          SERVICES
      ===================================== */}

      <section className="services-list">

        <div className="services-section-heading">

          <p className="services-label">
            OUR EXPERTISE
          </p>

          <h2>
            Explore Our
            <span> Services</span>
          </h2>

          <p>
            Discover our complete range of interior
            design solutions created for homes,
            offices and commercial spaces.
          </p>

        </div>


        <div className="services-grid">

          {servicesData.map((service, index) => (

            <div
              className="service-card"
              key={service._id}
            >

              {/* IMAGE */}

              <div className="service-card-image">

                <img
                  src={service.image}
                  alt={service.title || "Service"}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />

                <span className="service-number">
                  {service.number ||
                    String(index + 1).padStart(2, "0")}
                </span>

              </div>


              {/* CONTENT */}

              <div className="service-card-content">

                {/* SECTION */}

                <small>
                  {service.section}
                </small>

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

                <p>
                  {service.description}
                </p>

                {/* LINK */}

                <Link
                  to={service.link || "/contact"}
                >
                  Explore Service →
                </Link>

              </div>

            </div>

          ))}

        </div>

      </section>


      {/* =====================================
          WHY CHOOSE US
      ===================================== */}

      <section className="services-why">

        <div className="services-why-content">

          <p className="services-label">
            WHY CHOOSE US
          </p>

          <h2>
            We Design For
            <span> The Way You Live</span>
          </h2>

          <p>
            Our approach combines creativity,
            functionality and attention to detail
            to create interiors that are beautiful
            today and remain timeless for years to come.
          </p>

        </div>


        <div className="services-why-grid">

          <div className="services-why-card">

            <strong>01</strong>

            <h3>
              Creative Design
            </h3>

            <p>
              Unique concepts created according to
              your lifestyle, taste and requirements.
            </p>

          </div>


          <div className="services-why-card">

            <strong>02</strong>

            <h3>
              Quality Materials
            </h3>

            <p>
              Carefully selected materials and finishes
              that combine beauty with durability.
            </p>

          </div>


          <div className="services-why-card">

            <strong>03</strong>

            <h3>
              Expert Team
            </h3>

            <p>
              Experienced designers and professionals
              managing every part of your project.
            </p>

          </div>


          <div className="services-why-card">

            <strong>04</strong>

            <h3>
              Complete Service
            </h3>

            <p>
              From the first consultation to final
              execution, we handle everything for you.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================
          PROCESS
      ===================================== */}

      <section className="services-process">

        <div className="services-section-heading">

          <p className="services-label">
            OUR PROCESS
          </p>

          <h2>
            From Concept
            <span> To Completion</span>
          </h2>

          <p>
            Our simple four-step process makes your
            interior design journey easy and enjoyable.
          </p>

        </div>


        <div className="services-process-grid">

          <div className="services-process-card">

            <span>01</span>

            <h3>
              Consultation
            </h3>

            <p>
              We understand your needs, preferences,
              lifestyle and budget.
            </p>

          </div>


          <div className="services-process-card">

            <span>02</span>

            <h3>
              Concept
            </h3>

            <p>
              We develop a creative design concept
              specifically for your space.
            </p>

          </div>


          <div className="services-process-card">

            <span>03</span>

            <h3>
              Design
            </h3>

            <p>
              Materials, furniture, colors and finishes
              are carefully finalized.
            </p>

          </div>


          <div className="services-process-card">

            <span>04</span>

            <h3>
              Execution
            </h3>

            <p>
              Our team brings the approved design to
              life with professional execution.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================
          CTA
      ===================================== */}

      <section className="services-cta">

        <div className="services-cta-content">

          <p>
            READY TO START?
          </p>

          <h2>
            Let's Create Your
            <span> Dream Space</span>
          </h2>

          <p>
            Tell us about your project and let our
            design team transform your ideas into
            a beautiful interior.
          </p>

          <Link
            to="/contact"
            className="services-cta-btn"
          >
            Contact Us
          </Link>

        </div>

      </section>

    </div>
  );
};

export default Services;
