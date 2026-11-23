import express from "express";
import authenticate from "../middlewares/authMiddleware.js";
import adminOnly from "../middlewares/adminMiddleware.js";
import { getAnalytics } from "../controllers/analyticsControllers.js";



const router = express.Router();

router.get("/admin/analytics", authenticate, adminOnly, getAnalytics);

export default router;