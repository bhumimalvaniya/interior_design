
import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">

      {/* Main Footer */}
      <div className="footer-container">

        {/* About */}
        <div className="footer-column footer-about">
          <h2 className="footer-logo">
            Event<span>Hub</span>
          </h2>

          <p>
            Discover amazing events, connect with people, and create
            unforgettable memories. Find your next experience with EventHub.
          </p>

          <div className="social-icons">
            <a href="#" aria-label="Facebook">
              <FaFacebookF />
            </a>

            <a href="#" aria-label="Instagram">
              <FaInstagram />
            </a>

            <a href="#" aria-label="Twitter">
              <FaTwitter />
            </a>

            <a href="#" aria-label="YouTube">
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-column">
          <h3>Quick Links</h3>

          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>

            <li>
              <Link to="/about">About Us</Link>
            </li>

            <li>
              <Link to="/events">Events</Link>
            </li>

            <li>
              <Link to="/gallery">Gallery</Link>
            </li>

            <li>
              <Link to="/contactus">Contact Us</Link>
            </li>
          </ul>
        </div>

        {/* Event Links */}
        <div className="footer-column">
          <h3>Events</h3>

          <ul>
            <li>
              <Link to="/events/concert">Concerts</Link>
            </li>

            <li>
              <Link to="/events/workshop">Workshops</Link>
            </li>

            <li>
              <Link to="/events/sports">Sports Events</Link>
            </li>

            <li>
              <Link to="/events/entertainment">Entertainment</Link>
            </li>

            <li>
              <Link to="/events">Upcoming Events</Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-column footer-contact">
          <h3>Contact Us</h3>

          <div className="contact-item">
            <FaMapMarkerAlt />
            <p>Ahmedabad, Gujarat, India</p>
          </div>

          <div className="contact-item">
            <FaPhoneAlt />
            <p>+91 98765 43210</p>
          </div>

          <div className="contact-item">
            <FaEnvelope />
            <p>info@eventhub.com</p>
          </div>
        </div>

      </div>

      {/* Newsletter */}
      <div className="newsletter-section">
        <div className="newsletter-content">
          <div>
            <h3>Stay Updated</h3>
            <p>
              Subscribe to get the latest events and updates.
            </p>
          </div>

          <form className="newsletter-form">
            <input
              type="email"
              placeholder="Enter your email address"
            />

            <button type="submit">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} EventHub. All Rights Reserved.
        </p>

        <div className="footer-bottom-links">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms">Terms & Conditions</Link>
        </div>
      </div>

    </footer>
  );
};

export default Footer;

