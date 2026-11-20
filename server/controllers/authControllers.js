import User from "../models/userModel.js"
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'




export const register = async (req, res) => {
    try {

        const user = req.body

        const newUser = await User.create(user);

        res.status(201).json({ message: "registration completed", success: true, newUser })

    } catch (error) {
        res.status(500).json({ message: error.message, success: false })

    }

}

export const login = async (req, res) => {
    try {

        const { email, password } = req.body

        const isExist = await User.findOne({ email: email })

        if (!isExist) {
            return res.status(404).json({ success: false, message: "user not found!" })
        }
        const auth = await bcrypt.compare(password, isExist.password);

        if (!auth) {
            return res.status(401).json({ message: "incorrect password!", success: false })
        }

        const token = jwt.sign({ id: isExist._id, email: isExist.email, role: isExist.role }, process.env.JWT_SECRET, { expiresIn: "1hr" })
        console.log(token);

        res.cookie("token", token, { maxAge: 60 * 60 * 1000 })//covert ihr into milli second


        res.status(200).json({
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

        res.status(500).json({ message: error.message, success: false })


    }

}



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