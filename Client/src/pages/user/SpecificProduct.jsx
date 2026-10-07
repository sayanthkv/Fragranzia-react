
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./SpecificProduct.css";

const SpecificProduct = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const API_URL = "http://localhost:5000/Products";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API_URL}/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    const fetchProducts = async () => {
      try {
        const res = await axios.get(API_URL);
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProduct();
    fetchProducts();
  }, [id]);

  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev);
  };

  const increaseQuantity = () => {
    if (product && quantity < product.quantity) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const shareProduct = async () => {
    const shareData = {
      title: product?.name || "Product",
      text: "Check out this product.",
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Product link copied to clipboard!");
      } catch (error) {
        alert("Unable to copy product link.");
      }
    }
  };

  if (!product) {
    return (
      <div className="specificproduct-loading">
        <h2>Loading product...</h2>
      </div>
    );
  }

  const discount =
    product.price > 0
      ? Math.round(
          ((product.price - product.saleprice) / product.price) * 100
        )
      : 0;

  const productImage = product.image
    ? `http://localhost:5000/uploads/${product.image}`
    : "/images/AUTOGRAPH_EDP_100ML_1.png";

  return (
    <div className="specificproduct-page">
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
      

     <div className="container-fluid specificproduct-wrapper">

  <div className="specificproduct-breadcrumb">
    <Link to="/">Home</Link>
    <span>&gt;</span>
    <Link to="/products">Products</Link>
    <span>&gt;</span>
    <span>{product.name}</span>
  </div>

  <div className="specificproduct-main">

    <div className="specificproduct-left">

      <div className="specificproduct-product-card">

        <div className="specificproduct-gallery">

          <div className="specificproduct-thumbnails">

            <div className="specificproduct-thumbnail active">
              <img
                src={productImage}
                alt={product.name}
              />
            </div>

            <div className="specificproduct-thumbnail">
              <img
                src={productImage}
                alt={product.name}
              />
            </div>

            <div className="specificproduct-thumbnail">
              <img
                src={productImage}
                alt={product.name}
              />
            </div>

          </div>

          <div className="specificproduct-main-image-wrapper">

            <div className="specificproduct-actions">

              <button
                className="specificproduct-action-btn"
                onClick={toggleFavorite}
                type="button"
              >
                <i
                  className={
                    isFavorite
                      ? "bi bi-heart-fill"
                      : "bi bi-heart"
                  }
                ></i>
              </button>

              <button
                className="specificproduct-action-btn"
                onClick={shareProduct}
                type="button"
              >
                <i className="bi bi-share"></i>
              </button>

            </div>

            <img
              src={productImage}
              alt={product.name}
              className="specificproduct-main-image"
            />

          </div>

        </div>

        <div className="specificproduct-purchase-buttons">

          <button
            className="specificproduct-buy-now"
            disabled={product.quantity <= 0}
          >
            Purchase Now
          </button>

          <button
            className="specificproduct-add-cart"
            disabled={product.quantity <= 0}
          >
            Add to Cart
          </button>

        </div>

      </div>

    </div>


    <div className="specificproduct-details">

      <h1>{product.name}</h1>

      <p className="specificproduct-brand">
        {product.category?.name || "Category"}
      </p>

      <div className="specificproduct-rating-row">

        <span className="specificproduct-rating">
          4.5
          <i className="bi bi-star-fill"></i>
        </span>

        <span className="specificproduct-rating-count">
          1,000 Ratings
        </span>

      </div>

      <p className="specificproduct-stock-message">
        Hurry only few stocks left!
      </p>

      <div className="specificproduct-price">

        <span className="specificproduct-sale-price">
          Rs {product.saleprice}
        </span>

        <span className="specificproduct-original-price">
          Rs {product.price}
        </span>

        <span className="specificproduct-discount">
          {discount}% off
        </span>

      </div>

      <div className="specificproduct-quantity">

        <div className="quantity-control">

          <button
            onClick={decreaseQuantity}
            type="button"
          >
            −
          </button>

          <span>{quantity}</span>

          <button
            onClick={increaseQuantity}
            type="button"
          >
            +
          </button>

        </div>

      </div>

      <hr className="specificproduct-divider" />

      <div className="specificproduct-section">

        <h3>Delivery</h3>

        <p>
          Delivery by 28 Aug, Wednesday |{" "}
          <span>Free</span>
        </p>

        <small>
          if ordered before 9:24 PM
        </small>

      </div>

      <div className="specificproduct-section">

        <h3>Description</h3>

        <p className="specificproduct-description-text">
          {product.description}
        </p>

      </div>

      <div className="specificproduct-section">

        <h3>Available Offers</h3>

        <ul className="specificproduct-offers">

          <li>
            <i className="bi bi-tag-fill"></i>
            <span>
              Buy two of the same product and get a third one free.
            </span>
          </li>

          <li>
            <i className="bi bi-tag-fill"></i>
            <span>
              Enjoy free standard shipping on orders exceeding ₹1,399.
            </span>
          </li>

          <li>
            <i className="bi bi-tag-fill"></i>
            <span>
              Get 15% off your first order
            </span>
          </li>

          <li>
            <i className="bi bi-tag-fill"></i>
            <span>
              Receive a free tool case with the purchase of any perfume over ₹2,000
            </span>
          </li>

        </ul>

      </div>

    </div>

  </div>

</div>
  <div className="container-fluid my-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold homepage-section-title homepage-offer-zone-title">
              Suggested for you
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
  {products.map((product, index) => (
    <div className="product-card-custom homepage-product-card-custom" key={index}>
      <div className="product-image-frame homepage-product-image-frame mb-3">
        <img
  src={`http://localhost:5000/uploads/${product.image}`}
  alt={product.name}
/>

      </div>
      <h5 className="product-title homepage-product-title mb-1">
        {product.name}
      </h5>
      <div className="mb-3 homepage-product-price">
        <span className="fw-bold fs-5">Rs {product.saleprice}</span>
        <span className="text-decoration-line-through text-muted ms-2 fs-6 small">
          Rs {product.price}
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

     
    </div>
  );
};

export default SpecificProduct;
