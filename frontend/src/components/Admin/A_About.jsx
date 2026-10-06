import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./A_About.css";
import API_URL from "../../config/api";

// const API_URL = "http://localhost:9000/api/v1";
// const BACKEND_URL = "http://localhost:9000";

// ======================================================
// IMAGE URL HELPER
// ======================================================

const getImageUrl = (image) => {
  if (!image) {
    return "";
  }

  // Cloudinary or any complete URL
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  // Local image path like /uploads/about.jpg
  if (image.startsWith("/")) {
    return `${BACKEND_URL}${image}`;
  }

  // Local image path like uploads/about.jpg
  return `${BACKEND_URL}/${image}`;
};

// ======================================================
// COMPONENT
// ======================================================

const A_About = () => {
  const navigate = useNavigate();

  const [about, setAbout] = useState([]);
  const [loading, setLoading] = useState(true);

  // ======================================================
  // FETCH ABOUT DATA
  // ======================================================

  const fetchAbout = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_URL}/about/featch`
      );

      console.log("ABOUT API RESPONSE:", response.data);

      if (response.data.success) {
        setAbout(response.data.data || []);
      } else {
        setAbout([]);
      }
    } catch (error) {
      console.error("Fetch About Error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to fetch About"
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // USE EFFECT
  // ======================================================

  useEffect(() => {
    fetchAbout();
  }, []);

  // ======================================================
  // DELETE ABOUT
  // ======================================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this About data?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await axios.delete(
        `${API_URL}/about/delete/${id}`
      );

      console.log("DELETE RESPONSE:", response.data);

      if (response.data.success) {
        alert("About deleted successfully");

        // Refresh data
        fetchAbout();
      } else {
        alert(
          response.data.message ||
            "Failed to delete About"
        );
      }
    } catch (error) {
      console.error("Delete About Error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete About"
      );
    }
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="admin-about">
        <div className="loading">
          Loading About...
        </div>
      </div>
    );
  }

  // ======================================================
  // RETURN
  // ======================================================

  return (
    <div className="admin-about">

      {/* ================================================
          HEADER
      ================================================= */}

      <div className="admin-about-header">

        <div>
          <h1>About Us</h1>

          <p>
            Manage About Us content
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate("/admin/about/add")
          }
        >
          + Add About
        </button>

      </div>

      {/* ================================================
          EMPTY DATA
      ================================================= */}

      {about.length === 0 ? (

        <div className="empty">
          No About data found.
        </div>

      ) : (

        /* ================================================
           TABLE
        ================================================= */

        <div className="about-table-wrapper">

          <table className="about-table">

            {/* ==========================================
                TABLE HEADER
            =========================================== */}

            <thead>

              <tr>

                <th>Image</th>

                <th>Title</th>

                <th>Subtitle</th>

                <th>Experience</th>

                <th>Projects</th>

                <th>Clients</th>

                <th>Status</th>

                <th>Actions</th>

              </tr>

            </thead>

            {/* ==========================================
                TABLE BODY
            =========================================== */}

            <tbody>

              {about.map((item) => {

                console.log(
                  "ABOUT ITEM:",
                  item
                );

                console.log(
                  "IMAGE:",
                  item.image
                );

                console.log(
                  "IMAGE URL:",
                  getImageUrl(item.image)
                );

                return (

                  <tr key={item._id}>

                    {/* ==================================
                        IMAGE
                    =================================== */}

                    <td>

                      {item.image ? (

                        <img
                          src={getImageUrl(
                            item.image
                          )}
                          alt={
                            item.title ||
                            "About"
                          }
                          className="about-thumb"

                          onLoad={() => {
                            console.log(
                              "Image loaded successfully:",
                              getImageUrl(
                                item.image
                              )
                            );
                          }}

                          onError={(e) => {
                            console.error(
                              "Image failed to load:",
                              getImageUrl(
                                item.image
                              )
                            );

                            e.target.style.display =
                              "none";

                            if (
                              e.target.nextSibling
                            ) {
                              e.target.nextSibling.style.display =
                                "inline-block";
                            }
                          }}
                        />

                      ) : null}

                      <span
                        className="no-image"
                        style={{
                          display: item.image
                            ? "none"
                            : "inline-block",
                        }}
                      >
                        No Image
                      </span>

                    </td>

                    {/* ==================================
                        TITLE
                    =================================== */}

                    <td>
                      {item.title || "-"}
                    </td>

                    {/* ==================================
                        SUBTITLE
                    =================================== */}

                    <td>
                      {item.subtitle || "-"}
                    </td>

                    {/* ==================================
                        EXPERIENCE
                    =================================== */}

                    <td>
                      {item.experience || "-"}
                    </td>

                    {/* ==================================
                        PROJECTS
                    =================================== */}

                    <td>
                      {item.projects || "-"}
                    </td>

                    {/* ==================================
                        CLIENTS
                    =================================== */}

                    <td>
                      {item.clients || "-"}
                    </td>

                    {/* ==================================
                        STATUS
                    =================================== */}

                    <td>

                      <span
                        className={`status ${
                          item.status || ""
                        }`}
                      >
                        {item.status || "-"}
                      </span>

                    </td>

                    {/* ==================================
                        ACTIONS
                    =================================== */}

                    <td>

                      <div className="action-buttons">

                        {/* EDIT */}

                        <button
                          type="button"
                          className="edit-btn"
                          onClick={() =>
                            navigate(
                              `/admin/about/edit/${item._id}`
                            )
                          }
                        >
                          Edit
                        </button>

                        {/* DELETE */}

                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() =>
                            handleDelete(
                              item._id
                            )
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                );
              })}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
};

export default A_About;