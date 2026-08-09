import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api/axios";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const { data } = await API.post("/auth/register", {
        name,
        email,
        password,
      });

      alert(data.message);

      navigate("/login");

    } catch (error) {
      alert(
        error.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center text-blue-600">
          Register
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Create your InsightFlow AI account
        </p>

        <form
          onSubmit={handleRegister}
          className="space-y-5 mt-8"
        >

          <div>
            <label>Name</label>

            <input
              type="text"
              className="w-full border rounded-xl p-3 mt-2"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label>Email</label>

            <input
              type="email"
              className="w-full border rounded-xl p-3 mt-2"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label>Password</label>

            <input
              type="password"
              className="w-full border rounded-xl p-3 mt-2"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white rounded-xl py-3 hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Registering..." : "Register"}
          </button>

        </form>

        <p className="text-center mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-semibold"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}