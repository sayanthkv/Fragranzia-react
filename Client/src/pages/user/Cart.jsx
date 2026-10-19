import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Cart.css";

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import UserService from "../../services/user-api-services/UserService";

const Cart = () => {
  const { getCart, removeProductFromCart, updateCartQuantity } = UserService();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const formatPrice = (amount) =>
    Number(amount || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });

  // Normalize cart data received from the backend
  const normalizeCartItem = (item) => {
    const product = item.product || {};
    const quantity = Math.max(1, Number(item.quantity || 1));

    const price = Number(
      item.price ?? product.price ?? product.saleprice ?? 0
    );

    const originalPrice = Number(
      item.originalPrice ??
        product.originalPrice ??
        product.saleprice ??
        price
    );

    const discountPercent =
      originalPrice > 0 && originalPrice > price
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : 0;

    return {
      ...item,
      product,
      id: String(product._id || item.id || item._id || ""),
      quantity,
      price,
      originalPrice,
      discountPercent,
    };
  };

  // Fetch the user's cart
  const fetchCart = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await getCart();
      const items = Array.isArray(response?.cart) ? response.cart : [];

      setCartItems(items.map(normalizeCartItem));
    } catch (error) {
      console.error(
        "Failed to fetch cart:",
        error.response?.data || error.message
      );

      setErrorMessage(
        error.response?.status === 401
          ? "Please log in to view your cart."
          : "Unable to load your cart. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Update quantity in local state and synchronize with backend
  const handleQuantityChange = async (productId, delta) => {
    const targetItem = cartItems.find((item) => item.id === String(productId));
    if (!targetItem) return;

    const stock = Number(targetItem.product?.quantity ?? 0);
    const newQuantity = targetItem.quantity + delta;

    if (newQuantity < 1 || (stock > 0 && newQuantity > stock)) return;

    // Optimistic UI update
    setCartItems((previousItems) =>
      previousItems.map((item) =>
        item.id === String(productId)
          ? { ...item, quantity: newQuantity }
          : item
      )
    );

    try {
      if (typeof updateCartQuantity === "function") {
        await updateCartQuantity(productId, newQuantity);
      }
    } catch (error) {
      console.error("Failed to update cart quantity:", error);
      // Revert back on server error
      setCartItems((previousItems) =>
        previousItems.map((item) =>
          item.id === String(productId)
            ? { ...item, quantity: targetItem.quantity }
            : item
        )
      );
      setErrorMessage(
        error.response?.data?.message || "Failed to update item quantity."
      );
    }
  };

  // Delete a product from backend and update UI
  const handleDelete = async (productId) => {
    if (!productId || deletingId !== null) return;

    try {
      setDeletingId(String(productId));
      setErrorMessage("");

      await removeProductFromCart(productId);

      setCartItems((previousItems) =>
        previousItems.filter((item) => item.id !== String(productId))
      );
    } catch (error) {
      console.error(
        "Delete error:",
        error.response?.data || error.message
      );

      setErrorMessage(
        error.response?.data?.message ||
          "Unable to remove this product from your cart."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // Share product link
  const handleShare = async (product) => {
    const title = product.name || product.title || "Fragranzia product";
    const url = `${window.location.origin}/SpecificProduct/${product._id}`;

    try {
      if (navigator.share) {
        await navigator.share({ title, url });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        alert("Product link copied successfully!");
      } else {
        window.prompt("Copy this product link:", url);
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Share error:", error);
      }
    }
  };

  // Dynamic calculations
  const totalItemsCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const subtotal = cartItems.reduce(
    (total, item) => total + item.originalPrice * item.quantity,
    0
  );

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const totalDiscount = Math.max(0, subtotal - totalAmount);

  return (
    <>
      {/* Navbar */}
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
                <span className="nav-link homepage-nav-link">
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
                    aria-label="Search"
                  />
                </div>
              </li>

              <li className="nav-item">
                <span
                  className="icon-btn homepage-icon-btn active"
                  aria-label="Cart"
                >
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
                <span
                  className="icon-btn homepage-icon-btn"
                  aria-label="Profile"
                >
                  <Link to="/Profile">
                    <i className="fa-regular fa-user"></i>
                  </Link>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Cart Content */}
      <div className="container my-4">
        <div className="row g-4">
          <div className="col-12">
            <h2 className="fw-bold mb-1">Cart</h2>
            <div className="text-muted small mb-4">
              <Link to="/" className="text-decoration-none text-muted">
                Home
              </Link>{" "}
              &gt; Cart
            </div>

            {errorMessage && (
              <div className="alert alert-danger" role="alert">
                {errorMessage}
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger ms-3"
                  onClick={fetchCart}
                >
                  Retry
                </button>
              </div>
            )}

            {loading ? (
              <div className="text-center py-5">
                <div
                  className="spinner-border text-secondary"
                  role="status"
                >
                  <span className="visually-hidden">Loading cart...</span>
                </div>
                <p className="text-muted mt-3">Loading your cart...</p>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="cart-empty-state text-center p-5">
                <i className="fa-solid fa-cart-shopping fa-3x mb-3 text-muted"></i>
                <h4>Your cart is empty</h4>
                <p className="text-muted">
                  Explore our fragrance collection and add items to your cart.
                </p>
                <Link to="/Products" className="btn cart-btn-proceed">
                  Explore Products
                </Link>
              </div>
            ) : (
              /* Grid for Cart Items: 2 items per row on medium screens and up */
              <div className="row row-cols-1 row-cols-md-2 g-3">
                {cartItems.map((item) => (
                  <div className="col" key={item.id}>
                    <div className="cart-item-card h-100 mb-0">
                      <div className="row align-items-center g-3">
                        <div className="col-12 col-sm-4 text-center">
                          <Link to={`/SpecificProduct/${item.product._id}`}>
                            <img
                              src={`http://localhost:5000/uploads/${item.product.image}`}
                              alt={item.product.name || "Fragrance"}
                              className="img-fluid"
                              style={{
                                maxHeight: "120px",
                                objectFit: "contain",
                              }}
                            />
                          </Link>
                        </div>

                        <div className="col-12 col-sm-8">
                          <Link
                            to={`/SpecificProduct/${item.product._id}`}
                            className="text-decoration-none text-dark"
                          >
                            <div className="cart-product-title">
                              {item.product.name || item.product.title}
                            </div>
                          </Link>

                          {/* Quantity controls */}
                          <div className="d-flex align-items-center cart-qty-container mb-2 mt-2">
                            <button
                              type="button"
                              className="cart-qty-btn"
                              onClick={() => handleQuantityChange(item.id, -1)}
                              disabled={item.quantity <= 1}
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>

                            <input
                              type="text"
                              className="cart-qty-input"
                              value={item.quantity}
                              readOnly
                              aria-label="Product quantity"
                            />

                            <button
                              type="button"
                              className="cart-qty-btn"
                              onClick={() => handleQuantityChange(item.id, 1)}
                              disabled={
                                Number(item.product?.quantity ?? 0) > 0 &&
                                item.quantity >= Number(item.product.quantity)
                              }
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>

                          {Number(item.product?.quantity ?? 0) > 0 && (
                            <small className="text-muted d-block mb-2">
                              Available stock: {item.product.quantity}
                            </small>
                          )}

                          {Number(item.product?.quantity ?? 0) === 0 && (
                            <small className="text-danger d-block mb-2">
                              Out of stock
                            </small>
                          )}

                          {/* Pricing */}
                          <div className="mb-3 d-flex flex-wrap align-items-baseline gap-2">
                            <span className="fw-bold fs-5">
                              Rs {formatPrice(item.price)}
                            </span>

                            {item.originalPrice > item.price && (
                              <>
                                <span className="text-muted text-decoration-line-through small">
                                  Rs {formatPrice(item.originalPrice)}
                                </span>

                                <span className="fw-bold text-success small">
                                  {item.discountPercent}% off
                                </span>
                              </>
                            )}
                          </div>

                          <div className="d-flex flex-wrap gap-2">
                            <button
                              type="button"
                              className="btn cart-action-btn cart-btn-delete"
                              onClick={() => handleDelete(item.id)}
                              disabled={deletingId === item.id}
                            >
                              {deletingId === item.id
                                ? "Removing..."
                                : "Delete"}
                            </button>

                            <button
                              type="button"
                              className="btn cart-action-btn cart-btn-share"
                              onClick={() => handleShare(item.product)}
                            >
                              Share
                            </button>
                          </div>

                          <div className="small text-muted mt-2">
                            Item total: Rs{" "}
                            {formatPrice(item.price * item.quantity)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary placed at the bottom */}
          <div className="col-12 mt-4">
            <div className="cart-summary-box">
              <h4 className="fw-bold mb-4">Check Out</h4>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>
                  Price ({totalItemsCount} item
                  {totalItemsCount !== 1 ? "s" : ""})
                </span>
                <span className="fw-bold">
                  Rs {formatPrice(subtotal)}
                </span>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>Discount</span>
                <span className="fw-bold text-success">
                  − Rs {formatPrice(totalDiscount)}
                </span>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>Delivery Charge</span>
                <span className="text-success fw-medium">Free</span>
              </div>

              <hr
                style={{
                  borderTop: "1px solid #cbd5e1",
                  opacity: 1,
                }}
                className="my-3"
              />

              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="fw-bold fs-5">Total Amount</span>
                <span className="fw-bold fs-4">
                  Rs {formatPrice(totalAmount)}
                </span>
              </div>

              <Link
                to="/paymentpage"
                className={`btn cart-btn-proceed text-center w-100 ${
                  loading || cartItems.length === 0 ? "disabled" : ""
                }`}
              >
                Proceed to Buy
              </Link>

              <div className="cart-trust-text text-center mt-3">
                Safe and Secure Payments. Easy returns. 100% Authentic products.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
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
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/Products">Products</Link></li>
                    <li><Link to="/Gifting">Gifting</Link></li>
                    <li><Link to="/About">About</Link></li>
                    <li><Link to="/Profile">Profile</Link></li>
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
                    <b>Contact &amp; Social</b>
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
              © 2024 Fragranzia Company. All rights reserved
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Cart;