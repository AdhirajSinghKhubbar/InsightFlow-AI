import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    try {
      const response = await API.get("/reports");

      console.log("Reports Response:", response.data);

      if (response.data.success) {
        setReports(response.data.reports || []);
        setError(null);
      } else {
        setReports([]);
      }
    } catch (err) {
      console.error("Failed to fetch reports:", err);
      setError("Failed to load reports");
    } finally {
      setLoading(false);
    }
  }

  async function deleteReport(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this report?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/reports/${id}`);

      alert("Report deleted successfully");

      fetchReports();
    } catch (err) {
      console.error("Failed to delete report:", err);
      alert("Failed to delete report");
    }
  }

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <h1 className="text-3xl font-bold text-blue-600">
          Loading Reports...
        </h1>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-6xl mx-auto">

          <h1 className="text-4xl font-bold text-blue-600 mb-8">
            AI Reports
          </h1>

          <div className="bg-white rounded-xl shadow-lg p-10 text-center">

            <h2 className="text-2xl font-bold text-red-600">
              {error}
            </h2>

            <p className="text-gray-500 mt-3">
              Please check that the backend is running and try again.
            </p>

          </div>

        </div>
      </div>
    );
  }

  // =========================
  // MAIN PAGE
  // =========================

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold text-blue-600 mb-8">
          AI Reports
        </h1>

        {reports.length === 0 ? (

          <div className="bg-white rounded-xl shadow-lg p-10 text-center">

            <h2 className="text-2xl font-bold">
              No Reports Found
            </h2>

            <p className="text-gray-500 mt-3">
              Generate an AI report first.
            </p>

          </div>

        ) : (

          <div className="space-y-6">

            {reports.map((report) => (

              <div
                key={report._id}
                className="bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row md:justify-between md:items-center"
              >

                <div>

                  <h2 className="text-2xl font-bold">
                    📄{" "}
                    {report.datasetId?.fileName ||
                      "Unknown Dataset"}
                  </h2>

                  <p className="text-gray-500 mt-2">
                    Generated:{" "}
                    {new Date(
                      report.createdAt
                    ).toLocaleString()}
                  </p>

                  <p className="mt-2 text-blue-600 font-semibold">
                    {report.aiModel}
                  </p>

                </div>

                <div className="flex gap-3 mt-5 md:mt-0">

                  <Link
                    to={`/report/${report._id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
                  >
                    View
                  </Link>

                  <button
                    onClick={() =>
                      deleteReport(report._id)
                    }
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition"
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}