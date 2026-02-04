import express from "express";
import { requireUser } from "../middlewares/auth.middleware.js";
import { getRoomsByFloor } from "../controllers/availability.controller.js";

const router = express.Router();

router.get(
  "/:hostelType/floors/:floorNumber/rooms",
  requireUser,
  getRoomsByFloor
);

export default router;
