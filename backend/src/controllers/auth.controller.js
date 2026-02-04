import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

/* ======================
   REGISTER
   ====================== */
export const register = async (req, res) => {
  try {
    const { regNo, name, password, gender, role } = req.body;

    console.log("Register attempt:", { regNo, name, gender, role });

    if (!regNo || !name || !password || !gender || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { regNo },
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    console.log("Password hashed for:", regNo, "Hash:", passwordHash);

    const user = await prisma.user.create({
      data: {
        regNo,
        name,
        passwordHash,
        gender,
        role,
      },
    });

    console.log("User created:", { regNo, name, role, gender });

    return res.status(201).json({
      message: "User registered successfully",
      regNo: user.regNo,
      role: user.role,
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ======================
   LOGIN
   ====================== */
export const login = async (req, res) => {
  try {
    const { regNo, password } = req.body;

    console.log("Login attempt:", { regNo });

    if (!regNo || !password) {
      return res.status(400).json({ message: "RegNo and password required" });
    }

    const user = await prisma.user.findUnique({
      where: { regNo },
    });

    console.log("User found:", !!user, "Has passwordHash:", !!user?.passwordHash);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    console.log("Password comparison result:", isValid);

    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.status(200).json({
      message: "Login successful",
      user: {
        regNo: user.regNo,
        name: user.name,
        role: user.role,
        gender: user.gender,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
