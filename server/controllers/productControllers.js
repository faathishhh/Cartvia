import Product from "../models/productsModel.js";

// Add Product
export const addProduct = async (req, res) => {
    try {
        const product = req.body;

        const newProduct = await Product.create(product);

        res.status(201).json({
            message: "Product created",
            success: true,
            newProduct
        });

    } catch (error) {
        res.status(500).json({
            error: error.message,
            success: false
        });
    }
};


// Get All Products
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find()
        // (
        //     { isActive: true })
        //     .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Products fetched successfully",
            success: true,
            products
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: false
        });
    }
};

//update

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,

                //Checks the updated data against the validation rules in your Mongoose schema.
                runValidators: true,
            }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                message: "Product not found",
                success: false,
            });
        }

        res.status(200).json({
            message: "Product updated successfully",
            success: true,
            product: updatedProduct,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: false,
        });
    }
};

//delete

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({
                message: "Product not found",
                success: false,
            });
        }

        res.status(200).json({
            message: "Product deleted successfully",
            success: true,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: false,
        });
    }
};