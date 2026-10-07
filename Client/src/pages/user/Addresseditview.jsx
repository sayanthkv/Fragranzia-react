import React from 'react';
import './AddressEditView.css';
import { Link } from 'react-router-dom';

const AddressEditView = () => {
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
                <span className="nav-link homepage-nav-link" >
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
    

    <div className="Adress_edit_view_classname">
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
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="modal-section-title">Address Type</div>
            <div className="type-radio-group">
              <div>
                <input
                  type="radio"
                  name="addressType"
                  id="typeHome"
                  className="type-input"
                  defaultChecked
                  disabled
                />
                <label htmlFor="typeHome" className="type-label home-active">
                  <i className="fa-house-chimney fa-solid"></i> Home
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  name="addressType"
                  id="typeOffice"
                  className="type-input"
                  disabled
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
                  disabled
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
                  className="form-control-custom"
                  defaultValue="Priyesh"
                  readOnly
                />
              </div>
              <div className="col-md-6">
                <label className="form-label-custom">Phone Number</label>
                <input
                  type="tel"
                  className="form-control-custom"
                  defaultValue="98785 43210"
                  readOnly
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label-custom">Address</label>
              <textarea
                className="form-control-custom textarea-custom"
                defaultValue="Rumban villa kochi, Ruther road"
                readOnly
              ></textarea>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-4">
                <label className="form-label-custom">City/District</label>
                <input
                  type="text"
                  className="form-control-custom"
                  defaultValue="Kochi"
                  readOnly
                />
              </div>
              <div className="col-md-4">
                <label className="form-label-custom">State</label>
                <input
                  type="text"
                  className="form-control-custom"
                  defaultValue="Kerala"
                  readOnly
                />
              </div>
              <div className="col-md-4">
                <label className="form-label-custom">Land Mark</label>
                <input
                  type="text"
                  className="form-control-custom"
                  defaultValue="Near Lulu Mall"
                  readOnly
                />
              </div>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <label className="form-label-custom">PinCode</label>
                <input
                  type="text"
                  className="form-control-custom"
                  defaultValue="675433"
                  readOnly
                />
              </div>
              <div className="col-md-4">
                <label className="form-label-custom">
                  Alternative Phone number(Optional)
                </label>
                <input
                  type="tel"
                  className="form-control-custom"
                  defaultValue="Enter Alternative Phone number"
                  readOnly
                />
              </div>
              <div className="col-md-4"></div>
            </div>

            <div className="d-flex justify-content-end">
              <button type="button" className="btn-modal-edit">
                <Link to="/AddressEditing">Edit</Link>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  );
};

export default AddressEditView;