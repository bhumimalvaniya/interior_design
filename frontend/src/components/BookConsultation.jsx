import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./BookConsultation.css";
import API_URL from "../config/api";

// const API_URL = "http://localhost:9000/api/v1";


const BookConsultation = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    consultationType: "",
    preferredDate: "",
    preferredTime: "",
    budget: "",
    message: "",
  });

  const [services, setServices] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [budgetOptions, setBudgetOptions] = useState([]);

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // =========================================
  // DEFAULT OPTIONS
  // =========================================

  const defaultTimes = [
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
  ];

  const defaultBudgets = [
    "Below ₹5 Lakh",
    "₹5 - ₹10 Lakh",
    "₹10 - ₹20 Lakh",
    "₹20 - ₹30 Lakh",
    "Above ₹30 Lakh",
  ];

  // =========================================
  // FETCH SERVICES
  // =========================================

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setFetchLoading(true);

      const response = await axios.get(
        `${API_URL}/services/featch`
      );

      console.log("SERVICES RESPONSE:", response.data);

      if (response.data.success) {
        const serviceData = response.data.data || [];

        setServices(serviceData);
      }

      setTimeSlots(defaultTimes);
      setBudgetOptions(defaultBudgets);
    } catch (error) {
      console.error("FETCH SERVICES ERROR:", error);

      // Keep fallback options
      setTimeSlots(defaultTimes);
      setBudgetOptions(defaultBudgets);
    } finally {
      setFetchLoading(false);
    }
  };

  // =========================================
  // HANDLE CHANGE
  // =========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // =========================================
  // PHONE CHANGE
  // =========================================

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");

    if (value.length <= 10) {
      setFormData((prev) => ({
        ...prev,
        phone: value,
      }));
    }
  };

  // =========================================
  // SUBMIT
  // =========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess("");
    setError("");

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone ||
      !formData.consultationType ||
      !formData.preferredDate ||
      !formData.preferredTime
    ) {
      setError("Please fill all required fields.");
      return;
    }

    if (formData.phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      setLoading(true);

      console.log(
        "SENDING CONSULTATION:",
        formData
      );

      const response = await axios.post(
        `${API_URL}/consultation/book`,
        formData
      );

      console.log(
        "CONSULTATION RESPONSE:",
        response.data
      );

      if (response.data.success) {
        setSuccess(
          response.data.message ||
            "Your consultation request has been submitted successfully!"
        );

        setFormData({
          name: "",
          email: "",
          phone: "",
          consultationType: "",
          preferredDate: "",
          preferredTime: "",
          budget: "",
          message: "",
        });
      } else {
        setError(
          response.data.message ||
            "Unable to submit consultation."
        );
      }
    } catch (error) {
      console.error(
        "CONSULTATION ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to connect to server."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // TODAY DATE
  // =========================================

  const today = new Date()
    .toISOString()
    .split("T")[0];

  // =========================================
  // RENDER
  // =========================================

  return (
    <div className="consultation-page">

      {/* =========================================
          HERO
      ========================================= */}

      <section className="consultation-hero">
        <div className="consultation-hero-overlay"></div>

        <div className="consultation-hero-content">
          <p>INTERIOR DESIGN CONSULTATION</p>

          <h1>
            Let's Create Your
            <span>Dream Space</span>
          </h1>

          <div className="consultation-hero-line"></div>

          <span>
            Professional Design • Personal Attention • Beautiful Spaces
          </span>
        </div>
      </section>

      {/* =========================================
          MAIN
      ========================================= */}

      <section className="consultation-section">

        <div className="consultation-wrapper">

          {/* =====================================
              INFORMATION
          ===================================== */}

          <div className="consultation-info">

            <p className="consultation-label">
              BOOK A CONSULTATION
            </p>

            <h2>
              Let's Talk About
              <span>Your Project</span>
            </h2>

            <p className="consultation-description">
              Whether you're planning a complete home
              renovation, a new office, or simply looking
              for fresh design ideas, our interior designers
              are here to help.
            </p>

            <p className="consultation-description">
              Book a consultation and discuss your vision,
              requirements, budget and style with our team.
            </p>

            {/* BENEFITS */}

            <div className="consultation-benefits">

              <div className="consultation-benefit">
                <div className="benefit-icon">
                  ✦
                </div>

                <div>
                  <h3>
                    Personalized Design
                  </h3>

                  <p>
                    Designs created specifically for
                    your lifestyle and preferences.
                  </p>
                </div>
              </div>

              <div className="consultation-benefit">
                <div className="benefit-icon">
                  ✓
                </div>

                <div>
                  <h3>
                    Expert Guidance
                  </h3>

                  <p>
                    Get professional advice from
                    experienced interior designers.
                  </p>
                </div>
              </div>

              <div className="consultation-benefit">
                <div className="benefit-icon">
                  ⏱
                </div>

                <div>
                  <h3>
                    Flexible Scheduling
                  </h3>

                  <p>
                    Choose a date and time that works
                    best for you.
                  </p>
                </div>
              </div>

            </div>

            {/* CONTACT */}

            <div className="consultation-contact">

              <div>
                <span>CALL US</span>
                <p>+91 98765 43210</p>
              </div>

              <div>
                <span>EMAIL US</span>
                <p>info@interiordesign.com</p>
              </div>

            </div>

          </div>

          {/* =====================================
              FORM
          ===================================== */}

          <div className="consultation-form-box">

            <div className="consultation-form-header">

              <p>
                GET IN TOUCH
              </p>

              <h2>
                Book Your Consultation
              </h2>

              <span>
                Fill in the details below and our team
                will contact you shortly.
              </span>

            </div>

            {/* LOADING */}

            {fetchLoading && (
              <div className="consultation-loading">
                Loading services...
              </div>
            )}

            {/* SUCCESS */}

            {success && (
              <div className="consultation-success">
                {success}
              </div>
            )}

            {/* ERROR */}

            {error && (
              <div className="consultation-error">
                {error}
              </div>
            )}

            <form
              className="consultation-form"
              onSubmit={handleSubmit}
            >

              {/* NAME + EMAIL */}

              <div className="consultation-row">

                <div className="consultation-input-group">

                  <label>
                    Full Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />

                </div>

                <div className="consultation-input-group">

                  <label>
                    Email Address *
                  </label>

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>

              {/* PHONE + SERVICE */}

              <div className="consultation-row">

                <div className="consultation-input-group">

                  <label>
                    Phone Number *
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    maxLength="10"
                    required
                  />

                </div>

                <div className="consultation-input-group">

                  <label>
                    Consultation Type *
                  </label>

                  <select
                    name="consultationType"
                    value={formData.consultationType}
                    onChange={handleChange}
                    required
                  >

                    <option value="">
                      Select Service
                    </option>

                    {services.length > 0 ? (
                      services.map((service) => (
                        <option
                          key={service._id}
                          value={service.title}
                        >
                          {service.title}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="Residential Interior">
                          Residential Interior
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

                        <option value="Office Interior">
                          Office Interior
                        </option>

                        <option value="Commercial Interior">
                          Commercial Interior
                        </option>

                        <option value="Modular Kitchen">
                          Modular Kitchen
                        </option>
                      </>
                    )}

                  </select>

                </div>

              </div>

              {/* DATE + TIME */}

              <div className="consultation-row">

                <div className="consultation-input-group">

                  <label>
                    Preferred Date *
                  </label>

                  <input
                    type="date"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    min={today}
                    required
                  />

                </div>

                <div className="consultation-input-group">

                  <label>
                    Preferred Time *
                  </label>

                  <select
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleChange}
                    required
                  >

                    <option value="">
                      Select Time
                    </option>

                    {timeSlots.map((time) => (
                      <option
                        key={time}
                        value={time}
                      >
                        {time}
                      </option>
                    ))}

                  </select>

                </div>

              </div>

              {/* BUDGET */}

              <div className="consultation-input-group">

                <label>
                  Estimated Budget
                </label>

                <select
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                >

                  <option value="">
                    Select your budget
                  </option>

                  {budgetOptions.map(
                    (budget) => (
                      <option
                        key={budget}
                        value={budget}
                      >
                        {budget}
                      </option>
                    )
                  )}

                </select>

              </div>

              {/* MESSAGE */}

              <div className="consultation-input-group">

                <label>
                  Tell Us About Your Project
                </label>

                <textarea
                  name="message"
                  rows="5"
                  placeholder="Tell us about your project, requirements, ideas..."
                  value={formData.message}
                  onChange={handleChange}
                />

              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                className="consultation-submit"
                disabled={loading}
              >

                {loading
                  ? "Submitting..."
                  : "Book Consultation"}

                {!loading && (
                  <span>→</span>
                )}

              </button>

            </form>

          </div>

        </div>

      </section>

      {/* =========================================
          BOTTOM
      ========================================= */}

      <section className="consultation-bottom">

        <div>

          <p>
            HAVE QUESTIONS?
          </p>

          <h2>
            We're Here To Help
          </h2>

          <span>
            Let's turn your ideas into a beautiful reality.
          </span>

        </div>

        <Link to="/contact">
          Contact Us →
        </Link>

      </section>

    </div>
  );
};

export default BookConsultation;