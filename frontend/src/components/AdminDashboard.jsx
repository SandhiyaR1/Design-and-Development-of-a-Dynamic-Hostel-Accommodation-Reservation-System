import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Management from "./Management";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("analytics");
  const [overview, setOverview] = useState(null);
  const [selectedHostel, setSelectedHostel] = useState("BOYS");
  const [hostelData, setHostelData] = useState(null);
  const [floorAnalytics, setFloorAnalytics] = useState([]);
  const [roomTypeAnalytics, setRoomTypeAnalytics] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOverview();
  }, []);

  useEffect(() => {
    if (selectedHostel) {
      fetchHostelData();
      fetchFloorAnalytics();
      fetchRoomTypeAnalytics();
    }
  }, [selectedHostel]);

  const fetchOverview = async () => {
    try {
      const res = await api.get("/admin/analytics/overview");
      setOverview(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHostelData = async () => {
    try {
      const res = await api.get(`/admin/analytics/hostel/${selectedHostel}`);
      setHostelData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFloorAnalytics = async () => {
    try {
      const res = await api.get(`/admin/analytics/floors/${selectedHostel}`);
      setFloorAnalytics(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRoomTypeAnalytics = async () => {
    try {
      const res = await api.get(`/admin/analytics/room-types/${selectedHostel}`);
      setRoomTypeAnalytics(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getOccupancyPercentage = (occupied, total) => {
    return total > 0 ? ((occupied / total) * 100).toFixed(1) : 0;
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#009FDD]">
            Admin Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded transition"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tab Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === "analytics"
                ? "bg-[#009FDD] text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab("management")}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === "management"
                ? "bg-[#009FDD] text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            Manage Structure
          </button>
        </div>

        {/* Management Tab */}
        {activeTab === "management" && <Management />}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <>
        {/* Overall Overview */}
        {overview && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Overall Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800 rounded-lg p-6">
                <div className="text-slate-400 text-sm mb-1">Total Beds</div>
                <div className="text-3xl font-bold text-white">
                  {overview.totalBeds}
                </div>
              </div>
              <div className="bg-slate-800 rounded-lg p-6">
                <div className="text-slate-400 text-sm mb-1">Occupied</div>
                <div className="text-3xl font-bold text-green-500">
                  {overview.occupiedBeds}
                </div>
              </div>
              <div className="bg-slate-800 rounded-lg p-6">
                <div className="text-slate-400 text-sm mb-1">Available</div>
                <div className="text-3xl font-bold text-blue-500">
                  {overview.availableBeds}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hostel Selector */}
        <div className="mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setSelectedHostel("BOYS")}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                selectedHostel === "BOYS"
                  ? "bg-[#009FDD] text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              Boys Hostel
            </button>
            <button
              onClick={() => setSelectedHostel("GIRLS")}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                selectedHostel === "GIRLS"
                  ? "bg-[#009FDD] text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              Girls Hostel
            </button>
          </div>
        </div>

        {/* Hostel Overview */}
        {hostelData && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              {hostelData.hostel} Hostel Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800 rounded-lg p-6">
                <div className="text-slate-400 text-sm mb-1">Total Beds</div>
                <div className="text-3xl font-bold text-white">
                  {hostelData.totalBeds}
                </div>
              </div>
              <div className="bg-slate-800 rounded-lg p-6">
                <div className="text-slate-400 text-sm mb-1">Occupied</div>
                <div className="text-3xl font-bold text-green-500">
                  {hostelData.occupiedBeds}
                </div>
                <div className="text-sm text-slate-400 mt-1">
                  {getOccupancyPercentage(
                    hostelData.occupiedBeds,
                    hostelData.totalBeds
                  )}
                  % occupancy
                </div>
              </div>
              <div className="bg-slate-800 rounded-lg p-6">
                <div className="text-slate-400 text-sm mb-1">Available</div>
                <div className="text-3xl font-bold text-blue-500">
                  {hostelData.availableBeds}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Floor Analytics */}
        {floorAnalytics.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Floor-wise Analytics
            </h2>
            <div className="bg-slate-800 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">
                      Floor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">
                      Total Beds
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">
                      Occupied
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">
                      Available
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">
                      Occupancy %
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {floorAnalytics.map((floor) => (
                    <tr key={floor.floor}>
                      <td className="px-6 py-4 text-white">
                        Floor {floor.floor}
                      </td>
                      <td className="px-6 py-4 text-white">
                        {floor.totalBeds}
                      </td>
                      <td className="px-6 py-4 text-green-500">
                        {floor.occupiedBeds}
                      </td>
                      <td className="px-6 py-4 text-blue-500">
                        {floor.availableBeds}
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        {getOccupancyPercentage(
                          floor.occupiedBeds,
                          floor.totalBeds
                        )}
                        %
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Room Type Analytics */}
        {roomTypeAnalytics.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Room Type Analytics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {roomTypeAnalytics.map((roomType) => (
                <div
                  key={roomType.roomType}
                  className="bg-slate-800 rounded-lg p-6"
                >
                  <h3 className="text-lg font-semibold text-white mb-3">
                    {roomType.roomType.replace(/_/g, " ")}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total:</span>
                      <span className="text-white">{roomType.totalBeds}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Occupied:</span>
                      <span className="text-green-500">
                        {roomType.occupiedBeds}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Available:</span>
                      <span className="text-blue-500">
                        {roomType.availableBeds}
                      </span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-700">
                      <div className="text-sm text-slate-400">
                        Occupancy:{" "}
                        {getOccupancyPercentage(
                          roomType.occupiedBeds,
                          roomType.totalBeds
                        )}
                        %
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        </>
        )}
      </div>
    </div>
  );
}
