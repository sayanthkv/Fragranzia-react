import React from 'react';
import './OrderTracking.css';
import { Link } from 'react-router-dom';

const OrderTracking = () => {
  const orders = [
    {
      id: '#FRG10234',
      status: 'Delivered',
      statusClass: 'status-delivered',
      title: 'Autograph eau de parfum 100ml for men',
      qty: 1,
      price: '₹2,499',
      image: 'bc3f99636b9c6b0ac4018141c1cce56e3c9bfd36.jpg',
    },
    {
      id: '#FRG10235',
      status: 'Out for Delivery',
      statusClass: 'status-out-for-delivery',
      title: 'Autograph eau de parfum 100ml for men',
      qty: 1,
      price: '₹2,499',
      image: 'bc3f99636b9c6b0ac4018141c1cce56e3c9bfd36.jpg',
    },
  ];

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
        
        
    <div className="ordertracking">
      <div className="container-fluid px-5">
        <div className="mx-2 py-4">
          <h1 className="mb-1" style={{ fontWeight: 700, fontSize: '2.2rem' }}>
            Profile
          </h1>
          <nav aria-label="breadcrumb" className="mb-4">
            <span className="text-muted" style={{ fontSize: '0.9rem' }}>
              Home &gt; Profile &gt; My Orders
            </span>
          </nav>

           <div className="tab-container">
                      <button className="tab-btn other-btn" type="button">
                        <Link to='/Profile'>Profile</Link>
                      </button>
                      <button className="tab-btn other-btn" type="button">
                        <Link to='/Alladdressview'>Address</Link>
                      </button>
                      <button className="tab-btn profile-btn" type="button">
                        <Link to='/OrderTracking'>My Order</Link>
                      </button>
                    </div>

          <div className="row">
            {orders.map((order, index) => (
              <div key={index} className="col-12 col-md-6 mb-4">
                <div className="order-card">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                      <p className="m-0 fw-bold">Order ID: {order.id}</p>
                    </div>
                    <div>
                      <span className={`status-badge ${order.statusClass}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="d-flex gap-3 align-items-center">
                    <div className="card-img-wrapper">
                      <img src={order.image} alt={order.title} />
                    </div>
                    <div>
                      <p className="m-0 fw-bold">{order.title}</p>
                      <small className="text-muted">Qty: {order.qty}</small>
                      <p className="mt-2 mb-0 fw-bold">{order.price}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default OrderTracking;