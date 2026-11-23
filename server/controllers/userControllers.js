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

// Update Admin Profile
export const updateAdminProfile = async (req, res) => {
    try {

        const { name, email, phone } = req.body;

        if (!name?.trim() || !email?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Name and email are required",
            });
        }

        // Check whether email is already used by another account
        const existingUser = await User.findOne({
            email: email.trim().toLowerCase(),
            _id: { $ne: req.user._id },
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already exists",
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                name: name.trim(),
                email: email.trim().toLowerCase(),
                phone: phone || "",
            },
            {
                new: true,
                runValidators: true,
            }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "Admin not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to update profile",
            error: error.message,
        });

    }
};