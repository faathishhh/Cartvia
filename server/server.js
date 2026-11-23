import express from "express";
import dotenv from "dotenv";
import dns from "dns";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

import cookieParser from "cookie-parser";
import cors from "cors";

import User from "./models/userModel.js";

dotenv.config();

// DNS configuration
dns.setServers(["8.8.8.8"]);

const app = express();

// Middleware
app.use(express.json());

const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL,
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
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

        console.log("Existing users updated:", result.modifiedCount);

    } catch (error) {
        console.log("User update error:", error.message);
    }
};

// Database initialization
let usersUpdated = false;

const initializeDB = async () => {
    await connectDB();

    if (!usersUpdated) {
        await updateOldUsers();
        usersUpdated = true;
    }
};

// Vercel database middleware
if (process.env.VERCEL) {
    app.use(async (req, res, next) => {
        try {
            await initializeDB();
            next();

        } catch (error) {
            console.error("Database connection failed:", error.message);

            res.status(500).json({
                success: false,
                message: "Database connection failed",
            });
        }
    });
}

// Test route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "CARTVIA API is running",
    });
});

// Register routes
app.use(authRoutes);
app.use(productRoutes);
app.use(cartRoutes);
app.use(orderRoutes);

// Local server
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 5000;

    initializeDB()
        .then(() => {
            app.listen(PORT, () => {
                console.log(`Server is running on port ${PORT}`);
            });
        })
        .catch((error) => {
            console.error("Server startup failed:", error.message);
            process.exit(1);
        });
}

// Export for Vercel
export default app;