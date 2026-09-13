const express = require("express");

const router = express.Router();

const Order = require("../models/Order");

const jwt = require("jsonwebtoken");


// ===============================
// ADMIN AUTHENTICATION
// ===============================
function requireAdmin(req, res, next) {

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Admin authentication required."
    });
  }

  const token = authHeader.split(" ")[1];

  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "change-this-secret-before-hosting"
    );

    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access only."
      });
    }

    req.admin = decoded;

    next();

  } catch (error) {

    return res.status(401).json({
      success: false,
      message: "Invalid or expired admin token."
    });

  }
}


// ===============================
// CREATE NEW ORDER
// PUBLIC — CUSTOMER CAN ORDER
// ===============================
router.post("/", async (req, res) => {

  try {

    const {
      orderId,
      customer,
      items,
      total,
      paymentMethod
    } = req.body;

    const order = new Order({
      orderId,
      customer,
      items,
      total,
      paymentMethod
    });

    const savedOrder = await order.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully!",
      order: savedOrder
    });

  } catch (error) {

    console.error("Order error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message
    });

  }

});


// ===============================
// GET ALL ORDERS
// ADMIN ONLY
// ===============================
router.get("/", requireAdmin, async (req, res) => {

  try {

    const orders = await Order.find().sort({
      createdAt: -1
    });

    res.json({
      success: true,
      orders: orders
    });

  } catch (error) {

    console.error("Get orders error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get orders",
      error: error.message
    });

  }

});


// ===============================
// CONFIRM ORDER
// ADMIN ONLY
// ===============================
router.put("/:id/confirm", requireAdmin, async (req, res) => {

  try {

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        orderStatus: "Confirmed"
      },
      {
        new: true
      }
    );

    if (!order) {

      return res.status(404).json({
        success: false,
        message: "Order not found"
      });

    }

    res.json({
      success: true,
      message: "Order confirmed successfully!",
      order: order
    });

  } catch (error) {

    console.error("Confirm order error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to confirm order",
      error: error.message
    });

  }

});


module.exports = router;