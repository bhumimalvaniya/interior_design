
import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-page">

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay">
          <div className="hero-content">
            <p className="hero-small-title">WELCOME TO OUR EVENT PLATFORM</p>

            <h1>
              Create Memories
              <br />
              <span>That Last Forever</span>
            </h1>

            <p className="hero-description">
              Discover amazing events, connect with people, and experience
              unforgettable moments all in one place.
            </p>

            <div className="hero-buttons">
              <Link to="/gallery" className="primary-btn">
                Explore Events
              </Link>

              <Link to="/about" className="secondary-btn">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-heading">
          <p>WHY CHOOSE US</p>
          <h2>Everything You Need for Amazing Events</h2>
        </div>

        <div className="features-container">

          <div className="feature-card">
            <div className="feature-icon">🎉</div>
            <h3>Amazing Events</h3>
            <p>
              Discover exciting events and experiences happening around you.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎟️</div>
            <h3>Easy Booking</h3>
            <p>
              Book your tickets quickly and securely with our simple process.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📍</div>
            <h3>Best Locations</h3>
            <p>
              Find events at amazing locations and enjoy memorable experiences.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💳</div>
            <h3>Secure Payment</h3>
            <p>
              Make your event payments safely with our secure payment system.
            </p>
          </div>

        </div>
      </section>

      {/* About Section */}
      <section className="about-home-section">

        <div className="about-image">
          <img
            src="https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=900&q=80"
            alt="Event"
          />
        </div>

        <div className="about-content">
          <p className="section-label">ABOUT OUR PLATFORM</p>

          <h2>
            We Make Your
            <span> Events Special</span>
          </h2>

          <p>
            Our event management platform helps you discover, book and enjoy
            different types of events. From entertainment and concerts to
            workshops and special occasions, everything is available in one
            convenient place.
          </p>

          <p>
            We focus on providing a simple, secure and enjoyable experience
            for every visitor.
          </p>

          <Link to="/about" className="about-btn">
            Discover More
          </Link>
        </div>

      </section>

      

    </div>
  );
};

export default Home;

