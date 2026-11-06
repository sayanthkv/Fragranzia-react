import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Paymentpage.css";

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import UserService from "../../services/user-api-services/UserService";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Paymentpage = () => {
  const navigate = useNavigate();
  const {
    fetchprimaryaddress,
    getCart,
    createRazorpayOrder,
    verifyAndPlaceOrder,
    placeCodOrder,
  } = UserService();

  const [details, setDetails] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("gpay");

  // Modal State: null | 'success' | 'failure'
  const [orderStatus, setOrderStatus] = useState(null);
  const [failureReason, setFailureReason] = useState("");

  const getCleanImageUrl = (url) => {
    if (!url) return "default.png";
    if (url.includes("https://")) {
      return url.substring(url.indexOf("https://"));
    }
    if (url.includes("http://") && url.indexOf("http://") !== 0) {
      return url.substring(url.indexOf("http://"));
    }
    return url;
  };

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
      image: getCleanImageUrl(product.image),
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
      const response = await getCart();
      const items = Array.isArray(response?.cart) ? response.cart : [];
      setCartItems(items.map(normalizeCartItem));
    } catch (error) {
      console.error("Failed to fetch cart:", error.response?.data || error.message);
      toast.error(
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

  const handlePayment = async (razorpayOrder, baseOrderPayload) => {
    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        setFailureReason("Failed to load Razorpay SDK. Please check your internet connection.");
        setOrderStatus("failure");
        setIsPlacingOrder(false);
        return;
      }

      const options = {
        key: "rzp_test_TtcgxkiZwyZJ7b",
        amount: razorpayOrder.amount,
        currency: "INR",
        name: "Fragranzia",
        description: "Order Purchase",
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            // Commit and verify order on backend
            const verifyPayload = {
              ...baseOrderPayload,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };

            const verificationRes = await verifyAndPlaceOrder(verifyPayload);

            if (verificationRes?.success) {
              setOrderStatus("success");
              toast.success("Payment completed and order placed successfully!");
            } else {
              setFailureReason(verificationRes?.message || "Payment verification failed.");
              setOrderStatus("failure");
            }
          } catch (err) {
            console.error("Verification Error:", err);
            setFailureReason(
              err.response?.data?.message ||
                "Payment completed, but failed to confirm order. Please contact support."
            );
            setOrderStatus("failure");
          } finally {
            setIsPlacingOrder(false);
          }
        },
        modal: {
          ondismiss: function () {
            // No order exists in the DB if the user exits
            setIsPlacingOrder(false);
            toast.error("Payment cancelled. No order was placed.");
          },
        },
        theme: {
          color: "#043948",
        },
      };

      const rzp1 = new window.Razorpay(options);

      rzp1.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        setFailureReason(response.error?.description || "Payment transaction failed.");
        setOrderStatus("failure");
        setIsPlacingOrder(false);
        toast.error("Payment transaction failed.");
      });

      rzp1.open();
    } catch (error) {
      console.error("Payment Gateway Error:", error);
      setFailureReason("Failed to initialize payment gateway.");
      setOrderStatus("failure");
      setIsPlacingOrder(false);
      toast.error("Failed to initialize payment gateway.");
    }
  };

  const handlePlaceOrder = async () => {
    if (!details || !details._id) {
      toast.error("Please select a primary shipping address before placing your order.");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    try {
      setIsPlacingOrder(true);

      const isCod = selectedPaymentMethod.toLowerCase() === "cod";

      const baseOrderPayload = {
        orderItems: cartItems.map((item) => ({
          product: item.productId,
          quantity: item.quantity,
        })),
        shippingAddress: details._id,
        paymentMethod: selectedPaymentMethod,
        totalPrice: totalSellingPrice,
      };

      if (isCod) {
        // Direct COD checkout
        const response = await placeCodOrder(baseOrderPayload);

        if (response?.success) {
          setOrderStatus("success");
          toast.success("Order placed successfully with Cash on Delivery!");
        } else {
          setFailureReason(response?.message || "COD Order creation failed.");
          setOrderStatus("failure");
          toast.error(response?.message || "COD Order creation failed.");
        }
        setIsPlacingOrder(false);
      } else {
        // Online: Request Razorpay Order ID first without saving to DB
        const razorpayRes = await createRazorpayOrder(totalSellingPrice);

        if (razorpayRes?.success && razorpayRes.razorpayOrder) {
          await handlePayment(razorpayRes.razorpayOrder, baseOrderPayload);
        } else {
          setFailureReason(razorpayRes?.message || "Unable to start payment gateway.");
          setOrderStatus("failure");
          setIsPlacingOrder(false);
        }
      }
    } catch (error) {
      console.error("Order Checkout error:", error);
      setFailureReason(
        error.response?.data?.message || "Something went wrong while placing your order."
      );
      setOrderStatus("failure");
      toast.error("Something went wrong while placing your order.");
      setIsPlacingOrder(false);
    }
  };

  const handleRetry = () => {
    setOrderStatus(null);
  };

  return (
    <>
      <Toaster
        position="top-center"
        containerStyle={{
          top: 85,
          zIndex: 99999,
        }}
        toastOptions={{
          duration: 5000,
          style: {
            background: "#043948",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: "500",
            borderRadius: "8px",
            padding: "12px 20px",
            boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
          },
          success: {
            iconTheme: {
              primary: "#2ec4b6",
              secondary: "#ffffff",
            },
          },
          error: {
            style: {
              background: "#721c24",
              color: "#ffffff",
            },
            iconTheme: {
              primary: "#f5c6cb",
              secondary: "#721c24",
            },
          },
        }}
      />

      
      {/* Main Container */}
      <div className="container-fluid px-4 px-md-5 py-4">
        <h2 className="fw-bold mb-1" style={{ color: "#043948" }}>
          Checkout &amp; Payment
        </h2>
        <div className="text-muted small mb-4">
          <Link to="/" className="text-decoration-none text-muted">
            Home
          </Link>{" "}
          &gt;{" "}
          <Link to="/Cart" className="text-decoration-none text-muted">
            Cart
          </Link>{" "}
          &gt; Payment
        </div>

        {loading ? (
          <div className="d-flex justify-content-center align-items-center py-5 my-5">
            <div
              className="spinner-border"
              style={{
                width: "3.2rem",
                height: "3.2rem",
                color: "#043948",
                borderWidth: "3px",
              }}
              role="status"
            >
              <span className="visually-hidden">Loading checkout...</span>
            </div>
          </div>
        ) : (
          <div className="main row g-4 align-items-start">
            {/* Left Section */}
            <div className="left-section col-12 col-md-7 d-flex flex-column">
              <div
                className={`sec1main d-flex flex-column ${
                  cartItems.length > 1 ? "justify-content-between h-100" : ""
                }`}
              >
                {cartItems.length > 0 ? (
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
                        className="section1 p-3 flex-shrink-0 mx-auto shadow-sm border rounded-3 bg-white"
                        key={item.id}
                        style={{ scrollSnapAlign: "start", width: "100%" }}
                      >
                        <div className="row align-items-center g-3">
                          <div className="col-12 col-sm-4 text-center">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="img-fluid product-img mx-auto"
                              style={{ maxHeight: "120px", objectFit: "contain" }}
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
                              <span className="fw-bold fs-4" style={{ color: "#28a745" }}>
                                Rs {formatPrice(item.price)}
                              </span>

                              {item.originalPrice > item.price && (
                                <>
                                  <span className="py-3 mx-2 text-muted text-decoration-line-through small">
                                    Rs {formatPrice(item.originalPrice)}
                                  </span>
                                  <span className="text-danger fw-bold small">
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
                  <div className="p-5 text-center text-muted bg-white rounded shadow-sm border">
                    <i className="fa-solid fa-cart-shopping fa-3x mb-3 text-muted"></i>
                    <h5>Your cart is empty.</h5>
                    <Link to="/Products" className="btn btn-dark mt-2 px-4 py-2">
                      Explore Products
                    </Link>
                  </div>
                )}

                {/* Delivery Address Section */}
                <div className={`col-12 ${cartItems.length > 1 ? "mt-auto pt-3" : "pt-3"}`}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h3 className="fw-bold fs-5 text-dark mb-0">Delivery Address</h3>
                    <Link to="/Profile?tab=address" className="address-change-btn text-decoration-none">
                      <i className="fa-solid fa-pen-to-square me-1"></i> Change
                    </Link>
                  </div>

                  <div className="section-address p-3 shadow-sm border rounded-3 bg-white">
                    {details ? (
                      <>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="fw-bold fs-6 text-dark">
                            {details.fullName || details.name}
                          </span>
                          <span className="badge bg-success">
                            <i className="fa-solid fa-location-dot me-1"></i> Primary
                          </span>
                        </div>

                        <p className="address-text-body mb-2 text-muted">
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
                          to="/Profile?tab=address"
                          className="btn btn-outline-dark btn-sm d-inline-block"
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
              <div className="section21 p-4 shadow-sm border rounded-3 bg-white">
                <div className="row align-items-center g-3">
                  <h3 className="fw-bold mb-3 fs-4 text-dark" style={{ color: "#043948" }}>
                    Price Details
                  </h3>

                  <div className="d-flex justify-content-between align-items-center mb-0 fs-6">
                    <span>
                      Price ({totalItemsCount} item{totalItemsCount !== 1 ? "s" : ""})
                    </span>
                    <div>
                      <span className="fw-bold">
                        Rs {formatPrice(totalSellingPrice)}
                      </span>
                      {totalOriginalPrice > totalSellingPrice && (
                        <span className="text-muted ms-1 text-decoration-line-through small">
                          Rs {formatPrice(totalOriginalPrice)}
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
                    <span className="fw-bold fs-3" style={{ color: "#043948" }}>
                      Rs {formatPrice(totalSellingPrice)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="section22 p-4 mt-3 flex-grow-1 d-flex flex-column justify-content-between shadow-sm border rounded-3 bg-white">
                <div>
                  <h3 className="fw-bold mb-4 fs-4 text-dark" style={{ color: "#043948" }}>
                    Payment Methods
                  </h3>

                  <div className="d-flex flex-column gap-4">
                    <label className="d-flex justify-content-between align-items-center w-100 cursor-pointer">
                      <div className="d-flex align-items-center gap-3">
                        <i className="fa-brands fa-google-pay fs-2 text-dark" style={{ width: "35px" }}></i>
                        <span className="fw-medium fs-6">Google Pay / UPI</span>
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
                        <span className="fw-medium fs-6">Cash on Delivery (Cash/UPI)</span>
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
                        <span className="fw-medium fs-6">Wallets (Paytm / PhonePe)</span>
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
                        <span className="fw-medium fs-6">Credit / Debit Card</span>
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
                  {isPlacingOrder
                    ? "Processing..."
                    : selectedPaymentMethod === "cod"
                    ? "Place Order (COD)"
                    : "Pay Now"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- Exact Styled Success Modal --- */}
      {orderStatus === "success" && (
        <div className="success-overlay" id="paymentSuccessModal">
          <div className="success-card">
            <div className="success-icon-circle">
              <i className="fa-solid fa-check"></i>
            </div>
            <h2 className="success-title">Thank You for Ordering!</h2>
            <p className="success-subtitle">
              Your order has been successfully placed.
              <br />
              We're preparing it for shipment.
            </p>
            <div className="modal-btn-group">
              <button
                type="button"
                className="btn-outline-custom"
                onClick={() => navigate("/")}
              >
                Back to Home
              </button>
              <button
                type="button"
                className="btn-filled-custom"
                onClick={() => navigate("/Profile?tab=orders")}
              >
                Track Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Exact Styled Failure Modal --- */}
      {orderStatus === "failure" && (
        <div className="failure-overlay" id="paymentFailureModal">
          <div className="failure-card">
            <div className="failure-icon-circle">
              <i className="fa-solid fa-xmark"></i>
            </div>
            <h2 className="failure-title">Your order has failed!</h2>
            <p className="failure-subtitle">
              {failureReason || "Your order can't be completed"}
              <br />
              Please check your payment details or connection!
            </p>
            <div className="modal-btn-group">
              <button
                type="button"
                className="btn-outline-custom"
                onClick={() => navigate("/")}
              >
                Back to Home
              </button>
              <button
                type="button"
                className="btn-filled-custom"
                onClick={handleRetry}
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Paymentpage;