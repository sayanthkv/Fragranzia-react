import React from "react";
import "./Paymentpagetwo.css";
import { Link } from "react-router-dom";
import photo10 from "../../assets/photo10.png"
import photo11 from "../../assets/photo11.png"

import photo13 from "../../assets/photo13.png"
import photo14 from "../../assets/photo14.png"
import photo15 from "../../assets/photo15.png"
import photo16 from "../../assets/photo16.png"
import photo17 from "../../assets/photo17.png"


const Productsitems =[
  {
    image:photo10,
    name:"Autograph Eau De Parfum 100ml For Men",
    price:"Rs 650",
    oldprice:"Rs 1400"
  }, {
    image:photo11,
    name:"Kyros Eau De Parfum 100ml For Men",
    price:"Rs 899",
    oldprice:"Rs 2000"
  },
   {
    image:photo13,
    name:"Autograph Eau De Parfum 100ml For Men",
    price:"Rs 999",
    oldprice:"Rs 2241"
  },
  {
    image:photo14,
    name:"Royal Eau De Parfum 100ml For Men",
    price:"Rs 650",
    oldprice:"Rs 1200"
  },
  {
    image:photo15,
    name:"Royal Eau De Parfum 100ml For Men",
    price:"Rs 650",
    oldprice:"Rs 1200"
  },
  {
    image:photo16,
    name:"Royal Eau De Parfum 100ml For Men",
    price:"Rs 650",
    oldprice:"Rs 1200"
  },
  {
    image:photo17,
    name:"Royal Eau De Parfum 100ml For Men",
    price:"Rs 650",
    oldprice:"Rs 1200"
  },

]

const thumbnails = [
  "AUTOGRAPH_EDP_100ML_1.png",
  "AUTOGRAPH_EDP_100ML_3.png",
  "AUTOGRAPH_EDP_100ML-_5.png",
];

const offers = [
  "Buy two of the same product and get a third one free.",
  "Enjoy free standard shipping on orders exceeding ₹1,399.",
  "Get 15% off your first order",
  "Receive a free tool case with the purchase of any perfume over ₹2,000",
];

