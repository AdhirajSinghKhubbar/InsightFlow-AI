import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../../api/axios";

export default function DatasetDetails() {
  const { id } = useParams();

  const [dataset, setDataset] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDataset();
  }, [id]);

  async function fetchDataset() {
    try {
      const { data } = await API.get(`/dataset/${id}`);

      setDataset(data.dataset);
    } catch (err) {
      console.error("Failed to load dataset:", err);
    } finally {
      setLoading(false);
    }
  }

  // ================================
  // Loading
  // ================================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-3xl font-bold text-blue-600">
          Loading Dataset...
        </h1>
      </div>
    );
  }

  // ================================
  // Dataset Not Found
  // ================================
  if (!dataset) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-xl shadow-lg p-10 text-center">
          <h1 className="text-3xl font-bold text-red-600">
            Dataset Not Found
          </h1>

          <Link
            to="/uploads"
            className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            ← Back to Uploads
          </Link>
        </div>
      </div>
    );
  }

  const columns = Object.keys(dataset.data?.[0] || {});

  // ================================
  // Main UI
  // ================================
  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-[1400px] mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">

          <div>
            <h1 className="text-4xl font-bold">
              📄 {dataset.fileName}
            </h1>

            <p className="text-gray-500 mt-2">
              Uploaded on{" "}
              {new Date(dataset.createdAt).toLocaleString()}
            </p>

            <p className="mt-2">
              Total Records:
              <span className="font-bold ml-2">
                {dataset.data.length}
              </span>
            </p>
          </div>

          <Link
            to="/uploads"
            className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
          >
            ← Back
          </Link>

        </div>

        {/* Dataset Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-x-auto">

          <table className="min-w-full">

            <thead className="bg-blue-600 text-white">

              <tr>
                {columns.map((column) => (
                  <th
                    key={column}
                    className="px-6 py-4 text-left"
                  >
                    {column}
                  </th>
                ))}
              </tr>

            </thead>

            <tbody>

              {dataset.data.map((row, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-100"
                >
                  {columns.map((column) => (
                    <td
                      key={column}
                      className="px-6 py-4"
                    >
                      {row[column]}
                    </td>
                  ))}
                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}