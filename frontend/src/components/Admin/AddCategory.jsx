import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddCategory.css";

const AddCategory = () => {
  const navigate = useNavigate();

  // =========================================
  // API URL
  // =========================================

  const API_URL =
    "http://localhost:9000/api/v1/category";

  // =========================================
  // FORM DATA
  // =========================================

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "Active",
    image: "",
  });

  const [loading, setLoading] = useState(false);

  // =========================================
  // HANDLE INPUT CHANGE
  // =========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================
  // HANDLE SUBMIT
  // =========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      console.log("Sending category data:", formData);

      const response = await axios.post(
        `${API_URL}/add`,
        formData
      );

      console.log(
        "Category API Response:",
        response.data
      );

      if (response.data.success) {
        alert("Category added successfully!");

        // Go back to category list
        navigate("/admin/categories");
      }
    } catch (error) {
      console.error(
        "ADD CATEGORY ERROR:",
        error
      );

      if (error.response) {
        alert(
          error.response.data.message ||
            "Failed to add category"
        );
      } else {
        alert(
          "Unable to connect to server. Please check backend."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // RETURN
  // =========================================

  return (
    <div className="add-category-page">

      {/* =========================================
          PAGE HEADER
      ========================================= */}

      <div className="add-category-header">

        <div>
          <p className="add-category-small-title">
            CATEGORY MANAGEMENT
          </p>

          <h1>Add Category</h1>

          <span>
            Create a new interior design category
            and manage your project collection.
          </span>
        </div>

        <button
          type="button"
          className="back-category-btn"
          onClick={() =>
            navigate("/admin/categories")
          }
        >
          ← Back to Categories
        </button>

      </div>


      {/* =========================================
          FORM CARD
      ========================================= */}

      <div className="add-category-card">

        <form onSubmit={handleSubmit}>

          {/* CATEGORY NAME */}

          <div className="category-form-group">

            <label>
              Category Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter category name"
              value={formData.name}
              onChange={handleChange}
              required
            />

          </div>


          {/* DESCRIPTION */}

          <div className="category-form-group">

            <label>
              Description
            </label>

            <textarea
              name="description"
              placeholder="Enter category description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              required
            />

          </div>


          {/* STATUS */}

          <div className="category-form-group">

            <label>
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >

              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>

            </select>

          </div>


          {/* IMAGE URL */}

          <div className="category-form-group">

            <label>
              Category Image URL
            </label>

            <input
              type="url"
              name="image"
              placeholder="Enter category image URL"
              value={formData.image}
              onChange={handleChange}
              required
            />

          </div>


          {/* IMAGE PREVIEW */}

          {formData.image && (
            <div className="category-image-preview">

              <div className="category-preview-heading">

                <span>
                  IMAGE PREVIEW
                </span>

                <h3>
                  {formData.name ||
                    "Category Image"}
                </h3>

              </div>

              <img
                src={formData.image}
                alt="Category Preview"
                onError={(e) => {
                  e.target.style.display =
                    "none";
                }}
              />

            </div>
          )}


          {/* ACTIONS */}

          <div className="add-category-actions">

            <button
              type="button"
              className="cancel-category-btn"
              onClick={() =>
                navigate("/admin/categories")
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-category-btn"
              disabled={loading}
            >
              {loading
                ? "Adding..."
                : "✓ Add Category"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default AddCategory;