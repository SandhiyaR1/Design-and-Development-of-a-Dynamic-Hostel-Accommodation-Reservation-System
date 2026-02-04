import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log(" Seeding started...");

  // 1️⃣ Create Hostels
  const boysHostel = await prisma.hostel.create({
    data: { type: "BOYS" },
  });

  const girlsHostel = await prisma.hostel.create({
    data: { type: "GIRLS" },
  });

  const hostels = [boysHostel, girlsHostel];

  // 2️⃣ Floors → Rooms → Beds
  for (const hostel of hostels) {
    for (let floorNo = 0; floorNo <= 6; floorNo++) {
      const floor = await prisma.floor.create({
        data: {
          number: floorNo,
          hostelId: hostel.id,
        },
      });

      for (let r = 1; r <= 20; r++) {
        const roomNumber = floorNo * 100 + r;

        let roomType;
        let capacity;
        let ac = false;

        if (r <= 2) {
          roomType = "SINGLE";
          capacity = 1;
        } else if (r <= 5) {
          roomType = "TWO_IN_ONE";
          capacity = 2;
        } else if (r <= 10) {
          roomType = "FOUR_IN_ONE";
          capacity = 4;
        } else if (r <= 15) {
          roomType = "EIGHT_IN_ONE";
          capacity = 8;
          ac = true;
        } else {
          roomType = "TEN_IN_ONE";
          capacity = 10;
          ac = true;
        }

        const room = await prisma.room.create({
          data: {
            roomNumber,
            roomType,
            ac,
            floorId: floor.id,
          },
        });

        // 3️⃣ Beds
        for (let b = 1; b <= capacity; b++) {
          await prisma.bed.create({
            data: {
              bedNumber: b,
              roomId: room.id,
            },
          });
        }
      }
    }
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(" Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
