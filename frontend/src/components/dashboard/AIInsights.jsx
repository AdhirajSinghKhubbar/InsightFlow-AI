export default function AIInsights({
  highestSale,
  averageSale,
  totalRows,
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-xl font-bold mb-4">
        AI Insights
      </h2>

      <ul className="space-y-3 text-gray-700">

        <li>
          📈 Highest Sale :
          <strong> ₹{highestSale}</strong>
        </li>

        <li>
          💰 Average Sale :
          <strong> ₹{averageSale}</strong>
        </li>

        <li>
          📄 Total Records :
          <strong> {totalRows}</strong>
        </li>

        <li>
          🤖 Dataset uploaded successfully.
        </li>

      </ul>

    </div>
  );
}