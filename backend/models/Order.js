const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },

    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // buy or borrow
    orderType: {
      type: String,
      enum: ["buy", "borrow"],
      required: true,
    },

    // order status
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "returned", "completed"],
      default: "pending",
    },

    requestDate: {
      type: Date,
      default: Date.now,
    },

    returnDate: {
      type: Date,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", OrderSchema);
