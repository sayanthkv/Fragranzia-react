import React from 'react';
import './Alladdressview.css';
import { Link } from 'react-router-dom';

const Alladdressview = () => {
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
    
    <div className="All-adressview">
      <div className="container-fluid px-5">
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
                      <button className="tab-btn other-btn" type="button">
                        <Link to='/Profile'>Profile</Link>
                      </button>
                      <button className="tab-btn profile-btn" type="button">
                        <Link to='/Alladdressview'>Address</Link>
                      </button>
                      <button className="tab-btn other-btn" type="button">
                        <Link to='/OrderTracking'>My Order</Link>
                      </button>

                      <div className="ms-auto">
              <span  className="btn-address">
                <Link to="/Newaddress">Add Address</Link>
              </span>
            </div>
          </div>

                    
            
          <div className="address-card">
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="address-title">Address 2</h2>
              <div className="d-flex align-items-center gap-2">
      <button type="button" className="btn-edit-badge">
        <i className="fa-solid fa-pen-to-square"></i> <Link to ="/Addresseditview">Edit</Link>
      </button>

      <span className="badge-tag">
        <i className="fa-solid fa-building"></i> Office
      </span>
    </div>
            </div>

            <div className="name-label">Priyesh Manu</div>

            <p className="address-text">
              Helpstir Technologies 3rd Floor, Lulu Cyber Tower Infopark Phase 2 Kakkanad, Kochi - 682042
            </p>

            <div className="phone-text">
              <i
                className="fa-solid fa-phone fa-flip-horizontal"
                style={{ fontSize: '0.75rem', color: '#555' }}
              ></i>
              +91 98765 43210
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Alladdressview;