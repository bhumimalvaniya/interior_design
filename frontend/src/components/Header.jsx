// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "./Header.css";

// const Header = () => {
//   const navigate = useNavigate();

//   const [menuOpen, setMenuOpen] = useState(false);
//   const [serviceOpen, setServiceOpen] = useState(false);
//   const [projectOpen, setProjectOpen] = useState(false);
//   const [profileOpen, setProfileOpen] = useState(false);

//   // =====================================================
//   // USER DATA
//   // =====================================================

//   const [user, setUser] = useState(null);

//   // =====================================================
//   // GET USER FROM STORAGE
//   // =====================================================

//   const loadUser = () => {
//     try {
//       const storedUser =
//         localStorage.getItem("userData") ||
//         sessionStorage.getItem("userData");

//       if (storedUser) {
//         const parsedUser = JSON.parse(storedUser);

//         console.log("Header User:", parsedUser);

//         setUser(parsedUser);
//       } else {
//         setUser(null);
//       }
//     } catch (error) {
//       console.error("Error reading userData:", error);
//       setUser(null);
//     }
//   };

//   // =====================================================
//   // LOAD USER WHEN HEADER OPENS
//   // =====================================================

//   useEffect(() => {
//     loadUser();

//     // Listen for storage changes
//     const handleStorageChange = () => {
//       loadUser();
//     };

//     window.addEventListener(
//       "storage",
//       handleStorageChange
//     );

//     return () => {
//       window.removeEventListener(
//         "storage",
//         handleStorageChange
//       );
//     };
//   }, []);

//   // =====================================================
//   // CHECK USER WHEN ROUTE CHANGES / HEADER UPDATES
//   // =====================================================

//   useEffect(() => {
//     const interval = setInterval(() => {
//       loadUser();
//     }, 500);

//     return () => clearInterval(interval);
//   }, []);

//   // =====================================================
//   // CLOSE MENU
//   // =====================================================

//   const closeMenu = () => {
//     setMenuOpen(false);
//     setServiceOpen(false);
//     setProjectOpen(false);
//     setProfileOpen(false);
//   };

//   // =====================================================
//   // LOGOUT
//   // =====================================================

//   const handleLogout = () => {
//     localStorage.removeItem("userData");
//     localStorage.removeItem("token");

//     sessionStorage.removeItem("userData");
//     sessionStorage.removeItem("token");

//     setUser(null);

//     closeMenu();

//     navigate("/login");
//   };

//   // =====================================================
//   // USER NAME
//   // =====================================================

//   const getUserName = () => {
//     if (!user) {
//       return "Account";
//     }

//     return (
//       user.name ||
//       user.fnm ||
//       user.username ||
//       "Account"
//     );
//   };

//   // =====================================================
//   // USER AVATAR
//   // =====================================================

//   const getAvatarUrl = (avatar) => {
//     if (!avatar) {
//       return "";
//     }

//     if (
//       avatar.startsWith("http://") ||
//       avatar.startsWith("https://")
//     ) {
//       return avatar;
//     }

//     if (avatar.startsWith("/")) {
//       return `http://localhost:9000${avatar}`;
//     }

//     return `http://localhost:9000/${avatar}`;
//   };

//   const userAvatar = getAvatarUrl(user?.avatar);

//   // =====================================================
//   // UI
//   // =====================================================

//   return (
//     <header className="header">

//       <div className="header-container">

//         {/* =================================================
//             LOGO
//         ================================================= */}

//         <Link
//           to="/"
//           className="logo"
//           onClick={closeMenu}
//         >
//           <span className="logo-icon">
//             ◆
//           </span>

//           <span>
//             Interior
//             <span className="logo-highlight">
//               Studio
//             </span>
//           </span>
//         </Link>


//         {/* =================================================
//             DESKTOP / MOBILE NAVIGATION
//         ================================================= */}

//         <nav
//           className={`navbar ${
//             menuOpen ? "active" : ""
//           }`}
//         >

//           {/* HOME */}

//           <Link
//             to="/"
//             onClick={closeMenu}
//           >
//             Home
//           </Link>


//           {/* ABOUT */}

//           <Link
//             to="/about"
//             onClick={closeMenu}
//           >
//             About
//           </Link>


//           {/* =================================================
//               SERVICES DROPDOWN
//           ================================================= */}

