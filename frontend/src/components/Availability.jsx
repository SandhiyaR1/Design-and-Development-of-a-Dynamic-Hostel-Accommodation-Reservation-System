import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Availability() {
  const [hostel, setHostel] = useState("");
  const [selectedFloor, setSelectedFloor] = useState(0);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const floors = [0, 1, 2, 3]; // Ground, First, Second, Third

  useEffect(() => {
    // Get user's hostel type
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    console.log("User:", user);
    if (user.role === "STUDENT") {
      // Handle case-insensitivity for gender
      const genderUpper = user.gender?.toUpperCase() || "MALE";
      const userHostel = genderUpper === "FEMALE" ? "GIRLS" : "BOYS";
      console.log("Gender value:", user.gender, "-> Hostel:", userHostel);
      setHostel(userHostel);
    }
  }, []);

  useEffect(() => {
    if (hostel) {
      fetchRooms();
    }
  }, [hostel, selectedFloor]);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/hostels/${hostel}/floors/${selectedFloor}/rooms`
      );
      setRooms(res.data.rooms);
    } catch (err) {
      console.error(err);
      alert("Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  const handleBookBed = async (room, bed) => {
    if (bed.status === "BOOKED") {
      alert("This bed is already booked!");
      return;
    }

    if (!confirm(`Book ${getRoomTypeDisplay(room.roomType)} Room ${room.roomNumber}, Bed ${bed.bedNo}?`)) {
      return;
    }

    try {
      await api.post("/reservations", { bedId: bed.bedId });
      alert("Reservation successful! ✅");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Reservation failed");
      fetchRooms(); // Refresh to show updated availability
    }
  };

  const getRoomTypeDisplay = (type) => {
    const typeMap = {
      SINGLE: "Single",
      TWO_IN_ONE: "2-in-1",
      FOUR_IN_ONE: "4-in-1",
      EIGHT_IN_ONE: "8-in-1",
      TEN_IN_ONE: "10-in-1",
    };
    return typeMap[type] || type;
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#009FDD]">
            Available Rooms
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
        {/* Floor Selector */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-3">
            Select Floor - {hostel} Hostel
          </h2>
          <div className="flex gap-3 flex-wrap">
            {floors.map((floor) => (
              <button
                key={floor}
                onClick={() => setSelectedFloor(floor)}
                className={`px-6 py-3 rounded-lg font-semibold transition ${
                  selectedFloor === floor
                    ? "bg-[#009FDD] text-white"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                {floor === 0 ? "Ground Floor" : `Floor ${floor}`}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center text-white py-8">Loading rooms...</div>
        )}

        {/* Rooms Grid */}
        {!loading && rooms.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div
                key={room.roomNumber}
                className="bg-slate-800 rounded-lg p-6 border border-slate-700"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Room {room.roomNumber}
                    </h3>
                    <p className="text-slate-400 text-sm">
                      {getRoomTypeDisplay(room.roomType)}
                      {room.ac && " • AC"}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-400">
                      {room.beds.filter((b) => b.status === "AVAILABLE").length}{" "}
                      / {room.beds.length}
                    </div>
                    <div className="text-xs text-slate-500">available</div>
                  </div>
                </div>

                {/* Beds Grid */}
                <div className="grid grid-cols-2 gap-2">
                  {room.beds.map((bed) => (
                    <button
                      key={bed.bedNo}
                      onClick={() => handleBookBed(room, bed)}
                      disabled={bed.status === "BOOKED"}
                      className={`py-3 px-4 rounded-lg font-medium transition ${
                        bed.status === "AVAILABLE"
                          ? "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                          : "bg-slate-700 text-slate-500 cursor-not-allowed"
                      }`}
                    >
                      Bed {bed.bedNo}
                      <div className="text-xs mt-1">
                        {bed.status === "AVAILABLE" ? "Available" : "Booked"}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && rooms.length === 0 && (
          <div className="text-center text-slate-400 py-8">
            No rooms available on this floor
          </div>
        )}
      </div>
    </div>
  );
}
