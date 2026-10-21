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
    LuClock
} from 'react-icons/lu';
import './Adminorder.css';
import { Link } from 'react-router-dom';
import AdminService from '../../services/admin-api-services/AdminService';

const Adminorder = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const { getOrders, updateStatus } = AdminService();

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
        // Optimistic UI update
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

        // Send API request to persist changes in DB
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
                        <button className="admin-logout-btn">
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
                                        <th>ACTIONS</th>
                                        <th>STATUS</th>
                                    </tr>
                                </thead>

                                <tbody className="product-table-body">
                                    {orders.length > 0 ? (
                                        orders.map((data) => {
                                            const firstItem = data.orderItems?.[0];
                                            const totalQuantity = data.orderItems?.reduce(
                                                (sum, item) => sum + (item.quantity || 1), 0
                                            ) || 0;

                                            return (
                                                <tr key={data._id}>
                                                    <td>
                                                        <div className="order-id-wrapper">
                                                            <span className="order-id">
                                                                #{data._id?.slice(-8)}
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
                                                        <div className="order-product">
                                                            <div className="order-product-image">
                                                                {firstItem?.product?.image ? (
                                                                    <img
                                                                        src={`http://localhost:5000/uploads/${firstItem.product.image}`}
                                                                        alt={firstItem.product.name}
                                                                        style={{ width: '35px', height: '35px', objectFit: 'cover', borderRadius: '4px' }}
                                                                    />
                                                                ) : (
                                                                    '🧴'
                                                                )}
                                                            </div>

                                                            <div className="order-product-info">
                                                                <strong>
                                                                    {firstItem?.product?.name || 'Product'}
                                                                    {data.orderItems?.length > 1 && ` (+${data.orderItems.length - 1} more)`}
                                                                </strong>

                                                                <span>
                                                                    Qty: {totalQuantity}
                                                                </span>

                                                                <span className="order-total">
                                                                    Total: ₹{data.totalPrice?.toLocaleString('en-IN') || 0}
                                                                </span>
                                                            </div>
                                                        </div>
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
                                            <td colSpan="6" className="text-center py-4">
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
                                            <p>User ID:</p>
                                            <span>...{selectedOrder.user?._id?.slice(-8) || selectedOrder.user?.slice?.(-8) || 'N/A'}</span>
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
                                        <p>{selectedOrder.shippingAddress?.street}</p>
                                        <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}</p>
                                        <p>{selectedOrder.shippingAddress?.country} - {selectedOrder.shippingAddress?.zip}</p>

                                        <div className="address-contact">
                                            <LuPhone />
                                            <span>Address Contact: {selectedOrder.shippingAddress?.phone}</span>
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
                            <div className="items-title">ITEMS ORDERED</div>

                            <div className="d-flex flex-column gap-2 mb-3">
                                {selectedOrder.orderItems?.map((item, idx) => (
                                    <div key={item._id || idx} className="ordered-item-card">
                                        <div className="ordered-product-image">
                                            {item.product?.image ? (
                                                <img
                                                    src={`http://localhost:5000/uploads/${item.product.image}`}
                                                    alt={item.product?.name}
                                                    style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '4px' }}
                                                />
                                            ) : (
                                                '🧴'
                                            )}
                                        </div>

                                        <div className="ordered-product-information">
                                            <h3>{item.product?.name || 'Product Name'}</h3>
                                            <div className="ordered-product-meta">
                                                <span>Category: <strong>{item.product?.category || 'General'}</strong></span>
                                            </div>
                                        </div>

                                        <div className="ordered-price">
                                            <span>Pricing</span>
                                            <strong>₹{item.product?.price || 0} x {item.quantity}</strong>
                                        </div>

                                        <div className="ordered-total">
                                            <span>Total Price</span>
                                            <strong>₹{(item.product?.price || 0) * item.quantity}</strong>
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
                                    <span>STATUS:</span>
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