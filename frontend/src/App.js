import { useEffect, useState } from "react";
import axios from "axios";
import BookForm from "./components/BookForm";
import BookList from "./components/BookList";

function App() {
  const [books, setBooks] = useState([]);
  const [editBook, setEditBook] = useState(null);

  const fetchBooks = async () => {
    const res = await axios.get("http://localhost:5000/books");
    setBooks(res.data);
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
          <BookList
            books={books}
            fetchBooks={fetchBooks}
            setEditBook={setEditBook}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
