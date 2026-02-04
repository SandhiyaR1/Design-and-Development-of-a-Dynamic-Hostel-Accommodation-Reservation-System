import express from "express";
import { requireUser } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/admin.middleware.js";
import {
  getOverview,
  getHostelOverview,
  getFloorAnalytics,
  getRoomTypeAnalytics,
} from "../controllers/analytics.controller.js";

const router = express.Router();

router.get("/overview", requireUser, requireAdmin, getOverview);
router.get("/hostel/:type", requireUser, requireAdmin, getHostelOverview);
router.get("/floors/:type", requireUser, requireAdmin, getFloorAnalytics);
router.get("/room-types/:type", requireUser, requireAdmin, getRoomTypeAnalytics);

export default router;
