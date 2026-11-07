import React, { useEffect, useState } from 'react';
import { LuEye, LuX } from 'react-icons/lu';
import './AdminCustomerdetails.css';
import { useNavigate } from 'react-router-dom';
import AdminService from '../../services/admin-api-services/AdminService';
import AdminNavbar from "../../Components/admin/AdminNavbar"
import toast, { Toaster } from 'react-hot-toast';

const AdminCustomerdetails = () => {
  const [usersDetails, setUsersDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const { fetchUserdetails, toggleUserBlockStatus } = AdminService();
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetchUserdetails();
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
      toast.error("Failed to load customer details");
      setUsersDetails([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (user) => {
    const userId = user._id || user.id;
    const updatedStatus = !user.status;

    setUsersDetails((prev) =>
      prev.map((item) =>
        item._id === userId || item.id === userId
          ? { ...item, status: updatedStatus }
          : item
      )
    );

    if (
      selectedCustomer &&
      (selectedCustomer._id === userId || selectedCustomer.id === userId)
    ) {
      setSelectedCustomer((prev) => ({ ...prev, status: updatedStatus }));
    }

    try {
      if (typeof toggleUserBlockStatus === 'function') {
        await toggleUserBlockStatus(userId, { status: updatedStatus });
      }
      toast.success(
        `User ${updatedStatus ? "unblocked" : "blocked"} successfully!`
      );
    } catch (error) {
      console.error("Failed to update user block status:", error);
      toast.error(
        error.response?.data?.message || "Failed to update user status"
      );
      setUsersDetails((prev) =>
        prev.map((item) =>
          item._id === userId || item.id === userId
            ? { ...item, status: user.status }
            : item
        )
      );
      if (
        selectedCustomer &&
        (selectedCustomer._id === userId || selectedCustomer.id === userId)
      ) {
        setSelectedCustomer((prev) => ({ ...prev, status: user.status }));
      }
    }
  };

  const handleShowaction = (data) => {
    setSelectedCustomer(data);
  };

  const handleCloseProduct = () => {
    setSelectedCustomer(null);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <Toaster
        position="top-center"
        containerStyle={{
          top: 85,
          zIndex: 99999,
        }}
        toastOptions={{
          duration: 4000,
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

      <div className="product-main-container">
        {/* Responsive Navbar */}
        <AdminNavbar />

        {/* Main Content Area */}
        <main className="AdminCustomerdetails-content">
          <div className="customer-page-header">
            <h2>User List</h2>
            <p>Manage registered Customers account and status</p>
          </div>

          <div className="product-table-card">
            {loading ? (
              <div className="d-flex flex-column justify-content-center align-items-center py-5 my-5 gap-3">
                <div
                  className="spinner-border"
                  style={{
                    width: "2.5rem",
                    height: "2.5rem",
                    color: "#10b981",
                    borderWidth: "3px",
                  }}
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
                <span
                  style={{
                    color: "#64748b",
                    fontSize: "0.9rem",
                    fontWeight: "500",
                  }}
                >
                  Loading customers...
                </span>
              </div>
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
                      const isBlocked =
                        data.status === false ||
                        data.status === "Blocked" ||
                        data.status === "Block";

                      return (
                        <tr key={userId}>
                          <td className="product-col-name">{data.name || "N/A"}</td>
                          <td className="product-col-category">
                            {data.phone || "N/A"}
                          </td>
                          <td className="product-col-category">
                            {data.email || "N/A"}
                          </td>
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
                              {isBlocked ? "Blocked" : "Unblocked"}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-muted">
                        No customers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {/* Modal Overlay for Viewing Customer Details */}
            {selectedCustomer && (() => {
              const isModalBlocked =
                selectedCustomer.status === false ||
                selectedCustomer.status === "Blocked" ||
                selectedCustomer.status === "Block";

              return (
                <div
                  className="admincustomer-overlay"
                  onClick={handleCloseProduct}
                >
                  <div
                    className="admincustomer-content"
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
                            isModalBlocked ? "status-block" : "status-unblock"
                          }`}
                          onClick={() => toggleStatus(selectedCustomer)}
                        >
                          {isModalBlocked ? "Blocked" : "Unblocked"}
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
                          ? new Date(
                              selectedCustomer.createdAt
                            ).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "N/A"
                      }
                    />

                    <button
                      className="close-button"
                      onClick={handleCloseProduct}
                    >
                      Close
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminCustomerdetails;