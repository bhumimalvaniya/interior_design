import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./A_AddAbout.css";

const API_URL = "http://localhost:9000/api/v1";

const A_AddAbout = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    experience: "",
    projects: "",
    clients: "",
    status: "active",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

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

    try {
      setLoading(true);

      const data = new FormData();

      data.append("title", formData.title);
      data.append("subtitle", formData.subtitle);
      data.append("description", formData.description);
      data.append("experience", formData.experience);
      data.append("projects", formData.projects);
      data.append("clients", formData.clients);
      data.append("status", formData.status);

      if (image) {
        data.append("image", image);
      }

      const response = await axios.post(
        `${API_URL}/about/add`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        alert("About added successfully");

        navigate("/admin/about");
      }
    } catch (error) {
      console.error("Add About Error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to add About"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="about-admin-page">

      <div className="about-admin-header">
        <h1>Add About Us</h1>

        <button
          type="button"
          onClick={() => navigate("/admin/about")}
        >
          Back
        </button>
      </div>

      <form
        className="about-admin-form"
        onSubmit={handleSubmit}
      >

        <div className="form-group">
          <label>Title</label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter About title"
            required
          />
        </div>

        <div className="form-group">
          <label>Subtitle</label>

          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            placeholder="Enter subtitle"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter About description"
            rows="7"
            required
          />
        </div>

        <div className="form-row">

          <div className="form-group">
            <label>Experience</label>

            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="10+"
            />
          </div>

          <div className="form-group">
            <label>Projects</label>

            <input
              type="text"
              name="projects"
              value={formData.projects}
              onChange={handleChange}
              placeholder="500+"
            />
          </div>

          <div className="form-group">
            <label>Clients</label>

            <input
              type="text"
              name="clients"
              value={formData.clients}
              onChange={handleChange}
              placeholder="300+"
            />
          </div>

        </div>

        <div className="form-group">
          <label>Status</label>

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

        <div className="form-group">
          <label>About Image</label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {preview && (
          <div className="image-preview">
            <img
              src={preview}
              alt="Preview"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="submit-btn"
        >
          {loading
            ? "Adding..."
            : "Add About"}
        </button>

      </form>
    </div>
  );
};

export default A_AddAbout;