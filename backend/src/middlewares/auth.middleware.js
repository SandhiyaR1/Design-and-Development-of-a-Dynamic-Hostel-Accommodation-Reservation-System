import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const requireUser = async (req, res, next) => {
  try {
    const regNo = req.headers["x-regno"];

    if (!regNo) {
      return res.status(401).json({ message: "RegNo missing in headers" });
    }

    const user = await prisma.user.findUnique({
      where: { regNo },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid user" });
    }

    req.user = user; // attach user to request
    next();
  } catch (err) {
    return res.status(500).json({ message: "Auth middleware error" });
  }
};
