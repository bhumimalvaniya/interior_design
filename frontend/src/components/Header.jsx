
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Header.css";
import API_URL from "../config/api";

/* =========================================================
   API CONFIGURATION
   Local:
   http://localhost:9000/api/v1

   Production:
   https://interior-design-backend.onrender.com/api/v1
========================================================= */

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:9000/api/v1";


const Header = () => {
  const navigate = useNavigate();

  /* =======================================================
     MENU STATE
  ======================================================= */

  const [menus, setMenus] = useState([]);
  const [menuLoading, setMenuLoading] = useState(true);

  const [menuOpen, setMenuOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  /* =======================================================
     USER STATE
  ======================================================= */

  const [user, setUser] = useState(null);


  /* =======================================================
     LOAD USER
  ======================================================= */

  const loadUser = () => {
    try {
      const localUser = localStorage.getItem("userData");
      const sessionUser = sessionStorage.getItem("userData");

      const storedUser = localUser || sessionUser;

      if (!storedUser) {
        setUser(null);
        return;
      }

      const parsedUser = JSON.parse(storedUser);

      setUser(parsedUser);
    } catch (error) {
      console.error("HEADER USER ERROR:", error);

      setUser(null);
    }
  };


  /* =======================================================
     LOAD USER ONCE
  ======================================================= */

  useEffect(() => {
    loadUser();

    const handleStorageChange = () => {
      loadUser();
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };
  }, []);


  /* =======================================================
     CHECK USER WHEN PAGE/ROUTE CHANGES
     
     Custom event allows login/logout pages to immediately
     update the Header.
  ======================================================= */

  useEffect(() => {
    const handleUserChanged = () => {
      loadUser();
    };

    window.addEventListener(
      "userDataChanged",
      handleUserChanged
    );

    return () => {
      window.removeEventListener(
        "userDataChanged",
        handleUserChanged
      );
    };
  }, []);


  /* =======================================================
     FETCH ACTIVE HEADER MENUS
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    const fetchMenus = async () => {
      try {
        setMenuLoading(true);

        const url = `${API_URL}/header-menu/active`;

        const response = await axios.get(url, {
          timeout: 15000,
        });

        if (!mounted) return;

        const menuData = Array.isArray(response.data?.data)
          ? response.data.data
          : [];

        const sortedMenus = [...menuData].sort(
          (a, b) =>
            Number(a.order || 0) -
            Number(b.order || 0)
        );

        setMenus(sortedMenus);

        console.log(
          "ACTIVE HEADER MENUS:",
          sortedMenus
        );
      } catch (error) {
        if (!mounted) return;

        console.error(
          "FETCH HEADER MENUS ERROR:",
          error.response?.status,
          error.response?.data || error.message
        );

        /*
          Do not break the complete Header if the dynamic
          menu API is temporarily unavailable.
        */

        setMenus([]);
      } finally {
        if (mounted) {
          setMenuLoading(false);
        }
      }
    };

    fetchMenus();

    return () => {
      mounted = false;
    };
  }, []);


  /* =======================================================
     CLOSE ALL MENUS
  ======================================================= */

  const closeMenu = () => {
    setMenuOpen(false);
    setServiceOpen(false);
    setProjectOpen(false);
    setProfileOpen(false);
  };


  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("token");

    sessionStorage.removeItem("userData");
    sessionStorage.removeItem("token");

    setUser(null);

    closeMenu();

    window.dispatchEvent(
      new Event("userDataChanged")
    );

    navigate("/login");
  };


  /* =======================================================
     USER NAME
  ======================================================= */

  const getUserName = () => {
    if (!user) {
      return "Account";
    }

    return (
      user.name ||
      user.fnm ||
      user.username ||
      "Account"
    );
  };


  /* =======================================================
     USER AVATAR URL
     
     IMPORTANT:
     Never force localhost for production.
  ======================================================= */

  const getAvatarUrl = (avatar) => {
    if (!avatar) {
      return "";
    }

    /* Cloudinary / external URL */
    if (
      avatar.startsWith("http://") ||
      avatar.startsWith("https://")
    ) {
      return avatar;
    }

    /* Relative backend upload */
    if (avatar.startsWith("/")) {
      return `${API_URL.replace(
        "/api/v1",
        ""
      )}${avatar}`;
    }

    return `${API_URL.replace(
      "/api/v1",
      ""
    )}/${avatar}`;
  };


  const userAvatar = getAvatarUrl(
    user?.avatar
  );


  /* =======================================================
     ROOT MENUS
  ======================================================= */

  const rootMenus = menus
    .filter((menu) => {
      const parentId =
        menu.parentId?._id ||
        menu.parentId ||
        null;

      return (
        !parentId &&
        menu.status !== "inactive"
      );
    })
    .sort(
      (a, b) =>
        Number(a.order || 0) -
        Number(b.order || 0)
    );


  /* =======================================================
     CHILD MENUS
  ======================================================= */

  const getChildMenus = (parentId) => {
    return menus
      .filter((menu) => {
        const menuParentId =
          menu.parentId?._id ||
          menu.parentId ||
          null;

        return (
          String(menuParentId) ===
            String(parentId) &&
          menu.status !== "inactive"
        );
      })
      .sort(
        (a, b) =>
          Number(a.order || 0) -
          Number(b.order || 0)
      );
  };


  /* =======================================================
     CHECK CHILDREN
  ======================================================= */

  const hasChildren = (menu) => {
    return (
      getChildMenus(menu._id).length > 0
    );
  };


  /* =======================================================
     CHECK DROPDOWN
  ======================================================= */

  const isDropdown = (menu) => {
    return (
      menu.menuType === "dropdown" ||
      hasChildren(menu)
    );
  };


  /* =======================================================
     GET DROPDOWN STATE
  ======================================================= */

  const getDropdownState = (menu) => {
    const menuName =
      String(menu.name || "")
        .trim()
        .toLowerCase();

    if (menuName === "services") {
      return serviceOpen;
    }

    if (menuName === "projects") {
      return projectOpen;
    }

    return false;
  };


  /* =======================================================
     GET DROPDOWN SETTER
  ======================================================= */

  const getDropdownSetter = (menu) => {
    const menuName =
      String(menu.name || "")
        .trim()
        .toLowerCase();

    if (menuName === "services") {
      return setServiceOpen;
    }

    if (menuName === "projects") {
      return setProjectOpen;
    }

    return setServiceOpen;
  };


  /* =======================================================
     RENDER NORMAL MENU
  ======================================================= */

  const renderSingleMenu = (menu) => {
    const path =
      menu.path && menu.path !== "#"
        ? menu.path
        : "/";

    return (
      <Link
        key={menu._id}
        to={path}
        onClick={closeMenu}
      >
        {menu.name}
      </Link>
    );
  };


  /* =======================================================
     RENDER DROPDOWN MENU
  ======================================================= */

  const renderDropdownMenu = (menu) => {
    const children = getChildMenus(
      menu._id
    );

    const isOpen =
      getDropdownState(menu);

    const setOpen =
      getDropdownSetter(menu);

    const hasValidPath =
      menu.path &&
      menu.path !== "#";

    return (
      <div
        key={menu._id}
        className="nav-dropdown"
        onMouseEnter={() => {
          setOpen(true);
        }}
        onMouseLeave={() => {
          setOpen(false);
        }}
      >

        <button
          type="button"
          className="dropdown-btn"
          onClick={() => {
            setOpen(!isOpen);
          }}
        >
          {hasValidPath ? (
            <Link
              to={menu.path}
              className="dropdown-link"
              onClick={closeMenu}
            >
              {menu.name}

              <span className="dropdown-arrow">
                ⌄
              </span>
            </Link>
          ) : (
            <>
              <span>
                {menu.name}
              </span>

              <span className="dropdown-arrow">
                ⌄
              </span>
            </>
          )}
        </button>


        {isOpen && (
          <div className="dropdown-menu">

            {children.map((child) => {
              const childPath =
                child.path &&
                child.path !== "#"
                  ? child.path
                  : "/";

              return (
                <Link
                  key={child._id}
                  to={childPath}
                  onClick={closeMenu}
                >
                  {child.name}
                </Link>
              );
            })}

          </div>
        )}

      </div>
    );
  };


  /* =======================================================
     RENDER DYNAMIC MENU
  ======================================================= */

  const renderMenu = (menu) => {
    if (isDropdown(menu)) {
      return renderDropdownMenu(menu);
    }

    return renderSingleMenu(menu);
  };


  /* =======================================================
     HEADER UI
  ======================================================= */

  return (
    <header className="header">

      <div className="header-container">

        {/* =================================================
            LOGO
        ================================================= */}

        <Link
          to="/"
          className="logo"
          onClick={closeMenu}
        >
          <span className="logo-icon">
            ◆
          </span>

          <span>
            Interior
            <span className="logo-highlight">
              Studio
            </span>
          </span>
        </Link>


        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav
          className={`navbar ${
            menuOpen ? "active" : ""
          }`}
        >

          {/* DYNAMIC DATABASE MENUS */}

          {!menuLoading &&
            rootMenus.map((menu) =>
              renderMenu(menu)
            )}


          {/* =================================================
              FALLBACK
              
              If backend menu API is unavailable, show
              basic navigation instead of an empty header.
          ================================================= */}

          {!menuLoading &&
            rootMenus.length === 0 && (
              <>
                <Link
                  to="/"
                  onClick={closeMenu}
                >
                  Home
                </Link>

                <Link
                  to="/about"
                  onClick={closeMenu}
                >
                  About
                </Link>

                <Link
                  to="/services"
                  onClick={closeMenu}
                >
                  Services
                </Link>

                <Link
                  to="/projects"
                  onClick={closeMenu}
                >
                  Projects
                </Link>

                <Link
                  to="/gallery"
                  onClick={closeMenu}
                >
                  Gallery
                </Link>

                <Link
                  to="/contact"
                  onClick={closeMenu}
                >
                  Contact
                </Link>
              </>
            )}


          {/* =================================================
              MOBILE LOGIN
          ================================================= */}

          {!user && (
            <Link
              to="/login"
              className="mobile-login"
              onClick={closeMenu}
            >
              Login
            </Link>
          )}


          {/* =================================================
              MOBILE CONSULTATION
          ================================================= */}

          <Link
            to="/consultation"
            className="mobile-consultation"
            onClick={closeMenu}
          >
            Book Consultation
          </Link>

        </nav>


        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <div className="header-right">

          {/* SEARCH */}

          <Link
            to="/search"
            className="search-btn"
            onClick={closeMenu}
          >
            🔍
          </Link>


          {/* =================================================
              PROFILE
          ================================================= */}

          {user ? (

            <div
              className="profile-dropdown"
              onMouseEnter={() =>
                setProfileOpen(true)
              }
              onMouseLeave={() =>
                setProfileOpen(false)
              }
            >

              <button
                type="button"
                className="profile-btn"
                onClick={() =>
                  setProfileOpen(
                    !profileOpen
                  )
                }
              >

                {/* AVATAR */}

                {userAvatar ? (

                  <img
                    src={userAvatar}
                    alt={getUserName()}
                    className="header-avatar"
                    onError={(event) => {
                      event.currentTarget.style.display =
                        "none";
                    }}
                  />

                ) : (

                  <span className="header-user-icon">
                    👤
                  </span>

                )}


                {/* USER NAME */}

                <span className="profile-name">
                  {getUserName()}
                </span>

                <span className="profile-arrow">
                  ⌄
                </span>

              </button>


              {/* =================================================
                  PROFILE MENU
              ================================================= */}

              {profileOpen && (

                <div className="profile-menu">

                  <Link
                    to="/account"
                    onClick={closeMenu}
                  >
                    👤 My Account
                  </Link>


                  <Link
                    to="/setprofile"
                    onClick={closeMenu}
                  >
                    ⚙ Set Profile
                  </Link>


                  <Link
                    to="/change-password"
                    onClick={closeMenu}
                  >
                    🔒 Change Password
                  </Link>


                  <Link
                    to="/bookings"
                    onClick={closeMenu}
                  >
                    📋 My Bookings
                  </Link>


                  <button
                    type="button"
                    onClick={handleLogout}
                  >
                    ↪ Logout
                  </button>

                </div>

              )}

            </div>

          ) : (

            /* =================================================
               NOT LOGGED IN
            ================================================= */

            <Link
              to="/login"
              className="login-btn"
              onClick={closeMenu}
            >
              👤 Login
            </Link>

          )}


          {/* =================================================
              CONSULTATION
          ================================================= */}

          <Link
            to="/consultation"
            className="consult-btn"
            onClick={closeMenu}
          >
            Book Consultation
          </Link>

        </div>


        {/* =================================================
            MOBILE MENU BUTTON
        ================================================= */}

        <button
          type="button"
          className="menu-toggle"
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

      </div>

    </header>
  );
};


export default Header;

