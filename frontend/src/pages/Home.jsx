import { useEffect, useState } from "react";
import axios from "axios";
import BookForm from "../components/BookForm";
import BookList from "../components/BookList";
import Loader from "../components/Loader";

const API_URL =
  process.env.REACT_APP_API_URL || "https://mern-book-store-e5nz.onrender.com";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [editBook, setEditBook] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBooks = async () => {
    try {
      setLoading(true);

      const start = Date.now(); // 👈 ensure minimum spinner time

      const res = await axios.get(`${API_URL}/books`);

      // minimum 1 second spinner UX
      const elapsed = Date.now() - start;
      if (elapsed < 1000) {
        await new Promise((r) => setTimeout(r, 1000 - elapsed));
      }

      setBooks(res.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center text-primary mb-4">📚 Book App Store</h2>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <BookForm fetchBooks={fetchBooks} editBook={editBook} />
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          {loading ? (
            <Loader />
          ) : (
            <BookList
              books={books}
              fetchBooks={fetchBooks}
              setEditBook={setEditBook}
            />
          )}
        </div>
      </div>
    </div>
  );
}
