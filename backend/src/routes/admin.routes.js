import express from "express";
import { requireUser } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/admin.middleware.js";
import { updateRoom } from "../controllers/admin.controller.js";
import {
  addFloor,
  deleteFloor,
  addRoom,
  deleteRoom,
  addBed,
  deleteBed,
  getHostelStructure,
  toggleRoomAC,
} from "../controllers/management.controller.js";

const router = express.Router();

// Existing room update
router.put("/rooms/:roomId", requireUser, requireAdmin, updateRoom);

// Floor management
router.post("/floors", requireUser, requireAdmin, addFloor);
router.delete("/floors/:floorId", requireUser, requireAdmin, deleteFloor);

// Room management
router.post("/rooms", requireUser, requireAdmin, addRoom);
router.delete("/rooms/:roomId", requireUser, requireAdmin, deleteRoom);
router.patch("/rooms/:roomId/toggle-ac", requireUser, requireAdmin, toggleRoomAC);

// Bed management
router.post("/beds", requireUser, requireAdmin, addBed);
router.delete("/beds/:bedId", requireUser, requireAdmin, deleteBed);

// View structure
router.get("/structure/:hostelType", requireUser, requireAdmin, getHostelStructure);

export default router;
