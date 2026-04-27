import React, { useEffect, useState, useContext } from "react";
import API from "../api";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { toast } from "react-toastify";
import "./CheckoutAndOrders.css";

function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useContext(CartContext);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const success = query.get("success");
    const orderId = query.get("orderId");

    if (success && orderId) {
      setLoading(true);
      API.put(`/orders/${orderId}/pay`)
        .then(() => {
          toast.success("Payment successful! Order confirmed.");
          clearCart();
          navigate("/orders", { replace: true });
        })
        .catch(err => {
          console.error("Error updating payment status", err);
          navigate("/orders", { replace: true });
        });
      return; 
    }

    const fetchMyOrders = async () => {
      try {
        const res = await API.get("/orders/mine");
        setOrders(res.data);
      } catch (error) {
        console.error("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchMyOrders();
  }, [location.search, navigate, clearCart]);

  const getStatusClass = (status) => {
    switch (status) {
      case "Processing": return "status-processing";
      case "Shipped": return "status-shipped";
      case "Delivered": return "status-delivered";
      default: return "status-pending";
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '6rem 0' }}>
        <div style={{ width: '50px', height: '50px', border: '5px solid #e5e7eb', borderTopColor: '#8B5E3C', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders-page" style={{textAlign: 'center', paddingTop: '5rem'}}>
        <h2 style={{color: 'var(--text-dark)', marginBottom: '1rem'}}>No Orders Found</h2>
        <p style={{color: 'var(--text-gray)', marginBottom: '2rem'}}>You haven't placed any orders yet.</p>
        <Link to="/shop" style={{background: 'var(--primary)', color: 'white', padding: '0.8rem 2rem', borderRadius: '30px', textDecoration: 'none', fontWeight: 700}}>
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h2 className="orders-title">My Order History</h2>
      
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <div>
                <span className="order-id">Order ID: {order._id}</span>
                <p className="order-date">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={`order-status ${getStatusClass(order.status)}`}>
                {order.status || "Pending"}
              </span>
            </div>
            
            <div className="order-body">
              {(order.items || []).map((item, index) => (
                <div key={index} className="order-item-row">
                  <span>{item.quantity}x {item.name}</span>
                  <span>₹{item.price}</span>
                </div>
              ))}
            </div>

            <div className="order-footer">
              <span>Total Amount</span>
              <span style={{color: 'var(--primary)'}}>₹{(order.total || 0).toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserOrders;
