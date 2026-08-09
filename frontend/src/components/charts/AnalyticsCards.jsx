export default function AnalyticsCards({ stats }) {
  return (
    <div className="grid md:grid-cols-4 gap-6 mb-8">

      <Card
        title="Total Records"
        value={stats.totalRows}
        color="text-blue-600"
      />

      <Card
        title="Columns"
        value={stats.totalColumns}
        color="text-green-600"
      />

      <Card
        title="Highest Sale"
        value={`₹${stats.highestSale}`}
        color="text-purple-600"
      />

      <Card
        title="Average Sale"
        value={`₹${stats.averageSale}`}
        color="text-red-600"
      />

    </div>
  );
}

function Card({ title, value, color }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h3 className="text-gray-500">
        {title}
      </h3>

      <h1 className={`text-4xl font-bold mt-2 ${color}`}>
        {value}
      </h1>

    </div>
  );
}