const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    stock: {
      type: Number,
      default: 0,
      min: 0
    },

    category: {
      type: String,
      required: true,
      trim: true
    },

    image: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    }
  },

  {
    timestamps: true,

    // Agar MongoDB mein koi extra purana field hai
    // to woh automatically delete nahi hoga.
    strict: false
  }
);

module.exports =
  mongoose.models.Product ||
  mongoose.model("Product", productSchema);