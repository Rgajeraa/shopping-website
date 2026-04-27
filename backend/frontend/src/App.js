import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Context Providers
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import UserOrders from "./pages/UserOrders";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import "./App.css";

function Navbar() {
  const location = useLocation();
  const isAdminPage=location.pathname.startsWith("/admin");
  const { user, logout } = useContext(AuthContext);

  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  return (
    <div className="navbar">
      <Link to="/" style={{ textDecoration: 'none' }}>
        <h2 className="logo">ANOKHI</h2>
      </Link>

      <div className="nav-links">
      {!isAdminPage && ( <>
      <Link to ="/">Home</Link>
      <Link to ="/shop">Shop</Link>
      <Link to ="/cart">Cart</Link>
      </>
    )}
    {user && user.isAdmin && (<Link to ="/admin/products">Admin</Link>)}
    {user && !user.isAdmin && !isAdminPage && (<Link to ="/orders">Orders</Link>)}
    {user ? (<button onClick={logout} className="logout-btn">Logout</button>):(
    (<Link to ="/login">Login</Link>))}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <ToastContainer position="bottom-right" />
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* User Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<UserOrders />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute adminOnly={true} />}>
              <Route path="/admin" element={<AdminDashboard />}>
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
              </Route>
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;