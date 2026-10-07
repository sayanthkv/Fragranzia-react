import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Wishlist.css";
import { Link } from "react-router-dom";
import { useState } from "react";


const INITIAL_WISHLIST_ITEMS = [
  {
    id: 1,
    title: "Autograph eau de parfum 100ml for men",
    price: 899,
    originalPrice: 2000,
    discountPercent: 61,
    image: "AUTOGRAPH_EDP_100ML_1 3 payment.png",
    alt: "Autograph EDP Red"
  },
  {
    id: 2,
    title: "Autograph eau de parfum 100ml for men",
    price: 899,
    originalPrice: 2000,
    discountPercent: 61,
    image: "AUTOGRAPH_EDP_100ML_1 3 payment.png",
    alt: "Autograph EDP Gold"
  },
  {
    id: 3,
    title: "Royal eau de parfum 100ml for men",
    price: 899,
    originalPrice: 2000,
    discountPercent: 61,
    image: "AUTOGRAPH_EDP_100ML_1 3 payment.png",
    alt: "Royal EDP"
  }
];

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState(INITIAL_WISHLIST_ITEMS);

  const handleDeleteItem = (id) => {
    setWishlistItems((prevItems) =>
      prevItems.filter((item) => item.id !== id)
    );
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light shadow-sm wishlist-navbar">
        <div className="container-fluid px-0">
          <span className="navbar-brand wishlist-brand">
            <Link to="/">Fragranzia</Link>
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

          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarContent"
          >
            <ul className="navbar-nav align-items-center gap-2">
              <li className="nav-item">
                <span className="nav-link wishlist-nav-link">
                  <Link to="/">Home</Link>
                </span>
              </li>

              <li className="nav-item">
                <span className="nav-link wishlist-nav-link">
                  <Link to="/Products">Products</Link>
                </span>
              </li>

              <li className="nav-item">
                <span className="nav-link wishlist-nav-link">
                  <Link to="/Gifting">Gifting</Link>
                </span>
              </li>

              <li className="nav-item me-3">
                <span className="nav-link wishlist-nav-link">
                  <Link to="/About">About</Link>
                </span>
              </li>

              <li className="nav-item me-2">
                <div className="wishlist-search">
                  <i className="fa-solid fa-magnifying-glass"></i>

                  <input
                    className="form-control"
                    type="search"
                    placeholder="Search Here"
                    aria-label="Search"
                  />
                </div>
              </li>

              <li className="nav-item">
                <span className="wishlist-icon">
                  <Link to="/Cart">
                    <i className="fa-solid fa-cart-shopping"></i>
                  </Link>
                </span>
              </li>

              <li className="nav-item">
                <button
                  className="wishlist-icon"
                  type="button"
                  aria-label="Notifications"
                >
                  <i className="fa-regular fa-bell"></i>
                </button>
              </li>

              <li className="nav-item">
                <span className="wishlist-icon">
                  <Link to="/Profile">
                    <i className="fa-regular fa-user"></i>
                  </Link>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main className="container wishlist-container">
        <h2 className="wishlist-heading">Wishlist</h2>

        <div className="wishlist-breadcrumb">
          Home &gt; Wishlist
        </div>

        {wishlistItems.length === 0 ? (
          <div className="wishlist-empty">
            <i className="fa-regular fa-heart"></i>

            <h4>Your wishlist is empty</h4>

            <p>
              Explore our fragrance collection and add your favorite products.
            </p>
          </div>
        ) : (
          <div className="row g-4">
            {wishlistItems.map((item) => (
              <div className="col-12 col-md-6" key={item.id}>
                <div className="wishlist-card">
                  <div className="wishlist-image">
                    <img src={item.image} alt={item.alt} />
                  </div>

                  <div className="wishlist-details">
                    <h3>{item.title}</h3>

                    <div className="wishlist-price">
                      <span className="wishlist-current-price">
                        Rs {item.price}
                      </span>

                      <span className="wishlist-original-price">
                        Rs {item.originalPrice}
                      </span>

                      <span className="wishlist-discount">
                        {item.discountPercent}% off
                      </span>
                    </div>

                    <div className="wishlist-actions">
                      <button
                        className="wishlist-delete"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        Remove
                      </button>

                      <button className="wishlist-cart">
                        Add to cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="wishlist-footer">
        <div className="container">
          <div className="row g-4">
            <div className="col-12 col-md-3">
              <h1 className="wishlist-footer-brand">Fragranzia</h1>
            </div>

            <div className="col-12 col-md-9">
              <div className="row g-4">
                <div className="col-6 col-sm-4">
                  <h5>Pages</h5>

                  <ul>
                    <li>
                      <Link to="/">Home</Link>
                    </li>

                    <li>
                      <Link to="/Products">Products</Link>
                    </li>

                    <li>
                      <Link to="/Gifting">Gifting</Link>
                    </li>

                    <li>
                      <Link to="/About">About</Link>
                    </li>

                    <li>
                      <Link to="/Profile">Profile</Link>
                    </li>
                  </ul>
                </div>

                <div className="col-6 col-sm-4">
                  <h5>Quick Links</h5>

                  <ul>
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
                      <a href="customer-service.html">
                        Customer Services
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="col-12 col-sm-4">
                  <h5>Contact & Social</h5>

                  <p>
                    <i className="fa-regular fa-envelope"></i>
                    ftrafurniture@gmail.com
                  </p>

                  <p>
                    <i className="fa-solid fa-phone"></i>
                    +91 9876543210
                  </p>

                  <p>
                    <strong>Social Media</strong>
                  </p>

                  <div className="wishlist-social-icons">
                    <i className="fa-brands fa-instagram"></i>
                    <i className="fa-brands fa-facebook"></i>
                    <i className="fa-brands fa-x-twitter"></i>
                    <i className="fa-brands fa-youtube"></i>
                    <i className="fa-brands fa-linkedin"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr />

          <div className="wishlist-footer-bottom">
            <div className="wishlist-footer-links">
              <span>Web Accessibility</span>
              <span>Terms of Use</span>
              <span>Privacy Statement</span>
              <span>Contact Us</span>
            </div>

            <div>
              © 2024 Fragranzia Company. All rights reserved
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Wishlist;

