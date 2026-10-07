import React, { useEffect, useState } from 'react';
import axios from 'axios';

import {
  LuLayoutDashboard,
  LuShoppingBag,
  LuList,
  LuTag,
  LuUsers,
  LuShoppingCart,
  LuLogOut,
  LuPencil,
  LuPlus,
  LuDownload,
  LuUpload,
  LuEye,
  LuX
} from 'react-icons/lu';

import './Adminproducts.css';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:5000/Products';
const IMAGE_URL = 'http://localhost:5000/uploads';
const CATEGORY_API_URL = 'http://localhost:5000/Category';

const Adminproducts = () => {
  const [product, setProduct] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
const [categories, setCategories] = useState([]);

const fetchCategories = async () => {
  try {
    const res = await axios.get(CATEGORY_API_URL);
    setCategories(res.data);
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

  const fetchproduct = async () => {
    try {
      const res = await axios.get(API_URL);
      setProduct(res.data);
    } catch (error) {
      console.error('Error fetching products:', error);
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
    category: item.category?._id || ''
  });

  setImagePreview(
    item.image
      ? `${IMAGE_URL}/${item.image}`
      : ''
  );

  setSelectedImage(null);
};

  const handleCloseEdit = () => {
    setEditingProduct(null);
    setImagePreview('');
    setSelectedImage(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setEditingProduct((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    setSelectedImage(file);

    const imageUrl = URL.createObjectURL(file);

    setImagePreview(imageUrl);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append('name', editingProduct.name || '');
      formData.append('description', editingProduct.description || '');
      formData.append('price', editingProduct.price || '');
      formData.append('saleprice', editingProduct.saleprice || '');
      formData.append('quantity', editingProduct.quantity || '');
      formData.append(
          'category',
          editingProduct.category || ''
        );

      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      const res = await axios.put(
        `${API_URL}/${editingProduct._id}`,
        formData
      );

      setProduct((prevProducts) =>
        prevProducts.map((item) =>
          item._id === editingProduct._id
            ? res.data
            : item
        )
      );

      setEditingProduct(null);
      setImagePreview('');
      setSelectedImage(null);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const toggleStatus = async (id) => {
    try {
      const currentProduct = product.find(
        (item) => item._id === id
      );

      if (!currentProduct) {
        return;
      }

      const newStatus =
        currentProduct.status === 'Block'
          ? 'Unblock'
          : 'Block';

      const res = await axios.put(
        `${API_URL}/${id}/status`,
        {
          status: newStatus
        }
      );

      setProduct((prevProducts) =>
        prevProducts.map((item) =>
          item._id === id
            ? res.data
            : item
        )
      );

      setSelectedProduct((prev) =>
        prev && prev._id === id
          ? res.data
          : prev
      );
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  useEffect(() => {
  fetchproduct();
  fetchCategories();
}, []);

  return (
    <div className="product-main-container">

      <nav className="admin-navbar">

        <div className="admin-navbar-brand">
          <h2>Dashtar</h2>
        </div>

        <div className="admin-navbar-buttons">

          <button className="admin-nav-item">
            <LuLayoutDashboard className="admin-nav-icon" />
            <span>Dashboard</span>
          </button>

          <button className="admin-nav-item">
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
            <LuTag className="admin-nav-icon" />
            <span>Offers</span>
          </button>

          <button className="admin-nav-item">
            <LuUsers className="admin-nav-icon" />
            <Link to="/AdminCustomerdetails">
              <span>Customers</span>
            </Link>
          </button>

          <button className="admin-nav-item">
            <LuShoppingCart className="admin-nav-icon" />
            <span>Orders</span>
          </button>

        </div>

        <div className="admin-navbar-logout">

          <button className="admin-logout-btn">
            <LuLogOut className="admin-nav-icon" />
            <span>Log Out</span>
          </button>

        </div>

      </nav>

      <div className="product-main-content">

        <div className="product-action-bar">

          <div className="product-action-left">

            <button className="product-btn product-btn-secondary">
              <LuDownload className="btn-icon" />
              Export
            </button>

            <button className="product-btn product-btn-secondary">
              <LuUpload className="btn-icon" />
              Import
            </button>

          </div>

          <button className="product-btn product-btn-primary">
            <Link to="/Adminaddproducts">
              <LuPlus className="btn-icon" />
              Add Product
            </Link>
          </button>

        </div>

        <div className="product-table-card">

          <table className="product-table">

            <thead className="product-table-head">

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

            <tbody className="product-table-body">

              {product.map((item) => (

                <tr key={item._id}>

                  <td className="product-col-name">
                    {item.name}
                  </td>

                  <td className="product-col-category">
                    {item.category?.name}
                  </td>

                  <td className="product-col-category">
                    ₹{item.price}
                  </td>

                  <td className="product-col-category">
                    ₹{item.saleprice}
                  </td>

                  <td className="product-col-category">
                    {item.quantity}
                  </td>

                  <td className="product-col-actions">

                    <button
                      className="product-action-show-btn"
                      onClick={() => handleShowProduct(item)}
                    >
                      <LuEye className="action-icon" />
                      Show
                    </button>

                    <button
                      className="product-action-edit-btn"
                      onClick={() => handleEditProduct(item)}
                    >
                      <LuPencil className="action-icon" />
                      Edit
                    </button>

                  </td>

                  <td className="Products-col-status">

                    <button
                      onClick={() => toggleStatus(item._id)}
                      className={`product-status-btn ${
                        item.status === 'Unblock'
                          ? 'status-unblock'
                          : 'status-block'
                      }`}
                    >
                      {item.status}
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          <div className="product-pagination">

            <button
              className="product-page-btn"
              disabled
            >
              Previous
            </button>

            <span className="product-page-info">
              Page 1 of 2
            </span>

            <button className="product-page-btn">
              Next
            </button>

          </div>

        </div>

      </div>

      {selectedProduct && (

        <div
          className="adminmodal-overlay"
          onClick={handleCloseProduct}
        >

          <div
            className="adminmodal-content product-details-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="adminmodal-header">

              <h3>
                <LuEye className="view-modal-icon" />
                Product Details
              </h3>

              <button
                className="adminmodal-close-btn"
                onClick={handleCloseProduct}
              >
                <LuX />
              </button>

            </div>

            <hr className="view-modal-divider" />

            <div className="view-product-info">

              <div className="view-product-image-section">

                <label>Product Image</label>

                <div className="view-product-image">

                  {selectedProduct.image ? (

                    <img
                      src={`${IMAGE_URL}/${selectedProduct.image}`}
                      alt={selectedProduct.name}
                    />

                  ) : (

                    <span>No Image</span>

                  )}

                </div>

              </div>

              <div className="view-product-details">

                <div className="view-detail-group">
                  <label>Product Name</label>
                  <p>{selectedProduct.name}</p>
                </div>

                <div className="view-detail-group">
                  <label>Category</label>

                  <span className="view-category-badge">
                    {selectedProduct.category?.name}
                  </span>

                </div>

                <div className="view-price-section">

                  <div className="view-detail-group">
                    <label>Price</label>

                    <p className="view-regular-price">
                      ₹{selectedProduct.price}
                    </p>

                  </div>

                  <div className="view-detail-group">
                    <label>Sale Price</label>

                    <p className="view-sale-price">
                      ₹{selectedProduct.saleprice}
                    </p>

                  </div>

                </div>

                <div className="view-status-section">

                  <div className="view-detail-group">

                    <label>Stock</label>

                    <span
                      className={`view-stock-badge ${
                        selectedProduct.quantity > 0
                          ? 'in-stock'
                          : 'out-of-stock'
                      }`}
                    >
                      {selectedProduct.quantity > 0
                        ? `${selectedProduct.quantity} In Stock`
                        : 'Out of Stock'
                      }
                    </span>

                  </div>

                  <div className="view-detail-group">

                    <label>Status</label>

                    <button
                      className={`product-status-btn ${
                        selectedProduct.status === 'Unblock'
                          ? 'status-unblock'
                          : 'status-block'
                      }`}
                      onClick={() =>
                        toggleStatus(selectedProduct._id)
                      }
                    >
                      {selectedProduct.status}
                    </button>

                  </div>

                </div>

              </div>

            </div>

            <div className="view-description-section">

              <label>Description</label>

              <textarea
                className="view-product-description"
                value={selectedProduct.description || ''}
                readOnly
              />

            </div>

            <div className="view-modal-footer">

              <button
                className="view-close-btn"
                onClick={handleCloseProduct}
              >
                Close
              </button>

              <button
                className="view-edit-product-btn"
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

      {editingProduct && (

        <div
          className="adminmodal-overlay"
          onClick={handleCloseEdit}
        >

          <div
            className="adminmodal-content admin-edit-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="adminmodal-header">

              <h3>
                Update Product
              </h3>

              <button
                className="adminmodal-close-btn"
                onClick={handleCloseEdit}
              >
                <LuX />
              </button>

            </div>

            <form
              onSubmit={handleSave}
              className="adminmodal-form"
            >

              <div className="form-group">

                <label htmlFor="name">
                  Name
                </label>

                <input
                  type="text"
                  id="name"
                  name="name"
                  value={editingProduct.name || ''}
                  onChange={handleInputChange}
                />

              </div>

              <div className="form-group">

                <label htmlFor="description">
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  value={editingProduct.description || ''}
                  onChange={handleInputChange}
                />

              </div>

              <div className="form-group">

                <label htmlFor="price">
                  Price
                </label>

                <input
                  type="number"
                  id="price"
                  name="price"
                  value={editingProduct.price || ''}
                  onChange={handleInputChange}
                />

              </div>

              <div className="form-group">

                <label htmlFor="saleprice">
                  Sale Price
                </label>

                <input
                  type="number"
                  id="saleprice"
                  name="saleprice"
                  value={editingProduct.saleprice || ''}
                  onChange={handleInputChange}
                />

              </div>

              <div className="form-group">

                <label htmlFor="quantity">
                  Stock
                </label>

                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={editingProduct.quantity || ''}
                  onChange={handleInputChange}
                />

              </div>

               <div className="form-group">
                <label htmlFor="category">Category</label>

                <select
                  id="category"
                  name="category"
                  value={editingProduct.category || ''}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">
                    Select Category
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category._id}
                      value={category._id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">

                <label htmlFor="productImage">
                  Product Image
                </label>

                <div className="edit-image-container">

                  {imagePreview ? (

                    <img
                      className="editimageview"
                      src={imagePreview}
                      alt="Product"
                    />

                  ) : (

                    <div className="edit-no-image">
                      No Image
                    </div>

                  )}

                </div>

                <input
                  type="file"
                  id="productImage"
                  accept="image/*"
                  onChange={handleImageChange}
                />

              </div>

              <div className="adminedit-action">

                <button
                  type="button"
                  className="adminedit-cancel"
                  onClick={handleCloseEdit}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="adminedit-update"
                >
                  Update Product
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
