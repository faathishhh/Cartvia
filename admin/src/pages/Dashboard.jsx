
import { useEffect, useState } from "react";

import {
    Package,
    ShoppingCart,
    Users,
    IndianRupee,
    TrendingUp,
    RefreshCw,
} from "lucide-react";

const Dashboard = () => {

    const [stats, setStats] = useState({
        revenue: null,
        orders: null,
        products: 0,
        customers: null,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch dashboard data
    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await fetch("http://localhost:5000/products", {
                credentials: "include",
            });

            if (!res.ok) {
                throw new Error("Failed to fetch products");
            }

            const data = await res.json();

            setStats((prev) => ({
                ...prev,
                products: data.products?.length || 0,
            }));

        } catch (error) {
            console.error(error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const dashboardStats = [
        {
            title: "Total Revenue",
            value: stats.revenue !== null
                ? `₹${stats.revenue.toLocaleString("en-IN")}`
                : "Not available",
            icon: IndianRupee,
        },
        {
            title: "Total Orders",
            value: stats.orders !== null ? stats.orders : "Not available",
            icon: ShoppingCart,
        },
        {
            title: "Total Products",
            value: stats.products,
            icon: Package,
        },
        {
            title: "Total Customers",
            value: stats.customers !== null
                ? stats.customers
                : "Not available",
            icon: Users,
        },
    ];

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
                    <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
                    Refresh
                </button>

            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                    {error}
                </div>
            )}

            {/* Statistics */}
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
                                    <Icon className="text-violet-700" size={25} />
                                </div>

                            </div>

                            {item.title === "Total Products" && (
                                <p className="text-gray-400 text-sm mt-4">
                                    Live product count
                                </p>
                            )}

                        </div>
                    );
                })}

            </div>

            {/* Recent Orders */}
            <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">

                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-xl font-bold text-gray-800">
                        Recent Orders
                    </h2>
                </div>

                <div className="text-center py-12">

                    <ShoppingCart
                        size={40}
                        className="mx-auto text-gray-300 mb-3"
                    />

                    <h3 className="text-gray-700 font-semibold">
                        Order management not connected
                    </h3>

                    <p className="text-gray-400 text-sm mt-2">
                        Recent orders will appear here after we implement the order API.
                    </p>

                </div>

            </div>

        </div>
    );
};

export default Dashboard;
