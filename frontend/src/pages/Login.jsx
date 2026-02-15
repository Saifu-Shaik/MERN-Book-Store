import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import { loginUser } from "../utils/auth";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return alert("Please enter email and password");
    }

    try {
      setLoading(true);

      const res = await api.post("/login", form);

      // store auth
      loginUser(res.data);

      // small UX delay
      await new Promise((r) => setTimeout(r, 700));

      navigate("/");
    } catch (error) {
      alert(error.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <div className="card shadow">
        <div className="card-body">
          <h3 className="text-center mb-3">Hey!! Login Here 😊</h3>

          <form onSubmit={submit}>
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

            <button className="btn btn-primary w-100" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <p className="text-center mt-3">
            Don't have an account? <Link to="/register">Register Here🎯</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
