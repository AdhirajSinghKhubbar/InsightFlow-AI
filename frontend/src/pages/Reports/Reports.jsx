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
      <div className="min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8 py-8">
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

            <h1 className="text-xl sm:text-2xl font-bold text-blue-600">
              Loading Reports...
            </h1>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 px-3 sm:px-5 md:px-6 lg:px-8 py-5 sm:py-8">
        <div className="max-w-6xl mx-auto w-full">

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600 mb-5 sm:mb-8">
            AI Reports
          </h1>

          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 lg:p-10 text-center">

            <h2 className="text-xl sm:text-2xl font-bold text-red-600">
              {error}
            </h2>

            <p className="text-gray-500 mt-3 text-sm sm:text-base">
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
    <div className="min-h-screen bg-gray-100 px-3 sm:px-5 md:px-6 lg:px-8 py-5 sm:py-6 lg:py-8">

      <div className="max-w-6xl mx-auto w-full">

        {/* Header */}

        <div className="mb-5 sm:mb-8">

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600 leading-tight">
            AI Reports
          </h1>

          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            View and manage your generated AI reports
          </p>

        </div>

        {/* No Reports */}

        {reports.length === 0 ? (

          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 lg:p-10 text-center">

            <div className="text-4xl sm:text-5xl mb-4">
              📊
            </div>

            <h2 className="text-xl sm:text-2xl font-bold">
              No Reports Found
            </h2>

            <p className="text-gray-500 mt-3 text-sm sm:text-base">
              Generate an AI report first.
            </p>

          </div>

        ) : (

          <div className="space-y-4 sm:space-y-6">

            {reports.map((report) => (

              <div
                key={report._id}
                className="bg-white rounded-xl shadow-lg p-4 sm:p-6"
              >

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                  {/* Report Information */}

                  <div className="min-w-0 flex-1">

                    <h2
                      className="text-lg sm:text-xl lg:text-2xl font-bold break-words"
                      title={
                        report.datasetId?.fileName ||
                        "Unknown Dataset"
                      }
                    >
                      📄{" "}
                      {report.datasetId?.fileName ||
                        "Unknown Dataset"}
                    </h2>

                    <p className="text-gray-500 mt-2 text-xs sm:text-sm break-words">
                      Generated:{" "}
                      {report.createdAt
                        ? new Date(
                            report.createdAt
                          ).toLocaleString()
                        : "Unknown date"}
                    </p>

                    <p className="mt-2 text-blue-600 font-semibold text-sm sm:text-base break-words">
                      {report.aiModel || "AI Model"}
                    </p>

                  </div>

                  {/* Buttons */}

                  <div className="flex flex-col xs:flex-row sm:flex-row gap-2 sm:gap-3 w-full lg:w-auto">

                    <Link
                      to={`/report/${report._id}`}
                      className="w-full sm:w-auto text-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition text-sm sm:text-base font-medium"
                    >
                      View
                    </Link>

                    <button
                      onClick={() =>
                        deleteReport(report._id)
                      }
                      className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg transition text-sm sm:text-base font-medium"
                    >
                      Delete
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}
