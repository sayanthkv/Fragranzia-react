import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import AdminService from '../../services/admin-api-services/AdminService';

import {
  LuLayoutDashboard,
  LuShoppingBag,
  LuList,
  LuUsers,
  LuShoppingCart,
  LuLogOut,
  LuX
} from 'react-icons/lu';

import './Adminaddproducts.css';

const Adminaddproducts = () => {
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    saleprice: '',
    quantity: '',
    category: '',
    description: '',
    status: 'Unblock'
  });

  const [categoriesData, setCategoriesData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { getCategory, addToProduct } = AdminService();
  const navigate = useNavigate();

  const handlechange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Append new files up to a maximum of 3
  const handlefilechange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (!selectedFiles.length) return;

    const availableSlots = 3 - images.length;
    if (availableSlots <= 0) {
      toast.error('You can only upload a maximum of 3 images');
      e.target.value = '';
      return;
    }

    const filesToAdd = selectedFiles.slice(0, availableSlots);
    if (selectedFiles.length > availableSlots) {
      toast('Only the first 3 images were kept.', { icon: 'ℹ️' });
    }

    const newPreviews = filesToAdd.map((file) => URL.createObjectURL(file));

    setImages((prev) => [...prev, ...filesToAdd]);
    setPreviewUrls((prev) => [...prev, ...newPreviews]);

    // Reset input so re-selecting the same file works if needed
    e.target.value = '';
  };

  // Remove individual preview and revoke object URL
  const handleRemoveImage = (indexToRemove) => {
    URL.revokeObjectURL(previewUrls[indexToRemove]);
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setPreviewUrls((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  useEffect(() => {
    const handleCategories = async () => {
      try {
        const res = await getCategory();
        setCategoriesData(Array.isArray(res) ? res : res?.categories || []);
      } catch (error) {
        console.error(
          'Error fetching categories:',
          error.response?.data || error.message
        );
        toast.error('Failed to load categories');
      }
    };

    handleCategories();

    // Cleanup previews on component unmount
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('Token');
    localStorage.removeItem('role');
    toast.success('Logged out successfully');
    navigate('/LogIn');
  };

  const handleCancel = () => {
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setImages([]);
    setPreviewUrls([]);
    setProductData({
      name: '',
      price: '',
      saleprice: '',
      quantity: '',
      category: '',
      description: '',
      status: 'Unblock'
    });

    const fileInput = document.querySelector('input[name="images"]');
    if (fileInput) fileInput.value = '';
  };

  const Onhandlesubmit = async (event) => {
    event.preventDefault();

    if (images.length === 0) {
      toast.error('Please upload at least 1 image (up to 3)');
      return;
    }

    if (!productData.name.trim()) {
      toast.error('Product name is required');
      return;
    }

    if (!productData.category) {
      toast.error('Please select a category');
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('price', productData.price);
      formData.append('saleprice', productData.saleprice);
      formData.append('quantity', productData.quantity);
      formData.append('category', productData.category);
      formData.append('description', productData.description);
      formData.append('status', productData.status);

      // Append files. Note: check backend key expectation ('images' or 'images[]')
      images.forEach((file) => {
        formData.append('images', file);
      });

      await addToProduct(formData);

      toast.success('Product added successfully!');
      handleCancel();
      navigate('/Adminproducts');
    } catch (error) {
      console.error(
        'Error adding product:',
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.message || 'Failed to add product'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="addproduct-main-container">
      <Toaster
        position="top-center"
        containerStyle={{
          top: 85,
          zIndex: 99999
        }}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#043948',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '500',
            borderRadius: '8px',
            padding: '12px 20px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
          },
          success: {
            iconTheme: {
              primary: '#2ec4b6',
              secondary: '#ffffff'
            }
          },
          error: {
            style: {
              background: '#721c24',
              color: '#ffffff'
            },
            iconTheme: {
              primary: '#f5c6cb',
              secondary: '#721c24'
            }
          }
        }}
      />

      <nav className="admin-navbar">
        <div className="admin-navbar-brand">
          <h2>Dashtar</h2>
        </div>

        <div className="admin-navbar-buttons">
          <button className="admin-nav-item">
            <LuLayoutDashboard className="admin-nav-icon" />
            <Link to="/AdminDashboard">
              <span>Dashboard</span>
            </Link>
          </button>

          <button className="admin-nav-item active">
            <LuShoppingBag className="admin-nav-icon" />
            <Link to="/Adminproducts">
              <span>Products</span>
            </Link>
          </button>

          <button className="admin-nav-item">
            <LuList className="admin-nav-icon" />
            <Link to="/AdminCategory">
              <span>Categories</span>
            </Link>
          </button>

          <button className="admin-nav-item">
            <LuUsers className="admin-nav-icon" />
            <Link to="/AdminCustomerdetails">
              <span>Customers</span>
            </Link>
          </button>

          <button className="admin-nav-item">
            <LuShoppingCart className="admin-nav-icon" />
            <Link to="/Adminorder">
              <span>Orders</span>
            </Link>
          </button>
        </div>

        <div className="admin-navbar-logout">
          <button className="admin-logout-btn" onClick={handleLogout}>
            <LuLogOut className="admin-nav-icon" />
            <span>Log Out</span>
          </button>
        </div>
      </nav>

      <div className="addproduct-main">
        <h3>Add Product</h3>
        <span>Add your product and necessary information here</span>

        <form onSubmit={Onhandlesubmit}>
          <div className="input-row">
            <div className="col">
              <label>Product name</label>
              <input
                type="text"
                name="name"
                value={productData.name}
                onChange={handlechange}
                required
              />
            </div>

            <div className="col">
              <label>Product price</label>
              <input
                type="number"
                name="price"
                value={productData.price}
                onChange={handlechange}
                min="0"
                required
              />
            </div>
          </div>

          <div className="input-row">
            <div className="col">
              <label>Saleprice</label>
              <input
                type="number"
                name="saleprice"
                value={productData.saleprice}
                onChange={handlechange}
                min="0"
                required
              />
            </div>

            <div className="col">
              <label>Product quantity</label>
              <input
                type="number"
                name="quantity"
                value={productData.quantity}
                onChange={handlechange}
                min="0"
                required
              />
            </div>

            <div className="col">
              <label>Category</label>
              <select
                name="category"
                value={productData.category}
                onChange={handlechange}
                required
              >
                <option value="">Select Category</option>
                {categoriesData
                  .filter((item) => item.isActive === true)
                  .map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="input-row">
            <div className="col">
              <label>Product Description</label>
              <textarea
                className="textarea"
                name="description"
                value={productData.description}
                onChange={handlechange}
                required
              />
            </div>
          </div>

          <div className="input-row">
            <div className="col">
              <label>Product Images ({images.length}/3)</label>
              <input
                type="file"
                name="images"
                accept="image/*"
                multiple
                onChange={handlefilechange}
                disabled={images.length >= 3}
              />
              <div className="d-flex gap-2 mt-2">
                {previewUrls.map((url, i) => (
                  <div
                    key={i}
                    style={{ position: 'relative', display: 'inline-block' }}
                  >
                    <img
                      src={url}
                      alt={`Preview ${i + 1}`}
                      style={{
                        width: 60,
                        height: 60,
                        objectFit: 'cover',
                        borderRadius: 4
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      style={{
                        position: 'absolute',
                        top: -6,
                        right: -6,
                        background: '#e63946',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '50%',
                        width: 20,
                        height: 20,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      <LuX size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="Adminaddproduct-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="submit-btn d-flex align-items-center justify-content-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div
                    className="spinner-border spinner-border-sm text-light"
                    role="status"
                    style={{
                      width: '1rem',
                      height: '1rem',
                      borderWidth: '2px'
                    }}
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <span>Adding Product...</span>
                </>
              ) : (
                'Add Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Adminaddproducts;