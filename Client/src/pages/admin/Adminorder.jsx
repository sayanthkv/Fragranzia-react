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
  LuX,
  LuCopy,
  LuUser,
  LuMapPin,
  LuCreditCard,
  LuPhone,
  LuMail,
  LuCalendarDays,
  LuClock,
  LuRotateCcw,
  LuCircleCheck,
  LuCircleX,
  LuHouse
} from 'react-icons/lu';
import './Adminorder.css';
import { Link } from 'react-router-dom';
import AdminService from '../../services/admin-api-services/AdminService';
import { useNavigate } from 'react-router-dom';

const Adminorder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { getOrders, updateStatus, processReturnStatus } = AdminService();
  const navigate = useNavigate();

  const fetchOrderedProducts = async () => {
    try {
      setLoading(true);
      const res = await getOrders();
      if (Array.isArray(res?.orders)) {
        setOrders(res.orders);
      } else if (Array.isArray(res)) {
        setOrders(res);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Failed to fetch user orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderedProducts();
  }, []);

  const handleShowaction = (data) => {
    setSelectedOrder(data);
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };

  const handleStatusChange = async (id, status) => {
    setOrders((prevOrders) =>
      prevOrders.map((item) =>
        item._id === id
          ? { ...item, deliveryStatus: status }
          : item
      )
    );

    if (selectedOrder && selectedOrder._id === id) {
      setSelectedOrder((prev) => ({ ...prev, deliveryStatus: status }));
    }

    try {
      if (typeof updateStatus === 'function') {
        await updateStatus(id, { status });
      }
    } catch (error) {
      console.error("Failed to update status on server:", error);
      alert("Failed to update status on server. Reloading orders.");
      fetchOrderedProducts();
    }
  };

  const handleReturnProcess = async (orderId, status) => {
    try {
      if (typeof processReturnStatus === 'function') {
        const res = await processReturnStatus(orderId, status);
        alert(res.message || `Return request ${status.toLowerCase()} successfully.`);
        fetchOrderedProducts();
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(null);
        }
      }
    } catch (error) {
      console.error("Failed to process return request:", error);
      alert(error.response?.data?.message || "Failed to process return request.");
    }
  };

  const copyOrderId = (id) => {
    if (id) {
      navigator.clipboard.writeText(id);
      alert("Order ID copied to clipboard!");
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'order-status-pending';
      case 'Processing':
        return 'order-status-processing';
      case 'Shipped':
        return 'order-status-shipped';
      case 'Out for Delivery':
        return 'order-status-out';
      case 'Delivered':
        return 'order-status-delivered';
      case 'Returned':
        return 'order-status-returned';
      case 'Failed Delivery':
        return 'order-status-failed';
      case 'Cancelled':
        return 'order-status-cancelled';
      default:
        return 'order-status-pending';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("Token");
    localStorage.removeItem("role");
    navigate('/LogIn');
  };

  return (
    <>
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

            <button className="admin-nav-item active">
              <LuShoppingCart className="admin-nav-icon" />
              <Link to="/Adminorder">
                <span>Orders</span>
              </Link>
            </button>
          </div>

          <div className="admin-navbar-logout">
            {/* 🏠 GO TO HOME PAGE BUTTON */}
            <button className="admin-logout-btn mb-2" style={{ backgroundColor: '#4b5563' }}>
              <Link to="/" style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LuHouse className="admin-nav-icon" />
                <span>Go to home page</span>
              </Link>
            </button>

            {/* 🚪 LOG OUT BUTTON */}
            <button className="admin-logout-btn" onClick={handleLogout}>
              <LuLogOut className="admin-nav-icon" />
              <span>Log Out</span>
            </button>
          </div>
        </nav>

        <div className="AdminCustomerdetails-content">
          <div className="order-page-header">
            <div className="order-heading">
              <div className="order-title">
                <div className="order-title-icon">
                  <LuShoppingCart />
                </div>
                <h2>Order Management</h2>
              </div>
              <p>Monitor, track, and update customer orders dynamically</p>
            </div>

            <div className="order-sync">
              <LuClock />
              <span>Last sync: Just now</span>
            </div>
          </div>

          <div className="product-table-card">
            {loading ? (
              <div className="p-4 text-center">Loading orders...</div>
            ) : (
              <table className="product-table">
                <thead className="product-table-head">
                  <tr>
                    <th>ORDER ID</th>
                    <th>CUSTOMER</th>
                    <th>DATE</th>
                    <th>PRODUCT DETAILS</th>
                    <th>RETURN STATUS</th>
                    <th>ACTIONS</th>
                    <th>DELIVERY STATUS</th>
                  </tr>
                </thead>

                <tbody className="product-table-body">
                  {orders.length > 0 ? (
                    orders.map((data) => {
                      const firstItem = data.orderItems?.[0];
                      const totalQuantity = data.orderItems?.reduce(
                        (sum, item) => sum + (item.quantity || 1), 0
                      ) || 0;

                      const isReturnRequested = data.isReturned || data.returnStatus === "Requested";

                      return (
                        <tr key={data._id}>
                          <td>
                            <div className="order-id-wrapper">
                              <span className="order-id">
                                #{data._id?.slice(-8)}...
                              </span>
                              <LuCopy
                                className="order-copy-icon"
                                onClick={() => copyOrderId(data._id)}
                              />
                            </div>
                          </td>

                          <td>
                            <div className="order-customer">
                              <div className="order-avatar">
                                {data.user?.name ? data.user.name.charAt(0).toUpperCase() : 'U'}
                              </div>
                              <div className="order-customer-info">
                                <strong>
                                  {data.user?.name || "Customer"}
                                </strong>
                                <span>
                                  ☎ {data.user?.phone || data.shippingAddress?.phone || "N/A"}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td>
                            <div className="order-date">
                              <LuCalendarDays className="order-calendar" />
                              <span>
                                {data.createdAt
                                  ? new Date(data.createdAt).toLocaleDateString('en-IN', {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric'
                                    })
                                  : 'N/A'}
                              </span>
                            </div>
                          </td>

                          <td>
                            <div className="order-product d-flex align-items-center gap-2">
                              <div className="order-product-image flex-shrink-0">
                                {firstItem?.product?.image ? (
                                  <img
                                    src={firstItem.product.image}
                                    alt={firstItem.product.name}
                                    style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }}
                                  />
                                ) : (
                                  <span style={{ fontSize: '20px' }}>🧴</span>
                                )}
                              </div>

                              <div className="order-product-info text-start">
                                <strong className="d-block text-truncate" style={{ maxWidth: '180px' }}>
                                  {firstItem?.product?.name || 'Product'}
                                  {data.orderItems?.length > 1 && ` (+${data.orderItems.length - 1} more)`}
                                </strong>
                                <span className="d-block text-muted small">
                                  Qty: {totalQuantity}
                                </span>
                                <span className="order-total fw-bold text-dark small">
                                  Total: ₹{data.totalPrice?.toLocaleString('en-IN') || 0}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* RETURN REQUEST STATUS & ACTION COLUMNS */}
                          <td>
                            {isReturnRequested ? (
                              <div className="d-flex flex-column gap-1 align-items-start">
                                <span className="badge bg-warning text-dark px-2 py-1 small">
                                  <LuRotateCcw className="me-1" /> Requested
                                </span>
                                <small className="text-muted text-truncate" style={{ maxWidth: '120px' }}>
                                  {data.returnReason || "No reason specified"}
                                </small>
                                {data.returnStatus === "Requested" && (
                                  <div className="d-flex gap-1 mt-1">
                                    <button
                                      className="btn btn-success btn-sm py-0 px-2 fs-7"
                                      onClick={() => handleReturnProcess(data._id, "Approved")}
                                    >
                                      Approve
                                    </button>
                                    <button
                                      className="btn btn-danger btn-sm py-0 px-2 fs-7"
                                      onClick={() => handleReturnProcess(data._id, "Rejected")}
                                    >
                                      Reject
                                    </button>
                                  </div>
                                )}
                              </div>
                            ) : data.returnStatus ? (
                              <span className={`badge ${data.returnStatus === 'Approved' ? 'bg-success' : 'bg-danger'} px-2 py-1`}>
                                {data.returnStatus}
                              </span>
                            ) : (
                              <span className="text-muted small">None</span>
                            )}
                          </td>

                          <td>
                            <button
                              className="product-action-show-btn"
                              onClick={() => handleShowaction(data)}
                            >
                              <LuEye className="action-icon" />
                              Show Details
                            </button>
                          </td>

                          <td>
                            <select
                              className={`order-status-select ${getStatusClass(data.deliveryStatus)}`}
                              value={data.deliveryStatus || 'Pending'}
                              onChange={(e) =>
                                handleStatusChange(data._id, e.target.value)
                              }
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Out for Delivery">Out for Delivery</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Returned">Returned</option>
                              <option value="Failed Delivery">Failed Delivery</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        No orders available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Modal Overlay for Detailed Order View */}
      {selectedOrder && (
        <div className="order-modal-overlay" onClick={handleCloseDetails}>
          <div className="order-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="order-details-header">
              <div className="order-details-title">
                <div className="order-details-icon">
                  <LuShoppingCart />
                </div>

                <div>
                  <h2>Order Details</h2>
                  <div className="order-details-id">
                    <span>#{selectedOrder._id}</span>
                    <button
                      onClick={() => copyOrderId(selectedOrder._id)}
                      className="order-copy-button"
                    >
                      <LuCopy />
                    </button>
                  </div>
                </div>
              </div>

              <button className="order-details-close" onClick={handleCloseDetails}>
                <LuX />
              </button>
            </div>

            <div className="order-details-body">
              {/* Return Request Banner inside Modal */}
              {(selectedOrder.isReturned || selectedOrder.returnStatus === "Requested") && (
                <div className="alert alert-warning d-flex align-items-center justify-content-between p-3 mb-3 rounded shadow-sm">
                  <div>
                    <strong className="d-block text-dark mb-1">
                      <LuRotateCcw className="me-2" /> Return Request Pending
                    </strong>
                    <span className="text-muted small">
                      Reason: <strong>{selectedOrder.returnReason || "Not provided"}</strong>
                    </span>
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-success btn-sm d-flex align-items-center gap-1 fw-bold"
                      onClick={() => handleReturnProcess(selectedOrder._id, "Approved")}
                    >
                      <LuCircleCheck /> Approve & Restock
                    </button>
                    <button
                      className="btn btn-danger btn-sm d-flex align-items-center gap-1 fw-bold"
                      onClick={() => handleReturnProcess(selectedOrder._id, "Rejected")}
                    >
                      <LuCircleX /> Reject Request
                    </button>
                  </div>
                </div>
              )}

              <div className="order-information-grid">
                {/* Customer Info Card */}
                <div className="order-information-card">
                  <div className="order-card-title">
                    <LuUser />
                    <span>CUSTOMER DETAILS</span>
                  </div>

                  <div className="customer-detail-main">
                    <div className="customer-detail-avatar">
                      {selectedOrder.user?.name ? selectedOrder.user.name.charAt(0).toUpperCase() : 'U'}
                    </div>

                    <div>
                      <strong>{selectedOrder.user?.name || 'Customer'}</strong>
                      <p className="mb-0">User ID:</p>
                      <span>{selectedOrder.user?._id?.slice(-8) || selectedOrder.user?.slice?.(-8) || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="customer-contact">
                    <div>
                      <LuPhone />
                      <span>{selectedOrder.user?.phone || selectedOrder.shippingAddress?.phone || 'N/A'}</span>
                    </div>
                    <div>
                      <LuMail />
                      <span>{selectedOrder.user?.email || 'No email available'}</span>
                    </div>
                  </div>
                </div>

                {/* Shipping Address Card */}
                <div className="order-information-card">
                  <div className="order-card-title">
                    <LuMapPin />
                    <span>SHIPPING ADDRESS</span>
                  </div>

                  <div className="shipping-address">
                    <strong>{selectedOrder.shippingAddress?.fullName || selectedOrder.user?.name}</strong>
                    <p className="mb-1">{selectedOrder.shippingAddress?.street}</p>
                    <p className="mb-1">{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}</p>
                    <p className="mb-2">{selectedOrder.shippingAddress?.country} {selectedOrder.shippingAddress?.zip}</p>

                    <div className="address-contact">
                      <LuPhone />
                      <span>Address Contact: {selectedOrder.shippingAddress?.phone || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Details Card */}
                <div className="order-information-card">
                  <div className="order-card-title">
                    <LuCreditCard />
                    <span>ORDER & PAYMENT</span>
                  </div>

                  <div className="payment-details">
                    <div className="payment-row">
                      <span>Order Date:</span>
                      <strong>
                        {new Date(selectedOrder.createdAt).toLocaleDateString("en-IN")},<br />
                        {new Date(selectedOrder.createdAt).toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' })}
                      </strong>
                    </div>

                    <div className="payment-row">
                      <span>Payment Status:</span>
                      <span className="payment-status">
                        {selectedOrder.paymentStatus || 'Pending'}
                      </span>
                    </div>

                    <div className="payment-row">
                      <span>Payment Method:</span>
                      <strong>💳 {selectedOrder.paymentMethod?.toUpperCase()}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ordered Items List */}
              <div className="items-title mt-4 mb-2 fw-bold">ITEMS ORDERED</div>

              <div className="d-flex flex-column gap-2 mb-3">
                {selectedOrder.orderItems?.map((item, idx) => (
                  <div key={item._id || idx} className="ordered-item-card d-flex align-items-center justify-content-between p-2 border rounded">
                    <div className="d-flex align-items-center gap-3">
                      <div className="ordered-product-image flex-shrink-0">
                        {item.product?.image ? (
                          <img
                            src={item.product?.image}
                            alt={item.product?.name}
                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }}
                          />
                        ) : (
                          <span style={{ fontSize: '24px' }}>🧴</span>
                        )}
                      </div>

                      <div className="ordered-product-information">
                        <h3 className="fs-6 mb-1">{item.product?.name || 'Product Name'}</h3>
                        <div className="ordered-product-meta text-muted small">
                          <span>Category: <strong>{item.product?.categories?.name || 'General'}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-4 text-end">
                      <div className="ordered-price">
                        <span className="d-block text-muted small">Pricing</span>
                        <strong>₹{item.product?.saleprice || 0} x {item.quantity}</strong>
                      </div>

                      <div className="ordered-total">
                        <span className="d-block text-muted small">Total Price</span>
                        <strong>₹{(item.product?.saleprice || 0) * item.quantity}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-details-footer">
                <div className="grand-total">
                  <span>GRAND TOTAL PAID</span>
                  <strong>₹{selectedOrder.totalPrice?.toLocaleString('en-IN')}</strong>
                </div>

                <div className="footer-status">
                  <span>DELIVERY STATUS:</span>
                  <select
                    className={`order-details-status-select ${getStatusClass(selectedOrder.deliveryStatus)}`}
                    value={selectedOrder.deliveryStatus || 'Pending'}
                    onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Returned">Returned</option>
                    <option value="Failed Delivery">Failed Delivery</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <button className="close-details-button" onClick={handleCloseDetails}>
                  Close Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Adminorder;