import React from 'react';
import './About.css';
import { Link } from 'react-router-dom';
import pic1 from "./../../assets/login.jpg"
import pic2 from "./../../assets/signup.jpg"

const About = () => {
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
                <span className="nav-link active homepage-nav-link" >
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

    <div className="container my-5">
      <div className="row align-items-center g-4">
        <div className="col-12 col-md-7">
          <h3 style={{ color: '#043948' }}>
            <b>About Fragranzia</b>
          </h3>
          <nav aria-label="breadcrumb">
            <span className="text-muted">Home &gt; About</span>
          </nav>
          <p
            className="mt-3"
            style={{ color: '#333', fontSize: '1.1rem', lineHeight: '1.6' }}
          >
            At Fragranzia, we believe that a perfume is more than just a scent—it's
            a story, an art, and a science combined to create memories that
            linger. Our journey began with a vision to craft exquisite fragrances
            that capture the essence of individuality and elevate every moment into
            something timeless.
            <br />
            <br />
            Guided by passion and precision, we source the finest ingredients from
            around the world to create perfumes that resonate with authenticity
            and luxury. Each bottle is a masterpiece, meticulously crafted to
            deliver an unparalleled sensory experience.
            <br />
            <br />
            Our commitment goes beyond creating fragrances. We aim to inspire
            confidence, evoke emotions, and celebrate uniqueness through every
            drop we produce. Fragranzia isn’t just a brand—it’s a celebration of
            you, your style, and your moments.
            <br />
            <br />
            With a legacy built on quality, artistry, and innovation, we invite
            you to explore our collection and find a scent that speaks your
            story.
          </p>
        </div>

        <div className="col-12 col-md-5 text-center imgmain">
          <div className="d-flex flex-column align-items-center">
            <img
              src={pic1}
              alt="Fragrance Image 1"
              className="img-fluid img1"
            />
            <img
              src={pic2}
              alt="Fragrance Image 2"
              className="img-fluid img2 "
            />
          </div>
        </div>
      </div>
    </div>
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
  );
};

export default About;