const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },

  name: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  quantity: {
    type: Number,
    required: true,
    min: 1
  },

  image: {
    type: String,
    default: ""
  }

}, {
  _id: false
});


const orderSchema = new mongoose.Schema({

  orderId: {
    type: String,
    required: true,
    unique: true
  },

  customer: {
    name: {
      type: String,
      required: true,
      trim: true
    },

    phone: {
      type: String,
      default: ""
    },

    address: {
      type: String,
      default: ""
    },

    city: {
      type: String,
      default: ""
    }
  },

  items: {
    type: [orderItemSchema],
    required: true
  },

  total: {
    type: Number,
    required: true,
    min: 0
  },

  paymentMethod: {
    type: String,
    enum: ["COD", "JAZZCASH", "EASYPAISA", "CARD"],
    required: true
  },

  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Failed"],
    default: "Pending"
  },

  orderStatus: {
    type: String,
    enum: [
      "Pending",
      "Confirmed",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled"
    ],
    default: "Confirmed"
  }

}, {
  timestamps: true
});


module.exports = mongoose.model("Order", orderSchema);