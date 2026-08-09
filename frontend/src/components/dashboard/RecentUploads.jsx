import {
  detectSchema,
  formatColumnLabel,
} from "../../utils/schemaDetector";

function getColumns(data, metricKey) {
  if (!Array.isArray(data) || !data.length) {
    return [];
  }

  const schema = detectSchema(data);

  const preferred = [
    schema?.dateKey,
    schema?.categoryKey,
    metricKey,
    ...(schema?.categoricalColumns || []),
    ...(schema?.numericColumns || []),
  ].filter(Boolean);

  const keys = Object.keys(data[0] || {});

  const selected = preferred.filter(
    (key, index, array) =>
      keys.includes(key) &&
      array.indexOf(key) === index
  );

  const remaining = keys.filter(
    (key) => !selected.includes(key)
  );

  return [
    ...selected,
    ...remaining,
  ].slice(0, 6);
}

export default function RecentUploads({
  data = [],
  metricKey = null,
}) {
  const rows = Array.isArray(data)
    ? data.filter(
        (row) =>
          row &&
          typeof row === "object"
      )
    : [];

  const columns = getColumns(
    rows,
    metricKey
  );

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">
          Recent Records
        </h2>

        <span className="text-sm text-gray-500">
          Showing{" "}
          {Math.min(rows.length, 5)} of{" "}
          {rows.length}
        </span>
      </div>

      {rows.length === 0 ? (
        <p className="text-gray-500">
          No records available.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                {columns.map((column) => (
                  <th
                    key={column}
                    className="text-left p-2 whitespace-nowrap text-sm font-semibold text-gray-600"
                  >
                    {formatColumnLabel(
                      column
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows
                .slice(0, 5)
                .map((row, index) => (
                  <tr
                    key={`row-${index}`}
                    className="border-b last:border-b-0 hover:bg-gray-50"
                  >
                    {columns.map(
                      (column) => (
                        <td
                          key={`${index}-${column}`}
                          className="p-2 whitespace-nowrap"
                        >
                          {row?.[column] ??
                            "—"}
                        </td>
                      )
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}