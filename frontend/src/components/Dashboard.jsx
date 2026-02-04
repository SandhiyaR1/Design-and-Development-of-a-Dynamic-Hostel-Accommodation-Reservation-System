import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [activeReservation, setActiveReservation] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    console.log("Dashboard - User:", user);
    fetchDashboard();
    fetchActiveReservation();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/dashboard");
      setDashboardData(res.data);
    } catch (err) {
      console.error(err);
      navigate("/login");
    }
  };

  const fetchActiveReservation = async () => {
    try {
      const res = await api.get("/reservations/history");
      const active = res.data.reservations.find((r) => r.status === "ACTIVE");
      setActiveReservation(active);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelReservation = async () => {
    if (!confirm("Are you sure you want to cancel your reservation?")) return;

    try {
      await api.post("/reservations/cancel");
      alert("Reservation cancelled successfully");
      setActiveReservation(null);
      fetchActiveReservation();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel reservation");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#009FDD]">
            Hostel Reservation System
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">
            {dashboardData.message}
          </h2>
          <p className="text-slate-400">
            Hostel: {dashboardData.hostel || "Admin Access"}
          </p>
        </div>

        {/* Current Reservation Status */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            Current Reservation
          </h3>
          {activeReservation ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Hostel:</span>
                  <span className="ml-2 text-white">
                    {activeReservation.hostel}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Floor:</span>
                  <span className="ml-2 text-white">
                    {activeReservation.floor}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Room:</span>
                  <span className="ml-2 text-white">
                    {activeReservation.roomNumber}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Bed:</span>
                  <span className="ml-2 text-white">
                    {activeReservation.bedNumber}
                  </span>
                </div>
              </div>
              <button
                onClick={handleCancelReservation}
                className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition"
              >
                Cancel Reservation
              </button>
            </div>
          ) : (
            <div className="text-slate-400">
              No active reservation. Book a bed now!
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate("/availability")}
            className="bg-[#009FDD] hover:bg-[#0088c2] text-white py-4 rounded-lg font-semibold text-lg transition"
          >
            View Available Rooms
          </button>
          <button
            onClick={() => navigate("/history")}
            className="bg-slate-700 hover:bg-slate-600 text-white py-4 rounded-lg font-semibold text-lg transition"
          >
            Reservation History
          </button>
        </div>
      </div>
    </div>
  );
}
