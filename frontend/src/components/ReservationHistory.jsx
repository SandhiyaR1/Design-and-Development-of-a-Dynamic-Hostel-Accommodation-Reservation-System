import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function ReservationHistory() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get("/reservations/history");
      setReservations(res.data.reservations);
    } catch (err) {
      console.error(err);
      alert("Failed to load reservation history");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#009FDD]">
            Reservation History
          </h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center text-white py-8">
            Loading history...
          </div>
        ) : reservations.length === 0 ? (
          <div className="text-center text-slate-400 py-8">
            No reservation history found
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.map((reservation) => (
              <div
                key={reservation.reservationId}
                className={`bg-slate-800 rounded-lg p-6 border-l-4 ${
                  reservation.status === "ACTIVE"
                    ? "border-green-500"
                    : "border-red-500"
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Reservation #{reservation.reservationId}
                    </h3>
                    <p className="text-sm text-slate-400">
                      {formatDate(reservation.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      reservation.status === "ACTIVE"
                        ? "bg-green-900 text-green-300"
                        : "bg-red-900 text-red-300"
                    }`}
                  >
                    {reservation.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-slate-400 mb-1">Hostel</div>
                    <div className="text-white font-medium">
                      {reservation.hostel}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400 mb-1">Floor</div>
                    <div className="text-white font-medium">
                      {reservation.floor === 0
                        ? "Ground"
                        : `Floor ${reservation.floor}`}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400 mb-1">Room</div>
                    <div className="text-white font-medium">
                      {reservation.roomNumber}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400 mb-1">Bed</div>
                    <div className="text-white font-medium">
                      Bed {reservation.bedNumber}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
