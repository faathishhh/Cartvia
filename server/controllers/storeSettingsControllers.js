import StoreSettings from "../models/storeSettingsModel.js";


// Get Store Settings
export const getStoreSettings = async (req, res) => {
    try {

        let settings = await StoreSettings.findOne();

        if (!settings) {
            settings = await StoreSettings.create({
                storeName: "CARTVIA",
            });
        }

        res.status(200).json({
            success: true,
            settings,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to fetch store settings",
            error: error.message,
        });

    }
};


// Update Store Settings
export const updateStoreSettings = async (req, res) => {
    try {

        const {
            storeName,
            email,
            phone,
            address,
            description,
        } = req.body;

        if (!storeName?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Store name is required",
            });
        }

        const settings = await StoreSettings.findOneAndUpdate(
            {},
            {
                storeName,
                email,
                phone,
                address,
                description,
            },
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true,
            }
        );

        res.status(200).json({
            success: true,
            message: "Store settings updated successfully",
            settings,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to update store settings",
            error: error.message,
        });

    }
};