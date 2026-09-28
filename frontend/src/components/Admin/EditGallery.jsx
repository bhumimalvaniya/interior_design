import React, { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import axios from "axios";
import "./EditGallery.css";

const EditGallery = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // =========================================
  // API URL
  // =========================================

  const API_URL =
    "http://localhost:9000/api/v1/gallary";

  // =========================================
  // FORM DATA
  // =========================================

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    type: "",
  });

  // =========================================
  // IMAGE
  // =========================================

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  // =========================================
  // STATES
  // =========================================

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // =========================================
  // FETCH SINGLE GALLERY
  // =========================================

  const fetchGallery = async () => {
    try {
      setLoading(true);

      console.log(
        "Fetching Gallery ID:",
        id
      );

      const response = await axios.get(
        `${API_URL}/single/${id}`
      );

      console.log(
        "Single Gallery Response:",
        response.data
      );

      if (
        response.data.success &&
        response.data.data
      ) {
        const gallery =
          response.data.data;

        setFormData({
          title: gallery.title || "",
          category:
            gallery.category || "",
          type: gallery.type || "",
        });

        setPreview(
          gallery.image || ""
        );

      } else {
        alert(
          response.data.message ||
            "Gallery image not found."
        );

        navigate("/admin/gallery");
      }

    } catch (error) {
      console.error(
        "Fetch Gallery Error:",
        error
      );

      console.error(
        "Backend Response:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
          "Failed to fetch gallery data."
      );

      navigate("/admin/gallery");

    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // FETCH WHEN PAGE LOADS
  // =========================================

  useEffect(() => {
    if (id) {
      fetchGallery();
    }
  }, [id]);

  // =========================================
  // HANDLE INPUT CHANGE
  // =========================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================
  // HANDLE IMAGE CHANGE
  // =========================================

  const handleImageChange = (e) => {
    const selectedFile =
      e.target.files[0];

    if (!selectedFile) {
      return;
    }

    // =========================================
    // FILE TYPE
    // =========================================

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(
        selectedFile.type
      )
    ) {
      alert(
        "Only JPG, JPEG, PNG and WEBP images are allowed."
      );

      e.target.value = "";
      return;
    }

    // =========================================
    // FILE SIZE
    // =========================================

    if (
      selectedFile.size >
      5 * 1024 * 1024
    ) {
      alert(
        "Image size must be less than 5 MB."
      );

      e.target.value = "";
      return;
    }

    // =========================================
    // SAVE NEW IMAGE
    // =========================================

    setImage(selectedFile);

    // =========================================
    // NEW IMAGE PREVIEW
    // =========================================

    const imageUrl =
      URL.createObjectURL(
        selectedFile
      );

    setPreview(imageUrl);
  };

  // =========================================
  // UPDATE GALLERY
  // =========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // =========================================
    // VALIDATION
    // =========================================

    if (!formData.title.trim()) {
      alert(
        "Please enter gallery title."
      );
      return;
    }

    if (!formData.category) {
      alert(
        "Please select category."
      );
      return;
    }

    if (!formData.type) {
      alert(
        "Please select type."
      );
      return;
    }

    try {
      setSaving(true);

      // =========================================
      // CREATE FORMDATA
      // =========================================

      const data = new FormData();

      data.append(
        "title",
        formData.title
      );

      data.append(
        "category",
        formData.category
      );

      data.append(
        "type",
        formData.type
      );

      // Only send image if user selected
      // a new image

      if (image) {
        data.append(
          "image",
          image
        );
      }

      console.log(
        "Updating Gallery:",
        id
      );

      // =========================================
      // PUT API
      // =========================================

      const response =
        await axios.put(
          `${API_URL}/update/${id}`,
          data
        );

      console.log(
        "Update Response:",
        response.data
      );

      // =========================================
      // SUCCESS
      // =========================================

      if (response.data.success) {
        alert(
          "Gallery updated successfully!"
        );

        navigate(
          "/admin/gallery"
        );

      } else {
        alert(
          response.data.message ||
            "Failed to update gallery."
        );
      }

    } catch (error) {
      console.error(
        "Update Gallery Error:",
        error
      );

      console.error(
        "Backend Error:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
          "Failed to update gallery."
      );

    } finally {
      setSaving(false);
    }
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="edit-gallery-not-found">
        <div className="not-found-icon">
          ⏳
        </div>

        <h2>
          Loading Gallery...
        </h2>

        <p>
          Please wait while gallery
          data is loading.
        </p>
      </div>
    );
  }

  // =========================================
  // PAGE
  // =========================================

  return (
    <div className="edit-gallery-page">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="edit-gallery-header">

        <div>

          <p className="edit-gallery-small-title">
            GALLERY MANAGEMENT
          </p>

          <h1>
            Edit Gallery
          </h1>

          <span>
            Update your interior
            design gallery details.
          </span>

        </div>

        <button
          type="button"
          className="edit-back-btn"
          onClick={() =>
            navigate(
              "/admin/gallery"
            )
          }
        >
          ← Back to Gallery
        </button>

      </div>


      {/* =====================================
          EDIT CARD
      ===================================== */}

      <div className="edit-gallery-card">

        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >

          {/* =================================
              GALLERY ID
          ================================= */}

          <div className="gallery-id-box">

            <span>
              Gallery ID
            </span>

            <strong>
              #{id}
            </strong>

          </div>


          {/* =================================
              TITLE
          ================================= */}

          <div className="edit-form-group">

            <label>
              Gallery Title
            </label>

            <input
              type="text"
              name="title"
              value={
                formData.title
              }
              onChange={
                handleChange
              }
              placeholder="Enter gallery title"
              required
            />

          </div>


          {/* =================================
              CATEGORY
          ================================= */}

          <div className="edit-form-group">

            <label>
              Category
            </label>

            <select
              name="category"
              value={
                formData.category
              }
              onChange={
                handleChange
              }
              required
            >

              <option value="">
                Select Category
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

              <option value="Office">
                Office
              </option>

            </select>

          </div>


          {/* =================================
              TYPE
          ================================= */}

          <div className="edit-form-group">

            <label>
              Type
            </label>

            <select
              name="type"
              value={
                formData.type
              }
              onChange={
                handleChange
              }
              required
            >

              <option value="">
                Select Type
              </option>

              <option value="Residential">
                Residential
              </option>

              <option value="Commercial">
                Commercial
              </option>

            </select>

          </div>


          {/* =================================
              IMAGE
          ================================= */}

          <div className="edit-form-group">

            <label>
              Gallery Image
            </label>

            <input
              type="file"
              name="image"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={
                handleImageChange
              }
            />

            <small>
              Leave empty to keep the
              existing image.
            </small>

          </div>


          {/* =================================
              IMAGE PREVIEW
          ================================= */}

          {preview && (

            <div className="edit-gallery-preview">

              <div className="preview-header">

                <div>

                  <span>
                    IMAGE PREVIEW
                  </span>

                  <h3>
                    {formData.title ||
                      "Gallery Image"}
                  </h3>

                </div>

                <span className="preview-type">
                  {formData.type}
                </span>

              </div>


              <div className="preview-image-wrapper">

                <img
                  src={preview}
                  alt={
                    formData.title ||
                    "Gallery"
                  }
                  onError={(e) => {
                    e.target.style.display =
                      "none";
                  }}
                />

              </div>

            </div>

          )}


          {/* =================================
              BUTTONS
          ================================= */}

          <div className="edit-gallery-actions">

            <button
              type="button"
              className="edit-cancel-btn"
              onClick={() =>
                navigate(
                  "/admin/gallery"
                )
              }
              disabled={saving}
            >
              Cancel
            </button>


            <button
              type="submit"
              className="edit-save-btn"
              disabled={saving}
            >
              {saving
                ? "Updating..."
                : "✓ Save Changes"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default EditGallery;