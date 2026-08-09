import { useEffect, useState } from "react";
import API from "../../api/axios";

import KPICard from "../../components/dashboard/KPICard";
import LineChartCard from "../../components/dashboard/LineChartCard";
import PieChartCard from "../../components/dashboard/PieChartCard";
import RecentUploads from "../../components/dashboard/RecentUploads";
import Filters from "../../components/dashboard/Filters";
import AIInsights from "../../components/dashboard/AIInsights";
import DatasetSelector from "../../components/dashboard/DatasetSelector";

import {
  FaChartLine,
  FaDatabase,
  FaArrowTrendUp,
  FaHashtag,
} from "react-icons/fa6";

export default function Dashboard() {
  const [datasets, setDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [loading, setLoading] = useState(true);

  // --------------------------------
  // Fetch datasets
  // --------------------------------

  useEffect(() => {
    fetchDatasets();
  }, []);

  async function fetchDatasets() {
    try {
      const response = await API.get("/dataset/all");

      console.log("Dataset Response:", response.data);

      if (response.data.success) {
        const allDatasets = response.data.datasets || [];

        setDatasets(allDatasets);

        if (allDatasets.length > 0) {
          setSelectedDataset(allDatasets[0]);
          setCsvData(allDatasets[0].data || []);
        }
      }
    } catch (error) {
      console.error("Error fetching datasets:", error);
    } finally {
      setLoading(false);
    }
  }

  // --------------------------------
  // Dataset change
  // --------------------------------

  function handleDatasetChange(id) {
    const dataset = datasets.find((d) => d._id === id);

    if (!dataset) return;

    setSelectedDataset(dataset);
    setCsvData(dataset.data || []);
  }

  // --------------------------------
  // Loading
  // --------------------------------

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-3xl font-bold text-blue-600">
          Loading Dashboard...
        </h1>
      </div>
    );
  }

  // --------------------------------
  // No dataset
  // --------------------------------

  if (!csvData || csvData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-10 rounded-xl shadow-xl text-center">
          <h1 className="text-3xl font-bold mb-4">
            No Dataset Uploaded
          </h1>

          <p className="text-gray-500">
            Please upload a CSV file first.
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------
  // Detect numeric columns
  // --------------------------------

  const columns = Object.keys(csvData[0] || {});

  const numericColumns = columns.filter((column) => {
    const values = csvData
      .map((row) => row[column])
      .filter(
        (value) =>
          value !== null &&
          value !== undefined &&
          value !== ""
      );

    if (values.length === 0) return false;

    const numericValues = values.filter((value) => {
      const cleaned = String(value)
        .replace(/,/g, "")
        .replace(/₹/g, "")
        .replace(/\$/g, "")
        .replace(/%/g, "")
        .trim();

      return cleaned !== "" && !isNaN(Number(cleaned));
    });

    return numericValues.length / values.length >= 0.6;
  });

  // --------------------------------
  // Choose the best numeric column
  // --------------------------------

  const preferredNames = [
    "sales",
    "revenue",
    "amount",
    "price",
    "profit",
    "income",
    "total",
    "value",
    "earnings",
    "cost",
  ];

  let metricColumn = numericColumns.find((column) =>
    preferredNames.includes(column.toLowerCase().trim())
  );

  // If no common business metric exists,
  // use the first numeric column.
  if (!metricColumn && numericColumns.length > 0) {
    metricColumn = numericColumns[0];
  }

  // --------------------------------
  // No numeric column
  // --------------------------------

  if (!metricColumn) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-blue-600 mb-8">
            Analytics Dashboard
          </h1>

          {datasets.length > 0 && (
            <DatasetSelector
              datasets={datasets}
              selectedId={selectedDataset?._id || ""}
              onChange={handleDatasetChange}
            />
          )}

          <div className="bg-white rounded-xl shadow-lg p-10 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-3">
              No Numeric Column Found
            </h2>

            <p className="text-gray-500">
              Your dataset does not appear to contain a numeric
              column that can be analyzed.
            </p>

            <p className="text-gray-400 mt-3">
              Available columns:
            </p>

            <div className="flex flex-wrap justify-center gap-2 mt-3">
              {columns.map((column) => (
                <span
                  key={column}
                  className="bg-gray-100 px-3 py-1 rounded-lg text-sm"
                >
                  {column}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------
  // Convert selected metric to number
  // --------------------------------

  const sales = csvData
    .map((row) => {
      const value = String(row[metricColumn] ?? "")
        .replace(/,/g, "")
        .replace(/₹/g, "")
        .replace(/\$/g, "")
        .replace(/%/g, "")
        .trim();

      return Number(value);
    })
    .filter((value) => !isNaN(value));

  // --------------------------------
  // KPI calculations
  // --------------------------------

  const totalSales = sales.reduce((a, b) => a + b, 0);

  const highestSale =
    sales.length > 0 ? Math.max(...sales) : 0;

  const averageSale =
    sales.length > 0
      ? totalSales / sales.length
      : 0;

  // --------------------------------
  // Format numbers
  // --------------------------------

  const formatNumber = (value) => {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 2,
    }).format(value);
  };

  // --------------------------------
  // Normalize data for existing charts
  //
  // This is important.
  //
  // Your existing charts expect:
  // row.Sales
  //
  // We create Sales dynamically from whatever
  // numeric column was detected.
  // --------------------------------

  const dashboardData = csvData.map((row) => {
    const value = String(row[metricColumn] ?? "")
      .replace(/,/g, "")
      .replace(/₹/g, "")
      .replace(/\$/g, "")
      .replace(/%/g, "")
      .trim();

    return {
      ...row,
      Sales: Number(value) || 0,
    };
  });

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* Header */}

      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">

          <div>
            <h1 className="text-4xl font-bold text-blue-600">
              Analytics Dashboard
            </h1>

            <p className="text-gray-500 mt-2">
              Automatically analyzing your uploaded dataset
            </p>
          </div>

        </div>

        {/* Dataset Selector */}

        {datasets.length > 0 && (
          <div className="mb-8">
            <DatasetSelector
              datasets={datasets}
              selectedId={selectedDataset?._id || ""}
              onChange={handleDatasetChange}
            />
          </div>
        )}

        {/* Dataset information */}

        <div className="bg-white rounded-xl shadow p-5 mb-8">

          <div className="flex flex-col md:flex-row md:justify-between gap-4">

            <div>
              <p className="text-sm text-gray-500">
                Current Dataset
              </p>

              <p className="text-xl font-bold">
                {selectedDataset?.fileName || "Dataset"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Detected Metric
              </p>

              <p className="text-xl font-bold text-blue-600">
                {metricColumn}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Numeric Columns
              </p>

              <p className="text-xl font-bold">
                {numericColumns.length}
              </p>
            </div>

          </div>

        </div>

        {/* KPI Cards */}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          <KPICard
            title={`Total ${metricColumn}`}
            value={formatNumber(totalSales)}
            icon={<FaChartLine />}
            color="text-green-600"
          />

          <KPICard
            title={`Highest ${metricColumn}`}
            value={formatNumber(highestSale)}
            icon={<FaArrowTrendUp />}
            color="text-blue-600"
          />

          <KPICard
            title={`Average ${metricColumn}`}
            value={formatNumber(averageSale)}
            icon={<FaChartLine />}
            color="text-purple-600"
          />

          <KPICard
            title="Records"
            value={csvData.length}
            icon={<FaDatabase />}
            color="text-orange-600"
          />

        </div>

        {/* Charts */}

        <div className="grid lg:grid-cols-2 gap-6 mb-8">

          <LineChartCard
            data={dashboardData}
          />

          <PieChartCard
            data={dashboardData}
          />

        </div>

        {/* Table & Filters */}

        <div className="grid lg:grid-cols-3 gap-6 mb-8">

          <div className="lg:col-span-2">
            <RecentUploads
              data={dashboardData}
            />
          </div>

          <Filters />

        </div>

        {/* AI Insights */}

        <AIInsights
          highestSale={highestSale}
          averageSale={averageSale}
          totalRows={csvData.length}
        />

      </div>

    </div>
  );
}