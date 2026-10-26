import React, { useState, useEffect, useMemo, useRef } from "react";
import "./Products.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Link } from "react-router-dom";
import UserService from "../../services/user-api-services/UserService";
import filter from "../../assets/filter.png";

const Products = () => {
  const {
    getProduct,
    Addproducttocart,
    addToWishlist,
    getWishlist,
    removeProductFromWishlist,
  } = UserService();

  const [Productsitems, setProductsitems] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(() => new Set());
  const [wishlistLoadingId, setWishlistLoadingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  // Search & Sorting States
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Panel & Filter States
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(10000);

  // Ref to handle click outside for auto-closing filter panel
  const filterRef = useRef(null);

  useEffect(() => {
    const loadProductsAndWishlist = async () => {
      try {
        const products = await getProduct();
        const items = Array.isArray(products) ? products : [];
        setProductsitems(items);

        if (items.length > 0) {
          const highestPrice = Math.max(
            ...items.map((item) => item.saleprice || item.price || 0)
          );
          setMaxPrice(highestPrice || 10000);
        }
      } catch (error) {
        console.error("Failed to load products:", error);
      }

      try {
        const response = await getWishlist();
        const wishlist = response?.wishlist || [];

        const savedIds = wishlist.map((item) =>
          String(item.productId || item.id || item._id)
        );

        setWishlistIds(new Set(savedIds));
      } catch (error) {
        console.error(
          "Failed to load wishlist:",
          error.response?.data || error.message
        );
      }
    };

    loadProductsAndWishlist();
  }, []);

  // Click outside detector to close the filter dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };

    if (isFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterOpen]);

  // Extract unique categories dynamically
  const categories = useMemo(() => {
    const unique = new Set();
    Productsitems.forEach((item) => {
      const catName =
        typeof item.category === "object"
          ? item.category?.name
          : item.category;
      if (catName) unique.add(catName);
    });
    return ["All", ...Array.from(unique)];
  }, [Productsitems]);

  // Absolute max price calculated from data
  const absoluteMaxPrice = useMemo(() => {
    if (Productsitems.length === 0) return 10000;
    return Math.max(
      ...Productsitems.map((item) => item.saleprice || item.price || 0)
    );
  }, [Productsitems]);

  // Computed filtered & sorted list
  const processedProducts = useMemo(() => {
    let result = [...Productsitems];

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (product) =>
          product.name?.toLowerCase().includes(term) ||
          product.description?.toLowerCase().includes(term)
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter((product) => {
        const catName =
          typeof product.category === "object"
            ? product.category?.name
            : product.category;
        return catName === selectedCategory;
      });
    }

    result = result.filter(
      (product) => (product.saleprice || product.price || 0) <= maxPrice
    );

    switch (sortBy) {
      case "lowToHigh":
        result.sort((a, b) => (a.saleprice || 0) - (b.saleprice || 0));
        break;
      case "highToLow":
        result.sort((a, b) => (b.saleprice || 0) - (a.saleprice || 0));
        break;
      case "newest":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "popularity":
        result.sort((a, b) => (b.quantity || 0) - (a.quantity || 0));
        break;
      default:
        break;
    }

    return result;
  }, [Productsitems, searchTerm, sortBy, selectedCategory, maxPrice]);

  const resetFilters = () => {
    setSelectedCategory("All");
    setMaxPrice(absoluteMaxPrice);
  };

  const Addtocart = async (id) => {
    try {
      const response = await Addproducttocart(id);
      alert(response.message || "Product added to cart successfully!");
    } catch (error) {
      console.error(
        "Add to cart error:",
        error.response?.data || error.message
      );

      if (error.response?.status === 401) {
        alert("Please login to add products to your cart.");
      } else {
        alert(
          error.response?.data?.message || "Unable to add product to cart."
        );
      }
    }
  };

  const addTotheWishlist = async (productId) => {
    const id = String(productId);

    if (wishlistLoadingId !== null) return;

    const alreadyFavorite = wishlistIds.has(id);

    try {
      setWishlistLoadingId(id);
      setErrorMessage("");
      setActionMessage("");

      if (alreadyFavorite) {
        await removeProductFromWishlist(id);

        setWishlistIds((previous) => {
          const updated = new Set(previous);
          updated.delete(id);
          return updated;
        });

        setActionMessage("Product removed from wishlist.");
      } else {
        await addToWishlist(id);

        setWishlistIds((previous) => {
          const updated = new Set(previous);
          updated.add(id);
          return updated;
        });

        setActionMessage("Product added to wishlist.");
      }
    } catch (error) {
      console.error(
        "Wishlist error:",
        error.response?.data || error.message
      );

      setErrorMessage(
        error.response?.data?.message ||
          "Unable to update wishlist. Please try again."
      );
    } finally {
      setWishlistLoadingId(null);
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light shadow-sm homepage-navbar">
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

          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarContent"
          >
            <ul className="navbar-nav align-items-center gap-2">
              <li className="nav-item">
                <span className="nav-link homepage-nav-link">
                  <Link to="/">Home</Link>
                </span>
              </li>

              <li className="nav-item">
                <span className="nav-link active homepage-nav-link">
                  <Link to="/Products">Products</Link>
                </span>
              </li>

              <li className="nav-item">
                <span className="nav-link homepage-nav-link">
                  <Link to="/Wishlist">Wishlist</Link>
                </span>
              </li>

              <li className="nav-item me-3">
                <span className="nav-link homepage-nav-link">
                  <Link to="/About">About</Link>
                </span>
              </li>

              <li className="nav-item me-2">
                <div className="search-wrapper homepage-search-wrapper">
                  <i className="fa-solid fa-magnifying-glass fa-search"></i>
                  <input
                    className="form-control"
                    type="search"
                    placeholder="Search Here"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label="Search"
                  />
                </div>
              </li>

              <li className="nav-item">
                <span className="icon-btn homepage-icon-btn" aria-label="Cart">
                  <Link to="/Cart">
                    <i className="fa-solid fa-cart-shopping"></i>
                  </Link>
                </span>
              </li>

              <li className="nav-item">
                <button
                  className="icon-btn homepage-icon-btn"
                  type="button"
                  aria-label="Notifications"
                >
                  <i className="fa-regular fa-bell"></i>
                </button>
              </li>

              <li className="nav-item">
                <span className="icon-btn homepage-icon-btn" aria-label="Profile">
                  <Link to="/Profile">
                    <i className="fa-regular fa-user"></i>
                  </Link>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <section className="festive-banner homepage-festive-banner">
        <span>
          <b>ENJOY FESTIVE DISCOUNTS! FREE SHIPPING ABOVE 999 !</b>
        </span>
      </section>

      <section className="productpage-section mx-3 mx-md-5 my-4">
        <div className="productpage-header-row d-flex flex-wrap align-items-center justify-content-between mb-4 position-relative">
          <div className="productpage-product-head">
            <h3 className="productpage-title">All Products</h3>
            <p className="productpage-breadcrumb">Home &gt; Products</p>
          </div>

          <div className="productpage-filteropt position-relative" ref={filterRef}>
            <ul className="productpage-filter-list">
              <li className="productpage-filter-label">Sort By:</li>
              <li
                className={`productpage-filter-item ${
                  sortBy === "newest" ? "productpage-filter-active" : ""
                }`}
                onClick={() => setSortBy("newest")}
                style={{ cursor: "pointer" }}
              >
                Newest First
              </li>
              <li
                className={`productpage-filter-item ${
                  sortBy === "popularity" ? "productpage-filter-active" : ""
                }`}
                onClick={() => setSortBy("popularity")}
                style={{ cursor: "pointer" }}
              >
                Popularity
              </li>
              <li
                className={`productpage-filter-item ${
                  sortBy === "lowToHigh" ? "productpage-filter-active" : ""
                }`}
                onClick={() => setSortBy("lowToHigh")}
                style={{ cursor: "pointer" }}
              >
                Price--Low to High
              </li>
              <li
                className={`productpage-filter-item ${
                  sortBy === "highToLow" ? "productpage-filter-active" : ""
                }`}
                onClick={() => setSortBy("highToLow")}
                style={{ cursor: "pointer" }}
              >
                Price--High to Low
              </li>
              <li className="productpage-filter-item">
                <button
                  className="productpage-filterbtn"
                  type="button"
                  onClick={() => setIsFilterOpen((prev) => !prev)}
                >
                  <img
                    src={filter}
                    alt=""
                    className="productpage-filter-icon"
                  />
                  Filter {isFilterOpen ? "▲" : "▼"}
                </button>
              </li>
            </ul>

            {/* Sliding Filter Dropdown Panel (Anchored to Left with start-0) */}
            {isFilterOpen && (
              <div className="filter-sliding-panel shadow p-3 bg-white rounded position-absolute start-0 mt-2">
                <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                  <h6 className="fw-bold mb-0">Refine Products</h6>
                  <button
                    type="button"
                    className="btn btn-sm btn-link text-decoration-none p-0 text-danger"
                    onClick={resetFilters}
                  >
                    Clear All
                  </button>
                </div>

                {/* Category Filter */}
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Category</label>
                  <select
                    className="form-select form-select-sm"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map((cat, idx) => (
                      <option key={idx} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Filter Slider */}
                <div className="mb-2">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label fw-semibold small mb-0">
                      Max Price
                    </label>
                    <span className="small text-muted fw-bold">
                      Rs {maxPrice}
                    </span>
                  </div>
                  <input
                    type="range"
                    className="form-range"
                    min="0"
                    max={absoluteMaxPrice}
                    step="50"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                  />
                  <div className="d-flex justify-content-between small text-muted">
                    <span>Rs 0</span>
                    <span>Rs {absoluteMaxPrice}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section>
        {actionMessage && (
          <div className="alert alert-success mx-3 mx-md-5" role="status">
            {actionMessage}
          </div>
        )}

        {errorMessage && (
          <div className="alert alert-danger mx-3 mx-md-5" role="alert">
            {errorMessage}
          </div>
        )}

        <div className="productpage-row row g-4 justify-content-center justify-content-lg-between mb-4">
          {processedProducts.length > 0 ? (
            processedProducts.map((products) => {
              const productId = String(products._id);
              const isFavorite = wishlistIds.has(productId);

              return (
                <div
                  className="productpage-col col-12 col-md-6 col-lg-4 d-flex justify-content-center"
                  key={products._id}
                >
                  <div className="productpage-card card bg-transparent">
                    <Link
                      to={`/SpecificProduct/${products._id}`}
                      className="text-decoration-none"
                    >
                      <img
                        className="productpage-product-img"
                        src={`http://localhost:5000/uploads/${products.image}`}
                        alt={products.name}
                      />
                    </Link>

                    <div className="productpage-card-body card-body px-0">
                      <div className="d-flex justify-content-between align-items-center gap-2">
                        <Link
                          to={`/SpecificProduct/${products._id}`}
                          className="text-decoration-none text-dark"
                        >
                          <h5 className="productpage-card-title card-title mb-0">
                            {products.name}
                          </h5>
                        </Link>

                        <button
                          type="button"
                          className="products-wishlist-btn"
                          onClick={() => addTotheWishlist(productId)}
                          disabled={wishlistLoadingId !== null}
                          aria-label={
                            isFavorite
                              ? "Remove from wishlist"
                              : "Add to wishlist"
                          }
                          aria-pressed={isFavorite}
                        >
                          <i
                            className={
                              isFavorite
                                ? "bi bi-heart-fill"
                                : "bi bi-heart"
                            }
                            style={{
                              color: isFavorite ? "#e63946" : "#555",
                            }}
                          ></i>
                        </button>
                      </div>

                      <p className="productpage-card-text card-text mt-2">
                        <span className="productpage-price">
                          Rs {products.saleprice}
                        </span>

                        <span className="productpage-old-price">
                          <s>Rs {products.price}</s>
                        </span>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => Addtocart(products._id)}
                      className="btn-add-cart homepage-btn-add-cart"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-5">
              <h5>No products matching your search criteria.</h5>
            </div>
          )}
        </div>

        <div className="productpage-loadmore d-flex justify-content-center my-5">
          <button type="button" className="productpage-loadmore-btn">
            Load More
          </button>
        </div>
      </section>

      <footer className="py-5 mt-5 homepage-footer">
        <div className="container">
          <div className="row g-4 align-items-start">
            <div className="col-12 col-md-3 pt-5 mt-4">
              <h1
                className="homepage-footer-brand"
                style={{ color: "#043948" }}
              >
                <b>Fragranzia</b>
              </h1>
            </div>

            <div className="col-12 col-md-9">
              <div className="row g-4">
                <div className="col-6 col-sm-4">
                  <h5
                    className="homepage-footer-heading"
                    style={{ color: "#043948" }}
                  >
                    <b>Pages</b>
                  </h5>

                  <ul className="list list-unstyled lh-lg homepage-footer-list">
                    <li><span><Link to="/">Home</Link></span></li>
                    <li><span><Link to="/Products">Products</Link></span></li>
                    <li><span><Link to="/Gifting">Gifting</Link></span></li>
                    <li><span><Link to="/About">About</Link></span></li>
                    <li><span><Link to="/Profile">Profile</Link></span></li>
                  </ul>
                </div>

                <div className="col-6 col-sm-4">
                  <h5
                    className="homepage-footer-heading"
                    style={{ color: "#043948" }}
                  >
                    <b>Quick Links</b>
                  </h5>

                  <ul className="list-unstyled lh-lg homepage-footer-list">
                    <li><a href="privacy.html">Privacy Policy</a></li>
                    <li><a href="terms.html">Terms and Conditions</a></li>
                    <li><a href="faqs.html">FAQs</a></li>
                    <li><a href="customer-service.html">Customer Services</a></li>
                  </ul>
                </div>

                <div className="col-12 col-sm-4">
                  <h5
                    className="homepage-footer-heading"
                    style={{ color: "#043948" }}
                  >
                    <b>Contact & Social</b>
                  </h5>

                  <p className="mb-1 homepage-footer-contact">
                    <i className="fa-regular fa-envelope me-2"></i>
                    ftrafurniture@gmail.com
                  </p>

                  <p className="mb-3 homepage-footer-contact">
                    <i className="fa-solid fa-phone me-2"></i>
                    +91 9876543210
                  </p>

                  <p className="mb-2 homepage-footer-social-title">
                    <b>Social Media</b>
                  </p>

                  <div className="d-flex gap-3 homepage-footer-social-icons">
                    <i className="fa-brands fa-instagram fa-lg"></i>
                    <i className="fa-brands fa-facebook fa-lg"></i>
                    <i className="fa-brands fa-x-twitter fa-lg"></i>
                    <i className="fa-brands fa-youtube fa-lg"></i>
                    <i className="fa-brands fa-linkedin fa-lg"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr className="my-4 homepage-footer-divider" />

          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
            <ul className="d-flex list-unstyled gap-3 mb-0 flex-wrap justify-content-center homepage-footer-bottom-links">
              <li>Web Accessibility</li>
              <li>Terms of Use</li>
              <li>Privacy Statement</li>
              <li>Contact Us</li>
            </ul>

            <div className="text-muted text-center text-md-end small homepage-footer-copyright">
              © 2024 fragranzia Company. All rights reserved
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Products;