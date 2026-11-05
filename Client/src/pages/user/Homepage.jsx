import React, { useState, useEffect, useRef } from "react";
import "./Homepage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import UserService from "../../services/user-api-services/UserService";
import MosqueSilhouetteBackground from "../../assets/MosqueSilhouetteBackground.png";
import photo1 from "../../assets/photo1.png";
import photo2 from "../../assets/photo2.png";
import PerfumeBottleLarge from "../../assets/Perfume Bottle Large.png";
import PerfumeBottleSmall from "../../assets/Perfume Bottle Small.png";
import PerfumeBottleLarge2 from "../../assets/PerfumeBottleLarge2.png";
import PerfumeBottleSmall2 from "../../assets/PerfumeBottleSmall2.png";
import photo3 from "../../assets/photo3.png";
import S1 from "../../assets/S1.png";
import S2 from "../../assets/S2.png";
import S3 from "../../assets/S3.png";
import c1 from "../../assets/c1.webp";
import c2 from "../../assets/c2.jpg";
import c3 from "../../assets/c3.jpg";
import c4 from "../../assets/c4.webp";
import c5 from "../../assets/c5.webp";
import b1 from "../../assets/b1.png";

const Homepage = () => {
  const navigate = useNavigate();
  const {
    getProduct,
    Addproducttocart,
    addToWishlist,
    getWishlist,
    removeProductFromWishlist,
  } = UserService();

  const [Productsitems, setProductsitems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState(() => new Set());
  const [wishlistLoadingId, setWishlistLoadingId] = useState(null);

  // References for horizontal scrolling
  const featuredSliderRef = useRef(null);
  const offerSliderRef = useRef(null);

  const scrollSlider = (ref, offset) => {
    if (ref.current) {
      ref.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadHomepage = async () => {
      try {
        setLoading(true);
        const products = await getProduct();
        if (isMounted) {
          setProductsitems(Array.isArray(products) ? products : []);
        }
      } catch (error) {
        console.error("Failed to load products:", error);
        toast.error("Failed to load products.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }

      try {
        const response = await getWishlist();
        const wishlist = response?.wishlist || [];
        const savedIds = wishlist.map((item) =>
          String(item.productId || item.id || item._id)
        );
        if (isMounted) {
          setWishlistIds(new Set(savedIds));
        }
      } catch (error) {
        console.error(
          "Failed to load wishlist:",
          error.response?.data || error.message
        );
      }
    };

    loadHomepage();

    return () => {
      isMounted = false;
    };
  }, []);

  const Addtocart = async (id) => {
    try {
      const response = await Addproducttocart(id);
      toast.success(response?.message || "Product added to cart successfully!");
    } catch (error) {
      console.error("Add to cart error:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        toast.error("Please login to add products to your cart.");
      } else {
        toast.error(
          error.response?.data?.message || "Unable to add product to cart."
        );
      }
    }
  };

  const addTotheWishlist = async (productId) => {
    const id = String(productId);
    if (wishlistLoadingId !== null) return;

    const alreadyFavorite = wishlistIds.has(id);

    try {
      setWishlistLoadingId(id);

      if (alreadyFavorite) {
        await removeProductFromWishlist(id);
        setWishlistIds((previous) => {
          const updated = new Set(previous);
          updated.delete(id);
          return updated;
        });
        toast.success("Product removed from wishlist.");
      } else {
        await addToWishlist(id);
        setWishlistIds((previous) => {
          const updated = new Set(previous);
          updated.add(id);
          return updated;
        });
        toast.success("Product added to wishlist.");
      }
    } catch (error) {
      console.error(
        "Wishlist error:",
        error.response?.data || error.message
      );
      if (error.response?.status === 401) {
        toast.error("Please login to manage your wishlist.");
      } else {
        toast.error(
          error.response?.data?.message || "Unable to update wishlist. Please try again."
        );
      }
    } finally {
      setWishlistLoadingId(null);
    }
  };

  const categoryList = [
    { title: "Eau De Parfum", image: c1 },
    { title: "Eau de Cologne", image: c2 },
    { title: "Extrait de Parfum", image: c3 },
    { title: "Body Mist", image: c4 },
    { title: "Pour Homme", image: c5 },
  ];

  return (
    <>
      <Toaster
        position="top-center"
        containerStyle={{
          top: 85,
          zIndex: 99999,
        }}
        toastOptions={{
          duration: 5000,
          style: {
            background: "#043948",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: "500",
            borderRadius: "8px",
            padding: "12px 20px",
            boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
          },
          success: {
            iconTheme: {
              primary: "#2ec4b6",
              secondary: "#ffffff",
            },
          },
          error: {
            style: {
              background: "#721c24",
              color: "#ffffff",
            },
            iconTheme: {
              primary: "#f5c6cb",
              secondary: "#721c24",
            },
          },
        }}
      />

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light shadow-sm homepage-navbar">
        <div className="container-fluid px-0">
          <span className="navbar-brand homepage-navbar-brand">
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
                <span className="nav-link active homepage-nav-link">
                  <Link to="/">Home</Link>
                </span>
              </li>
              <li className="nav-item">
                <span className="nav-link homepage-nav-link">
                  <Link to="/Products">Products</Link>
                </span>
              </li>
              <li className="nav-item">
                <span className="nav-link homepage-nav-link">
                  <Link to="/Wishlist">Wishlist</Link>
                </span>
              </li>
              <li className="nav-item me-3">
                <span className="nav-link homepage-nav-link">
                  <Link to="/About">About</Link>
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
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.target.value.trim()) {
                        navigate(`/Products?search=${encodeURIComponent(e.target.value.trim())}`);
                      }
                    }}
                  />
                </div>
              </li>
              <li className="nav-item">
                <span className="icon-btn homepage-icon-btn" aria-label="Cart">
                  <Link to="/Cart">
                    <i className="fa-solid fa-cart-shopping"></i>
                  </Link>
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
                <span className="icon-btn homepage-icon-btn" aria-label="Profile">
                  <Link to="/Profile">
                    <i className="fa-regular fa-user"></i>
                  </Link>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Festive Banner */}
      <section className="festive-banner homepage-festive-banner">
        <span>
          <b>ENJOY FESTIVE DISCOUNTS! FREE SHIPPING ABOVE 999 !</b>
        </span>
      </section>

      {/* Hero Carousel */}
      <section className="hero-section homepage-hero-section">
        <div
          id="carouselExampleIndicators"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-indicators">
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="0"
              className="active"
              aria-current="true"
              aria-label="Slide 1"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="1"
              aria-label="Slide 2"
            ></button>
          </div>

          <div className="carousel-inner">
            <div
              className="carousel-item active"
              style={{ backgroundColor: "#0b3c4d" }}
            >
              <img
                src={MosqueSilhouetteBackground}
                className="d-block hero-bg homepage-hero-bg"
                alt="Mosque Silhouette Background"
              />
              <div className="hero-content homepage-hero-content">
                <div className="hero-text-side homepage-hero-text-side">
                  <h1>
                    Discover perfumes that
                    <br />
                    celebrate individuality
                  </h1>
                  <p className="homepage-hero-text-paragraph">
                    Every moment with an unforgettable essence.
                  </p>
                  <span className="homepage-carousel-shop-btn">
                    <Link to="/Products">Shop Now</Link>
                  </span>
                </div>
                <div className="hero-image-side homepage-hero-image-side">
                  <div className="bottle-container homepage-bottle-container">
                    <img
                      src={PerfumeBottleLarge}
                      className="floating-bottle-1 homepage-floating-bottle-1"
                      alt="Perfume Bottle Large"
                    />
                    <img
                      src={PerfumeBottleSmall}
                      className="floating-bottle-2 homepage-floating-bottle-2"
                      alt="Perfume Bottle Small"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div
              className="carousel-item"
              style={{ backgroundColor: "rgba(195, 116, 0, 1)" }}
            >
              <img
                src={MosqueSilhouetteBackground}
                className="d-block hero-bg homepage-hero-bg"
                alt="Alternative Slide Background"
              />
              <div className="hero-content homepage-hero-content">
                <div className="hero-text-side homepage-hero-text-side">
                  <h1>
                    Discover perfumes that
                    <br />
                    celebrate individuality
                  </h1>
                  <p className="homepage-hero-text-paragraph">
                    Every moment with an unforgettable essence.
                  </p>
                  <span className="homepage-carousel-shop-btn">
                    <Link to="/Products">Shop Now</Link>
                  </span>
                </div>
                <div className="hero-image-side homepage-hero-image-side">
                  <div className="bottle-container homepage-bottle-container">
                    <img
                      src={PerfumeBottleLarge2}
                      className="floating-bottle-1 homepage-floating-bottle-1-alt"
                      alt="Alternative Perfume Bottle Large"
                    />
                    <img
                      src={PerfumeBottleSmall2}
                      className="floating-bottle-2 homepage-floating-bottle-2-alt"
                      alt="Alternative Perfume Bottle Small"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promos */}
      <section className="content-section homepage-content-section">
        <div className="container-fluid px-5 my-5">
          <div className="row g-4">
            <div className="col-12 col-lg-4">
              <div className="promo-card homepage-promo-card">
                <div className="col-7 pe-2">
                  <h3 className="homepage-promo-card-title">
                    Unlock Exclusive Offers
                  </h3>
                  <p className="homepage-promo-card-text">
                    Discover special deals tailored just for you!
                  </p>
                </div>
                <img
                  src={photo1}
                  alt="Orange Perfume"
                  className="card-img-right homepage-card-img-right"
                />
              </div>
            </div>

            <div className="col-12 col-lg-4">
              <div className="promo-card homepage-promo-card homepage-promo-card-centered">
                <div className="col-12 mb-3">
                  <h3 className="homepage-promo-card-title">
                    Gift a Scents to your loved one.
                  </h3>
                  <p className="homepage-promo-card-text">
                    Make your love more beautiful
                  </p>
                </div>
                <img
                  src={photo2}
                  className="card-img-bottom homepage-card-img-bottom"
                  alt="Gift Perfumes"
                />
              </div>
            </div>

            <div className="col-12 col-lg-4">
              <div className="promo-card homepage-promo-card">
                <div className="col-8">
                  <h3 className="homepage-promo-card-title">
                    Luxury Scents Starting at ₹4,000
                  </h3>
                </div>
                <Link
                  to="/Products?minPrice=4000"
                  className="shop-now-badge homepage-shop-now-badge text-decoration-none"
                >
                  Shop
                  <br />
                  Now
                </Link>
                <img
                  src={photo3}
                  alt="Luxury Perfume"
                  className="card-img-right homepage-card-img-right"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Features Row */}
        <div className="container-fluid my-5 px-4 px-md-5">
          <div className="mainbox homepage-mainbox row g-4 py-4 justify-content-between">
            <div className="col-12 col-md-4 feature-divider homepage-feature-divider">
              <div className="feature-item homepage-feature-item">
                <div className="feature-icon-wrapper homepage-feature-icon-wrapper">
                  <i className="fa-solid fa-truck-fast"></i>
                </div>
                <div className="feature-content homepage-feature-content">
                  <h4 className="homepage-feature-title">
                    Fast & Reliable Delivery
                  </h4>
                  <p className="homepage-feature-text">
                    Get your orders delivered on time, every time.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4 feature-divider homepage-feature-divider">
              <div className="feature-item homepage-feature-item">
                <div className="feature-icon-wrapper homepage-feature-icon-wrapper">
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
                <div className="feature-content homepage-feature-content">
                  <h4 className="homepage-feature-title">Secure Payments</h4>
                  <p className="homepage-feature-text">
                    Shop with confidence using our encrypted payment gateways.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="feature-item homepage-feature-item">
                <div className="feature-icon-wrapper homepage-feature-icon-wrapper">
                  <i className="fa-solid fa-headset"></i>
                </div>
                <div className="feature-content homepage-feature-content">
                  <h4 className="homepage-feature-title">
                    24/7 Customer Support
                  </h4>
                  <p className="homepage-feature-text">
                    We are here to assist you anytime, anywhere.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Collection Section */}
        <div className="container-fluid my-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold homepage-section-title homepage-featured-title">
              Featured <span>Collection</span>
            </h2>
            <div className="d-flex gap-2">
              <button
                className="scroll-arrow-btn homepage-scroll-arrow-btn"
                type="button"
                onClick={() => scrollSlider(featuredSliderRef, -340)}
                aria-label="Previous featured products"
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              <button
                className="scroll-arrow-btn homepage-scroll-arrow-btn"
                type="button"
                onClick={() => scrollSlider(featuredSliderRef, 340)}
                aria-label="Next featured products"
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="d-flex justify-content-center align-items-center py-5 my-4">
              <div
                className="spinner-border"
                style={{
                  width: "3.2rem",
                  height: "3.2rem",
                  color: "#043948",
                  borderWidth: "3px",
                }}
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div
              className="product-slider-container homepage-product-slider-container d-flex gap-4"
              ref={featuredSliderRef}
              style={{ overflowX: "auto", scrollBehavior: "smooth" }}
            >
              {Productsitems.slice(0, 7).map((products, index) => (
                <div
                  className="product-card-custom homepage-product-card-custom"
                  key={products._id || index}
                >
                  <div className="product-image-frame homepage-product-image-frame mb-3">
                    <div className="new-badge homepage-new-badge">New</div>
                    <Link to={`/SpecificProduct/${products._id}`}>
                      <img
                        src={products.image}
                        alt={products.name}
                      />
                    </Link>
                  </div>

                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="d-flex flex-column text-start pe-2">
                      <h5 
                        className="product-title homepage-product-title mb-1 fw-bolder"
                        style={{ fontWeight: "700", color: "#111" }}
                      >
                        {products.name}
                      </h5>
                      <span 
                        className="text-muted small" 
                        style={{ fontSize: "0.85rem", textTransform: "capitalize" }}
                      >
                        {products.category?.name || products.category || "Perfume"}
                      </span>
                    </div>

                    <button
                      className="specificproduct-action-btn"
                      type="button"
                      onClick={() => addTotheWishlist(products._id)}
                      disabled={wishlistLoadingId === String(products._id)}
                      aria-label={
                        wishlistIds.has(String(products._id))
                          ? "Remove from wishlist"
                          : "Add to wishlist"
                      }
                      aria-pressed={wishlistIds.has(String(products._id))}
                      style={{
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        flexShrink: 0,
                        fontSize: "20px",
                        padding: "2px 6px",
                      }}
                    >
                      <i
                        className={
                          wishlistIds.has(String(products._id))
                            ? "bi bi-heart-fill"
                            : "bi bi-heart"
                        }
                        style={{
                          color: wishlistIds.has(String(products._id))
                            ? "#e63946"
                            : "#555",
                          transition: "color 0.2s ease",
                        }}
                      ></i>
                    </button>
                  </div>

                  <div className="mb-3 homepage-product-price">
                    <span className="fw-bold fs-5" style={{ color: "#28a745" }}>
                      Rs {products.saleprice}
                    </span>
                    <span className="text-decoration-line-through text-muted ms-2 fs-6 small">
                      Rs {products.price}
                    </span>
                  </div>
                  <button
                    onClick={() => Addtocart(products._id)}
                    className="btn-add-cart homepage-btn-add-cart"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quote */}
        <div className="quote-section homepage-quote-section">
          <p className="mb-0 homepage-quote-text">
            It is an art. A craft. A science. At Fragranzia, we are in the
            business of creating memories that last forever through our
            fragrances.
          </p>
        </div>

        {/* Special Collections Links (New Arrivals, Limited Edition, Best Sellers) */}
        <div className="container-fluid my-5">
          <div className="row g-4 justify-content-center">
            <div className="col-12 col-sm-6 col-md-4">
              <Link
                to="/Products?type=newArrivals"
                className="offer-card homepage-offer-card d-block text-decoration-none"
              >
                <img
                  src={S1}
                  alt="New Arrivals"
                  className="homepage-offer-card-img"
                />
                <h3 className="offer-card-title homepage-offer-card-title">
                  New Arrivals
                </h3>
              </Link>
            </div>
            <div className="col-12 col-sm-6 col-md-4">
              <Link
                to="/Products?type=limitedEdition"
                className="offer-card homepage-offer-card d-block text-decoration-none"
              >
                <img
                  src={S2}
                  alt="Limited Edition"
                  className="homepage-offer-card-img"
                />
                <h3 className="offer-card-title homepage-offer-card-title">
                  Limited Edition
                </h3>
              </Link>
            </div>
            <div className="col-12 col-sm-6 col-md-4">
              <Link
                to="/Products?type=bestSellers"
                className="offer-card homepage-offer-card d-block text-decoration-none"
              >
                <img
                  src={S3}
                  alt="Best Sellers"
                  className="homepage-offer-card-img"
                />
                <h3 className="offer-card-title homepage-offer-card-title">
                  Best Sellers
                </h3>
              </Link>
            </div>
          </div>
        </div>

        {/* Explore Categories (Clickable) */}
        <div className="container-fluid my-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold homepage-section-title homepage-categories-title">
              Explore <span>Categories</span>
            </h2>
            <div>
              <span
                className="homepage-see-all-link"
                style={{
                  color: "black",
                  fontWeight: 500,
                  textDecoration: "none",
                }}
              >
                <Link to="/Products">See All</Link>
              </span>
            </div>
          </div>

          <div className="row g-4 justify-content-center row-cols-2 row-cols-sm-3 row-cols-md-5 mt-2">
            {categoryList.map((cat, idx) => (
              <div className="col" key={idx}>
                <Link
                  to={`/Products?category=${encodeURIComponent(cat.title)}`}
                  className="text-decoration-none text-dark"
                >
                  <div className="category-item homepage-category-item" style={{ cursor: "pointer" }}>
                    <div className="category-circle-frame homepage-category-circle-frame">
                      <img src={cat.image} alt={cat.title} />
                    </div>
                    <span className="category-label homepage-category-label">
                      {cat.title}
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Offer Zone Section */}
        <div className="container-fluid my-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold homepage-section-title homepage-featured-title">
              Offer <span>Zone</span>
            </h2>
            <div className="d-flex gap-2">
              <button
                className="scroll-arrow-btn homepage-scroll-arrow-btn"
                type="button"
                onClick={() => scrollSlider(offerSliderRef, -340)}
                aria-label="Previous offer products"
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              <button
                className="scroll-arrow-btn homepage-scroll-arrow-btn"
                type="button"
                onClick={() => scrollSlider(offerSliderRef, 340)}
                aria-label="Next offer products"
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="d-flex justify-content-center align-items-center py-5 my-4">
              <div
                className="spinner-border"
                style={{
                  width: "3.2rem",
                  height: "3.2rem",
                  color: "#043948",
                  borderWidth: "3px",
                }}
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div
              className="product-slider-container homepage-product-slider-container d-flex gap-4"
              ref={offerSliderRef}
              style={{ overflowX: "auto", scrollBehavior: "smooth" }}
            >
              {Productsitems.slice(0, 7).map((products, index) => (
                <div
                  className="product-card-custom homepage-product-card-custom"
                  key={products._id || index}
                >
                  <div className="product-image-frame homepage-product-image-frame mb-3">
                    <Link to={`/SpecificProduct/${products._id}`}>
                      <img
                        src={products.image}
                        alt={products.name}
                      />
                    </Link>
                  </div>

                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="d-flex flex-column text-start pe-2">
                      <h5 
                        className="product-title homepage-product-title mb-1 fw-bolder"
                        style={{ fontWeight: "700", color: "#111" }}
                      >
                        {products.name}
                      </h5>
                      <span 
                        className="text-muted small" 
                        style={{ fontSize: "0.85rem", textTransform: "capitalize" }}
                      >
                        {products.category?.name || products.category || "Perfume"}
                      </span>
                    </div>

                    <button
                      className="specificproduct-action-btn"
                      type="button"
                      onClick={() => addTotheWishlist(products._id)}
                      disabled={wishlistLoadingId === String(products._id)}
                      aria-label={
                        wishlistIds.has(String(products._id))
                          ? "Remove from wishlist"
                          : "Add to wishlist"
                      }
                      aria-pressed={wishlistIds.has(String(products._id))}
                      style={{
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        flexShrink: 0,
                        fontSize: "20px",
                        padding: "2px 6px",
                      }}
                    >
                      <i
                        className={
                          wishlistIds.has(String(products._id))
                            ? "bi bi-heart-fill"
                            : "bi bi-heart"
                        }
                        style={{
                          color: wishlistIds.has(String(products._id))
                            ? "#e63946"
                            : "#555",
                          transition: "color 0.2s ease",
                        }}
                      ></i>
                    </button>
                  </div>

                  <div className="mb-3 homepage-product-price">
                    <span className="fw-bold fs-5" style={{ color: "#28a745" }}>
                      Rs {products.saleprice}
                    </span>
                    <span className="text-decoration-line-through text-muted ms-2 fs-6 small">
                      Rs {products.price}
                    </span>
                  </div>
                  <button
                    onClick={() => Addtocart(products._id)}
                    className="btn-add-cart homepage-btn-add-cart"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Elegance Banner */}
        <div className="container-fluid my-5">
          <div className="elegance-banner homepage-elegance-banner row g-0">
            <div className="col-12 col-md-7 banner-text-side homepage-banner-text-side d-flex flex-column justify-content-center">
              <h1 className="homepage-banner-title">
                Elegance in Every Bottle
              </h1>
              <p className="homepage-banner-text">
                Discover timeless fragrances crafted for every moment
              </p>
              <div>
                <button className="homepage-banner-shop-btn shadow-sm">
                  <Link to="/Products">Shop Now</Link>
                </button>
              </div>
            </div>
            <div className="banner-img-side homepage-banner-img-side">
              <img src={b1} alt="Perfume bottle" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-5 mt-5 homepage-footer">
        <div className="container">
          <div className="row g-4 align-items-start">
            <div className="col-12 col-md-3 pt-5 mt-4">
              <h1
                className="homepage-footer-brand"
                style={{ color: "#043948" }}
              >
                <b>Fragranzia</b>
              </h1>
            </div>

            <div className="col-12 col-md-9">
              <div className="row g-4">
                <div className="col-6 col-sm-4">
                  <h5
                    className="homepage-footer-heading"
                    style={{ color: "#043948" }}
                  >
                    <b>Pages</b>
                  </h5>
                  <ul className="list list-unstyled lh-lg homepage-footer-list">
                    <li><span><Link to="/">Home</Link></span></li>
                    <li><span><Link to="/Products">Products</Link></span></li>
                    <li><span><Link to="/Gifting">Gifting</Link></span></li>
                    <li><span><Link to="/About">About</Link></span></li>
                    <li><span><Link to="/Profile">Profile</Link></span></li>
                  </ul>
                </div>
                <div className="col-6 col-sm-4">
                  <h5
                    className="homepage-footer-heading"
                    style={{ color: "#043948" }}
                  >
                    <b>Quick Links</b>
                  </h5>
                  <ul className="list-unstyled lh-lg homepage-footer-list">
                    <li><a href="privacy.html">Privacy Policy</a></li>
                    <li><a href="terms.html">Terms and Conditions</a></li>
                    <li><a href="faqs.html">FAQs</a></li>
                    <li><a href="customer-service.html">Customer Services</a></li>
                  </ul>
                </div>
                <div className="col-12 col-sm-4">
                  <h5
                    className="homepage-footer-heading"
                    style={{ color: "#043948" }}
                  >
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

export default Homepage;