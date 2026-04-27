import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "./Cart.css";

function Cart() {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useContext(CartContext);

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <h3>Your cart is empty</h3>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <Link to="/shop" className="shop-btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2 className="cart-title">Shopping Cart ({cart.length} items)</h2>

      <div className="cart-content">
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.product._id} className="cart-item">
              <img
                src={`http://localhost:5000/uploads/${item.product.image}`}
                alt={item.product.name}
                className="cart-item-img"
              />
              <div className="cart-item-info">
                <Link to={`/product/${item.product._id}`} className="cart-item-name">
                  {item.product.name}
                </Link>
                <p className="cart-item-price">₹{item.product.price}</p>
                <div className="cart-item-actions">
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="qty-btn"
                  >
                    -
                  </button>
                  <span style={{ fontWeight: 600, width: '20px', textAlign: 'center' }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock}
                    className="qty-btn"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.product._id)}
                    className="rm-btn"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{getCartTotal().toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          
          <div className="summary-total">
            <span>Total</span>
            <span>₹{getCartTotal().toFixed(2)}</span>
          </div>

          <Link to="/checkout" className="checkout-btn">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;
