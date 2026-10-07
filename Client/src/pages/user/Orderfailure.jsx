import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Orderfailure.css"
import { Link } from "react-router-dom";
import { useState } from "react";

const details = [{
  name:"Rohan Jaison",
  address:" Apartment No. 104, Emerald Heights Opposite Lulu Mall,Edappally, Kochi Kerala 682024",
  ph:"+919856330022"
},{
  name:"Rohan Jaison",
  address:" Apartment No. 104, Emerald Heights Opposite Lulu Mall,Edappally, Kochi Kerala 682024",
  ph:"+919856330022"
},{
  name:"Rohan Jaison",
  address:" Apartment No. 104, Emerald Heights Opposite Lulu Mall,Edappally, Kochi Kerala 682024",
  ph:"+919856330022"
}]


const Orderfailure = () => {
  
  const [quantity, setQuantity] = useState(1);

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
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
       


    <div className="container py-4">
      <div className="main row">
        {/* Left Section */}
        <div className="left-section col-12 col-md-7">
          <div className="sec1main row">
            
            {/* Product Card */}
            <div className="section1 p-3 mt-3">
              <div className="row align-items-center g-3">
                <div className="col-12 col-sm-4 text-center text-sm-start">
                  <img
                    src="AUTOGRAPH_EDP_100ML_1 3 payment.png"
                    alt="Autograph EDP"
                    className="img-fluid product-img"
                  />
                </div>

                <div className="col-12 col-sm-8">
                  <span className="fw-bolder fs-5 d-block">
                    Autograph eau de parfum 100ml for men
                  </span>
                  <span>
                    Autograph 4.5{' '}
                    <i
                      className="fa-solid fa-star"
                      style={{ color: 'rgb(99, 230, 190)' }}
                    ></i>
                  </span>

                  {/* Quantity Control */}
                  <div
                    className="input-group align-items-center border border-3 border-color-dark overflow-hidden mt-3"
                    style={{ maxWidth: '130px' }}
                  >
                    <button
                      className="btn btn-link text-dark text-decoration-none px-3"
                      type="button"
                      onClick={handleDecrease}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      className="form-control text-center bg-transparent border-0 p-0 shadow-none fw-bold"
                      value={quantity}
                      readOnly
                      min="1"
                    />
                    <button
                      className="btn btn-link text-dark text-decoration-none px-3"
                      type="button"
                      onClick={handleIncrease}
                    >
                      +
                    </button>
                  </div>

                  <div className="mt-3">
                    <span className="fw-bold fs-4">Rs 899</span>
                    <span className="py-3 mx-2">
                      <s>Rs 2000</s>
                    </span>
                    <span className="text-success fw-bold">61% Off</span>
                  </div>

                  <div className="mt-2 text-muted small">
                    <span>
                      Delivered by August 29, Free delivery{' '}
                      <i className="fa-solid fa-truck fa-xs"></i>
                    </span>
                    <br />
                    <span className="text-success fw-medium">
                      7 Days Return Policy
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Details & Categories */}
            <div className="H1 col-12">
              <h3 className="fw-bold my-5 mx-0">Personal Details</h3>
              <div className="button d-flex gap-4 flex-wrap">
                <button type="button" className="icon-btn a">
                  <b>
                    <a href="Profile-address.html">Add Address+</a>
                  </b>
                </button>
                <button
                  type="button"
                  style={{ backgroundColor: '#043948', color: 'white' }}
                >
                  <b>
                    <i className="fa-solid fa-house"></i> Home
                  </b>
                </button>
                <button type="button">
                  <b>
                    <i className="fa-solid fa-building"></i> Office
                  </b>
                </button>
                <button type="button">
                  <b>
                    <i className="fa-solid fa-address-book"></i> Other
                  </b>
                </button>
              </div>
            </div>

            {/* Address Overflow Container */}
            <div className="addressoverflow mt-4">
              
                    <h4 className="fw-bold my-3 mx-0">Address</h4>
                    {details.map((Content,ind)=>(
                  <div className="H2 col-12 mb-3" key={ind}>
                <div className="section2 p-3">
                  <h4 className="fw-bolder px-2">{Content.name}</h4>
                  <p className="m-2">
                    {Content.address}
                  </p>
                  <p className="m-2">{Content.ph}</p>
                </div>
              </div>
              ))}
            </div>

          </div>
        </div>

        {/* Right Section */}
        <div className="Right-section col-12 col-md-5">
          {/* Price Breakdown */}
          <div className="section21 p-3 mt-3">
            <div className="row align-items-center g-3">
              <h3 className="fw-bold mb-4 fs-4 text-dark">Price Details</h3>

              <div className="d-flex justify-content-between align-items-center mb-0 fs-6">
                <span>Price (1 item)</span>
                <div>
                  <span className="fw-bold">Rs 899</span>
                  <span className="text-muted ms-1">
                    <del>Rs 2000</del>
                  </span>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-0 fs-6">
                <span>Discount (61%)</span>
                <span>Rs 1101</span>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-0 fs-6">
                <span>Delivery Charge</span>
                <span className="text-success fw-medium">Free Delivery</span>
              </div>

              <hr className="mb-0 border-top border-secondary border-opacity-50" />

              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-bold fs-5">Total Amount</span>
                <span className="fw-bold fs-3 text-dark">Rs 899</span>
              </div>
            </div>
          </div>

          {/* Payment Options */}
          <div className="section22 p-4 mt-3">
            <h3 className="fw-bold mb-4 fs-4 text-dark">Payment Methods</h3>

            <div className="d-flex flex-column gap-4">
              <label className="d-flex justify-content-between align-items-center w-100 cursor-pointer">
                <div className="d-flex align-items-center gap-3">
                  <i
                    className="fa-brands fa-google-pay fs-2 text-dark"
                    style={{ width: '35px' }}
                  ></i>
                  <span className="fw-medium fs-6">Google Pay</span>
                </div>
                <input
                  className="form-check-input border-secondary m-0"
                  type="radio"
                  name="paymentMethod"
                  value="gpay"
                  defaultChecked
                  style={{ width: '1.4rem', height: '1.4rem' }}
                />
              </label>

              <label className="d-flex justify-content-between align-items-center w-100 cursor-pointer">
                <div className="d-flex align-items-center gap-3">
                  <i
                    className="fa-solid fa-money-bill-wave fs-4 text-secondary"
                    style={{ width: '35px' }}
                  ></i>
                  <span className="fw-medium fs-6">
                    Cash on delivery (cash/UPI)
                  </span>
                </div>
                <input
                  className="form-check-input border-secondary m-0"
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  style={{ width: '1.4rem', height: '1.4rem' }}
                />
              </label>

              <label className="d-flex justify-content-between align-items-center w-100 cursor-pointer">
                <div className="d-flex align-items-center gap-3">
                  <i
                    className="fa-solid fa-wallet fs-4 text-secondary"
                    style={{ width: '35px' }}
                  ></i>
                  <span className="fw-medium fs-6">
                    Paytm/Phone Pay/Amazon Pay etc
                  </span>
                </div>
                <input
                  className="form-check-input border-secondary m-0"
                  type="radio"
                  name="paymentMethod"
                  value="wallets"
                  style={{ width: '1.4rem', height: '1.4rem' }}
                />
              </label>

              <label className="d-flex justify-content-between align-items-center w-100 cursor-pointer">
                <div className="d-flex align-items-center gap-3">
                  <i
                    className="fa-regular fa-credit-card fs-4 text-secondary"
                    style={{ width: '35px' }}
                  ></i>
                  <span className="fw-medium fs-6">Credit/Debit card</span>
                </div>
                <input
                  className="form-check-input border-secondary m-0"
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  style={{ width: '1.4rem', height: '1.4rem' }}
                />
              </label>

              <label className="d-flex justify-content-between align-items-center w-100 cursor-pointer">
                <div className="d-flex align-items-center gap-3">
                  <i
                    className="fa-solid fa-building-columns fs-4 text-secondary"
                    style={{ width: '35px' }}
                  ></i>
                  <span className="fw-medium fs-6">Net Banking</span>
                </div>
                <input
                  className="form-check-input border-secondary m-0"
                  type="radio"
                  name="paymentMethod"
                  value="netbanking"
                  style={{ width: '1.4rem', height: '1.4rem' }}
                />
              </label>
            </div>

            <button
              className="btn w-100 mt-4 py-3 fw-bold text-white fs-5"
              style={{ backgroundColor: '#043948', borderRadius: '8px' }}
            >
              Pay Now
            </button>
          </div>
        </div>
      </div>
    </div>
            
              <div className="orderfailure-overlay">

      <div className="orderfailure-modal">

        {/* Failure Icon */}
        <div className="orderfailure-icon">

          <svg
            width="75"
            height="75"
            viewBox="0 0 75 75"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21 21L54 54M54 21L21 54"
              stroke="white"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

        </div>

        {/* Failure Heading */}
        <h2 className="orderfailure-title">
          Your order has failed!
        </h2>

        {/* Failure Message */}
        <p className="orderfailure-message">
          Your order can't be completed
          <br />
          Please check your internet connection!
        </p>

        {/* Buttons - Static */}
        <div className="orderfailure-buttons">

          <button
            type="button"
            className="orderfailure-home-btn"
          >
            <Link to='/'>Back to Home</Link>
          </button>

          <button
            type="button"
            className="orderfailure-retry-btn"
          >
            Retry
          </button>

        </div>

      </div>

    </div>

      </>

)  }

export default Orderfailure
