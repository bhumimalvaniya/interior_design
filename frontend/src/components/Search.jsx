
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Search.css";

const Search = () => {
  const [searchText, setSearchText] = useState("");

  const searchData = [
    {
      id: 1,
      title: "Luxury Living Room",
      category: "Living Room",
      description:
        "Elegant and modern living room interior design with premium furniture.",
      image:
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80",
      link: "/services/living-room",
    },
    {
      id: 2,
      title: "Modern Bedroom",
      category: "Bedroom",
      description:
        "Comfortable and stylish bedroom design created for modern homes.",
      image:
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=80",
      link: "/services/bedroom",
    },
    {
      id: 3,
      title: "Modular Kitchen",
      category: "Kitchen",
      description:
        "Functional modular kitchen designs with elegant storage solutions.",
      image:
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80",
      link: "/services/modular-kitchen",
    },
    {
      id: 4,
      title: "Office Interior",
      category: "Office",
      description:
        "Professional office interior designs that improve productivity.",
      image:
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
      link: "/services/office",
    },
    {
      id: 5,
      title: "Commercial Interior",
      category: "Commercial",
      description:
        "Creative commercial spaces designed for modern businesses.",
      image:
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80",
      link: "/services/commercial",
    },
    {
      id: 6,
      title: "Luxury Interior",
      category: "Luxury",
      description:
        "Premium luxury interiors combining comfort, beauty and functionality.",
      image:
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80",
      link: "/projects/luxury",
    },
  ];

  const filteredData = searchData.filter((item) => {
    const value = searchText.toLowerCase();

    return (
      item.title.toLowerCase().includes(value) ||
      item.category.toLowerCase().includes(value) ||
      item.description.toLowerCase().includes(value)
    );
  });

  return (
    <div className="search-page">

      {/* ======================================
          SEARCH BANNER
      ====================================== */}

      <section className="search-banner">

        <div className="search-banner-overlay"></div>

        <div className="search-banner-content">

          <p>INTERIORSTUDIO</p>

          <h1>
            Search <span>Designs</span>
          </h1>

          <div className="search-banner-line"></div>

          <span>
            Find your perfect interior design
          </span>

        </div>

      </section>


      {/* ======================================
          SEARCH SECTION
      ====================================== */}

      <section className="search-section">

        <div className="search-container">

          {/* Search Input */}

          <div className="search-box">

            <span className="search-icon">
              🔍
            </span>

            <input
              type="text"
              placeholder="Search living room, bedroom, kitchen..."
              value={searchText}
              onChange={(e) =>
                setSearchText(e.target.value)
              }
            />

            {searchText && (
              <button
                className="clear-search"
                onClick={() => setSearchText("")}
              >
                ✕
              </button>
            )}

          </div>


          {/* Search Result Information */}

          <div className="search-result-header">

            <div>

              <p>OUR DESIGNS</p>

              <h2>
                {searchText
                  ? `Results for "${searchText}"`
                  : "Explore Our Designs"}
              </h2>

            </div>

            <span>
              {filteredData.length} Designs Found
            </span>

          </div>


          {/* ==================================
              RESULTS
          ================================== */}

          {filteredData.length > 0 ? (

            <div className="search-grid">

              {filteredData.map((item) => (

                <div
                  className="search-card"
                  key={item.id}
                >

                  {/* Image */}

                  <div className="search-card-image">

                    <img
                      src={item.image}
                      alt={item.title}
                    />

                    <div className="search-card-category">
                      {item.category}
                    </div>

                  </div>


                  {/* Content */}

                  <div className="search-card-content">

                    <p>
                      INTERIOR DESIGN
                    </p>

                    <h3>
                      {item.title}
                    </h3>

                    <span>
                      {item.description}
                    </span>


                    <Link
                      to={item.link}
                      className="search-card-link"
                    >
                      Explore Design
                      <b>→</b>
                    </Link>

                  </div>

                </div>

              ))}

            </div>

          ) : (

            /* ==================================
               NO RESULTS
            ================================== */

            <div className="search-empty">

              <div className="search-empty-icon">
                🔍
              </div>

              <h3>
                No Designs Found
              </h3>

              <p>
                We couldn't find any designs
                matching "{searchText}".
              </p>

              <button
                onClick={() => setSearchText("")}
              >
                View All Designs
              </button>

            </div>

          )}

        </div>

      </section>

    </div>
  );
};

export default Search;

