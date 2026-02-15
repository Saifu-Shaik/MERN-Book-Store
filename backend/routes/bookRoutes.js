const express = require("express");
const Book = require("../models/Book");
const verifyToken = require("../middleware/authMiddleware"); // ✅ use shared middleware

const router = express.Router();

/* ================= GET ALL BOOKS ================= */
router.get("/", async (req, res) => {
  try {
    const books = await Book.find().populate("owner", "name email");
    res.json(books);
  } catch {
    res.status(500).json({ error: "Error fetching books" });
  }
});

/* ================= ADD BOOK ================= */
router.post("/", verifyToken, async (req, res) => {
  try {
    const book = new Book({
      ...req.body,
      owner: req.user.id,
    });

    await book.save();
    res.json(book);
  } catch {
    res.status(500).json({ error: "Error adding book" });
  }
});

/* ================= UPDATE BOOK ================= */
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) return res.status(404).json({ error: "Book not found" });
    if (book.owner.toString() !== req.user.id)
      return res.status(403).json({ error: "Not allowed" });

    const updated = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(updated);
  } catch {
    res.status(500).json({ error: "Error updating book" });
  }
});

/* ================= DELETE BOOK ================= */
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) return res.status(404).json({ error: "Book not found" });
    if (book.owner.toString() !== req.user.id)
      return res.status(403).json({ error: "Not allowed" });

    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Book deleted" });
  } catch {
    res.status(500).json({ error: "Error deleting book" });
  }
});

module.exports = router;
