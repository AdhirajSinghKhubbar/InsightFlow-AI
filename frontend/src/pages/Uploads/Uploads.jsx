import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import API from "../../api/axios";

export default function Uploads() {
  const navigate = useNavigate();

  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDatasets();
  }, []);

  async function fetchDatasets() {
    try {
      const response = await API.get("/dataset/all");

      setDatasets(response.data.datasets || []);

    } catch (err) {
      console.error("Error fetching datasets:", err);

    } finally {
      setLoading(false);
    }
  }

  async function deleteDataset(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this dataset?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/dataset/${id}`);

      alert("Dataset deleted successfully");

      fetchDatasets();

    } catch (err) {
      console.error(err);

      alert("Failed to delete dataset");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">

        <h1 className="text-3xl font-bold text-blue-600">
          Loading Uploads...
        </h1>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-4xl font-bold text-blue-600 mb-8">
        📂 My Uploads
      </h1>

      {datasets.length === 0 ? (

        <div className="bg-white rounded-xl shadow-lg p-10 text-center">

          <h2 className="text-2xl font-bold">
            No Uploads Found
          </h2>

          <p className="text-gray-500 mt-3">
            Upload your first CSV file.
          </p>

        </div>

      ) : (

        <div className="space-y-6">

          {datasets.map((dataset) => (

            <div
              key={dataset._id}
              className="bg-white rounded-xl shadow-lg p-6 flex justify-between items-center"
            >

              <div>

                <h2 className="text-2xl font-bold">
                  📄 {dataset.fileName}
                </h2>

                <p className="text-gray-500 mt-2">
                  Uploaded{" "}
                  {new Date(dataset.createdAt).toLocaleString()}
                </p>

                <p className="mt-2">

                  Records{" "}

                  <span className="font-semibold">
                    {dataset.data?.length || 0}
                  </span>

                </p>

              </div>


              <div className="flex gap-3">

                <Link
                  to={`/dataset/${dataset._id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
                >
                  View
                </Link>


                <button
                  onClick={() =>
                    navigate(`/analysis/${dataset._id}`)
                  }
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
                >
                  Analyze
                </button>


                <button
                  onClick={() =>
                    deleteDataset(dataset._id)
                  }
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}