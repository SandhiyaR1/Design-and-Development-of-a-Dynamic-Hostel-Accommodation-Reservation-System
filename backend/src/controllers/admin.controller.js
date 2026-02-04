import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const updateRoom = async (req, res) => {
  const { roomId } = req.params;
  const { roomType, ac } = req.body;

  try {
    const room = await prisma.room.findUnique({
      where: { id: parseInt(roomId, 10) },
    });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const updatedRoom = await prisma.room.update({
      where: { id: room.id },
      data: {
        roomType: roomType ?? room.roomType,
        ac: ac ?? room.ac,
      },
    });

    return res.json({
      message: "Room updated successfully",
      room: updatedRoom,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Room update failed" });
  }
};
