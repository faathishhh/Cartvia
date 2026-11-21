import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";
import User from "../models/userModel.js";






// Place Order
export const createOrder = async (req, res) => {
    try {
        const userId = req.user._id;

        // Get customer details
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Check customer address
        const address = req.body.shippingAddress || user.address;
        // Save the latest delivery address to customer account
        user.address = address;
        await user.save();

        if (
            !address?.fullName ||
            !address?.phone ||
            !address?.street ||
            !address?.city ||
            !address?.state ||
            !address?.pincode
        ) {
            return res.status(400).json({
                success: false,
                message: "Please complete your delivery address",
            });
        }

        // Get customer cart
        const cart = await Cart.findOne({
            user: userId,
        }).populate("items.product");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Your cart is empty",
            });
        }

        // Prepare order items
        const orderItems = cart.items.map((item) => {
            if (!item.product) {
                throw new Error("A product in your cart is no longer available");
            }

            return {
                product: item.product._id,
                productName: item.product.productName,
                image: item.product.images?.[0] || "",
                price: item.price,
                quantity: item.quantity,
            };
        });

        // Calculate amounts on backend
        const subtotal = orderItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );

        const deliveryCharge = subtotal >= 999 ? 0 : 50;

        const totalAmount = subtotal + deliveryCharge;

        // Create order
        const order = await Order.create({
            user: userId,
            items: orderItems,
            shippingAddress: {
                fullName: address.fullName,
                phone: address.phone,
                street: address.street,
                city: address.city,
                state: address.state,
                pincode: address.pincode,
                country: address.country,
            },
            subtotal,
            deliveryCharge,
            totalAmount,
            paymentMethod: "COD",
            paymentStatus: "Pending",
            orderStatus: "Pending",
        });

        // Clear customer cart
        await Cart.findOneAndUpdate(
            { user: userId },
            {
                $set: {
                    items: [],
                    totalPrice: 0,
                },
            }
        );

        return res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order,
        });

    } catch (error) {
        console.error("Create order error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



// Get All Orders (Admin)
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email phone")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: orders.length,
            orders,
        });

    } catch (error) {
        console.error("Get all orders error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// Get Single Order Details (Admin)
export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id)
            .populate("user", "name email phone");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        return res.status(200).json({
            success: true,
            order,
        });

    } catch (error) {
        console.error("Get order error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// Update Order Status (Admin)
export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { orderStatus } = req.body;

        const allowedStatuses = [
            "Pending",
            "Confirmed",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled",
        ];

        if (!allowedStatuses.includes(orderStatus)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order status",
            });
        }

        const order = await Order.findByIdAndUpdate(
            id,
            { orderStatus },
            { new: true, runValidators: true }
        ).populate("user", "name email phone");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order,
        });

    } catch (error) {
        console.error("Update order status error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// Get logged-in customer's orders
export const getMyOrders = async (req, res) => {
    try {
        const userId = req.user._id;

        const orders = await Order.find({ user: userId })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            orders,
        });

    } catch (error) {
        console.error("Get My Orders Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch your orders",
        });
    }
};





