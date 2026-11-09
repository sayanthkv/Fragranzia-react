import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      navigate(`/Products?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("Token");
    localStorage.removeItem("role");
    navigate("/LogIn");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light shadow-sm homepage-navbar sticky-top">
      <div className="container-fluid px-0">
        <span className="navbar-brand homepage-navbar-brand">
          <Link to="/">Fragranzia</Link>
        </span>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarContent">
          <ul className="navbar-nav align-items-center gap-2">
            <li className="nav-item">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `nav-link homepage-nav-link ${isActive ? "active" : ""}`
                }
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/Products"
                className={({ isActive }) =>
                  `nav-link homepage-nav-link ${isActive ? "active" : ""}`
                }
              >
                Products
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/Wishlist"
                className={({ isActive }) =>
                  `nav-link homepage-nav-link ${isActive ? "active" : ""}`
                }
              >
                Wishlist
              </NavLink>
            </li>
            <li className="nav-item me-3">
              <NavLink
                to="/About"
                className={({ isActive }) =>
                  `nav-link homepage-nav-link ${isActive ? "active" : ""}`
                }
              >
                About
              </NavLink>
            </li>

            <li className="nav-item me-2">
              <div className="search-wrapper homepage-search-wrapper">
                <i className="fa-solid fa-magnifying-glass fa-search"></i>
                <input
                  className="form-control"
                  type="search"
                  placeholder="Search Here"
                  aria-label="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleSearch}
                />
              </div>
            </li>

            {/* Cart NavLink */}
            <li className="nav-item">
              <NavLink
                to="/Cart"
                className={({ isActive }) =>
                  `icon-btn homepage-icon-btn ${isActive ? "active" : ""}`
                }
                aria-label="Cart"
              >
                <i className="fa-solid fa-cart-shopping"></i>
              </NavLink>
            </li>

            {/* Log Out Button (Replaced Notification Bell) */}
            

            {/* Profile NavLink */}
            <li className="nav-item">
              <NavLink
                to="/Profile"
                className={({ isActive }) =>
                  `icon-btn homepage-icon-btn ${isActive ? "active" : ""}`
                }
                aria-label="Profile"
              >
                <i className="fa-regular fa-user"></i>
              </NavLink>
            </li>

            <li className="nav-item">
              <button
                className="icon-btn homepage-icon-btn text-danger"
                type="button"
                aria-label="Log Out"
                title="Log Out"
                onClick={handleLogout}
              >
                <i className="fa-solid fa-right-from-bracket"></i>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;