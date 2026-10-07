import React, { useState } from 'react';
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
import './Adminorder.css';
import { Link } from 'react-router-dom';



const Adminorder = () => {

    const [usersDetails, setUsersDetails] = useState([

        {
            id: 123,
            name: 'abcd',
            phone: 9993590,
            email: 'hdedd',
            action: '',
            status: 'Blocked',
            datejoined: "19/12/2020"
        }, {
            id: 124,
            name: 'abcd',
            phone: 9993590,
            email: 'hdedd',
            action: '',
            status: 'Blocked',
            datejoined: "17/1/2020"
        }, {
            id: 125,
            name: 'abcd',
            phone: 9993590,
            email: 'hdedd',
            action: '',
            status: 'Blocked',
            datejoined: "14/2/2020"
        }

    ])



    const toggleStatus = (id) => {
        setUsersDetails((prevusersDetails) =>
            prevusersDetails.map((item) => {
                if (item.id === id) {
                    return {
                        ...item,
                        status:
                            item.status === 'Block'
                                ? 'Unblock'
                                : 'Block'
                    };
                }

                return item;
            })
        );
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
                            <Link to='/AdminCustomerdetails'> <span>Customers</span></Link>
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


                <div className="AdminCustomerdetails-content">
                    <h2>Order Management</h2>
                    <p>Monitor,track and update customer orders dynamically</p>

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

                                        <td className="product-col-name">
                                            {data.id}
                                        </td>

                                        <td className="product-col-category">
                                            {data.name}<br />
                                            {data.phone}
                                        </td>

                                        <td className="product-col-category">
                                            {data.datejoined}
                                        </td>
                                        <td className="product-col-category">
                                            Product details
                                        </td>

                                        <td className="product-col-category">
                                            {data.action}
                                            <button
                                                className="product-action-show-btn"
                                                onClick={() => handleShowaction(data)}
                                            >
                                                <LuEye className="action-icon" />
                                                Show Details
                                            </button>
                                        </td>
                                        <td className="product-col-category">


                                            <select
                                                name="category"

                                                required
                                            >
                                                <option >
                                                    Pending
                                                </option>
                                                <option >
                                                    Processing
                                                </option>
                                                <option >
                                                    Shipped
                                                </option>
                                                <option >
                                                    Out for Delivery
                                                </option>
                                                <option >
                                                    Delivered
                                                </option>
                                                <option >
                                                    Returned
                                                </option>
                                                <option >
                                                    Failed Delivery
                                                </option>
                                                <option >
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




        </>
    )

}

export default Adminorder