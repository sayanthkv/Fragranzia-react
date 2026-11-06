import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
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
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/Products">Products</Link></li>
                  <li><Link to="/Products?type=gifting">Gifting</Link></li>
                  <li><Link to="/About">About</Link></li>
                  <li><Link to="/Profile">Profile</Link></li>
                </ul>
              </div>

              <div className="col-6 col-sm-4">
                <h5 className="homepage-footer-heading" style={{ color: "#043948" }}>
                  <b>Quick Links</b>
                </h5>
                <ul className="list-unstyled lh-lg homepage-footer-list">
                  <li><a href="/privacy">Privacy Policy</a></li>
                  <li><a href="/terms">Terms and Conditions</a></li>
                  <li><a href="/faqs">FAQs</a></li>
                  <li><a href="/customer-service">Customer Services</a></li>
                </ul>
              </div>

              <div className="col-12 col-sm-4">
                <h5 className="homepage-footer-heading" style={{ color: "#043948" }}>
                  <b>Contact & Social</b>
                </h5>
                <p className="mb-1 homepage-footer-contact">
                  <i className="fa-regular fa-envelope me-2"></i>
                  admin@fragranzia.com
                </p>
                <p className="mb-3 homepage-footer-contact">
                  <i className="fa-solid fa-phone me-2"></i>
                  +91 9876543210
                </p>
                <p className="mb-2 homepage-footer-social-title">
                  <b>Social Media</b>
                </p>
                <div className="d-flex gap-3 homepage-footer-social-icons">
                  <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                    <i className="fa-brands fa-instagram fa-lg"></i>
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                    <i className="fa-brands fa-facebook fa-lg"></i>
                  </a>
                  <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X Twitter">
                    <i className="fa-brands fa-x-twitter fa-lg"></i>
                  </a>
                  <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
                    <i className="fa-brands fa-youtube fa-lg"></i>
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                    <i className="fa-brands fa-linkedin fa-lg"></i>
                  </a>
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
            © 2026 Fragranzia Company. All rights reserved
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;