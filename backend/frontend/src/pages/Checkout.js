import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import "./CheckoutAndOrders.css";

function Checkout() {
  const { cart, getCartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [loading, setLoading] = useState(false);

  const total = getCartTotal();

  // Check for canceled payment redirect
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const canceled = query.get("canceled");

    if (canceled) {
      toast.error("Payment was canceled. You can try again.");
    }
  }, [location]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!address || !phone) {
      toast.error("Please fill in all shipping details");
      return;
    }

    setLoading(true);

    try {
      // 1. Create order as Pending
      const orderData = {
        name: user.name,
        items: cart.map(item => ({
          product: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price
        })),
        address: address,
        phone: phone,
        paymentMethod: paymentMethod,
        total: total
      };

      const res = await API.post("/orders", orderData);
      const createdOrder = res.data;

      // 2. If Stripe, redirect to checkout
      if (paymentMethod === "Credit Card" || paymentMethod === "PayPal") {
        const stripeRes = await API.post("/stripe/create-checkout-session", {
          orderId: createdOrder._id
        });
        window.location.href = stripeRes.data.url; // Redirect to Stripe
      } else {
        // Cash on delivery
        toast.success("Order placed successfully!");
        clearCart();
        navigate("/orders");
      }
    } catch (error) {
        toast.error("Error placing order. Please try again.");
        setLoading(false);
    }
  };

  

  if (cart.length === 0) {
    return (
      <div className="checkout-page" style={{textAlign: 'center', paddingTop: '5rem'}}>
        <h2>Your cart is empty.</h2>
        <button className="place-order-btn" style={{width: '200px', marginTop: '2rem'}} onClick={() => navigate("/shop")}>
          Go to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h2 className="checkout-title">Checkout</h2>
      
      <form onSubmit={handlePlaceOrder} className="checkout-form">
        <div className="checkout-section">
          <h3>Shipping Details</h3>
          <input
            type="text"
            placeholder="Full Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="checkout-input"
            required
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="checkout-input"
            required
            pattern="[0-9]{10}"
            title="Please enter a valid 10-digit phone number"
          />
        </div>

        <div className="checkout-section">
          <h3>Payment Method</h3>
          <div className="checkout-radio-group">
            <label className="radio-label">
              <input 
                type="radio" 
                value="Credit Card" 
                checked={paymentMethod === "Credit Card"} 
                onChange={(e) => setPaymentMethod(e.target.value)} 
              />
              Credit / Debit Card
            </label>
            <label className="radio-label">
              <input 
                type="radio" 
                value="PayPal" 
                checked={paymentMethod === "PayPal"} 
                onChange={(e) => setPaymentMethod(e.target.value)} 
              />
              PayPal (via Stripe)
            </label>
            <label className="radio-label">
              <input 
                type="radio" 
                value="Cash on Delivery" 
                checked={paymentMethod === "Cash on Delivery"} 
                onChange={(e) => setPaymentMethod(e.target.value)} 
              />
              Cash on Delivery (COD)
            </label>
          </div>
        </div>

        <div className="checkout-summary">
          <span>Total Amount</span>
          <span>₹{total.toFixed(2)}</span>
        </div>

        <button type="submit" disabled={loading} className="place-order-btn">
          {loading ? "Processing..." : paymentMethod === "Cash on Delivery" ? "Place Order" : "Proceed to Payment"}
        </button>
      </form>
    </div>
  );
}

export default Checkout;
