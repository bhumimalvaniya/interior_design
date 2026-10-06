
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddGallery.css";
import API_URL from "../../config/api";

const AddGallery = () => {
  const navigate = useNavigate();

  // =========================================
  // FORM DATA
  // =========================================

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    type: "",
  });

  // Selected image
  const [image, setImage] = useState(null);

  // Image preview
  const [preview, setPreview] = useState("");

  // Loading state
  const [loading, setLoading] = useState(false);


  // =========================================
  // API URL
  // =========================================

  // const API_URL ="http://localhost:9000/api/v1/gallary";


  // =========================================
  // HANDLE TEXT / SELECT CHANGE
  // =========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  // =========================================
  // HANDLE IMAGE CHANGE
  // =========================================

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      return;
    }


    // =========================================
    // CHECK FILE TYPE
    // =========================================

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      alert(
        "Only JPG, JPEG, PNG and WEBP images are allowed."
      );

      e.target.value = "";
      return;
    }


    // =========================================
    // CHECK FILE SIZE
    // =========================================

    if (selectedFile.size > 5 * 1024 * 1024) {
      alert(
        "Image size must be less than 5 MB."
      );

      e.target.value = "";
      return;
    }


    // Save image
    setImage(selectedFile);


    // =========================================
    // CREATE PREVIEW
    // =========================================

    const imageUrl =
      URL.createObjectURL(selectedFile);

    setPreview(imageUrl);
  };


  // =========================================
  // SUBMIT FORM
  // =========================================

  const handleSubmit = async (e) => {
    e.preventDefault();


    // =========================================
    // VALIDATION
    // =========================================

    if (!formData.title.trim()) {
      alert("Please enter gallery title.");
      return;
    }

    if (!formData.category) {
      alert("Please select category.");
      return;
    }

    if (!formData.type) {
      alert("Please select type.");
      return;
    }

    if (!image) {
      alert("Please select a gallery image.");
      return;
    }


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

    // IMPORTANT:
    // This name must match:
    // upload.single("image")
    data.append(
      "image",
      image
    );


    try {

      setLoading(true);


      // =========================================
      // SEND TO NODE.JS
      // =========================================

      const response = await axios.post(
        `${API_URL}/gallary/add`,
        data,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );


      console.log(
        "Add Gallery Response:",
        response.data
      );


      // =========================================
      // SUCCESS
      // =========================================

      if (response.data.success) {

        alert(
          "Gallery added successfully!"
        );

        navigate("/admin/gallery");

      } else {

        alert(
          response.data.message ||
            "Failed to add gallery."
        );
      }

    } catch (error) {

      console.error(
        "Add Gallery Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to add gallery image."
      );

    } finally {

      setLoading(false);

    }
  };


  // =========================================
  // RETURN
  // =========================================

  return (
    <div className="add-gallery-page">


      {/* =====================================
          PAGE HEADER
      ===================================== */}

      <div className="add-gallery-header">

        <div>

          <p className="add-gallery-small-title">
            GALLERY MANAGEMENT
          </p>

          <h1>
            Add Gallery
          </h1>

          <span>
            Add a new interior design image
            to your gallery.
          </span>

        </div>


        {/* BACK BUTTON */}

        <button
          type="button"
          className="back-gallery-btn"
          onClick={() =>
            navigate("/admin/gallery")
          }
        >
          ← Back to Gallery
        </button>

      </div>


      {/* =====================================
          FORM CARD
      ===================================== */}

      <div className="add-gallery-card">

        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >


          {/* =================================
              TITLE
          ================================= */}

          <div className="form-group">

            <label>
              Gallery Title
            </label>

            <input
              type="text"
              name="title"
              placeholder="Enter gallery title"
              value={formData.title}
              onChange={handleChange}
              required
            />

          </div>


          {/* =================================
              CATEGORY
          ================================= */}

          <div className="form-group">

            <label>
              Category
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
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

          <div className="form-group">

            <label>
              Type
            </label>

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
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

          <div className="form-group">

            <label>
              Gallery Image
            </label>

            <input
              type="file"
              name="image"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleImageChange}
              required
            />

            <small>
              JPG, JPEG, PNG or WEBP.
              Maximum size: 5 MB.
            </small>

          </div>


          {/* =================================
              IMAGE PREVIEW
          ================================= */}

          {preview && (

            <div className="gallery-preview">

              <p>
                Image Preview
              </p>

              <img
                src={preview}
                alt="Gallery Preview"
              />

            </div>

          )}


          {/* =================================
              BUTTONS
          ================================= */}

          <div className="add-gallery-actions">


            {/* CANCEL */}

            <button
              type="button"
              className="cancel-gallery-btn"
              onClick={() =>
                navigate("/admin/gallery")
              }
              disabled={loading}
            >
              Cancel
            </button>


            {/* SAVE */}

            <button
              type="submit"
              className="save-gallery-btn"
              disabled={loading}
            >

              {loading
                ? "Uploading..."
                : "+ Add Gallery"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default AddGallery;

