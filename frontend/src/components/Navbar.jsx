import { Link, useNavigate } from "react-router-dom";
import { getUser, logoutUser } from "../utils/auth";

export default function Navbar() {
  const navigate = useNavigate();

  const user = getUser();

  const logout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/">
          📚 Book Store
        </Link>

        <div className="collapse navbar-collapse show">
          <ul className="navbar-nav ms-auto">
            {/* Always visible */}
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home 🏠
              </Link>
            </li>

            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">
                    Profile
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/orders">
                    Orders
                  </Link>
                </li>

                <li className="nav-item">
                  <button
                    className="btn btn-sm btn-danger ms-3"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login ➜]
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register ®️
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
