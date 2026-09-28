import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./EditCategory.css";

const EditCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams();

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

  // =========================================
  // STATES
  // =========================================

  const [loading, setLoading] = useState(true);

  const [updating, setUpdating] = useState(false);

  const [category, setCategory] = useState(null);

  const [error, setError] = useState("");


  // =========================================
  // FETCH SINGLE CATEGORY
  // =========================================

  const fetchCategory = async () => {
    try {
      setLoading(true);
      setError("");

      console.log(
        "Fetching category ID:",
        id
      );

      const response = await axios.get(
        `${API_URL}/single/${id}`
      );

      console.log(
        "SINGLE CATEGORY RESPONSE:",
        response.data
      );

      if (response.data.success) {
        const categoryData =
          response.data.data;

        setCategory(categoryData);

        setFormData({
          name: categoryData.name || "",
          description:
            categoryData.description || "",
          status:
            categoryData.status || "Active",
          image: categoryData.image || "",
        });
      } else {
        setError(
          "Category not found"
        );
      }
    } catch (error) {
      console.error(
        "FETCH SINGLE CATEGORY ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to fetch category"
      );
    } finally {
      setLoading(false);
    }
  };


  // =========================================
  // FETCH WHEN PAGE LOADS
  // =========================================

  useEffect(() => {
    if (id) {
      fetchCategory();
    }
  }, [id]);


  // =========================================
  // HANDLE INPUT
  // =========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  // =========================================
  // UPDATE CATEGORY
  // =========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setUpdating(true);

      console.log(
        "Updating category:",
        formData
      );

      const response = await axios.put(
        `${API_URL}/update/${id}`,
        formData
      );

      console.log(
        "UPDATE CATEGORY RESPONSE:",
        response.data
      );

      if (response.data.success) {
        alert(
          "Category updated successfully!"
        );

        navigate("/admin/categories");
      }
    } catch (error) {
      console.error(
        "UPDATE CATEGORY ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update category"
      );
    } finally {
      setUpdating(false);
    }
  };


  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="edit-category-not-found">

        <div className="not-found-icon">
          ⏳
        </div>

        <h2>
          Loading Category...
        </h2>

        <p>
          Please wait while category
          information is loading.
        </p>

      </div>
    );
  }


  // =========================================
  // CATEGORY NOT FOUND
  // =========================================

  if (!category || error) {
    return (
      <div className="edit-category-not-found">

        <div className="not-found-icon">
          ⚠
        </div>

        <h2>
          Category Not Found
        </h2>

        <p>
          {error ||
            "The category you are trying to edit does not exist."}
        </p>

        <button
          onClick={() =>
            navigate("/admin/categories")
          }
        >
          ← Back to Categories
        </button>

      </div>
    );
  }


  // =========================================
  // RETURN
  // =========================================

  return (
    <div className="edit-category-page">


      {/* =====================================
          PAGE HEADER
      ===================================== */}

      <div className="edit-category-header">

        <div>

          <p className="edit-category-small-title">
            CATEGORY MANAGEMENT
          </p>

          <h1>
            Edit Category
          </h1>

          <span>
            Update category information,
            description and image.
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



      {/* =====================================
          FORM CARD
      ===================================== */}

      <div className="edit-category-card">

        <form onSubmit={handleSubmit}>


          {/* =================================
              CATEGORY NAME
          ================================= */}

          <div className="edit-category-form-group">

            <label>
              Category Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter category name"
              required
            />

          </div>



          {/* =================================
              DESCRIPTION
          ================================= */}

          <div className="edit-category-form-group">

            <label>
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter category description"
              rows="5"
              required
            />

          </div>



          {/* =================================
              STATUS
          ================================= */}

          <div className="edit-category-form-group">

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



          {/* =================================
              IMAGE URL
          ================================= */}

          <div className="edit-category-form-group">

            <label>
              Category Image URL
            </label>

            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Enter category image URL"
              required
            />

          </div>



          {/* =================================
              IMAGE PREVIEW
          ================================= */}

          {formData.image && (

            <div className="edit-category-preview">

              <div className="edit-category-preview-heading">

                <div>

                  <span>
                    IMAGE PREVIEW
                  </span>

                  <h3>
                    {formData.name ||
                      "Category Image"}
                  </h3>

                </div>


                <span className="preview-status">

                  {formData.status}

                </span>

              </div>


              <img
                src={formData.image}
                alt={formData.name}
                onError={(e) => {
                  e.target.style.display =
                    "none";
                }}
              />

            </div>

          )}



          {/* =================================
              CURRENT CATEGORY INFORMATION
          ================================= */}

          <div className="category-info-box">


            {/* CATEGORY ID */}

            <div className="category-info-item">

              <span>
                Category ID
              </span>

              <strong>
                #{category._id}
              </strong>

            </div>


            {/* TOTAL PROJECTS */}

            <div className="category-info-item">

              <span>
                Total Projects
              </span>

              <strong>
                {category.totalProjects || 0}
              </strong>

            </div>

          </div>



          {/* =================================
              ACTION BUTTONS
          ================================= */}

          <div className="edit-category-actions">


            {/* CANCEL */}

            <button
              type="button"
              className="cancel-category-btn"
              onClick={() =>
                navigate("/admin/categories")
              }
            >
              Cancel
            </button>


            {/* UPDATE */}

            <button
              type="submit"
              className="update-category-btn"
              disabled={updating}
            >

              {updating
                ? "Updating..."
                : "✓ Update Category"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default EditCategory;