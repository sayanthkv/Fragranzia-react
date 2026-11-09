import React, { useState, useEffect, useMemo, useRef } from "react";
import "./Products.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Link, useSearchParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import UserService from "../../services/user-api-services/UserService";
import filter from "../../assets/filter.png";

const INITIAL_VISIBLE_COUNT = 12;

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

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

  // Search & Sorting States
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Panel & Filter States
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [specialFilter, setSpecialFilter] = useState("all");
  const [maxPrice, setMaxPrice] = useState(10000);

  // Pagination / Load More State
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  const filterRef = useRef(null);

  // Sync state with URL query parameters
  useEffect(() => {
    const urlCategory = searchParams.get("category");
    const urlType = searchParams.get("type");
    const urlSearch = searchParams.get("search");
    const urlMinPrice = searchParams.get("minPrice");

    if (urlCategory) {
      setSelectedCategory(urlCategory);
    } else {
      setSelectedCategory("All");
    }

    if (urlType) {
      setSpecialFilter(urlType);
      if (urlType === "newArrivals") setSortBy("newest");
      if (urlType === "bestSellers") setSortBy("popularity");
    } else {
      setSpecialFilter("all");
    }

   setSearchTerm(urlSearch || "");
   
    if (urlMinPrice) {
      setMaxPrice(20000);
    }

    // Reset visible count to initial 12 whenever filters or routes change
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }, [searchParams]);

  useEffect(() => {
    let isMounted = true;

    const loadProductsAndWishlist = async () => {
      try {
        setLoading(true);
        const products = await getProduct();
        const items = Array.isArray(products) ? products : [];
        if (isMounted) {
          setProductsitems(items);

          if (items.length > 0) {
            const highestPrice = Math.max(
              ...items.map((item) => item.saleprice || item.price || 0)
            );
            setMaxPrice(highestPrice || 10000);
          }
        }
      } catch (error) {
        console.error("Failed to load products:", error);
        toast.error("Failed to load products list.");
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

    loadProductsAndWishlist();

    return () => {
      isMounted = false;
    };
  }, []);

  // Click outside detector to close the filter dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };

    if (isFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterOpen]);

  // Extract unique categories dynamically
  const categories = useMemo(() => {
    const unique = new Set();
    Productsitems.forEach((item) => {
      const catName =
        typeof item.category === "object"
          ? item.category?.name
          : item.category;
      if (catName) unique.add(catName);
    });
    return ["All", ...Array.from(unique)];
  }, [Productsitems]);

  // Absolute max price calculated from data
  const absoluteMaxPrice = useMemo(() => {
    if (Productsitems.length === 0) return 10000;
    return Math.max(
      ...Productsitems.map((item) => item.saleprice || item.price || 0)
    );
  }, [Productsitems]);

  // Filtered & sorted list
  const processedProducts = useMemo(() => {
    let result = [...Productsitems];

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (product) =>
          product.name?.toLowerCase().includes(term) ||
          product.description?.toLowerCase().includes(term)
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter((product) => {
        const catName =
          typeof product.category === "object"
            ? product.category?.name
            : product.category;
        return (
          catName &&
          catName.trim().toLowerCase() === selectedCategory.trim().toLowerCase()
        );
      });
    }

    if (specialFilter === "limitedEdition") {
      result = result.filter(
        (product) =>
          (product.quantity || 0) <= 10 ||
          product.name?.toLowerCase().includes("limited") ||
          product.description?.toLowerCase().includes("limited")
      );
    }

    const minPriceParam = searchParams.get("minPrice");
    if (minPriceParam) {
      result = result.filter(
        (product) => (product.saleprice || product.price || 0) >= Number(minPriceParam)
      );
    }

    result = result.filter(
      (product) => (product.saleprice || product.price || 0) <= maxPrice
    );

    switch (sortBy) {
      case "lowToHigh":
        result.sort((a, b) => (a.saleprice || 0) - (b.saleprice || 0));
        break;
      case "highToLow":
        result.sort((a, b) => (b.saleprice || 0) - (a.saleprice || 0));
        break;
      case "newest":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "popularity":
        result.sort((a, b) => (b.quantity || 0) - (a.quantity || 0));
        break;
      default:
        break;
    }

    return result;
  }, [Productsitems, searchTerm, sortBy, selectedCategory, specialFilter, maxPrice, searchParams]);

  // Sliced items based on visibleCount
  const displayedProducts = useMemo(() => {
    return processedProducts.slice(0, visibleCount);
  }, [processedProducts, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount(processedProducts.length);
  };

  const resetFilters = () => {
    setSelectedCategory("All");
    setSpecialFilter("all");
    setSortBy("newest");
    setSearchTerm("");
    setMaxPrice(absoluteMaxPrice);
    setVisibleCount(INITIAL_VISIBLE_COUNT);
    setSearchParams({});
    toast.success("Filters reset to default.");
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setVisibleCount(INITIAL_VISIBLE_COUNT);
    if (category === "All") {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("category");
      setSearchParams(nextParams);
    } else {
      setSearchParams({ ...Object.fromEntries(searchParams), category });
    }
  };

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
      console.error("Wishlist error:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        toast.error("Please login to manage your wishlist.");
      } else {
        toast.error(
          error.response?.data?.message || "Unable to update wishlist."
        );
      }
    } finally {
      setWishlistLoadingId(null);
    }
  };

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



      {/* Festive Banner */}
      <section className="festive-banner homepage-festive-banner">
        <span>
          <b>ENJOY FESTIVE DISCOUNTS! FREE SHIPPING ABOVE 999 !</b>
        </span>
      </section>

      {/* Main Content Area */}
      <div className="container-fluid px-3 px-md-5 my-4">
        {/* Header and Filter Row */}
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
          <div>
            <h3 className="productpage-title mb-1 fw-bold" style={{ color: "#043948" }}>
              {selectedCategory !== "All"
                ? `${selectedCategory}`
                : specialFilter === "newArrivals"
                ? "New Arrivals"
                : specialFilter === "limitedEdition"
                ? "Limited Edition"
                : specialFilter === "bestSellers"
                ? "Best Sellers"
                : "All Products"}
            </h3>
            <p className="productpage-breadcrumb mb-0 text-muted small">
              Home &gt; Products {selectedCategory !== "All" && `> ${selectedCategory}`}
            </p>
          </div>

          {/* Filter Trigger Button & Dropdown */}
          <div className="position-relative" ref={filterRef}>
            <button
              className="d-flex align-items-center gap-2 px-3 py-2 shadow-sm rounded-pill"
              type="button"
              onClick={() => setIsFilterOpen((prev) => !prev)}
              style={{
                backgroundColor: isFilterOpen ? "#f1f5f9" : "#ffffff",
                color: "#111827",
                border: "1.5px solid #cbd5e1",
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
              }}
            >
              <img
                src={filter}
                alt=""
                style={{ width: "16px", height: "16px", objectFit: "contain" }}
              />
              <span className="fw-semibold text-dark">Filter & Sort</span>
              <span className="small text-muted">
                {isFilterOpen ? "▲" : "▼"}
              </span>
            </button>

            {/* Sliding Dropdown Panel */}
            {isFilterOpen && (
              <div
                className="filter-sliding-panel shadow-lg p-3 bg-white rounded-3 position-absolute end-0 mt-2"
                style={{
                  width: "290px",
                  maxWidth: "calc(100vw - 32px)",
                  zIndex: 1050,
                  border: "1px solid #e2e8f0",
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                  <h6 className="fw-bold mb-0" style={{ color: "#043948" }}>Refine Products</h6>
                  <button
                    type="button"
                    className="btn btn-sm btn-link text-decoration-none p-0 text-danger fw-semibold"
                    onClick={resetFilters}
                  >
                    Clear All
                  </button>
                </div>

                {/* Sort Option */}
                <div className="mb-3">
                  <label className="form-label fw-bold small mb-1 text-dark">
                    Sort By
                  </label>
                  <select
                    className="form-select form-select-sm"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Newest First</option>
                    <option value="popularity">Popularity</option>
                    <option value="lowToHigh">Price: Low to High</option>
                    <option value="highToLow">Price: High to Low</option>
                  </select>
                </div>

                {/* Category Option */}
                <div className="mb-3">
                  <label className="form-label fw-bold small mb-1 text-dark">
                    Category
                  </label>
                  <select
                    className="form-select form-select-sm"
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                  >
                    {categories.map((cat, idx) => (
                      <option key={idx} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Special Tag Filter */}
                <div className="mb-3">
                  <label className="form-label fw-bold small mb-1 text-dark">
                    Collection / Tag
                  </label>
                  <select
                    className="form-select form-select-sm"
                    value={specialFilter}
                    onChange={(e) => {
                      setSpecialFilter(e.target.value);
                      setVisibleCount(INITIAL_VISIBLE_COUNT);
                    }}
                  >
                    <option value="all">All Items</option>
                    <option value="newArrivals">New Arrivals</option>
                    <option value="limitedEdition">Limited Edition</option>
                    <option value="bestSellers">Best Sellers</option>
                  </select>
                </div>

                {/* Max Price Slider */}
                <div className="mb-2">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label fw-bold small mb-0 text-dark">
                      Max Price
                    </label>
                    <span className="small fw-bold" style={{ color: "#28a745" }}>
                      Rs {maxPrice}
                    </span>
                  </div>
                  <input
                    type="range"
                    className="form-range"
                    min="0"
                    max={absoluteMaxPrice}
                    step="50"
                    value={maxPrice}
                    onChange={(e) => {
                      setMaxPrice(Number(e.target.value));
                      setVisibleCount(INITIAL_VISIBLE_COUNT);
                    }}
                  />
                  <div className="d-flex justify-content-between small text-muted">
                    <span>Rs 0</span>
                    <span>Rs {absoluteMaxPrice}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="d-flex justify-content-center align-items-center py-5 my-5">
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
          <>
            <div className="productpage-row row g-4 justify-content-start mb-4">
              {displayedProducts.length > 0 ? (
                displayedProducts.map((products) => {
                  const productId = String(products._id);
                  const isFavorite = wishlistIds.has(productId);

                  return (
                    <div
                      className="productpage-col col-12 col-sm-6 col-md-4 col-xl-3 d-flex justify-content-center"
                      key={products._id}
                    >
                      <div className="productpage-card card bg-transparent w-100">
                        <Link
                          to={`/SpecificProduct/${products._id}`}
                          className="productpage-img-link text-decoration-none"
                        >
                          <img
                            className="productpage-product-img"
                            src={products.image}
                            alt={products.name}
                          />
                        </Link>

                        <div className="productpage-card-body card-body px-0 pt-3 pb-1">
                          <div className="d-flex justify-content-between align-items-start gap-2 mb-1">
                            <div className="d-flex flex-column text-start pe-2" style={{ gap: "2px" }}>
                              <Link
                                to={`/SpecificProduct/${products._id}`}
                                className="text-decoration-none text-dark"
                              >
                                <h5 className="productpage-card-title card-title mb-0">
                                  {products.name}
                                </h5>
                              </Link>
                              <span className="productpage-category-text text-muted">
                                {products.category?.name || products.category || "Perfume"}
                              </span>
                            </div>

                            <button
                              type="button"
                              className="products-wishlist-btn"
                              onClick={() => addTotheWishlist(productId)}
                              disabled={wishlistLoadingId !== null}
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
                                  color: isFavorite ? "#e63946" : "#555",
                                }}
                              ></i>
                            </button>
                          </div>

                          <p className="productpage-card-text card-text mb-3">
                            <span
                              className="productpage-price fw-bold"
                              style={{ color: "#28a745" }}
                            >
                              Rs {products.saleprice}
                            </span>

                            <span className="productpage-old-price ms-2">
                              <s>Rs {products.price}</s>
                            </span>
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => Addtocart(products._id)}
                          className="btn-add-cart homepage-btn-add-cart"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-5 w-100">
                  <h5 className="text-muted">
                    No products matching your search criteria.
                  </h5>
                  <button
                    className="btn btn-outline-dark btn-sm mt-3 rounded-pill px-3"
                    onClick={resetFilters}
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>

            {/* Load More Button: Displays only when there are more products to reveal */}
            {processedProducts.length > visibleCount && (
              <div className="productpage-loadmore d-flex flex-column align-items-center justify-content-center my-5">
                <button
                  type="button"
                  className="productpage-loadmore-btn btn px-4 py-2"
                  onClick={handleLoadMore}
                  style={{
                    backgroundColor: "#043948",
                    color: "#ffffff",
                    
                    fontWeight: "600",
                    transition: "all 0.3s ease",
                  }}
                >
                  Load More ({processedProducts.length - visibleCount} more)
                </button>
               
              </div>
            )}
          </>
        )}
      </div>

    </>
  );
};

export default Products;