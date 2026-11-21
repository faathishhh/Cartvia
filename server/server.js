import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';

import cookieParser from 'cookie-parser';
import cors from "cors";
import dns from "dns";

import User from "./models/userModel.js";

// DNS configuration
dns.setServers(["8.8.8.8"]);

// Load environment variables
dotenv.config();

const app = express();


// Middleware
app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(cookieParser());


// Update existing users who don't have timestamps
const updateOldUsers = async () => {
    try {
        const result = await User.collection.updateMany(
            { createdAt: { $exists: false } },
            [
                {
                    $set: {
                        createdAt: {
                            $ifNull: ["$updatedAt", new Date()]
                        }
                    }
                }
            ]
        );

        console.log(
            "Existing users updated:",
            result.modifiedCount
        );

    } catch (error) {
        console.log("User update error:", error.message);
    }
};


// Start server after database connection
const startServer = async () => {
    try {
        await connectDB();

        console.log("DB connected");

        await updateOldUsers();

        // Register routes
        app.use(authRoutes);
        app.use(productRoutes);
        app.use(cartRoutes);

        app.listen(5000, () => {
            console.log("Server is running on port 5000");
        });

    } catch (error) {
        console.log("Server startup error:", error.message);
    }
};

startServer();