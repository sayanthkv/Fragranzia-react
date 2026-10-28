import React, { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Profile.css";
import UserService from "../../services/user-api-services/UserService";

export default function Profile() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

  // Check if current user is an admin
  const userRole = localStorage.getItem("role");
  const isAdmin = userRole && userRole.toLowerCase() === "admin";

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const [orders, setOrders] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    password: "",
  });

  const {
    getUserdata,
    updatedetails,
    getOrders,
    saveaddress,
    fetchdata: fetchAddressesFromService,
    updateaddress,
    setprimary,
    cancelOrder,
    returnOrder,
  } = UserService();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const fetchdata = async () => {
    try {
      const response = await getUserdata();
      setFormData((previous) => ({ ...previous, ...response }));
    } catch (error) {
      console.error("Failed to fetch profile:", error.response?.data || error.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await updatedetails({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      });
      const updatedUser = response.user;
      if (updatedUser) {
        setFormData((previous) => ({
          ...previous,
          name: updatedUser.name || "",
          email: updatedUser.email || "",
          phone: updatedUser.phone || "",
        }));
      } else {
        await fetchdata();
      }
      setShowEdit(false);
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Profile update failed:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to update profile");
    }
  };

  const getorderedproducts = async () => {
    try {
      const res = await getOrders();
      if (Array.isArray(res?.orders)) {
        setOrders(res.orders);
      } else if (Array.isArray(res)) {
        setOrders(res);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Failed to fetch user orders:", error);
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchdata();
    getorderedproducts();
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editAddressType, setEditAddressType] = useState("Home");
  const [editFormData, setEditFormData] = useState({});
  const [addressType, setAddressType] = useState("Home");

  // Order action state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedReturnReason, setSelectedReturnReason] = useState("Damaged Product");

  const [addressFormData, setAddressFormData] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    landmark: "",
    zip: "",
    alternativePhone: "",
  });

  const handleAddressChange = (event) => {
    const { name, value } = event.target;
    setAddressFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      await saveaddress({ ...addressFormData, addressType });
      setShowModal(false);
      setAddressFormData({
        fullName: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        landmark: "",
        zip: "",
        alternativePhone: "",
      });

      await getAddresses();
      alert("Address saved successfully!");
    } catch (error) {
      console.error("Failed to save address:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to save address. Please try again.");
    }
  };

  const getAddresses = async () => {
    try {
      setLoading(true);
      const response = await fetchAddressesFromService();
      setAddresses(response.addresses || []);
    } catch (error) {
      console.error("Failed to fetch addresses:", error.response?.data || error.message);
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditFormData((previousData) => ({ ...previousData, [name]: value }));
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleEditSave = async (event) => {
    event.preventDefault();

    if (!selectedAddress?._id) {
      alert("Please select an address to edit.");
      return;
    }

    try {
      await updateaddress(selectedAddress._id, {
        fullName: editFormData.fullName,
        phone: editFormData.phone,
        street: editFormData.street,
        city: editFormData.city,
        state: editFormData.state,
        landmark: editFormData.landmark,
        zip: editFormData.zip,
        alternativePhone: editFormData.alternativePhone,
        addressType: editAddressType,
      });

      await getAddresses();
      setShowEditModal(false);
      setShowViewModal(false);
      alert("Address updated successfully!");
    } catch (error) {
      console.error("Failed to update address:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to update address. Please try again.");
    }
  };

  const handleprimarybutton = async (id) => {
    await setprimary(id);
    await getAddresses();
  };

  useEffect(() => {
    getAddresses();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-success";
      case "Cancelled":
        return "bg-danger";
      case "Returned":
      case "Return Requested":
        return "bg-secondary";
      case "Shipped":
      case "Out for Delivery":
        return "bg-info text-dark";
      case "Pending":
      default:
        return "bg-warning text-dark";
    }
  };

  const handleCancelClick = (order) => {
    setSelectedOrder(order);
    setShowCancelModal(true);
  };

  const handleReturnClick = (order) => {
    setSelectedOrder(order);
    setShowReturnModal(true);
  };

  const confirmCancelOrder = async () => {
    try {
      if (!selectedOrder?._id) return;
      await cancelOrder(selectedOrder._id);
      alert(`Order #${selectedOrder._id} cancelled successfully.`);
      setShowCancelModal(false);
      setSelectedOrder(null);
      await getorderedproducts();
    } catch (error) {
      console.error("Failed to cancel order:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to cancel order. Please try again.");
    }
  };

  const confirmReturnOrder = async () => {
    try {
      if (!selectedOrder?._id) return;
      await returnOrder(selectedOrder._id, selectedReturnReason);
      alert(`Return request for Order #${selectedOrder._id} submitted successfully.`);
      setShowReturnModal(false);
      setSelectedOrder(null);
      await getorderedproducts();
    } catch (error) {
      console.error("Failed to process return:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to submit return request.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("Token");
    localStorage.removeItem("role");
    navigate('/LogIn');
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
          <div className="collapse navbar-collapse justify-content-end" id="navbarContent">
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
                <span className="icon-btn homepage-icon-btn active" aria-label="Profile">
                  <Link to="/Profile">
                    <i className="fa-regular fa-user"></i>
                  </Link>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="profile-root-wrapper">
        <div className="container-fluid px-md-5 px-3">
          <div className="mx-2 py-4">
            <h1 className="mb-1" style={{ fontWeight: 700, fontSize: "2.2rem" }}>
              Profile
            </h1>
            <nav aria-label="breadcrumb" className="mb-4">
              <span className="text-muted" style={{ fontSize: "0.9rem" }}>
                Home &gt; {activeTab === "profile" ? "Profile" : activeTab === "address" ? "Address" : "My Order"}
              </span>
            </nav>

            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
              <div className="tab-container mb-0">
                <button
                  className={`tab-btn ${activeTab === "profile" ? "profile-btn" : "other-btn"}`}
                  type="button"
                  onClick={() => setActiveTab("profile")}
                >
                  Profile
                </button>
                <button
                  className={`tab-btn ${activeTab === "address" ? "profile-btn" : "other-btn"}`}
                  type="button"
                  onClick={() => setActiveTab("address")}
                >
                  Address
                </button>
                <button
                  className={`tab-btn ${activeTab === "orders" ? "profile-btn" : "other-btn"}`}
                  type="button"
                  onClick={() => setActiveTab("orders")}
                >
                  My Order
                </button>
              </div>

              {/* 👑 ADMIN DASHBOARD BUTTON (Visible only when role === 'admin') */}
              {isAdmin && (
                <button
                  type="button"
                  className="btn btn-dark fw-semibold px-4 py-2 d-flex align-items-center gap-2 shadow-sm"
                  onClick={() => navigate("/AdminCategory")}
                >
                  <i className="fa-solid fa-user-shield"></i>
                  Open Admin Dashboard
                </button>
              )}
            </div>

            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <div className="profile-tab-content">
                <form className="row g-4" onSubmit={(e) => e.preventDefault()}>
                  <div className="col-12 col-md-4">
                    <label className="profile-form-label">Full Name</label>
                    <input
                      type="text"
                      className="profile-custom-control"
                      value={formData.name}
                      readOnly
                    />
                  </div>

                  <div className="col-12 col-md-4">
                    <label className="profile-form-label">Email</label>
                    <input
                      type="email"
                      className="profile-custom-control"
                      value={formData.email}
                      readOnly
                    />
                  </div>

                  <div className="col-12 col-md-4">
                    <label className="profile-form-label">Phone Number</label>
                    <input
                      type="text"
                      className="profile-custom-control"
                      value={formData.phone}
                      readOnly
                    />
                  </div>

                  <div className="col-12 col-md-4">
                    <label className="profile-form-label">Date of Birth</label>
                    <input
                      type="text"
                      className="profile-custom-control"
                      value={formData.dob}
                      readOnly
                    />
                  </div>

                  <div className="col-12 col-md-4">
                    <label className="profile-form-label">Gender</label>
                    <input
                      type="text"
                      className="profile-custom-control"
                      value={formData.gender}
                      readOnly
                    />
                  </div>

                  <div className="col-12 col-md-4">
                    <label className="profile-form-label">Password</label>
                    <div className="profile-input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="profile-custom-control"
                        value={formData.password}
                        readOnly
                        style={{ letterSpacing: showPassword ? "normal" : "3px" }}
                      />
                    </div>
                  </div>

                  <div className="col-12 text-end d-flex justify-content-end gap-3 align-items-center">
                    <button
                      type="button"
                      className="btn btn-outline-danger fw-semibold px-4 py-2"
                      onClick={handleLogout}
                    >
                      <i className="fa-solid fa-right-from-bracket me-2"></i>
                      Log Out
                    </button>
                    <button
                      type="button"
                      className="profile-btn-edit"
                      onClick={() => setShowEdit(true)}
                    >
                      Edit
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ADDRESS TAB */}
            {activeTab === "address" && (
              <main className={`alladdress-content ${showModal ? "alladdress-content-blurred" : ""}`}>
                <div className="address-section-inner">
                  <div className="address-toolbar">
                    <button type="button" className="btn-address" onClick={() => setShowModal(true)}>
                      <i className="fa-solid fa-plus"></i> Add Address
                    </button>
                  </div>
                  {loading ? (
                    <p>Loading addresses...</p>
                  ) : addresses.length === 0 ? (
                    <p>No saved addresses found. Click Add Address to save one.</p>
                  ) : (
                    <div className="row g-4">
                      {addresses.map((address, index) => {
                        const isPrimary = address.isPrimary;
                        return (
                          <div className="col-12 col-md-6 col-xl-4" key={address._id}>
                            <div
                              className={`address-card h-100 ${isPrimary ? "primary-card" : ""}`}
                              style={
                                isPrimary
                                  ? {
                                      borderColor: "#198754",
                                      boxShadow: "0 0.5rem 1rem rgba(25, 135, 84, 0.25)",
                                      backgroundColor: "#f8fff9",
                                    }
                                  : {}
                              }
                            >
                              <div className="d-flex justify-content-between align-items-center">
                                <h2 className="address-title">Address {index + 1}</h2>
                                <div className="primary-actions d-flex align-items-center gap-2">
                                  {isPrimary ? (
                                    <span className="badge bg-success">
                                      <i className="fa-solid fa-circle-check me-1"></i> Primary
                                    </span>
                                  ) : (
                                    <button
                                      onClick={() => handleprimarybutton(address._id)}
                                      className="btn btn-outline-success btn-sm setprimary"
                                    >
                                      Set as primary
                                    </button>
                                  )}
                                  <span className="badge-tag">
                                    <i className="fa-solid fa-location-dot"></i> {address.addressType || "Saved"}
                                  </span>
                                </div>
                              </div>

                              <div className="fw-bold my-2 address-name">{address.fullName}</div>
                              <p className="address-text">
                                {address.street}, {address.city}, {address.state} {address.zip}
                              </p>

                              <div className="alladdress-card-actions">
                                <button
                                  type="button"
                                  className="alladdress-small-edit"
                                  onClick={() => {
                                    setSelectedAddress(address);
                                    setShowViewModal(true);
                                  }}
                                >
                                  <i className="fa-solid fa-eye"></i> View
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </main>
            )}

            {/* MY ORDERS TAB */}
            {activeTab === "orders" && (
              <section className="profile-orders-section">
                {Array.isArray(orders) && orders.length > 0 ? (
                  <div className="d-flex flex-column gap-3">
                    {orders.map((order) => {
                      const grandTotal = Number(order.totalPrice || 0);
                      const currentDeliveryStatus = order.deliveryStatus || "Pending";

                      const isReturnActive = Boolean(order.isReturned === true);

                      return (
                        <div key={order._id} className="card shadow-lg border-0 p-3">
                          <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                            <div>
                              <span className="fw-bold text-dark me-2">Order ID: #{order._id}</span>
                              <small className="text-muted d-block d-sm-inline mt-1 mt-sm-0">
                                Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN") : "N/A"}
                              </small>
                            </div>

                            {isReturnActive ? (
                              <span className="badge bg-warning text-dark px-3 py-2 fs-6">
                                <i className="fa-solid fa-rotate-left me-1"></i>
                                {order.returnStatus === "Completed"
                                  ? "Product Returned"
                                  : `Return ${order.returnStatus || "Requested"}`}
                              </span>
                            ) : (
                              <span className={`badge ${getStatusBadge(currentDeliveryStatus)} px-3 py-2 fs-6`}>
                                {currentDeliveryStatus}
                              </span>
                            )}
                          </div>

                          {Array.isArray(order.orderItems) &&
                            order.orderItems.map((item, idx) => {
                              const itemPrice = Number(item.price || item.product?.price || 0);
                              const itemQty = Number(item.quantity || 1);
                              const itemSubtotal = itemPrice * itemQty;

                              return (
                                <div key={item._id || idx} className="d-flex align-items-center gap-3 py-2 border-bottom">
                                  <img
                                    src={item.product?.image || "default.png"}
                                    alt={item.product?.name || "Product"}
                                    style={{ width: "70px", height: "70px", objectFit: "cover", borderRadius: "8px" }}
                                  />
                                  <div className="flex-grow-1">
                                    <h6 className="mb-1 fw-bold">{item.product?.name || item.name || "Product Title"}</h6>
                                    <small className="text-muted d-block">Quantity: {itemQty}</small>
                                  </div>
                                  <div className="text-end fw-bold fs-6">
                                    Rs {itemSubtotal.toLocaleString("en-IN")}
                                  </div>
                                </div>
                              );
                            })}

                          <div className="d-flex justify-content-between align-items-center pt-3 mt-1">
                            <div className="text-muted small">
                              Payment: <strong className="text-dark">{order.paymentMethod?.toUpperCase() || "N/A"}</strong> ({order.paymentStatus || "Pending"})
                            </div>
                            <div className="d-flex align-items-center gap-3">
                              <span className="fs-5 fw-bold text-dark">
                                Total: Rs {grandTotal.toLocaleString("en-IN")}
                              </span>

                              {isReturnActive ? (
                                <span className="badge bg-secondary px-3 py-2 fs-6">
                                  <i className="fa-solid fa-clock-rotate-left me-1"></i>
                                  Return {order.returnStatus || "Requested"}
                                </span>
                              ) : currentDeliveryStatus === "Delivered" ? (
                                <button
                                  className="btn btn-outline-warning btn-sm px-3 fw-semibold"
                                  onClick={() => handleReturnClick(order)}
                                >
                                  Return Item
                                </button>
                              ) : currentDeliveryStatus !== "Cancelled" && currentDeliveryStatus !== "Returned" ? (
                                <button
                                  className="btn btn-outline-danger btn-sm px-3 fw-semibold"
                                  onClick={() => handleCancelClick(order)}
                                >
                                  Cancel Order
                                </button>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-5 text-muted">
                    <i className="fa-solid fa-box-open fs-1 mb-2 d-block"></i>
                    <p className="fs-5">No orders placed yet.</p>
                  </div>
                )}
              </section>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Order Confirmation Modal */}
      {showCancelModal && selectedOrder && (
        <div className="cancelorder-overlay">
          <div className="cancelorder-modal p-4 bg-white rounded shadow">
            <div className="cancel-order-header border-bottom pb-2 mb-3">
              <h4 className="m-0">Cancel Order #{selectedOrder._id}</h4>
            </div>
            <p>Are you sure you want to cancel this order?</p>
            <div className="mb-3">
              <strong>Status:</strong> {selectedOrder.deliveryStatus || "Pending"}
              <br />
              <strong>Total Amount:</strong> Rs {Number(selectedOrder.totalPrice || 0).toLocaleString("en-IN")}
            </div>
            <div className="d-flex justify-content-end gap-2">
              <button className="btn btn-secondary" onClick={() => setShowCancelModal(false)}>
                Close
              </button>
              <button className="btn btn-danger fw-semibold" onClick={confirmCancelOrder}>
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return Order Request Modal */}
      {showReturnModal && selectedOrder && (
        <div className="cancelorder-overlay">
          <div className="cancelorder-modal p-4 bg-white rounded shadow">
            <div className="cancel-order-header border-bottom pb-2 mb-3">
              <h4 className="m-0">Return Order #{selectedOrder._id}</h4>
            </div>
            <p className="mb-3 text-muted">Please select the reason for returning this order:</p>

            <div className="mb-4">
              <label className="form-label fw-bold">Return Reason</label>
              <select
                className="form-select"
                value={selectedReturnReason}
                onChange={(e) => setSelectedReturnReason(e.target.value)}
              >
                <option value="Damaged Product">Damaged Product</option>
                <option value="Wrong Item Received">Wrong Item Received</option>
                <option value="Defective Product">Defective Product</option>
                <option value="Item Not as Described">Item Not as Described</option>
                <option value="Size/Color Mismatch">Size/Color Mismatch</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button className="btn btn-secondary" onClick={() => setShowReturnModal(false)}>
                Close
              </button>
              <button className="btn btn-warning fw-semibold" onClick={confirmReturnOrder}>
                Submit Return Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEdit && (
        <div className="alladdress-edit-overlay">
          <div className="profile-edit-modal">
            <form className="row g-4" onSubmit={handleSubmit}>
              <div className="col-12 col-md-4">
                <label className="profileedit-form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  className="profileedit-custom-control"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="col-12 col-md-4">
                <label className="profileedit-form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="profileedit-custom-control"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="col-12 col-md-4">
                <label className="profileedit-form-label">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  className="profileedit-custom-control"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12 col-md-4">
                <label className="profileedit-form-label">Date of Birth</label>
                <input
                  type="text"
                  name="dob"
                  className="profileedit-custom-control"
                  value={formData.dob}
                  onChange={handleChange}
                />
              </div>
              <div className="col-12 col-md-4">
                <label className="profileedit-form-label">Gender</label>
                <input
                  type="text"
                  name="gender"
                  className="profileedit-custom-control"
                  value={formData.gender}
                  onChange={handleChange}
                />
              </div>
              <div className="col-12 col-md-4">
                <label className="profileedit-form-label">Password</label>
                <div className="profileedit-custom-input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="profileedit-custom-control"
                    value={formData.password}
                    onChange={handleChange}
                    readOnly
                    style={{ letterSpacing: showPassword ? "normal" : "3px" }}
                  />
                </div>
              </div>

              <div className="col-12 text-end">
                <button type="submit" className="profileedit-btn-save">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Address Details Modal */}
      {showViewModal && (
        <div
          className="alladdress-view-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowViewModal(false);
            }
          }}
        >
          <div
            className="alladdress-view-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="view-address-title"
          >
            <div className="alladdress-view-header">
              <h2 id="view-address-title" className="alladdress-view-heading">
                Address Details
              </h2>
              <button
                type="button"
                className="alladdress-modal-close"
                onClick={() => setShowViewModal(false)}
                aria-label="Close address details"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={(event) => event.preventDefault()}>
              {selectedAddress && (
                <>
                  <div className="modal-section-title">Address Type</div>
                  <div className="type-radio-group alladdress-view-type-group">
                    <div>
                      <input
                        type="radio"
                        name="viewAddressType"
                        id="viewTypeHome"
                        className="type-input"
                        checked={(selectedAddress.addressType || "Home") === "Home"}
                        readOnly
                      />
                      <label htmlFor="viewTypeHome" className="type-label home-active">
                        <i className="fa-solid fa-house-chimney"></i> Home
                      </label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        name="viewAddressType"
                        id="viewTypeOffice"
                        className="type-input"
                        checked={selectedAddress.addressType === "Office"}
                        readOnly
                      />
                      <label htmlFor="viewTypeOffice" className="type-label">
                        <i className="fa-solid fa-building"></i> Office
                      </label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        name="viewAddressType"
                        id="viewTypeOther"
                        className="type-input"
                        checked={selectedAddress.addressType === "Other"}
                        readOnly
                      />
                      <label htmlFor="viewTypeOther" className="type-label">
                        <i className="fa-solid fa-address-book"></i> Other
                      </label>
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label htmlFor="viewFullName" className="form-label-custom">
                        Full Name
                      </label>
                      <input
                        id="viewFullName"
                        className="form-control-custom alladdress-view-input"
                        value={selectedAddress.fullName || ""}
                        readOnly
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="viewPhone" className="form-label-custom">
                        Phone Number
                      </label>
                      <input
                        id="viewPhone"
                        className="form-control-custom alladdress-view-input"
                        value={selectedAddress.phone || ""}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="viewAddress" className="form-label-custom">
                      Address
                    </label>
                    <textarea
                      id="viewAddress"
                      className="form-control-custom textarea-custom alladdress-view-input"
                      value={selectedAddress.street || ""}
                      readOnly
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-4">
                      <label htmlFor="viewCity" className="form-label-custom">
                        City/District
                      </label>
                      <input
                        id="viewCity"
                        className="form-control-custom alladdress-view-input"
                        value={selectedAddress.city || ""}
                        readOnly
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="viewState" className="form-label-custom">
                        State
                      </label>
                      <input
                        id="viewState"
                        className="form-control-custom alladdress-view-input"
                        value={selectedAddress.state || ""}
                        readOnly
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="viewLandmark" className="form-label-custom">
                        Land Mark
                      </label>
                      <input
                        id="viewLandmark"
                        className="form-control-custom alladdress-view-input"
                        value={selectedAddress.landmark || ""}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-4">
                    <div className="col-md-4">
                      <label htmlFor="viewPincode" className="form-label-custom">
                        PinCode
                      </label>
                      <input
                        id="viewPincode"
                        className="form-control-custom alladdress-view-input"
                        value={selectedAddress.zip || ""}
                        readOnly
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="viewAlternativePhone" className="form-label-custom">
                        Alternative Phone number (Optional)
                      </label>
                      <input
                        id="viewAlternativePhone"
                        className="form-control-custom alladdress-view-input"
                        value={selectedAddress.alternativePhone || ""}
                        placeholder="Not provided"
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="alladdress-view-actions">
                    <button
                      type="button"
                      className="btn-modal-edit"
                      onClick={() => {
                        setEditFormData({
                          fullName: selectedAddress.fullName || "",
                          phone: selectedAddress.phone || "",
                          street: selectedAddress.street || "",
                          city: selectedAddress.city || "",
                          state: selectedAddress.state || "",
                          landmark: selectedAddress.landmark || "",
                          zip: selectedAddress.zip || "",
                          alternativePhone: selectedAddress.alternativePhone || "",
                        });
                        setEditAddressType(selectedAddress.addressType || "Home");
                        setShowViewModal(false);
                        setShowEditModal(true);
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Edit Address Modal */}
      {showEditModal && (
        <div
          className="alladdress-edit-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowEditModal(false);
            }
          }}
        >
          <div
            className="alladdress-edit-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-address-title"
          >
            <div className="alladdress-edit-header">
              <h2 id="edit-address-title" className="alladdress-edit-heading">
                Edit Address
              </h2>
              <button
                type="button"
                className="alladdress-modal-close"
                onClick={() => setShowEditModal(false)}
                aria-label="Close edit address modal"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleEditSave}>
              <div className="modal-section-title">Address Type</div>
              <div className="type-radio-group alladdress-edit-type-group">
                {["Home", "Office", "Other"].map((type) => (
                  <div key={type}>
                    <input
                      type="radio"
                      name="editAddressType"
                      id={`editType${type}`}
                      className="type-input"
                      checked={editAddressType === type}
                      onChange={() => setEditAddressType(type)}
                    />
                    <label
                      htmlFor={`editType${type}`}
                      className={`type-label ${editAddressType === type ? "home-active" : ""}`}
                    >
                      {type === "Home" && <i className="fa-solid fa-house-chimney"></i>}
                      {type === "Office" && <i className="fa-solid fa-building"></i>}
                      {type === "Other" && <i className="fa-solid fa-address-book"></i>}
                      {type}
                    </label>
                  </div>
                ))}
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label htmlFor="editFullName" className="form-label-custom">
                    Full Name
                  </label>
                  <input
                    id="editFullName"
                    name="fullName"
                    type="text"
                    className="form-control-custom alladdress-edit-input"
                    value={editFormData.fullName || ""}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="editPhone" className="form-label-custom">
                    Phone Number
                  </label>
                  <input
                    id="editPhone"
                    name="phone"
                    type="tel"
                    className="form-control-custom alladdress-edit-input"
                    value={editFormData.phone || ""}
                    onChange={handleEditChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="editStreet" className="form-label-custom">
                  Address
                </label>
                <textarea
                  id="editStreet"
                  name="street"
                  className="form-control-custom textarea-custom alladdress-edit-input"
                  value={editFormData.street || ""}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-4">
                  <label htmlFor="editCity" className="form-label-custom">
                    City/District
                  </label>
                  <input
                    id="editCity"
                    name="city"
                    type="text"
                    className="form-control-custom alladdress-edit-input"
                    value={editFormData.city || ""}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="editState" className="form-label-custom">
                    State
                  </label>
                  <input
                    id="editState"
                    name="state"
                    type="text"
                    className="form-control-custom alladdress-edit-input"
                    value={editFormData.state || ""}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="editLandmark" className="form-label-custom">
                    Land Mark
                  </label>
                  <input
                    id="editLandmark"
                    name="landmark"
                    type="text"
                    className="form-control-custom alladdress-edit-input"
                    value={editFormData.landmark || ""}
                    onChange={handleEditChange}
                  />
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-4">
                  <label htmlFor="editPincode" className="form-label-custom">
                    PinCode
                  </label>
                  <input
                    id="editPincode"
                    name="zip"
                    type="text"
                    className="form-control-custom alladdress-edit-input"
                    value={editFormData.zip || ""}
                    onChange={handleEditChange}
                    pattern="[0-9]{6}"
                    maxLength={6}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="editAlternativePhone" className="form-label-custom">
                    Alternative Phone number (Optional)
                  </label>
                  <input
                    id="editAlternativePhone"
                    name="alternativePhone"
                    type="tel"
                    className={`form-control-custom alladdress-edit-input ${editFormData.alternativePhone ? "" : "empty-field"}`}
                    value={editFormData.alternativePhone || ""}
                    onChange={handleEditChange}
                    placeholder="Enter Alternative Phone number"
                    maxLength={10}
                  />
                </div>
              </div>

              <div className="alladdress-edit-actions">
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-modal-save">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Address Modal */}
      {showModal && (
        <div
          className="alladdress-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div
            className="alladdress-custom-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-address-title"
          >
            <div className="alladdress-modal-header">
              <h2 id="add-address-title" className="alladdress-modal-heading">
                Add Address
              </h2>
              <button
                type="button"
                className="alladdress-modal-close"
                onClick={closeModal}
                aria-label="Close modal"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="modal-section-title">Address Type</div>
              <div className="type-radio-group">
                <div>
                  <input
                    type="radio"
                    name="addressType"
                    id="typeHome"
                    className="type-input"
                    checked={addressType === "Home"}
                    onChange={() => setAddressType("Home")}
                  />
                  <label htmlFor="typeHome" className={`type-label ${addressType === "Home" ? "home-active" : ""}`}>
                    <i className="fa-solid fa-house-chimney"></i> Home
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    name="addressType"
                    id="typeOffice"
                    className="type-input"
                    checked={addressType === "Office"}
                    onChange={() => setAddressType("Office")}
                  />
                  <label htmlFor="typeOffice" className={`type-label ${addressType === "Office" ? "home-active" : ""}`}>
                    <i className="fa-solid fa-building"></i> Office
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    name="addressType"
                    id="typeOther"
                    className="type-input"
                    checked={addressType === "Other"}
                    onChange={() => setAddressType("Other")}
                  />
                  <label htmlFor="typeOther" className={`type-label ${addressType === "Other" ? "home-active" : ""}`}>
                    <i className="fa-solid fa-address-book"></i> Other
                  </label>
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label htmlFor="fullName" className="form-label-custom">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    className="form-control-custom"
                    placeholder="Enter full name"
                    value={addressFormData.fullName}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="phone" className="form-label-custom">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="form-control-custom"
                    placeholder="Enter 10-digit mobile number"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    value={addressFormData.phone}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="street" className="form-label-custom">
                  Address
                </label>
                <textarea
                  id="street"
                  name="street"
                  className="form-control-custom textarea-custom"
                  placeholder="Enter house or building details"
                  value={addressFormData.street}
                  onChange={handleAddressChange}
                  required
                ></textarea>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-4">
                  <label htmlFor="city" className="form-label-custom">
                    City/District
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    className="form-control-custom"
                    placeholder="Enter City/District"
                    value={addressFormData.city}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="state" className="form-label-custom">
                    State
                  </label>
                  <input
                    id="state"
                    name="state"
                    type="text"
                    className="form-control-custom"
                    placeholder="Enter state"
                    value={addressFormData.state}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="landmark" className="form-label-custom">
                    Land Mark
                  </label>
                  <input
                    id="landmark"
                    name="landmark"
                    type="text"
                    className="form-control-custom"
                    placeholder="Enter landmark"
                    value={addressFormData.landmark}
                    onChange={handleAddressChange}
                  />
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-4">
                  <label htmlFor="zip" className="form-label-custom">
                    PinCode
                  </label>
                  <input
                    id="zip"
                    name="zip"
                    type="text"
                    className="form-control-custom"
                    placeholder="Enter pincode"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    value={addressFormData.zip}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="alternativePhone" className="form-label-custom">
                    Alternative Phone Number (Optional)
                  </label>
                  <input
                    id="alternativePhone"
                    name="alternativePhone"
                    type="tel"
                    className="form-control-custom"
                    placeholder="Enter alternative number"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    value={addressFormData.alternativePhone}
                    onChange={handleAddressChange}
                  />
                </div>
              </div>

              <div className="alladdress-modal-actions">
                <button type="button" className="btn-modal-cancel" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-modal-save">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}