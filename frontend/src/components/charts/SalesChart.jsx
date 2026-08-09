import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function SalesChart({ data }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 h-[420px]">

      <h2 className="text-2xl font-bold mb-6">
        Sales Chart
      </h2>

      <ResponsiveContainer width="100%" height="85%">

        <BarChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="Name" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="Sales"
            fill="#2563eb"
          />

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
}