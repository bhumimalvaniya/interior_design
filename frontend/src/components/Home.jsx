
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Home.css";
import API_URL from "../config/api";

// ======================================================
// API URL
// Local:
// http://localhost:9000/api/v1
//
// Live Render:
// Set VITE_API_URL in Render environment variables
// ======================================================

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:9000/api/v1";

// ======================================================
// FALLBACK IMAGE
// ======================================================
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=90";


// ======================================================
// IMAGE URL HELPER
// ======================================================
const getImageUrl = (image) => {
  if (!image) {
    return FALLBACK_IMAGE;
  }

  // Cloudinary / complete URL
  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  // Backend local upload
  if (image.startsWith("/uploads/")) {
    const backendBaseUrl = API_URL.replace("/api/v1", "");
    return `${backendBaseUrl}${image}`;
  }

  // Other relative image paths
  return image;
};


// ======================================================
// HOME COMPONENT
// ======================================================
const Home = () => {
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [gallery, setGallery] = useState([]);

  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingGallery, setLoadingGallery] = useState(true);

  const [serviceError, setServiceError] = useState("");
  const [projectError, setProjectError] = useState("");
  const [galleryError, setGalleryError] = useState("");


  // ======================================================
  // FETCH DATA WHEN HOME PAGE LOADS
  // ======================================================
  useEffect(() => {
    fetchServices();
    fetchProjects();
    fetchGallery();
  }, []);


  // ======================================================
  // FETCH SERVICES
  // ======================================================
  const fetchServices = async () => {
    try {
      setLoadingServices(true);
      setServiceError("");

      const response = await axios.get(
        `${API_URL}/services/featch`
      );

      console.log("Home Services:", response.data);

      if (response.data?.success) {
        const serviceData = response.data.data || [];

        // Show only active services if status exists
        const activeServices = serviceData.filter(
          (service) =>
            !service.status ||
            service.status.toLowerCase() === "active"
        );

        // Show first 4 services on Home
        setServices(activeServices.slice(0, 4));
      } else {
        setServices([]);
        setServiceError(
          response.data?.message || "Unable to load services."
        );
      }
    } catch (error) {
      console.error(
        "Home Services Error:",
        error.response?.data || error.message
      );

      setServices([]);
      setServiceError("Unable to load services.");
    } finally {
      setLoadingServices(false);
    }
  };


  // ======================================================
  // FETCH PROJECTS
  // ======================================================
  const fetchProjects = async () => {
    try {
      setLoadingProjects(true);
      setProjectError("");

      const response = await axios.get(
        `${API_URL}/project/featch`
      );

      console.log("Home Projects:", response.data);

      if (response.data?.success) {
        const projectData = response.data.data || [];

        // Show first 6 projects
        setProjects(projectData.slice(0, 6));
      } else {
        setProjects([]);
        setProjectError(
          response.data?.message || "Unable to load projects."
        );
      }
    } catch (error) {
      console.error(
        "Home Projects Error:",
        error.response?.data || error.message
      );

      setProjects([]);
      setProjectError("Unable to load projects.");
    } finally {
      setLoadingProjects(false);
    }
  };


  // ======================================================
  // FETCH GALLERY
  // ======================================================
  const fetchGallery = async () => {
    try {
      setLoadingGallery(true);
      setGalleryError("");

      const response = await axios.get(
        `${API_URL}/gallary/featch`
      );

      console.log("Home Gallery:", response.data);

      if (response.data?.success) {
        const galleryData = response.data.data || [];

        // Show first 6 gallery images
        setGallery(galleryData.slice(0, 6));
      } else {
        setGallery([]);
        setGalleryError(
          response.data?.message || "Unable to load gallery."
        );
      }
    } catch (error) {
      console.error(
        "Home Gallery Error:",
        error.response?.data || error.message
      );

      setGallery([]);
      setGalleryError("Unable to load gallery.");
    } finally {
      setLoadingGallery(false);
    }
  };


  // ======================================================
  // RETURN HOME PAGE
  // ======================================================
  return (
    <main className="home-page">


      {/* ==================================================
          HERO SECTION
      ================================================== */}
      <section
        className="hero-section"
        style={{
          backgroundImage: `url(${HERO_IMAGE})`,
        }}
      >
        <div className="hero-overlay">

          <div className="hero-content">

            <p className="hero-small-title">
              INTERIOR DESIGN STUDIO
            </p>

            <h1>
              Transform Your Space
              <br />
              <span>Into Something Beautiful</span>
            </h1>

            <p className="hero-description">
              We create elegant, functional and timeless interiors
              designed around your lifestyle.
            </p>

            <div className="hero-buttons">

              <Link
                to="/services/living-room"
                className="primary-btn"
              >
                Explore Services
              </Link>

              <Link
                to="/projects/residential"
                className="secondary-btn"
              >
                View Projects
              </Link>

            </div>

          </div>

        </div>
      </section>


      {/* ==================================================
          SERVICES SECTION
      ================================================== */}
      <section className="features-section">

        <div className="section-heading">

          <p>OUR SERVICES</p>

          <h2>
            Interior Design For
            <span> Every Space</span>
          </h2>

          <p className="section-description">
            From living rooms and bedrooms to kitchens and
            offices, we design spaces that reflect your style.
          </p>

        </div>


        {loadingServices ? (

          <div className="home-loading">
            <div className="loading-spinner"></div>
            <p>Loading services...</p>
          </div>

        ) : serviceError ? (

          <div className="home-error">
            <p>{serviceError}</p>

            <button
              type="button"
              onClick={fetchServices}
            >
              Try Again
            </button>
          </div>

        ) : services.length === 0 ? (

          <div className="home-empty">
            <p>No services available.</p>
          </div>

        ) : (

          <div className="features-container">

            {services.map((service, index) => (

              <div
                className="feature-card"
                key={service._id || index}
              >

                <div className="feature-image">

                  <img
                    src={getImageUrl(service.image)}
                    alt={
                      service.title ||
                      "Interior Design Service"
                    }
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src =
                        FALLBACK_IMAGE;
                    }}
                  />

                </div>

                <div className="feature-content">

                  <span className="feature-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <h3>
                    {service.title ||
                      service.section ||
                      "Interior Design"}
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

                  <Link
                    to="/services/living-room"
                    className="feature-link"
                  >
                    Explore →
                  </Link>

                </div>

              </div>

            ))}

          </div>

        )}

        <div className="home-section-button">

          <Link
            to="/services/living-room"
            className="about-btn"
          >
            View All Services
          </Link>

        </div>

      </section>


      {/* ==================================================
          ABOUT SECTION
      ================================================== */}
      <section className="about-home-section">

        <div className="about-image">

          <img
            src={HERO_IMAGE}
            alt="Luxury interior design"
            loading="lazy"
          />

        </div>


        <div className="about-content">

          <p className="section-label">
            ABOUT OUR STUDIO
          </p>

          <h2>
            We Create
            <span> Beautiful Spaces</span>
          </h2>

          <p>
            We believe that great interior design is about
            more than beautiful furniture and finishes. It is
            about creating spaces that feel comfortable,
            functional and truly yours.
          </p>

          <p>
            Our team combines creativity, thoughtful planning
            and attention to detail to transform residential
            and commercial spaces into elegant interiors.
          </p>

          <Link
            to="/about"
            className="about-btn"
          >
            Discover More
          </Link>

        </div>

      </section>


      {/* ==================================================
          PROJECTS SECTION
      ================================================== */}
      <section className="home-projects-section">

        <div className="section-heading">

          <p>OUR PROJECTS</p>

          <h2>
            Spaces We Have
            <span> Transformed</span>
          </h2>

        </div>


        {loadingProjects ? (

          <div className="home-loading">
            <div className="loading-spinner"></div>
            <p>Loading projects...</p>
          </div>

        ) : projectError ? (

          <div className="home-error">
            <p>{projectError}</p>

            <button
              type="button"
              onClick={fetchProjects}
            >
              Try Again
            </button>
          </div>

        ) : projects.length === 0 ? (

          <div className="home-empty">
            <p>No projects available.</p>
          </div>

        ) : (

          <div className="home-projects-grid">

            {projects.map((project, index) => (

              <article
                className="home-project-card"
                key={project._id || index}
              >

                <div className="home-project-image">

                  <img
                    src={getImageUrl(project.image)}
                    alt={
                      project.title ||
                      "Interior Design Project"
                    }
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src =
                        FALLBACK_IMAGE;
                    }}
                  />

                </div>

                <div className="home-project-content">

                  <span>
                    {project.category ||
                      "Interior Project"}
                  </span>

                  <h3>
                    {project.title ||
                      "Interior Design Project"}
                  </h3>

                  {project.location && (
                    <p>
                      {project.location}
                    </p>
                  )}

                </div>

              </article>

            ))}

          </div>

        )}

        <div className="home-section-button">

          <Link
            to="/projects/residential"
            className="about-btn"
          >
            View All Projects
          </Link>

        </div>

      </section>


      {/* ==================================================
          GALLERY SECTION
      ================================================== */}
      <section className="home-gallery-section">

        <div className="section-heading">

          <p>OUR GALLERY</p>

          <h2>
            Inspiration From Our
            <span> Designs</span>
          </h2>

        </div>


        {loadingGallery ? (

          <div className="home-loading">
            <div className="loading-spinner"></div>
            <p>Loading gallery...</p>
          </div>

        ) : galleryError ? (

          <div className="home-error">
            <p>{galleryError}</p>

            <button
              type="button"
              onClick={fetchGallery}
            >
              Try Again
            </button>
          </div>

        ) : gallery.length === 0 ? (

          <div className="home-empty">
            <p>No gallery images available.</p>
          </div>

        ) : (

          <div className="home-gallery-grid">

            {gallery.map((item, index) => (

              <div
                className="home-gallery-item"
                key={item._id || index}
              >

                <img
                  src={getImageUrl(item.image)}
                  alt={
                    item.title ||
                    "Interior Design Gallery"
                  }
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src =
                      FALLBACK_IMAGE;
                  }}
                />

                <div className="gallery-overlay">

                  <h3>
                    {item.title ||
                      "Interior Design"}
                  </h3>

                  {item.category && (
                    <p>
                      {item.category}
                    </p>
                  )}

                </div>

              </div>

            ))}

          </div>

        )}

        <div className="home-section-button">

          <Link
            to="/gallery"
            className="about-btn"
          >
            View Full Gallery
          </Link>

        </div>

      </section>


      {/* ==================================================
          CTA SECTION
      ================================================== */}
      <section className="home-cta-section">

        <div className="home-cta-content">

          <p className="section-label">
            START YOUR PROJECT
          </p>

          <h2>
            Let's Create Your
            <span> Dream Space</span>
          </h2>

          <p>
            Tell us about your space and let our design team
            help bring your vision to life.
          </p>

          <Link
            to="/contact"
            className="primary-btn"
          >
            Book a Consultation
          </Link>

        </div>

      </section>

    </main>
  );
};

export default Home;

