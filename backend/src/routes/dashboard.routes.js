import express from "express";
import { requireUser } from "../middlewares/auth.middleware.js";
import { getDashboard } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/", requireUser, getDashboard);

export default router;
