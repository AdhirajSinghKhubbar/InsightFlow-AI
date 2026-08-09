export default function FeatureCard({ title, description, icon }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition duration-300">
      <div className="text-5xl">{icon}</div>

      <h3 className="mt-4 text-xl font-bold">
        {title}
      </h3>

      <p className="mt-2 text-gray-600">
        {description}
      </p>
    </div>
  );
}