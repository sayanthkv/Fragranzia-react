import React, { useEffect, useState } from 'react';
import AdminService from '../../services/admin-api-services/AdminService';
import AdminNavbar from "../../Components/admin/AdminNavbar"
import toast, { Toaster } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

import {
  LuPencil,
  LuPlus,
  LuEye,
  LuX
} from 'react-icons/lu';

import './Adminproducts.css';

const Adminproducts = () => {
  const [product, setProduct] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  // Multi-image management state
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { getCategory, getProduct, EditProduct, editProductStatus } = AdminService();
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const res = await getCategory();
      setCategories(Array.isArray(res) ? res : res?.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const fetchproduct = async () => {
    try {
      setLoading(true);
      const res = await getProduct();
      setProduct(Array.isArray(res) ? res : res?.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleShowProduct = (item) => {
    setSelectedProduct(item);
  };

  const handleCloseProduct = () => {
    setSelectedProduct(null);
  };

  const handleEditProduct = (item) => {
    setEditingProduct({
      ...item,
      category: item.category?._id || item.category || ''
    });

    const currentImgs = item.images && item.images.length > 0 
      ? item.images 
      : item.image ? [item.image] : [];

    setExistingImages(currentImgs);
    setNewImages([]);
    setNewImagePreviews([]);
  };

  const handleCloseEdit = () => {
    if (isSubmitting) return;
    setEditingProduct(null);
    setExistingImages([]);
    setNewImages([]);
    setNewImagePreviews([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const currentTotal = existingImages.length + newImages.length;
    const availableSlots = 3 - currentTotal;

    if (availableSlots <= 0) {
      toast.error('Maximum 3 images allowed');
      e.target.value = '';
      return;
    }

    const acceptedFiles = files.slice(0, availableSlots);
    if (files.length > availableSlots) {
      toast(`Only ${availableSlots} more image(s) could be added (max 3).`);
    }

    const updatedNewFiles = [...newImages, ...acceptedFiles];
    setNewImages(updatedNewFiles);

    const previews = updatedNewFiles.map((file) => URL.createObjectURL(file));
    setNewImagePreviews(previews);

    e.target.value = '';
  };

  const handleRemoveExistingImage = (indexToRemove) => {
    const totalRemaining = (existingImages.length - 1) + newImages.length;
    if (totalRemaining < 1) {
      toast.error('Product must have at least 1 image');
      return;
    }
    setExistingImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleRemoveNewImage = (indexToRemove) => {
    const totalRemaining = existingImages.length + (newImages.length - 1);
    if (totalRemaining < 1) {
      toast.error('Product must have at least 1 image');
      return;
    }
    const updatedFiles = newImages.filter((_, idx) => idx !== indexToRemove);
    setNewImages(updatedFiles);
    setNewImagePreviews(updatedFiles.map((file) => URL.createObjectURL(file)));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!editingProduct.name?.trim()) {
      toast.error('Product name is required');
      return;
    }

    const totalImages = existingImages.length + newImages.length;
    if (totalImages === 0) {
      toast.error('Please keep or upload at least 1 image');
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();

      formData.append('name', editingProduct.name || '');
      formData.append('description', editingProduct.description || '');
      formData.append('price', editingProduct.price || '');
      formData.append('saleprice', editingProduct.saleprice || '');
      formData.append('quantity', editingProduct.quantity || '');
      formData.append('category', editingProduct.category || '');

      existingImages.forEach((imgUrl) => {
        formData.append('existingImages', imgUrl);
      });

      newImages.forEach((file) => {
        formData.append('images', file);
      });

      const res = await EditProduct(editingProduct._id, formData);
      const updatedItem = res?.product || res;

      setProduct((prevProducts) =>
        prevProducts.map((item) =>
          item._id === editingProduct._id ? updatedItem : item
        )
      );

      setSelectedProduct((prev) =>
        prev && prev._id === editingProduct._id ? updatedItem : prev
      );

      toast.success('Product updated successfully!');
      handleCloseEdit();
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error(error.response?.data?.message || 'Error updating product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (id) => {
    try {
      const currentProduct = product.find((item) => item._id === id);
      if (!currentProduct) return;

      const newStatus = currentProduct.status === 'Block' ? 'Unblock' : 'Block';
      const res = await editProductStatus(id, { status: newStatus });
      const updatedItem = res?.product || res;

      setProduct((prevProducts) =>
        prevProducts.map((item) => (item._id === id ? updatedItem : item))
      );

      setSelectedProduct((prev) =>
        prev && prev._id === id ? updatedItem : prev
      );

      toast.success(`Product ${newStatus === 'Block' ? 'blocked' : 'unblocked'} successfully!`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.response?.data?.message || 'Error updating product status');
    }
  };

  const formatStatusLabel = (status) => (status === 'Block' ? 'Blocked' : 'Unblocked');

  useEffect(() => {
    fetchproduct();
    fetchCategories();
  }, []);

  return (
    <div className="adminproduct-main-container">
      <Toaster
        position="top-center"
        containerStyle={{ top: 85, zIndex: 99999 }}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#043948',
            color: '#ffffff',
            fontSize: '14px',
            borderRadius: '8px',
            padding: '12px 20px'
          }
        }}
      />

      {/* Responsive Admin Sidebar / Mobile Navbar */}
      {/* <AdminNavbar /> */}

      <div className="adminproduct-main-content">
        <div className="adminproduct-action-bar">
          <div className="adminproduct-action-left"></div>
          <button className="adminproduct-btn adminproduct-btn-primary">
            <Link to="/Adminaddproducts">
              <LuPlus className="adminproduct-btn-icon" />
              Add Product
            </Link>
          </button>
        </div>

        <div className="adminproduct-table-card">
          {loading ? (
            <div className="adminproduct-loader-container">
              <div className="adminproduct-spinner" role="status"></div>
              <p>Loading products...</p>
            </div>
          ) : product.length === 0 ? (
            <div className="adminproduct-empty-state">
              <p>No products found.</p>
            </div>
          ) : (
            <table className="adminproduct-table">
              <thead className="adminproduct-table-head">
                <tr>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Sale Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody className="adminproduct-table-body">
                {product.map((item) => (
                  <tr key={item._id}>
                    <td className="adminproduct-col-name">{item.name}</td>
                    <td className="adminproduct-col-category">
                      {item.category?.name || 'Uncategorized'}
                    </td>
                    <td className="adminproduct-col-category">₹{item.price}</td>
                    <td className="adminproduct-col-category">₹{item.saleprice}</td>
                    <td className="adminproduct-col-category">{item.quantity}</td>
                    <td className="adminproduct-col-actions">
                      <button
                        className="adminproduct-action-show-btn"
                        onClick={() => handleShowProduct(item)}
                      >
                        <LuEye className="adminproduct-action-icon" />
                        Show
                      </button>

                      <button
                        className="adminproduct-action-edit-btn"
                        onClick={() => handleEditProduct(item)}
                      >
                        <LuPencil className="adminproduct-action-icon" />
                        Edit
                      </button>
                    </td>

                    <td className="adminproduct-col-status">
                      <button
                        onClick={() => toggleStatus(item._id)}
                        className={`adminproduct-status-btn ${
                          item.status === 'Unblock'
                            ? 'adminproduct-status-unblock'
                            : 'adminproduct-status-block'
                        }`}
                      >
                        {formatStatusLabel(item.status)}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* --- View Modal --- */}
      {selectedProduct && (
        <div className="adminproduct-modal-overlay" onClick={handleCloseProduct}>
          <div
            className="adminproduct-modal-content adminproduct-details-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="adminproduct-modal-header">
              <h3>
                <LuEye className="adminproduct-view-modal-icon" />
                Product Details
              </h3>
              <button className="adminproduct-modal-close-btn" onClick={handleCloseProduct}>
                <LuX />
              </button>
            </div>

            <hr className="adminproduct-view-modal-divider" />

            <div className="adminproduct-view-product-info">
              <div className="adminproduct-view-product-image-section">
                <label>Product Images</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {(selectedProduct.images?.length > 0
                    ? selectedProduct.images
                    : selectedProduct.image ? [selectedProduct.image] : []
                  ).map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={selectedProduct.name}
                      style={{
                        width: '70px',
                        height: '70px',
                        objectFit: 'cover',
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0'
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="adminproduct-view-product-details">
                <div className="adminproduct-view-detail-group">
                  <label>Product Name</label>
                  <p>{selectedProduct.name}</p>
                </div>

                <div className="adminproduct-view-detail-group">
                  <label>Category</label>
                  <span className="adminproduct-view-category-badge">
                    {selectedProduct.category?.name || 'Uncategorized'}
                  </span>
                </div>

                <div className="adminproduct-view-price-section">
                  <div className="adminproduct-view-detail-group">
                    <label>Price</label>
                    <p className="adminproduct-view-regular-price">₹{selectedProduct.price}</p>
                  </div>

                  <div className="adminproduct-view-detail-group">
                    <label>Sale Price</label>
                    <p className="adminproduct-view-sale-price">₹{selectedProduct.saleprice}</p>
                  </div>
                </div>

                <div className="adminproduct-view-detail-group">
                  <label>Stock</label>
                  <span
                    className={`adminproduct-view-stock-badge ${
                      selectedProduct.quantity > 0
                        ? 'adminproduct-in-stock'
                        : 'adminproduct-out-of-stock'
                    }`}
                  >
                    {selectedProduct.quantity > 0
                      ? `${selectedProduct.quantity} In Stock`
                      : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>

            <div className="adminproduct-view-description-section">
              <label>Description</label>
              <textarea
                className="adminproduct-view-product-description"
                value={selectedProduct.description || ''}
                readOnly
              />
            </div>

            <div className="adminproduct-view-modal-footer">
              <button className="adminproduct-view-close-btn" onClick={handleCloseProduct}>
                Close
              </button>
              <button
                className="adminproduct-view-edit-product-btn"
                onClick={() => {
                  handleCloseProduct();
                  handleEditProduct(selectedProduct);
                }}
              >
                <LuPencil />
                Edit Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Edit Modal --- */}
      {editingProduct && (
        <div className="adminproduct-modal-overlay" onClick={handleCloseEdit}>
          <div
            className="adminproduct-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="adminproduct-modal-header">
              <h3>Update Product</h3>
              <button
                className="adminproduct-modal-close-btn"
                onClick={handleCloseEdit}
                disabled={isSubmitting}
              >
                <LuX />
              </button>
            </div>

            <form onSubmit={handleSave} className="adminproduct-modal-form">
              <div className="adminproduct-form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={editingProduct.name || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="adminproduct-form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  value={editingProduct.description || ''}
                  onChange={handleInputChange}
                />
              </div>

              <div className="adminproduct-form-group">
                <label htmlFor="price">Price</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={editingProduct.price || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="adminproduct-form-group">
                <label htmlFor="saleprice">Sale Price</label>
                <input
                  type="number"
                  id="saleprice"
                  name="saleprice"
                  value={editingProduct.saleprice || ''}
                  onChange={handleInputChange}
                />
              </div>

              <div className="adminproduct-form-group">
                <label htmlFor="quantity">Stock</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={editingProduct.quantity || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="adminproduct-form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={editingProduct.category || ''}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories
                    .filter((category) => category.isActive === true)
                    .map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Product Images */}
              <div className="adminproduct-form-group">
                <label>
                  Product Images (Min 1, Max 3) — Currently: {existingImages.length + newImages.length}/3
                </label>

                <div
                  style={{
                    display: 'flex',
                    gap: '12px',
                    flexWrap: 'wrap',
                    marginBottom: '10px'
                  }}
                >
                  {existingImages.map((imgUrl, idx) => (
                    <div
                      key={`existing-${idx}`}
                      style={{
                        position: 'relative',
                        width: '74px',
                        height: '74px',
                        border: '1px solid #dcdcdc',
                        borderRadius: '8px',
                        overflow: 'hidden'
                      }}
                    >
                      <img
                        src={imgUrl}
                        alt="Product Existing"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(idx)}
                        style={{
                          position: 'absolute',
                          top: '3px',
                          right: '3px',
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          background: 'rgba(239, 68, 68, 0.9)',
                          color: '#fff',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          fontSize: '11px',
                          padding: 0
                        }}
                        title="Remove image"
                      >
                        <LuX />
                      </button>
                    </div>
                  ))}

                  {newImagePreviews.map((previewUrl, idx) => (
                    <div
                      key={`new-${idx}`}
                      style={{
                        position: 'relative',
                        width: '74px',
                        height: '74px',
                        border: '2px dashed #10b981',
                        borderRadius: '8px',
                        overflow: 'hidden'
                      }}
                    >
                      <img
                        src={previewUrl}
                        alt="New Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveNewImage(idx)}
                        style={{
                          position: 'absolute',
                          top: '3px',
                          right: '3px',
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          background: 'rgba(239, 68, 68, 0.9)',
                          color: '#fff',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          fontSize: '11px',
                          padding: 0
                        }}
                        title="Remove image"
                      >
                        <LuX />
                      </button>
                    </div>
                  ))}
                </div>

                {existingImages.length + newImages.length < 3 && (
                  <input
                    type="file"
                    id="productImages"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                  />
                )}
              </div>

              <div className="adminproduct-edit-action">
                <button
                  type="button"
                  className="adminproduct-edit-cancel"
                  onClick={handleCloseEdit}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="adminproduct-edit-update"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Update Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Adminproducts;