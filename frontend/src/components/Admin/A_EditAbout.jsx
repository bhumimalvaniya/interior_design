import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import "./A_EditAbout.css";

const API_URL = "http://localhost:9000/api/v1";

const A_EditAbout = () => {
  const { id } = useParams();
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
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // ==========================================
  // FETCH SINGLE ABOUT
  // ==========================================

  const fetchAbout = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/about/${id}`
      );

      if (response.data.success) {
        const item = response.data.data;

        setFormData({
          title: item.title || "",
          subtitle: item.subtitle || "",
          description: item.description || "",
          experience: item.experience || "",
          projects: item.projects || "",
          clients: item.clients || "",
          status: item.status || "active",
        });

        setPreview(item.image || "");
      }
    } catch (error) {
      console.error("Fetch About Error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to fetch About"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, [id]);

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
  // IMAGE
  // ==========================================

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // ==========================================
  // UPDATE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setUpdating(true);

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

      const response = await axios.put(
        `${API_URL}/about/update/${id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        alert("About updated successfully");

        navigate("/admin/about");
      }
    } catch (error) {
      console.error("Update About Error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update About"
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        Loading About...
      </div>
    );
  }

  return (
    <div className="about-admin-page">

      <div className="about-admin-header">

        <h1>Edit About Us</h1>

        <button
          type="button"
          onClick={() =>
            navigate("/admin/about")
          }
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
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="8"
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
            />
          </div>

          <div className="form-group">
            <label>Projects</label>

            <input
              type="text"
              name="projects"
              value={formData.projects}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Clients</label>

            <input
              type="text"
              name="clients"
              value={formData.clients}
              onChange={handleChange}
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
          <label>Change Image</label>

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
              alt="About"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={updating}
          className="submit-btn"
        >
          {updating
            ? "Updating..."
            : "Update About"}
        </button>

      </form>
    </div>
  );
};

export default A_EditAbout;