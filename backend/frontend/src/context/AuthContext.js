import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/users/login", { email, password });
      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success("Login successful!");
      navigate(data.isAdmin ? "/admin/products" : "/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await api.post("/users/register", { name, email, password });
      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success("Registration successful!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userInfo");
    toast.info("Logged out successfully");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
