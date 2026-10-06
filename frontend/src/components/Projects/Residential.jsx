
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Residential.css";
import API_URL from "../../config/api";

// const API_URL = "http://localhost:9000/api/v1";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85";

const BACKEND_URL = "http://localhost:9000";

const Residential = () => {

  // =========================================
  // PROJECT DATA
  // =========================================

  const [residentialProjects, setResidentialProjects] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // =========================================
  // FETCH RESIDENTIAL PROJECTS
  // =========================================

  useEffect(() => {
    fetchResidentialProjects();
  }, []);


  const fetchResidentialProjects = async () => {
    try {

      setLoading(true);
      setError("");

      // =========================================
      // GET ONLY RESIDENTIAL PROJECTS
      // =========================================

      const response = await axios.get(
        `${API_URL}/project/residential`
      );

      console.log(
        "RESIDENTIAL PROJECT API RESPONSE:",
        response.data
      );


      // =========================================
      // CHECK RESPONSE
      // =========================================

      if (response.data.success) {

        const projects =
          response.data.data || [];

        console.log(
          "RESIDENTIAL PROJECTS:",
          projects
        );

        setResidentialProjects(projects);

      } else {

        setError(
          response.data.message ||
          "Unable to fetch residential projects."
        );

      }

    } catch (error) {

      console.error(
        "Residential Project Fetch Error:",
        error.response?.data ||
        error.message
      );

      setError(
        error.response?.data?.message ||
        "Unable to load residential projects."
      );

    } finally {

      setLoading(false);

    }
  };


  // =========================================
  // IMAGE URL FUNCTION
  // =========================================

  const getImageUrl = (image) => {

    if (!image) {
      return DEFAULT_IMAGE;
    }

    // Cloudinary / external image
    if (image.startsWith("http")) {
      return image;
    }

    // Local backend image
    return `${BACKEND_URL}${image}`;
  };


  return (

    <div className="residential-page">


      {/* =========================================
          HERO SECTION
      ========================================= */}

      <section className="residential-hero">

        <div className="residential-hero-content">

          <p className="residential-label">
            RESIDENTIAL INTERIORS
          </p>

          <h1>
            Homes Designed
            <span> For Living</span>
          </h1>

          <p className="residential-hero-description">
            Thoughtfully designed residential spaces that
            combine comfort, functionality and timeless
            elegance to create homes that truly feel like
            your own.
          </p>

          <Link
            to="/contactus"
            className="residential-hero-btn"
          >
            Start Your Home Project
          </Link>

        </div>

      </section>


      {/* =========================================
          INTRO SECTION
      ========================================= */}

      <section className="residential-intro">

        <div className="residential-intro-image">

          <img
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85"
            alt="Residential interior"
          />

          <div className="residential-intro-badge">

            <strong>
              50+
            </strong>

            <span>
              Homes
              <br />
              Designed
            </span>

          </div>

        </div>


        <div className="residential-intro-content">

          <p className="residential-label">
            RESIDENTIAL DESIGN
          </p>

          <h2>
            A Home That
            <span> Feels Like You</span>
          </h2>

          <p>
            Your home should reflect your personality,
            lifestyle and the way you love to live. Our
            residential interior design approach focuses
            on creating spaces that are beautiful,
            practical and deeply personal.
          </p>

          <p>
            From cozy apartments to spacious villas, we
            carefully plan every room, material, color and
            detail to create a harmonious living experience.
          </p>


          <div className="residential-check-list">

            <div>
              <span>✓</span>
              Personalized Interior Design
            </div>

            <div>
              <span>✓</span>
              Smart Space Planning
            </div>

            <div>
              <span>✓</span>
              Premium Materials
            </div>

            <div>
              <span>✓</span>
              Complete Project Execution
            </div>

          </div>

        </div>

      </section>


      {/* =========================================
          PROJECTS SECTION
          DYNAMIC FROM DATABASE
      ========================================= */}

      <section className="residential-projects">

        <div className="residential-section-heading">

          <p className="residential-label">
            OUR RESIDENTIAL WORK
          </p>

          <h2>
            Spaces Made For
            <span> Everyday Life</span>
          </h2>

          <p>
            Explore some of our residential interior
            projects, each designed with a unique vision
            and lifestyle in mind.
          </p>

        </div>


        {/* =========================================
            PROJECT GRID
        ========================================= */}

        <div className="residential-project-grid">


          {/* =========================================
              LOADING
          ========================================= */}

          {loading && (

            <div className="residential-loading">

              Loading residential projects...

            </div>

          )}


          {/* =========================================
              ERROR
          ========================================= */}

          {!loading && error && (

            <div className="residential-error">

              {error}

            </div>

          )}


          {/* =========================================
              NO DATA
          ========================================= */}

          {!loading &&
            !error &&
            residentialProjects.length === 0 && (

              <div className="residential-empty">

                No residential projects available.

              </div>

            )}


          {/* =========================================
              DYNAMIC PROJECT CARDS
          ========================================= */}

          {!loading &&
            !error &&
            residentialProjects.map(
              (project, index) => (

                <div
                  className="residential-project-card"
                  key={project._id || index}
                >


                  {/* =================================
                      PROJECT IMAGE
                  ================================= */}

                  <div className="residential-project-image">

                    <img
                      src={getImageUrl(project.image)}
                      alt={
                        project.title ||
                        "Residential Project"
                      }
                      onError={(e) => {

                        e.currentTarget.src =
                          DEFAULT_IMAGE;

                      }}
                    />


                    {/* NUMBER */}

                    <span className="residential-project-number">

                      {String(index + 1).padStart(
                        2,
                        "0"
                      )}

                    </span>

                  </div>


                  {/* =================================
                      PROJECT CONTENT
                  ================================= */}

                  <div className="residential-project-content">


                    {/* STYLE */}

                    <span className="residential-project-category">

                      {project.style ||
                        "Residential Interior"}

                    </span>


                    {/* TITLE */}

                    <h3>

                      {project.title ||
                        "Residential Project"}

                    </h3>


                    {/* LOCATION */}

                    {project.location && (

                      <div className="residential-project-location">

                        📍 {project.location}

                      </div>

                    )}


                    {/* DESCRIPTION */}

                    <p>

                      {project.description ||
                        "Beautifully designed residential interior space created with comfort, functionality and elegance in mind."}

                    </p>


                    {/* STATUS */}

                    {project.status && (

                      <span className="residential-project-status">

                        {project.status}

                      </span>

                    )}


                    {/* CONTACT */}

                    <Link
                      to="/contactus"
                      className="residential-project-link"
                    >
                      Enquire About This Style →
                    </Link>

                  </div>

                </div>

              )
            )}

        </div>

      </section>


      {/* =========================================
          FEATURES SECTION
      ========================================= */}

      <section className="residential-features">

        <div className="residential-section-heading">

          <p className="residential-label">
            OUR EXPERTISE
          </p>

          <h2>
            Designing Homes
            <span> With Purpose</span>
          </h2>

          <p>
            We combine creative design with practical
            planning to make every residential interior
            beautiful and useful.
          </p>

        </div>


        <div className="residential-features-grid">

          <div className="residential-feature-card">

            <span className="residential-feature-number">
              01
            </span>

            <h3>
              Personalized Design
            </h3>

            <p>
              Every home is designed around the client's
              lifestyle, personality and individual
              requirements.
            </p>

          </div>


          <div className="residential-feature-card">

            <span className="residential-feature-number">
              02
            </span>

            <h3>
              Functional Spaces
            </h3>

            <p>
              We create practical layouts that make
              everyday living comfortable and organized.
            </p>

          </div>


          <div className="residential-feature-card">

            <span className="residential-feature-number">
              03
            </span>

            <h3>
              Premium Finishes
            </h3>

            <p>
              Carefully selected materials and finishes
              add durability and elegance to every
              interior.
            </p>

          </div>


          <div className="residential-feature-card">

            <span className="residential-feature-number">
              04
            </span>

            <h3>
              Complete Execution
            </h3>

            <p>
              From concept and planning to installation,
              we manage every important detail of the
              project.
            </p>

          </div>

        </div>

      </section>


      {/* =========================================
          ROOMS SECTION
      ========================================= */}

      <section className="residential-rooms">

        <div className="residential-rooms-content">

          <p className="residential-label">
            COMPLETE HOME DESIGN
          </p>

          <h2>
            Every Room,
            <span> Beautifully Connected</span>
          </h2>

          <p>
            We create a consistent design language
            throughout your home while giving every room
            its own personality.
          </p>


          <div className="residential-room-list">

            <div className="residential-room-item">
              <span>01</span>
              <h3>Living Room</h3>
            </div>

            <div className="residential-room-item">
              <span>02</span>
              <h3>Bedroom</h3>
            </div>

            <div className="residential-room-item">
              <span>03</span>
              <h3>Kitchen</h3>
            </div>

            <div className="residential-room-item">
              <span>04</span>
              <h3>Dining Area</h3>
            </div>

            <div className="residential-room-item">
              <span>05</span>
              <h3>Home Office</h3>
            </div>

            <div className="residential-room-item">
              <span>06</span>
              <h3>Entertainment Space</h3>
            </div>

          </div>

        </div>


        <div className="residential-rooms-image">

          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85"
            alt="Luxury residential interior"
          />

        </div>

      </section>


      {/* =========================================
          PROCESS
      ========================================= */}

      <section className="residential-process">

        <div className="residential-section-heading">

          <p className="residential-label">
            OUR PROCESS
          </p>

          <h2>
            From Your Idea
            <span> To Your Home</span>
          </h2>

          <p>
            A simple and transparent design process that
            brings your vision to life.
          </p>

        </div>


        <div className="residential-process-grid">

          <div className="residential-process-card">

            <span>01</span>

            <h3>
              Consultation
            </h3>

            <p>
              We understand your requirements, lifestyle,
              preferences and budget.
            </p>

          </div>


          <div className="residential-process-card">

            <span>02</span>

            <h3>
              Concept
            </h3>

            <p>
              Our designers develop concepts and layouts
              specifically for your home.
            </p>

          </div>


          <div className="residential-process-card">

            <span>03</span>

            <h3>
              Design
            </h3>

            <p>
              Materials, colors, furniture and lighting
              are carefully selected to complete the
              design.
            </p>

          </div>


          <div className="residential-process-card">

            <span>04</span>

            <h3>
              Execution
            </h3>

            <p>
              We coordinate the execution and deliver
              your finished residential interior.
            </p>

          </div>

        </div>

      </section>


      {/* =========================================
          CTA
      ========================================= */}

      <section className="residential-cta">

        <div className="residential-cta-content">

          <p>
            READY TO TRANSFORM YOUR HOME?
          </p>

          <h2>
            Let's Create Your
            <span> Dream Home</span>
          </h2>

          <p>
            Share your ideas with us and let our interior
            designers create a home that is uniquely yours.
          </p>

          <Link
            to="/contactus"
            className="residential-cta-btn"
          >
            Contact Us
          </Link>

        </div>

      </section>

    </div>

  );
};

export default Residential;
