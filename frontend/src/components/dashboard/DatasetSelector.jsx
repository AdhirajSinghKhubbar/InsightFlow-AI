export default function DatasetSelector({
  datasets,
  selectedId,
  onChange,
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-5 mb-8">
      <label className="block font-semibold text-gray-700 mb-2">
        Select Dataset
      </label>

      <select
        value={selectedId}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-lg p-3"
      >
        {datasets.map((dataset) => (
          <option
            key={dataset._id}
            value={dataset._id}
          >
            {dataset.fileName}
          </option>
        ))}
      </select>
    </div>
  );
}