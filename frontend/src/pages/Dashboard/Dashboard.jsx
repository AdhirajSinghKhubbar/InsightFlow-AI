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
} from "react-icons/fa6";

export default function Dashboard() {
  const [datasets, setDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filters, setFilters] = useState({});

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

    // Reset filters when dataset changes
    setFilters({});
  }

  // --------------------------------
  // Filter change
  // --------------------------------

  function handleFilterChange(key, value) {
    if (key === "__reset__") {
      setFilters({});
      return;
    }

    setFilters((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  // --------------------------------
  // Loading
  // --------------------------------

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-600">
            Loading Dashboard...
          </h1>
        </div>
      </div>
    );
  }

  // --------------------------------
  // No dataset
  // --------------------------------

  if (!csvData || csvData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
        <div className="bg-white w-full max-w-lg p-6 sm:p-10 rounded-xl shadow-xl text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">
            No Dataset Uploaded
          </h1>

          <p className="text-gray-500 text-sm sm:text-base">
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
  // Choose best numeric column
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
    preferredNames.includes(
      column.toLowerCase().trim()
    )
  );

  if (!metricColumn && numericColumns.length > 0) {
    metricColumn = numericColumns[0];
  }

  // --------------------------------
  // No numeric column
  // --------------------------------

  if (!metricColumn) {
    return (
      <div className="min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto">

          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600">
              Analytics Dashboard
            </h1>
          </div>

          {datasets.length > 0 && (
            <div className="mb-6 sm:mb-8">
              <DatasetSelector
                datasets={datasets}
                selectedId={selectedDataset?._id || ""}
                onChange={handleDatasetChange}
              />
            </div>
          )}

          <div className="bg-white rounded-xl shadow-lg p-5 sm:p-8 lg:p-10 text-center">

            <h2 className="text-xl sm:text-2xl font-bold text-red-600 mb-3">
              No Numeric Column Found
            </h2>

            <p className="text-gray-500 text-sm sm:text-base">
              Your dataset does not appear to contain a numeric
              column that can be analyzed.
            </p>

            <p className="text-gray-400 mt-4">
              Available columns:
            </p>

            <div className="flex flex-wrap justify-center gap-2 mt-3">
              {columns.map((column) => (
                <span
                  key={column}
                  className="bg-gray-100 px-3 py-1 rounded-lg text-sm break-all"
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
  // APPLY FILTERS
  // --------------------------------

  const filteredData = csvData.filter((row) => {
    return Object.entries(filters).every(
      ([key, selectedValue]) => {
        if (!selectedValue) return true;

        const rowValue = row?.[key];

        if (
          rowValue === undefined ||
          rowValue === null
        ) {
          return false;
        }

        return (
          String(rowValue).trim() ===
          String(selectedValue).trim()
        );
      }
    );
  });

  // --------------------------------
  // Convert selected metric to number
  // --------------------------------

  const sales = filteredData
    .map((row) => {
      const value = String(
        row[metricColumn] ?? ""
      )
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

  const totalSales = sales.reduce(
    (a, b) => a + b,
    0
  );

  const highestSale =
    sales.length > 0
      ? Math.max(...sales)
      : 0;

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
  // Normalize data for charts
  // --------------------------------

  const dashboardData = filteredData.map((row) => {
    const value = String(
      row[metricColumn] ?? ""
    )
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
    <div className="min-h-screen bg-gray-100 px-3 sm:px-5 md:px-6 lg:px-8 py-5 sm:py-6 lg:py-8">

      <div className="max-w-7xl mx-auto w-full">

        {/* Header */}

        <div className="mb-6 sm:mb-8">

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600 leading-tight">
            Analytics Dashboard
          </h1>

          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            Automatically analyzing your uploaded dataset
          </p>

        </div>

        {/* Dataset Selector */}

        {datasets.length > 0 && (
          <div className="mb-5 sm:mb-8">
            <DatasetSelector
              datasets={datasets}
              selectedId={selectedDataset?._id || ""}
              onChange={handleDatasetChange}
            />
          </div>
        )}

        {/* Dataset Information */}

        <div className="bg-white rounded-xl shadow p-4 sm:p-5 mb-5 sm:mb-8">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-500">
                Current Dataset
              </p>

              <p
                className="text-base sm:text-lg lg:text-xl font-bold truncate"
                title={
                  selectedDataset?.fileName ||
                  "Dataset"
                }
              >
                {selectedDataset?.fileName ||
                  "Dataset"}
              </p>
            </div>

            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-500">
                Detected Metric
              </p>

              <p
                className="text-base sm:text-lg lg:text-xl font-bold text-blue-600 truncate"
                title={metricColumn}
              >
                {metricColumn}
              </p>
            </div>

            <div>
              <p className="text-xs sm:text-sm text-gray-500">
                Numeric Columns
              </p>

              <p className="text-base sm:text-lg lg:text-xl font-bold">
                {numericColumns.length}
              </p>
            </div>

          </div>

        </div>

        {/* FILTERS */}

        <div className="bg-white rounded-xl shadow p-4 sm:p-5 mb-5 sm:mb-8">

          <Filters
            data={csvData}
            filters={filters}
            onChange={handleFilterChange}
          />

        </div>

        {/* Filter result information */}

        {Object.values(filters).some(Boolean) && (
          <div className="mb-5 sm:mb-8 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

              <p className="text-sm text-blue-700">
                Showing{" "}
                <span className="font-bold">
                  {filteredData.length}
                </span>{" "}
                of{" "}
                <span className="font-bold">
                  {csvData.length}
                </span>{" "}
                records
              </p>

              <button
                type="button"
                onClick={() => setFilters({})}
                className="text-sm font-semibold text-blue-600 hover:text-blue-800 self-start sm:self-auto"
              >
                Clear all filters
              </button>

            </div>

          </div>
        )}

        {/* KPI Cards */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-5 sm:mb-8">

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
            value={filteredData.length}
            icon={<FaDatabase />}
            color="text-orange-600"
          />

        </div>

        {/* Charts */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 mb-5 sm:mb-8">

          <div className="min-w-0">
            <LineChartCard
              data={dashboardData}
              metricKey="Sales"
            />
          </div>

          <div className="min-w-0">
            <PieChartCard
              data={dashboardData}
              metricKey="Sales"
            />
          </div>

        </div>

        {/* Table & Filters */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-5 sm:mb-8">

          <div className="lg:col-span-2 min-w-0">
            <RecentUploads
              data={dashboardData}
              metricKey="Sales"
            />
          </div>

          <div className="min-w-0">
            {/* Extra filter space intentionally left out */}
          </div>

        </div>

        {/* AI Insights */}

        <div className="w-full min-w-0">

          <AIInsights
            highestSale={highestSale}
            averageSale={averageSale}
            totalRows={filteredData.length}
          />

        </div>

      </div>

    </div>
  );
}
