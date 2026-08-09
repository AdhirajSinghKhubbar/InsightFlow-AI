import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";

import {
  parseNumeric,
  formatColumnLabel,
} from "../../utils/schemaDetector";

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#dc2626",
  "#7c3aed",
  "#0891b2",
  "#db2777",
  "#65a30d",
];

function getRows(data) {
  if (!Array.isArray(data)) return [];

  return data.filter(
    (row) => row && typeof row === "object"
  );
}

function findMetricKey(data, preferredKey) {
  const rows = getRows(data);

  if (!rows.length) return null;

  if (preferredKey) {
    const valid = rows.filter(
      (row) =>
        parseNumeric(row?.[preferredKey]) !== null
    );

    if (valid.length > 0) {
      return preferredKey;
    }
  }

  const keys = Object.keys(rows[0]);

  for (const key of keys) {
    const values = rows
      .map((row) => row?.[key])
      .filter(
        (value) =>
          value !== undefined &&
          value !== null &&
          String(value).trim() !== ""
      );

    if (!values.length) continue;

    const numericCount = values.filter(
      (value) => parseNumeric(value) !== null
    ).length;

    if (numericCount / values.length >= 0.5) {
      return key;
    }
  }

  return null;
}

function findCategoryKey(
  data,
  metricKey,
  preferredKey
) {
  const rows = getRows(data);

  if (!rows.length) return null;

  if (
    preferredKey &&
    preferredKey !== metricKey
  ) {
    const exists = rows.some(
      (row) =>
        row?.[preferredKey] !== undefined &&
        row?.[preferredKey] !== null &&
        String(row?.[preferredKey]).trim() !== ""
    );

    if (exists) return preferredKey;
  }

  const keys = Object.keys(rows[0]);

  // First look for a good categorical column
  for (const key of keys) {
    if (key === metricKey) continue;

    const values = rows
      .map((row) => row?.[key])
      .filter(
        (value) =>
          value !== undefined &&
          value !== null &&
          String(value).trim() !== ""
      );

    const unique = new Set(
      values.map((value) => String(value))
    ).size;

    if (
      values.length > 0 &&
      unique >= 2 &&
      unique <= 20
    ) {
      return key;
    }
  }

  return null;
}

function buildDistribution(
  data,
  categoryKey,
  metricKey
) {
  const rows = getRows(data);

  if (!categoryKey || !metricKey) {
    return [];
  }

  const grouped = new Map();

  rows.forEach((row) => {
    const rawName = row?.[categoryKey];

    if (
      rawName === undefined ||
      rawName === null ||
      String(rawName).trim() === ""
    ) {
      return;
    }

    const value = parseNumeric(
      row?.[metricKey]
    );

    if (value === null) return;

    const name = String(rawName).trim();

    grouped.set(
      name,
      (grouped.get(name) || 0) + value
    );
  });

  const sorted = [...grouped.entries()].sort(
    (a, b) => b[1] - a[1]
  );

  if (sorted.length > 8) {
    const top = sorted.slice(0, 7);

    const otherValue = sorted
      .slice(7)
      .reduce(
        (sum, [, value]) => sum + value,
        0
      );

    top.push(["Other", otherValue]);

    return top.map(([name, value]) => ({
      name,
      value,
    }));
  }

  return sorted.map(([name, value]) => ({
    name,
    value,
  }));
}

export default function PieChartCard({
  data = [],
  metricKey = null,
  categoryKey = null,
}) {
  const rows = getRows(data);

  const actualMetricKey = findMetricKey(
    rows,
    metricKey
  );

  const actualCategoryKey =
    findCategoryKey(
      rows,
      actualMetricKey,
      categoryKey
    );

  const chartData = buildDistribution(
    rows,
    actualCategoryKey,
    actualMetricKey
  );

  const metricLabel =
    formatColumnLabel(actualMetricKey) ||
    "Value";

  const categoryLabel =
    formatColumnLabel(actualCategoryKey) ||
    "Category";

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-6">
        {actualCategoryKey
          ? `${metricLabel} Distribution by ${categoryLabel}`
          : `${metricLabel} Distribution`}
      </h2>

      {chartData.length === 0 ? (
        <div className="h-[320px] flex items-center justify-center text-gray-500 text-center px-4">
          No suitable categorical data
          available for distribution.
        </div>
      ) : (
        <ResponsiveContainer
          width="100%"
          height={320}
        >
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              outerRadius={105}
              label={({ name, percent }) =>
                `${name} ${(
                  percent * 100
                ).toFixed(0)}%`
              }
            >
              {chartData.map(
                (entry, index) => (
                  <Cell
                    key={`${entry.name}-${index}`}
                    fill={
                      COLORS[
                        index % COLORS.length
                      ]
                    }
                  />
                )
              )}
            </Pie>

            <Tooltip
              formatter={(value) => [
                Number(value).toLocaleString(
                  "en-IN"
                ),
                metricLabel,
              ]}
            />

            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}