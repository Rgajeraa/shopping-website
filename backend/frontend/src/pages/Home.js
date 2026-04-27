import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-page">
      <h1 className="home-title">Welcome to Anokhi</h1>
      <p className="home-subtitle">
        Discover amazing products at unbeatable prices. Shop from our exclusive collection of high-quality items.
      </p>

      <div className="hero-banner">
        <div className="hero-content">
          <h2>Summer Collection</h2>
          <p>
            Browse our latest collection featuring premium quality products hand-picked for you.
          </p>
          <Link to="/shop" className="hero-btn">
            Explore Now
          </Link>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Fast Shipping</h3>
            <p>Delivery in 2-3 business days</p>
          </div>
          <div className="feature-card">
            <h3>Secure Checkout</h3>
            <p>Your payment is 100% safe</p>
          </div>
          <div className="feature-card">
            <h3>Money-Back</h3>
            <p>30-day returns guarantee</p>
          </div>
          <div className="feature-card">
            <h3>24/7 Support</h3>
            <p>We're here to help anytime</p>
          </div>
        </div>
      </div>

      <div className="stats-container">
        <div className="stat-item">
          <h2>10K+</h2>
          <p>Products</p>
        </div>
        <div className="stat-item">
          <h2>50K+</h2>
          <p>Happy Customers</p>
        </div>
        <div className="stat-item">
          <h2>99%</h2>
          <p>Satisfaction Rate</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
