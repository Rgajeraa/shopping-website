import React, { useState, useEffect } from "react";
import API from "../api";
import { toast } from "react-toastify";
import "./Admin.css";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  
  const [form, setForm] = useState({ name: "", price: "", description: "", category: "", stock: "" });
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (error) {
      toast.error("Error fetching products");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await API.delete(`/products/${id}`);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      toast.error("Error deleting product");
    }
  };

  const handleEditClick = (product) => {
    setEditingId(product._id);
    setForm({ 
      name: product.name, 
      price: product.price, 
      description: product.description,
      category: product.category,
      stock: product.stock
    });
    setImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append("stock", form.stock);
    if (image) formData.append("image", image);

    try {
      if (editingId) {
        await API.put(`/products/${editingId}`, formData);
        toast.success("Product updated successfully");
      } else {
        await API.post("/products", formData);
        toast.success("Product added successfully");
      }
      setEditingId(null);
      setForm({ name: "", price: "", description: "", category: "", stock: "" });
      setImage(null);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.error || "Error saving product");
    }
  };

  return (
    <div className="admin-page-container">
      <h2 className="admin-page-title">{editingId ? "Edit Product" : "Add New Product"}</h2>
      
      <form onSubmit={handleSubmit} className="admin-form-grid">
        <input type="text" placeholder="Product Name" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="admin-input" />
        <input type="number" min="0" placeholder="Price (₹)" required value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="admin-input" />
        <input type="text" placeholder="Category" required value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="admin-input" />
        <input type="number" min="0" placeholder="Total Stock" required value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} className="admin-input" />
        <textarea placeholder="Product Description..." required value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="admin-textarea" />
        <input type="file" onChange={e => setImage(e.target.files[0])} className="file-input" accept="image/*" />
        
        <div className="admin-actions-row">
          <button type="submit" className="btn-primary">
            {editingId ? "Update Product" : "Add Product"}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setForm({ name: "", price: "", description: "", category: "", stock: "" }); }} className="btn-secondary">
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2 className="admin-page-title">Manage Products</h2>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Category</th>
              <th style={{textAlign: 'center'}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>
                  <img src={`http://localhost:5000/uploads/${p.image}`} alt={p.name} className="product-thumb" />
                </td>
                <td style={{fontWeight: 600}}>{p.name}</td>
                <td style={{fontWeight: 700, color: 'var(--primary)'}}>₹{p.price}</td>
                <td>{p.stock}</td>
                <td>
                  <span className="badge-category">{p.category}</span>
                </td>
                <td>
                  <div className="action-btns">
                    <button onClick={() => handleEditClick(p)} className="btn-edit">Edit</button>
                    <button onClick={() => handleDelete(p._id)} className="btn-delete">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminProducts;
