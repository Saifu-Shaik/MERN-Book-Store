const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    publisherYear: {
      type: Number,
    },

    // 👤 owner of the book (who added it)
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // sell or lend
    type: {
      type: String,
      enum: ["sell", "lend"],
      default: "sell",
    },

    // available or already taken
    available: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Book", BookSchema);
