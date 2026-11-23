import express from 'express';
import { GetUser, login, logoutUser, register } from '../controllers/authControllers.js';
import authenticate from '../middlewares/authMiddleware.js';
import { getAllUsers, updateAdminProfile } from '../controllers/userControllers.js';
import adminOnly from '../middlewares/adminMiddleware.js';


const router = express.Router();





router.post("/register", register)
router.post("/login", login)
router.get("/me", authenticate, GetUser)
router.post("/logout",logoutUser )
router.get("/users",authenticate, adminOnly, getAllUsers )
router.put("/admin/profile", authenticate, adminOnly, updateAdminProfile);






export default router;