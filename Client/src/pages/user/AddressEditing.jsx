import React, { useState } from 'react';
import './AddressEditing.css';
import { Link } from 'react-router-dom';

const AddressEditing = () => {
  const [formData, setFormData] = useState({
    addressType: 'home',
    fullName: 'Priyesh',
    phone: '98785 43210',
    address: 'Rumban villa kochi, Ruther road',
    city: 'Kochi',
    state: 'Kerala',
    landmark: 'Near Lulu Mall',
    pincode: '675433',
    altPhone: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Saved Address Data:', formData);
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
                   <Link to='/Gifting'>Gifting</Link>
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
    
    
    <div className="adress-editing-classname">
      <div
        className="container-fluid px-5"
        style={{ filter: 'blur(1px)', opacity: 0.4 }}
      >
        <div className="mx-2 py-4">
          <h1 className="mb-1" style={{ fontWeight: 700, fontSize: '2.2rem' }}>
            Profile
          </h1>
          <nav aria-label="breadcrumb" className="mb-4">
            <span className="text-muted" style={{ fontSize: '0.9rem' }}>
              Home &gt; Address
            </span>
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
        </div>
      </div>

      <div className="modal-overlay">
        <div className="custom-modal">
          <form onSubmit={handleSubmit}>
            <div className="modal-section-title">Address Type</div>
            <div className="type-radio-group">
              <div>
                <input
                  type="radio"
                  name="addressType"
                  id="typeHome"
                  className="type-input"
                  value="home"
                  checked={formData.addressType === 'home'}
                  onChange={handleChange}
                />
                <label htmlFor="typeHome" className="type-label">
                  <i className="fa-house-chimney fa-solid"></i> Home
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  name="addressType"
                  id="typeOffice"
                  className="type-input"
                  value="office"
                  checked={formData.addressType === 'office'}
                  onChange={handleChange}
                />
                <label htmlFor="typeOffice" className="type-label">
                  <i className="fa-solid fa-building"></i> Office
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  name="addressType"
                  id="typeOther"
                  className="type-input"
                  value="other"
                  checked={formData.addressType === 'other'}
                  onChange={handleChange}
                />
                <label htmlFor="typeOther" className="type-label">
                  <i className="fa-solid fa-address-book"></i> Other
                </label>
              </div>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label-custom">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  className="form-control-custom"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label-custom">Phone Number</label>
                <input
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
              <label className="form-label-custom">Address</label>
              <textarea
                name="address"
                className="form-control-custom textarea-custom"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address details"
              ></textarea>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-4">
                <label className="form-label-custom">City/District</label>
                <input
                  type="text"
                  name="city"
                  className="form-control-custom"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter City/District"
                />
              </div>
              <div className="col-md-4">
                <label className="form-label-custom">State</label>
                <input
                  type="text"
                  name="state"
                  className="form-control-custom"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Enter state"
                />
              </div>
              <div className="col-md-4">
                <label className="form-label-custom">Land Mark</label>
                <input
                  type="text"
                  name="landmark"
                  className="form-control-custom"
                  value={formData.landmark}
                  onChange={handleChange}
                  placeholder="Enter landmark"
                />
              </div>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <label className="form-label-custom">PinCode</label>
                <input
                  type="text"
                  name="pincode"
                  className="form-control-custom"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="Enter pincode"
                />
              </div>
              <div className="col-md-4">
                <label className="form-label-custom">
                  Alternative Phone number(Optional)
                </label>
                <input
                  type="tel"
                  name="altPhone"
                  className="form-control-custom"
                  value={formData.altPhone}
                  onChange={handleChange}
                  placeholder="Enter Alternative Phone number"
                />
              </div>
              <div className="col-md-4"></div>
            </div>

            <div className="d-flex justify-content-end">
              <button type="submit" className="btn-modal-save">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  );
};

export default AddressEditing;