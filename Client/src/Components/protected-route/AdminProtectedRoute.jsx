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



// 🚫 3. Protect Login/Signup Pages (Logged-in users/admins CANNOT access)
export const PublicOnlyRoute = () => {
  const token = localStorage.getItem("Token");
  const role = localStorage.getItem("role");

  if (token) {
    if (role && role.toLowerCase() === "admin") {
      return <Navigate to="/AdminCategory" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

// 🛍️ 4. Storefront Guard (Blocks Admins from viewing public user-facing store pages)
export const NonAdminRoute = () => {
  const token = localStorage.getItem("Token");
  const role = localStorage.getItem("role");

  if (token && role && role.toLowerCase() === "admin") {
    return <Navigate to="/AdminCategory" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;