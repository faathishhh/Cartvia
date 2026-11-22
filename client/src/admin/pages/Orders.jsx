import { useEffect, useState } from "react";
import {
    Package,
    Search,
    Eye,
    X,
    CalendarDays,
    User,
    MapPin,
    CreditCard,
} from "lucide-react";
import toast from "react-hot-toast";
import API_URL from "../../config/api";


const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch all orders
    const fetchOrders = async () => {
        try {
            const response = await fetch(
                `${API_URL}/admin/orders`,
                {
                    credentials: "include",
                }
            );

            const data = await response.json();

            if (data.success) {
                setOrders(data.orders);
            } else {
                toast.error(data.message || "Failed to fetch orders");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Update order status
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const response = await fetch(
                `${API_URL}/admin/orders/${orderId}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        orderStatus: newStatus,
                    }),
                }
            );

            const data = await response.json();

            if (data.success) {
                toast.success("Order status updated successfully!");

                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order._id === orderId
                            ? { ...order, orderStatus: newStatus }
                            : order
                    )
                );

                if (selectedOrder?._id === orderId) {
                    setSelectedOrder((prev) => ({
                        ...prev,
                        orderStatus: newStatus,
                    }));
                }
            } else {
                toast.error(data.message || "Failed to update status");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }
    };

    // Search orders
    const filteredOrders = orders.filter((order) => {
        const customerName = order.user?.name || "";
        const customerEmail = order.user?.email || "";

        return (
            order._id.toLowerCase().includes(search.toLowerCase()) ||
            customerName.toLowerCase().includes(search.toLowerCase()) ||
            customerEmail.toLowerCase().includes(search.toLowerCase())
        );
    });

    // Status colors
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
        <div className="p-4 md:p-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Orders Management
                    </h1>

                    <p className="text-gray-500 text-sm mt-1">
                        Manage and track customer orders
                    </p>
                </div>

                <div className="bg-violet-100 text-violet-700 p-4 rounded-xl flex items-center gap-3">
                    <Package size={25} />

                    <div>
                        <p className="text-sm">Total Orders</p>
                        <h2 className="text-xl font-bold">
                            {orders.length}
                        </h2>
                    </div>
                </div>

            </div>

            {/* Search */}
            <div className="relative mb-6 max-w-md">
                <Search
                    size={19}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                    type="text"
                    placeholder="Search by order ID, customer name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500"
                />
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">

                <table className="w-full min-w-[850px] text-left">

                    <thead className="bg-gray-50 text-gray-600 text-sm">
                        <tr>
                            <th className="p-4">Order ID</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Total</th>
                            <th className="p-4">Payment</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Action</th>
                        </tr>
                    </thead>

                    <tbody>

                        {loading ? (
                            <tr>
                                <td colSpan="7" className="text-center p-10 text-gray-500">
                                    Loading orders...
                                </td>
                            </tr>
                        ) : filteredOrders.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center p-10 text-gray-500">
                                    No orders found.
                                </td>
                            </tr>
                        ) : (
                            filteredOrders.map((order) => (
                                <tr
                                    key={order._id}
                                    className="border-t border-gray-100 hover:bg-gray-50"
                                >
                                    <td className="p-4 font-medium text-violet-700">
                                        #{order._id.slice(-8).toUpperCase()}
                                    </td>

                                    <td className="p-4">
                                        <p className="font-medium text-gray-800">
                                            {order.user?.name || "Unknown"}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {order.user?.email || ""}
                                        </p>
                                    </td>

                                    <td className="p-4 text-sm text-gray-600">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>

                                    <td className="p-4 font-semibold text-gray-800">
                                        ₹{order.totalAmount}
                                    </td>

                                    <td className="p-4 text-sm text-gray-600">
                                        {order.paymentMethod}
                                    </td>

                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(order.orderStatus)}`}>
                                            {order.orderStatus}
                                        </span>
                                    </td>

                                    <td className="p-4">
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="flex items-center gap-2 text-violet-600 hover:text-violet-800 font-medium"
                                        >
                                            <Eye size={17} />
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}

                    </tbody>
                </table>

            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

                    <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-5 border-b">
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
                                className="p-2 hover:bg-gray-100 rounded-full"
                            >
                                <X size={22} />
                            </button>
                        </div>

                        <div className="p-5 space-y-6">

                            {/* Customer */}
                            <div>
                                <h3 className="font-semibold flex items-center gap-2 mb-3">
                                    <User size={18} className="text-violet-600" />
                                    Customer Information
                                </h3>

                                <p className="text-gray-700">
                                    {selectedOrder.user?.name}
                                </p>

                                <p className="text-sm text-gray-500">
                                    {selectedOrder.user?.email}
                                </p>

                                <p className="text-sm text-gray-500">
                                    {selectedOrder.user?.phone}
                                </p>
                            </div>

                            {/* Products */}
                            <div>
                                <h3 className="font-semibold mb-3">
                                    Ordered Products
                                </h3>

                                <div className="space-y-3">
                                    {selectedOrder.items?.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl"
                                        >
                                            <img
                                                src={item.image}
                                                alt={item.productName}
                                                className="w-16 h-16 object-cover rounded-lg"
                                            />

                                            <div className="flex-1">
                                                <p className="font-medium text-gray-800">
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
                            </div>

                            {/* Address */}
                            <div>
                                <h3 className="font-semibold flex items-center gap-2 mb-3">
                                    <MapPin size={18} className="text-violet-600" />
                                    Delivery Address
                                </h3>

                                <p className="text-sm text-gray-600">
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
                                    <CreditCard size={18} className="text-violet-600" />
                                    Payment Information
                                </h3>

                                <p className="text-sm text-gray-600">
                                    Method: {selectedOrder.paymentMethod}
                                </p>

                                <p className="text-sm text-gray-600">
                                    Payment Status: {selectedOrder.paymentStatus}
                                </p>
                            </div>

                            {/* Amount */}
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
                                    <span>Total Amount</span>
                                    <span className="text-violet-700">
                                        ₹{selectedOrder.totalAmount}
                                    </span>
                                </div>
                            </div>

                            {/* Update Status */}
                            <div>
                                <label className="block font-semibold mb-2">
                                    Update Order Status
                                </label>

                                <select
                                    value={selectedOrder.orderStatus}
                                    onChange={(e) =>
                                        handleStatusChange(
                                            selectedOrder._id,
                                            e.target.value
                                        )
                                    }
                                    className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-violet-500"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>

                        </div>

                    </div>
                </div>
            )}

        </div>
    );
};

export default Orders;