//           <div
//             className="nav-dropdown"
//             onMouseEnter={() =>
//               setServiceOpen(true)
//             }
//             onMouseLeave={() =>
//               setServiceOpen(false)
//             }
//           >

//             <button
//               className="dropdown-btn"
//               onClick={() =>
//                 setServiceOpen(!serviceOpen)
//               }
//             >
//               <Link
//                 to="/services"
//                 className="dropdown-btn"
//                 onClick={closeMenu}
//               >
//                 Services <span>⌄</span>
//               </Link>
//             </button>


//             {serviceOpen && (

//               <div className="dropdown-menu">

//                 <Link
//                   to="/services/living-room"
//                   onClick={closeMenu}
//                 >
//                   Living Room
//                 </Link>

//                 <Link
//                   to="/services/bedroom"
//                   onClick={closeMenu}
//                 >
//                   Bedroom
//                 </Link>

//                 <Link
//                   to="/services/kitchen"
//                   onClick={closeMenu}
//                 >
//                   Kitchen
//                 </Link>

//                 <Link
//                   to="/services/office"
//                   onClick={closeMenu}
//                 >
//                   Office Interior
//                 </Link>

//                 <Link
//                   to="/services/commercial"
//                   onClick={closeMenu}
//                 >
//                   Commercial Interior
//                 </Link>

               

//               </div>

//             )}

//           </div>


//           {/* =================================================
//               PROJECTS DROPDOWN
//           ================================================= */}

//           <div
//             className="nav-dropdown"
//             onMouseEnter={() =>
//               setProjectOpen(true)
//             }
//             onMouseLeave={() =>
//               setProjectOpen(false)
//             }
//           >

//             <button
//               className="dropdown-btn"
//               onClick={() =>
//                 setProjectOpen(!projectOpen)
//               }
//             >

//               <Link
//                 to="/projects"
//                 className="dropdown-btn"
//                 onClick={closeMenu}
//               >
//                 Projects <span>⌄</span>
//               </Link>

//             </button>


//             {projectOpen && (

//               <div className="dropdown-menu">

//                 <Link
//                   to="/projects/residential"
//                   onClick={closeMenu}
//                 >
//                   Residential
//                 </Link>

//                 <Link
//                   to="/projects/commercial2"
//                   onClick={closeMenu}
//                 >
//                   Commercial
//                 </Link>


//                 <Link
//                   to="/projects/completed"
//                   onClick={closeMenu}
//                 >
//                   Completed Projects
//                 </Link>

//               </div>

//             )}

//           </div>


//           {/* GALLERY */}

//           <Link
//             to="/gallery"
//             onClick={closeMenu}
//           >
//             Gallery
//           </Link>


//           {/* CONTACT */}

//           <Link
//             to="/contact"
//             onClick={closeMenu}
//           >
//             Contact
//           </Link>


//           {/* =================================================
//               MOBILE LOGIN
//           ================================================= */}

//           {!user && (

//             <Link
//               to="/login"
//               className="mobile-login"
//               onClick={closeMenu}
//             >
//               Login
//             </Link>

//           )}


//           {/* =================================================
//               MOBILE CONSULTATION
//           ================================================= */}

//           <Link
//             to="/consultation"
//             className="mobile-consultation"
//             onClick={closeMenu}
//           >
//             Book Consultation
//           </Link>

//         </nav>


//         {/* =================================================
//             RIGHT SIDE
//         ================================================= */}

//         <div className="header-right">

//           {/* SEARCH */}

//           <Link
//             to="/search"
//             className="search-btn"
//           >
//             🔍
//           </Link>


//           {/* =================================================
//               PROFILE DROPDOWN
//           ================================================= */}

//           {user ? (

//             <div
//               className="profile-dropdown"
//               onMouseEnter={() =>
//                 setProfileOpen(true)
//               }
//               onMouseLeave={() =>
//                 setProfileOpen(false)
//               }
//             >

//               <button
//                 className="profile-btn"
//                 onClick={() =>
//                   setProfileOpen(!profileOpen)
//                 }
//               >

//                 {/* USER AVATAR */}

//                 {userAvatar ? (

//                   <img
//                     src={userAvatar}
//                     alt={getUserName()}
//                     className="header-avatar"
//                     onError={(e) => {
//                       e.currentTarget.style.display =
//                         "none";
//                     }}
//                   />

