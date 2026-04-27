import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API, { BASE_URL } from "../api";
import { CartContext } from "../context/CartContext";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${id}`);
        setProduct(res.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch product:", err.message);
        setError("Failed to load product. Make sure backend is running.");
        setProduct(null);
      }
    };

    fetchProduct();
  }, [id]);

  if (error) {
    return (
      <div className="pd-page" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <div className="message-box error-box">
          <p>{error}</p>
          <Link to="/shop" className="back-link" style={{marginTop: '1.5rem'}}>← Back to Shop</Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="spinner-container" style={{height: '80vh', alignItems: 'center'}}>
        <div className="spinner"></div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, parseInt(qty));
    navigate("/cart");
  };

  return (
    <div className="pd-page">
      <Link to="/shop" className="back-link">← Back to Shop</Link>

      <div className="pd-card">
        <div className="pd-image-container">
          <img
             src={`${BASE_URL}/uploads/${product.image}`}
             alt={product.name}
             className="pd-image"
          />
        </div>

        <div className="pd-info">
          <h2 className="pd-name">{product.name}</h2>
          <div className="pd-price-row">
            <p className="pd-price">₹{product.price}</p>
            <span className="pd-stock-badge">In Stock</span>
          </div>
          
          <p className="pd-desc">{product.description}</p>

          <div className="pd-features">
            <p className="pd-feature"><span>✓</span> High Quality Product</p>
            <p className="pd-feature"><span>✓</span> Original & Authentic</p>
            <p className="pd-feature"><span>✓</span> 30-Day Money-Back Guarantee</p>
          </div>

          <div className="pd-action-row">
            <label>Quantity:</label>
            <select 
              value={qty} 
              onChange={(e) => setQty(Number(e.target.value))}
              className="pd-qty-select"
            >
              {[...Array(product.stock > 0 ? product.stock : 10).keys()].map((x) => (
                <option key={x + 1} value={x + 1}>{x + 1}</option>
              ))}
            </select>
            <button className="pd-add-btn" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
          
          <div className="pd-footer">
            <p>Trusted by 50,000+ customers</p>
            <p>24/7 Customer Support</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
