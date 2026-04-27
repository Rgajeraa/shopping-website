import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function AddProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.price || !formData.image) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await API.post("/products", {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        image: formData.image
      });
      
      setSuccess(true);
      setTimeout(() => {
        navigate("/shop");
      }, 2000);
    } catch (err) {
      console.log(err);
      alert("Error adding product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container">
        <div style={styles.successContainer}>
          <p style={styles.successEmoji}>✅</p>
          <h2 style={styles.successTitle}>Product Added Successfully!</h2>
          <p style={styles.successText}>Redirecting to shop...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>➕ Add New Product</h2>

      <div style={styles.formContainer}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Product Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter product name"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              name="description"
              placeholder="Enter product description"
              value={formData.description}
              onChange={handleChange}
              style={{ ...styles.input, minHeight: "120px", resize: "vertical" }}
            />
          </div>

          <div style={styles.twoColumns}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Price (₹)</label>
              <input
                type="number"
                name="price"
                placeholder="Enter price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Image URL</label>
              <input
                type="url"
                name="image"
                placeholder="Enter image URL"
                value={formData.image}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>

          {formData.image && (
            <div style={styles.imagePreview}>
              <label style={styles.label}>Image Preview</label>
              <img src={formData.image} alt="Preview" style={styles.previewImg} />
            </div>
          )}

          <button
            type="submit"
            className="btn"
            style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
            disabled={loading}
          >
            {loading ? "Adding Product... ⏳" : "Add Product 🛍️"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  formContainer: {
    background: "white",
    borderRadius: "16px",
    padding: "40px",
    boxShadow: "0 15px 35px rgba(0, 0, 0, 0.1)",
    maxWidth: "700px",
    margin: "30px auto",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "25px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: "8px",
  },
  input: {
    padding: "12px 16px",
    border: "2px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "16px",
    transition: "all 0.3s ease",
    fontFamily: "inherit",
  },
  twoColumns: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },
  imagePreview: {
    marginTop: "10px",
  },
  previewImg: {
    maxWidth: "100%",
    maxHeight: "300px",
    borderRadius: "10px",
    marginTop: "10px",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
  },
  submitBtn: {
    marginTop: "20px",
  },
  successContainer: {
    textAlign: "center",
    padding: "60px 20px",
    background: "white",
    borderRadius: "20px",
    marginTop: "40px",
    boxShadow: "0 15px 35px rgba(0, 0, 0, 0.1)",
  },
  successEmoji: {
    fontSize: "64px",
    margin: "20px 0",
  },
  successTitle: {
    color: "#16a34a",
    fontSize: "28px",
    marginBottom: "15px",
  },
  successText: {
    fontSize: "16px",
    color: "#666",
    marginTop: "10px",
  },
};

export default AddProduct;
