import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useSearchParams, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Search input state
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const isFirstRender = useRef(true);

  // Logout confirmation modal state
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Sync state if URL search query changes externally
  useEffect(() => {
    const currentQuery = searchParams.get("search") || "";
    if (currentQuery !== searchTerm) {
      setSearchTerm(currentQuery);
    }
  }, [searchParams]);

  // Debounced live search
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      const trimmed = searchTerm.trim();

      if (trimmed) {
        navigate(`/Products?search=${encodeURIComponent(trimmed)}`);
      } else {
        if (location.pathname.toLowerCase() === "/products" && searchParams.get("search")) {
          navigate("/Products", { replace: true });
        }
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleClear = () => {
    setSearchTerm("");
    if (location.pathname.toLowerCase() === "/products") {
      navigate("/Products", { replace: true });
    }
  };

  const confirmLogout = () => {
    localStorage.removeItem("Token");
    localStorage.removeItem("role");
    setShowLogoutModal(false);
    navigate("/LogIn");
  };

  return (
    <>
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

              {/* Live Search Input */}
              <li className="nav-item me-2">
                <div
                  className="search-wrapper homepage-search-wrapper"
                  style={{ position: "relative", display: "flex", alignItems: "center" }}
                >
                  <i
                    className="fa-solid fa-magnifying-glass fa-search"
                    style={{ position: "absolute", left: "12px", pointerEvents: "none" }}
                  ></i>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Search products..."
                    aria-label="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ paddingLeft: "36px", paddingRight: searchTerm ? "32px" : "12px" }}
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={handleClear}
                      style={{
                        position: "absolute",
                        right: "10px",
                        background: "transparent",
                        border: "none",
                        color: "#6c757d",
                        cursor: "pointer",
                        padding: 0,
                      }}
                      aria-label="Clear search"
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  )}
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

              {/* Trigger Confirmation Modal */}
              <li className="nav-item">
                <button
                  className="icon-btn homepage-icon-btn text-danger"
                  type="button"
                  aria-label="Log Out"
                  title="Log Out"
                  onClick={() => setShowLogoutModal(true)}
                >
                  <i className="fa-solid fa-right-from-bracket"></i>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal Overlay */}
      {showLogoutModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999999,
          }}
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            className="bg-white rounded-3 shadow p-4"
            style={{ width: "90%", maxWidth: "420px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex align-items-center gap-3 mb-3">
              <div
                className="d-flex align-items-center justify-content-center rounded-circle"
                style={{
                  width: "44px",
                  height: "44px",
                  backgroundColor: "#fee2e2",
                  color: "#dc2626",
                  flexShrink: 0,
                }}
              >
                <i className="fa-solid fa-right-from-bracket fs-5"></i>
              </div>
              <div>
                <h5 className="mb-0 fw-bold" style={{ color: "#043948" }}>
                  Confirm Sign Out
                </h5>
                <small className="text-muted">Are you sure you want to log out?</small>
              </div>
            </div>

            <p className="text-secondary small mb-4">
              You will need to sign back in to view your orders, access your cart, or make purchases.
            </p>

            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-light px-3 fw-semibold border"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger px-3 fw-semibold"
                onClick={confirmLogout}
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;