import User from "../models/userModel.js"
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import mongoose from "mongoose";




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

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000,
            sameSite: "lax",
            secure: false,
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



export const GetUser = async (req, res) => {
    try {
        // console.log("from GetUser:",req.user);

        res.status(200).json({ succes: true, user: req.user })


    } catch (error) {
        res.status(500).json({ message: error.message, success: false })


    }
}


export const logoutUser = async (req, res) => {

    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
    });

    res.status(200).json({
        message: "Logout successful",
        success: true,
    });
};