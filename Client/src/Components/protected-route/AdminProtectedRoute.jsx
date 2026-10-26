import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// 🔒 1. Protect Admin Routes (Only Admins allowed)
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

// 🚫 2. Protect Login/Signup Pages (Logged-in users/admins CANNOT access)
export const PublicOnlyRoute = () => {
  const token = localStorage.getItem("Token");
  const role = localStorage.getItem("role");

  if (token) {
    if (role && role.toLowerCase() === "admin") {
      return <Navigate to="/AdminCategory" replace />;
    }
    return <Navigate to="/Profile" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;