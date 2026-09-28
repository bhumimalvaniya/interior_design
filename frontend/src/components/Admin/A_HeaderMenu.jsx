import React, { useEffect, useState } from "react";
import axios from "axios";
import "./A_HeaderMenu.css";

const API_URL = "http://localhost:9000/api/v1";

const INITIAL_FORM = {
  name: "",
  slug: "",
  type: "service",
  menuType: "single",
  parentId: "",
  path: "",
  order: 0,
  status: "active",
};

const A_HeaderMenu = () => {
  // =====================================================
  // STATES
  // =====================================================

  const [menus, setMenus] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState(INITIAL_FORM);

  // =====================================================
  // PAGINATION STATES
  // =====================================================

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // =====================================================
  // FETCH MENUS
  // =====================================================

  const fetchMenus = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_URL}/header-menu/featch`
      );

      console.log(
        "HEADER MENU RESPONSE:",
        response.data
      );

      const menuData = response.data?.data || [];

      setMenus(menuData);

      // Calculate total pages after fetching
      const newTotalPages = Math.ceil(
        menuData.length / itemsPerPage
      );

      // If current page becomes invalid
      if (
        newTotalPages > 0 &&
        currentPage > newTotalPages
      ) {
        setCurrentPage(newTotalPages);
      }

      // If no menus
      if (menuData.length === 0) {
        setCurrentPage(1);
      }
    } catch (error) {
      console.error(
        "FETCH HEADER MENU ERROR:",
        error.response?.data || error.message
      );

      setMenus([]);

      alert(
        error.response?.data?.message ||
          "Failed to fetch header menus"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    fetchMenus();
  }, []);

  // =====================================================
  // PAGINATION CALCULATION
  // =====================================================

  const totalPages = Math.ceil(
    menus.length / itemsPerPage
  );

  const startIndex =
    (currentPage - 1) * itemsPerPage;

  const endIndex =
    startIndex + itemsPerPage;

  // IMPORTANT:
  // Only display menus for current page
  const currentMenus = menus.slice(
    startIndex,
    endIndex
  );

  // =====================================================
  // CHANGE PAGE
  // =====================================================

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // CHANGE ITEMS PER PAGE
  // =====================================================

  const handleItemsPerPageChange = (e) => {
    const newLimit = Number(e.target.value);

    setItemsPerPage(newLimit);

    // Always start from first page
    setCurrentPage(1);
  };

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // GENERATE SLUG
  // =====================================================

  const generateSlug = (value) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // =====================================================
  // NAME CHANGE
  // =====================================================

  const handleNameChange = (e) => {
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      name: value,

      // Auto generate slug only while adding
      slug: editingId
        ? prev.slug
        : generateSlug(value),
    }));
  };

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {
    setFormData({
      ...INITIAL_FORM,
    });

    setEditingId(null);
    setShowForm(false);
  };

  // =====================================================
  // OPEN ADD FORM
  // =====================================================

  const openAddForm = () => {
    setFormData({
      ...INITIAL_FORM,
    });

    setEditingId(null);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // ADD MENU
  // =====================================================

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter menu name");
      return;
    }

    if (!formData.slug.trim()) {
      alert("Please enter menu slug");
      return;
    }

    if (!formData.path.trim()) {
      alert("Please enter menu path");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        type: formData.type,
        menuType: formData.menuType,
        parentId: formData.parentId || null,
        path: formData.path.trim(),
        order: Number(formData.order),
        status: formData.status,
      };

      console.log(
        "ADD HEADER MENU PAYLOAD:",
        payload
      );

      const response = await axios.post(
        `${API_URL}/header-menu/add`,
        payload
      );

      console.log(
        "ADD HEADER MENU RESPONSE:",
        response.data
      );

      alert(
        response.data?.message ||
          "Header menu added successfully"
      );

      // Go to first page after adding
      setCurrentPage(1);

      resetForm();

      await fetchMenus();
    } catch (error) {
      console.error(
        "ADD HEADER MENU ERROR:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to add header menu"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // EDIT MENU
  // =====================================================

  const handleEdit = (menu) => {
    console.log("EDIT MENU:", menu);

    setEditingId(menu._id);

    setFormData({
      name: menu.name || "",
      slug: menu.slug || "",
      type: menu.type || "service",
      menuType: menu.menuType || "single",
      parentId:
        menu.parentId?._id ||
        menu.parentId ||
        "",
      path: menu.path || "",
      order: menu.order ?? 0,
      status: menu.status || "active",
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // UPDATE MENU
  // =====================================================

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editingId) {
      alert("Invalid menu ID");
      return;
    }

    if (!formData.name.trim()) {
      alert("Please enter menu name");
      return;
    }

    if (!formData.slug.trim()) {
      alert("Please enter menu slug");
      return;
    }

    if (!formData.path.trim()) {
      alert("Please enter menu path");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        type: formData.type,
        menuType: formData.menuType,
        parentId: formData.parentId || null,
        path: formData.path.trim(),
        order: Number(formData.order),
        status: formData.status,
      };

      console.log(
        "UPDATE HEADER MENU PAYLOAD:",
        payload
      );

      const response = await axios.put(
        `${API_URL}/header-menu/update/${editingId}`,
        payload
      );

      console.log(
        "UPDATE HEADER MENU RESPONSE:",
        response.data
      );

      alert(
        response.data?.message ||
          "Header menu updated successfully"
      );

      resetForm();

      await fetchMenus();
    } catch (error) {
      console.error(
        "UPDATE HEADER MENU ERROR:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to update header menu"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE MENU
  // =====================================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this header menu?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await axios.delete(
        `${API_URL}/header-menu/delete/${id}`
      );

      console.log(
        "DELETE HEADER MENU RESPONSE:",
        response.data
      );

      alert(
        response.data?.message ||
          "Header menu deleted successfully"
      );

      await fetchMenus();
    } catch (error) {
      console.error(
        "DELETE HEADER MENU ERROR:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete header menu"
      );
    }
  };

  // =====================================================
  // TOGGLE STATUS
  // =====================================================

  const handleStatusChange = async (menu) => {
    const newStatus =
      menu.status === "active"
        ? "inactive"
        : "active";

    try {
      await axios.put(
        `${API_URL}/header-menu/update/${menu._id}`,
        {
          status: newStatus,
        }
      );

      await fetchMenus();
    } catch (error) {
      console.error(
        "STATUS UPDATE ERROR:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to update menu status"
      );
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="admin-header-menu">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="header-menu-top">

        <div>
          <h1>Header Menu</h1>

          <p>
            Manage your website header navigation
          </p>
        </div>

        <button
          type="button"
          className="add-menu-btn"
          onClick={openAddForm}
        >
          + Add Header Menu
        </button>

      </div>

      {/* =================================================
          FORM
      ================================================= */}

      {showForm && (
        <div className="menu-form-card">

          <div className="form-header">

            <h2>
              {editingId
                ? "Update Header Menu"
                : "Add Header Menu"}
            </h2>

            <button
              type="button"
              className="close-btn"
              onClick={resetForm}
            >
              ✕
            </button>

          </div>

          <form
            onSubmit={
              editingId
                ? handleUpdate
                : handleAdd
            }
          >

            <div className="form-grid">

              {/* NAME */}

              <div className="form-group">

                <label>
                  Menu Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="Example: Living Room"
                />

              </div>

              {/* SLUG */}

              <div className="form-group">

                <label>
                  Slug
                </label>

                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="living-room"
                />

              </div>

              {/* TYPE */}

              <div className="form-group">

                <label>
                  Type
                </label>

                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >

                  <option value="service">
                    Service
                  </option>

                  <option value="project">
                    Project
                  </option>

                </select>

              </div>

              {/* MENU TYPE */}

              <div className="form-group">

                <label>
                  Menu Type
                </label>

                <select
                  name="menuType"
                  value={formData.menuType}
                  onChange={handleChange}
                >

                  <option value="single">
                    Single
                  </option>

                  <option value="dropdown">
                    Dropdown
                  </option>

                </select>

              </div>

              {/* PARENT MENU */}

              <div className="form-group">

                <label>
                  Parent Menu
                </label>

                <select
                  name="parentId"
                  value={formData.parentId || ""}
                  onChange={handleChange}
                >

                  <option value="">
                    No Parent (Top Level)
                  </option>

                  {menus
                    .filter((menu) => {

                      // Don't allow current menu
                      // to become its own parent
                      if (
                        editingId &&
                        menu._id === editingId
                      ) {
                        return false;
                      }

                      // Only dropdown menus
                      // can be parents
                      return (
                        menu.menuType ===
                        "dropdown"
                      );
                    })
                    .map((menu) => (

                      <option
                        key={menu._id}
                        value={menu._id}
                      >
                        {menu.name}
                      </option>

                    ))}

                </select>

              </div>

              {/* PATH */}

              <div className="form-group">

                <label>
                  React Path
                </label>

                <input
                  type="text"
                  name="path"
                  value={formData.path}
                  onChange={handleChange}
                  placeholder="/services/living-room"
                />

              </div>

              {/* ORDER */}

              <div className="form-group">

                <label>
                  Menu Order
                </label>

                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  min="0"
                />

              </div>

              {/* STATUS */}

              <div className="form-group">

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

            </div>

            {/* FORM BUTTONS */}

            <div className="form-actions">

              <button
                type="button"
                className="cancel-btn"
                onClick={resetForm}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-btn"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Menu"
                  : "Add Menu"}
              </button>

            </div>

          </form>

        </div>
      )}

      {/* =================================================
          TABLE
      ================================================= */}

      <div className="menu-table-card">

        {/* TABLE HEADER */}

        <div className="table-header">

          <div>
            <h2>
              Header Menu List
            </h2>

            <span>
              {menus.length} Menus
            </span>
          </div>

          {/* ITEMS PER PAGE */}

          {menus.length > 0 && (
            <div className="pagination-size">

              <label>
                Show
              </label>

              <select
                value={itemsPerPage}
                onChange={
                  handleItemsPerPageChange
                }
              >

                <option value={5}>
                  5
                </option>

                <option value={10}>
                  10
                </option>

                <option value={20}>
                  20
                </option>

                <option value={50}>
                  50
                </option>

              </select>

              <span>
                per page
              </span>

            </div>
          )}

        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (

          <div className="loading">
            Loading menus...
          </div>

        ) : menus.length === 0 ? (

          <div className="empty">
            No header menus found.
          </div>

        ) : (

          <>

            {/* =================================================
                TABLE WRAPPER
            ================================================= */}

            <div className="table-wrapper">

              <table>

                <thead>

                  <tr>

                    <th>
                      #
                    </th>

                    <th>
                      Name
                    </th>

                    <th>
                      Slug
                    </th>

                    <th>
                      Type
                    </th>

                    <th>
                      Menu Type
                    </th>

                    <th>
                      Path
                    </th>

                    <th>
                      Order
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {/* IMPORTANT:
                      currentMenus.map()
                      instead of menus.map()
                  */}

                  {currentMenus.map(
                    (menu, index) => (

                      <tr key={menu._id}>

                        {/* NUMBER */}

                        <td>
                          {startIndex +
                            index +
                            1}
                        </td>

                        {/* NAME */}

                        <td>

                          <strong>
                            {menu.name}
                          </strong>

                        </td>

                        {/* SLUG */}

                        <td>

                          <span className="slug">
                            {menu.slug}
                          </span>

                        </td>

                        {/* TYPE */}

                        <td>

                          <span
                            className={`type-badge ${
                              menu.type || ""
                            }`}
                          >
                            {menu.type || "-"}
                          </span>

                        </td>

                        {/* MENU TYPE */}

                        <td>
                          {menu.menuType ||
                            "single"}
                        </td>

                        {/* PATH */}

                        <td>

                          <span className="path">
                            {menu.path}
                          </span>

                        </td>

                        {/* ORDER */}

                        <td>
                          {menu.order ?? 0}
                        </td>

                        {/* STATUS */}

                        <td>

                          <button
                            type="button"
                            className={`status-btn ${
                              menu.status
                            }`}
                            onClick={() =>
                              handleStatusChange(
                                menu
                              )
                            }
                          >

                            {menu.status ===
                            "active"
                              ? "Active"
                              : "Inactive"}

                          </button>

                        </td>

                        {/* ACTION */}

                        <td>

                          <div className="action-buttons">

                            <button
                              type="button"
                              className="edit-btn"
                              onClick={() =>
                                handleEdit(
                                  menu
                                )
                              }
                              title="Edit"
                            >
                              ✏️
                            </button>

                            <button
                              type="button"
                              className="delete-btn"
                              onClick={() =>
                                handleDelete(
                                  menu._id
                                )
                              }
                              title="Delete"
                            >
                              🗑️
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

            {/* =================================================
                PAGINATION
            ================================================= */}

            {totalPages > 1 && (

              <div className="pagination-container">

                {/* PREVIOUS BUTTON */}

                <button
                  type="button"
                  className="pagination-btn previous"
                  disabled={
                    currentPage === 1
                  }
                  onClick={() =>
                    handlePageChange(
                      currentPage - 1
                    )
                  }
                >
                  ← Previous
                </button>

                {/* PAGE NUMBERS */}

                <div className="pagination-pages">

                  {Array.from(
                    {
                      length: totalPages,
                    },
                    (_, index) =>
                      index + 1
                  ).map((page) => (

                    <button
                      key={page}
                      type="button"
                      className={`pagination-number ${
                        currentPage === page
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        handlePageChange(
                          page
                        )
                      }
                    >
                      {page}
                    </button>

                  ))}

                </div>

                {/* NEXT BUTTON */}

                <button
                  type="button"
                  className="pagination-btn next"
                  disabled={
                    currentPage ===
                    totalPages
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

            {/* =================================================
                PAGINATION INFORMATION
            ================================================= */}

            {menus.length > 0 && (

              <div className="pagination-info">

                Showing{" "}

                <strong>
                  {startIndex + 1}
                </strong>

                {" "}to{" "}

                <strong>
                  {Math.min(
                    endIndex,
                    menus.length
                  )}
                </strong>

                {" "}of{" "}

                <strong>
                  {menus.length}
                </strong>

                {" "}menus

              </div>

            )}

          </>

        )}

      </div>

    </div>
  );
};

export default A_HeaderMenu;