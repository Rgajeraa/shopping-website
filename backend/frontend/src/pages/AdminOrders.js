import React, { useState, useEffect } from "react";
import API from "../api";
import { toast } from "react-toastify";
import "./Admin.css";

const STATUS_FLOW = ["Pending", "Processing", "Shipped", "Delivered"];

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders");
      setOrders(res.data);
    } catch (error) {
      toast.error("Error fetching orders");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}/status`, { status });
      toast.success(`Order status updated to ${status}`);
      fetchOrders();
    } catch (error) {
      toast.error("Error updating status");
    }
  };

  return (
    <div className="admin-page-container">
      <h2 className="admin-page-title">Track & Manage Orders</h2>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Date</th>
              <th>Status</th>
              <th style={{textAlign: 'center'}}>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td style={{fontFamily: 'monospace', fontSize: '0.9rem'}}>{o._id}</td>
                <td>
                  <div style={{fontWeight: 700}}>{o.name}</div>
                  <div style={{fontSize: '0.85rem', color: 'var(--text-gray)'}}>{o.phone}</div>
                </td>
                <td style={{fontWeight: 800, color: 'var(--primary)'}}>₹{(o.total || 0).toFixed(2)}</td>
                <td style={{fontSize: '0.9rem'}}>{new Date(o.createdAt).toLocaleDateString()}</td>
                <td>
                  <span className={`order-status status-${o.status?.toLowerCase() || 'pending'}`}>
                    {o.status || "Pending"}
                  </span>
                </td>
                <td style={{textAlign: 'center'}}>
                  <select 
                    value={o.status || "Pending"} 
                    onChange={(e) => updateStatus(o._id, e.target.value)}
                    className="admin-select"
                    style={{width: 'auto', padding: '0.4rem 1rem'}}
                  >
                    {STATUS_FLOW.map((status, index) => (
                      <option 
                        key={status} 
                        value={status} 
                        disabled={index < STATUS_FLOW.indexOf(o.status || "Pending")}
                      >
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminOrders;
