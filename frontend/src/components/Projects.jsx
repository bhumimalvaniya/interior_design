
import React from "react";
import { Link } from "react-router-dom";
import "./Projects.css";

const Projects = () => {
  const projects = [
    {
      number: "01",
      title: "Residential Projects",
      description:
        "Beautiful residential interiors designed around comfort, functionality and your personal lifestyle.",
      image:
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85",
      link: "/projects/residential",
    },
    {
      number: "02",
      title: "Commercial Projects",
      description:
        "Professional commercial spaces designed to create a productive and impressive environment.",
      image:
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=85",
      link: "/projects/commercial",
    },
    {
      number: "03",
      title: "Modern Design",
      description:
        "Contemporary interiors combining clean lines, elegant finishes and modern functionality.",
      image:
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=85",
      link: "/projects/modern",
    },
    {
      number: "04",
      title: "Luxury Design",
      description:
        "Premium interiors featuring sophisticated materials, elegant details and timeless style.",
      image:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85",
      link: "/projects/luxury",
    },
    {
      number: "05",
      title: "Completed Projects",
      description:
        "Explore some of our successfully completed interior design projects and transformations.",
      image:
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=85",
      link: "/projects/completed",
    },
  ];

  return (
    <div className="projects-page">

      {/* =========================================
          HERO SECTION
      ========================================= */}

      <section className="projects-hero">

        <div className="projects-hero-content">

          <p className="projects-label">
            OUR PORTFOLIO
          </p>

          <h1>
            Spaces We
            <span> Created</span>
          </h1>

          <p className="projects-hero-description">
            Explore our collection of thoughtfully designed
            residential and commercial interiors created with
            creativity, functionality and attention to detail.
          </p>

          <Link
            to="/contactus"
            className="projects-hero-btn"
          >
            Start Your Project
          </Link>

        </div>

      </section>


      {/* =========================================
          INTRODUCTION
      ========================================= */}

      <section className="projects-intro">

        <div className="projects-intro-content">

          <p className="projects-label">
            OUR WORK
          </p>

          <h2>
            Design That
            <span> Inspires</span>
          </h2>

          <p>
            Every project tells a unique story. We carefully
            understand our client's requirements and transform
            their spaces into beautiful, functional and
            personalized interiors.
          </p>

          <p>
            From modern homes to luxury residences and
            professional commercial spaces, our portfolio
            represents our passion for thoughtful interior design.
          </p>

          <Link
            to="/contactus"
            className="projects-text-link"
          >
            Discuss Your Project →
          </Link>

        </div>


        <div className="projects-intro-image">

          <img
            src="https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1200&q=85"
            alt="Interior design project"
          />

          <div className="projects-intro-badge">

            <strong>50+</strong>

            <span>
              Projects
              <br />
              Completed
            </span>

          </div>

        </div>

      </section>


      {/* =========================================
          PROJECT CATEGORIES
      ========================================= */}

      <section className="projects-list">

        <div className="projects-section-heading">

          <p className="projects-label">
            PROJECT CATEGORIES
          </p>

          <h2>
            Explore Our
            <span> Projects</span>
          </h2>

          <p>
            Discover our different interior design categories
            and find inspiration for your next project.
          </p>

        </div>


        <div className="projects-grid">

          {projects.map((project) => (

            <div
              className="project-card"
              key={project.number}
            >

              <div className="project-card-image">

                <img
                  src={project.image}
                  alt={project.title}
                />

                <span className="project-number">
                  {project.number}
                </span>

              </div>


              <div className="project-card-content">

                <h3>
                  {project.title}
                </h3>

                <p>
                  {project.description}
                </p>

                <Link
                  to={project.link}
                  className="project-card-link"
                >
                  View Projects →
                </Link>

              </div>

            </div>

          ))}

        </div>

      </section>


      {/* =========================================
          DESIGN APPROACH
      ========================================= */}

      <section className="projects-approach">

        <div className="projects-approach-image">

          <img
            src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85"
            alt="Modern interior project"
          />

        </div>


        <div className="projects-approach-content">

          <p className="projects-label">
            OUR APPROACH
          </p>

          <h2>
            From Concept
            <span> To Reality</span>
          </h2>

          <p>
            We believe great interiors are created by combining
            creative ideas with practical planning. Our team works
            closely with clients throughout the design journey.
          </p>


          <div className="projects-approach-list">

            <div className="projects-approach-item">

              <span>01</span>

              <div>
                <h3>Understand</h3>

                <p>
                  We understand your lifestyle, requirements,
                  preferences and budget.
                </p>
              </div>

            </div>


            <div className="projects-approach-item">

              <span>02</span>

              <div>
                <h3>Design</h3>

                <p>
                  Our designers create concepts that balance
                  aesthetics, comfort and functionality.
                </p>
              </div>

            </div>


            <div className="projects-approach-item">

              <span>03</span>

              <div>
                <h3>Develop</h3>

                <p>
                  Materials, finishes, furniture and details are
                  carefully selected for your space.
                </p>
              </div>

            </div>


            <div className="projects-approach-item">

              <span>04</span>

              <div>
                <h3>Deliver</h3>

                <p>
                  We turn the approved design into a beautiful
                  finished interior.
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================
          CTA
      ========================================= */}

      <section className="projects-cta">

        <div className="projects-cta-content">

          <p>
            HAVE A PROJECT IN MIND?
          </p>

          <h2>
            Let's Build Your
            <span> Dream Space</span>
          </h2>

          <p>
            Tell us about your project and let our designers
            create a space that reflects your personality and
            lifestyle.
          </p>

          <Link
            to="/contactus"
            className="projects-cta-btn"
          >
            Contact Us
          </Link>

        </div>

      </section>

    </div>
  );
};

export default Projects;

