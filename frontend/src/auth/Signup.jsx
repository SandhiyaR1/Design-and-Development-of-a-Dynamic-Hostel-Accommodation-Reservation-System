import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";

export default function Signup() {
  const [regNo, setRegNo] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("MALE");
  const [role, setRole] = useState("STUDENT");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!regNo || !name || !password) {
      setError("All fields are required");
      return;
    }

    if (password.length < 3) {
      setError("Password must be at least 3 characters");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/register", {
        regNo,
        name,
        password,
        gender,
        role,
      });

      alert("Signup successful! ✅ Redirecting to login...");
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err.response?.data || err.message);
      const errorMsg =
        err.response?.data?.message || "Signup failed. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-sm bg-slate-800 p-8 rounded-xl shadow-lg"
      >
        <h1 className="text-2xl font-bold text-center text-[#009FDD] mb-2">
          Hostel Reservation System
        </h1>
        <p className="text-center text-slate-400 text-sm mb-6">Create Account</p>

        {error && (
          <p className="text-red-400 text-sm text-center mb-4 bg-red-900/20 p-3 rounded">
            {error}
          </p>
        )}

        <div className="mb-4">
          <label className="block text-slate-300 text-sm mb-1">
            Registration Number
          </label>
          <input
            type="text"
            value={regNo}
            onChange={(e) => setRegNo(e.target.value)}
            className="w-full px-3 py-2 rounded bg-slate-700 text-white outline-none focus:ring-2 focus:ring-[#009FDD]"
            placeholder="e.g., STU001"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-slate-300 text-sm mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 rounded bg-slate-700 text-white outline-none focus:ring-2 focus:ring-[#009FDD]"
            placeholder="Full name"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-slate-300 text-sm mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded bg-slate-700 text-white outline-none focus:ring-2 focus:ring-[#009FDD]"
            placeholder="Min 3 characters"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-slate-300 text-sm mb-1">Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full px-3 py-2 rounded bg-slate-700 text-white outline-none focus:ring-2 focus:ring-[#009FDD]"
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-slate-300 text-sm mb-1">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-2 rounded bg-slate-700 text-white outline-none focus:ring-2 focus:ring-[#009FDD]"
          >
            <option value="STUDENT">Student</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#009FDD] hover:bg-[#0088c2] disabled:bg-slate-600 text-white py-2 rounded font-semibold transition"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <p className="text-center text-slate-400 text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-[#009FDD] hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
