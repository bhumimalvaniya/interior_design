
import React from "react";
import { Link } from "react-router-dom";
import "./About.css";

const About = () => {
  return (
    <div className="about-page">

      {/* ================= HERO ================= */}
      <section className="about-hero">
        <div className="about-hero-overlay">
          <div className="about-hero-content">
            <p>ABOUT US</p>
            <h1>We Create Spaces That Inspire</h1>
            <span>
              Beautiful design, thoughtful details, and spaces made for you.
            </span>
          </div>
        </div>
      </section>

      {/* ================= INTRO ================= */}
      <section className="about-intro">

        <div className="about-intro-image">
          <img
            src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=85"
            alt="Modern interior"
          />
        </div>

        <div className="about-intro-content">
          <p className="about-label">WHO WE ARE</p>

          <h2>
            Designing Beautiful
            <span> Spaces With Purpose</span>
          </h2>

          <p>
            We believe that great design is more than just beautiful
            furniture and attractive colors. It is about creating spaces
            that feel comfortable, functional, and personal.
          </p>

          <p>
            Our team combines creativity, modern design principles, and
            attention to detail to create interiors that reflect the unique
            personality and lifestyle of every client.
          </p>

          <Link to="/contact" className="about-main-btn">
            Let's Work Together
          </Link>
        </div>

      </section>

      {/* ================= STATS ================= */}
      <section className="about-stats">

        <div className="about-stat">
          <h3>10+</h3>
          <p>Years Experience</p>
        </div>

        <div className="about-stat">
          <h3>250+</h3>
          <p>Projects Completed</p>
        </div>

        <div className="about-stat">
          <h3>180+</h3>
          <p>Happy Clients</p>
        </div>

        <div className="about-stat">
          <h3>25+</h3>
          <p>Design Awards</p>
        </div>

      </section>

      {/* ================= MISSION ================= */}
      <section className="mission-section">

        <div className="mission-content">
          <p className="about-label">OUR MISSION</p>

          <h2>
            Turning Your Ideas Into
            <span> Beautiful Reality</span>
          </h2>

          <p>
            Our mission is to transform ordinary spaces into extraordinary
            environments. We listen carefully to our clients, understand
            their needs, and develop designs that combine style, comfort,
            and functionality.
          </p>

          <div className="mission-points">

            <div className="mission-point">
              <div className="mission-number">01</div>
              <div>
                <h3>Creative Design</h3>
                <p>
                  Unique concepts created specifically for your space.
                </p>
              </div>
            </div>

            <div className="mission-point">
              <div className="mission-number">02</div>
              <div>
                <h3>Quality Materials</h3>
                <p>
                  Carefully selected materials for lasting beauty.
                </p>
              </div>
            </div>

            <div className="mission-point">
              <div className="mission-number">03</div>
              <div>
                <h3>Client Focused</h3>
                <p>
                  Your vision and satisfaction always come first.
                </p>
              </div>
            </div>

          </div>
        </div>

        <div className="mission-image">
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=85"
            alt="Interior design"
          />
        </div>

      </section>

      {/* ================= VALUES ================= */}
      <section className="values-section">

        <div className="values-heading">
          <p className="about-label">OUR VALUES</p>

          <h2>
            What Makes Us
            <span> Different</span>
          </h2>
        </div>

        <div className="values-grid">

          <div className="value-card">
            <div className="value-icon">✦</div>
            <h3>Creativity</h3>
            <p>
              We bring fresh ideas and innovative solutions to every project.
            </p>
          </div>

          <div className="value-card">
            <div className="value-icon">◆</div>
            <h3>Quality</h3>
            <p>
              We never compromise on quality, craftsmanship, or attention
              to detail.
            </p>
          </div>

          <div className="value-card">
            <div className="value-icon">♡</div>
            <h3>Passion</h3>
            <p>
              We love what we do and put our passion into every design.
            </p>
          </div>

          <div className="value-card">
            <div className="value-icon">✓</div>
            <h3>Trust</h3>
            <p>
              We build long-term relationships through honesty and
              transparent communication.
            </p>
          </div>

        </div>

      </section>

      {/* ================= CTA ================= */}
      <section className="about-cta">

        <div className="about-cta-content">
          <p>READY TO START?</p>

          <h2>
            Let's Create Something
            <span> Beautiful Together</span>
          </h2>

          <p>
            Have an idea for your space? We would love to hear about it.
          </p>

          <Link to="/contact" className="about-cta-btn">
            Contact Us
          </Link>
        </div>

      </section>

    </div>
  );
};

export default About;
