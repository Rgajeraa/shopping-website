import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "./Admin.css";

function AdminDashboard() {
  const location = useLocation();

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <div className="admin-nav">
          <Link 
            to="/admin/products" 
            className={`admin-nav-link ${location.pathname.includes('/products') ? 'active' : ''}`}
          >
            Manage Products
          </Link>
          <Link 
            to="/admin/orders" 
            className={`admin-nav-link ${location.pathname.includes('/orders') ? 'active' : ''}`}
          >
            Track Orders
          </Link>
        </div>
      </div>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminDashboard;
