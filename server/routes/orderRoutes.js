import express from "express";
import authenticate from "../middlewares/authMiddleware.js";
import { createOrder, getAllOrders, getMyOrders, getOrderById, updateOrderStatus } from "../controllers/orderControllers.js";
import adminOnly from "../middlewares/adminMiddleware.js";



const router = express.Router();

router.post("/orders", authenticate, createOrder);
router.get("/my-orders", authenticate, getMyOrders);
router.get("/admin/orders", authenticate, adminOnly, getAllOrders);
router.get("/admin/orders/:id", authenticate, adminOnly, getOrderById);
router.patch("/admin/orders/:id/status", authenticate, adminOnly, updateOrderStatus);


export default router;