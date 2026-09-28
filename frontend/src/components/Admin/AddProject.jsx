
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddProject.css";

const AddProject = () => {
  const navigate = useNavigate();

  const [project, setProject] = useState({
    title: "",
    category: "Residential",
    style: "Modern Design",
    location: "",
    status: "Ongoing",
    description: "",
  });

  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);


  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProject({
      ...project,
      [name]: value,
    });
  };


  // ==========================================
  // HANDLE IMAGE
  // ==========================================

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];

    if (selectedImage) {
      setImage(selectedImage);
    }
  };


  // ==========================================
  // ADD PROJECT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      setLoading(true);

      // Create FormData
      const formData = new FormData();

      formData.append("title", project.title);
      formData.append("category", project.category);
      formData.append("style", project.style);
      formData.append("location", project.location);
      formData.append("status", project.status);
      formData.append("description", project.description);

      // Add image
      if (image) {
        formData.append("image", image);
      }


      console.log("Sending project to backend...");


      // ==========================================
      // CALL NODE.JS API
      // ==========================================

      const response = await axios.post(
        "http://localhost:9000/api/v1/project/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );


      console.log(
        "ADD PROJECT RESPONSE:",
        response.data
      );


      // ==========================================
      // SUCCESS
      // ==========================================

      if (response.data.success) {

        alert("Project added successfully!");

        navigate("/admin/projects");

      } else {

        alert(
          response.data.message ||
          "Failed to add project"
        );

      }

    } catch (error) {

      console.log(
        "ADD PROJECT ERROR:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
        "Failed to add project"
      );

    } finally {

      setLoading(false);

    }
  };


  return (
    <div className="add-project-page">


      {/* =====================================
          HEADER
      ===================================== */}

      <div className="add-project-header">

        <div>

          <p>
            PROJECT MANAGEMENT
          </p>

          <h1>
            Add Project
          </h1>

          <span>
            Add a new interior design project.
          </span>

        </div>

      </div>


      {/* =====================================
          FORM
      ===================================== */}

      <form
        className="add-project-form"
        onSubmit={handleSubmit}
      >


        {/* PROJECT TITLE */}

        <div className="form-group">

          <label>
            Project Title
          </label>

          <input
            type="text"
            name="title"
            placeholder="Enter project title"
            value={project.title}
            onChange={handleChange}
            required
          />

        </div>


        {/* CATEGORY + STYLE */}

        <div className="form-row">


          <div className="form-group">

            <label>
              Category
            </label>

            <select
              name="category"
              value={project.category}
              onChange={handleChange}
            >

              <option value="Residential">
                Residential
              </option>

              <option value="Commercial">
                Commercial
              </option>

            </select>

          </div>


          <div className="form-group">

            <label>
              Design Style
            </label>

            <select
              name="style"
              value={project.style}
              onChange={handleChange}
            >

              <option value="Modern Design">
                Modern Design
              </option>

              <option value="Luxury Design">
                Luxury Design
              </option>

              <option value="Minimal Design">
                Minimal Design
              </option>

              <option value="Classic Design">
                Classic Design
              </option>

            </select>

          </div>

        </div>


        {/* LOCATION + STATUS */}

        <div className="form-row">


          <div className="form-group">

            <label>
              Location
            </label>

            <input
              type="text"
              name="location"
              placeholder="Enter project location"
              value={project.location}
              onChange={handleChange}
              required
            />

          </div>


          <div className="form-group">

            <label>
              Status
            </label>

            <select
              name="status"
              value={project.status}
              onChange={handleChange}
            >

              <option value="Ongoing">
                Ongoing
              </option>

              <option value="Completed">
                Completed
              </option>

            </select>

          </div>

        </div>


        {/* IMAGE */}

        <div className="form-group">

          <label>
            Project Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />

          {image && (
            <p>
              Selected: {image.name}
            </p>
          )}

        </div>


        {/* DESCRIPTION */}

        <div className="form-group">

          <label>
            Description
          </label>

          <textarea
            name="description"
            placeholder="Enter project description..."
            value={project.description}
            onChange={handleChange}
            rows="5"
          />

        </div>


        {/* BUTTONS */}

        <div className="form-actions">


          <button
            type="button"
            className="cancel-project-btn"
            onClick={() =>
              navigate("/admin/projects")
            }
            disabled={loading}
          >
            Cancel
          </button>


          <button
            type="submit"
            className="save-project-btn"
            disabled={loading}
          >

            {loading
              ? "Adding..."
              : "+ Add Project"}

          </button>

        </div>

      </form>

    </div>
  );
};

export default AddProject;

