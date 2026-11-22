import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Package,
    ShoppingBag,
    CalendarDays,
    ChevronRight,
    Eye,
    MapPin,
    CreditCard,
} from "lucide-react";
import API_URL from "../config/api";

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Fetch customer orders
    const fetchOrders = async () => {
        try {
            const response = await fetch(
                `${API_URL}/my-orders`,
                {
                    credentials: "include",
                }
            );

            const data = await response.json();

            if (data.success) {
                setOrders(data.orders);
            }
        } catch (error) {
            console.error("Fetch Orders Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Order status colors
    const getStatusStyle = (status) => {
        const styles = {
            Pending: "bg-yellow-100 text-yellow-700",
            Confirmed: "bg-blue-100 text-blue-700",
            Processing: "bg-purple-100 text-purple-700",
            Shipped: "bg-indigo-100 text-indigo-700",
            Delivered: "bg-green-100 text-green-700",
            Cancelled: "bg-red-100 text-red-700",
        };

        return styles[status] || "bg-gray-100 text-gray-700";
    };

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-10">

            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        My Orders
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Track and manage your CARTVIA purchases.
                    </p>
                </div>

                {/* Order Count */}
                <div className="bg-white rounded-xl shadow-sm border p-5 mb-6 flex items-center gap-4">
                    <div className="bg-violet-100 p-3 rounded-xl">
                        <Package className="text-violet-700" size={27} />
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Total Orders
                        </p>

                        <h2 className="text-2xl font-bold text-gray-800">
                            {orders.length}
                        </h2>
                    </div>
                </div>

                {/* Loading */}
                {loading ? (
                    <div className="text-center py-20 text-gray-500">
                        Loading your orders...
                    </div>
                ) : orders.length === 0 ? (

                    /* Empty Orders */
                    <div className="bg-white rounded-2xl shadow-sm p-12 text-center">

                        <div className="bg-violet-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                            <ShoppingBag
                                size={35}
                                className="text-violet-600"
                            />
                        </div>

                        <h2 className="text-xl font-bold text-gray-800 mt-5">
                            No Orders Yet
                        </h2>

                        <p className="text-gray-500 mt-2">
                            You haven't placed any orders yet.
                            Start shopping and discover something you love!
                        </p>

                        <Link
                            to="/products"
                            className="inline-block mt-6 bg-violet-600 hover:bg-violet-700 text-white px-7 py-3 rounded-xl font-semibold transition"
                        >
                            Start Shopping
                        </Link>

                    </div>

                ) : (

                    /* Orders List */
                    <div className="space-y-5">

                        {orders.map((order) => (

                            <div
                                key={order._id}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                            >

                                {/* Order Header */}
                                <div className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b">

                                    <div>
                                        <p className="text-xs text-gray-500">
                                            ORDER ID
                                        </p>

                                        <p className="font-semibold text-violet-700 mt-1">
                                            #{order._id.slice(-8).toUpperCase()}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500">
                                            ORDER DATE
                                        </p>

                                        <p className="flex items-center gap-2 text-sm text-gray-700 mt-1">
                                            <CalendarDays size={15} />
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500">
                                            TOTAL AMOUNT
                                        </p>

                                        <p className="font-bold text-gray-800 mt-1">
                                            ₹{order.totalAmount}
                                        </p>
                                    </div>

                                    <div>
                                        <span className={`inline-block px-4 py-2 rounded-full text-xs font-semibold ${getStatusStyle(order.orderStatus)}`}>
                                            {order.orderStatus}
                                        </span>
                                    </div>

                                </div>

                                {/* Order Products */}
                                <div className="p-5">

                                    <div className="space-y-4">

                                        {order.items?.map((item, index) => (

                                            <div
                                                key={index}
                                                className="flex items-center gap-4"
                                            >

                                                <img
                                                    src={item.image}
                                                    alt={item.productName}
                                                    className="w-16 h-16 object-cover rounded-xl bg-gray-100"
                                                />

                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-800">
                                                        {item.productName}
                                                    </h3>

                                                    <p className="text-sm text-gray-500 mt-1">
                                                        Quantity: {item.quantity}
                                                    </p>
                                                </div>

                                                <p className="font-semibold text-gray-800">
                                                    ₹{item.price * item.quantity}
                                                </p>

                                            </div>

                                        ))}

                                    </div>

                                    {/* Footer */}
                                    <div className="border-t mt-5 pt-4 flex justify-between items-center">

                                        <p className="text-sm text-gray-500">
                                            {order.items?.length || 0} product(s)
                                        </p>

                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="flex items-center gap-2 text-violet-700 hover:text-violet-900 font-semibold text-sm"
                                        >
                                            <Eye size={17} />
                                            View Details
                                            <ChevronRight size={17} />
                                        </button>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

            {/* Order Details Modal */}
            {selectedOrder && (

                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

                    <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl">

                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-5 border-b">

                            <div>
                                <h2 className="text-xl font-bold text-gray-800">
                                    Order Details
                                </h2>

                                <p className="text-sm text-violet-600 mt-1">
                                    #{selectedOrder._id}
                                </p>
                            </div>

                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="text-gray-500 hover:text-red-500 text-2xl"
                            >
                                &times;
                            </button>

                        </div>

                        <div className="p-5 space-y-6">

                            {/* Status */}
                            <div>
                                <p className="text-sm text-gray-500 mb-2">
                                    Order Status
                                </p>

                                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusStyle(selectedOrder.orderStatus)}`}>
                                    {selectedOrder.orderStatus}
                                </span>
                            </div>

                            {/* Products */}
                            <div>
                                <h3 className="font-semibold mb-3">
                                    Ordered Products
                                </h3>

                                {selectedOrder.items?.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-4 mb-4"
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.productName}
                                            className="w-14 h-14 object-cover rounded-lg"
                                        />

                                        <div className="flex-1">
                                            <p className="font-medium">
                                                {item.productName}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                Quantity: {item.quantity}
                                            </p>
                                        </div>

                                        <p className="font-semibold">
                                            ₹{item.price * item.quantity}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Delivery Address */}
                            <div>
                                <h3 className="font-semibold flex items-center gap-2 mb-3">
                                    <MapPin className="text-violet-600" size={19} />
                                    Delivery Address
                                </h3>

                                <p className="text-sm text-gray-600 leading-6">
                                    {selectedOrder.shippingAddress?.fullName}
                                    <br />
                                    {selectedOrder.shippingAddress?.phone}
                                    <br />
                                    {selectedOrder.shippingAddress?.street},
                                    {selectedOrder.shippingAddress?.city},
                                    {selectedOrder.shippingAddress?.state}
                                    <br />
                                    {selectedOrder.shippingAddress?.pincode},
                                    {selectedOrder.shippingAddress?.country}
                                </p>
                            </div>

                            {/* Payment */}
                            <div>
                                <h3 className="font-semibold flex items-center gap-2 mb-3">
                                    <CreditCard className="text-violet-600" size={19} />
                                    Payment Information
                                </h3>

                                <p className="text-sm text-gray-600">
                                    Method: {selectedOrder.paymentMethod}
                                </p>

                                <p className="text-sm text-gray-600">
                                    Payment Status: {selectedOrder.paymentStatus}
                                </p>
                            </div>

                            {/* Total */}
                            <div className="bg-violet-50 p-4 rounded-xl space-y-2">

                                <div className="flex justify-between text-sm">
                                    <span>Subtotal</span>
                                    <span>₹{selectedOrder.subtotal}</span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span>Delivery Charge</span>
                                    <span>₹{selectedOrder.deliveryCharge}</span>
                                </div>

                                <div className="border-t border-violet-200 pt-3 flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span className="text-violet-700">
                                        ₹{selectedOrder.totalAmount}
                                    </span>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
};

export default MyOrders;