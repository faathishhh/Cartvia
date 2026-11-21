import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
        },

        email: {
            type: String,
            trim: true,
            lowercase: true,
        },

        password: {
            type: String,
            required: true,
        },

        phone: {
            type: String,
        },

        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user",
        },

        address: {
            fullName: String,
            phone: String,
            street: String,
            city: String,
            state: String,
            pincode: String,
            country: String,
        },

        isVerified: {
            type: Boolean,
            default: false,
        },

        isBlocked: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);


userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }

    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("user", userSchema);

export default User;