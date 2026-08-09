import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  parseNumeric,
  isDateLike,
  formatColumnLabel,
} from "../../utils/schemaDetector";

function getUsableRows(data) {
  if (!Array.isArray(data)) return [];

  return data.filter(
    (row) => row && typeof row === "object"
  );
}

function findNumericMetric(data, preferredKey = null) {
  const rows = getUsableRows(data);

  if (!rows.length) return null;

  // First try the metric passed from Dashboard
  if (preferredKey) {
    const validValues = rows.filter(
      (row) =>
        parseNumeric(row?.[preferredKey]) !== null
    );

    if (validValues.length > 0) {
      return preferredKey;
    }
  }

  // Automatically find numeric column
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

function findXAxis(
  data,
  metricKey,
  preferredKey = null
) {
  const rows = getUsableRows(data);

  if (!rows.length) return null;

  if (
    preferredKey &&
    preferredKey !== metricKey &&
    rows.some(
      (row) =>
        row?.[preferredKey] !== undefined &&
        row?.[preferredKey] !== null
    )
  ) {
    return preferredKey;
  }

  const keys = Object.keys(rows[0]);

  // Prefer dates
  const dateKey = keys.find((key) => {
    if (key === metricKey) return false;

    const values = rows
      .map((row) => row?.[key])
      .filter(
        (value) =>
          value !== undefined &&
          value !== null &&
          String(value).trim() !== ""
      );

    if (!values.length) return false;

    const dateCount = values.filter(
      (value) => isDateLike(value)
    ).length;

    return dateCount / values.length >= 0.5;
  });

  if (dateKey) return dateKey;

  // Otherwise find categorical column
  const categoryKey = keys.find((key) => {
    if (key === metricKey) return false;

    const values = rows
      .map((row) => row?.[key])
      .filter(
        (value) =>
          value !== undefined &&
          value !== null &&
          String(value).trim() !== ""
      );

    const uniqueValues = new Set(
      values.map((value) => String(value))
    ).size;

    return (
      values.length > 0 &&
      uniqueValues >= 2 &&
      uniqueValues <= 20
    );
  });

  return categoryKey || null;
}

function buildChartData(
  data,
  xKey,
  metricKey
) {
  const rows = getUsableRows(data);

  if (!metricKey) return [];

  // No X axis
  if (!xKey) {
    return rows
      .map((row, index) => {
        const value = parseNumeric(
          row?.[metricKey]
        );

        if (value === null) return null;

        return {
          label: `Record ${index + 1}`,
          value,
        };
      })
      .filter(Boolean)
      .slice(0, 30);
  }

  const grouped = new Map();

  rows.forEach((row) => {
    const rawLabel = row?.[xKey];

    if (
      rawLabel === undefined ||
      rawLabel === null ||
      String(rawLabel).trim() === ""
    ) {
      return;
    }

    const value = parseNumeric(
      row?.[metricKey]
    );

    if (value === null) return;

    const label = String(rawLabel).trim();

    if (!grouped.has(label)) {
      grouped.set(label, {
        value: 0,
        sortValue: isDateLike(label)
          ? new Date(label).getTime()
          : null,
      });
    }

    grouped.get(label).value += value;
  });

  const result = [...grouped.entries()];

  result.sort(
    ([labelA, itemA], [labelB, itemB]) => {
      if (
        itemA.sortValue !== null &&
        itemB.sortValue !== null
      ) {
        return (
          itemA.sortValue -
          itemB.sortValue
        );
      }

      return String(labelA).localeCompare(
        String(labelB),
        undefined,
        {
          numeric: true,
        }
      );
    }
  );

  return result
    .map(([label, item]) => ({
      label,
      value: item.value,
    }))
    .slice(0, 30);
}

export default function LineChartCard({
  data = [],
  metricKey = null,
  dateKey = null,
}) {
  const rows = getUsableRows(data);

  const actualMetricKey =
    findNumericMetric(rows, metricKey);

  const xKey = findXAxis(
    rows,
    actualMetricKey,
    dateKey
  );

  const chartData = buildChartData(
    rows,
    xKey,
    actualMetricKey
  );

  const metricLabel =
    formatColumnLabel(actualMetricKey) ||
    "Value";

  return (
    <div className="bg-white rounded-xl shadow p-4 sm:p-5 lg:p-6 w-full min-w-0 overflow-hidden">

      <div className="mb-4">
        <h2 className="text-lg sm:text-xl font-bold">
          {xKey
            ? `${metricLabel} Trend`
            : `${metricLabel} by Record`}
        </h2>

        {xKey && (
          <p className="text-xs sm:text-sm text-gray-500 mt-1 truncate">
            Based on {formatColumnLabel(xKey)}
          </p>
        )}
      </div>

      {chartData.length === 0 ? (
        <div className="h-[280px] sm:h-[320px] flex items-center justify-center text-gray-500 text-center px-4">
          No suitable numeric data available
          for the chart.
        </div>
      ) : (
        <div className="w-full min-w-0">
          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <LineChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: -10,
                bottom:
                  chartData.length > 8
                    ? 35
                    : 10,
              }}
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="label"
                tick={{
                  fontSize: 11,
                }}
                angle={
                  chartData.length > 8
                    ? -30
                    : 0
                }
                textAnchor={
                  chartData.length > 8
                    ? "end"
                    : "middle"
                }
                height={
                  chartData.length > 8
                    ? 60
                    : 30
                }
                interval="preserveStartEnd"
              />

              <YAxis
                tick={{
                  fontSize: 11,
                }}
                width={45}
              />

              <Tooltip
                formatter={(value) => [
                  Number(value).toLocaleString(
                    "en-IN"
                  ),
                  metricLabel,
                ]}
              />

              <Line
                type="monotone"
                dataKey="value"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
              />

            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

    </div>
  );
}
