import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";

export default function Login() {
  const [regNo, setRegNo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", {
        regNo,
        password,
      });

      console.log("Login response:", res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      // Force navigation and page reload to ensure App component updates
      setTimeout(() => {
        navigate("/dashboard");
        window.location.reload();
      }, 100);
    } catch (err) {
      setError("Invalid register number or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-slate-800 p-8 rounded-xl shadow-lg"
      >
        <h1 className="text-2xl font-bold text-center text-[#009FDD] mb-6">
          Hostel Reservation System
        </h1>

        {error && (
          <p className="text-red-400 text-sm text-center mb-4">{error}</p>
        )}

        <div className="mb-4">
          <label className="block text-slate-300 text-sm mb-1">
            Register Number
          </label>
          <input
            type="text"
            value={regNo}
            onChange={(e) => setRegNo(e.target.value)}
            className="w-full px-3 py-2 rounded bg-slate-700 text-white outline-none focus:ring-2 focus:ring-[#009FDD]"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-slate-300 text-sm mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded bg-slate-700 text-white outline-none focus:ring-2 focus:ring-[#009FDD]"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#009FDD] hover:bg-[#0088c2] text-white py-2 rounded font-semibold transition"
        >
          Login
        </button>

        <p className="text-center text-slate-400 text-sm mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[#009FDD] hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}
