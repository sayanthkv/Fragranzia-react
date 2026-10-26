import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminProtectedRoute = () => {
  const token = localStorage.getItem("Token");
  const role = localStorage.getItem("role");

  // Verify authentication and admin role
  if (!token || !role || role.toLowerCase() !== "admin") {
    return <Navigate to="/LogIn" replace />;
  }

  // Render the matched protected admin component directly
  return <Outlet />;
};

export default AdminProtectedRoute;