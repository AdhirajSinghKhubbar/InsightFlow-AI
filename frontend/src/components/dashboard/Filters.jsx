import {
  detectSchema,
  formatColumnLabel,
} from "../../utils/schemaDetector";

export default function Filters({
  data = [],
  filters = {},
  onChange,
}) {
  if (!Array.isArray(data) || !data.length) {
    return null;
  }

  const schema = detectSchema(data);

  const filterableKeys = [
    ...(schema.dateKey
      ? [schema.dateKey]
      : []),
    ...(schema.categoricalColumns || []),
  ].filter(
    (key, index, array) =>
      array.indexOf(key) === index
  );

  if (!filterableKeys.length) {
    return (
      <div className="bg-white rounded-xl shadow p-4 sm:p-5 lg:p-6 w-full">

        <h2 className="text-lg sm:text-xl font-bold mb-4">
          Filters
        </h2>

        <p className="text-gray-500 text-sm">
          No filterable columns available.
        </p>

      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-4 sm:p-5 lg:p-6 w-full">

      {/* Header */}

      <div className="flex items-center justify-between gap-3 mb-5">

        <h2 className="text-lg sm:text-xl font-bold">
          Filters
        </h2>

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
            className="text-blue-600 text-sm font-semibold hover:underline whitespace-nowrap"
          >
            Clear
          </button>
        )}

      </div>

      <div className="space-y-4">

        {filterableKeys
          .slice(0, 4)
          .map((key) => {
            const isDate =
              key === schema.dateKey;

            const values = [
              ...new Set(
                data
                  .map(
                    (row) =>
                      row?.[key]
                  )
                  .filter(
                    (value) =>
                      value !==
                        undefined &&
                      value !== null &&
                      String(
                        value
                      ).trim() !== ""
                  )
                  .map((value) =>
                    String(value)
                  )
              ),
            ].sort((a, b) =>
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

                <label className="block text-xs sm:text-sm font-semibold text-gray-600 mb-2">
                  {formatColumnLabel(
                    key
                  )}
                </label>

                {isDate ? (
                  <input
                    type="date"
                    value={
                      filters[key] || ""
                    }
                    onChange={(event) =>
                      onChange?.(
                        key,
                        event.target
                          .value
                      )
                    }
                    className="border border-gray-300 rounded-lg p-2.5 w-full text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <select
                    value={
                      filters[key] || ""
                    }
                    onChange={(event) =>
                      onChange?.(
                        key,
                        event.target
                          .value
                      )
                    }
                    className="border border-gray-300 rounded-lg p-2.5 w-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      </div>

      {/* Active Filters */}

      {Object.values(filters).some(
        Boolean
      ) && (
        <div className="mt-5 pt-4 border-t">

          <p className="text-xs text-gray-500 mb-2">
            Active filters
          </p>

          <div className="flex flex-wrap gap-2">

            {Object.entries(filters)
              .filter(
                ([, value]) =>
                  Boolean(value)
              )
              .map(
                ([key, value]) => (
                  <span
                    key={key}
                    className="inline-flex items-center max-w-full bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs"
                  >
                    <span className="truncate max-w-[120px]">
                      {formatColumnLabel(
                        key
                      )}
                      : {value}
                    </span>
                  </span>
                )
              )}

          </div>

        </div>
      )}

    </div>
  );
}
