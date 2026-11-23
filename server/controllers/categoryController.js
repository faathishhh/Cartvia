import Category from "../models/categoryModel.js";
import Product from "../models/productsModel.js";

// Add Category
export const addCategory = async (req, res) => {
    try {
        const { name, description, image } = req.body;

        if (!name?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Category name is required",
            });
        }

        const existingCategory = await Category.findOne({
            name: {
                $regex: `^${name.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
                $options: "i",
            },
        });

        if (existingCategory) {
            return res.status(409).json({
                success: false,
                message: "Category already exists",
            });
        }

        const category = await Category.create({
            name: name.trim(),
            description,
            image,
        });

        return res.status(201).json({
            success: true,
            message: "Category added successfully",
            category,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get All Categories
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({
            createdAt: -1,
        });

        const categoriesWithCount = await Promise.all(
            categories.map(async (category) => {
                const productCount = await Product.countDocuments({
                    category: {
                        $regex: `^${category.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
                        $options: "i",
                    },
                });

                return {
                    ...category.toObject(),
                    productCount,
                };
            })
        );

        return res.status(200).json({
            success: true,
            categories: categoriesWithCount,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Update Category
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, image, isActive } = req.body;

        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        if (name?.trim()) {
            const existingCategory = await Category.findOne({
                _id: { $ne: id },
                name: {
                    $regex: `^${name.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
                    $options: "i",
                },
            });

            if (existingCategory) {
                return res.status(409).json({
                    success: false,
                    message: "Category name already exists",
                });
            }

            const oldName = category.name;
            const newName = name.trim();

            if (oldName !== newName) {
                await Product.updateMany(
                    {
                        category: {
                            $regex: `^${oldName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
                            $options: "i",
                        },
                    },
                    {
                        $set: { category: newName },
                    }
                );
            }

            category.name = newName;
        }

        if (description !== undefined) {
            category.description = description;
        }

        if (image !== undefined) {
            category.image = image;
        }

        if (isActive !== undefined) {
            category.isActive = isActive;
        }

        await category.save();

        return res.status(200).json({
            success: true,
            message: "Category updated successfully",
            category,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Delete Category
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        const productCount = await Product.countDocuments({
            category: {
                $regex: `^${category.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
                $options: "i",
            },
        });

        if (productCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete this category because ${productCount} products are using it.`,
            });
        }

        await Category.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Category deleted successfully",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};