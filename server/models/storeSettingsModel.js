import mongoose from "mongoose";

const storeSettingsSchema = new mongoose.Schema(
    {
        storeName: {
            type: String,
            required: true,
            default: "CARTVIA",
        },

        email: {
            type: String,
            default: "",
        },

        phone: {
            type: String,
            default: "",
        },

        address: {
            type: String,
            default: "",
        },

        description: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

const StoreSettings = mongoose.model(
    "StoreSettings",
    storeSettingsSchema
);

export default StoreSettings;