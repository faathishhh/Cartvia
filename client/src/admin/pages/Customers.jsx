import { useEffect, useState } from "react";

import {
    Users,
    Search,
    UserRound,
    Eye,
    X,
    Mail,
    Phone,
    ShieldCheck,
    CalendarDays,
    User,
} from "lucide-react";
import API_URL from "../../config/api";


const Customers = () => {

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Selected Customer
    const [selectedUser, setSelectedUser] = useState(null);

    // Fetch Users
    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await fetch(`${API_URL}/users`, {
                method: "GET",
                credentials: "include",
            });

            const data = await res.json();

            console.log("API Response:", data);

            if (!res.ok) {
                throw new Error(data.message || "Failed to fetch users");
            }

            setUsers(data.users || []);

        } catch (error) {
            console.error("Fetch Users Error:", error);
            setError(error.message);

        } finally {
            setLoading(false);
        }
    };

    // Load Users
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

    // Format Date
    const formatDate = (date) => {
        if (!date) return "N/A";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <div className="space-y-6">

            {/* Page Header */}
            <div className="flex items-center justify-between">

                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        User Management
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Manage your CARTVIA customers
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
                        All Users ({filteredUsers.length})
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
                                <th className="px-6 py-4">Action</th>
                            </tr>

                        </thead>

                        <tbody>

                            {loading ? (

                                <tr>
                                    <td colSpan="7" className="text-center py-10 text-gray-500">
                                        Loading users...
                                    </td>
                                </tr>

                            ) : error ? (

                                <tr>
                                    <td colSpan="7" className="text-center py-10 text-red-500">
                                        {error}
                                    </td>
                                </tr>

                            ) : filteredUsers.length === 0 ? (

                                <tr>
                                    <td colSpan="7" className="text-center py-16">

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

                                        {/* View Button */}
                                        <td className="px-6 py-4">

                                            <button
                                                onClick={() => setSelectedUser(user)}
                                                className="flex items-center gap-2 text-violet-700 hover:text-violet-900 font-medium text-sm"
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

            </div>

            {/* Customer Details Modal */}
            {selectedUser && (

                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    onClick={() => setSelectedUser(null)}
                >

                    <div
                        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-6 text-white">

                            <div className="flex items-center justify-between">

                                <div>
                                    <h2 className="text-xl font-bold">
                                        Customer Details
                                    </h2>

                                    <p className="text-violet-100 text-sm mt-1">
                                        Complete customer information
                                    </p>
                                </div>

                                <button
                                    onClick={() => setSelectedUser(null)}
                                    className="p-2 rounded-lg hover:bg-white/20"
                                >
                                    <X size={22} />
                                </button>

                            </div>

                            {/* User Avatar */}
                            <div className="flex items-center gap-4 mt-6">

                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                    <UserRound size={32} />
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold">
                                        {selectedUser.name || "N/A"}
                                    </h3>

                                    <p className="text-violet-100 text-sm">
                                        {selectedUser.role || "N/A"}
                                    </p>
                                </div>

                            </div>

                        </div>

                        {/* Customer Information */}
                        <div className="p-6 space-y-5">

                            <div className="flex items-center gap-4">

                                <div className="bg-violet-100 p-3 rounded-xl">
                                    <Mail className="text-violet-700" size={20} />
                                </div>

                                <div>
                                    <p className="text-xs text-gray-400">
                                        Email Address
                                    </p>

                                    <p className="text-gray-800 font-medium break-all">
                                        {selectedUser.email || "N/A"}
                                    </p>
                                </div>

                            </div>

                            <div className="flex items-center gap-4">

                                <div className="bg-blue-100 p-3 rounded-xl">
                                    <Phone className="text-blue-700" size={20} />
                                </div>

                                <div>
                                    <p className="text-xs text-gray-400">
                                        Phone Number
                                    </p>

                                    <p className="text-gray-800 font-medium">
                                        {selectedUser.phone || "Not provided"}
                                    </p>
                                </div>

                            </div>

                            <div className="flex items-center gap-4">

                                <div className="bg-purple-100 p-3 rounded-xl">
                                    <ShieldCheck className="text-purple-700" size={20} />
                                </div>

                                <div>
                                    <p className="text-xs text-gray-400">
                                        Account Role
                                    </p>

                                    <p className="text-gray-800 font-medium capitalize">
                                        {selectedUser.role || "N/A"}
                                    </p>
                                </div>

                            </div>

                            <div className="flex items-center gap-4">

                                <div className="bg-green-100 p-3 rounded-xl">
                                    <User className="text-green-700" size={20} />
                                </div>

                                <div>
                                    <p className="text-xs text-gray-400">
                                        Account Status
                                    </p>

                                    <span
                                        className={`text-sm font-semibold ${selectedUser.isBlocked
                                                ? "text-red-600"
                                                : "text-green-600"
                                            }`}
                                    >
                                        {selectedUser.isBlocked ? "Blocked" : "Active"}
                                    </span>
                                </div>

                            </div>

                            <div className="flex items-center gap-4">

                                <div className="bg-orange-100 p-3 rounded-xl">
                                    <CalendarDays className="text-orange-700" size={20} />
                                </div>

                                <div>
                                    <p className="text-xs text-gray-400">
                                        Joined Date
                                    </p>

                                    <p className="text-gray-800 font-medium">
                                        {formatDate(selectedUser.createdAt)}
                                    </p>
                                </div>

                            </div>

                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-xl font-semibold transition mt-4"
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
};

export default Customers;