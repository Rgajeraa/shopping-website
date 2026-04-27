const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  name: String,
  address: String,
  phone: String,
  items: Array,
  total: Number,
  paymentMethod: { type: String, required: true, default: "Cash on Delivery" },
  paymentStatus: { type: String, default: "Pending" },
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
