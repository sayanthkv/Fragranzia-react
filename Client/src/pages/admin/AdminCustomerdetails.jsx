import React, { useEffect, useState } from 'react';
import {
  LuLayoutDashboard,
  LuShoppingBag,
  LuList,
  LuTag,
  LuUsers,
  LuShoppingCart,
  LuLogOut,
  LuEye,
  LuX
} from 'react-icons/lu';
import './AdminCustomerdetails.css';
import { Link } from 'react-router-dom';
import AdminService from '../../services/admin-api-services/AdminService';

const AdminCustomerdetails = () => {
  const [usersDetails, setUsersDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const { fetchUserdetails, toggleUserBlockStatus } = AdminService();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetchUserdetails();
      // Adjust res.data or res.users depending on API response structure
      const users = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.users)
        ? res.users
        : Array.isArray(res)
        ? res
        : [];
      setUsersDetails(users);
    } catch (error) {
      console.error("Failed to fetch customer details:", error);
      setUsersDetails([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (user) => {
    const userId = user._id || user.id;
    
    // Toggle state locally
    const updatedStatus = !user.status;

    setUsersDetails((prev) =>
      prev.map((item) =>
        (item._id === userId || item.id === userId)
          ? { ...item, status: updatedStatus }
          : item
      )
    );

    // Keep modal customer status in sync if viewing
    if (selectedCustomer && (selectedCustomer._id === userId || selectedCustomer.id === userId)) {
      setSelectedCustomer((prev) => ({ ...prev, status: updatedStatus }));
    }

    // Call API persistence if implemented in AdminService
    try {
      if (typeof toggleUserBlockStatus === 'function') {
        await toggleUserBlockStatus(userId, { status: updatedStatus });
      }
    } catch (error) {
      console.error("Failed to update user block status:", error);
    }
  };

  const handleShowaction = (data) => {
    setSelectedCustomer(data);
  };

  const handleCloseProduct = () => {
    setSelectedCustomer(null);
  };

  useEffect(() => {
    fetchUsers(); // Fixed: Function call syntax
  }, []);

  return (
    <>
      <div className="product-main-container">
        {/* Navigation Sidebar */}
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

            <button className="admin-nav-item active">
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
            <button className="admin-logout-btn">
              <LuLogOut className="admin-nav-icon" />
              <span>Log Out</span>
            </button>
          </div>
        </nav>

        {/* Main Content Area */}
        <div className="AdminCustomerdetails-content">
          <h2>User List</h2>
          <p>Manage registered Customers account and status</p>

          <div className="product-table-card">
            {loading ? (
              <div className="p-4 text-center">Loading customers...</div>
            ) : (
              <table className="product-table">
                <thead className="product-table-head">
                  <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Actions</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody className="product-table-body">
                  {usersDetails.length > 0 ? (
                    usersDetails.map((data) => {
                      const userId = data._id || data.id;
                      const isBlocked = data.status === false || data.status === "Blocked";

                      return (
                        <tr key={userId}>
                          <td className="product-col-name">{data.name || "N/A"}</td>
                          <td className="product-col-category">{data.phone || "N/A"}</td>
                          <td className="product-col-category">{data.email || "N/A"}</td>

                          <td className="product-col-category">
                            <button
                              className="product-action-show-btn"
                              onClick={() => handleShowaction(data)}
                            >
                              <LuEye className="action-icon" />
                              Show
                            </button>
                          </td>

                          <td className="product-col-category">
                            <button
                              onClick={() => toggleStatus(data)}
                              className={`product-status-btn ${
                                isBlocked ? "status-block" : "status-unblock"
                              }`}
                            >
                              {isBlocked ? "Blocked" : "Active"}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4">
                        No customers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {/* Modal Overlay for Viewing Customer Details */}
            {selectedCustomer && (
              <div className="admincustomer-overlay" onClick={handleCloseProduct}>
                <div
                  className="admincustomer-content product-details-modal"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="adminmodal-header">
                    <h3>
                      <LuEye className="view-modal-icon" />
                      User Details
                    </h3>

                    <button
                      className="adminmodal-close-btn"
                      onClick={handleCloseProduct}
                    >
                      <LuX />
                    </button>
                  </div>

                  <label>FULL NAME</label>
                  <input readOnly value={selectedCustomer.name || "N/A"} />

                  <label>EMAIL ADDRESS</label>
                  <input readOnly value={selectedCustomer.email || "N/A"} />

                  <label>PHONE NUMBER</label>
                  <input readOnly value={selectedCustomer.phone || "N/A"} />

                  <div className="view-detail-group">
                    <div className="customer-status">
                      <label>Status</label>
                      <button
                        className={`customer-status-badge ${
                          selectedCustomer.status === false || selectedCustomer.status === "Blocked"
                            ? "status-block"
                            : "status-unblock"
                        }`}
                        onClick={() => toggleStatus(selectedCustomer)}
                      >
                        {selectedCustomer.status === false || selectedCustomer.status === "Blocked"
                          ? "Blocked"
                          : "Active"}
                      </button>
                    </div>

                    <div className="customer-role">
                      <label>Role</label>
                      <span className="customer-role-badge">
                        {selectedCustomer.role || "Customer"}
                      </span>
                    </div>
                  </div>

                  <label>JOINED DATE</label>
                  <input
                    readOnly
                    value={
                      selectedCustomer.createdAt
                        ? new Date(selectedCustomer.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "N/A"
                    }
                  />

                  <button className="close-button" onClick={handleCloseProduct}>
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminCustomerdetails;