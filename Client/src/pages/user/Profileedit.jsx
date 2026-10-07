import React, { useState } from 'react';
import './Profileedit.css';
import { Link } from 'react-router-dom';

export default function EditProfile() {
  
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: 'Thomas',
    email: 'thomas12@gmail.com',
    phone: '+91 98765 43210',
    dob: '01/01/1995',
    gender: 'Male',
    password: 'password123',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Saved profile data:', formData);
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
    <div className="profileedit-root-wrapper">
      <div className="container-fluid px-md-5 px-3">
        <div className="mx-2 py-3">
          {/* Header section */}
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

          {/* Profile Info Form Grid */}
          <form className="row g-4" onSubmit={handleSubmit}>
            {/* Row 1 */}
            <div className="col-12 col-md-4">
              <label className="profileedit-form-label">Full Name</label>
              <input
                type="text"
                name="fullName"
                className="profileedit-custom-control"
                value={formData.fullName}
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

            {/* Row 2 */}
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
                  style={{ letterSpacing: showPassword ? 'normal' : '3px' }}
                />
                <button
                  type="button"
                  className="profileedit-password-toggle"
                  onClick={togglePasswordVisibility}
                  aria-label="Toggle password visibility"
                >
                  <i className={`fa-regular ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                </button>
              </div>
            </div>

            {/* Action Button Row */}
            <div className="col-12 text-end">
              <button type="submit" className="profileedit-btn-save">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  );
}