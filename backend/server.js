const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ FAST HEALTH CHECK ROUTE FOR RENDER
app.get("/", (req, res) => {
  res.status(200).send("Server is up and running");
});

// ✅ Track MongoDB connection state
let isDbConnected = false;

// Connect to MongoDB (Atlas for Render)
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000, // fail fast instead of hanging forever
  })
  .then(() => {
    console.log("MongoDB Connected");
    isDbConnected = true;
  })
  .catch((err) => {
    console.error("MongoDB Error:", err);
  });

const BookSchema = new mongoose.Schema({
  title: String,
  author: String,
  description: String,
  publisherYear: Number,
});

const Book = mongoose.model("Book", BookSchema);

// Routes
app.get("/books", async (req, res) => {
  // ✅ IMPORTANT: Don’t query DB unless connected
  if (!isDbConnected) {
    return res.status(503).json({
      error: "Database not connected. Please try again later.",
    });
  }

  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    console.error("GET /books error:", error);
    res.status(500).json({ error: "Error fetching books" });
  }
});

app.post("/books", async (req, res) => {
  if (!isDbConnected) {
    return res.status(503).json({
      error: "Database not connected. Please try again later.",
    });
  }

  try {
    const book = new Book(req.body);
    await book.save();
    res.json(book);
  } catch (error) {
    console.error("POST /books error:", error);
    res.status(500).json({ error: "Error adding book" });
  }
});

app.put("/books/:id", async (req, res) => {
  if (!isDbConnected) {
    return res.status(503).json({
      error: "Database not connected. Please try again later.",
    });
  }

  try {
    const updated = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (error) {
    console.error("PUT /books/:id error:", error);
    res.status(500).json({ error: "Error updating book" });
  }
});

app.delete("/books/:id", async (req, res) => {
  if (!isDbConnected) {
    return res.status(503).json({
      error: "Database not connected. Please try again later.",
    });
  }

  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Book deleted" });
  } catch (error) {
    console.error("DELETE /books/:id error:", error);
    res.status(500).json({ error: "Error deleting book" });
  }
});

// Start server (Render provides PORT)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
