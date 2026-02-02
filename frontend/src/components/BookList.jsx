import axios from "axios";

export default function BookList({ books, fetchBooks, setEditBook }) {

  const deleteBook = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this book?");
    if (!confirmDelete) return;

    await axios.delete(`http://localhost:5000/books/${id}`);
    fetchBooks();
  };

  return (
    <table className="table table-bordered table-hover text-center">
      <thead className="table-dark">
        <tr>
          <th>Title</th>
          <th>Author</th>
          <th>Description</th>
          <th>Year</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {books.length === 0 ? (
          <tr>
            <td colSpan="5" className="text-muted">
              No books available
            </td>
          </tr>
        ) : (
          books.map((b) => (
            <tr key={b._id}>
              <td>{b.title}</td>
              <td>{b.author}</td>
              <td>{b.description}</td>
              <td>{b.publisherYear}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => setEditBook(b)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteBook(b._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
