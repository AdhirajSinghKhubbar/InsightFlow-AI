export default function StatCard({
  title,
  value,
  color,
}) {
  return (
    <div
      className={`bg-${color}-100 rounded-xl p-6 shadow`}
    >
      <h3 className="text-gray-600">
        {title}
      </h3>

      <p className="text-3xl font-bold mt-2">
        {value}
      </p>
    </div>
  );
}