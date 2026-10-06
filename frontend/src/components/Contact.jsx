
import React, { useState } from "react";
import "./Contact.css";
import axios from "axios";
import API_URL from "../config/api";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post(
         `${API_URL}/contact/add`,
      // "http://localhost:9000/api/v1/contact/add",
      formData
    );

    console.log("CONTACT RESPONSE:", response.data);

    if (response.data.success) {
      alert("Thank you! Your message has been submitted.");

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    }
  } catch (error) {
    console.error("CONTACT ERROR:", error);

    if (error.response) {
      console.error("Backend status:", error.response.status);
      console.error("Backend data:", error.response.data);

      alert(
        error.response.data?.message ||
          "Failed to submit your message."
      );
    } else {
      alert("Backend server is not responding.");
    }
  }
};

  return (
    <div className="contact-page">

      {/* ================= HERO ================= */}

      <section className="contact-hero">
        <div className="contact-hero-overlay">
          <div className="contact-hero-content">

            <p>GET IN TOUCH</p>

            <h1>Contact Us</h1>

            <span>
              We would love to hear from you. Let's create something
              beautiful together.
            </span>

          </div>
        </div>
      </section>


      {/* ================= CONTACT INTRO ================= */}

      <section className="contact-intro">

        <p className="contact-label">
          CONTACT US
        </p>

        <h2>
          Let's Start a
          <span> Conversation</span>
        </h2>

        <p>
          Have a question, project idea, or simply want to know more
          about our services? Send us a message and our team will get
          back to you as soon as possible.
        </p>

      </section>


      {/* ================= CONTACT MAIN ================= */}

      <section className="contact-main">

        {/* Contact Information */}

        <div className="contact-information">

          <p className="contact-label">
            CONTACT DETAILS
          </p>

          <h2>
            We'd Love To
            <span> Hear From You</span>
          </h2>

          <p className="contact-info-description">
            Whether you're planning a complete interior transformation
            or just need some design advice, our team is ready to help.
          </p>


          {/* Address */}

          <div className="contact-detail">

            <div className="contact-detail-icon">
              📍
            </div>

            <div>
              <h3>Our Location</h3>

              <p>
                123 Design Street,
                <br />
                Ahmedabad, Gujarat, India
              </p>
            </div>

          </div>


          {/* Phone */}

          <div className="contact-detail">

            <div className="contact-detail-icon">
              ☎
            </div>

            <div>
              <h3>Phone Number</h3>

              <p>
                +91 98765 43210
                <br />
                +91 98765 12345
              </p>
            </div>

          </div>


          {/* Email */}

          <div className="contact-detail">

            <div className="contact-detail-icon">
              ✉
            </div>

            <div>
              <h3>Email Address</h3>

              <p>
                info@interiordesign.com
                <br />
                hello@interiordesign.com
              </p>
            </div>

          </div>


          {/* Working Hours */}

          <div className="contact-detail">

            <div className="contact-detail-icon">
              ◷
            </div>

            <div>
              <h3>Working Hours</h3>

              <p>
                Monday - Saturday
                <br />
                10:00 AM - 7:00 PM
              </p>
            </div>

          </div>


          {/* Social */}

          <div className="contact-social">

            <h3>Follow Us</h3>

            <div className="contact-social-icons">

              <a href="#" aria-label="Facebook">
                f
              </a>

              <a href="#" aria-label="Instagram">
                i
              </a>

              <a href="#" aria-label="Twitter">
                t
              </a>

              <a href="#" aria-label="Pinterest">
                p
              </a>

            </div>

          </div>

        </div>


        {/* Contact Form */}

        <div className="contact-form-wrapper">

          <form
            className="contact-form"
            onSubmit={handleSubmit}
          >

            <div className="form-heading">

              <p className="contact-label">
                SEND MESSAGE
              </p>

              <h2>
                Tell Us About Your
                <span> Project</span>
              </h2>

            </div>


            {/* Name + Email */}

            <div className="form-row">

              <div className="form-group">

                <label htmlFor="name">
                  Your Name
                </label>

                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="form-group">

                <label htmlFor="email">
                  Email Address
                </label>

                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            {/* Phone + Subject */}

            <div className="form-row">

              <div className="form-group">

                <label htmlFor="phone">
                  Phone Number
                </label>

                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                />

              </div>


              <div className="form-group">

                <label htmlFor="subject">
                  Subject
                </label>

                <input
                  type="text"
                  id="subject"
                  name="subject"
                  placeholder="Enter subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            {/* Message */}

            <div className="form-group">

              <label htmlFor="message">
                Your Message
              </label>

              <textarea
                id="message"
                name="message"
                rows="6"
                placeholder="Tell us about your project..."
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>

            </div>


            <button
              type="submit"
              className="contact-submit-btn"
            >
              Send Message
            </button>

          </form>

        </div>

      </section>


      {/* ================= MAP ================= */}

      <section className="contact-map-section">

        <div className="contact-map-heading">

          <p className="contact-label">
            FIND US
          </p>

          <h2>
            Visit Our
            <span> Studio</span>
          </h2>

        </div>

        <div className="contact-map">

          <iframe
            title="Our Location"
            src="https://www.google.com/maps?q=Ahmedabad,Gujarat,India&output=embed"
            loading="lazy"
            allowFullScreen
          ></iframe>

        </div>

      </section>


      {/* ================= CTA ================= */}

      <section className="contact-cta">

        <div className="contact-cta-content">

          <p>LET'S CREATE TOGETHER</p>

          <h2>
            Your Dream Space
            <span> Starts Here</span>
          </h2>

          <p>
            Get in touch with our team and take the first step toward
            creating a space you'll love.
          </p>

        </div>

      </section>

    </div>
  );
};

export default Contact;


