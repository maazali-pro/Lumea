const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product"
    },

    name: {
      type: String,
      default: ""
    },

    price: {
      type: Number,
      default: 0
    },

    quantity: {
      type: Number,
      default: 1,
      min: 1
    },

    image: {
      type: String,
      default: ""
    }
  },
  {
    _id: false
  }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      trim: true
    },

    customer: {
      name: {
        type: String,
        required: true,
        trim: true
      },

      phone: {
        type: String,
        required: true,
        trim: true
      },

      address: {
        type: String,
        required: true,
        trim: true
      },

      city: {
        type: String,
        required: true,
        trim: true
      }
    },

    items: {
      type: [orderItemSchema],
      required: true,

      validate: {
        validator: function (value) {
          return Array.isArray(value) && value.length > 0;
        },

        message: "Order must contain at least one item."
      }
    },

    total: {
      type: Number,
      required: true,
      min: 0
    },

    paymentMethod: {
      type: String,
      required: true,
      trim: true
    },

    orderStatus: {
      type: String,

      enum: [
        "Pending",
        "Confirmed",
        "Cancelled",
        "Delivered"
      ],

      default: "Pending"
    }
  },

  {
    timestamps: true
  }
);

module.exports =
  mongoose.models.Order ||
  mongoose.model("Order", orderSchema);