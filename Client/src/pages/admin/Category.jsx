import React, { useState, useEffect } from 'react';
import {
  LuLayoutDashboard,
  LuShoppingBag,
  LuList,
  LuTag,
  LuUsers,
  LuShoppingCart,
  LuLogOut,
  LuPencil,
  LuDownload,
  LuUpload
} from 'react-icons/lu';
import './Category.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/Category';

function Category() {
  const [categories, setCategories] = useState([]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const [editDetails, setEditDetails] = useState({
    id: '',
    name: '',
    description: ''
  });

  const fetchCategory = async () => {
    try {
      const res = await axios.get(API_URL);
      setCategories(res.data);
    } catch (error) {
      console.log(
        'Error fetching categories:',
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const submitdetails = async () => {
    if (!name.trim() || !description.trim()) {
      alert('Please enter category name and description');
      return;
    }

    try {
      await axios.post(API_URL, {
        name,
        description,
        isActive: true
      });

      await fetchCategory();

      setName('');
      setDescription('');
      setIsDrawerOpen(false);

      alert('Category added successfully');
    } catch (error) {
      console.log(
        'Error adding category:',
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message || 'Failed to add category'
      );
    }
  };

  const toggleStatus = async (id) => {
    try {
      const res = await axios.put(`${API_URL}/${id}/status`);

      setCategories((prevCategories) =>
        prevCategories.map((cat) =>
          cat._id === id ? res.data : cat
        )
      );
    } catch (error) {
      console.log(
        'Error updating category status:',
        error.response?.data || error.message
      );
    }
  };

  const onhandleeditdrawer = (data) => {
    setEditDetails({
      id: data._id,
      name: data.name,
      description: data.description
    });

    setIsEditDrawerOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditDetails((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const submiteditdetails = async () => {
    if (
      !editDetails.name.trim() ||
      !editDetails.description.trim()
    ) {
      alert('Please enter category name and description');
      return;
    }

    try {
      const res = await axios.put(
        `${API_URL}/${editDetails.id}/editdetails`,
        {
          name: editDetails.name,
          description: editDetails.description
        }
      );

      setCategories((prevCategories) =>
        prevCategories.map((cat) =>
          cat._id === editDetails.id ? res.data : cat
        )
      );

      setEditDetails({
        id: '',
        name: '',
        description: ''
      });

      setIsEditDrawerOpen(false);

      alert('Category updated successfully');
    } catch (error) {
      console.log(
        'Error updating category:',
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message || 'Failed to update category'
      );
    }
  };

  const closeAddDrawer = () => {
    setIsDrawerOpen(false);

    setName('');
    setDescription('');
  };

  const closeEditDrawer = () => {
    setIsEditDrawerOpen(false);

    setEditDetails({
      id: '',
      name: '',
      description: ''
    });
  };

  return (
    <>
      <div className="category-main-container">
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
                          <Link to='/Adminorder'><span>Orders</span></Link>
                        </button>
          </div>

          <div className="admin-navbar-logout">
            <button className="admin-logout-btn">
              <LuLogOut className="admin-nav-icon" />
              <span>Log Out</span>
            </button>
          </div>
        </nav>

        <div className="category-main-content">
          <div className="category-action-bar">
            <div className="category-action-left">
              <button className="category-btn category-btn-secondary">
                <LuDownload className="btn-icon" />
                Export
              </button>

              <button className="category-btn category-btn-secondary">
                <LuUpload className="btn-icon" />
                Import
              </button>
            </div>

            <button
              onClick={() => setIsDrawerOpen(true)}
              className="category-btn category-btn-primary"
            >
              + Add Category
            </button>
          </div>

          <div className="category-table-card">
            <table className="category-table">
              <thead className="category-table-head">
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody className="category-table-body">
                {categories.map((cat) => (
                  <tr key={cat._id}>
                    <td className="category-col-name">
                      {cat.name}
                    </td>

                    <td className="category-col-desc">
                      {cat.description}
                    </td>

                    <td className="category-col-actions">
                      <button
                        onClick={() =>
                          onhandleeditdrawer(cat)
                        }
                        className="category-action-edit-btn"
                      >
                        <LuPencil className="action-icon" />
                        Edit
                      </button>
                    </td>

                    <td className="category-col-status">
                      <button
                        onClick={() =>
                          toggleStatus(cat._id)
                        }
                        className={`category-status-btn ${
                          cat.isActive
                            ? 'isActive-block'
                            : 'isActive-unblock'
                        }`}
                      >
                        {cat.isActive
                          ? 'Block'
                          : 'Unblock'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="category-pagination">
              <button
                className="category-page-btn"
                disabled
              >
                Previous
              </button>

              <span className="category-page-info">
                Page 1
              </span>

              <button className="category-page-btn">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`category-drawer-overlay ${
          isDrawerOpen ? 'open' : ''
        }`}
        onClick={closeAddDrawer}
      />

      <div
        className={`category-drawer ${
          isDrawerOpen ? 'open' : ''
        }`}
      >
        <div className="category-drawer-header">
          <h3>Add Category</h3>

          <button
            className="close-btn"
            onClick={closeAddDrawer}
          >
            ×
          </button>
        </div>

        <div className="category-drawer-body">
          <div className="form-group">
            <label>Category Name</label>

            <input
              type="text"
              placeholder="Category Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              rows="4"
              placeholder="Category Description"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
            />
          </div>

          <div className="drawer-actions">
            <button
              className="cancel-btn"
              onClick={closeAddDrawer}
            >
              Cancel
            </button>

            <button
              className="submit-btn"
              onClick={submitdetails}
            >
              Add Category
            </button>
          </div>
        </div>
      </div>

      <div
        className={`category-drawer-overlay ${
          isEditDrawerOpen ? 'open' : ''
        }`}
        onClick={closeEditDrawer}
      />

      <div
        className={`category-drawer ${
          isEditDrawerOpen ? 'open' : ''
        }`}
      >
        <div className="category-drawer-header">
          <h3>Edit Category</h3>

          <button
            className="close-btn"
            onClick={closeEditDrawer}
          >
            ×
          </button>
        </div>

        <div className="category-drawer-body">
          <div className="form-group">
            <label>Category Name</label>

            <input
              type="text"
              name="name"
              placeholder="Category Name"
              value={editDetails.name}
              onChange={handleEditChange}
            />
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              rows="4"
              name="description"
              placeholder="Category Description"
              value={editDetails.description}
              onChange={handleEditChange}
            />
          </div>

          <div className="drawer-actions">
            <button
              className="cancel-btn"
              onClick={closeEditDrawer}
            >
              Cancel
            </button>

            <button
              className="submit-btn"
              onClick={submiteditdetails}
            >
              Update Category
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Category;