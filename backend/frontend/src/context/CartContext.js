import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (parsed[0].product && parsed[0].product._id) {
            setCart(parsed);
          } else {
            localStorage.removeItem("cart"); // Clear broken old format
            setCart([]);
          }
        } else {
          setCart(parsed);
        }
      } catch (e) {
        localStorage.removeItem("cart");
      }
    }
  }, []);

  const addToCart = (product, quantity = 1) => {
    const existItem = cart.find((x) => x.product._id === product._id);
    let newCart;
    if (existItem) {
      newCart = cart.map((x) =>
        x.product._id === existItem.product._id ? { ...x, quantity: x.quantity + quantity } : x
      );
      toast.info(`Increased quantity of ${product.name}`);
    } else {
      newCart = [...cart, { product, quantity }];
      toast.success(`${product.name} added to cart!`);
    }
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const removeFromCart = (productId) => {
    const newCart = cart.filter((x) => x.product._id !== productId);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    toast.info("Item removed from cart");
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    const newCart = cart.map((x) =>
      x.product._id === productId ? { ...x, quantity } : x
    );
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const getCartTotal = () => {
    return cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, getCartTotal, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
