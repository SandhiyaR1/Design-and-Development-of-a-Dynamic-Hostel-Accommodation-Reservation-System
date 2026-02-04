import { useState, useEffect } from "react";
import api from "../api/api";

export default function Management() {
  const [activeHostel, setActiveHostel] = useState("BOYS");
  const [structure, setStructure] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form states
  const [newFloor, setNewFloor] = useState("");
  const [newRoomNumber, setNewRoomNumber] = useState("");
  const [newRoomType, setNewRoomType] = useState("SINGLE");
  const [newRoomAC, setNewRoomAC] = useState(false);
  const [newBedNumber, setNewBedNumber] = useState("");
  const [selectedFloorId, setSelectedFloorId] = useState(null);
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  useEffect(() => {
    fetchStructure();
  }, [activeHostel]);

  const fetchStructure = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/structure/${activeHostel}`);
      setStructure(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load structure");
    } finally {
      setLoading(false);
    }
  };

  // Add Floor
  const handleAddFloor = async () => {
    if (newFloor === "") {
      alert("Please enter floor number");
      return;
    }

    try {
      await api.post("/admin/floors", {
        hostelType: activeHostel,
        floorNumber: parseInt(newFloor),
      });
      alert("Floor added!");
      setNewFloor("");
      fetchStructure();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to add floor"
      );
    }
  };

  // Delete Floor
  const handleDeleteFloor = async (floorId) => {
    if (!confirm("Delete this floor? All rooms must be empty.")) return;

    try {
      await api.delete(`/admin/floors/${floorId}`);
      alert("Floor deleted!");
      fetchStructure();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to delete floor"
      );
    }
  };

  // Add Room
  const handleAddRoom = async () => {
    if (!selectedFloorId || !newRoomNumber || !newRoomType) {
      alert("Please fill all room fields");
      return;
    }

    try {
      await api.post("/admin/rooms", {
        floorId: selectedFloorId,
        roomNumber: parseInt(newRoomNumber),
        roomType: newRoomType,
        ac: newRoomAC,
      });
      alert("Room added!");
      setNewRoomNumber("");
      setNewRoomType("SINGLE");
      setNewRoomAC(false);
      setSelectedFloorId(null);
      fetchStructure();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to add room"
      );
    }
  };

  // Delete Room
  const handleDeleteRoom = async (roomId) => {
    if (!confirm("Delete this room? All beds must be empty.")) return;

    try {
      await api.delete(`/admin/rooms/${roomId}`);
      alert("Room deleted!");
      fetchStructure();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to delete room"
      );
    }
  };

  // Add Bed
  const handleAddBed = async () => {
    if (!selectedRoomId || newBedNumber === "") {
      alert("Please select room and enter bed number");
      return;
    }

    try {
      await api.post("/admin/beds", {
        roomId: selectedRoomId,
        bedNumber: parseInt(newBedNumber),
      });
      alert("Bed added!");
      setNewBedNumber("");
      setSelectedRoomId(null);
      fetchStructure();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to add bed"
      );
    }
  };

  // Delete Bed
  const handleDeleteBed = async (bedId) => {
    if (!confirm("Delete this bed?")) return;

    try {
      await api.delete(`/admin/beds/${bedId}`);
      alert("Bed deleted!");
      fetchStructure();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to delete bed"
      );
    }
  };

  // Toggle AC
  const handleToggleAC = async (roomId) => {
    try {
      const res = await api.patch(`/admin/rooms/${roomId}/toggle-ac`);
      alert(res.data.message);
      fetchStructure();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to toggle AC"
      );
    }
  };

  if (loading && !structure) {
    return <div className="text-white p-4">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Hostel Selector */}
      <div className="flex gap-3">
        <button
          onClick={() => setActiveHostel("BOYS")}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            activeHostel === "BOYS"
              ? "bg-[#009FDD] text-white"
              : "bg-slate-700 text-slate-300 hover:bg-slate-600"
          }`}
        >
          Boys Hostel
        </button>
        <button
          onClick={() => setActiveHostel("GIRLS")}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            activeHostel === "GIRLS"
              ? "bg-[#009FDD] text-white"
              : "bg-slate-700 text-slate-300 hover:bg-slate-600"
          }`}
        >
          Girls Hostel
        </button>
      </div>

      {/* Add Floor */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-4">Add Floor</h3>
        <div className="flex gap-2">
          <input
            type="number"
            value={newFloor}
            onChange={(e) => setNewFloor(e.target.value)}
            placeholder="Floor number"
            className="flex-1 px-3 py-2 bg-slate-700 text-white rounded outline-none focus:ring-2 focus:ring-[#009FDD]"
          />
          <button
            onClick={handleAddFloor}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold transition"
          >
            Add Floor
          </button>
        </div>
      </div>

      {/* Floors and Rooms */}
      <div className="space-y-4">
        {structure?.floors.map((floor) => (
          <div
            key={floor.id}
            className="bg-slate-800 rounded-lg p-6 border border-slate-700"
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-bold text-white">Floor {floor.number}</h4>
              <button
                onClick={() => handleDeleteFloor(floor.id)}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition"
              >
                Delete Floor
              </button>
            </div>

            {/* Rooms in Floor */}
            <div className="space-y-3 mb-4">
              {floor.rooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-slate-700 rounded p-4 space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white font-semibold">
                        Room {room.roomNumber}
                      </p>
                      <p className="text-slate-400 text-sm">
                        Type: {room.roomType} | AC: {room.ac ? "Yes" : "No"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleAC(room.id)}
                        className={`px-3 py-1 text-white text-sm rounded transition ${
                          room.ac
                            ? "bg-orange-600 hover:bg-orange-700"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        {room.ac ? "Remove AC" : "Add AC"}
                      </button>
                      <button
                        onClick={() => handleDeleteRoom(room.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Beds in Room */}
                  <div className="bg-slate-600 rounded p-2 text-sm text-slate-300">
                    Beds: {room.beds.map((b) => `#${b.bedNumber}`).join(", ")}
                  </div>

                  {/* Add Bed Button */}
                  {selectedRoomId === room.id && (
                    <div className="bg-slate-600 p-3 rounded space-y-2">
                      <input
                        type="number"
                        value={newBedNumber}
                        onChange={(e) => setNewBedNumber(e.target.value)}
                        placeholder="Bed number"
                        className="w-full px-2 py-1 bg-slate-700 text-white rounded outline-none focus:ring-2 focus:ring-[#009FDD] text-sm"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleAddBed}
                          className="flex-1 px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition"
                        >
                          Add Bed
                        </button>
                        <button
                          onClick={() => setSelectedRoomId(null)}
                          className="flex-1 px-2 py-1 bg-slate-500 hover:bg-slate-600 text-white text-sm rounded transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedRoomId !== room.id && (
                    <button
                      onClick={() => setSelectedRoomId(room.id)}
                      className="w-full px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition"
                    >
                      Add Bed to This Room
                    </button>
                  )}

                  {/* Delete Bed Buttons */}
                  {room.beds.length > 0 && (
                    <div className="grid grid-cols-2 gap-1">
                      {room.beds.map((bed) => (
                        <button
                          key={bed.id}
                          onClick={() => handleDeleteBed(bed.id)}
                          className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded transition"
                        >
                          Remove Bed #{bed.bedNumber}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add Room to Floor */}
            {selectedFloorId === floor.id ? (
              <div className="bg-slate-700 rounded p-4 space-y-3">
                <h5 className="text-white font-semibold">Add New Room</h5>
                <input
                  type="number"
                  value={newRoomNumber}
                  onChange={(e) => setNewRoomNumber(e.target.value)}
                  placeholder="Room number"
                  className="w-full px-3 py-2 bg-slate-600 text-white rounded outline-none focus:ring-2 focus:ring-[#009FDD]"
                />
                <select
                  value={newRoomType}
                  onChange={(e) => setNewRoomType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-600 text-white rounded outline-none focus:ring-2 focus:ring-[#009FDD]"
                >
                  <option value="SINGLE">Single</option>
                  <option value="TWO_IN_ONE">2-in-1</option>
                  <option value="FOUR_IN_ONE">4-in-1</option>
                  <option value="EIGHT_IN_ONE">8-in-1</option>
                  <option value="TEN_IN_ONE">10-in-1</option>
                </select>
                <label className="flex items-center gap-2 text-slate-300">
                  <input
                    type="checkbox"
                    checked={newRoomAC}
                    onChange={(e) => setNewRoomAC(e.target.checked)}
                  />
                  AC Room
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddRoom}
                    className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold transition"
                  >
                    Add Room
                  </button>
                  <button
                    onClick={() => setSelectedFloorId(null)}
                    className="flex-1 px-3 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded font-semibold transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setSelectedFloorId(floor.id)}
                className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition"
              >
                Add Room to Floor {floor.number}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
