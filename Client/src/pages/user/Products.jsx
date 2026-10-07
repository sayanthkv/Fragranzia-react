import React, { useState,useEffect } from "react";
import "./Products.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Link } from "react-router-dom";
import axios from "axios";

import photo10 from "../../assets/photo10.png"
import photo11 from "../../assets/photo11.png"
// import photo12 from "../../assets/photo12.png"
import photo13 from "../../assets/photo13.png"
import photo14 from "../../assets/photo14.png"
import photo15 from "../../assets/photo15.png"
import photo16 from "../../assets/photo16.png"
import photo17 from "../../assets/photo17.png"
import filter from "../../assets/filter.png"


  

const Products = () => {

   const [Productsitems,setProductsitems] =useState([])
  
 const API_URL = "http://localhost:5000/Products";

const fetchproduct =  async () => {
    let res = await axios.get(API_URL)
    setProductsitems(res.data)
  }
  
    useEffect(() => {
        fetchproduct();
      }, []);
  

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
                <span className="nav-link active homepage-nav-link" >
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
                <span
                  className="icon-btn homepage-icon-btn"

                  aria-label="Profile"
                >
                  <Link to='/Profile'><i className="fa-regular fa-user"></i></Link>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <section className="festive-banner homepage-festive-banner">
        <span>
          <b>ENJOY FESTIVE DISCOUNTS! FREE SHIPPING ABOVE 999 !</b>
        </span>
      </section>


      <section className="productpage-section mx-3 mx-md-5 my-4">
        <div className="productpage-header-row d-flex flex-wrap align-items-center justify-content-between mb-4">
          <div className="productpage-product-head">
            <h3 className="productpage-title">All Products</h3>
            <p className="productpage-breadcrumb">Home &gt; Products</p>
          </div>

          <div className="productpage-filteropt">
            <ul className="productpage-filter-list">
              <li className="productpage-filter-label">Sort By:</li>
              <li className="productpage-filter-item productpage-filter-active">
                <b>Relevance</b>
              </li>
              <li className="productpage-filter-item">Newest First</li>
              <li className="productpage-filter-item">Popularity</li>
              <li className="productpage-filter-item">Price--Low to High</li>
              <li className="productpage-filter-item">Price--High to Low</li>
              <li className="productpage-filter-item">
                <button className="productpage-filterbtn" type="button">
                  <img
                    src={filter}
                    alt=""
                    className="productpage-filter-icon"
                  />
                  Filter
                </button>
              </li>
            </ul>
          </div>
        </div>
        </section>

        <section>
          
          <div className="productpage-row row g-4 justify-content-center justify-content-lg-between mb-4">
            {Productsitems.map((products,index)=>(
                <div className="productpage-col col-12 col-md-6 col-lg-4 d-flex justify-content-center" key={index}>
              <Link to={`/SpecificProduct/${products._id}`}><div className="productpage-card card bg-transparent">
                <img
                  className="productpage-product-img"
                  src={`http://localhost:5000/uploads/${products.image}`}
                  alt="Kyros Eau De Parfum 100ml for Men"
                />
                <div className="productpage-card-body card-body px-0">
                  <h5 className="productpage-card-title card-title">
                    {products.name}
                  </h5>
                  <p className="productpage-card-text card-text">
                    <span className="productpage-price">Rs {products.price}</span>
                    <span className="productpage-old-price">
                      <s>Rs {products.saleprice}</s>
                    </span>
                  </p>
                </div>
                <Link to={'/Cart'}><button type="button" className="productpage-add-to-cart">
                  Add to Cart
                </button></Link>
              </div></Link>
            </div>
            ))}
            
          </div>

          {/* Load More */}
          <div className="productpage-loadmore d-flex justify-content-center my-5">
            <button type="button" className="productpage-loadmore-btn">
              Load More
            </button>
          </div>
        </section>
         <footer className="py-5 mt-5 homepage-footer">
                <div className="container">
                  <div className="row g-4 align-items-start">
                    <div className="col-12 col-md-3 pt-5 mt-4">
                      <h1 className="homepage-footer-brand" style={{ color: "#043948" }}>
                        <b>Fragranzia</b>
                      </h1>
                    </div>
        
                    <div className="col-12 col-md-9">
                      <div className="row g-4">
                        <div className="col-6 col-sm-4">
                          <h5 className="homepage-footer-heading" style={{ color: "#043948" }}>
                            <b>Pages</b>
                          </h5>
                          <ul className="list list-unstyled lh-lg homepage-footer-list">
                            <li>
                              <span><Link to='/' >Home</Link></span>
                            </li>
                            <li>
                              <span><Link to='/Products' >Products</Link></span>
                            </li>
                            <li>
                              <span><Link to='/Gifting' >Gifting</Link></span>
                            </li>
                            <li>
                              <span><Link to='/About' >About</Link></span>
                            </li>
                            <li>
                              <span><Link to='/Profile' >Profile</Link></span>
                            </li>
                          </ul>
                        </div>
                        <div className="col-6 col-sm-4">
                          <h5 className="homepage-footer-heading" style={{ color: "#043948" }}>
                            <b>Quick Links</b>
                          </h5>
                          <ul className="list-unstyled lh-lg homepage-footer-list">
                            <li>
                              <a href="privacy.html">Privacy Policy</a>
                            </li>
                            <li>
                              <a href="terms.html">Terms and Conditions</a>
                            </li>
                            <li>
                              <a href="faqs.html">FAQs</a>
                            </li>
                            <li>
                              <a href="customer-service.html">Customer Services</a>
                            </li>
                          </ul>
                        </div>
                        <div className="col-12 col-sm-4">
                          <h5 className="homepage-footer-heading" style={{ color: "#043948" }}>
                            <b>Contact & Social</b>
                          </h5>
                          <p className="mb-1 homepage-footer-contact">
                            <i className="fa-regular fa-envelope me-2"></i>
                            ftrafurniture@gmail.com
                          </p>
                          <p className="mb-3 homepage-footer-contact">
                            <i className="fa-solid fa-phone me-2"></i>
                            +91 9876543210
                          </p>
                          <p className="mb-2 homepage-footer-social-title">
                            <b>Social Media</b>
                          </p>
                          <div className="d-flex gap-3 homepage-footer-social-icons">
                            <i className="fa-brands fa-instagram fa-lg"></i>
                            <i className="fa-brands fa-facebook fa-lg"></i>
                            <i className="fa-brands fa-x-twitter fa-lg"></i>
                            <i className="fa-brands fa-youtube fa-lg"></i>
                            <i className="fa-brands fa-linkedin fa-lg"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr className="my-4 homepage-footer-divider" />
        
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                    <ul className="d-flex list-unstyled gap-3 mb-0 flex-wrap justify-content-center homepage-footer-bottom-links">
                      <li>Web Accessibility</li>
                      <li>Terms of Use</li>
                      <li>Privacy Statement</li>
                      <li>Contact Us</li>
                    </ul>
                    <div className="text-muted text-center text-md-end small homepage-footer-copyright">
                      © 2024 fragranzia Company. All rights reserved
                    </div>
                  </div>
                </div>
              </footer>
      </>
      )
}

      export default Products
