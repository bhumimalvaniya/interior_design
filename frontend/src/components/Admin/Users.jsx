import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Users.css";

const BACKEND_URL = "http://localhost:9000";
const API_URL = `${BACKEND_URL}/api/v1/cust`;

const Users = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // PAGINATION
  // =====================================================

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // =====================================================
  // GET AVATAR URL
  // =====================================================

  const getAvatarUrl = (avatar) => {
    if (!avatar) {
      return "";
    }

    if (
      avatar.startsWith("http://") ||
      avatar.startsWith("https://")
    ) {
      return avatar;
    }

    if (avatar.startsWith("/")) {
      return `${BACKEND_URL}${avatar}`;
    }

    return `${BACKEND_URL}/${avatar}`;
  };

  // =====================================================
  // FETCH USERS
  // =====================================================

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API_URL}/featch`);

      console.log("Users API response:", response.data);

      const backendUsers = response.data.data || [];

      console.log("Backend users:", backendUsers);

      const formattedUsers = backendUsers.map((user) => ({
        id: user._id,

        name: user.name || user.fnm || "Unknown",

        email: user.email || "-",

        phone: user.phone || user.phone_no || "-",

        gender: user.gender || "-",

        city: user.city || "-",

        address: user.address || "-",

        date: user.createdAt
          ? new Date(user.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "-",

        status:
          user.isblocked === true ||
          user.status === "blocked" ||
          user.status === "Blocked"
            ? "Blocked"
            : "Active",

        avatar: getAvatarUrl(user.avatar),
      }));

      console.log("Formatted users:", formattedUsers);

      setUsers(formattedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);

      if (error.response) {
        console.error("Backend error:", error.response.data);
      }

      alert("Unable to fetch users from server.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD USERS
  // =====================================================

  useEffect(() => {
    fetchUsers();
  }, []);

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredUsers = users.filter((user) => {
    const value = search.toLowerCase().trim();

    return (
      user.name?.toLowerCase().includes(value) ||
      user.email?.toLowerCase().includes(value) ||
      user.phone?.toLowerCase().includes(value)
    );
  });

  // =====================================================
  // RESET PAGE WHEN SEARCH / PAGE SIZE CHANGES
  // =====================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [search, itemsPerPage]);

  // =====================================================
  // PAGINATION CALCULATION
  // =====================================================

  const totalUsers = filteredUsers.length;

  const totalPages = Math.ceil(totalUsers / itemsPerPage);

  const indexOfLastUser = currentPage * itemsPerPage;

  const indexOfFirstUser = indexOfLastUser - itemsPerPage;

  const currentUsers = filteredUsers.slice(
    indexOfFirstUser,
    indexOfLastUser
  );

  // =====================================================
  // GO TO PAGE
  // =====================================================

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);
  };

  // =====================================================
  // PAGE NUMBERS
  // =====================================================

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 4) {
        pages.push("...");
      }

      const startPage = Math.max(2, currentPage - 1);

      const endPage = Math.min(
        totalPages - 1,
        currentPage + 1
      );

      for (let i = startPage; i <= endPage; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 3) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  // =====================================================
  // BLOCK / UNBLOCK
  // =====================================================

  const toggleStatus = async (id) => {
    try {
      const response = await axios.put(
        `${API_URL}/toggle/${id}`
      );

      console.log("Toggle response:", response.data);

      await fetchUsers();
    } catch (error) {
      console.error("Toggle status error:", error);

      if (error.response) {
        console.error(
          "Backend error:",
          error.response.data
        );
      }

      alert("Unable to update user status.");
    }
  };

  // =====================================================
  // DELETE USER
  // =====================================================

  const deleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await axios.delete(
        `${API_URL}/delete/${id}`
      );

      console.log("Delete response:", response.data);

      await fetchUsers();

      // Check if current page is still valid
      const remainingUsers = totalUsers - 1;
      const newTotalPages = Math.ceil(
        remainingUsers / itemsPerPage
      );

      if (
        currentPage > newTotalPages &&
        newTotalPages > 0
      ) {
        setCurrentPage(newTotalPages);
      }
    } catch (error) {
      console.error("Delete user error:", error);

      if (error.response) {
        console.error(
          "Backend error:",
          error.response.data
        );
      }

      alert("Unable to delete user.");
    }
  };

  // =====================================================
  // AVATAR INITIAL
  // =====================================================

  const getInitial = (name) => {
    if (!name) {
      return "?";
    }

    return name.charAt(0).toUpperCase();
  };

  // =====================================================
  // AVATAR ERROR
  // =====================================================

  const handleAvatarError = (event, user) => {
    console.error("Avatar image failed to load:", {
      name: user.name,
      avatar: user.avatar,
    });

    event.currentTarget.style.display = "none";

    const fallback =
      event.currentTarget.nextElementSibling;

    if (fallback) {
      fallback.style.display = "flex";
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="users-page">
        <div className="users-loading">
          <h2>Loading Users...</h2>

          <p>
            Please wait while users are being fetched.
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="users-page">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="users-header">

        <div>
          <p className="users-small-title">
            ADMINISTRATION
          </p>

          <h1>Users</h1>

          <span>
            Manage all registered users.
          </span>
        </div>

        <div className="users-total">

          <div className="users-total-icon">
            👥
          </div>

          <div>
            <strong>{users.length}</strong>

            <small>Total Users</small>
          </div>

        </div>

      </div>

      {/* =================================================
          STATISTICS
      ================================================= */}

      <div className="users-stats">

        <div className="user-stat-card">

          <div className="stat-icon">
            👥
          </div>

          <div>
            <span>TOTAL USERS</span>

            <strong>{users.length}</strong>
          </div>

        </div>

        <div className="user-stat-card">

          <div className="stat-icon active-icon">
            ✓
          </div>

          <div>
            <span>ACTIVE USERS</span>

            <strong>
              {
                users.filter(
                  (user) =>
                    user.status === "Active"
                ).length
              }
            </strong>
          </div>

        </div>

        <div className="user-stat-card">

          <div className="stat-icon blocked-icon">
            !
          </div>

          <div>
            <span>BLOCKED USERS</span>

            <strong>
              {
                users.filter(
                  (user) =>
                    user.status === "Blocked"
                ).length
              }
            </strong>
          </div>

        </div>

      </div>

      {/* =================================================
          TABLE CARD
      ================================================= */}

      <div className="users-card">

        {/* =================================================
            TOOLBAR
        ================================================= */}

        <div className="users-toolbar">

          <div className="users-search">

            <span>🔍</span>

            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          <div className="users-result">

            Showing{" "}

            <strong>
              {filteredUsers.length}
            </strong>

            {" "}users

          </div>

        </div>

        {/* =================================================
            TABLE
        ================================================= */}

        <div className="users-table-wrapper">

          <table className="users-table">

            <thead>

              <tr>

                <th>USER</th>

                <th>EMAIL</th>

                <th>PHONE</th>

                <th>GENDER</th>

                <th>CITY</th>

                <th>ADDRESS</th>

                <th>JOINED</th>

                <th>STATUS</th>

                <th>ACTION</th>

              </tr>

            </thead>

            <tbody>

              {currentUsers.length > 0 ? (

                currentUsers.map((user) => (

                  <tr key={user.id}>

                    {/* USER */}

                    <td>

                      <div className="user-info">

                        {user.avatar ? (

                          <>

                            <img
                              src={user.avatar}
                              alt={user.name}
                              onError={(e) =>
                                handleAvatarError(
                                  e,
                                  user
                                )
                              }
                            />

                            <div
                              className="user-avatar"
                              style={{
                                display: "none",
                              }}
                            >
                              {getInitial(user.name)}
                            </div>

                          </>

                        ) : (

                          <div className="user-avatar">
                            {getInitial(user.name)}
                          </div>

                        )}

                        <div className="user-details">

                          <strong>
                            {user.name}
                          </strong>

                          <small>
                            ID #{user.id}
                          </small>

                        </div>

                      </div>

                    </td>

                    {/* EMAIL */}

                    <td>

                      <span className="user-email">
                        {user.email}
                      </span>

                    </td>

                    {/* PHONE */}

                    <td>
                      {user.phone}
                    </td>

                    {/* GENDER */}

                    <td>
                      {user.gender}
                    </td>

                    {/* CITY */}

                    <td>
                      {user.city}
                    </td>

                    {/* ADDRESS */}

                    <td>
                      {user.address}
                    </td>

                    {/* JOINED */}

                    <td>
                      {user.date}
                    </td>

                    {/* STATUS */}

                    <td>

                      <span
                        className={`user-status ${
                          user.status === "Active"
                            ? "status-active"
                            : "status-blocked"
                        }`}
                      >

                        <i></i>

                        {user.status}

                      </span>

                    </td>

                    {/* ACTION */}

                    <td>

                      <div className="user-actions">

                        <button
                          className={
                            user.status === "Active"
                              ? "block-btn"
                              : "unblock-btn"
                          }
                          onClick={() =>
                            toggleStatus(user.id)
                          }
                          title={
                            user.status === "Active"
                              ? "Block User"
                              : "Unblock User"
                          }
                        >
                          {user.status === "Active"
                            ? "🚫"
                            : "✓"}
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            deleteUser(user.id)
                          }
                          title="Delete User"
                        >
                          🗑
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="9"
                    className="no-users"
                  >

                    <div>👥</div>

                    <strong>
                      No users found
                    </strong>

                    <span>
                      Try searching with a different
                      name, email or phone number.
                    </span>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

        {/* =================================================
            PAGINATION FOOTER
        ================================================= */}

        {totalUsers > 0 && (

          <div className="users-pagination-wrapper">

            {/* PAGE SIZE */}

            <div className="users-page-size">

              <span>Show</span>

              <select
                value={itemsPerPage}
                onChange={(e) =>
                  setItemsPerPage(
                    Number(e.target.value)
                  )
                }
              >

                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>

              </select>

              <span>per page</span>

            </div>

            {/* PAGINATION INFO */}

            <div className="users-pagination-info">

              Showing{" "}

              <strong>
                {indexOfFirstUser + 1}
              </strong>

              {" "}to{" "}

              <strong>
                {Math.min(
                  indexOfLastUser,
                  totalUsers
                )}
              </strong>

              {" "}of{" "}

              <strong>
                {totalUsers}
              </strong>

              {" "}users

            </div>

            {/* PAGINATION CONTROLS */}

            {totalPages > 1 && (

              <div className="users-pagination-controls">

                {/* PREVIOUS */}

                <button
                  className="users-pagination-arrow"
                  onClick={() =>
                    goToPage(currentPage - 1)
                  }
                  disabled={currentPage === 1}
                  title="Previous Page"
                >
                  ‹
                </button>

                {/* PAGE NUMBERS */}

                {getPageNumbers().map(
                  (page, index) =>

                    page === "..." ? (

                      <span
                        key={`dots-${index}`}
                        className="users-pagination-dots"
                      >
                        ...
                      </span>

                    ) : (

                      <button
                        key={page}
                        className={`users-pagination-number ${
                          currentPage === page
                            ? "active"
                            : ""
                        }`}
                        onClick={() =>
                          goToPage(page)
                        }
                      >
                        {page}
                      </button>

                    )
                )}

                {/* NEXT */}

                <button
                  className="users-pagination-arrow"
                  onClick={() =>
                    goToPage(currentPage + 1)
                  }
                  disabled={
                    currentPage === totalPages
                  }
                  title="Next Page"
                >
                  ›
                </button>

              </div>

            )}

          </div>

        )}

      </div>

    </div>
  );
};

export default Users;