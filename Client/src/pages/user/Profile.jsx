import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Profile.css';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [formData] = useState({
    fullName: 'Thomas',
    email: 'thomas12@gmail.com',
    phone: '+91 98765 43210',
    dob: '01/01/1995',
    gender: 'Male',
    password: 'password123',
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
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
    <div className="profile-root-wrapper">
      <div className="container-fluid px-md-5 px-3">
        <div className="mx-2 py-4">
          <h1 className="mb-1" style={{ fontWeight: 700, fontSize: '2.2rem' }}>
            Profile
          </h1>
          
          <nav aria-label="breadcrumb" className="mb-4">
            <span className="text-muted" style={{ fontSize: '0.9rem' }}>
              Home &gt; Profile
            </span>
          </nav>

          <div className="tab-container">
            <button className="tab-btn profile-btn" type="button">
              <Link to='/Profile'>Profile</Link>
            </button>
            <button className="tab-btn other-btn" type="button">
              <Link to='/Alladdressview'>Address</Link>
            </button>
            <button className="tab-btn other-btn" type="button">
              <Link to='/OrderTracking'>My Order</Link>
            </button>
          </div>

          <form className="row g-4" onSubmit={(e) => e.preventDefault()}>
            <div className="col-12 col-md-4">
              <label className="profile-form-label">Full Name</label>
              <input
                type="text"
                className="profile-custom-control"
                value={formData.fullName}
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
                <button
                  type="button"
                  className="profile-password-toggle"
                  onClick={togglePasswordVisibility}
                  aria-label="Toggle password visibility"
                >
                  <i className={`fa-regular ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                </button>
              </div>
            </div>

            <div className="col-12 text-end">
              <button type="button" className="profile-btn-edit">
                <Link to="/Profileedit">Edit</Link>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    </>
  );}
  