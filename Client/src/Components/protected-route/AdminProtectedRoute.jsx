import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// 🔒 1. Protect Admin Routes (Only Admins allowed)
const AdminProtectedRoute = () => {
  const token = localStorage.getItem("Token");
  const role = localStorage.getItem("role");

  if (!token || !role || role.toLowerCase() !== "admin") {
    return <Navigate to="/LogIn" replace />;
  }

  return <Outlet />;
};

// 🔒 2. Protect User Account Routes (Only Logged-in Users/Admins allowed)
export const UserProtectedRoute = () => {
  const token = localStorage.getItem("Token");

  if (!token) {
    return <Navigate to="/LogIn" replace />;
  }

  return <Outlet />;
};

// 🚫 3. Protect Login/Signup Pages (Logged-in users/admins CANNOT access)
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