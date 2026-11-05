import React, { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./SpecificProduct.css";
import toast, { Toaster } from "react-hot-toast";
import UserService from "../../services/user-api-services/UserService";

const SpecificProduct = () => {
  const { id } = useParams();

  const {
    getDetailedProduct,
    getProduct,
    addToWishlist,
    getWishlist,
    removeProductFromWishlist,
    Addproducttocart,
  } = UserService();

  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [wishlistIds, setWishlistIds] = useState(() => new Set());
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistLoadingId, setWishlistLoadingId] = useState(null);

  // Active image index for switching the big image
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const suggestedSliderRef = useRef(null);

  const getCleanImageUrl = (url) => {
    if (!url) return "/images/AUTOGRAPH_EDP_100ML_1.png";
    if (url.includes("https://")) {
      return url.substring(url.indexOf("https://"));
    }
    if (url.includes("http://") && url.indexOf("http://") !== 0) {
      return url.substring(url.indexOf("http://"));
    }
    return url;
  };

  useEffect(() => {
    let active = true;

    // Reset active thumbnail when navigating to a new product
    setActiveImageIndex(0);

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setProduct(null);
        setQuantity(1);

        const response = await getDetailedProduct(id);

        if (active) {
          setProduct(response);
        }
      } catch (error) {
        console.error(
          "Error fetching product:",
          error.response?.data || error.message
        );
        toast.error("Unable to load this product.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await getProduct();

        if (active) {
          setProducts(Array.isArray(response) ? response : []);
        }
      } catch (error) {
        console.error(
          "Error fetching products:",
          error.response?.data || error.message
        );
      }
    };

    const fetchWishlistStatus = async () => {
      try {
        const response = await getWishlist();
        const wishlistItems = response?.wishlist || [];

        if (active) {
          const savedIds = wishlistItems.map((item) =>
            String(
              item.productId?._id ||
                item.productId ||
                item.product?._id ||
                item.id ||
                item._id
            )
          );

          setWishlistIds(new Set(savedIds));
          setIsFavorite(savedIds.includes(String(id)));
        }
      } catch (error) {
        console.error(
          "Error fetching wishlist:",
          error.response?.data || error.message
        );

        if (active) {
          setIsFavorite(false);
          setWishlistIds(new Set());
        }
      }
    };

    if (id) {
      fetchProduct();
      fetchWishlistStatus();
    }

    fetchProducts();

    return () => {
      active = false;
    };
  }, [id]);

  const stock = Math.max(0, Number(product?.quantity) || 0);

  const increaseQuantity = () => {
    setQuantity((previous) => Math.min(previous + 1, stock));
  };

  const decreaseQuantity = () => {
    setQuantity((previous) => Math.max(1, previous - 1));
  };

  const addTotheWishlist = async (productId) => {
    if (wishlistLoading) return;

    try {
      setWishlistLoading(true);

      if (isFavorite) {
        await removeProductFromWishlist(productId);

        setIsFavorite(false);
        setWishlistIds((previous) => {
          const updated = new Set(previous);
          updated.delete(String(productId));
          return updated;
        });

        toast.success("Product removed from wishlist.");
      } else {
        await addToWishlist(productId);

        setIsFavorite(true);
        setWishlistIds((previous) => {
          const updated = new Set(previous);
          updated.add(String(productId));
          return updated;
        });

        toast.success("Product added to wishlist.");
      }
    } catch (error) {
      console.error(
        "Wishlist error:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.message || "Unable to update wishlist."
      );
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleSuggestedWishlist = async (productId) => {
    const productIdString = String(productId);

    if (wishlistLoadingId !== null) return;

    const alreadyFavorite = wishlistIds.has(productIdString);

    try {
      setWishlistLoadingId(productIdString);

      if (alreadyFavorite) {
        await removeProductFromWishlist(productId);

        setWishlistIds((previous) => {
          const updated = new Set(previous);
          updated.delete(productIdString);
          return updated;
        });

        if (productIdString === String(product?._id)) {
          setIsFavorite(false);
        }

        toast.success("Product removed from wishlist.");
      } else {
        await addToWishlist(productId);

        setWishlistIds((previous) => {
          const updated = new Set(previous);
          updated.add(productIdString);
          return updated;
        });

        if (productIdString === String(product?._id)) {
          setIsFavorite(true);
        }

        toast.success("Product added to wishlist.");
      }
    } catch (error) {
      console.error(
        "Suggested product wishlist error:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.message || "Unable to update wishlist."
      );
    } finally {
      setWishlistLoadingId(null);
    }
  };

  const handleAddToCart = async () => {
    if (!product || stock < 1 || quantity > stock) {
      toast.error("This product is currently out of stock.");
      return;
    }

    try {
      setActionLoading(true);

      const response = await Addproducttocart(product._id, quantity);

      toast.success(
        response?.message || `${quantity} item(s) added to cart successfully.`
      );
    } catch (error) {
      console.error(
        "Add to cart error:",
        error.response?.data || error.message
      );
      if (error.response?.status === 401) {
        toast.error("Please login to add products to your cart.");
      } else {
        toast.error(
          error.response?.data?.message || "Unable to add product to cart."
        );
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleSuggestedAddToCart = async (productId) => {
    try {
      const response = await Addproducttocart(productId, 1);
      toast.success(response?.message || "Product added to cart successfully!");
    } catch (error) {
      console.error(
        "Suggested product cart error:",
        error.response?.data || error.message
      );
      if (error.response?.status === 401) {
        toast.error("Please login to add products to your cart.");
      } else {
        toast.error(
          error.response?.data?.message || "Unable to add product to cart."
        );
      }
    }
  };

  const shareProduct = async () => {
    const shareData = {
      title: product?.name || "Fragranzia Product",
      text: "Check out this fragrance.",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Unable to share product:", error);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Product link copied to clipboard.");
      } catch (error) {
        toast.error("Unable to copy product link.");
      }
    }
  };

  const scrollSuggestedProducts = (offset) => {
    suggestedSliderRef.current?.scrollBy({
      left: offset,
      behavior: "smooth",
    });
  };

  const price = Number(product?.price) || 0;
  const salePrice = Number(product?.saleprice ?? product?.price) || 0;

  const discount =
    price > salePrice && price > 0
      ? Math.round(((price - salePrice) / price) * 100)
      : 0;

  // Image Resolution Logic
  const productImagesList = (() => {
    if (product?.images && Array.isArray(product.images) && product.images.length > 0) {
      return product.images.map(getCleanImageUrl);
    }
    if (product?.image) {
      return [getCleanImageUrl(product.image)];
    }
    return ["/images/AUTOGRAPH_EDP_100ML_1.png"];
  })();

  const activeMainImage = productImagesList[activeImageIndex] || productImagesList[0];

  const suggestedProducts = products.filter(
    (item) => String(item._id) !== String(product?._id)
  );

  return (
    <div className="specificproduct-page">
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

      <nav className="navbar navbar-expand-lg navbar-light shadow-sm homepage-navbar">
        <div className="container-fluid px-4">
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
                <span className="nav-link homepage-nav-link">
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
                  />
                </div>
              </li>

              <li className="nav-item">
                <span className="icon-btn homepage-icon-btn">
                  <Link to="/Cart" aria-label="Cart">
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
                <span className="icon-btn homepage-icon-btn">
                  <Link to="/Profile" aria-label="Profile">
                    <i className="fa-regular fa-user"></i>
                  </Link>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center py-5 my-5"
          style={{ minHeight: "50vh" }}
        >
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
      ) : !product ? (
        <div className="text-center py-5 my-5">
          <h3 className="fw-bold text-muted mb-3">Product not found</h3>
          <Link to="/Products" className="btn btn-dark px-4 py-2">
            Back to Products
          </Link>
        </div>
      ) : (
        <>
          <div className="container-fluid px-4 px-md-5 specificproduct-wrapper">
            <div className="specificproduct-breadcrumb my-3">
              <Link to="/">Home</Link>
              <span>&gt;</span>
              <Link to="/Products">Products</Link>
              <span>&gt;</span>
              <span>{product.name}</span>
            </div>

            <div className="specificproduct-main">
              <div className="specificproduct-left">
                <div className="specificproduct-product-card">
                  <div className="specificproduct-gallery">
                    {/* Thumbnails clickable column */}
                    <div className="specificproduct-thumbnails">
                      {productImagesList.map((imgUrl, index) => (
                        <div
                          className={`specificproduct-thumbnail ${
                            activeImageIndex === index ? "active" : ""
                          }`}
                          key={index}
                          onClick={() => setActiveImageIndex(index)}
                          style={{ cursor: "pointer" }}
                        >
                          <img
                            src={imgUrl}
                            alt={`${product.name} preview ${index + 1}`}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Big selected main image */}
                    <div className="specificproduct-main-image-wrapper">
                      <div className="specificproduct-actions">
                        <button
                          className="specificproduct-action-btn"
                          onClick={() => addTotheWishlist(product._id)}
                          disabled={wishlistLoading}
                          type="button"
                          aria-label={
                            isFavorite
                              ? "Remove from wishlist"
                              : "Add to wishlist"
                          }
                          aria-pressed={isFavorite}
                        >
                          <i
                            className={
                              isFavorite
                                ? "bi bi-heart-fill"
                                : "bi bi-heart"
                            }
                            style={{
                              color: isFavorite ? "#e63946" : "inherit",
                            }}
                          ></i>
                        </button>

                        <button
                          className="specificproduct-action-btn"
                          onClick={shareProduct}
                          type="button"
                          aria-label="Share product"
                        >
                          <i className="bi bi-share"></i>
                        </button>
                      </div>

                      <img
                        src={activeMainImage}
                        alt={product.name}
                        className="specificproduct-main-image"
                      />
                    </div>
                  </div>

                  <div className="specificproduct-purchase-buttons">
                    <button
                      className="specificproduct-buy-now"
                      type="button"
                      disabled={stock <= 0 || actionLoading}
                      onClick={handleAddToCart}
                    >
                      Purchase Now
                    </button>

                    <button
                      className="specificproduct-add-cart"
                      type="button"
                      onClick={handleAddToCart}
                      disabled={stock <= 0 || actionLoading}
                    >
                      {actionLoading ? "Adding..." : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="specificproduct-details">
                <h1>{product.name}</h1>

                <p className="specificproduct-brand">
                  {product.category?.name || product.category || "Perfume"}
                </p>

                <div className="specificproduct-rating-row">
                  <span className="specificproduct-rating">
                    4.5 <i className="bi bi-star-fill"></i>
                  </span>
                  <span className="specificproduct-rating-count">
                    1,000 Ratings
                  </span>
                </div>

                <p className="specificproduct-stock-message">
                  {stock > 0
                    ? stock <= 5
                      ? `Hurry! Only ${stock} left in stock.`
                      : "In stock and ready to order."
                    : "Currently out of stock."}
                </p>

                <div className="specificproduct-price">
                  <span className="specificproduct-sale-price">
                    Rs {salePrice}
                  </span>

                  {price > salePrice && (
                    <>
                      <span className="specificproduct-original-price">
                        Rs {price}
                      </span>
                      <span className="specificproduct-discount">
                        {discount}% off
                      </span>
                    </>
                  )}
                </div>

                <div className="specificproduct-quantity">
                  <div className="quantity-control">
                    <button
                      onClick={decreaseQuantity}
                      type="button"
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>

                    <span>{quantity}</span>

                    <button
                      onClick={increaseQuantity}
                      type="button"
                      disabled={quantity >= stock}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                <hr className="specificproduct-divider" />

                <div className="specificproduct-section">
                  <h3>Delivery</h3>
                  <p>
                    Delivery date will be confirmed after ordering |{" "}
                    <span>Free</span>
                  </p>
                  <small>
                    Delivery availability may vary by location.
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
                      <span>Get 15% off your first order.</span>
                    </li>
                    <li>
                      <i className="bi bi-tag-fill"></i>
                      <span>
                        Receive a free tool case with the purchase of any perfume
                        over ₹2,000.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Suggested For You - EXACT Offer Zone Style */}
          <div className="container-fluid my-5 px-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="fw-bold homepage-section-title homepage-featured-title">
                Suggested <span>For You</span>
              </h2>
              <div className="d-flex gap-2">
                <button
                  className="scroll-arrow-btn homepage-scroll-arrow-btn"
                  type="button"
                  onClick={() => scrollSuggestedProducts(-340)}
                  aria-label="Previous suggested products"
                >
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
                <button
                  className="scroll-arrow-btn homepage-scroll-arrow-btn"
                  type="button"
                  onClick={() => scrollSuggestedProducts(340)}
                  aria-label="Next suggested products"
                >
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </div>
            </div>

            <div
              ref={suggestedSliderRef}
              className="product-slider-container homepage-product-slider-container d-flex gap-4"
              id="featuredSlider"
            >
              {suggestedProducts.slice(0, 7).map((products, index) => (
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
                      onClick={() => handleSuggestedWishlist(products._id)}
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

                  {/* Sale price in green (#28a745) including Rs */}
                  <div className="mb-3 homepage-product-price">
                    <span className="fw-bold fs-5" style={{ color: "#28a745" }}>
                      Rs {products.saleprice}
                    </span>
                    <span className="text-decoration-line-through text-muted ms-2 fs-6 small">
                      Rs {products.price}
                    </span>
                  </div>

                  <button
                    onClick={() => handleSuggestedAddToCart(products._id)}
                    className="btn-add-cart homepage-btn-add-cart"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}

              {suggestedProducts.length === 0 && (
                <div className="text-center py-4 w-100">
                  <p className="text-muted mb-0">No suggested products available right now.</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <footer className="py-5 mt-5 homepage-footer">
        <div className="container-fluid px-4 px-md-5">
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
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/Products">Products</Link></li>
                    <li><Link to="/Gifting">Gifting</Link></li>
                    <li><Link to="/About">About</Link></li>
                    <li><Link to="/Profile">Profile</Link></li>
                  </ul>
                </div>

                <div className="col-6 col-sm-4">
                  <h5
                    className="homepage-footer-heading"
                    style={{ color: "#043948" }}
                  >
                    <b>Quick Links</b>
                  </h5>

                  <ul className="list list-unstyled lh-lg homepage-footer-list">
                    <li><a href="privacy.html">Privacy Policy</a></li>
                    <li><a href="terms.html">Terms and Conditions</a></li>
                    <li><a href="faqs.html">FAQs</a></li>
                    <li>
                      <a href="customer-service.html">
                        Customer Services
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="col-12 col-sm-4">
                  <h5
                    className="homepage-footer-heading"
                    style={{ color: "#043948" }}
                  >
                    <b>Contact &amp; Social</b>
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
              © 2024 Fragranzia Company. All rights reserved
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SpecificProduct;