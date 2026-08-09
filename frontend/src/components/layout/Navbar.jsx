import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");

    alert("Logged out successfully");

    navigate("/login");
  }

  const navLink = (path) =>
    `transition font-medium ${
      location.pathname === path
        ? "text-blue-600 border-b-2 border-blue-600 pb-1"
        : "text-gray-700 hover:text-blue-600"
    }`;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">

        {/* Logo */}

        <Link
          to="/"
          className="text-2xl font-bold text-blue-600"
        >
          InsightFlow AI
        </Link>

        {/* Navigation */}

        <div className="flex items-center gap-6">

          <Link
            to="/"
            className={navLink("/")}
          >
            Home
          </Link>

          <Link
            to="/dashboard"
            className={navLink("/dashboard")}
          >
            Dashboard
          </Link>

          <Link
            to="/upload"
            className={navLink("/upload")}
          >
            Upload
          </Link>

          <Link
            to="/uploads"
            className={navLink("/uploads")}
          >
            My Uploads
          </Link>

          <Link
            to="/reports"
            className={navLink("/reports")}
          >
            Reports
          </Link>

          {token ? (
            <>
              <div className="px-4 py-2 bg-blue-50 rounded-lg">
                <span className="font-semibold text-gray-700">
                  👋 {user?.name || "User"}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={navLink("/login")}
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
              >
                Register
              </Link>
            </>
          )}

        </div>

      </div>
    </nav>
  );
}