import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import AdminService from '../../services/admin-api-services/AdminService';
import AdminNavbar from "../../Components/admin/AdminNavbar"

import { LuX } from 'react-icons/lu';
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

    e.target.value = '';
  };

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

    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

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
          }
        }}
      />

      {/* Responsive Admin Sidebar / Mobile Navbar */}
      <AdminNavbar />

      <main className="addproduct-main">
        <div className="addproduct-header">
          <h3>Add Product</h3>
          <span className="addproduct-subtitle">
            Add your product and necessary information here
          </span>
        </div>

        <form onSubmit={Onhandlesubmit} className="addproduct-form">
          <div className="input-row">
            <div className="col">
              <label>Product name</label>
              <input
                type="text"
                name="name"
                placeholder="e.g. Leather Bag"
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
                placeholder="e.g. 1500"
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
                placeholder="e.g. 1200"
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
                placeholder="e.g. 25"
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
                name="description"
                placeholder="Write product specifications and details..."
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
              <div className="addproduct-previews-container">
                {previewUrls.map((url, i) => (
                  <div key={i} className="addproduct-preview-thumb">
                    <img src={url} alt={`Preview ${i + 1}`} />
                    <button
                      type="button"
                      className="addproduct-preview-remove-btn"
                      onClick={() => handleRemoveImage(i)}
                      aria-label="Remove image"
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
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding Product...' : 'Add Product'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Adminaddproducts;