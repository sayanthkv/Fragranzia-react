
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Alladdressview.css";
import { Link } from "react-router-dom";

function ProfileAddress() {
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editAddressType, setEditAddressType] = useState("Home");
  const [editFormData, setEditFormData] = useState({
    fullName: "Priyesh",
    phone: "98785 43210",
    address: "Rumban villa kochi, Ruther road",
    city: "Kochi",
    state: "Kerala",
    landmark: "Near Lulu Mall",
    pincode: "675433",
    alternativePhone: "",
  });
  const [addressType, setAddressType] = useState("Home");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    landmark: "",
    pincode: "",
    alternativePhone: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSave = (event) => {
    event.preventDefault();

    console.log("Address Type:", addressType);
    console.log("Address Details:", formData);

    setShowModal(false);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditFormData((previousData) => ({ ...previousData, [name]: value }));
  };

  const handleEditSave = (event) => {
    event.preventDefault();
    console.log("Edited Address Type:", editAddressType);
    console.log("Edited Address Details:", editFormData);
    setShowEditModal(false);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="alladdress-page">
      {/* Navigation Bar */}
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
                          <span className="nav-link  homepage-nav-link" >
                             <Link to='/'>Home</Link>
                          </span>
                        </li>
                        <li className="nav-item">
                          <span className="nav-link homepage-nav-link" >
                            <Link to='/Products'>Products</Link>
                          </span>
                        </li>
                        <li className="nav-item">
                          <span className="nav-link homepage-nav-link" >
                             <Link to='/Wishlist'>Wishlist</Link>
                          </span>
                        </li>
                        <li className="nav-item me-3">
                          <span className="nav-link homepage-nav-link" >
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
                          <span className="icon-btn homepage-icon-btn"  aria-label="Cart">
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
                          <span
                            className="icon-btn homepage-icon-btn active"
                            
                            aria-label="Profile"
                          >
                           <Link to='/Profile'><i className="fa-regular fa-user"></i></Link>
                         </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </nav>

      {/* Address Page */}
      <main
        className={`alladdress-content ${
          showModal ? "alladdress-content-blurred" : ""
        }`}
      >
        <div className="container-fluid px-5">
          <div className="mx-2 py-4">
            <h1 className="alladdress-heading">Profile</h1>

            <nav aria-label="breadcrumb" className="mb-4">
              <span className="text-muted alladdress-breadcrumb">
                Home &gt; Address
              </span>
            </nav>

            <div className="tab-container">
              <Link to="/Profile" className="tab-btn other-btn">
                Profile
              </Link>

              <Link
                to="/Alladdressview"
                className="tab-btn profile-btn"
              >
                Address
              </Link>

              <Link
                to="/OrderTracking"
                className="tab-btn other-btn"
              >
                My Order
              </Link>

              <div className="ms-auto">
                <button
                  type="button"
                  className="btn-address"
                  onClick={() => setShowModal(true)}
                >
                  Add Address
                </button>
              </div>
            </div>

            {/* Existing Address Card */}
            <div className="address-card">
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="address-title">Address 2</h2>

                <span className="badge-tag">
                  <i className="fa-solid fa-building"></i>
                  Office
                </span>
              </div>

              <div className="fw-bold my-2 address-name">
                Priyesh Manu
              </div>

              <p className="address-text">
                Helpstir Technologies 3rd Floor, Lulu Cyber Tower
                Infopark Phase 2 Kakkanad, Kochi - 682042
              </p>

              <div className="alladdress-card-actions">
                <button
                  type="button"
                  className="alladdress-small-edit"
                  onClick={() => setShowViewModal(true)}
                  aria-label="View address details"
                >
                  <i className="fa-solid fa-pen-to-square"></i> Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Read-only Address Details Modal converted from the supplied HTML page */}
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
              <div className="modal-section-title">Address Type</div>
              <div className="type-radio-group alladdress-view-type-group">
                <div>
                  <input type="radio" name="viewAddressType" id="viewTypeHome" className="type-input" checked={true} readOnly />
                  <label htmlFor="viewTypeHome" className="type-label home-active"><i className="fa-solid fa-house-chimney"></i> Home</label>
                </div>
                <div>
                  <input type="radio" name="viewAddressType" id="viewTypeOffice" className="type-input" checked={false} readOnly />
                  <label htmlFor="viewTypeOffice" className="type-label"><i className="fa-solid fa-building"></i> Office</label>
                </div>
                <div>
                  <input type="radio" name="viewAddressType" id="viewTypeOther" className="type-input" checked={false} readOnly />
                  <label htmlFor="viewTypeOther" className="type-label"><i className="fa-solid fa-address-book"></i> Other</label>
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label htmlFor="viewFullName" className="form-label-custom">Full Name</label>
                  <input id="viewFullName" className="form-control-custom alladdress-view-input" value="Priyesh" readOnly />
                </div>
                <div className="col-md-6">
                  <label htmlFor="viewPhone" className="form-label-custom">Phone Number</label>
                  <input id="viewPhone" className="form-control-custom alladdress-view-input" value="98785 43210" readOnly />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="viewAddress" className="form-label-custom">Address</label>
                <textarea id="viewAddress" className="form-control-custom textarea-custom alladdress-view-input" value="Rumban villa kochi, Ruther road" readOnly />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-4">
                  <label htmlFor="viewCity" className="form-label-custom">City/District</label>
                  <input id="viewCity" className="form-control-custom alladdress-view-input" value="Kochi" readOnly />
                </div>
                <div className="col-md-4">
                  <label htmlFor="viewState" className="form-label-custom">State</label>
                  <input id="viewState" className="form-control-custom alladdress-view-input" value="Kerala" readOnly />
                </div>
                <div className="col-md-4">
                  <label htmlFor="viewLandmark" className="form-label-custom">Land Mark</label>
                  <input id="viewLandmark" className="form-control-custom alladdress-view-input" value="Near Lulu Mall" readOnly />
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-4">
                  <label htmlFor="viewPincode" className="form-label-custom">PinCode</label>
                  <input id="viewPincode" className="form-control-custom alladdress-view-input" value="675433" readOnly />
                </div>
                <div className="col-md-4">
                  <label htmlFor="viewAlternativePhone" className="form-label-custom">Alternative Phone number (Optional)</label>
                  <input id="viewAlternativePhone" className="form-control-custom alladdress-view-input" value="Enter Alternative Phone number" readOnly />
                </div>
                <div className="col-md-4"></div>
              </div>

              <div className="alladdress-view-actions">
                <button
                  type="button"
                  className="btn-modal-edit"
                  onClick={() => {
                    setShowViewModal(false);
                    setShowEditModal(true);
                  }}
                >
                  Edit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Address Modal converted from the supplied HTML document */}
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
              <h2
                id="add-address-title"
                className="alladdress-modal-heading"
              >
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
              {/* Address Type */}
              <div className="modal-section-title">
                Address Type
              </div>

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

                  <label
                    htmlFor="typeHome"
                    className={`type-label ${
                      addressType === "Home" ? "home-active" : ""
                    }`}
                  >
                    <i className="fa-solid fa-house-chimney"></i>
                    Home
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

                  <label
                    htmlFor="typeOffice"
                    className={`type-label ${
                      addressType === "Office" ? "home-active" : ""
                    }`}
                  >
                    <i className="fa-solid fa-building"></i>
                    Office
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

                  <label
                    htmlFor="typeOther"
                    className={`type-label ${
                      addressType === "Other" ? "home-active" : ""
                    }`}
                  >
                    <i className="fa-solid fa-address-book"></i>
                    Other
                  </label>
                </div>
              </div>

              {/* Full Name and Phone */}
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label
                    htmlFor="fullName"
                    className="form-label-custom"
                  >
                    Full Name
                  </label>

                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    className="form-control-custom"
                    placeholder="Enter full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label
                    htmlFor="phone"
                    className="form-label-custom"
                  >
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
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Address */}
              <div className="mb-3">
                <label
                  htmlFor="address"
                  className="form-label-custom"
                >
                  Address
                </label>

                <textarea
                  id="address"
                  name="address"
                  className="form-control-custom textarea-custom"
                  placeholder="Enter house or building details"
                  value={formData.address}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              {/* City, State and Landmark */}
              <div className="row g-3 mb-3">
                <div className="col-md-4">
                  <label
                    htmlFor="city"
                    className="form-label-custom"
                  >
                    City/District
                  </label>

                  <input
                    id="city"
                    name="city"
                    type="text"
                    className="form-control-custom"
                    placeholder="Enter City/District"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label
                    htmlFor="state"
                    className="form-label-custom"
                  >
                    State
                  </label>

                  <input
                    id="state"
                    name="state"
                    type="text"
                    className="form-control-custom"
                    placeholder="Enter state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label
                    htmlFor="landmark"
                    className="form-label-custom"
                  >
                    Land Mark
                  </label>

                  <input
                    id="landmark"
                    name="landmark"
                    type="text"
                    className="form-control-custom"
                    placeholder="Enter landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Pincode and Alternative Phone */}
              <div className="row g-3 mb-4">
                <div className="col-md-4">
                  <label
                    htmlFor="pincode"
                    className="form-label-custom"
                  >
                    PinCode
                  </label>

                  <input
                    id="pincode"
                    name="pincode"
                    type="text"
                    className="form-control-custom"
                    placeholder="Enter pincode"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label
                    htmlFor="alternativePhone"
                    className="form-label-custom"
                  >
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
                    value={formData.alternativePhone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="alladdress-modal-actions">
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={closeModal}
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
    </div>
  );
}

export default ProfileAddress;
