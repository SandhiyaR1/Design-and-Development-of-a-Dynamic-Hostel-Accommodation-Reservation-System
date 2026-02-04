 import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/* =====================================================
   A1️⃣ OVERVIEW (ALL HOSTELS)
   ===================================================== */
export const getOverview = async (req, res) => {
  try {
    const totalBeds = await prisma.bed.count();

    const occupiedBeds = await prisma.reservation.count({
      where: { status: "ACTIVE" },
    });

    return res.json({
      totalBeds,
      occupiedBeds,
      availableBeds: totalBeds - occupiedBeds,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Analytics failed" });
  }
};

/* =====================================================
   A2️⃣ HOSTEL OVERVIEW (BOYS / GIRLS)
   ===================================================== */
export const getHostelOverview = async (req, res) => {
  const { type } = req.params;

  try {
    const beds = await prisma.bed.findMany({
      where: {
        room: {
          floor: {
            hostel: { type },
          },
        },
      },
      select: { id: true },
    });

    const bedIds = beds.map((b) => b.id);

    const occupiedBeds = await prisma.reservation.count({
      where: {
        bedId: { in: bedIds },
        status: "ACTIVE",
      },
    });

    return res.json({
      hostel: type,
      totalBeds: bedIds.length,
      occupiedBeds,
      availableBeds: bedIds.length - occupiedBeds,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Hostel analytics failed" });
  }
};

/* =====================================================
   A3️⃣ FLOOR-WISE OCCUPANCY
   ===================================================== */
export const getFloorAnalytics = async (req, res) => {
  const { type } = req.params;

  try {
    const floors = await prisma.floor.findMany({
      where: { hostel: { type } },
      include: {
        rooms: {
          include: {
            beds: {
              include: {
                reservations: {
                  where: { status: "ACTIVE" },
                },
              },
            },
          },
        },
      },
      orderBy: { number: "asc" },
    });

    const result = floors.map((floor) => {
      let totalBeds = 0;
      let occupiedBeds = 0;

      floor.rooms.forEach((room) => {
        totalBeds += room.beds.length;
        room.beds.forEach((bed) => {
          if (bed.reservations.length > 0) {
            occupiedBeds++;
          }
        });
      });

      return {
        floor: floor.number,
        totalBeds,
        occupiedBeds,
        availableBeds: totalBeds - occupiedBeds,
      };
    });

    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Floor analytics failed" });
  }
};

/* =====================================================
   A4️⃣ ROOM TYPE ANALYTICS
   ===================================================== */
export const getRoomTypeAnalytics = async (req, res) => {
  const { type } = req.params;

  try {
    const rooms = await prisma.room.findMany({
      where: {
        floor: {
          hostel: { type },
        },
      },
      include: {
        beds: {
          include: {
            reservations: {
              where: { status: "ACTIVE" },
            },
          },
        },
      },
    });

    const stats = {};

    rooms.forEach((room) => {
      if (!stats[room.roomType]) {
        stats[room.roomType] = { totalBeds: 0, occupiedBeds: 0 };
      }

      stats[room.roomType].totalBeds += room.beds.length;
      room.beds.forEach((bed) => {
        if (bed.reservations.length > 0) {
          stats[room.roomType].occupiedBeds++;
        }
      });
    });

    return res.json(stats);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Room-type analytics failed" });
  }
};
