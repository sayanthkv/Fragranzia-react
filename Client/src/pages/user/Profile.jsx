import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom"; 
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Profile.css";
import UserService from "../../services/user-api-services/UserService";

export default function Profile() {
  const [searchParams] = useSearchParams(); 
  const [activeTab, setActiveTab] = useState("profile");

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
    phone: "+91 98765 43210",
    dob: "",
    gender: "",
    password: "",
  });

  const { getUserdata, updatedetails, getOrders } = UserService();

  const togglePasswordVisibility = () => setShowPassword((previous) => !previous);

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
  const [editFormData, setEditFormData] = useState({
    
  });
  const [addressType, setAddressType] = useState("Home");

  const { saveaddress, fetchdata: fetchAddressesFromService, updateaddress, setprimary } = UserService();

  const [addressFormData, setAddressFormData] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    country: "",
    zip: "",
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
      await saveaddress(addressFormData);
      setShowModal(false);
      setAddressFormData({
        fullName: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        country: "",
        zip: "",
      });

      await getAddresses();
      alert("Address saved successfully!");
    } catch (error) {
      console.error(
        "Failed to save address:",
        error.response?.data || error.message
      );
      alert(
        error.response?.data?.message ||
        "Failed to save address. Please try again."
      );
    }
  };

  const getAddresses = async () => {
    try {
      setLoading(true);
      const response = await fetchAddressesFromService();
      setAddresses(response.addresses || []);
    } catch (error) {
      console.error(
        "Failed to fetch addresses:",
        error.response?.data || error.message
      );
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
        address: editFormData.address,
        city: editFormData.city,
        state: editFormData.state,
        pincode: editFormData.pincode,
        country: selectedAddress.country,
      });

      await getAddresses();
      setShowEditModal(false);
      setShowViewModal(false);
      alert("Address updated successfully!");
    } catch (error) {
      console.error(
        "Failed to update address:",
        error.response?.data || error.message
      );
      alert(
        error.response?.data?.message ||
          "Failed to update address. Please try again."
      );
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
      case "Shipped":
      case "Out for Delivery":
        return "bg-info text-dark";
      default:
        return "bg-warning text-dark";
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light shadow-sm homepage-navbar">
        <div className="container-fluid px-0">
          <span className="navbar-brand homepage-navbar-brand">
            <Link to='/'>Fragranzia</Link>
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
                  <Link to='/'>Home</Link>
                </span>
              </li>
              <li className="nav-item">
                <span className="nav-link homepage-nav-link">
                  <Link to='/Products'>Products</Link>
                </span>
              </li>
              <li className="nav-item">
                <span className="nav-link homepage-nav-link">
                  <Link to='/Wishlist'>Wishlist</Link>
                </span>
              </li>
              <li className="nav-item me-3">
                <span className="nav-link homepage-nav-link">
                  <Link to='/About'>About</Link>
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
                  <Link to='/Cart'><i className="fa-solid fa-cart-shopping"></i></Link>
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
                  <Link to='/Profile'><i className="fa-regular fa-user"></i></Link>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="profile-root-wrapper">
        <div className="container-fluid px-md-5 px-3">
          <div className="mx-2 py-4">
            <h1 className="mb-1" style={{ fontWeight: 700, fontSize: "2.2rem" }}>Profile</h1>
            <nav aria-label="breadcrumb" className="mb-4">
              <span className="text-muted" style={{ fontSize: "0.9rem" }}>
                Home &gt; {activeTab === "profile" ? "Profile" : activeTab === "address" ? "Address" : "My Order"}
              </span>
            </nav>
            <div className="tab-container">
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
                        type={showPassword ? 'text' : 'password'}
                        className="profile-custom-control"
                        value={formData.password}
                        readOnly
                        style={{ letterSpacing: showPassword ? 'normal' : '3px' }}
                      />
                    </div>
                  </div>

                  <div className="col-12 text-end">
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
                              className={`address-card h-100 ${isPrimary ? 'primary-card' : ''}`}
                              style={
                                isPrimary
                                  ? {
                                      borderColor: '#198754',
                                      boxShadow: '0 0.5rem 1rem rgba(25, 135, 84, 0.25)',
                                      backgroundColor: '#f8fff9',
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
                                    <i className="fa-solid fa-location-dot"></i> Saved
                                  </span>
                                </div>
                              </div>

                              <div className="fw-bold my-2 address-name">{address.fullName}</div>
                              <p className="address-text">
                                {address.street}, {address.city}, {address.state}, {address.country} {address.zip}
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

            {activeTab === "orders" && (
              <section className="profile-orders-section">
                {Array.isArray(orders) && orders.length > 0 ? (
                  <div className="d-flex flex-column gap-3">
                    {orders.map((order) => (
                      <div key={order._id} className="card shadow-lg border-0 p-3">
                        <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                          <div>
                            <span className="fw-bold text-dark me-2">Order ID: #{order._id}</span>
                            <small className="text-muted">
                              Placed on {new Date(order.createdAt).toLocaleDateString("en-IN")}
                            </small>
                          </div>
                          <span className={`badge ${getStatusBadge(order.deliveryStatus)} px-3 py-2 fs-6`}>
                            {order.deliveryStatus}
                          </span>
                        </div>

                        {/* Iterating through order items */}
                        {Array.isArray(order.orderItems) && order.orderItems.map((item, idx) => (
                          <div key={item._id || idx} className="d-flex align-items-center gap-3 py-2 border-bottom">
                            <img
                              src={`http://localhost:5000/uploads/${item.product?.image || "default.png"}`}
                              alt={item.product?.name || "Product"}
                              style={{ width: "70px", height: "70px", objectFit: "cover", borderRadius: "8px" }}
                            />
                            <div className="flex-grow-1">
                              <h6 className="mb-1 fw-bold">{item.product?.name || "Product Title"}</h6>
                              <small className="text-muted d-block">Quantity: {item.quantity}</small>
                            </div>
                            <div className="text-end fw-bold fs-6">
                              Rs {order.totalPrice ? (order.totalPrice * item.quantity).toLocaleString("en-IN") : 0}
                            </div>
                          </div>
                        ))}

                        <div className="d-flex justify-content-between align-items-center pt-3">
                          <span className="text-muted">
                            Payment: <strong>{order.paymentMethod?.toUpperCase()}</strong> ({order.paymentStatus})
                          </span>
                          <span className="fs-5 fw-bold text-dark">
                            Total: Rs {Number(order.totalPrice * order.quantity || 0).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    ))}
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
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className="profileedit-custom-control"
                    value={formData.password}
                    onChange={handleChange}
                    readOnly
                    style={{ letterSpacing: showPassword ? 'normal' : '3px' }}
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
                        checked={true}
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
                        checked={false}
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
                        checked={false}
                        readOnly
                      />
                      <label htmlFor="viewTypeOther" className="type-label">
                        <i className="fa-solid fa-address-book"></i> Other
                      </label>
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label htmlFor="viewFullName" className="form-label-custom">Full Name</label>
                      <input
                        id="viewFullName"
                        className="form-control-custom alladdress-view-input"
                        value={selectedAddress.fullName || ""}
                        readOnly
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="viewPhone" className="form-label-custom">Phone Number</label>
                      <input
                        id="viewPhone"
                        className="form-control-custom alladdress-view-input"
                        value={selectedAddress.phone || ""}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="viewAddress" className="form-label-custom">Address</label>
                    <textarea
                      id="viewAddress"
                      className="form-control-custom textarea-custom alladdress-view-input"
                      value={selectedAddress.street || ""}
                      readOnly
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-4">
                      <label htmlFor="viewCity" className="form-label-custom">City/District</label>
                      <input
                        id="viewCity"
                        className="form-control-custom alladdress-view-input"
                        value={selectedAddress.city || ""}
                        readOnly
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="viewState" className="form-label-custom">State</label>
                      <input
                        id="viewState"
                        className="form-control-custom alladdress-view-input"
                        value={selectedAddress.state || ""}
                        readOnly
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="viewLandmark" className="form-label-custom">Land Mark</label>
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
                      <label htmlFor="viewPincode" className="form-label-custom">PinCode</label>
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
                          address: selectedAddress.street || "",
                          city: selectedAddress.city || "",
                          state: selectedAddress.state || "",
                          landmark: selectedAddress.landmark || "",
                          pincode: selectedAddress.zip || "",
                          alternativePhone: selectedAddress.alternativePhone || "",
                        });
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
                  <label htmlFor="editFullName" className="form-label-custom">Full Name</label>
                  <input id="editFullName" name="fullName" type="text" className="form-control-custom alladdress-edit-input" value={editFormData.fullName} onChange={handleEditChange} required />
                </div>
                <div className="col-md-6">
                  <label htmlFor="editPhone" className="form-label-custom">Phone Number</label>
                  <input id="editPhone" name="phone" type="tel" className="form-control-custom alladdress-edit-input" value={editFormData.phone} onChange={handleEditChange} required />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="editAddress" className="form-label-custom">Address</label>
                <textarea id="editAddress" name="address" className="form-control-custom textarea-custom alladdress-edit-input" value={editFormData.address} onChange={handleEditChange} required />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-4">
                  <label htmlFor="editCity" className="form-label-custom">City/District</label>
                  <input id="editCity" name="city" type="text" className="form-control-custom alladdress-edit-input" value={editFormData.city} onChange={handleEditChange} required />
                </div>
                <div className="col-md-4">
                  <label htmlFor="editState" className="form-label-custom">State</label>
                  <input id="editState" name="state" type="text" className="form-control-custom alladdress-edit-input" value={editFormData.state} onChange={handleEditChange} required />
                </div>
                <div className="col-md-4">
                  <label htmlFor="editLandmark" className="form-label-custom">Land Mark</label>
                  <input id="editLandmark" name="landmark" type="text" className="form-control-custom alladdress-edit-input" value={editFormData.landmark} onChange={handleEditChange} />
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-4">
                  <label htmlFor="editPincode" className="form-label-custom">PinCode</label>
                  <input id="editPincode" name="pincode" type="text" className="form-control-custom alladdress-edit-input" value={editFormData.pincode} onChange={handleEditChange} pattern="[0-9]{6}" maxLength={6} required />
                </div>
                <div className="col-md-4">
                  <label htmlFor="editAlternativePhone" className="form-label-custom">Alternative Phone number (Optional)</label>
                  <input id="editAlternativePhone" name="alternativePhone" type="tel" className={`form-control-custom alladdress-edit-input ${editFormData.alternativePhone ? "" : "empty-field"}`} value={editFormData.alternativePhone} onChange={handleEditChange} placeholder="Enter Alternative Phone number" maxLength={10} />
                </div>
                <div className="col-md-4"></div>
              </div>

              <div className="alladdress-edit-actions">
                <button type="button" className="btn-modal-cancel" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="submit" className="btn-modal-save">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                  <label htmlFor="fullName" className="form-label-custom">Full Name</label>
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
                  <label htmlFor="phone" className="form-label-custom">Phone Number</label>
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
                <label htmlFor="address" className="form-label-custom">Address</label>
                <textarea
                  id="address"
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
                  <label htmlFor="city" className="form-label-custom">City/District</label>
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
                  <label htmlFor="state" className="form-label-custom">State</label>
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
                  <label htmlFor="landmark" className="form-label-custom">Land Mark</label>
                  <input
                    id="landmark"
                    name="country"
                    type="text"
                    className="form-control-custom"
                    placeholder="Enter landmark"
                    value={addressFormData.country}
                    onChange={handleAddressChange}
                  />
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-4">
                  <label htmlFor="pincode" className="form-label-custom">PinCode</label>
                  <input
                    id="pincode"
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