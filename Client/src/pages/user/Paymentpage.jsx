import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Paymentpage.css";

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import UserService from "../../services/user-api-services/UserService";

const Paymentpage = () => {
  const navigate = useNavigate();
  const { fetchprimaryaddress, getCart, placeorder } = UserService();

  const [details, setDetails] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("gpay");

  const formatPrice = (amount) =>
    Number(amount || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });

  const normalizeCartItem = (item) => {
    const product = item.product || {};
    const price = Number(item.price ?? product.price ?? product.saleprice ?? 0);
    const originalPrice = Number(
      item.originalPrice ?? product.originalPrice ?? product.saleprice ?? price
    );

    return {
      id: String(item._id || item.id || product._id || ""),
      productId: String(product._id || item.product || ""),
      name: product.name || product.title || "Fragranzia Eau De Parfum",
      image: product.image || "default.png",
      rating: product.rating || 4.5,
      price,
      originalPrice,
      quantity: Number(item.quantity || 1),
    };
  };

  const getaddress = async () => {
    try {
      const address = await fetchprimaryaddress();
      setDetails(address);
    } catch (error) {
      console.error("Failed to fetch address:", error);
    }
  };

  const fetchCart = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await getCart();
      const items = Array.isArray(response?.cart) ? response.cart : [];

      setCartItems(items.map(normalizeCartItem));
    } catch (error) {
      console.error("Failed to fetch cart:", error.response?.data || error.message);
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
    getaddress();
    fetchCart();
  }, []);

  const totalSellingPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const totalOriginalPrice = cartItems.reduce(
    (acc, item) => acc + item.originalPrice * item.quantity,
    0
  );

  const totalDiscount = Math.max(0, totalOriginalPrice - totalSellingPrice);
  const discountPercentage =
    totalOriginalPrice > 0
      ? Math.round((totalDiscount / totalOriginalPrice) * 100)
      : 0;

  const totalItemsCount = cartItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (!details || !details._id) {
      alert("Please select a primary shipping address before placing your order.");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    try {
      setIsPlacingOrder(true);

      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          product: item.productId,
          quantity: item.quantity,
        })),
        shippingAddress: details._id,
        paymentMethod: selectedPaymentMethod,
        totalPrice: totalSellingPrice,
        balanceTotal: selectedPaymentMethod === "cod" ? totalSellingPrice : 0,
        paymentStatus: selectedPaymentMethod === "cod" ? "Pending" : "Paid",
      };

      const response = await placeorder(orderPayload);

      if (response?.success) {
        alert("Order placed successfully!");
        navigate("/Profile?tab=orders");
      } else {
        alert(response?.message || "Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert(error.response?.data?.message || "Something went wrong while placing your order.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

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
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse justify-content-end" id="navbarContent">
            <ul className="navbar-nav align-items-center gap-2">
              <li className="nav-item">
                <span className="nav-link active homepage-nav-link">
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
                  />
                </div>
              </li>
              <li className="nav-item">
                <span className="icon-btn homepage-icon-btn">
                  <Link to="/Cart">
                    <i className="fa-solid fa-cart-shopping"></i>
                  </Link>
                </span>
              </li>
              <li className="nav-item">
                <button className="icon-btn homepage-icon-btn" type="button">
                  <i className="fa-regular fa-bell"></i>
                </button>
              </li>
              <li className="nav-item">
                <span className="icon-btn homepage-icon-btn">
                  <Link to="/Profile">
                    <i className="fa-regular fa-user"></i>
                  </Link>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container py-4">
        <div className="main row g-4 align-items-start">
          {/* Left Section */}
          <div className="left-section col-12 col-md-7 d-flex flex-column">
            <div className={`sec1main d-flex flex-column ${cartItems.length > 1 ? "justify-content-between h-100" : ""}`}>
              {loading ? (
                <div className="p-3 text-center">Loading cart...</div>
              ) : errorMessage ? (
                <div className="p-3 text-danger text-center">{errorMessage}</div>
              ) : cartItems.length > 0 ? (
                <div
                  className={`d-flex flex-column align-items-center overflow-auto gap-3 pb-2 ${
                    cartItems.length > 1 ? "flex-grow-1" : "flex-grow-0"
                  }`}
                  style={{
                    maxHeight: cartItems.length > 1 ? "480px" : "none",
                    scrollSnapType: "y mandatory",
                    scrollbarWidth: "thin",
                  }}
                >
                  {cartItems.map((item) => (
                    <div
                      className="section1 p-3 flex-shrink-0 mx-auto"
                      key={item.id}
                      style={{ scrollSnapAlign: "start", width: "100%" }}
                    >
                      <div className="row align-items-center g-3">
                        <div className="col-12 col-sm-4 text-center">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="img-fluid product-img mx-auto"
                          />
                        </div>

                        <div className="col-12 col-sm-8 text-center text-sm-start">
                          <span className="fw-bolder fs-5 d-block">{item.name}</span>
                          <span>
                            Autograph {item.rating}{" "}
                            <i
                              className="fa-solid fa-star"
                              style={{ color: "rgb(99, 230, 190)" }}
                            ></i>
                          </span>

                          <div className="mt-3">
                            <span className="fw-bold text-dark">
                              Qty: <span className="fs-6">{item.quantity}</span>
                            </span>
                          </div>

                          <div className="mt-2">
                            <span className="fw-bold fs-4">
                              Rs {formatPrice(item.price)}
                            </span>

                            {item.originalPrice > item.price && (
                              <>
                                <span className="py-3 mx-2">
                                  <s>Rs {formatPrice(item.originalPrice)}</s>
                                </span>
                                <span className="text-success fw-bold">
                                  {Math.round(
                                    ((item.originalPrice - item.price) / item.originalPrice) * 100
                                  )}
                                  % Off
                                </span>
                              </>
                            )}
                          </div>

                          <div className="mt-2 text-muted small">
                            <span>
                              Free delivery <i className="fa-solid fa-truck fa-xs"></i>
                            </span>
                            <br />
                            <span className="text-success fw-medium">
                              7 Days Return Policy
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 text-center">Your cart is empty.</div>
              )}

              {/* Delivery Address Section */}
              <div className={`col-12 ${cartItems.length > 1 ? "mt-auto pt-3" : "pt-3"}`}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h3 className="fw-bold fs-5 text-dark mb-0">Delivery Address</h3>
                  <Link to="/Profile?tab=address" className="address-change-btn">
                    <i className="fa-solid fa-pen-to-square me-1"></i> Change
                  </Link>
                </div>

                <div className="section-address p-3">
                  {details ? (
                    <>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="fw-bold fs-6 text-dark">
                          {details.fullName || details.name}
                        </span>
                        <span className="address-status-badge">
                          <i className="fa-solid fa-location-dot me-1"></i> Primary
                        </span>
                      </div>

                      <p className="address-text-body mb-2">
                        {details.street
                          ? `${details.street}, ${details.city}, ${details.state} ${details.zip}`
                          : details.address}
                      </p>

                      <div className="d-flex align-items-center text-muted small">
                        <i className="fa-solid fa-phone me-2 text-dark"></i>
                        <span className="fw-medium">
                          {details.phone || details.ph}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-2">
                      <p className="text-muted mb-2 small">
                        No primary address selected.
                      </p>
                      <Link
                        to="/Profile"
                        className="address-change-btn d-inline-block"
                      >
                        + Select Address
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="Right-section col-12 col-md-5 d-flex flex-column justify-content-between">
            {/* Price Breakdown */}
            <div className="section21 p-3">
              <div className="row align-items-center g-3">
                <h3 className="fw-bold mb-4 fs-4 text-dark">Price Details</h3>

                <div className="d-flex justify-content-between align-items-center mb-0 fs-6">
                  <span>
                    Price ({totalItemsCount} item{totalItemsCount !== 1 ? "s" : ""})
                  </span>
                  <div>
                    <span className="fw-bold">
                      Rs {formatPrice(totalSellingPrice)}
                    </span>
                    {totalOriginalPrice > totalSellingPrice && (
                      <span className="text-muted ms-1">
                        <del>Rs {formatPrice(totalOriginalPrice)}</del>
                      </span>
                    )}
                  </div>
                </div>

                {totalDiscount > 0 && (
                  <div className="d-flex justify-content-between align-items-center mb-0 fs-6">
                    <span>Discount ({discountPercentage}%)</span>
                    <span className="text-success fw-medium">
                      − Rs {formatPrice(totalDiscount)}
                    </span>
                  </div>
                )}

                <div className="d-flex justify-content-between align-items-center mb-0 fs-6">
                  <span>Delivery Charge</span>
                  <span className="text-success fw-medium">Free Delivery</span>
                </div>

                <hr className="mb-0 border-top border-secondary border-opacity-50" />

                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-bold fs-5">Total Amount</span>
                  <span className="fw-bold fs-3 text-dark">
                    Rs {formatPrice(totalSellingPrice)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="section22 p-4 mt-3 flex-grow-1 d-flex flex-column justify-content-between">
              <div>
                <h3 className="fw-bold mb-4 fs-4 text-dark">Payment Methods</h3>

                <div className="d-flex flex-column gap-4">
                  <label className="d-flex justify-content-between align-items-center w-100 cursor-pointer">
                    <div className="d-flex align-items-center gap-3">
                      <i className="fa-brands fa-google-pay fs-2 text-dark" style={{ width: "35px" }}></i>
                      <span className="fw-medium fs-6">Google Pay</span>
                    </div>
                    <input
                      className="form-check-input border-secondary m-0"
                      type="radio"
                      name="paymentMethod"
                      value="gpay"
                      checked={selectedPaymentMethod === "gpay"}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      style={{ width: "1.4rem", height: "1.4rem" }}
                    />
                  </label>

                  <label className="d-flex justify-content-between align-items-center w-100 cursor-pointer">
                    <div className="d-flex align-items-center gap-3">
                      <i className="fa-solid fa-money-bill-wave fs-4 text-secondary" style={{ width: "35px" }}></i>
                      <span className="fw-medium fs-6">Cash on delivery (cash/UPI)</span>
                    </div>
                    <input
                      className="form-check-input border-secondary m-0"
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={selectedPaymentMethod === "cod"}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      style={{ width: "1.4rem", height: "1.4rem" }}
                    />
                  </label>

                  <label className="d-flex justify-content-between align-items-center w-100 cursor-pointer">
                    <div className="d-flex align-items-center gap-3">
                      <i className="fa-solid fa-wallet fs-4 text-secondary" style={{ width: "35px" }}></i>
                      <span className="fw-medium fs-6">Paytm/Phone Pay/Amazon Pay etc</span>
                    </div>
                    <input
                      className="form-check-input border-secondary m-0"
                      type="radio"
                      name="paymentMethod"
                      value="wallets"
                      checked={selectedPaymentMethod === "wallets"}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      style={{ width: "1.4rem", height: "1.4rem" }}
                    />
                  </label>

                  <label className="d-flex justify-content-between align-items-center w-100 cursor-pointer">
                    <div className="d-flex align-items-center gap-3">
                      <i className="fa-regular fa-credit-card fs-4 text-secondary" style={{ width: "35px" }}></i>
                      <span className="fw-medium fs-6">Credit/Debit card</span>
                    </div>
                    <input
                      className="form-check-input border-secondary m-0"
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={selectedPaymentMethod === "card"}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      style={{ width: "1.4rem", height: "1.4rem" }}
                    />
                  </label>

                  <label className="d-flex justify-content-between align-items-center w-100 cursor-pointer">
                    <div className="d-flex align-items-center gap-3">
                      <i className="fa-solid fa-building-columns fs-4 text-secondary" style={{ width: "35px" }}></i>
                      <span className="fw-medium fs-6">Net Banking</span>
                    </div>
                    <input
                      className="form-check-input border-secondary m-0"
                      type="radio"
                      name="paymentMethod"
                      value="netbanking"
                      checked={selectedPaymentMethod === "netbanking"}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      style={{ width: "1.4rem", height: "1.4rem" }}
                    />
                  </label>
                </div>
              </div>

              <button
                className="btn w-100 mt-4 py-3 fw-bold text-white fs-5"
                style={{ backgroundColor: "#043948", borderRadius: "8px" }}
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder || cartItems.length === 0}
              >
                {isPlacingOrder ? "Placing Order..." : "Pay Now"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Paymentpage;