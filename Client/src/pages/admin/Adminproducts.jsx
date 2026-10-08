
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
    <div className="adminproduct-main-container">

      <nav className="adminproduct-navbar">

        <div className="adminproduct-navbar-brand">
          <h2>Dashtar</h2>
        </div>

        <div className="adminproduct-navbar-buttons">

          <button className="adminproduct-nav-item">
            <LuLayoutDashboard className="adminproduct-nav-icon" />
            <span>Dashboard</span>
          </button>

          <button className="adminproduct-nav-item">
            <LuShoppingBag className="adminproduct-nav-icon" />
            <Link to="/Adminproducts">
              <span>Products</span>
            </Link>
          </button>

          <button className="adminproduct-nav-item">
            <LuList className="adminproduct-nav-icon" />
            <Link to="/AdminCategory">
              <span>Categories</span>
            </Link>
          </button>

          <button className="adminproduct-nav-item">
            <LuTag className="adminproduct-nav-icon" />
            <span>Offers</span>
          </button>

          <button className="adminproduct-nav-item">
            <LuUsers className="adminproduct-nav-icon" />
            <Link to="/AdminCustomerdetails">
              <span>Customers</span>
            </Link>
          </button>

          <button className="adminproduct-nav-item">
            <LuShoppingCart className="adminproduct-nav-icon" />
            <Link to='/Adminorder'>
              <span>Orders</span>
            </Link>
          </button>

        </div>

        <div className="adminproduct-navbar-logout">

          <button className="adminproduct-logout-btn">
            <LuLogOut className="adminproduct-nav-icon" />
            <span>Log Out</span>
          </button>

        </div>

      </nav>

      <div className="adminproduct-main-content">

        <div className="adminproduct-action-bar">

          <div className="adminproduct-action-left">

            <button className="adminproduct-btn adminproduct-btn-secondary">
              <LuDownload className="adminproduct-btn-icon" />
              Export
            </button>

            <button className="adminproduct-btn adminproduct-btn-secondary">
              <LuUpload className="adminproduct-btn-icon" />
              Import
            </button>

          </div>

          <button className="adminproduct-btn adminproduct-btn-primary">
            <Link to="/Adminaddproducts">
              <LuPlus className="adminproduct-btn-icon" />
              Add Product
            </Link>
          </button>

        </div>

        <div className="adminproduct-table-card">

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

                  <td className="adminproduct-col-name">
                    {item.name}
                  </td>

                  <td className="adminproduct-col-category">
                    {item.category?.name}
                  </td>

                  <td className="adminproduct-col-category">
                    ₹{item.price}
                  </td>

                  <td className="adminproduct-col-category">
                    ₹{item.saleprice}
                  </td>

                  <td className="adminproduct-col-category">
                    {item.quantity}
                  </td>

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
                      {item.status}
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          <div className="adminproduct-pagination">

            <button
              className="adminproduct-page-btn"
              disabled
            >
              Previous
            </button>

            <span className="adminproduct-page-info">
              Page 1 of 2
            </span>

            <button className="adminproduct-page-btn">
              Next
            </button>

          </div>

        </div>

      </div>

      {selectedProduct && (

        <div
          className="adminproduct-modal-overlay"
          onClick={handleCloseProduct}
        >

          <div
            className="adminproduct-modal-content adminproduct-details-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="adminproduct-modal-header">

              <h3>
                <LuEye className="adminproduct-view-modal-icon" />
                Product Details
              </h3>

              <button
                className="adminproduct-modal-close-btn"
                onClick={handleCloseProduct}
              >
                <LuX />
              </button>

            </div>

            <hr className="adminproduct-view-modal-divider" />

            <div className="adminproduct-view-product-info">

              <div className="adminproduct-view-product-image-section">

                <label>Product Image</label>

                <div className="adminproduct-view-product-image">

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

              <div className="adminproduct-view-product-details">

                <div className="adminproduct-view-detail-group">
                  <label>Product Name</label>
                  <p>{selectedProduct.name}</p>
                </div>

                <div className="adminproduct-view-detail-group">
                  <label>Category</label>

                  <span className="adminproduct-view-category-badge">
                    {selectedProduct.category?.name}
                  </span>

                </div>

                <div className="adminproduct-view-price-section">

                  <div className="adminproduct-view-detail-group">
                    <label>Price</label>

                    <p className="adminproduct-view-regular-price">
                      ₹{selectedProduct.price}
                    </p>

                  </div>

                  <div className="adminproduct-view-detail-group">
                    <label>Sale Price</label>

                    <p className="adminproduct-view-sale-price">
                      ₹{selectedProduct.saleprice}
                    </p>

                  </div>

                </div>

                <div className="adminproduct-view-status-section">

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
                        : 'Out of Stock'
                      }
                    </span>

                  </div>

                  <div className="adminproduct-view-detail-group">

                    <label>Status</label>

                    <button
                      className={`adminproduct-status-btn ${
                        selectedProduct.status === 'Unblock'
                          ? 'adminproduct-status-unblock'
                          : 'adminproduct-status-block'
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

            <div className="adminproduct-view-description-section">

              <label>Description</label>

              <textarea
                className="adminproduct-view-product-description"
                value={selectedProduct.description || ''}
                readOnly
              />

            </div>

            <div className="adminproduct-view-modal-footer">

              <button
                className="adminproduct-view-close-btn"
                onClick={handleCloseProduct}
              >
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

      {editingProduct && (

        <div
          className="adminproduct-modal-overlay"
          onClick={handleCloseEdit}
        >

          <div
            className="adminproduct-modal-content adminproduct-edit-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="adminproduct-modal-header">

              <h3>
                Update Product
              </h3>

              <button
                className="adminproduct-modal-close-btn"
                onClick={handleCloseEdit}
              >
                <LuX />
              </button>

            </div>

            <form
              onSubmit={handleSave}
              className="adminproduct-modal-form"
            >

              <div className="adminproduct-form-group">

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

              <div className="adminproduct-form-group">

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

              <div className="adminproduct-form-group">

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

              <div className="adminproduct-form-group">

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

              <div className="adminproduct-form-group">

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

              <div className="adminproduct-form-group">
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

              <div className="adminproduct-form-group">

                <label htmlFor="productImage">
                  Product Image
                </label>

                <div className="adminproduct-edit-image-container">

                  {imagePreview ? (

                    <img
                      className="adminproduct-editimageview"
                      src={imagePreview}
                      alt="Product"
                    />

                  ) : (

                    <div className="adminproduct-edit-no-image">
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

              <div className="adminproduct-edit-action">

                <button
                  type="button"
                  className="adminproduct-edit-cancel"
                  onClick={handleCloseEdit}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="adminproduct-edit-update"
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
