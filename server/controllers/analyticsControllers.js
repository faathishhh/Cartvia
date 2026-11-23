import Order from "../models/orderModel.js";
import Product from "../models/productsModel.js";
import User from "../models/userModel.js";

export const getAnalytics = async (req, res) => {
    try {
        // Basic counts
        const totalOrders = await Order.countDocuments();

        const totalProducts = await Product.countDocuments();

        const totalCustomers = await User.countDocuments({
            role: "user",
        });

        // Total revenue from delivered orders
        const revenueResult = await Order.aggregate([
            {
                $match: {
                    orderStatus: "Delivered",
                },
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalAmount" },
                },
            },
        ]);

        const totalRevenue = revenueResult[0]?.totalRevenue || 0;

        // Monthly sales from delivered orders
        const monthlySales = await Order.aggregate([
            {
                $match: {
                    orderStatus: "Delivered",
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                    },
                    revenue: { $sum: "$totalAmount" },
                    orders: { $sum: 1 },
                },
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1,
                },
            },
        ]);

        // Order status overview
        const orderStatus = await Order.aggregate([
            {
                $group: {
                    _id: "$orderStatus",
                    count: { $sum: 1 },
                },
            },
        ]);

        // Best-selling products
        const bestSellingProducts = await Order.aggregate([
            {
                $match: {
                    orderStatus: "Delivered",
                },
            },
            {
                $unwind: "$items",
            },
            {
                $group: {
                    _id: "$items.product",
                    productName: { $first: "$items.productName" },
                    image: { $first: "$items.image" },
                    totalSold: { $sum: "$items.quantity" },
                    totalRevenue: {
                        $sum: {
                            $multiply: [
                                "$items.price",
                                "$items.quantity",
                            ],
                        },
                    },
                },
            },
            {
                $sort: {
                    totalSold: -1,
                },
            },
            {
                $limit: 5,
            },
        ]);

        // Recent orders
        const recentOrders = await Order.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            success: true,
            analytics: {
                totalRevenue,
                totalOrders,
                totalProducts,
                totalCustomers,
                monthlySales,
                orderStatus,
                bestSellingProducts,
                recentOrders,
            },
        });

    } catch (error) {
        console.error("Analytics Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch analytics",
            error: error.message,
        });
    }
};