import {
  detectSchema,
  formatColumnLabel,
} from "../../utils/schemaDetector";

export default function Filters({
  data = [],
  filters = {},
  onChange,
}) {
  if (!data.length) {
    return null;
  }

  const schema = detectSchema(data);

  const filterableKeys = [
    ...(schema.dateKey
      ? [schema.dateKey]
      : []),
    ...schema.categoricalColumns,
  ].filter(
    (key, index, array) =>
      array.indexOf(key) === index
  );

  if (!filterableKeys.length) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">
          Filters
        </h2>

        <p className="text-gray-500">
          No filterable columns available.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-xl font-bold mb-4">
        Filters
      </h2>

      <div className="space-y-4">

        {filterableKeys
          .slice(0, 4)
          .map((key) => {
            const isDate =
              key === schema.dateKey;

            const values = [
              ...new Set(
                data
                  .map((row) => row?.[key])
                  .filter(
                    (value) =>
                      value !==
                        undefined &&
                      value !== null &&
                      String(value).trim() !==
                        ""
                  )
                  .map((value) =>
                    String(value)
                  )
              ),
            ].sort(
              (a, b) =>
                a.localeCompare(
                  b,
                  undefined,
                  {
                    numeric: true,
                  }
                )
            );

            return (
              <div key={key}>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  {formatColumnLabel(key)}
                </label>

                {isDate ? (
                  <input
                    type="date"
                    value={filters[key] || ""}
                    onChange={(event) =>
                      onChange?.(
                        key,
                        event.target.value
                      )
                    }
                    className="border rounded-lg p-2 w-full"
                  />
                ) : (
                  <select
                    value={filters[key] || ""}
                    onChange={(event) =>
                      onChange?.(
                        key,
                        event.target.value
                      )
                    }
                    className="border rounded-lg p-2 w-full bg-white"
                  >
                    <option value="">
                      All
                    </option>

                    {values.map(
                      (value) => (
                        <option
                          key={value}
                          value={value}
                        >
                          {value}
                        </option>
                      )
                    )}
                  </select>
                )}
              </div>
            );
          })}

        {Object.values(filters).some(
          Boolean
        ) && (
          <button
            type="button"
            onClick={() =>
              onChange?.(
                "__reset__",
                ""
              )
            }
            className="text-blue-600 font-semibold hover:underline"
          >
            Clear filters
          </button>
        )}

      </div>
    </div>
  );
}