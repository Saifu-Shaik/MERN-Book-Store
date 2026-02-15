import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { getUser, getToken } from "../utils/auth";
import BookForm from "../components/BookForm";
import BookList from "../components/BookList";
import Loader from "../components/Loader";

export default function Profile() {
  const navigate = useNavigate();

  const token = getToken();

  // stable user state
  const [user, setUser] = useState(null);

  const [books, setBooks] = useState([]);
  const [editBook, setEditBook] = useState(null);
  const [loading, setLoading] = useState(true);

  // read user once
  useEffect(() => {
    setUser(getUser());
  }, []);

  // redirect if not logged in
  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  // fetch only my books
  const fetchMyBooks = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);

      const start = Date.now();
      const res = await api.get("/books");

      // safe owner matching
      const myBooks = res.data.filter(
        (b) => (b.owner?._id || b.owner) === user.id,
      );

      // ensure minimum spinner time
      const elapsed = Date.now() - start;
      if (elapsed < 1000) {
        await new Promise((r) => setTimeout(r, 1000 - elapsed));
      }

      setBooks(myBooks);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // load books
  useEffect(() => {
    fetchMyBooks();
  }, [fetchMyBooks]);

  if (loading) return <Loader />;

  return (
    <div className="container mt-4">
      <h2 className="text-center text-primary mb-4">👤 My Books</h2>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <BookForm fetchBooks={fetchMyBooks} editBook={editBook} />
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <BookList
            books={books}
            fetchBooks={fetchMyBooks}
            setEditBook={setEditBook}
          />
        </div>
      </div>
    </div>
  );
}
