import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      return alert("All fields are required");
    }

    try {
      setLoading(true);

      await api.post("/register", form);

      // small UX delay
      await new Promise((r) => setTimeout(r, 700));

      alert("Registration successful. Please login.");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "450px" }}>
      <div className="card shadow">
        <div className="card-body">
          <h3 className="text-center mb-3">Create Account!😇</h3>

          <form onSubmit={submit}>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              type="email"
              className="form-control mb-3"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <input
              type="password"
              className="form-control mb-3"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <button className="btn btn-success w-100" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Registering...
                </>
              ) : (
                "Register"
              )}
            </button>
          </form>

          <p className="text-center mt-3">
            Already have an account? <Link to="/login">Login🎯</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
