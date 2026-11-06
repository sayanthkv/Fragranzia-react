import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Wishlist.css";

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import UserService from "../../services/user-api-services/UserService";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [addingCartId, setAddingCartId] = useState(null);

  const {
    getWishlist,
    removeProductFromWishlist,
    Addproducttocart,
  } = UserService();

  useEffect(() => {
    let isMounted = true;

    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const response = await getWishlist();
        console.log("Raw Wishlist Item Sample:", response.wishlist?.[0]);
        if (isMounted) {
          setWishlistItems(response?.wishlist || []);
        }
      } catch (error) {
        console.error(
          "Failed to fetch wishlist:",
          error.response?.data || error.message
        );
        toast.error(
          error.response?.data?.message || "Unable to load your wishlist."
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    

    fetchWishlist();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDeleteItem = async (productId) => {
    try {
      setRemovingId(productId);
      await removeProductFromWishlist(productId);

      setWishlistItems((prevItems) =>
        prevItems.filter((item) => {
          const currentId =
            item.productId?._id ||
            item.productId ||
            item.product?._id ||
            item.product ||
            item._id ||
            item.id;
          return String(currentId) !== String(productId);
        })
      );

      toast.success("Product removed from wishlist.");
    } catch (error) {
      console.error(
        "Delete wishlist error:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.message || "Unable to remove this product."
      );
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      setAddingCartId(productId);
      const response = await Addproducttocart(productId);
      toast.success(response?.message || "Product added to cart successfully!");
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
      setAddingCartId(null);
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

    

      <main className="container-fluid px-4 px-md-5 my-4 wishlist-container">
        <h2 className="wishlist-heading mb-1 fw-bold" style={{ color: "#043948" }}>
          Wishlist
        </h2>

        <div className="wishlist-breadcrumb mb-4 text-muted small">
          <Link to="/" className="text-decoration-none text-muted">Home</Link> &gt; Wishlist
        </div>

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
        ) : wishlistItems.length === 0 ? (
          <div className="wishlist-empty text-center py-5">
            <i className="fa-regular fa-heart fa-3x mb-3 text-muted"></i>
            <h4 className="fw-bold">Your wishlist is empty</h4>
            <p className="text-muted">
              Explore our fragrance collection and add your favorite products.
            </p>
            <Link to="/Products" className="btn btn-dark mt-2 px-4 py-2">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {wishlistItems.map((item) => {
              const productObj =
                typeof item.productId === "object" && item.productId !== null
                  ? item.productId
                  : typeof item.product === "object" && item.product !== null
                  ? item.product
                  : item;

              const productId = String(
                productObj._id ||
                productObj.id ||
                item.productId ||
                item.id ||
                item._id
              );

              const productImage =
                productObj.image ||
                productObj.imageUrl ||
                item.image ||
                item.imageUrl;

              const productTitle =
                productObj.name ||
                productObj.title ||
                item.title ||
                item.name ||
                "Fragrance";

              const salePrice =
                productObj.saleprice ??
                productObj.price ??
                item.saleprice ??
                item.price ??
                0;

              const originalPrice =
                productObj.price ??
                item.originalPrice ??
                item.price;

              const hasDiscount =
                Number(originalPrice) > Number(salePrice) &&
                productObj.saleprice !== undefined;

              return (
                <div className="col-12 col-md-6 col-lg-4" key={productId}>
                  <div className="wishlist-card">
                    <div className="wishlist-image">
                      {productImage ? (
                        <Link to={`/SpecificProduct/${productId}`}>
                          <img
                            src={productImage}
                            alt={productTitle}
                            style={{ objectFit: "contain" }}
                          />
                        </Link>
                      ) : (
                        <div className="wishlist-no-image">
                          <i className="fa-regular fa-image fa-2x text-muted"></i>
                          <p className="small text-muted mt-2">No image available</p>
                        </div>
                      )}
                    </div>

                    <div className="wishlist-details">
                      <Link
                        to={`/SpecificProduct/${productId}`}
                        className="text-decoration-none text-dark"
                      >
                        <h3 className="fs-5 fw-bold mb-2">{productTitle}</h3>
                      </Link>

                      <div className="wishlist-price mb-3">
                        <span
                          className="wishlist-current-price fw-bold"
                          style={{ color: "#28a745" }}
                        >
                          Rs {salePrice}
                        </span>

                        {hasDiscount && (
                          <>
                            <span className="wishlist-original-price ms-2 text-muted text-decoration-line-through">
                              Rs {originalPrice}
                            </span>

                            <span className="wishlist-discount ms-2 text-danger small fw-semibold">
                              {Math.round(
                                ((originalPrice - salePrice) / originalPrice) * 100
                              )}
                              % off
                            </span>
                          </>
                        )}
                      </div>

                      <div className="wishlist-actions d-flex gap-2">
                        <button
                          className="wishlist-delete btn btn-outline-danger btn-sm"
                          type="button"
                          disabled={removingId === productId}
                          onClick={() => handleDeleteItem(productId)}
                        >
                          {removingId === productId ? "Removing..." : "Remove"}
                        </button>

                        <button
                          className="wishlist-cart btn btn-primary btn-sm flex-grow-1"
                          type="button"
                          disabled={addingCartId === productId}
                          onClick={() => handleAddToCart(productId)}
                          style={{
                            backgroundColor: "#043948",
                            borderColor: "#043948",
                          }}
                        >
                          {addingCartId === productId ? "Adding..." : "Add to Cart"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

     
    </>
  );
};

export default Wishlist;