import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./A_Addevent.css";
import API_URL from "../../config/api";

const A_Addevent = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    start_date: "",
    end_date: "",
    start_time: "",
    end_time: "",
    price: "",
    cate_nm: "",
    cate_id: "",
    location: "",
    description: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // =====================================================
  // FETCH CATEGORIES
  // =====================================================

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          // "http://localhost:9000/api/v1/category/featch"
          `${API_URL}/category/featch`
        );

        if (response.data.success) {
          setCategories(response.data.data || []);
        }
      } catch (error) {
        console.error("GET CATEGORY ERROR:", error);
        alert("Unable to load categories.");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // HANDLE CATEGORY
  // =====================================================

  const handleCategoryChange = (e) => {
    const selectedId = e.target.value;

    const selectedCategory = categories.find(
      (category) => category._id === selectedId
    );

    setFormData((prev) => ({
      ...prev,
      cate_id: selectedCategory?._id || "",
      cate_nm: selectedCategory?.name || "",
    }));
  };

  // =====================================================
  // HANDLE IMAGE
  // =====================================================

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setImage(null);
      setPreview("");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please select an event image.");
      return;
    }

    if (!formData.title.trim()) {
      alert("Please enter event title.");
      return;
    }

    if (!formData.start_date || !formData.end_date) {
      alert("Please select start and end date.");
      return;
    }

    if (!formData.start_time || !formData.end_time) {
      alert("Please select start and end time.");
      return;
    }

    if (!formData.price) {
      alert("Please enter price.");
      return;
    }

    if (!formData.cate_id) {
      alert("Please select category.");
      return;
    }

    if (!formData.location.trim()) {
      alert("Please enter location.");
      return;
    }

    if (!formData.description.trim()) {
      alert("Please enter description.");
      return;
    }

    const data = new FormData();

    data.append("image", image);
    data.append("title", formData.title);
    data.append("start_date", formData.start_date);
    data.append("end_date", formData.end_date);
    data.append("start_time", formData.start_time);
    data.append("end_time", formData.end_time);
    data.append("price", formData.price);
    data.append("cate_nm", formData.cate_nm);
    data.append("cate_id", formData.cate_id);
    data.append("location", formData.location);
    data.append("description", formData.description);

    console.log("========== FORM DATA ==========");

    for (const [key, value] of data.entries()) {
      console.log(key, value);
    }

    console.log("===============================");

    try {
      setSubmitting(true);

      const response = await axios.post(
        // "http://localhost:9000/api/v1/event/addevent",
        `${API_URL}/event/addevent`,
        data
      );

      console.log("ADD EVENT RESPONSE:", response.data);

      if (response.data.success) {
        alert("Event added successfully!");

        setFormData({
          title: "",
          start_date: "",
          end_date: "",
          start_time: "",
          end_time: "",
          price: "",
          cate_nm: "",
          cate_id: "",
          location: "",
          description: "",
        });

        setImage(null);
        setPreview("");

        /*
          IMPORTANT:
          Change this route to your actual event-list route
          after checking App.jsx.
        */
        navigate("/admin/dashboard");
      }
    } catch (error) {
      console.error("========== ADD EVENT ERROR ==========");
      console.error(error);

      if (error.response) {
        console.error("Backend status:", error.response.status);
        console.error("Backend data:", error.response.data);

        alert(
          error.response.data?.message ||
            "Failed to add event."
        );
      } else {
        alert("Backend server is not responding.");
      }

      console.error("====================================");
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // JSX
  // =====================================================

  return (
    <div className="add-event-page">

      {/* PAGE HEADER */}
      <div className="add-event-header">

        <div>
          <p className="page-small-title">
            ADMIN PANEL
          </p>

          <h1>Add Event</h1>

          <span className="page-description">
            Create a new event and add it to your event list.
          </span>
        </div>

        <Link
          to="/admin/dashboard"
          className="back-button"
        >
          ← Back to Events
        </Link>

      </div>

      {/* FORM */}
      <form
        className="event-form"
        onSubmit={handleSubmit}
      >

        {/* LEFT SIDE */}
        <div className="event-form-left">

          {/* BASIC INFORMATION */}
          <div className="form-card">

            <div className="form-card-header">

              <div>

                <div className="form-icon">
                  ✦
                </div>

                <div>
                  <h2>Event Information</h2>

                  <p>
                    Enter the basic information about your event.
                  </p>
                </div>

              </div>

            </div>

            {/* TITLE */}
            <div className="form-group">

              <label>
                Event Title <span>*</span>
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter event title"
              />

            </div>

            {/* DATE */}
            <div className="form-row">

              <div className="form-group">

                <label>
                  Start Date <span>*</span>
                </label>

                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                />

              </div>

              <div className="form-group">

                <label>
                  End Date <span>*</span>
                </label>

                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                />

              </div>

            </div>

            {/* TIME */}
            <div className="form-row">

              <div className="form-group">

                <label>
                  Start Time <span>*</span>
                </label>

                <input
                  type="time"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleChange}
                />

              </div>

              <div className="form-group">

                <label>
                  End Time <span>*</span>
                </label>

                <input
                  type="time"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleChange}
                />

              </div>

            </div>

            {/* PRICE + CATEGORY */}
            <div className="form-row">

              <div className="form-group">

                <label>
                  Price <span>*</span>
                </label>

                <div className="input-with-icon">

                  <span>₹</span>

                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Enter price"
                    min="0"
                  />

                </div>

              </div>

              <div className="form-group">

                <label>
                  Category <span>*</span>
                </label>

                <select
                  name="cate_id"
                  value={formData.cate_id}
                  onChange={handleCategoryChange}
                  disabled={loadingCategories}
                >

                  <option value="">
                    {loadingCategories
                      ? "Loading categories..."
                      : "Select Category"}
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category._id}
                      value={category._id}
                    >
                      {category.name}
                    </option>
                  ))}

                </select>

              </div>

            </div>

            {/* LOCATION */}
            <div className="form-group">

              <label>
                Location <span>*</span>
              </label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter event location"
              />

            </div>

            {/* DESCRIPTION */}
            <div className="form-group">

              <label>
                Description <span>*</span>
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter event description"
                rows="6"
              />

            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="event-form-right">

          {/* IMAGE CARD */}
          <div className="form-card">

            <div className="form-card-header">

              <div>

                <div className="form-icon">
                  📷
                </div>

                <div>
                  <h2>Event Image</h2>

                  <p>
                    Upload an image for your event.
                  </p>
                </div>

              </div>

            </div>

            {!preview ? (

              <label className="image-upload">

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />

                <div className="upload-content">

                  <div className="upload-icon">
                    ↑
                  </div>

                  <h3>
                    Upload Event Image
                  </h3>

                  <p>
                    Click here to choose an image
                  </p>

                  <small>
                    JPG, JPEG, PNG • Recommended 1200 × 800
                  </small>

                </div>

              </label>

            ) : (

              <div className="preview-container">

                <img
                  src={preview}
                  alt="Event Preview"
                  className="event-preview"
                />

              </div>

            )}

            <span className="form-helper-text">
              Select a clear, high-quality image for your event.
            </span>

          </div>

          {/* INFORMATION CARD */}
          <div className="form-card">

            <div className="side-info">

              <div className="info-icon">
                i
              </div>

              <div>

                <h3>
                  Event Status
                </h3>

                <span className="status-badge">
                  Active
                </span>

              </div>

            </div>

          </div>

          {/* TIPS CARD */}
          <div className="form-card">

            <div className="side-info">

              <div className="info-icon">
                ✓
              </div>

              <div>

                <h3>
                  Helpful Tips
                </h3>

                <ul>

                  <li>
                    Use a clear event title.
                  </li>

                  <li>
                    Check the date and time carefully.
                  </li>

                  <li>
                    Upload a high-quality image.
                  </li>

                  <li>
                    Make sure the category is correct.
                  </li>

                </ul>

              </div>

            </div>

          </div>

        </div>

        {/* ACTIONS */}
        <div className="form-actions">

          <Link
            to="/admin/events"
            className="cancel-button"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="submit-event-button"
            disabled={submitting}
          >
            {submitting
              ? "Adding Event..."
              : "Add Event"}
          </button>

        </div>

      </form>

    </div>
  );
};

export default A_Addevent;