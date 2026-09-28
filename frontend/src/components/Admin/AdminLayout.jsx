
import React from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaCalendarAlt,
  FaImages,
  FaList,
  FaEnvelope,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUserCircle,
  FaConciergeBell,
} from "react-icons/fa";

import "./AdminLayout.css";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const adminName =
    sessionStorage.getItem("adminName") || "Admin";


  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = () => {
    // Remove admin authentication 
    sessionStorage.removeItem("adminToken"); 
    sessionStorage.removeItem("adminLoggedIn"); 
    sessionStorage.removeItem("adminName"); 
    sessionStorage.removeItem("adminEmail"); 
    sessionStorage.removeItem("adminId");
    sessionStorage.removeItem("adminRole"); 
     
     // Go to login 
     navigate("/admin/login", { replace: true, });
  };


  // ==========================================
  // SIDEBAR LINK
  // ==========================================

  const isActive = (path) => {
    return location.pathname === path;
  };


  return (
    <div className="admin-layout">


      {/* ======================================
          MOBILE OVERLAY
      ====================================== */}

      {sidebarOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}


      {/* ======================================
          SIDEBAR
      ====================================== */}

      <aside
        className={`admin-sidebar ${
          sidebarOpen ? "sidebar-open" : ""
        }`}
      >

        {/* Logo */}

        <div className="admin-sidebar-logo">

          <div className="admin-logo-icon">
            ◆
          </div>

          <div>
            <strong>
              Interior
            </strong>

            <span>
              Studio
            </span>
          </div>

        </div>


        {/* Close button mobile */}

        <button
          className="sidebar-close"
          onClick={() => setSidebarOpen(false)}
        >
          <FaTimes />
        </button>


        {/* Admin Profile */}

        <div className="admin-sidebar-profile">

          <div className="admin-profile-icon">
            <FaUserCircle />
          </div>

          <div>
            <strong>
              {adminName}
            </strong>

            <span>
              Administrator
            </span>
          </div>

        </div>


        {/* Navigation */}

        <div className="admin-navigation">

          <p className="admin-nav-title">
            MAIN MENU
          </p>


          {/* Dashboard */}

          <Link
            to="/admin/dashboard"
            className={
              isActive("/admin/dashboard")
                ? "admin-nav-link active"
                : "admin-nav-link"
            }
            onClick={() => setSidebarOpen(false)}
          >
            <FaTachometerAlt />

            <span>
              Dashboard
            </span>
          </Link>


          {/* Users */}

          <Link
            to="/admin/users"
            className={
              isActive("/admin/users")
                ? "admin-nav-link active"
                : "admin-nav-link"
            }
            onClick={() => setSidebarOpen(false)}
          >
            <FaUsers />

            <span>
              Users
            </span>
          </Link>


          {/* Events */}

          <Link
            to="/admin/projects"
            className={
              isActive("/admin/projects")
                ? "admin-nav-link active"
                : "admin-nav-link"
            }
            onClick={() => setSidebarOpen(false)}
          >
            <FaCalendarAlt />

            <span>
             Projects
            </span>
          </Link>


          {/* Gallery */}

          <Link
            to="/admin/gallery"
            className={
              isActive("/admin/gallery")
                ? "admin-nav-link active"
                : "admin-nav-link"
            }
            onClick={() => setSidebarOpen(false)}
          >
            <FaImages />

            <span>
              Gallery
            </span>
          </Link>

            {/* Services */}

              <Link
                to="/admin/services"
                className={
                  isActive("/admin/services")
                    ? "admin-nav-link active"
                    : "admin-nav-link"
                }
                onClick={() => setSidebarOpen(false)}
              >
                <FaConciergeBell />

                <span>
                  Services
                </span>
              </Link>
           {/* Categories */}

          <Link
            to="/admin/categories"
            className={
              isActive("/admin/categories")
                ? "admin-nav-link active"
                : "admin-nav-link"
            }
            onClick={() => setSidebarOpen(false)}
          >
            <FaList />

            <span>
              Categories
            </span>
          </Link>


          {/* Contacts */}

          <Link
            to="/admin/contacts"
            className={
              isActive("/admin/contacts")
                ? "admin-nav-link active"
                : "admin-nav-link"
            }
            onClick={() => setSidebarOpen(false)}
          >
            <FaEnvelope />

            <span>
              Contacts
            </span>
          </Link>

             {/* Menu */}

          <Link
            to="/admin/header_menu"
            className={
              isActive("/admin/header_menu")
                ? "admin-nav-link active"
                : "admin-nav-link"
            }
            onClick={() => setSidebarOpen(false)}
          >
            <FaEnvelope />

            <span>
              Header Menu
            </span>
          </Link>



              <Link
            to="/admin/bookings"
            className={
              isActive("/admin/bookings")
                ? "admin-nav-link active"
                : "admin-nav-link"
            }
            onClick={() => setSidebarOpen(false)}
          >
            <FaCalendarAlt />

            <span>
              Bookings
            </span>
          </Link>
        </div>

        


        {/* Logout */}

        <div className="admin-sidebar-bottom">

          <button
            className="admin-logout"
            onClick={logout}
          >
            <FaSignOutAlt />

            <span>
              Logout
            </span>
          </button>

        </div>

          
      </aside>


      {/* ======================================
          RIGHT SIDE
      ====================================== */}

      <div className="admin-main">


        {/* ====================================
            ADMIN HEADER
        ==================================== */}

        <header className="admin-header">

          <div className="admin-header-left">

            <button
              className="admin-menu-button"
              onClick={() =>
                setSidebarOpen(!sidebarOpen)
              }
            >
              {sidebarOpen ? (
                <FaTimes />
              ) : (
                <FaBars />
              )}
            </button>


            <div>

              <p>
                ADMIN PANEL
              </p>

              <h2>
                InteriorStudio
              </h2>

            </div>

          </div>


          {/* Header Right */}

          <div className="admin-header-right">

            <div className="admin-header-user">

              <FaUserCircle />

              <div>
                <strong>
                  {adminName}
                </strong>

                <span>
                  Administrator
                </span>
              </div>

            </div>

          </div>

        </header>


        {/* ====================================
            PAGE CONTENT
        ==================================== */}

        <main className="admin-content">

          <Outlet />

        </main>


      </div>

    </div>
  );
};

export default AdminLayout;
