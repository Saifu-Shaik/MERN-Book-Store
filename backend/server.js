const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

/* ========= IMPORT ROUTES ========= */
const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

/* ========= MIDDLEWARE ========= */
app.use(
  cors({
    origin: true, // allow all (works local + render)
    credentials: true,
  }),
);

app.use(express.json());

/* ================= HEALTH CHECK (FOR RENDER) ================= */
app.get("/", (req, res) => {
  res.status(200).send("Server is up and running");
});

/* ================= DATABASE CONNECTION ================= */
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

/* ================= ROUTES ================= */

// Authentication
app.use("/", authRoutes);

// Books
app.use("/books", bookRoutes);

// Orders (buy / lend system)
app.use("/orders", orderRoutes);

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
