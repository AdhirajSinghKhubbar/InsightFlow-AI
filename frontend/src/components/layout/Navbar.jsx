import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");

    setMenuOpen(false);

    alert("Logged out successfully");

    navigate("/login");
  }

  const navLink = (path) =>
    `transition font-medium ${
      location.pathname === path
        ? "text-blue-600 md:border-b-2 md:border-blue-600 md:pb-1"
        : "text-gray-700 hover:text-blue-600"
    }`;

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Navbar */}
        <div className="h-16 sm:h-18 flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            onClick={closeMenu}
            className="text-xl sm:text-2xl font-bold text-blue-600 whitespace-nowrap"
          >
            InsightFlow AI
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            <Link to="/" className={navLink("/")}>
              Home
            </Link>

            <Link to="/dashboard" className={navLink("/dashboard")}>
              Dashboard
            </Link>

            <Link to="/upload" className={navLink("/upload")}>
              Upload
            </Link>

            <Link to="/uploads" className={navLink("/uploads")}>
              My Uploads
            </Link>

            <Link to="/reports" className={navLink("/reports")}>
              Reports
            </Link>

            {token ? (
              <>
                <div className="px-3 lg:px-4 py-2 bg-blue-50 rounded-lg max-w-[180px]">
                  <span className="font-semibold text-gray-700 truncate block">
                    👋 {user?.name || "User"}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 lg:px-4 py-2 rounded-lg transition whitespace-nowrap"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={navLink("/login")}>
                  Login
                </Link>

                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition whitespace-nowrap"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            <div className="flex flex-col gap-2">
              <Link
                to="/"
                onClick={closeMenu}
                className={`px-3 py-3 rounded-lg ${navLink("/")}`}
              >
                Home
              </Link>

              <Link
                to="/dashboard"
                onClick={closeMenu}
                className={`px-3 py-3 rounded-lg ${navLink("/dashboard")}`}
              >
                Dashboard
              </Link>

              <Link
                to="/upload"
                onClick={closeMenu}
                className={`px-3 py-3 rounded-lg ${navLink("/upload")}`}
              >
                Upload
              </Link>

              <Link
                to="/uploads"
                onClick={closeMenu}
                className={`px-3 py-3 rounded-lg ${navLink("/uploads")}`}
              >
                My Uploads
              </Link>

              <Link
                to="/reports"
                onClick={closeMenu}
                className={`px-3 py-3 rounded-lg ${navLink("/reports")}`}
              >
                Reports
              </Link>

              <div className="border-t border-gray-100 my-2" />

              {token ? (
                <>
                  <div className="px-3 py-3 bg-blue-50 rounded-lg">
                    <span className="font-semibold text-gray-700 break-words">
                      👋 {user?.name || "User"}
                    </span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg transition text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className={`px-3 py-3 rounded-lg ${navLink("/login")}`}
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition text-center"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
