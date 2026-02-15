import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { getUser, getToken } from "../utils/auth";
import Loader from "../components/Loader";

export default function Orders() {
  const navigate = useNavigate();

  const user = getUser();
  const token = getToken();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // redirect if not logged in
  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const start = Date.now();
      const res = await api.get("/orders/my");

      // ensure spinner visible at least 1s
      const elapsed = Date.now() - start;
      if (elapsed < 1000) {
        await new Promise((r) => setTimeout(r, 1000 - elapsed));
      }

      setOrders(res.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      setActionLoading(orderId);

      await api.put(`/orders/status/${orderId}`, { status });

      await fetchOrders();
    } catch (error) {
      alert(error.response?.data?.error || "Failed to update status");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container mt-4">
      <h2 className="text-center text-primary mb-4">📦 Orders</h2>

      <table className="table table-bordered text-center">
        <thead className="table-dark">
          <tr>
            <th>Book</th>
            <th>Requester</th>
            <th>Type</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="5">No orders 🛒</td>
            </tr>
          ) : (
            orders.map((o) => {
              const isOwner = o.owner === user?.id;
              const isProcessing = actionLoading === o._id;

              return (
                <tr key={o._id}>
                  <td>{o.book?.title || "Book removed"}</td>
                  <td>{o.requester?.name}</td>

                  <td>
                    <span
                      className={`badge ${
                        o.orderType === "buy" ? "bg-success" : "bg-info"
                      }`}
                    >
                      {o.orderType}
                    </span>
                  </td>

                  <td>
                    <span className="badge bg-secondary">{o.status}</span>
                  </td>

                  <td>
                    {/* PENDING */}
                    {isOwner && o.status === "pending" && (
                      <>
                        <button
                          className="btn btn-success btn-sm me-2"
                          disabled={isProcessing}
                          onClick={() => updateStatus(o._id, "approved")}
                        >
                          {isProcessing ? "..." : "Approve"}
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          disabled={isProcessing}
                          onClick={() => updateStatus(o._id, "rejected")}
                        >
                          {isProcessing ? "..." : "Reject"}
                        </button>
                      </>
                    )}

                    {/* BORROW */}
                    {isOwner &&
                      o.status === "approved" &&
                      o.orderType === "borrow" && (
                        <button
                          className="btn btn-warning btn-sm"
                          disabled={isProcessing}
                          onClick={() => updateStatus(o._id, "returned")}
                        >
                          {isProcessing ? "Processing..." : "Mark Returned"}
                        </button>
                      )}

                    {/* BUY */}
                    {isOwner &&
                      o.status === "approved" &&
                      o.orderType === "buy" && (
                        <button
                          className="btn btn-primary btn-sm"
                          disabled={isProcessing}
                          onClick={() => updateStatus(o._id, "delivered")}
                        >
                          {isProcessing ? "Processing..." : "Mark Delivered"}
                        </button>
                      )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
