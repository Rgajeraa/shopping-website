const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create-checkout-session", protect, async (req, res) => {
  try {
    const { orderId } = req.body;
    
    // Fetch the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Create line items for Stripe
    const line_items = order.items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100), // Stripe expects amounts in cents/paise
      },
      quantity: item.quantity,
    }));

    // Create Stripe Checkout Session
    const origin = req.headers.origin || "http://localhost:3000";
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${origin}/orders?success=true&orderId=${order._id}`,
      cancel_url: `${origin}/checkout?canceled=true`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Session Error:", error);
    res.status(500).json({ error: "Failed to create Stripe Checkout session" });
  }
});

module.exports = router;
