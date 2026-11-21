import { Link, useLocation } from "react-router-dom";
import { CheckCircle, Package, MapPin, ShoppingBag } from "lucide-react";

const OrderSuccess = () => {
    const location = useLocation();
    const order = location.state?.order;

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold text-gray-800">
                    No order details found
                </h2>

                <Link
                    to="/"
                    className="mt-5 bg-violet-600 text-white px-6 py-3 rounded-lg"
                >
                    Go to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-12">

            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-10">

                {/* Success Icon */}
                <div className="flex justify-center">
                    <CheckCircle
                        size={75}
                        className="text-green-500"
                    />
                </div>

                {/* Heading */}
                <div className="text-center mt-5">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Order Placed Successfully!
                    </h1>

                    <p className="text-gray-500 mt-3">
                        Thank you for shopping with CARTVIA.
                        Your order has been received.
                    </p>
                </div>

                {/* Order ID */}
                <div className="bg-violet-50 rounded-xl p-5 mt-8 text-center">
                    <p className="text-gray-500 text-sm">
                        Your Order ID
                    </p>

                    <p className="font-bold text-violet-700 mt-2 break-all">
                        {order._id}
                    </p>
                </div>

                {/* Order Information */}
                <div className="mt-8 space-y-5">

                    <div className="flex items-center gap-3">
                        <Package className="text-violet-600" />

                        <div>
                            <p className="font-semibold text-gray-800">
                                Order Status
                            </p>
                            <p className="text-gray-500">
                                {order.orderStatus}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <ShoppingBag className="text-violet-600" />

                        <div>
                            <p className="font-semibold text-gray-800">
                                Payment Method
                            </p>
                            <p className="text-gray-500">
                                {order.paymentMethod}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <MapPin className="text-violet-600" />

                        <div>
                            <p className="font-semibold text-gray-800">
                                Delivery Address
                            </p>

                            <p className="text-gray-500">
                                {order.shippingAddress?.fullName}
                                <br />
                                {order.shippingAddress?.street},
                                {order.shippingAddress?.city},
                                {order.shippingAddress?.state}
                                <br />
                                {order.shippingAddress?.pincode},
                                {order.shippingAddress?.country}
                            </p>
                        </div>
                    </div>

                </div>

                {/* Order Total */}
                <div className="border-t mt-8 pt-5 flex justify-between items-center">
                    <span className="font-semibold text-gray-700">
                        Total Amount
                    </span>

                    <span className="text-2xl font-bold text-violet-700">
                        ₹{order.totalAmount}
                    </span>
                </div>

                {/* Continue Shopping */}
                <Link
                    to="/"
                    className="mt-8 block text-center bg-violet-600 hover:bg-violet-700 text-white py-3.5 rounded-xl font-semibold transition"
                >
                    Continue Shopping
                </Link>

            </div>

        </div>
    );
};

export default OrderSuccess;