import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// 🔒 2. Protect User Account Routes (Only Non-Admin Logged-in Users allowed)
 const UserProtectedRoute = () => {
  const token = localStorage.getItem("Token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/LogIn" replace />;
  }

  // If logged in as admin, block access and send to admin panel
  if (role && role.toLowerCase() === "admin") {
    return <Navigate to="/AdminCategory" replace />;
  }

  return <Outlet />;
};

export default UserProtectedRoute()