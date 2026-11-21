import { useEffect, useState } from "react";

import {
    Users,
    Search,
    UserRound,
} from "lucide-react";

const Customers = () => {

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch Users
    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await fetch("http://localhost:5000/users", {
                method: "GET",
                credentials: "include",
            });

            const data = await res.json();

            console.log("API Response:", data);

            if (!res.ok) {
                throw new Error(
                    data.message || "Failed to fetch users"
                );
            }

            setUsers(data.users || []);

        } catch (error) {
            console.error("Fetch Users Error:", error);
            setError(error.message);

        } finally {
            setLoading(false);
        }
    };

    // Load Users When Page Opens
    useEffect(() => {
        fetchUsers();
    }, []);

    // Search Users
    const filteredUsers = users.filter((user) => {

        const name = user.name || "";
        const email = user.email || "";

        return (
            name.toLowerCase().includes(search.toLowerCase()) ||
            email.toLowerCase().includes(search.toLowerCase())
        );
    });

    return (
        <div className="space-y-6">

            {/* Page Header */}
            <div className="flex items-center justify-between">

                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        User Management
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Manage your CARTIVA customers
                    </p>
                </div>

                <div className="bg-violet-100 p-3 rounded-xl">
                    <Users
                        size={28}
                        className="text-violet-700"
                    />
                </div>

            </div>

            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">

                <div className="relative max-w-md">

                    <Search
                        size={20}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-violet-500"
                    />

                </div>

            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

                <div className="p-5 border-b border-gray-200">

                    <h2 className="text-lg font-semibold text-gray-800">
                        All Users ({users.length})
                    </h2>

                </div>

                <div className="overflow-x-auto">

                    <table className="w-full text-left">

                        <thead className="bg-gray-50 text-gray-600 text-sm">

                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Phone</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Joined</th>
                            </tr>

                        </thead>

                        <tbody>

                            {loading ? (

                                <tr>
                                    <td colSpan="6" className="text-center py-10 text-gray-500">
                                        Loading users...
                                    </td>
                                </tr>

                            ) : error ? (

                                <tr>
                                    <td colSpan="6" className="text-center py-10 text-red-500">
                                        {error}
                                    </td>
                                </tr>

                            ) : filteredUsers.length === 0 ? (

                                <tr>
                                    <td colSpan="6" className="text-center py-16">

                                        <div className="flex flex-col items-center">

                                            <div className="bg-violet-100 p-4 rounded-full mb-4">
                                                <UserRound
                                                    size={30}
                                                    className="text-violet-700"
                                                />
                                            </div>

                                            <p className="text-gray-700 font-medium">
                                                No users found
                                            </p>

                                            <p className="text-gray-400 text-sm mt-1">
                                                Registered users will appear here.
                                            </p>

                                        </div>

                                    </td>
                                </tr>

                            ) : (

                                filteredUsers.map((user) => (

                                    <tr
                                        key={user._id}
                                        className="border-t border-gray-100 hover:bg-gray-50"
                                    >

                                        <td className="px-6 py-4 font-medium text-gray-800">
                                            {user.name || "N/A"}
                                        </td>

                                        <td className="px-6 py-4 text-gray-600">
                                            {user.email || "N/A"}
                                        </td>

                                        <td className="px-6 py-4 text-gray-600">
                                            {user.phone || "N/A"}
                                        </td>

                                        <td className="px-6 py-4">

                                            <span className="px-3 py-1 rounded-full text-xs bg-violet-100 text-violet-700">
                                                {user.role || "N/A"}
                                            </span>

                                        </td>

                                        <td className="px-6 py-4">

                                            <span
                                                className={`px-3 py-1 rounded-full text-xs ${user.isBlocked
                                                        ? "bg-red-100 text-red-600"
                                                        : "bg-green-100 text-green-600"
                                                    }`}
                                            >
                                                {user.isBlocked ? "Blocked" : "Active"}
                                            </span>

                                        </td>

                                        <td className="px-6 py-4 text-gray-600">
                                            {user.createdAt
                                                ? new Date(user.createdAt).toLocaleDateString()
                                                : "N/A"}
                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
};

export default Customers;