const Paymentpagetwo = () => {
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
                <span className="nav-link active homepage-nav-link" >
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

        <section className="productpagetwo-container">

      {/* Breadcrumb */}
      <div className="productpagetwo-breadcrumb">
        Home &gt; Products &gt; Kyros Eau De Parfum 100ml for Men
      </div>

      <div className="productpagetwo-layout">

        {/* LEFT SIDE - PRODUCT GALLERY */}
        <div className="productpagetwo-gallery-card">

          <div className="productpagetwo-gallery">

            {/* Thumbnail Images */}
            <div className="productpagetwo-thumbnails">

              {thumbnails.map((image, index) => (
                <div
                  className={`productpagetwo-thumbnail ${
                    index === 0
                      ? "productpagetwo-active-thumbnail"
                      : ""
                  }`}
                  key={index}
                >
                  <img
                    src={`/images/${image}`}
                    alt={`Product thumbnail ${index + 1}`}
                  />
                </div>
              ))}

            </div>

            {/* Main Product Image */}
            <div className="productpagetwo-main-image">

              {/* Wishlist and Share Icons */}
              <div className="productpagetwo-image-actions">

                <button
                  className="productpagetwo-icon-btn"
                  type="button"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  >
                    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
                  </svg>
                </button>

                <button
                  className="productpagetwo-icon-btn"
                  type="button"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  >
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <path d="m8.7 10.7 6.6-4.4M8.7 13.3l6.6 4.4" />
                  </svg>
                </button>

              </div>

              <img
                className="productpagetwo-main-product-img"
                src="/images/AUTOGRAPH_EDP_100ML_1.png"
                alt="Autograph Eau De Parfum"
              />

            </div>

          </div>

          {/* Product Buttons */}
          <div className="productpagetwo-buttons">

            <button
              className="productpagetwo-purchase-btn"
              type="button"
            >
              Purchase Now
            </button>

            <button
              className="productpagetwo-add-cart-btn"
              type="button"
            >
              Add to Cart
            </button>

          </div>

        </div>

        {/* RIGHT SIDE - PRODUCT DETAILS */}
        <div className="productpagetwo-info">

          <h1 className="productpagetwo-heading">
            Autograph eau de parfum 100ml for men
          </h1>

          <p className="productpagetwo-brand">
            Autograph
          </p>

          {/* Rating */}
          <div className="productpagetwo-rating">

            <span className="productpagetwo-rating-badge">
              4.5 <span>★</span>
            </span>

            <span className="productpagetwo-rating-count">
              1,000 Ratings
            </span>

          </div>

          {/* Stock Status */}
          <p className="productpagetwo-stock-warning">
            Hurry only few stocks left!
          </p>

          {/* Price */}
          <div className="productpagetwo-price">

            <span className="productpagetwo-current-price">
              Rs 899
            </span>

            <span className="productpagetwo-old-price">
              Rs 2000
            </span>

            <span className="productpagetwo-discount">
              61% off
            </span>

          </div>

          {/* Quantity - Static */}
          <div className="productpagetwo-quantity">

            <button type="button">-</button>

            <span>1</span>

            <button type="button">+</button>

          </div>

          <hr className="productpagetwo-divider" />

          {/* Delivery */}
          <div className="productpagetwo-delivery">

            <h2>Delivery</h2>

            <p>
              Delivery by 28 Aug, Wednesday |{" "}
              <span>Free</span>
            </p>

            <small>
              if ordered before 9:24 PM
            </small>

          </div>

          {/* Description */}
          <div className="productpagetwo-description">

            <h2>Description</h2>

            <p>
              This fragrance exudes a confident and enigmatic personality.
              Its composition features a top note of lemon and mandarin
              with a twist of apple that enhances the freshness. The heart
              reveals a warm blend of high-grade lavender and a hint of
              cinnamon, beautifully wrapped in patchouli, musk, and vanilla
              to ensure a powerful and flowing scent.
            </p>

          </div>

          {/* Available Offers */}
          <div className="productpagetwo-offers">

            <h2>Available Offers</h2>

            <ul>
              {offers.map((offer, index) => (
                <li key={index}>

                  <span className="productpagetwo-offer-tag">
                    ◆
                  </span>

                  <span>{offer}</span>

                </li>
              ))}
            </ul>

          </div>

        </div>

      </div>

    </section>

 <div className="container-fluid my-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold homepage-section-title homepage-offer-zone-title">
              Offer Zone
            </h2>
            <div className="d-flex gap-2">
              <button
                className="scroll-arrow-btn homepage-scroll-arrow-btn"
                type="button"
                onClick={() => {}}
                aria-label="Previous offers"
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              <button
                className="scroll-arrow-btn homepage-scroll-arrow-btn"
                type="button"
                onClick={() => {}}
                aria-label="Next offers"
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>

          <div
  className="product-slider-container homepage-product-slider-container d-flex gap-4"
  id="offerSlider"
>
  {Productsitems.map((product, index) => (
    <div className="product-card-custom homepage-product-card-custom" key={index}>
      <div className="product-image-frame homepage-product-image-frame mb-3">
        <img src={product.image} alt={product.name} />
      </div>
      <h5 className="product-title homepage-product-title mb-1">
        {product.name}
      </h5>
      <div className="mb-3 homepage-product-price">
        <span className="fw-bold fs-5">{product.price}</span>
        <span className="text-decoration-line-through text-muted ms-2 fs-6 small">
          {product.oldprice}
        </span>
      </div>
      <button className="btn-add-cart homepage-btn-add-cart">Add to Cart</button>
    </div>
  ))}
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
  )}

  export default Paymentpagetwo