import React, { useEffect, useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";
import "./Shop.css";

function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products");
        setProducts(res.data || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch products:", err.message);
        setError("Failed to load products. Make sure backend is running.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="shop-page">
      <div className="shop-header">
        <h2 className="shop-title">Shop Our Collection</h2>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <p className="error-box">{error}</p>
      ) : filteredProducts.length === 0 ? (
        <div className="message-box">No products found. Try a different search!</div>
      ) : (
        <>
          <p style={{ color: "var(--text-gray)", marginBottom: "1.5rem", fontWeight: 500 }}>
            Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
          </p>
          <div className="products-grid">
            {filteredProducts.map(product => (
              <Link key={product._id} to={`/product/${product._id}`} className="product-card">
                <div className="product-img-wrapper">
                  <img
                    src={`https://shopping-website-ol23.onrender.com/uploads/${product.image}`}
                    alt={product.name}
                    className="product-img"
                    loading="lazy"
                  />
                </div>
                <div className="product-info">
                  <h4 className="product-name">{product.name}</h4>
                  <p className="product-desc">{product.description?.substring(0, 60)}...</p>
                  <div className="product-footer">
                    <p className="product-price">₹{product.price}</p>
                    <span className="view-btn">View Details</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Shop;
