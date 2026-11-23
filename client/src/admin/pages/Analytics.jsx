import React from 'react'

import { useEffect, useState } from "react";

import {
    IndianRupee,
    ShoppingCart,
    Package,
    Users,
    RefreshCw,
    TrendingUp,
    Trophy,
    CalendarDays,
    Clock,
} from "lucide-react";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

import API_URL from "../../config/api";


const Analytics = () => {

    const [analytics, setAnalytics] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalCustomers: 0,
        monthlySales: [],
        orderStatus: [],
        bestSellingProducts: [],
        recentOrders: [],
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // Fetch analytics data
    const fetchAnalytics = async () => {

        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/admin/analytics`,
                {
                    credentials: "include",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch analytics"
                );
            }

            if (data.success) {
                setAnalytics(data.analytics);
            }

        } catch (error) {

            console.error("Analytics Error:", error);
            setError(error.message);

        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchAnalytics();
    }, []);


    // Main statistics
    const statistics = [
        {
            title: "Total Revenue",
            value: `₹${analytics.totalRevenue.toLocaleString("en-IN")}`,
            icon: IndianRupee,
        },
        {
            title: "Total Orders",
            value: analytics.totalOrders,
            icon: ShoppingCart,
        },
        {
            title: "Total Products",
            value: analytics.totalProducts,
            icon: Package,
        },
        {
            title: "Total Customers",
            value: analytics.totalCustomers,
            icon: Users,
        },
    ];


    // Format monthly sales chart
    const chartData = analytics.monthlySales.map((item) => {

        const monthName = new Date(
            item._id.year,
            item._id.month - 1
        ).toLocaleString("en-IN", {
            month: "short",
        });

        return {
            month: `${monthName} ${item._id.year}`,
            revenue: item.revenue,
            orders: item.orders,
        };

    });


    // Order status colors
    const statusColors = {
        Pending: "bg-yellow-100 text-yellow-700",
        Confirmed: "bg-blue-100 text-blue-700",
        Processing: "bg-purple-100 text-purple-700",
        Shipped: "bg-indigo-100 text-indigo-700",
        Delivered: "bg-green-100 text-green-700",
        Cancelled: "bg-red-100 text-red-700",
    };


    const allStatuses = [
        "Pending",
        "Confirmed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
    ];


    const getStatusCount = (status) => {

        const found = analytics.orderStatus.find(
            (item) => item._id === status
        );

        return found ? found.count : 0;
    };


    return (

        <div>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">

                <div>

                    <h1 className="text-3xl font-bold text-gray-800">
                        Analytics
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Track your store performance and sales insights.
                    </p>

                </div>


                <button
                    onClick={fetchAnalytics}
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

                {statistics.map((item) => {

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


            {/* Monthly Sales Chart */}
            <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">

                <div className="flex items-center gap-3 mb-6">

                    <div className="bg-violet-100 p-3 rounded-lg">

                        <TrendingUp
                            className="text-violet-700"
                            size={23}
                        />

                    </div>

                    <div>

                        <h2 className="text-xl font-bold text-gray-800">
                            Monthly Sales
                        </h2>

                        <p className="text-gray-400 text-sm mt-1">
                            Revenue from delivered orders
                        </p>

                    </div>

                </div>


                {loading ? (

                    <p className="text-center py-16 text-gray-400">
                        Loading sales data...
                    </p>

                ) : chartData.length === 0 ? (

                    <div className="text-center py-16">

                        <CalendarDays
                            size={40}
                            className="mx-auto text-gray-300 mb-3"
                        />

                        <p className="text-gray-500">
                            No sales data available yet.
                        </p>

                    </div>

                ) : (

                    <div className="w-full h-80">

                        <ResponsiveContainer width="100%" height="100%">

                            <BarChart data={chartData}>

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                />

                                <XAxis
                                    dataKey="month"
                                    tick={{ fontSize: 12 }}
                                />

                                <YAxis
                                    tickFormatter={(value) =>
                                        `₹${value.toLocaleString("en-IN")}`
                                    }
                                    tick={{ fontSize: 12 }}
                                />

                                <Tooltip
                                    formatter={(value) => [
                                        `₹${Number(value).toLocaleString("en-IN")}`,
                                        "Revenue",
                                    ]}
                                />

                                <Bar
                                    dataKey="revenue"
                                    fill="#7c3aed"
                                    radius={[6, 6, 0, 0]}
                                />

                            </BarChart>

                        </ResponsiveContainer>

                    </div>

                )}

            </div>


            {/* Order Status Overview */}
            <div className="mt-8">

                <h2 className="text-xl font-bold text-gray-800 mb-5">
                    Order Status Overview
                </h2>


                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-5">

                    {allStatuses.map((status) => (

                        <div
                            key={status}
                            className="bg-white p-5 rounded-xl shadow-sm border border-gray-100"
                        >

                            <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColors[status]}`}
                            >
                                {status}
                            </span>


                            <h3 className="text-2xl font-bold text-gray-800 mt-4">
                                {loading ? "..." : getStatusCount(status)}
                            </h3>


                            <p className="text-gray-400 text-sm mt-1">
                                Total orders
                            </p>

                        </div>

                    ))}

                </div>

            </div>


            {/* Best Selling Products */}
            <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">

                <div className="flex items-center gap-3 mb-6">

                    <div className="bg-yellow-100 p-3 rounded-lg">

                        <Trophy
                            className="text-yellow-600"
                            size={23}
                        />

                    </div>


                    <div>

                        <h2 className="text-xl font-bold text-gray-800">
                            Best-Selling Products
                        </h2>

                        <p className="text-gray-400 text-sm mt-1">
                            Top products based on delivered quantities
                        </p>

                    </div>

                </div>


                {loading ? (

                    <p className="text-center py-10 text-gray-400">
                        Loading products...
                    </p>

                ) : analytics.bestSellingProducts.length === 0 ? (

                    <p className="text-center py-10 text-gray-400">
                        No sales data available yet.
                    </p>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full text-left">

                            <thead>

                                <tr className="border-b text-gray-500 text-sm">

                                    <th className="py-4 px-3">
                                        Product
                                    </th>

                                    <th className="py-4 px-3">
                                        Units Sold
                                    </th>

                                    <th className="py-4 px-3">
                                        Revenue
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {analytics.bestSellingProducts.map((product) => (

                                    <tr
                                        key={product._id}
                                        className="border-b last:border-0 hover:bg-gray-50"
                                    >

                                        <td className="py-4 px-3">

                                            <div className="flex items-center gap-3">

                                                <img
                                                    src={
                                                        product.image ||
                                                        "https://placehold.co/60x60?text=Product"
                                                    }
                                                    alt={product.productName}
                                                    className="w-12 h-12 rounded-lg object-cover border"
                                                />

                                                <span className="font-medium text-gray-700 text-sm">
                                                    {product.productName}
                                                </span>

                                            </div>

                                        </td>


                                        <td className="py-4 px-3 text-gray-600 text-sm">
                                            {product.totalSold}
                                        </td>


                                        <td className="py-4 px-3 font-semibold text-gray-800 text-sm">
                                            ₹{Number(product.totalRevenue).toLocaleString("en-IN")}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>


            {/* Recent Orders */}
            <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">

                <div className="flex items-center gap-3 mb-6">

                    <div className="bg-blue-100 p-3 rounded-lg">

                        <Clock
                            className="text-blue-600"
                            size={23}
                        />

                    </div>


                    <div>

                        <h2 className="text-xl font-bold text-gray-800">
                            Recent Orders
                        </h2>

                        <p className="text-gray-400 text-sm mt-1">
                            Latest 5 customer orders
                        </p>

                    </div>

                </div>


                {loading ? (

                    <p className="text-center py-10 text-gray-400">
                        Loading orders...
                    </p>

                ) : analytics.recentOrders.length === 0 ? (

                    <p className="text-center py-10 text-gray-400">
                        No orders available yet.
                    </p>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full text-left">

                            <thead>

                                <tr className="border-b text-gray-500 text-sm">

                                    <th className="py-4 px-3">
                                        Order ID
                                    </th>

                                    <th className="py-4 px-3">
                                        Customer
                                    </th>

                                    <th className="py-4 px-3">
                                        Date
                                    </th>

                                    <th className="py-4 px-3">
                                        Amount
                                    </th>

                                    <th className="py-4 px-3">
                                        Status
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {analytics.recentOrders.map((order) => (

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
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.orderStatus] || "bg-gray-100 text-gray-700"}`}
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

export default Analytics;