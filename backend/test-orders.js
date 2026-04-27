const mongoose = require("mongoose");
const Order = require("./models/Order");

async function check() {
  await mongoose.connect("mongodb://127.0.0.1:27017/ecommerce");
  
  // Find orders using the exact filter from orderRoutes
  const filteredOrders = await Order.find({
    $or: [
      { paymentStatus: "Paid" },
      { paymentMethod: "Cash on Delivery" }
    ]
  });

  // Find all orders to see what's actually in there
  const allOrders = await Order.find();

  console.log("----- ALL ORDERS -----");
  allOrders.forEach(o => {
    console.log(`ID: ${o._id}, method: ${o.paymentMethod}, pStatus: ${o.paymentStatus}, status: ${o.status}`);
  });

  console.log("\n----- FILTERED ORDERS (What the route should return) -----");
  filteredOrders.forEach(o => {
    console.log(`ID: ${o._id}, method: ${o.paymentMethod}, pStatus: ${o.paymentStatus}, status: ${o.status}`);
  });

  process.exit(0);
}

check().catch(console.error);
