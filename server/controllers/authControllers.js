import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register
export const register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        const existingUser = await User.findOne({
            email: email.trim()
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        const newUser = await User.create({
            name,
            email,
            password,
            phone,
            role: "user"
        });

        return res.status(201).json({
            success: true,
            message: "Registration completed",
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const loginEmail = email.trim();

        console.log("Login email:", loginEmail);

        const isExist = await User.findOne({
            email: {
                $regex: `^${loginEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
                $options: "i",
            },
        });

        console.log("Found user:", isExist ? isExist.email : null);

        if (!isExist) {
            return res.status(404).json({
                success: false,
                message: "User not found!",
            });
        }

        const auth = await bcrypt.compare(
            password,
            isExist.password
        );

        if (!auth) {
            return res.status(401).json({
                success: false,
                message: "Incorrect password!",
            });
        }

        const token = jwt.sign(
            {
                id: isExist._id,
                email: isExist.email,
                role: isExist.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1hr" }
        );

        const isProduction = process.env.NODE_ENV === "production";

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000,
            sameSite: isProduction ? "none" : "lax",
            secure: isProduction,
        });

        return res.status(200).json({
            message: "Login success",
            success: true,
            user: {
                _id: isExist._id,
                name: isExist.name,
                email: isExist.email,
                role: isExist.role,
            },
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// Get User
export const GetUser = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            user: {
                _id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                phone: req.user.phone,
                role: req.user.role,
            },
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: false,
        });
    }
};


// Logout
export const logoutUser = async (req, res) => {
    const isProduction = process.env.NODE_ENV === "production";

    res.clearCookie("token", {
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
    });

    res.status(200).json({
        message: "Logout successful",
        success: true,
    });
};


// Change Password
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        // Check required fields
        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All password fields are required",
            });
        }

        // Check new password length
        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: "New password must contain at least 8 characters",
            });
        }

        // Check password strength
        if (!/[A-Z]/.test(newPassword) ||
            !/[a-z]/.test(newPassword) ||
            !/[0-9]/.test(newPassword)) {
            return res.status(400).json({
                success: false,
                message: "Password must contain uppercase, lowercase and a number",
            });
        }

        // Check password confirmation
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "New passwords do not match",
            });
        }

        // Get logged-in user
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect",
            });
        }

        // Prevent reusing the current password
        if (currentPassword === newPassword) {
            return res.status(400).json({
                success: false,
                message: "New password must be different from current password",
            });
        }

        // Update password (pre-save hook will hash it)
        user.password = newPassword;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to change password",
            error: error.message,
        });
    }
};