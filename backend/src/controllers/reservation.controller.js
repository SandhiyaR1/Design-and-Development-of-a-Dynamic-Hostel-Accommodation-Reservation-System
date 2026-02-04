import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/* =====================================================
   CREATE RESERVATION (FCFS + SINGLE ACTIVE RESERVATION)
   ===================================================== */
export const createReservation = async (req, res) => {
  const { bedId } = req.body;
  const user = req.user;

  if (!bedId) {
    return res.status(400).json({ message: "bedId is required" });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1️⃣ Check if user already has an active reservation
      const existingReservation = await tx.reservation.findFirst({
        where: {
          userRegNo: user.regNo,
          status: "ACTIVE",
        },
      });

      if (existingReservation) {
        throw new Error("USER_ALREADY_HAS_RESERVATION");
      }

      // 2️⃣ Check if bed is already booked
      const bedAlreadyBooked = await tx.reservation.findFirst({
        where: {
          bedId,
          status: "ACTIVE",
        },
      });

      if (bedAlreadyBooked) {
        throw new Error("BED_ALREADY_BOOKED");
      }

      // 3️⃣ Create reservation (FCFS happens here)
      const reservation = await tx.reservation.create({
        data: {
          bedId,
          userRegNo: user.regNo,
          status: "ACTIVE",
        },
      });

      return reservation;
    });

    return res.status(201).json({
      message: "Reservation successful",
      reservationId: result.id,
    });
  } catch (error) {
    if (error.message === "USER_ALREADY_HAS_RESERVATION") {
      return res.status(409).json({
        message: "User already has an active reservation",
      });
    }

    if (error.message === "BED_ALREADY_BOOKED") {
      return res.status(409).json({
        message: "This bed is already booked",
      });
    }

    console.error(error);
    return res.status(500).json({ message: "Reservation failed" });
  }
};

/* =====================================================
   CANCEL RESERVATION (SOFT CANCEL)
   ===================================================== */
export const cancelReservation = async (req, res) => {
  const user = req.user;

  console.log("Cancel reservation attempt for user:", user.regNo);

  try {
    const reservation = await prisma.reservation.findFirst({
      where: {
        userRegNo: user.regNo,
        status: "ACTIVE",
      },
    });

    console.log("Found active reservation:", !!reservation);

    if (!reservation) {
      return res.status(404).json({
        message: "No active reservation found",
      });
    }

    console.log("Attempting to update reservation ID:", reservation.id);

    await prisma.reservation.update({
      where: { id: reservation.id },
      data: { status: "CANCELLED" },
    });

    console.log("Reservation cancelled successfully");

    return res.json({
      message: "Reservation cancelled successfully",
    });
  } catch (error) {
    console.error("Cancel reservation error:", error.message);
    console.error("Error code:", error.code);
    return res.status(500).json({ 
      message: "Cancel failed",
      error: error.message 
    });
  }
};

/* =====================================================
   RESERVATION HISTORY (AUDIT TRAIL)
   ===================================================== */
export const getReservationHistory = async (req, res) => {
  const user = req.user;

  try {
    const reservations = await prisma.reservation.findMany({
      where: {
        userRegNo: user.regNo,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        bed: {
          include: {
            room: {
              include: {
                floor: {
                  include: {
                    hostel: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return res.json({
      user: user.regNo,
      reservations: reservations.map((r) => ({
        reservationId: r.id,
        status: r.status,
        createdAt: r.createdAt,
        hostel: r.bed.room.floor.hostel.type,
        floor: r.bed.room.floor.number,
        roomNumber: r.bed.room.roomNumber,
        bedNumber: r.bed.bedNumber,
      })),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch reservation history" });
  }
};
