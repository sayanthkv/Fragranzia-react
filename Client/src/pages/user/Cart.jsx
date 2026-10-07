import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Cart.css"
import { Link } from "react-router-dom";
import { useState } from "react";

const INITIAL_CART_ITEMS = [
  {
    id: 1,
    title: 'Autograph eau de parfum 100ml for men',
    price: 899,
    originalPrice: 2000,
    discountPercent: 61,
    qty: 1,
    image: 'AUTOGRAPH_EDP_100ML_1 3 payment.png',
    alt: 'Autograph EDP Red'
  },
  {
    id: 2,
    title: 'Autograph eau de parfum 100ml for men',
    price: 899,
    originalPrice: 2000,
    discountPercent: 61,
    qty: 1,
    image: 'AUTOGRAPH_EDP_100ML_1 3 payment.png',
    alt: 'Autograph EDP Gold'
  },
  {
    id: 3,
    title: 'Royal eau de parfum 100ml for men',
    price: 899,
    originalPrice: 2000,
    discountPercent: 61,
    qty: 1,
    image: 'AUTOGRAPH_EDP_100ML_1 3 payment.png',
    alt: 'Royal EDP'
  }
];

const Cart = () =>{
    


  const [cartItems, setCartItems] = useState(INITIAL_CART_ITEMS);

  // Handlers
  const handleQuantityChange = (id, delta) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const newQty = item.qty + delta;
          return { ...item, qty: newQty > 0 ? newQty : 1 };
        }
        return item;
      })
    );
  };

  const handleDeleteItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleShare = (title) => {
    if (navigator.share) {
      navigator.share({
        title: title,
        url: window.location.href
      }).catch(() => {});
    } else {
      alert(`Share link copied for: ${title}`);
    }
  };

  // Dynamic Calculations
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.originalPrice * item.qty, 0);
  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const totalDiscount = subtotal - totalAmount;


    return(
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
                <span className="icon-btn homepage-icon-btn active"  aria-label="Cart" >
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
        <div className="container my-4">
      <div className="row g-4">
        {/* Left Column: Cart items */}
        <div className="col-12 col-lg-8">
          <h2 className="fw-bold mb-1">Cart</h2>
          <div className="text-muted small mb-4">Home &gt; Cart</div>

          {cartItems.length === 0 ? (
            <div className="cart-empty-state text-center p-5">
              <i className="fa-solid fa-cart-shopping fa-3x mb-3 text-muted"></i>
              <h4>Your cart is empty</h4>
              <p className="text-muted">Explore our fragrance collection and add items to your cart.</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div className="cart-item-card" key={item.id}>
                <div className="row align-items-center g-3">
                  <div className="col-12 col-sm-3 text-center">
                    <img
                      src={item.image}
                      alt={item.alt}
                      className="img-fluid"
                      style={{ maxHeight: '120px' }}
                    />
                  </div>
                  <div className="col-12 col-sm-9">
                    <div className="cart-product-title">{item.title}</div>

                    <div className="d-flex align-items-center cart-qty-container mb-2">
                      <button
                        className="cart-qty-btn"
                        onClick={() => handleQuantityChange(item.id, -1)}
                      >
                        -
                      </button>
                      <input
                        type="text"
                        className="cart-qty-input"
                        value={item.qty}
                        readOnly
                      />
                      <button
                        className="cart-qty-btn"
                        onClick={() => handleQuantityChange(item.id, 1)}
                      >
                        +
                      </button>
                    </div>

                    <div className="mb-3 d-flex align-items-baseline gap-2">
                      <span className="fw-bold fs-5">Rs {item.price}</span>
                      <span className="text-muted text-decoration-line-through small">
                        Rs {item.originalPrice}
                      </span>
                      <span className="fw-bold text-success small">
                        {item.discountPercent}% off
                      </span>
                    </div>

                    <div className="d-flex flex-wrap gap-2">
                      <button
                        className="btn cart-action-btn cart-btn-delete"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        Delete
                      </button>
                      <button
                        className="btn cart-action-btn cart-btn-share"
                        onClick={() => handleShare(item.title)}
                      >
                        Share
                      </button>
                      <button className="btn cart-action-btn cart-btn-buy">
                        Buy
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Column: Summary info */}
        <div className="col-12 col-lg-4 mt-lg-5 pt-lg-3">
          <div className="cart-summary-box">
            <h4 className="fw-bold mb-4">Check Out</h4>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <span>Price ({totalItemsCount} item{totalItemsCount !== 1 ? 's' : ''})</span>
              <span className="fw-bold">Rs {subtotal.toLocaleString()}</span>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <span>Discount</span>
              <span className="fw-bold">Rs {totalDiscount.toLocaleString()}</span>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <span>Delivery Charge</span>
              <span className="text-success fw-medium">Free</span>
            </div>

            <hr style={{ borderTop: '1px solid #cbd5e1', opacity: 1 }} className="my-3" />

            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="fw-bold fs-5">Total Amount</span>
              <span className="fw-bold fs-4">Rs {totalAmount.toLocaleString()}</span>
            </div>

            <button className="btn cart-btn-proceed">Proceed to Buy</button>

            <div className="cart-trust-text">
              Safe and Secure Payments. Easy<br />
              returns.100% Authentic products.
            </div>
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
    )
}
export default Cart