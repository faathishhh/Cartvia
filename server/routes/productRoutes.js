import express from 'express';

import { addProduct, deleteProduct, getProducts, updateProduct } from '../controllers/productControllers.js';

import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post("/products", authenticate, addProduct);

router.get("/products", getProducts);

router.put("/products/:id", updateProduct);

router.delete("/products/:id", deleteProduct);




export default router;