
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const AdminProtectedRoute = () => {
  const location = useLocation();

  const token =
    sessionStorage.getItem("adminToken");

  const adminLoggedIn =
    sessionStorage.getItem("adminLoggedIn");

  // ==========================================
  // CHECK ADMIN LOGIN
  // ==========================================

  if (
    !token ||
    adminLoggedIn !== "true"
  ) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  // ==========================================
  // ADMIN AUTHENTICATED
  // ==========================================

  return <Outlet />;
};

export default AdminProtectedRoute;
