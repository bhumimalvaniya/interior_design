import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./CompletedProjects.css";

const API_URL = "http://localhost:9000/api/v1";
const BACKEND_URL = "http://localhost:9000";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80";

const CompletedProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch completed projects
  useEffect(() => {
    fetchCompletedProjects();
  }, []);

  const fetchCompletedProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/project/completed`
      );

      console.log("Completed Projects:", response.data);

      if (response.data.success) {
        setProjects(response.data.data || []);
      } else {
        setError(
          response.data.message || "Unable to fetch projects"
        );
      }
    } catch (error) {
      console.error("Fetch project error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to connect to server"
      );
    } finally {
      setLoading(false);
    }
  };

  // Image URL
  const getImageUrl = (image) => {
    if (!image) return DEFAULT_IMAGE;

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    return `${BACKEND_URL}${image}`;
  };

  return (
    <div className="completed-page">

      {/* HERO */}
      <section className="completed-hero">
        <div className="completed-hero-overlay"></div>

        <div className="completed-hero-content">
          <span>OUR PORTFOLIO</span>

          <h1>
            Completed <strong>Projects</strong>
          </h1>

          <p>
            Explore our completed interior design projects.
          </p>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="completed-projects">

        <div className="completed-heading">
          <span>OUR WORK</span>

          <h2>
            Completed <strong>Projects</strong>
          </h2>

          <p>
            Take a look at some of our recently completed
            interior design projects.
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="completed-message">
            <div className="completed-loader"></div>
            <p>Loading projects...</p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="completed-message error">
            <p>{error}</p>

            <button onClick={fetchCompletedProjects}>
              Try Again
            </button>
          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          !error &&
          projects.length === 0 && (
            <div className="completed-message">
              <h3>No Completed Projects Found</h3>
              <p>
                Completed projects will appear here.
              </p>
            </div>
          )}

        {/* DYNAMIC PROJECTS */}
        {!loading &&
          !error &&
          projects.length > 0 && (
            <div className="completed-grid">

              {projects.map((project, index) => (
                <div
                  className="completed-card"
                  key={project._id || index}
                >

                  {/* IMAGE */}
                  <div className="completed-image">

                    <img
                      src={getImageUrl(project.image)}
                      alt={project.title || "Project"}
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_IMAGE;
                      }}
                    />

                    <span className="project-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                  </div>

                  {/* CONTENT */}
                  <div className="completed-content">

                    <span className="project-category">
                      {project.style ||
                        project.category ||
                        "Interior Design"}
                    </span>

                    <h3>
                      {project.title}
                    </h3>

                    <p className="project-location">
                      📍 {project.location || "Location"}
                    </p>

                    <p className="project-description">
                      {project.description ||
                        "Beautifully designed interior space with modern aesthetics and functionality."}
                    </p>

                    <span className="project-status">
                      {project.status || "Completed"}
                    </span>

                  </div>

                </div>
              ))}

            </div>
          )}
      </section>

      {/* CTA */}
      <section className="completed-cta">

        <div>
          <span>START YOUR PROJECT</span>

          <h2>
            Create Your <strong>Dream Space</strong>
          </h2>

          <p>
            Let's create a beautiful interior designed
            especially for you.
          </p>

          <Link to="/contactus">
            Contact Us →
          </Link>
        </div>

      </section>

    </div>
  );
};

export default CompletedProjects;