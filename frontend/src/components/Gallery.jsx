
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Gallery.css";
import API_URL from "../config/api";

const Gallery = () => {
  const [galleryData, setGalleryData] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================================
  // FETCH GALLERY FROM DATABASE
  // =========================================

  const fetchGallery = async () => {
    try {
      setLoading(true);

      console.log("GALLERY API URL:", `${API_URL}/gallary/featch`);

      const response = await axios.get(
        `${API_URL}/gallary/featch`
      );

      console.log("Gallery Response:", response.data);

      if (response.data?.success) {
        setGalleryData(response.data.data || []);
      } else {
        setGalleryData([]);
        console.error(
          "Gallery API Error:",
          response.data?.message
        );
      }
    } catch (error) {
      console.error(
        "Gallery Fetch Error:",
        error.response?.data || error.message
      );

      setGalleryData([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // LOAD DATA
  // =========================================

  useEffect(() => {
    fetchGallery();
  }, []);

  // =========================================
  // CATEGORY LIST
  // =========================================

  const categories = [
    "All",
    ...new Set(
      galleryData
        .map((item) => item.category)
        .filter(Boolean)
    ),
  ];

  // =========================================
  // CATEGORY FILTER
  // =========================================

  const filteredGallery =
    activeCategory === "All"
      ? galleryData
      : galleryData.filter(
          (item) =>
            item.category === activeCategory
        );

  // =========================================
  // IMAGE URL
  // =========================================

  const getImageUrl = (image) => {
    if (!image) {
      return "";
    }

    // Cloudinary / external image
    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    // Local backend uploaded image
    return `${API_URL.replace(
      "/api/v1",
      ""
    )}/uploads/${image}`;
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="gallery-page">
        <div className="gallery-loading">
          <h2>Loading Gallery...</h2>
          <p>
            Please wait while our gallery is loading.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-page">

      {/* =====================================
          HERO
      ===================================== */}

      <section className="gallery-hero">
        <div className="gallery-hero-overlay">
          <div className="gallery-hero-content">
            <p>OUR PORTFOLIO</p>

            <h1>
              Our Creative Gallery
            </h1>

            <span>
              Explore our collection of beautiful
              and inspiring interior spaces.
            </span>
          </div>
        </div>
      </section>

      {/* =====================================
          INTRO
      ===================================== */}

      <section className="gallery-intro">
        <p className="gallery-label">
          OUR WORK
        </p>

        <h2>
          Inspiration In
          <span> Every Detail</span>
        </h2>

        <p className="gallery-description">
          Take a look at some of our latest interior
          design projects. From modern living rooms
          to elegant bedrooms, every space is carefully
          designed to combine beauty, comfort and
          functionality.
        </p>
      </section>

      {/* =====================================
          CATEGORY FILTER
      ===================================== */}

      <section className="gallery-section">

        <div className="gallery-filters">
          {categories.map((category) => (
            <button
              key={category}
              className={
                activeCategory === category
                  ? "gallery-filter active"
                  : "gallery-filter"
              }
              onClick={() =>
                setActiveCategory(category)
              }
            >
              {category}
            </button>
          ))}
        </div>

        {/* =====================================
            GALLERY GRID
        ===================================== */}

        <div className="gallery-grid">

          {filteredGallery.length > 0 ? (

            filteredGallery.map((item) => (

              <div
                className="gallery-card"
                key={item._id}
                onClick={() =>
                  setSelectedImage(item)
                }
              >

                <img
                  src={getImageUrl(item.image)}
                  alt={item.title || "Gallery image"}
                  onError={(e) => {
                    console.error(
                      "IMAGE LOAD ERROR:",
                      item.image
                    );
                  }}
                />

                <div className="gallery-overlay">

                  <div>
                    <p>
                      {item.category}
                    </p>

                    <h3>
                      {item.title}
                    </h3>
                  </div>

                  <span className="gallery-view">
                    +
                  </span>

                </div>

              </div>

            ))

          ) : (

            <div className="gallery-no-data">

              <h2>
                No Images Found
              </h2>

              <p>
                There are no images in this category.
              </p>

            </div>

          )}

        </div>
      </section>

      {/* =====================================
          LIGHTBOX
      ===================================== */}

      {selectedImage && (

        <div
          className="gallery-lightbox"
          onClick={() =>
            setSelectedImage(null)
          }
        >

          <button
            className="lightbox-close"
            onClick={() =>
              setSelectedImage(null)
            }
          >
            ×
          </button>

          <div
            className="lightbox-content"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <img
              src={getImageUrl(
                selectedImage.image
              )}
              alt={
                selectedImage.title ||
                "Gallery image"
              }
            />

            <div className="lightbox-info">

              <p>
                {selectedImage.category}
              </p>

              <h3>
                {selectedImage.title}
              </h3>

            </div>

          </div>

        </div>

      )}

      {/* =====================================
          CTA
      ===================================== */}

      <section className="gallery-cta">

        <div className="gallery-cta-content">

          <p>
            HAVE A PROJECT IN MIND?
          </p>

          <h2>
            Let's Design Your
            <span> Dream Space</span>
          </h2>

          <p>
            Tell us about your ideas and let our
            team create something beautiful for you.
          </p>

          <a
            href="/contactus"
            className="gallery-cta-button"
          >
            Contact Us
          </a>

        </div>

      </section>

    </div>
  );
};

export default Gallery;

