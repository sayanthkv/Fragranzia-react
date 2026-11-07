import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  LuLayoutDashboard,
  LuShoppingBag,
  LuList,
  LuUsers,
  LuShoppingCart,
  LuLogOut,
  LuMenu,
  LuX,
} from "react-icons/lu";
import "./AdminNavbar.css";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    sessionStorage.clear();
    toast.success("Logged out successfully");
    closeMobileMenu();
    navigate("/LogIn");
  };

  const navLinks = [
    { to: "/AdminDashboard", label: "Dashboard", icon: LuLayoutDashboard },
    { to: "/AdminProducts", label: "Products", icon: LuShoppingBag },
    { to: "/AdminCategory", label: "Categories", icon: LuList },
    { to: "/AdminCustomerdetails", label: "Customers", icon: LuUsers },
    { to: "/Adminorder", label: "Orders", icon: LuShoppingCart },
  ];

  return (
    <>
      {/* 📱 Mobile Top Header (Always visible on mobile) */}
      <header className="admin-mobile-topbar">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            type="button"
            className="admin-hamburger-btn"
            onClick={toggleMobileMenu}
            aria-label="Open menu"
          >
            <LuMenu size={24} />
          </button>
          <span className="admin-mobile-brand-title">Dashtar</span>
        </div>
      </header>

      {/* 🌫️ Dimmed Backdrop */}
      <div
        className={`admin-navbar-backdrop ${isMobileOpen ? "show" : ""}`}
        onClick={closeMobileMenu}
        aria-hidden="true"
      />

      {/* 🚪 Sidebar / Drawer */}
      <aside className={`admin-navbar ${isMobileOpen ? "open" : ""}`}>
        {/* Drawer Header with full name and mobile close icon */}
        <div className="admin-navbar-header">
          <div className="admin-navbar-brand">
            <h2>Dashtar</h2>
          </div>
          <button
            type="button"
            className="admin-drawer-close-btn"
            onClick={closeMobileMenu}
            aria-label="Close menu"
          >
            <LuX size={22} />
          </button>
        </div>

        {/* Navigation Items: Icon + Full Label */}
        <nav className="admin-navbar-buttons">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `admin-nav-item ${isActive ? "active" : ""}`
                }
              >
                <Icon className="admin-nav-icon" />
                <span className="admin-nav-label">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="admin-navbar-logout">
          <button
            type="button"
            className="admin-logout-btn"
            onClick={handleLogout}
          >
            <LuLogOut className="admin-nav-icon" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminNavbar;