import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./AdminProjects.css";
import API_URL from "../../config/api";

const AdminProjects = () => {
  // ==========================================
  // STATES
  // ==========================================

  const [projects, setProjects] = useState([]);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalProjects: 0,
    residential: 0,
    commercial: 0,
    completed: 0,
    ongoing: 0,
  });

  // ==========================================
  // PAGINATION STATES
  // ==========================================

  const [currentPage, setCurrentPage] = useState(1);

  const [itemsPerPage, setItemsPerPage] = useState(10);

  // ==========================================
  // API URL
  // ==========================================

  // const API_URL = "http://localhost:9000/api/v1/project";

  // ==========================================
  // FETCH PROJECTS
  // ==========================================

  const fetchProjects = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_URL}/project/fetch`
      );

      console.log("Projects:", response.data);

      if (response.data.success) {
        setProjects(response.data.data || []);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.log("Fetch Projects Error:", error);

      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FETCH STATISTICS
  // ==========================================

  const fetchStats = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/project/stats`
      );

      console.log(
        "Project Stats:",
        response.data
      );

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.log(
        "Fetch Stats Error:",
        error
      );
    }
  };

  // ==========================================
  // DELETE PROJECT
  // ==========================================

  const handleDelete = async (id, title) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${title}"?`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await axios.delete(
        `${API_URL}/project/delete/${id}`
      );

      alert(
        response.data.message ||
          "Project deleted successfully."
      );

      // Remove project from current UI immediately
      setProjects((prevProjects) =>
        prevProjects.filter(
          (project) => project._id !== id
        )
      );

      // Refresh statistics
      fetchStats();

      // If deleted project was the only item
      // on current page, move to previous page
      if (
        currentProjects.length === 1 &&
        currentPage > 1
      ) {
        setCurrentPage(
          (previousPage) =>
            previousPage - 1
        );
      }
    } catch (error) {
      console.log(
        "Delete Project Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete project"
      );
    }
  };

  // ==========================================
  // FETCH DATA WHEN PAGE LOADS
  // ==========================================

  useEffect(() => {
    fetchProjects();
    fetchStats();
  }, []);

  // ==========================================
  // FRONTEND SEARCH + CATEGORY FILTER
  // ==========================================

  const filteredProjects = projects.filter(
    (project) => {
      const searchText =
        search.toLowerCase().trim();

      const title =
        project.title?.toLowerCase() || "";

      const location =
        project.location?.toLowerCase() || "";

      const style =
        project.style?.toLowerCase() || "";

      const matchesSearch =
        title.includes(searchText) ||
        location.includes(searchText) ||
        style.includes(searchText);

      const matchesCategory =
        category === "All" ||
        project.category === category;

      return (
        matchesSearch &&
        matchesCategory
      );
    }
  );

  // ==========================================
  // RESET PAGINATION WHEN FILTER CHANGES
  // ==========================================

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    category,
    itemsPerPage,
  ]);

  // ==========================================
  // PAGINATION CALCULATIONS
  // ==========================================

  const totalProjects =
    filteredProjects.length;

  const totalPages = Math.ceil(
    totalProjects / itemsPerPage
  );

  const indexOfLastProject =
    currentPage * itemsPerPage;

  const indexOfFirstProject =
    indexOfLastProject - itemsPerPage;

  const currentProjects =
    filteredProjects.slice(
      indexOfFirstProject,
      indexOfLastProject
    );

  // ==========================================
  // GO TO PAGE
  // ==========================================

  const goToPage = (page) => {
    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    setCurrentPage(page);
  };

  // ==========================================
  // PAGE NUMBERS
  // ==========================================

  const getPageNumbers = () => {
    const pages = [];

    // If pages are 7 or fewer
    if (totalPages <= 7) {
      for (
        let i = 1;
        i <= totalPages;
        i++
      ) {
        pages.push(i);
      }
    } else {
      // First page
      pages.push(1);

      // Left dots
      if (currentPage > 4) {
        pages.push("...");
      }

      // Middle pages
      const startPage = Math.max(
        2,
        currentPage - 1
      );

      const endPage = Math.min(
        totalPages - 1,
        currentPage + 1
      );

      for (
        let i = startPage;
        i <= endPage;
        i++
      ) {
        pages.push(i);
      }

      // Right dots
      if (
        currentPage <
        totalPages - 3
      ) {
        pages.push("...");
      }

      // Last page
      pages.push(totalPages);
    }

    return pages;
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="admin-projects">
        <div className="loading-projects">
          Loading projects...
        </div>
      </div>
    );
  }

  // ==========================================
  // RETURN
  // ==========================================

  return (
    <div className="admin-projects">

      {/* =====================================
          PAGE HEADER
      ===================================== */}

      <div className="projects-page-header">

        <div>
          <p className="projects-small-title">
            PROJECT MANAGEMENT
          </p>

          <h1>
            Projects
          </h1>

          <span>
            Manage your residential and
            commercial interior projects.
          </span>
        </div>

        <Link
          to="/admin/projects/add"
          className="add-project-btn"
        >
          + Add Project
        </Link>

      </div>

      {/* =====================================
          STATISTICS
      ===================================== */}

      <div className="projects-stats">

        {/* TOTAL */}

        <div className="project-stat-card">

          <div className="project-stat-icon">
            🏠
          </div>

          <div>
            <span>
              Total Projects
            </span>

            <strong>
              {stats.totalProjects}
            </strong>
          </div>

        </div>

        {/* RESIDENTIAL */}

        <div className="project-stat-card">

          <div className="project-stat-icon">
            🏡
          </div>

          <div>
            <span>
              Residential
            </span>

            <strong>
              {stats.residential}
            </strong>
          </div>

        </div>

        {/* COMMERCIAL */}

        <div className="project-stat-card">

          <div className="project-stat-icon">
            🏢
          </div>

          <div>
            <span>
              Commercial
            </span>

            <strong>
              {stats.commercial}
            </strong>
          </div>

        </div>

        {/* COMPLETED */}

        <div className="project-stat-card">

          <div className="project-stat-icon">
            ✓
          </div>

          <div>
            <span>
              Completed
            </span>

            <strong>
              {stats.completed}
            </strong>
          </div>

        </div>

      </div>

      {/* =====================================
          FILTER
      ===================================== */}

      <div className="projects-filter">

        {/* SEARCH */}

        <div className="projects-search">

          <span>
            🔍
          </span>

          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        {/* CATEGORY */}

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        >

          <option value="All">
            All Projects
          </option>

          <option value="Residential">
            Residential
          </option>

          <option value="Commercial">
            Commercial
          </option>

        </select>

      </div>

      {/* =====================================
          PROJECT GRID
      ===================================== */}

      <div className="projects-grid">

        {currentProjects.length > 0 ? (

          currentProjects.map(
            (project) => (

              <div
                className="admin-project-card"
                key={project._id}
              >

                {/* =================================
                    IMAGE
                ================================= */}

                <div className="admin-project-image">

                  <img
                    src={
                      project.image?.startsWith(
                        "http"
                      )
                        ? project.image
                        : `http://localhost:9000${project.image}`
                    }
                    alt={
                      project.title ||
                      "Project"
                    }
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/900x600?text=Image+Not+Found";
                    }}
                  />

                  <span
                    className={`project-status ${
                      project.status ===
                      "Completed"
                        ? "completed"
                        : "ongoing"
                    }`}
                  >
                    {project.status}
                  </span>

                </div>

                {/* =================================
                    CONTENT
                ================================= */}

                <div className="admin-project-content">

                  <div className="project-category">
                    {project.category}
                  </div>

                  <h2>
                    {project.title}
                  </h2>

                  <p>
                    📍 {project.location}
                  </p>

                  <div className="project-card-footer">

                    <span>
                      {project.style}
                    </span>

                    <div className="project-actions">

                      {/* EDIT */}

                      <Link
                        to={`/admin/projects/edit/${project._id}`}
                        className="edit-project"
                      >
                        Edit
                      </Link>

                      {/* DELETE */}

                      <button
                        type="button"
                        className="delete-project"
                        onClick={() =>
                          handleDelete(
                            project._id,
                            project.title
                          )
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </div>

              </div>
            )
          )

        ) : (

          <div className="no-projects">

            <div>
              🔍
            </div>

            <h2>
              No Projects Found
            </h2>

            <p>
              Try changing your search or
              category filter.
            </p>

          </div>

        )}

      </div>

      {/* =====================================
          PAGINATION
      ===================================== */}

      {totalProjects > 0 && (

        <div className="projects-pagination-wrapper">

          {/* =================================
              ITEMS PER PAGE
          ================================= */}

          <div className="projects-page-size">

            <span>
              Show
            </span>

            <select
              value={itemsPerPage}
              onChange={(e) =>
                setItemsPerPage(
                  Number(e.target.value)
                )
              }
            >
              <option value={5}>
                5
              </option>

              <option value={10}>
                10
              </option>

              <option value={20}>
                20
              </option>

              <option value={50}>
                50
              </option>
            </select>

            <span>
              per page
            </span>

          </div>

          {/* =================================
              PAGINATION INFORMATION
          ================================= */}

          <div className="projects-pagination-info">

            Showing{" "}

            <strong>
              {indexOfFirstProject + 1}
            </strong>

            {" "}to{" "}

            <strong>
              {Math.min(
                indexOfLastProject,
                totalProjects
              )}
            </strong>

            {" "}of{" "}

            <strong>
              {totalProjects}
            </strong>

            {" "}projects

          </div>

          {/* =================================
              PAGINATION CONTROLS
          ================================= */}

          {totalPages > 1 && (

            <div className="projects-pagination-controls">

              {/* PREVIOUS */}

              <button
                type="button"
                className="projects-pagination-arrow"
                onClick={() =>
                  goToPage(
                    currentPage - 1
                  )
                }
                disabled={
                  currentPage === 1
                }
                aria-label="Previous page"
              >
                ‹
              </button>

              {/* PAGE NUMBERS */}

              {getPageNumbers().map(
                (page, index) => {

                  if (
                    page === "..."
                  ) {
                    return (
                      <span
                        key={`dots-${index}`}
                        className="projects-pagination-dots"
                      >
                        ...
                      </span>
                    );
                  }

                  return (
                    <button
                      type="button"
                      key={page}
                      className={`projects-pagination-number ${
                        currentPage === page
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        goToPage(page)
                      }
                    >
                      {page}
                    </button>
                  );
                }
              )}

              {/* NEXT */}

              <button
                type="button"
                className="projects-pagination-arrow"
                onClick={() =>
                  goToPage(
                    currentPage + 1
                  )
                }
                disabled={
                  currentPage ===
                  totalPages
                }
                aria-label="Next page"
              >
                ›
              </button>

            </div>

          )}

        </div>

      )}

    </div>
  );
};

export default AdminProjects;