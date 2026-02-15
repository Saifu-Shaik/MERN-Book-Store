const express = require("express");
const Order = require("../models/Order");
const Book = require("../models/Book");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

/* ================= REQUEST BUY / BORROW ================= */
router.post("/request/:bookId", verifyToken, async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);

    if (!book) return res.status(404).json({ error: "Book not found" });
    if (!book.available)
      return res.status(400).json({ error: "Book not available" });

    // owner cannot request own book
    if (book.owner.toString() === req.user.id)
      return res.status(400).json({ error: "You own this book" });

    const order = await Order.create({
      book: book._id,
      requester: req.user.id,
      owner: book.owner,
      orderType: req.body.orderType, // "buy" or "borrow"
      status: "pending",
    });

    res.json(order);
  } catch {
    res.status(500).json({ error: "Request failed" });
  }
});

/* ================= OWNER APPROVES / REJECTS / COMPLETE ================= */
router.put("/status/:orderId", verifyToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate("book");

    if (!order) return res.status(404).json({ error: "Order not found" });

    // only owner can update
    if (order.owner.toString() !== req.user.id)
      return res.status(403).json({ error: "Not authorized" });

    const newStatus = req.body.status;
    order.status = newStatus;

    /* ---------- APPROVED ---------- */
    if (newStatus === "approved") {
      // both buy & borrow → book unavailable
      await Book.findByIdAndUpdate(order.book._id, { available: false });
    }

    /* ---------- RETURNED (BORROW) ---------- */
    if (newStatus === "returned" && order.orderType === "borrow") {
      await Book.findByIdAndUpdate(order.book._id, { available: true });
    }

    /* ---------- DELIVERED (BUY COMPLETED) ---------- */
    if (newStatus === "delivered" && order.orderType === "buy") {
      // remove sold book permanently
      await Book.findByIdAndDelete(order.book._id);
    }

    await order.save();
    res.json(order);
  } catch {
    res.status(500).json({ error: "Update failed" });
  }
});

/* ================= MY ORDERS ================= */
router.get("/my", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ requester: req.user.id }, { owner: req.user.id }],
    })
      .populate("book")
      .populate("requester", "name email");

    res.json(orders);
  } catch {
    res.status(500).json({ error: "Error fetching orders" });
  }
});

module.exports = router;