//                 ) : (

//                   <span className="header-user-icon">
//                     👤
//                   </span>

//                 )}


//                 {/* USERNAME */}

//                 <span>
//                   {getUserName()}
//                 </span>

//                 <span>
//                   ⌄
//                 </span>

//               </button>


//               {/* =================================================
//                   PROFILE MENU
//               ================================================= */}

//               {profileOpen && (

//                 <div className="profile-menu">

//                   <Link
//                     to="/account"
//                     onClick={closeMenu}
//                   >
//                     👤 My Account
//                   </Link>


//                   <Link
//                     to="/setprofile"
//                     onClick={closeMenu}
//                   >
//                     ⚙ Set Profile
//                   </Link>


//                   <Link
//                     to="/change-password"
//                     onClick={closeMenu}
//                   >
//                     🔒 Change Password
//                   </Link>


//                   <Link
//                     to="/bookings"
//                     onClick={closeMenu}
//                   >
//                     📋 My Bookings
//                   </Link>


//                   <button
//                     onClick={handleLogout}
//                   >
//                     ↪ Logout
//                   </button>

//                 </div>

//               )}

//             </div>

//           ) : (

//             /* =================================================
//                NOT LOGGED IN
//             ================================================= */

//             <Link
//               to="/login"
//               className="login-btn"
//             >
//               👤 Login
//             </Link>

//           )}


//           {/* =================================================
//               CONSULTATION
//           ================================================= */}

//           <Link
//             to="/consultation"
//             className="consult-btn"
//           >
//             Book Consultation
//           </Link>

//         </div>


//         {/* =================================================
//             MOBILE MENU BUTTON
//         ================================================= */}

//         <button
//           className="menu-toggle"
//           onClick={() =>
//             setMenuOpen(!menuOpen)
//           }
//         >
//           {menuOpen ? "✕" : "☰"}
//         </button>

//       </div>

//     </header>
//   );
// };

// export default Header;

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Header.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:9000/api/v1";

