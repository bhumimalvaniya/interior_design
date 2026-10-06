
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./About.css";
import API_URL from "../config/api";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:9000/api/v1";

/* =========================================================
   STATIC SLIDER DATA
   This data does NOT come from the database.
========================================================= */

const sliderData = [
  {
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=90",
    title: "Design Your Dream Space",
    text: "Beautiful interiors created with creativity and purpose.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1800&q=90",
    title: "Elegant. Modern. Timeless.",
    text: "We create spaces that feel as good as they look.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=90",
    title: "Make Your Space Special",
    text: "Thoughtful design made especially for you.",
  },
];

/* =========================================================
   IMAGE URL
========================================================= */

const getImageUrl = (image) => {
  if (!image || typeof image !== "string") {
    return sliderData[0].image;
  }

  const cleanImage = image.trim();

  if (
    cleanImage.startsWith("http://") ||
    cleanImage.startsWith("https://")
  ) {
    return cleanImage;
  }

  const backendURL = API_URL.replace(/\/api\/v1\/?$/, "");

  if (cleanImage.startsWith("/")) {
    return `${backendURL}${cleanImage}`;
  }

  return `${backendURL}/${cleanImage}`;
};

/* =========================================================
   ABOUT COMPONENT
========================================================= */

const About = () => {
  const [about, setAbout] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slide, setSlide] = useState(0);

  /* =======================================================
     FETCH DYNAMIC ABOUT DATA
  ======================================================= */

  const fetchAbout = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_URL}/about/featch`
      );

      console.log("ABOUT DATA:", response.data);

      if (
        response.data?.success &&
        Array.isArray(response.data.data)
      ) {
        setAbout(response.data.data);
      } else {
        setAbout([]);
      }
    } catch (error) {
      console.error("About Fetch Error:", error);
      setAbout([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  /* =======================================================
     STATIC SLIDER AUTO PLAY
  ======================================================= */

  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((prev) => (prev + 1) % sliderData.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setSlide((prev) => (prev + 1) % sliderData.length);
  };

  const previousSlide = () => {
    setSlide((prev) =>
      prev === 0 ? sliderData.length - 1 : prev - 1
    );
  };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <main className="about-page">

      {/* =================================================
          STATIC HERO SLIDER
      ================================================= */}

      <section className="about-slider">

        {sliderData.map((item, index) => (
          <div
            key={index}
            className={`about-slide ${
              slide === index ? "active" : ""
            }`}
            style={{
              backgroundImage: `url("${item.image}")`,
            }}
          >
            <div className="slider-overlay"></div>

            <div className="slider-content">
              <span>ABOUT US</span>

              <h1>{item.title}</h1>

              <p>{item.text}</p>

              <Link to="/contact">
                Contact Us
              </Link>
            </div>
          </div>
        ))}

        {/* Previous */}
        <button
          type="button"
          className="slider-arrow prev"
          onClick={previousSlide}
          aria-label="Previous slide"
        >
          ❮
        </button>

        {/* Next */}
        <button
          type="button"
          className="slider-arrow next"
          onClick={nextSlide}
          aria-label="Next slide"
        >
          ❯
        </button>

        {/* Dots */}
        <div className="slider-dots">
          {sliderData.map((_, index) => (
            <button
              type="button"
              key={index}
              className={slide === index ? "active" : ""}
              onClick={() => setSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>

      </section>

      {/* =================================================
          DYNAMIC ABOUT SECTION
      ================================================= */}

     <section className="about-section"> 
      <div className="section-heading"> 
        <span>WHO WE ARE</span> 
        <h2>Our Story</h2> 
        <p> Discover our experience, creativity and passion for
           creating beautiful interior spaces. </p> 
           </div> 
           {loading ? ( 
            <div className="about-message"> 
            Loading About Us... </div> ) : 
            about.length === 0 ?
             ( <div className="about-message"> 
             About information is not available. </div> ) :
              ( <div className="about-row"> 
              {about.map((item, index) => 
                ( 
                <div className="about-card" 
                key={item._id || index} >
                   {/* Image */} 
                   <div className="about-card-image"> 
                    <img src={getImageUrl(item.image)} 
                    alt={item.title || "About Us"} 
                    onError={(event) => { 
                      event.currentTarget.onerror = null;
                       event.currentTarget.src = sliderData
                       [index % sliderData.length].image; 
                       }} />
                        </div>
                         {/* Content */} 
                         <div className="about-card-content"> 
                          <span className="about-card-number">
                             {String(index + 1).padStart(2, "0")}
                              </span> 
                              <span className="about-label">
                                 ABOUT US 
                                 </span> 
                                 <h2> 
                                  {item.title || "Our Interior Design"}
                                   </h2>
                                    <h3> 
                                      {item.subtitle || ""} 
                                      </h3>
                                       <p> 
                                        {item.description || ""}
                                         </p> 
                                    <Link to="/contact" className="about-button" > 
                                    Let's Work Together 
                                    </Link> 
                                    </div> 
                                    </div> 
                                  ))} 
                                  </div> 
                                )} 
                                </section>

      {/* =================================================
          DYNAMIC STATISTICS
          Uses first About record
      ================================================= */}

      {!loading && about.length > 0 && (
        <section className="stats-section">

          <div className="stats-container">

            <div className="stat-card">
              <span className="stat-number">
                {about[0]?.experience || "0"}
              </span>

              <span className="stat-title">
                Years Experience
              </span>
            </div>

            <div className="stat-card">
              <span className="stat-number">
                {about[0]?.projects || "0"}
              </span>

              <span className="stat-title">
                Projects Completed
              </span>
            </div>

            <div className="stat-card">
              <span className="stat-number">
                {about[0]?.clients || "0"}
              </span>

              <span className="stat-title">
                Happy Clients
              </span>
            </div>

          </div>

        </section>
      )}

      {/* =================================================
          CTA
      ================================================= */}

      <section className="about-cta">

        <span>START YOUR PROJECT</span>

        <h2>
          Let's Create Something Beautiful
        </h2>

        <p>
          Have an idea for your dream space?
          Let's bring it to life.
        </p>

        <Link to="/contact">
          Contact Us
        </Link>

      </section>

    </main>
  );
};

export default About;

