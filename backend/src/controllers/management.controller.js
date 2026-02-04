import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/* =====================================================
   FLOOR MANAGEMENT
   ===================================================== */

// Add Floor
export const addFloor = async (req, res) => {
  try {
    const { hostelType, floorNumber } = req.body;

    if (!hostelType || floorNumber === undefined) {
      return res
        .status(400)
        .json({ message: "hostelType and floorNumber required" });
    }

    const hostel = await prisma.hostel.findFirst({
      where: { type: hostelType.toUpperCase() },
    });

    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }

    // Check if floor already exists
    const existingFloor = await prisma.floor.findFirst({
      where: { hostelId: hostel.id, number: floorNumber },
    });

    if (existingFloor) {
      return res.status(409).json({ message: "Floor already exists" });
    }

    const floor = await prisma.floor.create({
      data: {
        number: floorNumber,
        hostelId: hostel.id,
      },
    });

    return res.status(201).json({ message: "Floor created", floor });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to create floor" });
  }
};

// Delete Floor
export const deleteFloor = async (req, res) => {
  try {
    const { floorId } = req.params;

    const floor = await prisma.floor.findUnique({
      where: { id: parseInt(floorId) },
      include: { rooms: true },
    });

    if (!floor) {
      return res.status(404).json({ message: "Floor not found" });
    }

    if (floor.rooms.length > 0) {
      return res
        .status(409)
        .json({ message: "Cannot delete floor with existing rooms" });
    }

    await prisma.floor.delete({
      where: { id: parseInt(floorId) },
    });

    return res.json({ message: "Floor deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to delete floor" });
  }
};

/* =====================================================
   ROOM MANAGEMENT
   ===================================================== */

// Add Room
export const addRoom = async (req, res) => {
  try {
    const { floorId, roomNumber, roomType, ac } = req.body;

    if (!floorId || !roomNumber || !roomType) {
      return res
        .status(400)
        .json({ message: "floorId, roomNumber, roomType required" });
    }

    const floor = await prisma.floor.findUnique({
      where: { id: parseInt(floorId) },
    });

    if (!floor) {
      return res.status(404).json({ message: "Floor not found" });
    }

    // Check if room already exists
    const existingRoom = await prisma.room.findFirst({
      where: { floorId: parseInt(floorId), roomNumber },
    });

    if (existingRoom) {
      return res.status(409).json({ message: "Room already exists on floor" });
    }

    const room = await prisma.room.create({
      data: {
        roomNumber,
        roomType: roomType.toUpperCase(),
        ac: ac || false,
        floorId: parseInt(floorId),
      },
    });

    return res.status(201).json({ message: "Room created", room });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to create room" });
  }
};

// Delete Room
export const deleteRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await prisma.room.findUnique({
      where: { id: parseInt(roomId) },
      include: { beds: true },
    });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (room.beds.length > 0) {
      return res
        .status(409)
        .json({ message: "Cannot delete room with existing beds" });
    }

    await prisma.room.delete({
      where: { id: parseInt(roomId) },
    });

    return res.json({ message: "Room deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to delete room" });
  }
};

// Toggle AC Status
export const toggleRoomAC = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await prisma.room.findUnique({
      where: { id: parseInt(roomId) },
    });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const updatedRoom = await prisma.room.update({
      where: { id: parseInt(roomId) },
      data: { ac: !room.ac },
    });

    return res.json({
      message: `AC ${updatedRoom.ac ? "enabled" : "disabled"} successfully`,
      room: updatedRoom,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to toggle AC" });
  }
};

/* =====================================================
   BED MANAGEMENT
   ===================================================== */

// Add Bed
export const addBed = async (req, res) => {
  try {
    const { roomId, bedNumber } = req.body;

    if (!roomId || bedNumber === undefined) {
      return res.status(400).json({ message: "roomId and bedNumber required" });
    }

    const room = await prisma.room.findUnique({
      where: { id: parseInt(roomId) },
    });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Check if bed already exists
    const existingBed = await prisma.bed.findFirst({
      where: { roomId: parseInt(roomId), bedNumber },
    });

    if (existingBed) {
      return res.status(409).json({ message: "Bed already exists in room" });
    }

    const bed = await prisma.bed.create({
      data: {
        bedNumber,
        roomId: parseInt(roomId),
      },
    });

    return res.status(201).json({ message: "Bed created", bed });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to create bed" });
  }
};

// Delete Bed
export const deleteBed = async (req, res) => {
  try {
    const { bedId } = req.params;

    const bed = await prisma.bed.findUnique({
      where: { id: parseInt(bedId) },
      include: { reservations: true },
    });

    if (!bed) {
      return res.status(404).json({ message: "Bed not found" });
    }

    // Check for active reservations
    const activeReservations = bed.reservations.filter(
      (r) => r.status === "ACTIVE"
    );
    if (activeReservations.length > 0) {
      return res
        .status(409)
        .json({
          message: "Cannot delete bed with active reservations",
        });
    }

    await prisma.bed.delete({
      where: { id: parseInt(bedId) },
    });

    return res.json({ message: "Bed deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to delete bed" });
  }
};

/* =====================================================
   VIEW STRUCTURE (For Management UI)
   ===================================================== */

export const getHostelStructure = async (req, res) => {
  try {
    const { hostelType } = req.params;

    const hostel = await prisma.hostel.findFirst({
      where: { type: hostelType.toUpperCase() },
      include: {
        floors: {
          include: {
            rooms: {
              include: { beds: true },
            },
          },
          orderBy: { number: "asc" },
        },
      },
    });

    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }

    return res.json(hostel);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch structure" });
  }
};
