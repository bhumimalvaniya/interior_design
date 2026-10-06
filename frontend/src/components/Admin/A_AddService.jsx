import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./A_AddServices.css";
import API_URL from "../../config/api";

const A_AddServices = () => {
  const navigate = useNavigate();

  // const API_URL = "http://localhost:9000/api/v1";

  const [formData, setFormData] = useState({
    section: "",
    title: "",
    subtitle: "",
    description: "",
    status: "active",
  });

  const [categories, setCategories] = useState([]);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(true);

  // ==========================================
  // FETCH CATEGORIES
  // ==========================================

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setCategoryLoading(true);

      const response = await axios.get(
        `${API_URL}/category/featch`
      );

      console.log(
        "CATEGORY API RESPONSE:",
        response.data
      );

      if (response.data.success) {
        setCategories(response.data.data || []);
      } else {
        setCategories([]);
      }

    } catch (error) {
      console.error(
        "FETCH CATEGORY ERROR:",
        error.response?.data || error.message
      );

      setCategories([]);

    } finally {
      setCategoryLoading(false);
    }
  };

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // IMAGE CHANGE
  // ==========================================

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    if (!image) {
      alert("Please select service image");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append(
        "section",
        formData.section
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
        "status",
        formData.status
      );

      data.append(
        "image",
        image
      );

      const response = await axios.post(
        `${API_URL}/services/add`,
        data
      );

      console.log(
        "ADD SERVICE RESPONSE:",
        response.data
      );

      if (response.data.success) {
        alert("Service added successfully");

        navigate("/admin/services");
      } else {
        alert(
          response.data.message ||
            "Unable to add service"
        );
      }

    } catch (error) {
      console.error(
        "ADD SERVICE ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Something went wrong while adding service"
      );

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CANCEL
  // ==========================================

  const handleCancel = () => {
    navigate("/admin/services");
  };

  // ==========================================
  // RETURN
  // ==========================================

  return (
    <div className="add-services-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="add-services-header">

        <div>
          <h1>Add Service</h1>

          <p>
            Create a new interior design service
          </p>
        </div>

        <button
          type="button"
          className="back-service-btn"
          onClick={handleCancel}
        >
          ← Back
        </button>

      </div>


      {/* ======================================
          FORM
      ====================================== */}

      <div className="add-service-card">

        <form onSubmit={handleSubmit}>

          {/* ==================================
              SECTION / CATEGORY
          ================================== */}

          <div className="service-form-group">

            <label>
              Section <span>*</span>
            </label>

            <select
              name="section"
              value={formData.section}
              onChange={handleChange}
              required
            >

              <option value="">
                {categoryLoading
                  ? "Loading categories..."
                  : "Select Section"}
              </option>

              {categories.map((category) => (
                <option
                  key={category._id}
                  value={category.name}
                >
                  {category.name}
                </option>
              ))}

            </select>

          </div>


          {/* ==================================
              TITLE
          ================================== */}

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
              required
            />

          </div>


          {/* ==================================
              SUBTITLE
          ================================== */}

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


          {/* ==================================
              DESCRIPTION
          ================================== */}

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
              required
            />

          </div>


          {/* ==================================
              STATUS
          ================================== */}

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


          {/* ==================================
              IMAGE
          ================================== */}

          <div className="service-form-group">

            <label>
              Service Image <span>*</span>
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
            />

            <small>
              Recommended image format:
              JPG, JPEG or PNG
            </small>

          </div>


          {/* ==================================
              IMAGE PREVIEW
          ================================== */}

          {preview && (
            <div className="service-image-preview">

              <p>Image Preview</p>

              <img
                src={preview}
                alt="Service Preview"
              />

            </div>
          )}


          {/* ==================================
              BUTTONS
          ================================== */}

          <div className="service-form-actions">

            <button
              type="button"
              className="cancel-service-btn"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-service-btn"
              disabled={
                loading ||
                categoryLoading
              }
            >
              {loading
                ? "Saving..."
                : "Add Service"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default A_AddServices;