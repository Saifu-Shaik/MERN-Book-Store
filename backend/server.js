const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/bookapp")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const BookSchema = new mongoose.Schema({
  title: String,
  author: String,
  description: String,
  publisherYear: Number,
});

const Book = mongoose.model("Book", BookSchema);

app.get("/books", async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

app.post("/books", async (req, res) => {
  const book = new Book(req.body);
  await book.save();
  res.json(book);
});

app.put("/books/:id", async (req, res) => {
  const updated = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
});

app.delete("/books/:id", async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.json({ message: "Book deleted" });
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
