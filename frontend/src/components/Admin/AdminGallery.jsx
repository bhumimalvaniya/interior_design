import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./AdminGallery.css";

const AdminGallery = () => {
  // =========================================
  // STATES
  // =========================================

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [galleryData, setGalleryData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // =========================================
  // API URL
  // =========================================

  const API_URL = "http://localhost:9000/api/v1/gallary";

  // =========================================
  // FETCH GALLERY DATA
  // =========================================

  const fetchGallery = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API_URL}/featch`);

      console.log("Gallery API Response:", response.data);

      if (response.data.success) {
        setGalleryData(response.data.data || []);
      } else {
        setGalleryData([]);
      }
    } catch (error) {
      console.error("Gallery Fetch Error:", error);
      setGalleryData([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // LOAD GALLERY WHEN PAGE OPENS
  // =========================================

  useEffect(() => {
    fetchGallery();
  }, []);

  // =========================================
  // FILTER DATA
  // =========================================

  const filteredGallery = galleryData.filter((item) => {
    const searchText = search.toLowerCase().trim();

    const title = item.title?.toLowerCase() || "";
    const itemCategory = item.category?.toLowerCase() || "";
    const type = item.type?.toLowerCase() || "";

    const matchesSearch =
      title.includes(searchText) ||
      itemCategory.includes(searchText) ||
      type.includes(searchText);

    const matchesCategory =
      category === "All" || item.category === category;

    return matchesSearch && matchesCategory;
  });

  // =========================================
  // RESET PAGE WHEN FILTER CHANGES
  // =========================================

  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, itemsPerPage]);

  // =========================================
  // PAGINATION CALCULATIONS
  // =========================================

  const totalImages = filteredGallery.length;

  const totalPages = Math.ceil(totalImages / itemsPerPage);

  const indexOfLastImage = currentPage * itemsPerPage;

  const indexOfFirstImage = indexOfLastImage - itemsPerPage;

  const currentGallery = filteredGallery.slice(
    indexOfFirstImage,
    indexOfLastImage
  );

  // =========================================
  // PAGE CHANGE
  // =========================================

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);
  };

  // =========================================
  // GENERATE PAGE NUMBERS
  // =========================================

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 4) {
        pages.push("...");
      }

      const startPage = Math.max(2, currentPage - 1);

      const endPage = Math.min(
        totalPages - 1,
        currentPage + 1
      );

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 3) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  // =========================================
  // DELETE GALLERY
  // =========================================

  const handleDelete = async (id, title) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${title}"?`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await axios.delete(
        `${API_URL}/delete/${id}`
      );

      console.log("Delete Response:", response.data);

      if (response.data.success) {
        alert("Gallery image deleted successfully.");

        // Remove deleted item from UI
        setGalleryData((prevData) =>
          prevData.filter((item) => item._id !== id)
        );

        // If current page becomes empty, go to previous page
        if (currentGallery.length === 1 && currentPage > 1) {
          setCurrentPage((previousPage) => previousPage - 1);
        }
      } else {
        alert(
          response.data.message ||
            "Failed to delete gallery image."
        );
      }
    } catch (error) {
      console.error("Delete Gallery Error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete gallery image."
      );
    }
  };

  // =========================================
  // VIEW IMAGE
  // =========================================

  const handleViewImage = (image) => {
    if (!image) {
      alert("Image not available.");
      return;
    }

    window.open(
      image,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // =========================================
  // CATEGORY COUNT
  // =========================================

  const categoryCount = new Set(
    galleryData
      .map((item) => item.category)
      .filter(Boolean)
  ).size;

  // =========================================
  // RESIDENTIAL COUNT
  // =========================================

  const residentialCount = galleryData.filter(
    (item) => item.type === "Residential"
  ).length;

  // =========================================
  // COMMERCIAL COUNT
  // =========================================

  const commercialCount = galleryData.filter(
    (item) => item.type === "Commercial"
  ).length;

  // =========================================
  // RETURN
  // =========================================

  return (
    <div className="admin-gallery">

      {/* =====================================
          PAGE HEADER
      ===================================== */}

      <div className="gallery-page-header">

        <div>
          <p className="gallery-small-title">
            GALLERY MANAGEMENT
          </p>

          <h1>Gallery</h1>

          <span>
            Manage your interior design images and
            gallery collections.
          </span>
        </div>

        <Link
          to="/admin/gallery/add"
          className="add-gallery-btn"
        >
          + Add Gallery
        </Link>

      </div>

      {/* =====================================
          STATISTICS
      ===================================== */}

      <div className="gallery-stats">

        {/* TOTAL IMAGES */}

        <div className="gallery-stat-card">

          <div className="gallery-stat-icon">
            🖼️
          </div>

          <div>
            <span>Total Images</span>

            <strong>
              {galleryData.length}
            </strong>
          </div>

        </div>

        {/* RESIDENTIAL */}

        <div className="gallery-stat-card">

          <div className="gallery-stat-icon">
            🏠
          </div>

          <div>
            <span>Residential</span>

            <strong>
              {residentialCount}
            </strong>
          </div>

        </div>

        {/* COMMERCIAL */}

        <div className="gallery-stat-card">

          <div className="gallery-stat-icon">
            🏢
          </div>

          <div>
            <span>Commercial</span>

            <strong>
              {commercialCount}
            </strong>
          </div>

        </div>

        {/* CATEGORIES */}

        <div className="gallery-stat-card">

          <div className="gallery-stat-icon">
            📁
          </div>

          <div>
            <span>Categories</span>

            <strong>
              {categoryCount}
            </strong>
          </div>

        </div>

      </div>

      {/* =====================================
          SEARCH & FILTER
      ===================================== */}

      <div className="gallery-filter">

        {/* SEARCH */}

        <div className="gallery-search">

          <span>🔍</span>

          <input
            type="text"
            placeholder="Search gallery..."
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
            All Categories
          </option>

          <option value="Living Room">
            Living Room
          </option>

          <option value="Bedroom">
            Bedroom
          </option>

          <option value="Kitchen">
            Kitchen
          </option>

          <option value="Office">
            Office
          </option>
        </select>

      </div>

      {/* =====================================
          LOADING
      ===================================== */}

      {loading ? (

        <div className="gallery-no-results">

          <div>⏳</div>

          <h2>Loading Gallery...</h2>

          <p>
            Please wait while gallery images
            are loading.
          </p>

        </div>

      ) : (

        <>

          {/* =====================================
              GALLERY GRID
          ===================================== */}

          <div className="admin-gallery-grid">

            {currentGallery.length > 0 ? (

              currentGallery.map((item) => (

                <div
                  className="admin-gallery-card"
                  key={item._id}
                >

                  {/* IMAGE */}

                  <div className="admin-gallery-image">

                    <img
                      src={item.image}
                      alt={
                        item.title ||
                        "Gallery Image"
                      }
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/900x600?text=Image+Not+Found";
                      }}
                    />

                    {/* IMAGE OVERLAY */}

                    <div className="gallery-image-overlay">

                      {/* VIEW */}

                      <button
                        type="button"
                        onClick={() =>
                          handleViewImage(
                            item.image
                          )
                        }
                      >
                        View
                      </button>

                      {/* EDIT */}

                      <Link
                        to={`/admin/gallery/edit/${item._id}`}
                      >
                        Edit
                      </Link>

                    </div>

                  </div>

                  {/* CONTENT */}

                  <div className="admin-gallery-content">

                    <div>

                      {/* CATEGORY */}

                      <span className="gallery-category">
                        {item.category}
                      </span>

                      {/* TITLE */}

                      <h2>
                        {item.title}
                      </h2>

                      {/* TYPE */}

                      <p>
                        {item.type}
                      </p>

                    </div>

                    {/* DELETE */}

                    <button
                      type="button"
                      className="gallery-delete-btn"
                      onClick={() =>
                        handleDelete(
                          item._id,
                          item.title
                        )
                      }
                      title="Delete"
                    >
                      🗑
                    </button>

                  </div>

                </div>

              ))

            ) : (

              /* NO RESULTS */

              <div className="gallery-no-results">

                <div>🔍</div>

                <h2>
                  No Gallery Images Found
                </h2>

                <p>
                  Try changing your search or
                  category filter.
                </p>

              </div>

            )}

          </div>

          {/* =====================================
              PAGINATION FOOTER
          ===================================== */}

          {totalImages > 0 && (

            <div className="gallery-pagination-wrapper">

              {/* PAGE SIZE */}

              <div className="gallery-page-size">

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
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>

                <span>
                  per page
                </span>

              </div>

              {/* SHOWING INFO */}

              <div className="gallery-pagination-info">

                Showing{" "}

                <strong>
                  {indexOfFirstImage + 1}
                </strong>

                {" "}to{" "}

                <strong>
                  {Math.min(
                    indexOfLastImage,
                    totalImages
                  )}
                </strong>

                {" "}of{" "}

                <strong>
                  {totalImages}
                </strong>

                {" "}images

              </div>

              {/* PAGINATION CONTROLS */}

              {totalPages > 1 && (

                <div className="gallery-pagination-controls">

                  {/* PREVIOUS */}

                  <button
                    type="button"
                    className="gallery-pagination-arrow"
                    onClick={() =>
                      goToPage(
                        currentPage - 1
                      )
                    }
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                  >
                    ‹
                  </button>

                  {/* PAGE NUMBERS */}

                  {getPageNumbers().map(
                    (page, index) => {

                      if (page === "...") {
                        return (
                          <span
                            key={`dots-${index}`}
                            className="gallery-pagination-dots"
                          >
                            ...
                          </span>
                        );
                      }

                      return (
                        <button
                          type="button"
                          key={page}
                          className={`gallery-pagination-number ${
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
                    className="gallery-pagination-arrow"
                    onClick={() =>
                      goToPage(
                        currentPage + 1
                      )
                    }
                    disabled={
                      currentPage === totalPages
                    }
                    aria-label="Next page"
                  >
                    ›
                  </button>

                </div>

              )}

            </div>

          )}

        </>

      )}

    </div>
  );
};

export default AdminGallery;