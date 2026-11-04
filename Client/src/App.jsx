import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// User & Auth Pages
import Login from "./pages/register/Login.jsx";
import Signup from "./pages/register/Signup.jsx";
import Homepage from "./pages/user/Homepage.jsx";
import Products from "./pages/user/Products.jsx";
import Paymentpage from "./pages/user/Paymentpage.jsx";
import Cart from "./pages/user/Cart.jsx";
import About from "./pages/user/About.jsx";
import Profile from "./pages/user/Profile.jsx";
import SpecificProduct from "./pages/user/SpecificProduct.jsx";
import Wishlist from "./pages/user/Wishlist.jsx";

// Admin Pages
import Category from "./pages/admin/Category.jsx";
import Adminproducts from "./pages/admin/Adminproducts.jsx";
import Adminaddproducts from "./pages/admin/Adminaddproducts.jsx";
import AdminCustomerdetails from "./pages/admin/AdminCustomerdetails.jsx";
import Adminorder from "./pages/admin/Adminorder.jsx";

// Route Guards
import AdminProtectedRoute, {
  PublicOnlyRoute,
  UserProtectedRoute,
  NonAdminRoute,
} from "./Components/protected-route/AdminProtectedRoute.jsx";

function App() {
  return (
    <>
      {/* 🔔 Global Toaster Notification Engine */}
      <Toaster
        position="top-center"
        containerStyle={{
          top: 85,
          zIndex: 99999,
        }}
        toastOptions={{
          duration: 5000,
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

      <Routes>
        {/* 🛍️ Public Storefront Routes (Blocked for logged-in Admins) */}
        <Route element={<NonAdminRoute />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/Products" element={<Products />} />
          <Route path="/About" element={<About />} />
          <Route path="/SpecificProduct/:id" element={<SpecificProduct />} />
        </Route>

        {/* 🚫 Guest-Only Routes (Redirects if already logged in) */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/LogIn" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
        </Route>

        {/* 🔒 Protected User Routes (Regular customers only; Admins blocked) */}
        <Route element={<UserProtectedRoute />}>
          <Route path="/Paymentpage" element={<Paymentpage />} />
          <Route path="/Cart" element={<Cart />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Wishlist" element={<Wishlist />} />
        </Route>

        {/* 🔒 Protected Admin Routes (Admins only) */}
        <Route element={<AdminProtectedRoute />}>
          <Route path="/AdminCategory" element={<Category />} />
          <Route path="/AdminProducts" element={<Adminproducts />} />
          <Route path="/AdminaddProducts" element={<Adminaddproducts />} />
          <Route path="/AdminCustomerdetails" element={<AdminCustomerdetails />} />
          <Route path="/Adminorder" element={<Adminorder />} />
        </Route>

        {/* 🧭 Fallback Route for undefined paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;