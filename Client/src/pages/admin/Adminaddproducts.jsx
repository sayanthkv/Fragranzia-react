import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import {
  LuLayoutDashboard,
  LuShoppingBag,
  LuList,
  LuTag,
  LuUsers,
  LuShoppingCart,
  LuLogOut
} from 'react-icons/lu';

import './Adminaddproducts.css';

const API_URL = 'http://localhost:5000/Products';
const CATEGORY_API_URL = 'http://localhost:5000/Category';

const Adminaddproducts = () => {
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    saleprice: '',
    quantity: '',
    category: '',
    description: '',
    image: null,
    status: 'Unblock'
  });

  const [categoriesData, setCategoriesData] = useState([]);

  const handlechange = (e) => {
    const { name, value } = e.target;

    setProductData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // FIXED FILE HANDLER
  const handlefilechange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setProductData((prev) => ({
        ...prev,
        image: file
      }));
    }
  };

  useEffect(() => {
    const handleCategories = async () => {
      try {
        const res = await axios.get(CATEGORY_API_URL);
        setCategoriesData(res.data);
      } catch (error) {
        console.log(
          'Error fetching categories:',
          error.response?.data || error.message
        );
      }
    };

    handleCategories();
  }, []);

  const Onhandlesubmit = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();

      formData.append('name', productData.name);
      formData.append('price', productData.price);
      formData.append('saleprice', productData.saleprice);
      formData.append('quantity', productData.quantity);
      formData.append('category', productData.category);
      formData.append('description', productData.description);
      formData.append('status', productData.status);

      // Only append image if selected
      if (productData.image) {
        formData.append('image', productData.image);
      }

      const res = await axios.post(API_URL, formData);

      console.log('Product added:', res.data);

      alert('Product added successfully!');

      handleCancel();

    } catch (error) {
      console.log(
        'Error adding product:',
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message || 'Failed to add product'
      );
    }
  };

  const handleCancel = () => {
    setProductData({
      name: '',
      price: '',
      saleprice: '',
      quantity: '',
      category: '',
      description: '',
      image: null,
      status: 'Unblock'
    });
  };

  return (
    <div className="addproduct-main-container">

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

      <div className="addproduct-main">

        <h3>Add Product</h3>

        <span>
          Add your product and necessary information here
        </span>

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
                <option value="">
                  Select Category
                </option>

                {categoriesData.map((item) => (
                  <option
                    key={item._id}
                    value={item._id}
                  >
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

              <label>Product image</label>

              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handlefilechange}
                required
              />

            </div>

          </div>

          <div className="Adminaddproduct-actions">

            <button
              type="button"
              className="cancel-btn"
              onClick={handleCancel}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="submit-btn"
            >
              Add Product
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default Adminaddproducts;
