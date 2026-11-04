import React, { useEffect, useState } from 'react';
import {
  LuLayoutDashboard,
  LuShoppingBag,
  LuList,
  LuUsers,
  LuShoppingCart,
  LuLogOut,
  LuPencil
} from 'react-icons/lu';
import './Category.css';
import { Link, useNavigate } from 'react-router-dom';
import AdminService from '../../services/admin-api-services/AdminService';
import toast, { Toaster } from 'react-hot-toast';

function Category() {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const [editDetails, setEditDetails] = useState({
    id: '',
    name: '',
    description: ''
  });

  const { AddCategory, getCategory, EditCategory, editStatus } = AdminService();
  const navigate = useNavigate();

  const fetchCategory = async (page = 1) => {
    try {
      setLoading(true);
      const res = await getCategory(page, 10);

      if (Array.isArray(res)) {
        // Fallback if backend still returns an array
        setCategories(res);
        setTotalPages(Math.ceil(res.length / 10) || 1);
      } else {
        setCategories(res?.categories || []);
        setCurrentPage(res?.currentPage || page);
        setTotalPages(res?.totalPages || 1);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory(currentPage);
  }, [currentPage]);

  const submitdetails = async () => {
    if (!name.trim() || !description.trim()) {
      toast.error('Please enter category name and description');
      return;
    }

    try {
      setIsSubmitting(true);
      await AddCategory({
        name,
        description,
        isActive: true
      });

      toast.success('Category added successfully!');
      setName('');
      setDescription('');
      setIsDrawerOpen(false);

      if (currentPage === 1) {
        await fetchCategory(1);
      } else {
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error(error.response?.data?.message || 'Failed to add category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (id) => {
    try {
      const res = await editStatus(id);
      const updatedCategory = res?.category || res;

      setCategories((prevCategories) =>
        prevCategories.map((cat) =>
          cat._id === id ? { ...cat, isActive: updatedCategory.isActive } : cat
        )
      );

      toast.success(
        `Category ${updatedCategory.isActive ? 'unblocked' : 'blocked'} successfully!`
      );
    } catch (error) {
      console.error('Error updating category status:', error);
      toast.error(error.response?.data?.message || 'Error updating status');
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
    if (!editDetails.name.trim() || !editDetails.description.trim()) {
      toast.error('Please enter category name and description');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await EditCategory(editDetails.id, {
        name: editDetails.name,
        description: editDetails.description
      });

      const updatedCategory = res?.category || res;

      setCategories((prevCategories) =>
        prevCategories.map((cat) =>
          cat._id === editDetails.id ? updatedCategory : cat
        )
      );

      setEditDetails({ id: '', name: '', description: '' });
      setIsEditDrawerOpen(false);
      toast.success('Category updated successfully!');
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error(error.response?.data?.message || 'Failed to update category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeAddDrawer = () => {
    if (isSubmitting) return;
    setIsDrawerOpen(false);
    setName('');
    setDescription('');
  };

  const closeEditDrawer = () => {
    if (isSubmitting) return;
    setIsEditDrawerOpen(false);
    setEditDetails({ id: '', name: '', description: '' });
  };

  const handleLogout = () => {
    localStorage.removeItem('Token');
    localStorage.removeItem('role');
    toast.success('Logged out successfully');
    navigate('/LogIn');
  };

  return (
    <>
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

            <button className="admin-nav-item active">
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

        <div className="category-main-content">
          <div className="category-action-bar">
            <div className="category-action-left"></div>

            <button
              onClick={() => setIsDrawerOpen(true)}
              className="category-btn category-btn-primary"
            >
              + Add Category
            </button>
          </div>

       <div className="category-table-card">
            {loading ? (
              <div className="d-flex flex-column justify-content-center align-items-center py-5 my-5 gap-3">
                <div
                  className="spinner-border"
                  style={{
                    width: '3rem',
                    height: '3rem',
                    color: '#043948',
                    borderWidth: '3px'
                  }}
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
                <span
                  style={{
                    color: '#043948',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    letterSpacing: '0.3px'
                  }}
                >
                  Loading categories...
                </span>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <p>No categories found.</p>
              </div>
            ) : (
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
                      <td className="category-col-name">{cat.name}</td>
                      <td className="category-col-desc">{cat.description}</td>
                      <td className="category-col-actions">
                        <button
                          onClick={() => onhandleeditdrawer(cat)}
                          className="category-action-edit-btn"
                        >
                          <LuPencil className="action-icon" />
                          Edit
                        </button>
                      </td>
                      <td className="category-col-status">
                        <button
                          onClick={() => toggleStatus(cat._id)}
                          className={`category-status-btn ${
                            cat.isActive
                              ? 'isActive-unblock'
                              : 'isActive-block'
                          }`}
                        >
                          {cat.isActive ? 'Unblocked' : 'Blocked'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Pagination Controls */}
            {!loading && categories.length > 0 && (
              <div className="category-pagination">
                <button
                  className="category-page-btn"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                <span className="category-page-info">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  className="category-page-btn"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage >= totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Drawer: Add Category */}
      <div
        className={`category-drawer-overlay ${isDrawerOpen ? 'open' : ''}`}
        onClick={closeAddDrawer}
      />
      <div className={`category-drawer ${isDrawerOpen ? 'open' : ''}`}>
        <div className="category-drawer-header">
          <h3>Add Category</h3>
          <button
            className="close-btn"
            onClick={closeAddDrawer}
            disabled={isSubmitting}
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
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              rows="4"
              placeholder="Category Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="drawer-actions">
            <button
              className="cancel-btn"
              onClick={closeAddDrawer}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              className="submit-btn d-flex align-items-center justify-content-center gap-2"
              onClick={submitdetails}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div
                    className="spinner-border spinner-border-sm text-light"
                    role="status"
                    style={{ width: '1rem', height: '1rem', borderWidth: '2px' }}
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <span>Adding...</span>
                </>
              ) : (
                'Add Category'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Drawer: Edit Category */}
      <div
        className={`category-drawer-overlay ${isEditDrawerOpen ? 'open' : ''}`}
        onClick={closeEditDrawer}
      />
      <div className={`category-drawer ${isEditDrawerOpen ? 'open' : ''}`}>
        <div className="category-drawer-header">
          <h3>Edit Category</h3>
          <button
            className="close-btn"
            onClick={closeEditDrawer}
            disabled={isSubmitting}
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
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              className="submit-btn d-flex align-items-center justify-content-center gap-2"
              onClick={submiteditdetails}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div
                    className="spinner-border spinner-border-sm text-light"
                    role="status"
                    style={{ width: '1rem', height: '1rem', borderWidth: '2px' }}
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <span>Updating...</span>
                </>
              ) : (
                'Update Category'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Category;