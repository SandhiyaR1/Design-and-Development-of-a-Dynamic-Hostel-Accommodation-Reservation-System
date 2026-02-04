import express from "express";
import { requireUser } from "../middlewares/auth.middleware.js";
import { createReservation } from "../controllers/reservation.controller.js";
import { cancelReservation } from "../controllers/reservation.controller.js";
import {getReservationHistory,} from "../controllers/reservation.controller.js";

const router = express.Router();

router.post("/", requireUser, createReservation);
router.post("/cancel", requireUser, cancelReservation);
router.get("/history", requireUser, getReservationHistory);

export default router;
