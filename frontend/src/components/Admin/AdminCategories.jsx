import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./AdminCategories.css";
import API_URL from "../../config/api";

const AdminCategories = () => {

  // =========================================
  // API URL
  // =========================================

  // const API_URL ="http://localhost:9000/api/v1/category";


  // =========================================
  // STATES
  // =========================================

  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [deleteLoading, setDeleteLoading] = useState(null);


  // =========================================
  // PAGINATION STATES
  // =========================================

  const [currentPage, setCurrentPage] = useState(1);

  const [itemsPerPage, setItemsPerPage] = useState(6);


  // =========================================
  // FETCH CATEGORIES
  // =========================================

  const fetchCategories = async () => {

    try {

      setLoading(true);

      const response = await axios.get(
        `${API_URL}/category/featch`
      );

      console.log(
        "CATEGORY RESPONSE:",
        response.data
      );


      if (response.data.success) {

        setCategories(
          response.data.data || []
        );

      } else {

        setCategories([]);

      }

    } catch (error) {

      console.error(
        "FETCH CATEGORY ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to fetch categories"
      );

    } finally {

      setLoading(false);

    }

  };


  // =========================================
  // FETCH DATA ON PAGE LOAD
  // =========================================

  useEffect(() => {

    fetchCategories();

  }, []);


  // =========================================
  // SEARCH
  // =========================================

  const filteredCategories =
    categories.filter((category) => {

      const searchText =
        search.toLowerCase().trim();

      return (
        category.name
          ?.toLowerCase()
          .includes(searchText) ||

        category.description
          ?.toLowerCase()
          .includes(searchText)
      );

    });


  // =========================================
  // RESET PAGE WHEN SEARCH CHANGES
  // =========================================

  useEffect(() => {

    setCurrentPage(1);

  }, [search]);


  // =========================================
  // PAGINATION CALCULATION
  // =========================================

  const totalPages = Math.ceil(
    filteredCategories.length /
      itemsPerPage
  );


  const startIndex =
    (currentPage - 1) *
    itemsPerPage;


  const endIndex =
    startIndex + itemsPerPage;


  const currentCategories =
    filteredCategories.slice(
      startIndex,
      endIndex
    );


  // =========================================
  // KEEP PAGE VALID AFTER DELETE / SEARCH
  // =========================================

  useEffect(() => {

    if (
      totalPages > 0 &&
      currentPage > totalPages
    ) {

      setCurrentPage(totalPages);

    }

    if (totalPages === 0) {

      setCurrentPage(1);

    }

  }, [
    totalPages,
    currentPage
  ]);


  // =========================================
  // CHANGE PAGE
  // =========================================

  const handlePageChange = (page) => {

    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  };


  // =========================================
  // CHANGE ITEMS PER PAGE
  // =========================================

  const handleItemsPerPageChange = (e) => {

    const newLimit =
      Number(e.target.value);

    setItemsPerPage(newLimit);

    setCurrentPage(1);

  };


  // =========================================
  // DELETE CATEGORY
  // =========================================

  const handleDelete = async (
    id,
    name
  ) => {

    const confirmDelete =
      window.confirm(
        `Are you sure you want to delete "${name}"?`
      );

    if (!confirmDelete) {
      return;
    }


    try {

      setDeleteLoading(id);

      const response =
        await axios.delete(
          `${API_URL}/category/delete/${id}`
        );


      console.log(
        "DELETE CATEGORY RESPONSE:",
        response.data
      );


      if (response.data.success) {

        alert(
          `Category "${name}" deleted successfully.`
        );


        // Remove deleted category immediately
        setCategories((prev) =>
          prev.filter(
            (category) =>
              category._id !== id
          )
        );

      }

    } catch (error) {

      console.error(
        "DELETE CATEGORY ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to delete category"
      );

    } finally {

      setDeleteLoading(null);

    }

  };


  // =========================================
  // STATISTICS
  // =========================================

  const totalCategories =
    categories.length;


  const activeCategories =
    categories.filter(
      (category) =>
        category.status === "Active"
    ).length;


  const inactiveCategories =
    categories.filter(
      (category) =>
        category.status === "Inactive"
    ).length;


  /*
    Your current Category model does not have
    totalProjects.

    Therefore, if you have not added a
    totalProjects field to MongoDB, we display 0.

    Later, if projects are connected with
    categories, this can be calculated
    dynamically from the Project collection.
  */

  const totalProjects =
    categories.reduce(
      (total, category) =>
        total +
        Number(
          category.totalProjects || 0
        ),
      0
    );


  // =========================================
  // LOADING
  // =========================================

  if (loading) {

    return (

      <div className="admin-categories">

        <div className="categories-loading">

          <div className="categories-loader">
            Loading...
          </div>

          <p>
            Loading categories...
          </p>

        </div>

      </div>

    );

  }


  // =========================================
  // RETURN
  // =========================================

  return (

    <div className="admin-categories">


      {/* =====================================
          PAGE HEADER
      ===================================== */}

      <div className="categories-page-header">

        <div>

          <p className="categories-small-title">
            CATEGORY MANAGEMENT
          </p>

          <h1>
            Categories
          </h1>

          <span>
            Manage interior design categories
            and project collections.
          </span>

        </div>


        <Link
          to="/admin/categories/add"
          className="add-category-btn"
        >
          + Add Category
        </Link>

      </div>


      {/* =====================================
          STATISTICS
      ===================================== */}

      <div className="categories-stats">


        {/* TOTAL */}

        <div className="category-stat-card">

          <div className="category-stat-icon">
            📁
          </div>

          <div>

            <span>
              Total Categories
            </span>

            <strong>
              {totalCategories}
            </strong>

          </div>

        </div>


        {/* ACTIVE */}

        <div className="category-stat-card">

          <div className="category-stat-icon">
            ✓
          </div>

          <div>

            <span>
              Active
            </span>

            <strong>
              {activeCategories}
            </strong>

          </div>

        </div>


        {/* INACTIVE */}

        <div className="category-stat-card">

          <div className="category-stat-icon">
            ⏸
          </div>

          <div>

            <span>
              Inactive
            </span>

            <strong>
              {inactiveCategories}
            </strong>

          </div>

        </div>


        {/* PROJECTS */}

        {/*
        <div className="category-stat-card">

          <div className="category-stat-icon">
            🏠
          </div>

          <div>

            <span>
              Total Projects
            </span>

            <strong>
              {totalProjects}
            </strong>

          </div>

        </div>
        */}

      </div>


      {/* =====================================
          SEARCH + PAGINATION SIZE
      ===================================== */}

      <div className="categories-filter">

        <div className="categories-search">

          <span>
            🔍
          </span>

          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>


        {/* ITEMS PER PAGE */}

        <div className="categories-page-size">

          <label htmlFor="itemsPerPage">
            Show
          </label>

          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={
              handleItemsPerPageChange
            }
          >

            <option value="6">
              6
            </option>

            <option value="12">
              12
            </option>

            <option value="18">
              18
            </option>

            <option value="24">
              24
            </option>

          </select>

          <span>
            per page
          </span>

        </div>

      </div>


      {/* =====================================
          CATEGORY GRID
      ===================================== */}

      <div className="categories-grid">

        {currentCategories.length > 0 ? (

          currentCategories.map(
            (category) => (

              <div
                className="category-card"
                key={category._id}
              >


                {/* IMAGE */}

                <div className="category-image">

                  <img
                    src={category.image}
                    alt={category.name}
                    onError={(e) => {
                      e.target.style.display =
                        "none";
                    }}
                  />


                  {/* STATUS */}

                  <span
                    className={`category-status ${
                      category.status === "Active"
                        ? "active"
                        : "inactive"
                    }`}
                  >
                    {category.status}
                  </span>

                </div>


                {/* CONTENT */}

                <div className="category-content">

                  <div className="category-content-top">

                    <div>

                      <h2>
                        {category.name}
                      </h2>

                      <p>
                        {category.description}
                      </p>

                    </div>

                  </div>


                  {/* PROJECT COUNT */}

                  <div className="category-project-count">

                    <span>
                      Projects
                    </span>

                    <strong>
                      {category.totalProjects || 0}
                    </strong>

                  </div>


                  {/* ACTIONS */}

                  <div className="category-actions">


                    {/* EDIT */}

                    <Link
                      to={`/admin/categories/edit/${category._id}`}
                      className="category-edit-btn"
                    >
                      Edit
                    </Link>


                    {/* DELETE */}

                    <button
                      className="category-delete-btn"
                      onClick={() =>
                        handleDelete(
                          category._id,
                          category.name
                        )
                      }
                      disabled={
                        deleteLoading ===
                        category._id
                      }
                    >

                      {deleteLoading ===
                      category._id
                        ? "Deleting..."
                        : "Delete"}

                    </button>

                  </div>

                </div>

              </div>

            )

          )

        ) : (

          <div className="categories-no-results">

            <div>
              🔍
            </div>

            <h2>
              No Categories Found
            </h2>

            <p>
              {search
                ? "Try searching with a different category name."
                : "No categories have been added yet."}
            </p>

          </div>

        )}

      </div>


      {/* =====================================
          PAGINATION
      ===================================== */}

      {filteredCategories.length > 0 && (

        <div className="categories-pagination-wrapper">


          {/* PAGINATION INFORMATION */}

          <div className="categories-pagination-info">

            Showing{" "}

            <strong>
              {startIndex + 1}
            </strong>

            {" "}to{" "}

            <strong>
              {Math.min(
                endIndex,
                filteredCategories.length
              )}
            </strong>

            {" "}of{" "}

            <strong>
              {filteredCategories.length}
            </strong>

            {" "}categories

            {search && (
              <span>
                {" "}for "{search}"
              </span>
            )}

          </div>


          {/* PAGINATION */}

          {totalPages > 1 && (

            <div className="categories-pagination">


              {/* PREVIOUS */}

              <button
                type="button"
                className="pagination-btn previous"
                disabled={currentPage === 1}
                onClick={() =>
                  handlePageChange(
                    currentPage - 1
                  )
                }
              >
                ← Previous
              </button>


              {/* PAGE NUMBERS */}

              <div className="pagination-numbers">

                {Array.from(
                  {
                    length: totalPages
                  },
                  (_, index) =>
                    index + 1
                ).map((page) => (

                  <button
                    type="button"
                    key={page}
                    className={`pagination-number ${
                      currentPage === page
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      handlePageChange(page)
                    }
                  >
                    {page}
                  </button>

                ))}

              </div>


              {/* NEXT */}

              <button
                type="button"
                className="pagination-btn next"
                disabled={
                  currentPage === totalPages
                }
                onClick={() =>
                  handlePageChange(
                    currentPage + 1
                  )
                }
              >
                Next →
              </button>

            </div>

          )}

        </div>

      )}


      {/* =====================================
          FOOTER
      ===================================== */}

      <div className="categories-footer">

        Showing{" "}

        <strong>
          {filteredCategories.length}
        </strong>

        {" "}of{" "}

        <strong>
          {categories.length}
        </strong>

        {" "}categories

      </div>


    </div>

  );

};

export default AdminCategories;