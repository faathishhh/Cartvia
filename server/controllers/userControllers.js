import User from "../models/userModel.js";

export const getAllUsers = async (req, res) => {
    try {

        // Check actual MongoDB documents
        const rawUsers = await User.collection
            .find({})
            .limit(2)
            .toArray();

        console.log("RAW MONGODB USERS:", rawUsers);

        // Fetch users
        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json({
            success: true,
            users,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};