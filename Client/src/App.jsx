import Login from "./pages/register/Login.jsx";
import Signup from "./pages/register/Signup.jsx";
import Homepage from "./pages/user/Homepage.jsx";
import Products from "./pages/user/Products.jsx";
import Paymentpage from "./pages/user/Paymentpage.jsx";
import Cart from "./pages/user/Cart.jsx";
import About from "./pages/user/About.jsx";
import React from "react";
import Profile from "./pages/user/Profile.jsx";

import { Route,Routes } from "react-router-dom";

import Category from "./pages/admin/Category.jsx";
import Adminproducts from "./pages/admin/Adminproducts.jsx";
import Adminaddproducts from "./pages/admin/Adminaddproducts.jsx";
import Ordersuccess from "./pages/user/Ordersuccess.jsx"
import Orderfailure from "./pages/user/Orderfailure.jsx"
import AdminCustomerdetails from "./pages/admin/AdminCustomerdetails.jsx"
import SpecificProduct from "./pages/user/SpecificProduct.jsx"
import Wishlist from "./pages/user/Wishlist.jsx"
import Adminorder from "./pages/admin/Adminorder.jsx";


function App(){

    return(
        <>
        <Routes>
                <Route path='/' element={<Homepage/>}/>
                <Route path="/Products" element={<Products/>}/>
                <Route path='/LogIn' element={<Login/>}/>
                <Route path="/Signup" element={<Signup/>}/>
                <Route path="/Paymentpage" element={<Paymentpage/>}/>
                <Route path="/Cart" element={<Cart/>}/>
                <Route path="/About" element={<About/>}/>
                <Route path="/Profile" element={<Profile/>}/>      
                <Route path="/AdminCategory" element={<Category/>}/>
                <Route path="/AdminProducts" element={<Adminproducts/>}/>
                <Route path="/AdminaddProducts" element={<Adminaddproducts/>}/>
                <Route path="/Ordersuccess" element={<Ordersuccess/>}/>
                <Route path="/Orderfailure" element={<Orderfailure/>}/>
                <Route path='/AdminCustomerdetails' element={<AdminCustomerdetails/>}/>
                <Route path='/SpecificProduct/:id' element={<SpecificProduct/>}/>
                <Route path="/Wishlist" element={<Wishlist/>}/>
                <Route path="/Adminorder" element={<Adminorder/>}/>

        </Routes> 
        </>
    )
}

export default App