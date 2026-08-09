import { Routes, Route, Outlet } from "react-router-dom";

// Layout
import Navbar from "../components/layout/Navbar";

// Public pages
import Landing from "../pages/Landing/Landing";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";

// Protected pages
import Dashboard from "../pages/Dashboard/Dashboard";
import Upload from "../pages/Upload/Upload";
import Uploads from "../pages/Uploads/Uploads";
import DatasetDetails from "../pages/DatasetDetails/DatasetDetails";
import AIAnalysis from "../pages/AIAnalysis/AIAnalysis";
import Reports from "../pages/Reports/Reports";
import ReportDetails from "../pages/ReportDetails/ReportDetails";

// Protected route
import ProtectedRoute from "./ProtectedRoute";

function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* =========================
          PUBLIC ROUTES
      ========================= */}

      <Route path="/" element={<Landing />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      {/* =========================
          PROTECTED ROUTES
      ========================= */}

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/upload" element={<Upload />} />

        <Route path="/uploads" element={<Uploads />} />

        <Route path="/dataset/:id" element={<DatasetDetails />} />

        <Route path="/analysis/:id" element={<AIAnalysis />} />

        <Route path="/reports" element={<Reports />} />

        <Route path="/report/:id" element={<ReportDetails />} />
      </Route>

      {/* =========================
          404
      ========================= */}

      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-red-600">
                404
              </h1>

              <p className="text-xl text-gray-600 mt-4">
                Page not found
              </p>
            </div>
          </div>
        }
      />
    </Routes>
  );
}