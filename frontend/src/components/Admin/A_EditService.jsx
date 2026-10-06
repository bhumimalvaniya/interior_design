
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./A_EditService.css";
import API_URL from "../../config/api";

// const API_URL = "http://localhost:9000";

const A_EditServices = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // ==========================================
  // FORM DATA
  // ==========================================

  const [formData, setFormData] = useState({
    section: "",
    number: "",
    title: "",
    subtitle: "",
    description: "",
    link: "",
    status: "active",
  });

  // ==========================================
  // IMAGE
  // ==========================================

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  // ==========================================
  // STATES
  // ==========================================

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH SINGLE SERVICE
  // ==========================================

  const fetchService = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("Fetching service ID:", id);

      const response = await axios.get(
        `${API_URL}/api/v1/services/single/${id}`
      );

      console.log(
        "Single Service Response:",
        response.data
      );

      if (response.data.success) {
        const service = response.data.data;

        setFormData({
          section: service.section || "",
          number: service.number || "",
          title: service.title || "",
          subtitle: service.subtitle || "",
          description: service.description || "",
          link: service.link || "",
          status: service.status || "active",
        });

        // Existing Cloudinary image
        if (service.image) {
          setPreview(service.image);
        }
      } else {
        setError(
          response.data.message ||
            "Unable to fetch service"
        );
      }
    } catch (error) {
      console.error(
        "Fetch Single Service Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to fetch service"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FETCH WHEN PAGE LOADS
  // ==========================================

  useEffect(() => {
    if (id) {
      fetchService();
    }
  }, [id]);

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // ==========================================
  // HANDLE IMAGE CHANGE
  // ==========================================

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    setImage(file);

    // Show new image preview
    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
  };

  // ==========================================
  // SUBMIT UPDATE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ========================================
    // VALIDATION
    // ========================================

    if (!formData.section.trim()) {
      alert("Please select section");
      return;
    }

    if (!formData.title.trim()) {
      alert("Please enter service title");
      return;
    }

    if (!formData.description.trim()) {
      alert("Please enter description");
      return;
    }

    try {
      setSaving(true);

      // ======================================
      // CREATE FORMDATA
      // ======================================

      const data = new FormData();

      data.append(
        "section",
        formData.section
      );

      data.append(
        "number",
        formData.number
      );

      data.append(
        "title",
        formData.title
      );

      data.append(
        "subtitle",
        formData.subtitle
      );

      data.append(
        "description",
        formData.description
      );

      data.append(
        "link",
        formData.link
      );

      data.append(
        "status",
        formData.status
      );

      // Only send image if user selected
      // a new image
      if (image) {
        data.append("image", image);
      }

      console.log(
        "Updating service..."
      );

      // ======================================
      // UPDATE API
      // ======================================

      const response = await axios.put(
        `${API_URL}/api/v1/services/update/${id}`,
        data
      );

      console.log(
        "Update Service Response:",
        response.data
      );

      // ======================================
      // SUCCESS
      // ======================================

      if (response.data.success) {
        alert(
          "Service updated successfully"
        );

        navigate("/admin/services");
      } else {
        alert(
          response.data.message ||
            "Unable to update service"
        );
      }
    } catch (error) {
      console.error(
        "Update Service Error:",
        error
      );

      console.error(
        "Server Response:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
          "Something went wrong while updating service"
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // CANCEL
  // ==========================================

  const handleCancel = () => {
    navigate("/admin/services");
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="edit-services-page">
        <div className="edit-services-loading">
          Loading service...
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="edit-services-page">
        <div className="edit-services-error">
          <h3>Unable to load service</h3>

          <p>{error}</p>

          <button
            type="button"
            onClick={handleCancel}
          >
            ← Back to Services
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <div className="edit-services-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="edit-services-header">

        <div>
          <h1>Edit Service</h1>

          <p>
            Update your interior design service
          </p>
        </div>

        <button
          type="button"
          className="back-service-btn"
          onClick={handleCancel}
          disabled={saving}
        >
          ← Back
        </button>

      </div>


      {/* ======================================
          FORM CARD
      ====================================== */}

      <div className="edit-service-card">

        <form onSubmit={handleSubmit}>

          {/* ====================================
              SECTION
          ==================================== */}

          <div className="service-form-group">

            <label>
              Section <span>*</span>
            </label>

            <select
              name="section"
              value={formData.section}
              onChange={handleChange}
            >
              <option value="">
                Select Section
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

              <option value="Bathroom">
                Bathroom
              </option>

              <option value="Office">
                Office
              </option>

              <option value="Dining Room">
                Dining Room
              </option>

              <option value="Kids Room">
                Kids Room
              </option>

              <option value="Balcony">
                Balcony
              </option>

              <option value="Other">
                Other
              </option>

            </select>

          </div>


          {/* ====================================
              NUMBER
          ==================================== */}

          <div className="service-form-group">

            <label>
              Number
            </label>

            <input
              type="text"
              name="number"
              value={formData.number}
              onChange={handleChange}
              placeholder="Example: 01"
            />

          </div>


          {/* ====================================
              TITLE
          ==================================== */}

          <div className="service-form-group">

            <label>
              Service Title <span>*</span>
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter service title"
            />

          </div>


          {/* ====================================
              SUBTITLE
          ==================================== */}

          <div className="service-form-group">

            <label>
              Subtitle
            </label>

            <input
              type="text"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              placeholder="Enter subtitle"
            />

          </div>


          {/* ====================================
              DESCRIPTION
          ==================================== */}

          <div className="service-form-group">

            <label>
              Description <span>*</span>
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter service description"
              rows="6"
            />

          </div>


          {/* ====================================
              LINK
          ==================================== */}

          <div className="service-form-group">

            <label>
              Link
            </label>

            <input
              type="text"
              name="link"
              value={formData.link}
              onChange={handleChange}
              placeholder="/services/living-room"
            />

          </div>


          {/* ====================================
              STATUS
          ==================================== */}

          <div className="service-form-group">

            <label>
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >

              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>

            </select>

          </div>


          {/* ====================================
              IMAGE
          ==================================== */}

          <div className="service-form-group">

            <label>
              Service Image
            </label>

            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleImageChange}
            />

            <small>
              Leave empty if you want to keep
              the existing image.
            </small>

          </div>


          {/* ====================================
              IMAGE PREVIEW
          ==================================== */}

          {preview && (
            <div className="service-image-preview">

              <p>
                Image Preview
              </p>

              <img
                src={preview}
                alt="Service Preview"
                onError={(e) => {
                  e.target.src =
                    "/no-image.jpg";
                }}
              />

            </div>
          )}


          {/* ====================================
              BUTTONS
          ==================================== */}

          <div className="service-form-actions">

            <button
              type="button"
              className="cancel-service-btn"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-service-btn"
              disabled={saving}
            >
              {saving
                ? "Updating..."
                : "Update Service"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default A_EditServices;

