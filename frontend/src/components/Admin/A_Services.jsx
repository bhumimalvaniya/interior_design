import React, { useEffect, useState } from "react";
import axios from "axios";
import "./A_Services.css";
import API_URL from "../../config/api";

// const API_URL = "http://localhost:9000";

const A_Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // PAGINATION
  // ==========================================

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // ==========================================
  // FETCH SERVICES
  // ==========================================

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        // `${API_URL}/api/v1/services/featch`
        `${API_URL}/services/featch`
      );

      console.log("Services API Response:", response.data);

      if (response.data.success) {
        const serviceData = response.data.data || [];

        setServices(serviceData);

        // Check current page after fetching
        const totalPages = Math.ceil(
          serviceData.length / itemsPerPage
        );

        if (totalPages === 0) {
          setCurrentPage(1);
        } else if (currentPage > totalPages) {
          setCurrentPage(totalPages);
        }
      } else {
        setServices([]);
        setError("Unable to fetch services");
      }
    } catch (error) {
      console.error("Fetch Services Error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to connect with server"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FETCH DATA WHEN PAGE LOADS
  // ==========================================

  useEffect(() => {
    fetchServices();
  }, []);

  // ==========================================
  // IMAGE URL
  // ==========================================

  const getImageUrl = (image) => {
    if (!image) {
      return "/no-image.jpg";
    }

    // Cloudinary URL
    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    // Local backend image
    return `${API_URL}${image}`;
  };

  // ==========================================
  // DELETE SERVICE
  // ==========================================

  const deleteService = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this service?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await axios.delete(
        // `${API_URL}/api/v1/services/delete/${id}`
        `${API_URL}/services/delete/${id}`
      );

      console.log("Delete Response:", response.data);

      if (response.data.success) {
        alert("Service deleted successfully");

        // Remove deleted service from UI
        setServices((previousServices) =>
          previousServices.filter(
            (service) => service._id !== id
          )
        );
      } else {
        alert(
          response.data.message ||
            "Unable to delete service"
        );
      }
    } catch (error) {
      console.error("Delete Service Error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to delete service"
      );
    }
  };

  // ==========================================
  // ADD SERVICE
  // ==========================================

  const handleAddService = () => {
    window.location.href = "/admin/services/add";
  };

  // ==========================================
  // EDIT SERVICE
  // ==========================================

  const handleEditService = (id) => {
    window.location.href =
      `/admin/services/edit/${id}`;
  };

  // ==========================================
  // PAGINATION CALCULATION
  // ==========================================

  const totalPages = Math.ceil(
    services.length / itemsPerPage
  );

  const startIndex =
    (currentPage - 1) * itemsPerPage;

  const endIndex =
    startIndex + itemsPerPage;

  const currentServices = services.slice(
    startIndex,
    endIndex
  );

  // ==========================================
  // CHANGE PAGE
  // ==========================================

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // CHANGE ITEMS PER PAGE
  // ==========================================

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(
      Number(event.target.value)
    );

    setCurrentPage(1);
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="admin-services-page">

        <div className="admin-page-header">
          <div>
            <h1>Services</h1>
            <p>
              Manage your interior design services
            </p>
          </div>
        </div>

        <div className="loading-message">
          Loading services...
        </div>

      </div>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <div className="admin-services-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="admin-page-header">

        <div>
          <h1>Services</h1>

          <p>
            Manage your interior design services
          </p>
        </div>

        <button onClick={handleAddService}>
          + Add Service
        </button>

      </div>

      {/* ======================================
          ERROR
      ====================================== */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* ======================================
          NO DATA
      ====================================== */}

      {!error && services.length === 0 && (
        <div className="no-services">

          <h3>No Services Found</h3>

          <p>
            No service data is available in the database.
          </p>

          <button onClick={handleAddService}>
            + Add First Service
          </button>

        </div>
      )}

      {/* ======================================
          SERVICES TABLE
      ====================================== */}

      {services.length > 0 && (
        <div className="admin-services-table-wrapper">

          {/* TABLE HEADER */}

          <div className="services-table-header">

            <div>
              <h3>Service List</h3>
              <p>
                Manage all your interior services
              </p>
            </div>

            {/* ITEMS PER PAGE */}

            <div className="pagination-size">

              <label htmlFor="servicesPerPage">
                Show:
              </label>

              <select
                id="servicesPerPage"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>

              <span>per page</span>

            </div>

          </div>

          {/* TABLE */}

          <div className="services-table-scroll">

            <table className="admin-services-table">

              <thead>
                <tr>
                  <th>No.</th>
                  <th>Image</th>
                  <th>Section</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {currentServices.map(
                  (service, index) => (

                    <tr key={service._id}>

                      {/* NUMBER */}

                      <td>
                        {startIndex + index + 1}
                      </td>

                      {/* IMAGE */}

                      <td>

                        {service.image ? (

                          <img
                            src={getImageUrl(
                              service.image
                            )}
                            alt={
                              service.title ||
                              "Service"
                            }
                            className="service-table-image"
                            onError={(e) => {
                              e.target.src =
                                "/no-image.jpg";
                            }}
                          />

                        ) : (

                          <span>
                            No Image
                          </span>

                        )}

                      </td>

                      {/* SECTION */}

                      <td>
                        {service.section || "-"}
                      </td>

                      {/* TITLE */}

                      <td>
                        {service.title || "-"}
                      </td>

                      {/* DESCRIPTION */}

                      <td className="description-cell">

                        {service.description
                          ? service.description
                          : "-"}

                      </td>

                      {/* STATUS */}

                      <td>

                        <span
                          className={
                            service.status === "active"
                              ? "status-active"
                              : "status-inactive"
                          }
                        >
                          {service.status ||
                            "inactive"}
                        </span>

                      </td>

                      {/* ACTION */}

                      <td>

                        <div className="service-actions">

                          <button
                            className="edit-btn"
                            onClick={() =>
                              handleEditService(
                                service._id
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="delete-btn"
                            onClick={() =>
                              deleteService(
                                service._id
                              )
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

          {/* ======================================
              PAGINATION INFO
          ====================================== */}

          <div className="pagination-bottom">

            <div className="pagination-info">

              Showing{" "}
              <strong>
                {services.length === 0
                  ? 0
                  : startIndex + 1}
              </strong>{" "}
              to{" "}
              <strong>
                {Math.min(
                  endIndex,
                  services.length
                )}
              </strong>{" "}
              of{" "}
              <strong>
                {services.length}
              </strong>{" "}
              services

            </div>

            {/* PAGINATION BUTTONS */}

            {totalPages > 1 && (

              <div className="pagination-container">

                {/* PREVIOUS */}

                <button
                  type="button"
                  className="pagination-btn"
                  disabled={currentPage === 1}
                  onClick={() =>
                    handlePageChange(
                      currentPage - 1
                    )
                  }
                >
                  ← Previous
                </button>

                {/* PAGE NUMBERS */}

                <div className="pagination-pages">

                  {Array.from(
                    {
                      length: totalPages,
                    },
                    (_, index) =>
                      index + 1
                  ).map((page) => (

                    <button
                      key={page}
                      type="button"
                      className={`pagination-number ${
                        currentPage === page
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        handlePageChange(page)
                      }
                    >
                      {page}
                    </button>

                  ))}

                </div>

                {/* NEXT */}

                <button
                  type="button"
                  className="pagination-btn"
                  disabled={
                    currentPage === totalPages
                  }
                  onClick={() =>
                    handlePageChange(
                      currentPage + 1
                    )
                  }
                >
                  Next →
                </button>

              </div>

            )}

          </div>

        </div>
      )}

    </div>
  );
};

export default A_Services;