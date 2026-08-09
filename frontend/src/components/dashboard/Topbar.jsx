import { useEffect, useState } from "react";

export default function Topbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to load user:", error);
    }
  }, []);

  const userName = user?.name || "User";

  const initial = userName.charAt(0).toUpperCase();

  return (
    <header className="w-full bg-white border-b border-gray-200 px-6 py-4">

      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Dashboard
          </h2>

          <p className="text-gray-500 mt-1">
            Welcome back, {userName} 👋
          </p>
        </div>

        <div className="flex items-center gap-3">

          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-gray-800">
              {userName}
            </p>

            <p className="text-xs text-gray-500">
              Analytics User
            </p>
          </div>

          <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
            {initial}
          </div>

        </div>

      </div>

    </header>
  );
}