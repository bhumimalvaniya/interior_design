
// import React, { useState } from "react";
// import "./Gallery.css";

// const galleryData = [
//   {
//     id: 1,
//     title: "Modern Living Room",
//     category: "Living Room",
//     image:
//       "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85",
//   },
//   {
//     id: 2,
//     title: "Luxury Bedroom",
//     category: "Bedroom",
//     image:
//       "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85",
//   },
//   {
//     id: 3,
//     title: "Elegant Kitchen",
//     category: "Kitchen",
//     image:
//       "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85",
//   },
//   {
//     id: 4,
//     title: "Minimal Dining Area",
//     category: "Dining",
//     image:
//       "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=85",
//   },
//   {
//     id: 5,
//     title: "Contemporary Interior",
//     category: "Living Room",
//     image:
//       "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85",
//   },
//   {
//     id: 6,
//     title: "Cozy Bedroom",
//     category: "Bedroom",
//     image:
//       "https://images.unsplash.com/photo-1617104678098-de229db51175?auto=format&fit=crop&w=1200&q=85",
//   },
//   {
//     id: 7,
//     title: "Modern Kitchen",
//     category: "Kitchen",
//     image:
//       "https://images.unsplash.com/photo-1556912167-f556f1f39fdf?auto=format&fit=crop&w=1200&q=85",
//   },
//   {
//     id: 8,
//     title: "Luxury Dining Room",
//     category: "Dining",
//     image:
//       "https://images.unsplash.com/photo-1615874694520-474822394e73?auto=format&fit=crop&w=1200&q=85",
//   },
//   {
//     id: 9,
//     title: "Classic Living Space",
//     category: "Living Room",
//     image:
//       "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=85",
//   },
//   {
//     id: 10,
//     title: "Elegant Bedroom",
//     category: "Bedroom",
//     image:
//       "https://images.unsplash.com/photo-1617325710236-4a36d4c6b8d7?auto=format&fit=crop&w=1200&q=85",
//   },
//   {
//     id: 11,
//     title: "Luxury Kitchen Design",
//     category: "Kitchen",
//     image:
//       "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
//   },
//   {
//     id: 12,
//     title: "Modern Dining Space",
//     category: "Dining",
//     image:
//       "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1200&q=85",
//   },
// ];

// const Gallery = () => {
//   const [activeCategory, setActiveCategory] = useState("All");
//   const [selectedImage, setSelectedImage] = useState(null);

//   const categories = [
//     "All",
//     "Living Room",
//     "Bedroom",
//     "Kitchen",
//     "Dining",
//   ];

//   const filteredGallery =
//     activeCategory === "All"
//       ? galleryData
//       : galleryData.filter(
//           (item) => item.category === activeCategory
//         );

//   return (
//     <div className="gallery-page">

//       {/* ================= HERO ================= */}

//       <section className="gallery-hero">
//         <div className="gallery-hero-overlay">
//           <div className="gallery-hero-content">
//             <p>OUR PORTFOLIO</p>

//             <h1>Our Creative Gallery</h1>

//             <span>
//               Explore our collection of beautiful and inspiring
//               interior spaces.
//             </span>
//           </div>
//         </div>
//       </section>


//       {/* ================= GALLERY INTRO ================= */}

//       <section className="gallery-intro">

//         <p className="gallery-label">
//           OUR WORK
//         </p>

//         <h2>
//           Inspiration In
//           <span> Every Detail</span>
//         </h2>

//         <p className="gallery-description">
//           Take a look at some of our latest interior design projects.
//           From modern living rooms to elegant bedrooms, every space is
//           carefully designed to combine beauty, comfort and functionality.
//         </p>

//       </section>


//       {/* ================= FILTER ================= */}

//       <section className="gallery-section">

//         <div className="gallery-filters">

//           {categories.map((category) => (
//             <button
//               key={category}
//               className={
//                 activeCategory === category
//                   ? "gallery-filter active"
//                   : "gallery-filter"
//               }
//               onClick={() => setActiveCategory(category)}
//             >
//               {category}
//             </button>
//           ))}

//         </div>


//         {/* ================= GALLERY GRID ================= */}

//         <div className="gallery-grid">

//           {filteredGallery.map((item) => (
//             <div
//               className="gallery-card"
//               key={item.id}
//               onClick={() => setSelectedImage(item)}
//             >

//               <img
//                 src={item.image}
//                 alt={item.title}
//               />

//               <div className="gallery-overlay">

//                 <div>
//                   <p>{item.category}</p>
//                   <h3>{item.title}</h3>
//                 </div>

//                 <span className="gallery-view">
//                   +
//                 </span>

//               </div>

//             </div>
//           ))}

//         </div>

//       </section>


//       {/* ================= LIGHTBOX ================= */}

//       {selectedImage && (
//         <div
//           className="gallery-lightbox"
//           onClick={() => setSelectedImage(null)}
//         >

//           <button
//             className="lightbox-close"
//             onClick={() => setSelectedImage(null)}
//           >
//             ×
//           </button>

//           <div
//             className="lightbox-content"
//             onClick={(e) => e.stopPropagation()}
//           >

//             <img
//               src={selectedImage.image}
//               alt={selectedImage.title}
//             />

//             <div className="lightbox-info">
//               <p>{selectedImage.category}</p>
//               <h3>{selectedImage.title}</h3>
//             </div>

//           </div>

//         </div>
//       )}


//       {/* ================= CTA ================= */}

//       <section className="gallery-cta">

//         <div className="gallery-cta-content">

//           <p>HAVE A PROJECT IN MIND?</p>

//           <h2>
//             Let's Design Your
//             <span> Dream Space</span>
//           </h2>

//           <p>
//             Tell us about your ideas and let our team create something
//             beautiful for you.
//           </p>

//           <a href="/contactus" className="gallery-cta-button">
//             Contact Us
//           </a>

//         </div>

//       </section>

//     </div>
//   );
// };

// export default Gallery;

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Gallery.css";
import API_URL from "../config/api";

// const API_URL = "http://localhost:9000";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:9000/api/v1";

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

    const response = await axios.get(
      `${API_URL}/api/v1/gallary/featch`
    );

    console.log("Gallery Response:", response.data);
    console.log("Gallery Data:", response.data.data);

    if (response.data.success) {
      // Get all gallery records from database
      setGalleryData(response.data.data || []);
    } else {
      setGalleryData([]);
    }
  } catch (error) {
    console.error("Gallery Fetch Error:", error);

    alert(
      error.response?.data?.message ||
        "Failed to load gallery."
    );
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

    // Cloudinary image
    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    // Local uploaded image
    return `http://localhost:9000/uploads/${image}`;
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
                  // src={`http://localhost:9000/uploads/${item.image}`}
                  alt={item.title}
                  onError={(e) => {
    console.log("IMAGE LOAD ERROR:", item.image);
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
              alt={selectedImage.title}
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