import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getRoomsByFloor = async (req, res) => {
  try {
    const { hostelType, floorNumber } = req.params;
    const user = req.user;

    // 🔐 Safety check
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const hostelTypeUpper = hostelType.toUpperCase();

    // 🔐 Authorization (ABAC – System Design Level)
    if (user.role === "STUDENT") {
      const allowedHostel =
        user.gender === "FEMALE" ? "GIRLS" : "BOYS";

      if (allowedHostel !== hostelTypeUpper) {
        return res.status(403).json({
          message: "You are not allowed to access this hostel",
        });
      }
    }

    // 🏢 Find hostel
    const hostel = await prisma.hostel.findFirst({
      where: { type: hostelTypeUpper },
    });

    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }

    // 🏬 Find floor with rooms and beds (single optimized query)
    const floor = await prisma.floor.findFirst({
      where: {
        hostelId: hostel.id,
        number: parseInt(floorNumber, 10),
      },
      include: {
        rooms: {
          orderBy: { roomNumber: "asc" },
          include: {
            beds: {
              include: {
                reservations: {
                  where: { status: "ACTIVE" },
                  select: { id: true },
                },
              },
            },
          },
        },
      },
    });

    if (!floor) {
      return res.status(404).json({ message: "Floor not found" });
    }

    // 🎯 Build response (derive bed status dynamically)
    return res.status(200).json({
      hostel: hostelTypeUpper,
      floor: floor.number,
      rooms: floor.rooms.map((room) => ({
        roomNumber: room.roomNumber,
        roomType: room.roomType,
        ac: room.ac,
        beds: room.beds.map((bed) => ({
          bedId: bed.id,
          bedNo: bed.bedNumber,
          status: bed.reservations.length > 0 ? "BOOKED" : "AVAILABLE",
        })),
      })),
    });
  } catch (error) {
    console.error("Availability Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
