import api from "../utils/api";
import { getUser, getToken } from "../utils/auth";

export default function BookList({ books, fetchBooks, setEditBook }) {
  const user = getUser();
  const token = getToken();

  /* ================= DELETE ================= */
  const deleteBook = async (id) => {
    if (!token) return alert("Login required");

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this book?",
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/books/${id}`);
      fetchBooks();
    } catch (error) {
      console.error("Error deleting book:", error);
      alert(error.response?.data?.error || "Failed to delete book");
    }
  };

  /* ================= BUY / BORROW ================= */
  const requestBook = async (bookId, type) => {
    if (!token) return alert("Please login first");

    try {
      await api.post(`/orders/request/${bookId}`, { orderType: type });
      alert(`Request sent for ${type}`);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Request failed");
    }
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
          books.map((b) => {
            const isOwner = user && b.owner && b.owner._id === user.id;

            return (
              <tr key={b._id}>
                <td>{b.title}</td>
                <td>{b.author}</td>
                <td>{b.description}</td>
                <td>{b.publisherYear}</td>
                <td>
                  {isOwner ? (
                    <>
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
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => requestBook(b._id, "buy")}
                      >
                        Buy
                      </button>

                      <button
                        className="btn btn-info btn-sm"
                        onClick={() => requestBook(b._id, "borrow")}
                      >
                        Borrow
                      </button>
                    </>
                  )}
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}