const Header = () => {
  const navigate = useNavigate();

  // =====================================================
  // MENU STATES
  // =====================================================

  const [menus, setMenus] = useState([]);
  const [menuLoading, setMenuLoading] = useState(true);

  const [menuOpen, setMenuOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // =====================================================
  // USER DATA
  // =====================================================

  const [user, setUser] = useState(null);

  // =====================================================
  // FETCH ACTIVE HEADER MENUS
  // =====================================================

  const fetchMenus = async () => {
    try {
      setMenuLoading(true);

      const response = await axios.get(
        `${API_URL}/header-menu/active`
      );

      console.log("ACTIVE HEADER MENUS:", response.data);

      const menuData = response.data?.data || [];

      // Sort by order
      const sortedMenus = [...menuData].sort(
        (a, b) =>
          Number(a.order || 0) -
          Number(b.order || 0)
      );

      setMenus(sortedMenus);
    } catch (error) {
      console.error(
        "FETCH HEADER MENUS ERROR:",
        error.response?.data || error.message
      );

      setMenus([]);
    } finally {
      setMenuLoading(false);
    }
  };

  // =====================================================
  // LOAD MENUS
  // =====================================================

  useEffect(() => {
    fetchMenus();
  }, []);

  // =====================================================
  // GET USER FROM STORAGE
  // =====================================================

  const loadUser = () => {
    try {
      const storedUser =
        localStorage.getItem("userData") ||
        sessionStorage.getItem("userData");

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);

        console.log("Header User:", parsedUser);

        setUser(parsedUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error(
        "Error reading userData:",
        error
      );

      setUser(null);
    }
  };

  // =====================================================
  // LOAD USER
  // =====================================================

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

  // =====================================================
  // CHECK USER
  // =====================================================

  useEffect(() => {
    const interval = setInterval(() => {
      loadUser();
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // =====================================================
  // CLOSE ALL MENUS
  // =====================================================

  const closeMenu = () => {
    setMenuOpen(false);
    setServiceOpen(false);
    setProjectOpen(false);
    setProfileOpen(false);
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("token");

    sessionStorage.removeItem("userData");
    sessionStorage.removeItem("token");

    setUser(null);

    closeMenu();

    navigate("/login");
  };

  // =====================================================
  // USER NAME
  // =====================================================

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

  // =====================================================
  // USER AVATAR
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
      return `http://localhost:9000${avatar}`;
    }

    return `http://localhost:9000/${avatar}`;
  };

  const userAvatar = getAvatarUrl(
    user?.avatar
  );

  // =====================================================
  // GET ROOT MENUS
  // =====================================================

  const rootMenus = menus.filter(
    (menu) =>
      !menu.parentId &&
      menu.menuType !== "child"
  );

  // =====================================================
  // GET CHILD MENUS
  // =====================================================

  const getChildMenus = (parentId) => {
    return menus
      .filter((menu) => {
        const menuParentId =
          menu.parentId?._id ||
          menu.parentId;

        return (
          String(menuParentId) ===
          String(parentId)
        );
      })
      .sort(
        (a, b) =>
          Number(a.order || 0) -
          Number(b.order || 0)
      );
  };

  // =====================================================
  // FIND CHILD MENUS
  // =====================================================

  const hasChildren = (menu) => {
    return getChildMenus(menu._id).length > 0;
  };

  // =====================================================
  // CHECK DROPDOWN
  // =====================================================

  const isDropdown = (menu) => {
    return (
      menu.menuType === "dropdown" ||
      hasChildren(menu)
    );
  };

  // =====================================================
  // RENDER SINGLE MENU
  // =====================================================

  const renderSingleMenu = (menu) => {
    return (
      <Link
        key={menu._id}
        to={menu.path || "/"}
        onClick={closeMenu}
      >
        {menu.name}
      </Link>
    );
  };

  // =====================================================
  // RENDER DROPDOWN MENU
  // =====================================================

  const renderDropdownMenu = (
    menu,
    dropdownClass,
    isOpen,
    setOpen
  ) => {
    const children = getChildMenus(
      menu._id
    );

    return (
      <div
        key={menu._id}
        className="nav-dropdown"
        onMouseEnter={() =>
          setOpen(true)
        }
        onMouseLeave={() =>
          setOpen(false)
        }
      >
        <button
          type="button"
          className="dropdown-btn"
          onClick={() =>
            setOpen(!isOpen)
          }
        >
          {menu.path &&
          menu.path !== "#" ? (
            <Link
              to={menu.path}
              className="dropdown-link"
              onClick={closeMenu}
            >
              {menu.name}
              <span>⌄</span>
            </Link>
          ) : (
            <>
              {menu.name}
              <span>⌄</span>
            </>
          )}
        </button>

        {isOpen && (
          <div className="dropdown-menu">
            {children.map((child) => (
              <Link
                key={child._id}
                to={child.path || "#"}
                onClick={closeMenu}
              >
                {child.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  // =====================================================
  // RENDER MENU
  // =====================================================

  const renderMenu = (menu) => {
    if (isDropdown(menu)) {
      return renderDropdownMenu(
        menu,
        menu.name,
        menu.name === "Services"
          ? serviceOpen
          : projectOpen,
        menu.name === "Services"
          ? setServiceOpen
          : setProjectOpen
      );
    }

    return renderSingleMenu(menu);
  };

  // =====================================================
  // UI
  // =====================================================

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

          {/* ===============================================
              DYNAMIC MENUS
          =============================================== */}

          {!menuLoading &&
            rootMenus.map((menu) =>
              renderMenu(menu)
            )}

          {/* ===============================================
              MOBILE LOGIN
          =============================================== */}

          {!user && (
            <Link
              to="/login"
              className="mobile-login"
              onClick={closeMenu}
            >
              Login
            </Link>
          )}

          {/* ===============================================
              MOBILE CONSULTATION
          =============================================== */}

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

                {userAvatar ? (

                  <img
                    src={userAvatar}
                    alt={getUserName()}
                    className="header-avatar"
                    onError={(e) => {
                      e.currentTarget.style.display =
                        "none";
                    }}
                  />

                ) : (

                  <span className="header-user-icon">
                    👤
                  </span>

                )}

                <span>
                  {getUserName()}
                </span>

                <span>⌄</span>

              </button>

              {/* PROFILE MENU */}

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
        >
          {menuOpen ? "✕" : "☰"}
        </button>

      </div>

    </header>
  );
};

export default Header;
