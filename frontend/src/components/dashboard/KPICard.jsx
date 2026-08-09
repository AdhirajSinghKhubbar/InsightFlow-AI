import React from "react";

export default function KPICard({
  title,
  value,
  icon,
  color = "text-blue-600",
}) {
  return (
    <div className="bg-white rounded-xl shadow p-4 sm:p-5 lg:p-6 w-full min-w-0">

      <div className="flex justify-between items-center gap-4">

        <div className="min-w-0 flex-1">

          <p className="text-gray-500 text-xs sm:text-sm truncate">
            {title}
          </p>

          <h2
            className="text-2xl sm:text-3xl font-bold mt-2 truncate"
            title={String(value)}
          >
            {value}
          </h2>

        </div>

        <div
          className={`text-3xl sm:text-4xl flex-shrink-0 ${color}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}
