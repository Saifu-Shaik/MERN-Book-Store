import { useState, useEffect } from "react";
import axios from "axios";

// ✅ Use the same Render backend URL
const API_URL =
  process.env.REACT_APP_API_URL || "https://mern-book-store-e5nz.onrender.com";

export default function BookForm({ fetchBooks, editBook }) {
  const [form, setForm] = useState({
    title: "",
    author: "",
    description: "",
    publisherYear: "",
  });

  useEffect(() => {
    if (editBook) {
      setForm({
        title: editBook.title || "",
        author: editBook.author || "",
        description: editBook.description || "",
        publisherYear: editBook.publisherYear || "",
      });
    }
  }, [editBook]);

  const submit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.author) {
      alert("Title and Author are required");
      return;
    }

    try {
      if (editBook) {
        await axios.put(`${API_URL}/books/${editBook._id}`, form);
      } else {
        await axios.post(`${API_URL}/books`, form);
      }

      fetchBooks(); // refresh list

      // Clear form
      setForm({
        title: "",
        author: "",
        description: "",
        publisherYear: "",
      });
    } catch (error) {
      console.error("Error submitting book:", error);
      alert("Failed to save book. Check console.");
    }
  };

  return (
    <form onSubmit={submit} className="row g-2 mb-3">
      <div className="col-md-3">
        <input
          type="text"
          className="form-control"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
      </div>

      <div className="col-md-3">
        <input
          type="text"
          className="form-control"
          placeholder="Author"
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
        />
      </div>

      <div className="col-md-3">
        <input
          type="text"
          className="form-control"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>

      <div className="col-md-2">
        <input
          type="text"
          className="form-control"
          placeholder="Year"
          value={form.publisherYear}
          onChange={(e) => setForm({ ...form, publisherYear: e.target.value })}
        />
      </div>

      <div className="col-md-1 d-grid">
        <button type="submit" className="btn btn-success">
          {editBook ? "Update" : "Add"}
        </button>
      </div>
    </form>
  );
}
