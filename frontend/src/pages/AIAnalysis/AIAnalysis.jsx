import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/axios";

export default function AIAnalysis() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dataset, setDataset] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchDataset();
    }
  }, [id]);

  async function fetchDataset() {
    try {
      setLoading(true);
      setError("");

      console.log("Dataset ID:", id);

      const response = await API.get(`/dataset/${id}`);

      console.log("Full Response:", response.data);

      if (response.data?.success && response.data?.dataset) {
        setDataset(response.data.dataset);
      } else if (response.data?.dataset) {
        setDataset(response.data.dataset);
      } else {
        setError("Dataset not found.");
      }
    } catch (err) {
      console.error("Failed to load dataset:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load dataset."
      );
    } finally {
      setLoading(false);
    }
  }

  async function generateAnalysis() {
    try {
      setGenerating(true);
      setError("");

      /*
        Keep this endpoint aligned with your backend.
        If your existing backend uses a different AI-analysis
        endpoint, keep that endpoint instead.
      */
      const response = await API.post(`/analysis/${id}`);

      console.log("AI Analysis Response:", response.data);

      if (response.data?.success) {
        setAnalysis(
          response.data.analysis ||
            response.data.report ||
            response.data.result
        );
      } else {
        setError(
          response.data?.message ||
            "AI analysis could not be generated."
        );
      }
    } catch (err) {
      console.error("AI analysis failed:", err);

      setError(
        err.response?.data?.message ||
          "Failed to generate AI analysis."
      );
    } finally {
      setGenerating(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🤖</div>

          <h1 className="text-2xl font-bold text-blue-600">
            Loading Dataset...
          </h1>

          <p className="text-gray-500 mt-2">
            Preparing your dataset for AI analysis.
          </p>
        </div>
      </div>
    );
  }

  if (!dataset) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-lg p-10 text-center max-w-md">
          <div className="text-5xl mb-4">⚠️</div>

          <h1 className="text-2xl font-bold text-red-600">
            Dataset Not Found
          </h1>

          <p className="text-gray-500 mt-3">
            {error || "The requested dataset could not be found."}
          </p>

          <button
            onClick={() => navigate("/uploads")}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            ← Back to Uploads
          </button>
        </div>
      </div>
    );
  }

  const rows = Array.isArray(dataset.data)
    ? dataset.data
    : [];

  const columns = Object.keys(rows[0] || {});

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>
            <h1 className="text-4xl font-bold text-blue-600">
              🤖 AI Analysis
            </h1>

            <p className="text-gray-500 mt-2">
              Analyze your uploaded dataset using AI.
            </p>
          </div>

          <button
            onClick={() => navigate("/uploads")}
            className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-3 rounded-lg font-semibold"
          >
            ← Back to Uploads
          </button>

        </div>

        {/* Dataset Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-gray-500 text-sm">
              Dataset
            </p>

            <p className="text-xl font-bold text-blue-600 mt-2 break-words">
              📄 {dataset.fileName || "Unknown Dataset"}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-gray-500 text-sm">
              Total Records
            </p>

            <p className="text-3xl font-bold text-purple-600 mt-2">
              {rows.length}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-gray-500 text-sm">
              Columns
            </p>

            <p className="text-3xl font-bold text-orange-600 mt-2">
              {columns.length}
            </p>
          </div>

        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
            {error}
          </div>
        )}

        {/* AI Analysis Card */}
        <div className="bg-white rounded-xl shadow-xl p-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                AI Business Analysis
              </h2>

              <p className="text-gray-500 mt-1">
                Generate insights and recommendations from your dataset.
              </p>
            </div>

            <button
              onClick={generateAnalysis}
              disabled={generating}
              className={`px-6 py-3 rounded-lg text-white font-semibold ${
                generating
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {generating
                ? "🤖 Generating..."
                : "✨ Generate AI Analysis"}
            </button>

          </div>

          {/* Analysis Result */}
          {analysis && (
            <div className="mt-8 border-t pt-8">

              <h3 className="text-xl font-bold text-gray-800 mb-4">
                AI Results
              </h3>

              <div className="bg-gray-50 rounded-xl p-6 whitespace-pre-wrap text-gray-700 leading-relaxed">
                {typeof analysis === "string"
                  ? analysis
                  : JSON.stringify(
                      analysis,
                      null,
                      2
                    )}
              </div>

              <div className="mt-6 flex gap-3">

                <button
                  onClick={() => navigate("/reports")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold"
                >
                  View Reports
                </button>

              </div>

            </div>
          )}

          {/* No analysis yet */}
          {!analysis && !generating && (
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">

              <div className="text-5xl mb-4">
                📊
              </div>

              <h3 className="text-xl font-bold text-gray-700">
                Ready for AI Analysis
              </h3>

              <p className="text-gray-500 mt-2">
                Click "Generate AI Analysis" to analyze your dataset.
              </p>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}