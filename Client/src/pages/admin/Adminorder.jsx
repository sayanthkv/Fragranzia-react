import React, { useState } from 'react';
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

const Adminorder = () => {

    const [usersDetails, setUsersDetails] = useState([
        {
            id: '6A44A21E73F6A5B771759908',
            name: 'user 1',
            phone: '1122334455',
            email: '',
            datejoined: 'Jul 1, 2026',
            time: '10:44 AM',
            productName: 'Steel Water Bottle',
            category: 'General',
            sku: 'B75C82',
            quantity: 1,
            price: 60,
            total: 60,
            status: 'Pending',
            addressName: 'user address 1',
            address: 'user 1',
            state: 'ktr, kerala',
            country: 'india - 112233',
            addressContact: '1122334455'
        },
        {
            id: '6A44A26A',
            name: 'user 1',
            phone: '1122334455',
            email: '',
            datejoined: 'Jul 1, 2026',
            time: '11:20 AM',
            productName: 'Non-Stick Grill Pan',
            category: 'Kitchen',
            sku: 'G82K21',
            quantity: 2,
            price: 1200,
            total: 2400,
            status: 'Cancelled',
            addressName: 'user address 1',
            address: 'user 1',
            state: 'ktr, kerala',
            country: 'india - 112233',
            addressContact: '1122334455'
        },
        {
            id: '6A44A26B',
            name: 'user 1',
            phone: '1122334455',
            email: '',
            datejoined: 'Jul 1, 2026',
            time: '12:15 PM',
            productName: 'Shirt & Pants',
            category: 'Dress',
            sku: 'SP4512',
            quantity: 1,
            price: 500,
            total: 500,
            status: 'Pending',
            addressName: 'user address 1',
            address: 'user 1',
            state: 'ktr, kerala',
            country: 'india - 112233',
            addressContact: '1122334455'
        },
        {
            id: '6A44A26C',
            name: 'user 1',
            phone: '1122334455',
            email: '',
            datejoined: 'Jul 1, 2026',
            time: '01:30 PM',
            productName: 'Mini Dresses Rayon',
            category: 'Dress',
            sku: 'DR9021',
            quantity: 1,
            price: 650,
            total: 650,
            status: 'Returned',
            addressName: 'user address 1',
            address: 'user 1',
            state: 'ktr, kerala',
            country: 'india - 112233',
            addressContact: '1122334455'
        }
    ]);

    const [selectedOrder, setSelectedOrder] = useState(null);

    const handleShowaction = (data) => {
        setSelectedOrder(data);
    };

    const handleCloseDetails = () => {
        setSelectedOrder(null);
    };

    const handleStatusChange = (id, status) => {
        setUsersDetails((prevUsers) =>
            prevUsers.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        status: status
                    }
                    : item
            )
        );

        setSelectedOrder((prevOrder) =>
            prevOrder
                ? {
                    ...prevOrder,
                    status: status
                }
                : null
        );
    };

    const copyOrderId = () => {
        if (selectedOrder) {
            navigator.clipboard.writeText(selectedOrder.id);
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

                <div className="AdminCustomerdetails-content">

                    <div className="order-page-header">

                        <div className="order-heading">

                            <div className="order-title">
                                <div className="order-title-icon">
                                    <LuShoppingCart />
                                </div>

                                <h2>Order Management</h2>
                            </div>

                            <p>
                                Monitor, track, and update customer orders dynamically
                            </p>

                        </div>

                        <div className="order-sync">
                            <LuClock />
                            <span>Last sync: Just now</span>
                        </div>

                    </div>

                    <div className="product-table-card">

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

                                {usersDetails.map((data) => (

                                    <tr key={data.id}>

                                        <td>

                                            <div className="order-id-wrapper">

                                                <span className="order-id">
                                                    #{data.id}
                                                </span>

                                                <LuCopy className="order-copy-icon" />

                                            </div>

                                        </td>

                                        <td>

                                            <div className="order-customer">

                                                <div className="order-avatar">
                                                    U1
                                                </div>

                                                <div className="order-customer-info">

                                                    <strong>
                                                        {data.name}
                                                    </strong>

                                                    <span>
                                                        ☎ {data.phone}
                                                    </span>

                                                </div>

                                            </div>

                                        </td>

                                        <td>

                                            <div className="order-date">

                                                <LuCalendarDays className="order-calendar" />

                                                <span>
                                                    {data.datejoined}
                                                </span>

                                            </div>

                                        </td>

                                        <td>

                                            <div className="order-product">

                                                <div className="order-product-image">
                                                    🧴
                                                </div>

                                                <div className="order-product-info">

                                                    <strong>
                                                        {data.productName}
                                                    </strong>

                                                    <span>
                                                        Qty: {data.quantity}
                                                        <b>|</b>
                                                        Price: ₹{data.price}
                                                    </span>

                                                    <span className="order-total">
                                                        Total: ₹{data.total}
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
                                                className={`order-status-select ${getStatusClass(data.status)}`}
                                                value={data.status}
                                                onChange={(e) =>
                                                    handleStatusChange(
                                                        data.id,
                                                        e.target.value
                                                    )
                                                }
                                            >

                                                <option value="Pending">
                                                    Pending
                                                </option>

                                                <option value="Processing">
                                                    Processing
                                                </option>

                                                <option value="Shipped">
                                                    Shipped
                                                </option>

                                                <option value="Out for Delivery">
                                                    Out for Delivery
                                                </option>

                                                <option value="Delivered">
                                                    Delivered
                                                </option>

                                                <option value="Returned">
                                                    Returned
                                                </option>

                                                <option value="Failed Delivery">
                                                    Failed Delivery
                                                </option>

                                                <option value="Cancelled">
                                                    Cancelled
                                                </option>

                                            </select>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

            {selectedOrder && (

                <div
                    className="order-modal-overlay"
                    onClick={handleCloseDetails}
                >

                    <div
                        className="order-details-modal"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="order-details-header">

                            <div className="order-details-title">

                                <div className="order-details-icon">
                                    <LuShoppingCart />
                                </div>

                                <div>

                                    <h2>Order Details</h2>

                                    <div className="order-details-id">

                                        <span>
                                            #{selectedOrder.id}
                                        </span>

                                        <button
                                            onClick={copyOrderId}
                                            className="order-copy-button"
                                        >
                                            <LuCopy />
                                        </button>

                                    </div>

                                </div>

                            </div>

                            <button
                                className="order-details-close"
                                onClick={handleCloseDetails}
                            >
                                <LuX />
                            </button>

                        </div>

                        <div className="order-details-body">

                            <div className="order-information-grid">

                                <div className="order-information-card">

                                    <div className="order-card-title">
                                        <LuUser />
                                        <span>CUSTOMER DETAILS</span>
                                    </div>

                                    <div className="customer-detail-main">

                                        <div className="customer-detail-avatar">
                                            U1
                                        </div>

                                        <div>

                                            <strong>
                                                {selectedOrder.name}
                                            </strong>

                                            <p>
                                                User ID:
                                            </p>

                                            <span>
                                                ...6a2cca29
                                            </span>

                                        </div>

                                    </div>

                                    <div className="customer-contact">

                                        <div>
                                            <LuPhone />
                                            <span>
                                                {selectedOrder.phone}
                                            </span>
                                        </div>

                                        <div>
                                            <LuMail />
                                            <span>
                                                {selectedOrder.email
                                                    ? selectedOrder.email
                                                    : 'No email available'}
                                            </span>
                                        </div>

                                    </div>

                                </div>

                                <div className="order-information-card">

                                    <div className="order-card-title">
                                        <LuMapPin />
                                        <span>SHIPPING ADDRESS</span>
                                    </div>

                                    <div className="shipping-address">

                                        <strong>
                                            {selectedOrder.addressName}
                                        </strong>

                                        <p>
                                            {selectedOrder.address}
                                        </p>

                                        <p>
                                            {selectedOrder.state}
                                        </p>

                                        <p>
                                            {selectedOrder.country}
                                        </p>

                                        <div className="address-contact">
                                            <LuPhone />
                                            <span>
                                                Address Contact: {selectedOrder.addressContact}
                                            </span>
                                        </div>

                                    </div>

                                </div>

                                <div className="order-information-card">

                                    <div className="order-card-title">
                                        <LuCreditCard />
                                        <span>ORDER & PAYMENT</span>
                                    </div>

                                    <div className="payment-details">

                                        <div className="payment-row">

                                            <span>Order Date:</span>

                                            <strong>
                                                {selectedOrder.datejoined},
                                                <br />
                                                {selectedOrder.time}
                                            </strong>

                                        </div>

                                        <div className="payment-row">

                                            <span>Payment Status:</span>

                                            <span className="payment-status">
                                                Pending
                                            </span>

                                        </div>

                                        <div className="payment-row">

                                            <span>Payment Method:</span>

                                            <strong>
                                                💳 COD
                                            </strong>

                                        </div>

                                    </div>

                                </div>

                            </div>

                            <div className="items-title">
                                ITEMS ORDERED
                            </div>

                            <div className="ordered-item-card">

                                <div className="ordered-product-image">
                                    🧴
                                </div>

                                <div className="ordered-product-information">

                                    <h3>
                                        {selectedOrder.productName}
                                    </h3>

                                    <div className="ordered-product-meta">

                                        <span>
                                            Category:
                                            <strong>
                                                {selectedOrder.category}
                                            </strong>
                                        </span>

                                        <span>
                                            SKU:
                                            <strong>
                                                {selectedOrder.sku}
                                            </strong>
                                        </span>

                                    </div>

                                </div>

                                <div className="ordered-price">

                                    <span>
                                        Pricing
                                    </span>

                                    <strong>
                                        ₹{selectedOrder.price} x {selectedOrder.quantity}
                                    </strong>

                                </div>

                                <div className="ordered-total">

                                    <span>
                                        Total Price
                                    </span>

                                    <strong>
                                        ₹{selectedOrder.total}
                                    </strong>

                                </div>

                            </div>

                            <div className="order-details-footer">

                                <div className="grand-total">

                                    <span>
                                        GRAND TOTAL PAID
                                    </span>

                                    <strong>
                                        ₹{selectedOrder.total}
                                    </strong>

                                </div>

                                <div className="footer-status">

                                    <span>
                                        STATUS:
                                    </span>

                                    <select
                                        className={`order-details-status-select ${getStatusClass(selectedOrder.status)}`}
                                        value={selectedOrder.status}
                                        onChange={(e) =>
                                            handleStatusChange(
                                                selectedOrder.id,
                                                e.target.value
                                            )
                                        }
                                    >

                                        <option value="Pending">
                                            Pending
                                        </option>

                                        <option value="Processing">
                                            Processing
                                        </option>

                                        <option value="Shipped">
                                            Shipped
                                        </option>

                                        <option value="Out for Delivery">
                                            Out for Delivery
                                        </option>

                                        <option value="Delivered">
                                            Delivered
                                        </option>

                                        <option value="Returned">
                                            Returned
                                        </option>

                                        <option value="Failed Delivery">
                                            Failed Delivery
                                        </option>

                                        <option value="Cancelled">
                                            Cancelled
                                        </option>

                                    </select>

                                </div>

                                <button
                                    className="close-details-button"
                                    onClick={handleCloseDetails}
                                >
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