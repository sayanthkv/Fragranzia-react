import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../../admin/AdminNavbar";

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <AdminNavbar />
      <main className="admin-content p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;