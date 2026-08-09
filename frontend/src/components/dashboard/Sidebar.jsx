import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");

    navigate("/login");
  }

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white p-6 flex flex-col">

      {/* Logo */}

      <div className="mb-10">
        <h1 className="text-2xl font-bold">
          InsightFlow
        </h1>

        <p className="text-gray-400 text-sm mt-1">
          AI Analytics
        </p>
      </div>

      {/* Navigation */}

      <nav className="flex flex-col gap-2">

        <Link
          to="/dashboard"
          className={`p-3 rounded-lg transition ${
            isActive("/dashboard")
              ? "bg-blue-600 text-white"
              : "text-gray-300 hover:bg-gray-800 hover:text-white"
          }`}
        >
          📊 Dashboard
        </Link>

        <Link
          to="/upload"
          className={`p-3 rounded-lg transition ${
            isActive("/upload")
              ? "bg-blue-600 text-white"
              : "text-gray-300 hover:bg-gray-800 hover:text-white"
          }`}
        >
          📂 Upload Data
        </Link>

        <Link
          to="/uploads"
          className={`p-3 rounded-lg transition ${
            isActive("/uploads")
              ? "bg-blue-600 text-white"
              : "text-gray-300 hover:bg-gray-800 hover:text-white"
          }`}
        >
          🗂️ My Uploads
        </Link>

        <Link
          to="/reports"
          className={`p-3 rounded-lg transition ${
            isActive("/reports")
              ? "bg-blue-600 text-white"
              : "text-gray-300 hover:bg-gray-800 hover:text-white"
          }`}
        >
          📄 Reports
        </Link>

      </nav>

      {/* Bottom section */}

      <div className="mt-auto pt-8 border-t border-gray-700">

        <button
          onClick={handleLogout}
          className="w-full text-left text-gray-300 hover:bg-red-600 hover:text-white p-3 rounded-lg transition"
        >
          🚪 Logout
        </button>

      </div>

    </aside>
  );
}