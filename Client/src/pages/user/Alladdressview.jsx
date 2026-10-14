
import React, { useEffect, useState } from "react";
import "./Alladdressview.css";
import { Link } from "react-router-dom";

const Alladdressview = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddressEditing, setShowAddressEditing] = useState(false);

  const [formData, setFormData] = useState({
    addressType: "home",
    fullName: "Priyesh",
    phone: "98785 43210",
    address: "Rumban villa kochi, Ruther road",
    city: "Kochi",
    state: "Kerala",
    landmark: "Near Lulu Mall",
    pincode: "675433",
    altPhone: "",
  });

  const [savedAddress, setSavedAddress] = useState(formData);

  useEffect(() => {
    const modalOpen = showEditModal || showAddressEditing;

    document.body.style.overflow = modalOpen ? "hidden" : "";

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowEditModal(false);
        setShowAddressEditing(false);
      }
    };

    if (modalOpen) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [showEditModal, showAddressEditing]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const openAddressEditing = () => {
    setFormData({ ...savedAddress });
    setShowAddressEditing(true);
  };

  const handleSave = (event) => {
    event.preventDefault();

    setSavedAddress({ ...formData });
    setShowAddressEditing(false);
    setShowEditModal(false);
  };

  const closeEditing = () => {
    setFormData({ ...savedAddress });
    setShowAddressEditing(false);
  };

  return (
    <>
      {/* NAVBAR */}
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
                <span className="icon-btn homepage-icon-btn">
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
                <span className="icon-btn homepage-icon-btn active">
                  <Link to="/Profile">
                    <i className="fa-regular fa-user"></i>
                  </Link>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* ADDRESS PAGE */}
      <div className="All-adressview">
        <div className="container-fluid px-5">
          <div className="mx-2 py-4">
            <h1 className="mb-1 address-page-title">Profile</h1>

            <nav aria-label="breadcrumb" className="mb-4 address-breadcrumb">
              <Link to="/">Home</Link> &gt; Address
            </nav>

            <div className="tab-container">
              <button className="other-btn" type="button">
                Profile
              </button>

              <button className="profile-btn" type="button">
                Address
              </button>

              <button className="other-btn" type="button">
                My Orders
              </button>

              <div className="ms-auto">
                <button className="btn-address" type="button">
                  Add Address
                </button>
              </div>
            </div>

            {/* ADDRESS CARD */}
            <div className="address-card">
              <div className="address-card-top">
                <span className="address-type-badge">
                  {savedAddress.addressType}
                </span>

                <button
                  type="button"
                  className="address-card-edit"
                  onClick={() => setShowEditModal(true)}
                >
                  <i className="fa-solid fa-pen"></i> Edit
                </button>
              </div>

              <h5>{savedAddress.fullName}</h5>
              <p>{savedAddress.phone}</p>

              <p>
                {savedAddress.address}, {savedAddress.city},{" "}
                {savedAddress.state} - {savedAddress.pincode}
              </p>

              {savedAddress.landmark && (
                <p>Landmark: {savedAddress.landmark}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FIRST MODAL: READ-ONLY ADDRESS DETAILS */}
      {showEditModal && !showAddressEditing && (
        <div
          className="address-details-overlay"
          onClick={() => setShowEditModal(false)}
        >
          <div
            className="address-details-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="address-details-header">
              <h5>Address Details</h5>

              <button
                type="button"
                className="address-close-button"
                onClick={() => setShowEditModal(false)}
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            <div className="address-details-body">
              <div className="details-type-title">Address Type</div>

              <div className="details-type-group">
                <span
                  className={`details-type-option ${
                    savedAddress.addressType === "home" ? "selected" : ""
                  }`}
                >
                  <i className="fa-solid fa-house-chimney"></i> Home
                </span>

                <span
                  className={`details-type-option ${
                    savedAddress.addressType === "office" ? "selected" : ""
                  }`}
                >
                  <i className="fa-solid fa-building"></i> Office
                </span>

                <span
                  className={`details-type-option ${
                    savedAddress.addressType === "other" ? "selected" : ""
                  }`}
                >
                  <i className="fa-solid fa-address-book"></i> Other
                </span>
              </div>

              <div className="details-field">
                <label>Full Name</label>
                <div className="details-readonly-field">
                  {savedAddress.fullName}
                </div>
              </div>

              <div className="details-field">
                <label>Phone Number</label>
                <div className="details-readonly-field">
                  {savedAddress.phone}
                </div>
              </div>

              <div className="details-field">
                <label>Address</label>
                <div className="details-readonly-field details-readonly-textarea">
                  {savedAddress.address}
                </div>
              </div>

              <div className="details-grid">
                <div className="details-field">
                  <label>City/District</label>
                  <div className="details-readonly-field">
                    {savedAddress.city}
                  </div>
                </div>

                <div className="details-field">
                  <label>State</label>
                  <div className="details-readonly-field">
                    {savedAddress.state}
                  </div>
                </div>

                <div className="details-field">
                  <label>Landmark</label>
                  <div className="details-readonly-field">
                    {savedAddress.landmark || "Not specified"}
                  </div>
                </div>

                <div className="details-field">
                  <label>Pincode</label>
                  <div className="details-readonly-field">
                    {savedAddress.pincode}
                  </div>
                </div>

                <div className="details-field details-alt-phone">
                  <label>Alternative Phone Number</label>
                  <div className="details-readonly-field">
                    {savedAddress.altPhone || "Not specified"}
                  </div>
                </div>
              </div>
            </div>

            <div className="address-details-footer">
              <button
                type="button"
                className="details-close-button"
                onClick={() => setShowEditModal(false)}
              >
                Close
              </button>

              <button
                type="button"
                className="details-edit-button"
                onClick={openAddressEditing}
              >
                <i className="fa-solid fa-pen"></i> Edit Address
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECOND MODAL: EDITABLE ADDRESS FORM */}
      {showAddressEditing && (
        <div
          className="address-edit-modal-overlay"
          onClick={closeEditing}
        >
          <div
            className="address-edit-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="address-edit-modal-header">
              <h5>Edit Address</h5>

              <button
                type="button"
                className="address-edit-close"
                onClick={closeEditing}
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="address-edit-modal-body">
                <div className="modal-section-title">Address Type</div>

                <div className="type-radio-group">
                  {[
                    { value: "home", label: "Home", icon: "fa-house-chimney" },
                    { value: "office", label: "Office", icon: "fa-building" },
                    { value: "other", label: "Other", icon: "fa-address-book" },
                  ].map((type) => (
                    <div key={type.value}>
                      <input
                        type="radio"
                        name="addressType"
                        id={`edit-${type.value}`}
                        className="type-input"
                        value={type.value}
                        checked={formData.addressType === type.value}
                        onChange={handleChange}
                      />

                      <label
                        htmlFor={`edit-${type.value}`}
                        className="type-label"
                      >
                        <i className={`fa-solid ${type.icon}`}></i>{" "}
                        {type.label}
                      </label>
                    </div>
                  ))}
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label htmlFor="edit-fullName" className="form-label-custom">
                      Full Name
                    </label>
                    <input
                      id="edit-fullName"
                      required
                      type="text"
                      name="fullName"
                      className="form-control-custom"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter full name"
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="edit-phone" className="form-label-custom">
                      Phone Number
                    </label>
                    <input
                      id="edit-phone"
                      required
                      type="tel"
                      name="phone"
                      className="form-control-custom"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="edit-address" className="form-label-custom">
                    Address
                  </label>
                  <textarea
                    id="edit-address"
                    required
                    name="address"
                    className="form-control-custom textarea-custom"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter address details"
                  />
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-4">
                    <label htmlFor="edit-city" className="form-label-custom">
                      City/District
                    </label>
                    <input
                      id="edit-city"
                      required
                      type="text"
                      name="city"
                      className="form-control-custom"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Enter city"
                    />
                  </div>

                  <div className="col-md-4">
                    <label htmlFor="edit-state" className="form-label-custom">
                      State
                    </label>
                    <input
                      id="edit-state"
                      required
                      type="text"
                      name="state"
                      className="form-control-custom"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Enter state"
                    />
                  </div>

                  <div className="col-md-4">
                    <label htmlFor="edit-landmark" className="form-label-custom">
                      Land Mark
                    </label>
                    <input
                      id="edit-landmark"
                      type="text"
                      name="landmark"
                      className="form-control-custom"
                      value={formData.landmark}
                      onChange={handleChange}
                      placeholder="Enter landmark"
                    />
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label htmlFor="edit-pincode" className="form-label-custom">
                      PinCode
                    </label>
                    <input
                      id="edit-pincode"
                      required
                      type="text"
                      name="pincode"
                      className="form-control-custom"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="Enter pincode"
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="edit-altPhone" className="form-label-custom">
                      Alternative Phone Number (Optional)
                    </label>
                    <input
                      id="edit-altPhone"
                      type="tel"
                      name="altPhone"
                      className="form-control-custom"
                      value={formData.altPhone}
                      onChange={handleChange}
                      placeholder="Enter alternative phone"
                    />
                  </div>
                </div>
              </div>

              <div className="address-edit-modal-footer">
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={closeEditing}
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
    </>
  );
};

export default Alladdressview;
