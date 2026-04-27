const express = require("express");
const Order = require("../models/Order");
const { protect, admin } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", protect, async (req, res) => {
  const order = new Order({ ...req.body, user: req.user._id });
  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});
// ---------- MARK ORDER AS PAID ----------
router.put("/:id/pay", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    
    // Ensure the user owns the order, unless admin
    if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(401).json({ error: "Not authorized" });
    }

    order.paymentStatus = "Paid";
    await order.save();
    res.json(order);
  } catch (err) {
    console.error("Error updating payment status:", err);
    res.status(500).json({ error: "Failed to update payment status" });
  }
});

// ---------- GET USER ORDERS ----------
router.get("/mine", protect, async (req, res) => {
  try {
    const orders = await Order.find({ 
      user: req.user._id,
      $or: [
        { paymentStatus: "Paid" },
        { paymentMethod: "Cash on Delivery" }
      ]
    }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Error fetching user orders:", err);
    res.status(500).json({ error: "Failed to fetch user orders" });
  }
});

// ---------- GET ALL ORDERS (ADMIN) ----------
router.get("/", protect, admin, async (req, res) => {
  try {
    // Only return orders that are Paid (Stripe/PayPal) or Cash on Delivery
    const orders = await Order.find({
      $or: [
        { paymentStatus: "Paid" },
        { paymentMethod: "Cash on Delivery" }
      ]
    }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// ---------- UPDATE ORDER STATUS (ADMIN tracking) ----------
router.put("/:id/status", protect, admin, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({ error: "Failed to update order status" });
  }
});

module.exports = router;
