import express from "express";
import authenticate from "../middlewares/authMiddleware.js";
import { addCategory, deleteCategory, getCategories, updateCategory } from "../controllers/categoryController.js";





const router = express.Router();

router.post("/categories", authenticate, addCategory);

router.get("/categories", getCategories);

router.put("/categories/:id", authenticate, updateCategory);

router.delete("/categories/:id", authenticate, deleteCategory);





export default router;