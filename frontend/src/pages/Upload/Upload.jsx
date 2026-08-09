import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { DataContext } from "../../context/DataContext";

import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import axios from "axios";

import AnalyticsCards from "../../components/charts/AnalyticsCards";
import SalesChart from "../../components/charts/SalesChart";

export default function Upload() {
  const { csvData, setCsvData } = useContext(DataContext);

  const navigate = useNavigate();

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];

    if (!file) return;

    // Preview CSV in frontend
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,

      complete: (results) => {
        setCsvData(results.data);
      },
    });

    try {
      const formData = new FormData();

      formData.append("file", file);

      // Get JWT token
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5001/api/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);

      alert("CSV uploaded successfully!");

      navigate("/dashboard");
    } catch (err) {
      console.error(err);

      if (err.response) {
        alert(err.response.data.message);
      } else {
        alert("Upload failed");
      }
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
    },
    multiple: false,
  });

  const sales = csvData
    .map((row) => Number(row.Sales))
    .filter((sale) => !isNaN(sale));

  const stats = {
    totalRows: csvData.length,

    totalColumns:
      csvData.length > 0
        ? Object.keys(csvData[0]).length
        : 0,

    highestSale:
      sales.length > 0
        ? Math.max(...sales)
        : 0,

    averageSale:
      sales.length > 0
        ? (
            sales.reduce((a, b) => a + b, 0) /
            sales.length
          ).toFixed(2)
        : 0,
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-7xl mx-auto">

        {/* Back to Dashboard */}
        <button
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-2 mb-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition"
        >
          ← Back to Dashboard
        </button>

        {/* Page Title */}
        <h1 className="text-4xl font-bold mb-8">
          Upload Dataset
        </h1>

        {/* Upload Area */}
        <div
          {...getRootProps()}
          className="border-4 border-dashed border-blue-500 rounded-xl p-16 bg-white text-center cursor-pointer hover:bg-blue-50 transition"
        >
          <input {...getInputProps()} />

          <h2 className="text-2xl font-bold">
            Drag & Drop CSV Here
          </h2>

          <p className="mt-4 text-gray-500">
            or click to browse
          </p>
        </div>

        {/* Analytics */}
        {csvData.length > 0 && (
          <>
            <div className="mt-10">
              <AnalyticsCards stats={stats} />
            </div>

            <div className="mt-10">
              <SalesChart data={csvData} />
            </div>
          </>
        )}

      </div>
    </div>
  );
}