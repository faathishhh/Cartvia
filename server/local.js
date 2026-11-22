import dotenv from "dotenv";
import dns from "dns";
import app from "./server.js";
import connectDB from "./config/db.js";

dotenv.config();

dns.setServers(["8.8.8.8"]);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Database connection failed:", error.message);
    }
};

startServer();