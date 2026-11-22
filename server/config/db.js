import mongoose from "mongoose";

const connectDB = async () => {
    try {

        if (mongoose.connection.readyState === 1) {
            return;
        }

        await mongoose.connect(process.env.MONGO_URL);

        console.log("MongoDB Atlas Connected");

    } catch (error) {

        console.error("MongoDB Error:", error.message);

        throw error;

    }
};

export default connectDB;