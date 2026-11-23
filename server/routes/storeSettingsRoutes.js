import express from "express";

import {
    getStoreSettings,
    updateStoreSettings,
} from "../controllers/storeSettingsControllers.js";

import authenticate from "../middlewares/authMiddleware.js";
import adminOnly from "../middlewares/adminMiddleware.js";

const router = express.Router();

// Get store settings
router.get("/admin/store-settings", authenticate, adminOnly, getStoreSettings);

// Update store settings
router.put("/admin/store-settings", authenticate, adminOnly, updateStoreSettings);

export default router;