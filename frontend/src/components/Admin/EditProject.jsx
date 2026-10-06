
import React, { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import axios from "axios";

import "./EditProject.css";
import API_URL from "../../config/api";

const EditProject = () => {

  const navigate = useNavigate();

  const { id } = useParams();


  // ==========================================
  // PROJECT STATE
  // ==========================================

  const [project, setProject] = useState({

    title: "",
    category: "Residential",
    style: "Modern Design",
    location: "",
    status: "Ongoing",
    description: "",

  });


  // ==========================================
  // IMAGE STATE
  // ==========================================

  const [image, setImage] = useState(null);

  const [oldImage, setOldImage] = useState("");


  // ==========================================
  // LOADING STATES
  // ==========================================

  const [loading, setLoading] = useState(true);

  const [updating, setUpdating] = useState(false);


  // ==========================================
  // FETCH SINGLE PROJECT
  // ==========================================

  const fetchProject = async () => {

    try {

      setLoading(true);


      console.log(
        "Fetching project:",
        id
      );


      const response = await axios.get(
        // `http://localhost:9000/api/v1/project/${id}`
        `${API_URL}/project/${id}`
      );


      console.log(
        "Project Response:",
        response.data
      );


      if (
        response.data.success &&
        response.data.data
      ) {

        const data =
          response.data.data;


        setProject({

          title: data.title || "",

          category:
            data.category ||
            "Residential",

          style:
            data.style ||
            "Modern Design",

          location:
            data.location || "",

          status:
            data.status ||
            "Ongoing",

          description:
            data.description || "",

        });


        setOldImage(
          data.image || ""
        );


      } else {

        alert(
          response.data.message ||
          "Project not found"
        );

        navigate("/admin/projects");

      }


    } catch (error) {

      console.log(
        "Fetch Project Error:",
        error.response?.data ||
        error
      );


      alert(
        error.response?.data?.message ||
        "Failed to fetch project"
      );


      navigate("/admin/projects");


    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // FETCH PROJECT WHEN PAGE LOADS
  // ==========================================

  useEffect(() => {

    fetchProject();

  }, [id]);


  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;


    setProject({

      ...project,

      [name]: value,

    });

  };


  // ==========================================
  // HANDLE IMAGE CHANGE
  // ==========================================

  const handleImageChange = (e) => {

    const selectedImage =
      e.target.files[0];


    if (selectedImage) {

      setImage(selectedImage);

    }

  };


  // ==========================================
  // UPDATE PROJECT
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault();


    try {

      setUpdating(true);


      const formData =
        new FormData();


      formData.append(
        "title",
        project.title
      );


      formData.append(
        "category",
        project.category
      );


      formData.append(
        "style",
        project.style
      );


      formData.append(
        "location",
        project.location
      );


      formData.append(
        "status",
        project.status
      );


      formData.append(
        "description",
        project.description
      );


      // Only send new image
      // if user selected one

      if (image) {

        formData.append(
          "image",
          image
        );

      }


      console.log(
        "Updating project..."
      );


      const response =
        await axios.put(

          // `http://localhost:9000/api/v1/project/update/${id}`,
          `${API_URL}/project/update/${id}`,

          formData,

          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }

        );


      console.log(
        "Update Response:",
        response.data
      );


      if (
        response.data.success
      ) {

        alert(
          "Project updated successfully!"
        );


        navigate(
          "/admin/projects"
        );

      } else {

        alert(
          response.data.message ||
          "Failed to update project"
        );

      }


    } catch (error) {

      console.log(
        "Update Project Error:",
        error.response?.data ||
        error
      );


      alert(
        error.response?.data?.message ||
        "Failed to update project"
      );


    } finally {

      setUpdating(false);

    }

  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="edit-project-page">

        <div className="edit-not-found">

          <h2>
            Loading Project...
          </h2>

          <p>
            Please wait while project
            information is loading.
          </p>

        </div>

      </div>

    );

  }


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <div className="edit-project-page">


      {/* =====================================
          HEADER
      ===================================== */}

      <div className="edit-project-header">

        <div>

          <p>
            PROJECT MANAGEMENT
          </p>

          <h1>
            Edit Project
          </h1>

          <span>
            Update project information.
          </span>

        </div>

      </div>


      {/* =====================================
          FORM
      ===================================== */}

      <form
        className="edit-project-form"
        onSubmit={handleSubmit}
      >


        {/* TITLE */}

        <div className="form-group">

          <label>
            Project Title
          </label>

          <input
            type="text"
            name="title"
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


        {/* CURRENT IMAGE */}

        <div className="form-group">

          <label>
            Current Project Image
          </label>


          {oldImage ? (

            <img
              src={
                oldImage.startsWith("http")
                  ? oldImage
                  : `http://localhost:9000${oldImage}`
              }
              alt="Current Project"
              style={{
                width: "200px",
                height: "130px",
                objectFit: "cover",
                borderRadius: "8px",
                marginTop: "10px",
              }}
            />

          ) : (

            <p>
              No image available
            </p>

          )}

        </div>


        {/* NEW IMAGE */}

        <div className="form-group">

          <label>
            Change Project Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />


          {image && (

            <p>
              New Image: {image.name}
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
            value={project.description}
            onChange={handleChange}
            rows="6"
          />

        </div>


        {/* BUTTONS */}

        <div className="form-actions">


          <button
            type="button"
            className="cancel-project-btn"
            onClick={() =>
              navigate(
                "/admin/projects"
              )
            }
            disabled={updating}
          >

            Cancel

          </button>


          <button
            type="submit"
            className="update-project-btn"
            disabled={updating}
          >

            {updating
              ? "Updating..."
              : "✓ Update Project"}

          </button>


        </div>

      </form>

    </div>

  );

};


export default EditProject;

