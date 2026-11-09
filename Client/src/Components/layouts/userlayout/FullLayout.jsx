import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../user/Navbar";
import Footer from "../../user/Footer";

const FullLayout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default FullLayout;