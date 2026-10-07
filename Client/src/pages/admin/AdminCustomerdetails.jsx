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
import './AdminCustomerdetails.css';
import { Link } from 'react-router-dom';



const AdminCustomerdetails = () =>{


    const [usersDetails,setUsersDetails] = useState([

   { name:'abcd',
    phone:9993590,
    email:'hdedd',
    action:'',
    status:'Blocked'
   },{ name:'abcd',
    phone:9993590,
    email:'hdedd',
    action:'',
    status:'Blocked'
   },{ name:'abcd',
    phone:9993590,
    email:'hdedd',
    action:'',
    status:'Blocked'
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
  
    return(
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


                <div className="AdminCustomerdetails-content">
                        <h2>User List</h2>
                        <p>Manage registered Customers account and status</p>

                         <div className="product-table-card">
                        
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
                        
                                      {usersDetails.map((data) => (
                        
                                        <tr key={data.id}>
                        
                                          <td className="product-col-name">
                                            {data.name}
                                          </td>
                        
                                          <td className="product-col-category">
                                            {data.phone}
                                          </td>
                        
                                          <td className="product-col-category">
                                            {data.email}
                                          </td>
                        
                                          <td className="product-col-category">
                                            {data.action}
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
                                              onClick={() => toggleStatus(data.id)}
                                              className={`product-status-btn ${
                                                data.status === 'Unblock'
                                                  ? 'status-unblock'
                                                  : 'status-block'
                                              }`}
                                            >
                                              {data.status}
                                            </button>

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

export default AdminCustomerdetails