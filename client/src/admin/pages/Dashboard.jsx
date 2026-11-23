import { useEffect, useState } from "react";

import {
    Package,
    ShoppingCart,
    Users,
    IndianRupee,
    RefreshCw,
    TrendingUp,
    Clock,
    Truck,
    CheckCircle,
    XCircle,
    AlertTriangle,
} from "lucide-react";

import API_URL from "../../config/api";


const Dashboard = () => {

    const [stats, setStats] = useState({
        revenue: 0,
        orders: 0,
        products: 0,
        customers: 0,
        activeProducts: 0,
        outOfStock: 0,
        lowStock: 0,
        pending: 0,
        confirmed: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
    });

    const [recentOrders, setRecentOrders] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // Fetch dashboard data
    const fetchDashboardData = async () => {

        try {
            setLoading(true);
            setError("");

            const [analyticsRes, productRes] = await Promise.all([

                fetch(`${API_URL}/admin/analytics`, {
                    credentials: "include",
                }),

                fetch(`${API_URL}/products`, {
                    credentials: "include",
                }),

            ]);

            if (!analyticsRes.ok || !productRes.ok) {
                throw new Error("Failed to fetch dashboard data");
            }

            const analyticsData = await analyticsRes.json();
            const productData = await productRes.json();

            if (!analyticsData.success) {
                throw new Error(
                    analyticsData.message || "Failed to load analytics"
                );
            }

            const analytics = analyticsData.analytics;

            const products = productData.products || [];


            // Product statistics
            const activeProducts = products.filter(
                (product) => product.isActive !== false
            ).length;

            const outOfStock = products.filter(
                (product) => Number(product.stock) <= 0
            ).length;

            const lowStock = products.filter(
                (product) =>
                    Number(product.stock) > 0 &&
                    Number(product.stock) <= 5
            ).length;


            // Order status statistics
            const getStatusCount = (status) => {

                const found = analytics.orderStatus.find(
                    (item) => item._id === status
                );

                return found ? found.count : 0;

            };


            // Update dashboard statistics
            setStats({

                revenue: analytics.totalRevenue || 0,

                orders: analytics.totalOrders || 0,

                products: analytics.totalProducts || 0,

                customers: analytics.totalCustomers || 0,

                activeProducts,

                outOfStock,

                lowStock,

                pending: getStatusCount("Pending"),

                confirmed: getStatusCount("Confirmed"),

                processing: getStatusCount("Processing"),

                shipped: getStatusCount("Shipped"),

                delivered: getStatusCount("Delivered"),

                cancelled: getStatusCount("Cancelled"),

            });


            // Recent orders
            setRecentOrders(analytics.recentOrders || []);

        } catch (error) {

            console.error("Dashboard Error:", error);

            setError(error.message);

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {
        fetchDashboardData();
    }, []);


    // Main dashboard cards
    const dashboardStats = [

        {
            title: "Total Revenue",
            value: `₹${stats.revenue.toLocaleString("en-IN")}`,
            icon: IndianRupee,
        },

        {
            title: "Total Orders",
            value: stats.orders,
            icon: ShoppingCart,
        },

        {
            title: "Total Products",
            value: stats.products,
            icon: Package,
        },

        {
            title: "Total Customers",
            value: stats.customers,
            icon: Users,
        },

    ];


    // Order status styles
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

        <div>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">

                <div>

                    <h1 className="text-3xl font-bold text-gray-800">
                        Dashboard
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Welcome back! Here's what's happening with your store.
                    </p>

                </div>


                <button
                    onClick={fetchDashboardData}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition disabled:opacity-50"
                >

                    <RefreshCw
                        size={17}
                        className={loading ? "animate-spin" : ""}
                    />

                    Refresh

                </button>

            </div>


            {/* Error */}
            {error && (

                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                    {error}
                </div>

            )}


            {/* Main Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

                {dashboardStats.map((item) => {

                    const Icon = item.icon;

                    return (

                        <div
                            key={item.title}
                            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                        >

                            <div className="flex justify-between items-center">

                                <div>

                                    <p className="text-gray-500 text-sm">
                                        {item.title}
                                    </p>

                                    <h2 className="text-2xl font-bold text-gray-800 mt-2">
                                        {loading ? "..." : item.value}
                                    </h2>

                                </div>


                                <div className="bg-violet-100 p-3 rounded-xl">

                                    <Icon
                                        className="text-violet-700"
                                        size={25}
                                    />

                                </div>

                            </div>


                            <p className="text-gray-400 text-sm mt-4">
                                Live database statistics
                            </p>

                        </div>

                    );

                })}

            </div>


            {/* Product Overview */}
            <div className="mt-8">

                <h2 className="text-xl font-bold text-gray-800 mb-5">
                    Product Overview
                </h2>


                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">


                    {/* Active Products */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">

                        <div className="flex items-center gap-3">

                            <div className="bg-green-100 p-3 rounded-lg">

                                <Package className="text-green-600" />

                            </div>


                            <div>

                                <p className="text-gray-500 text-sm">
                                    Active Products
                                </p>

                                <h3 className="text-2xl font-bold text-gray-800">
                                    {loading ? "..." : stats.activeProducts}
                                </h3>

                            </div>

                        </div>

                    </div>


                    {/* Out of Stock */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">

                        <div className="flex items-center gap-3">

                            <div className="bg-red-100 p-3 rounded-lg">

                                <XCircle className="text-red-600" />

                            </div>


                            <div>

                                <p className="text-gray-500 text-sm">
                                    Out of Stock
                                </p>

                                <h3 className="text-2xl font-bold text-gray-800">
                                    {loading ? "..." : stats.outOfStock}
                                </h3>

                            </div>

                        </div>

                    </div>


                    {/* Low Stock */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">

                        <div className="flex items-center gap-3">

                            <div className="bg-yellow-100 p-3 rounded-lg">

                                <AlertTriangle className="text-yellow-600" />

                            </div>


                            <div>

                                <p className="text-gray-500 text-sm">
                                    Low Stock
                                </p>

                                <h3 className="text-2xl font-bold text-gray-800">
                                    {loading ? "..." : stats.lowStock}
                                </h3>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* Order Overview */}
            <div className="mt-8">

                <h2 className="text-xl font-bold text-gray-800 mb-5">
                    Order Overview
                </h2>


                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-5">


                    {[
                        {
                            title: "Pending",
                            value: stats.pending,
                            icon: Clock,
                            color: "text-yellow-600",
                        },
                        {
                            title: "Confirmed",
                            value: stats.confirmed,
                            icon: CheckCircle,
                            color: "text-blue-600",
                        },
                        {
                            title: "Processing",
                            value: stats.processing,
                            icon: RefreshCw,
                            color: "text-purple-600",
                        },
                        {
                            title: "Shipped",
                            value: stats.shipped,
                            icon: Truck,
                            color: "text-indigo-600",
                        },
                        {
                            title: "Delivered",
                            value: stats.delivered,
                            icon: CheckCircle,
                            color: "text-green-600",
                        },
                        {
                            title: "Cancelled",
                            value: stats.cancelled,
                            icon: XCircle,
                            color: "text-red-600",
                        },
                    ].map((item) => {

                        const Icon = item.icon;

                        return (

                            <div
                                key={item.title}
                                className="bg-white p-5 rounded-xl shadow-sm border border-gray-100"
                            >

                                <Icon
                                    size={23}
                                    className={`${item.color} mb-3`}
                                />

                                <p className="text-gray-500 text-sm">
                                    {item.title}
                                </p>

                                <h3 className="text-2xl font-bold text-gray-800 mt-1">
                                    {loading ? "..." : item.value}
                                </h3>

                            </div>

                        );

                    })}

                </div>

            </div>


            {/* Recent Orders */}
            <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">

                <div className="flex justify-between items-center mb-6">

                    <div>

                        <h2 className="text-xl font-bold text-gray-800">
                            Recent Orders
                        </h2>

                        <p className="text-gray-400 text-sm mt-1">
                            Latest customer orders
                        </p>

                    </div>


                    <TrendingUp className="text-violet-600" size={23} />

                </div>


                {loading ? (

                    <p className="text-center py-10 text-gray-400">
                        Loading orders...
                    </p>

                ) : recentOrders.length === 0 ? (

                    <div className="text-center py-12">

                        <ShoppingCart
                            size={40}
                            className="mx-auto text-gray-300 mb-3"
                        />

                        <h3 className="text-gray-700 font-semibold">
                            No orders yet
                        </h3>

                        <p className="text-gray-400 text-sm mt-2">
                            Customer orders will appear here.
                        </p>

                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full text-left">

                            <thead>

                                <tr className="border-b text-gray-500 text-sm">

                                    <th className="py-4 px-3">Order ID</th>

                                    <th className="py-4 px-3">Customer</th>

                                    <th className="py-4 px-3">Date</th>

                                    <th className="py-4 px-3">Amount</th>

                                    <th className="py-4 px-3">Status</th>

                                </tr>

                            </thead>


                            <tbody>

                                {recentOrders.map((order) => (

                                    <tr
                                        key={order._id}
                                        className="border-b last:border-0 hover:bg-gray-50"
                                    >

                                        <td className="py-4 px-3 text-sm font-medium text-gray-700">
                                            #{order._id.slice(-6).toUpperCase()}
                                        </td>


                                        <td className="py-4 px-3 text-sm text-gray-600">
                                            {order.user?.name || "Customer"}
                                        </td>


                                        <td className="py-4 px-3 text-sm text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString("en-IN")}
                                        </td>


                                        <td className="py-4 px-3 text-sm font-semibold text-gray-800">
                                            ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                                        </td>


                                        <td className="py-4 px-3">

                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(order.orderStatus)}`}
                                            >
                                                {order.orderStatus}
                                            </span>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>

    );

};

export default Dashboard;