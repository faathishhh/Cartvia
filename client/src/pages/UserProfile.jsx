import { useEffect, useState } from "react";
import { User, Mail, Phone, ShieldCheck, IdCard, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const UserProfile = () => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchUser = async () => {
        try {
            const res = await fetch("http://localhost:5000/me", {
                credentials: "include"
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Unable to fetch profile");
            }

            setUser(data.user);

        } catch (error) {
            console.log(error);
            setError(error.message);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <User size={50} className="text-violet-500 mb-4" />

                <h2 className="text-xl font-bold text-gray-800">
                    Unable to load profile
                </h2>

                <p className="text-gray-500 mt-2">
                    {error || "User information not found"}
                </p>

                <button
                    onClick={fetchUser}
                    className="mt-5 bg-violet-600 text-white px-6 py-3 rounded-xl hover:bg-violet-700"
                >
                    Try Again
                </button>
            </div>
        );
    }

    const details = [
        {
            label: "User ID",
            value: user._id,
            icon: IdCard
        },
        {
            label: "Full Name",
            value: user.name,
            icon: User
        },
        {
            label: "Email Address",
            value: user.email,
            icon: Mail
        },
        {
            label: "Phone Number",
            value: user.phone || "Not provided",
            icon: Phone
        },
        {
            label: "Account Role",
            value: user.role,
            icon: ShieldCheck
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">

            <div className="max-w-3xl mx-auto">

                {/* Back Button */}
                <Link
                    to="/products"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-violet-600 mb-7 transition"
                >
                    <ArrowLeft size={18} />
                    Continue Shopping
                </Link>

                {/* Heading */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                        My Profile
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Manage and view your account information.
                    </p>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                    {/* Profile Header */}
                    <div className="bg-gradient-to-r from-violet-700 to-violet-500 px-6 py-10 text-center">

                        {/* Avatar */}
                        <div className="mx-auto w-24 h-24 rounded-full bg-white flex items-center justify-center text-4xl font-bold text-violet-700 shadow-lg uppercase">
                            {user.name?.charAt(0) || "U"}
                        </div>

                        <h2 className="mt-4 text-2xl font-bold text-white capitalize">
                            {user.name}
                        </h2>

                        <p className="mt-1 text-violet-100">
                            {user.email}
                        </p>

                        <span className="inline-block mt-4 px-5 py-1.5 rounded-full bg-white/20 text-white text-sm font-semibold capitalize">
                            {user.role}
                        </span>

                    </div>

                    {/* Personal Information */}
                    <div className="p-6 sm:p-8">

                        <h3 className="text-xl font-bold text-gray-900 mb-7">
                            Personal Information
                        </h3>

                        <div className="space-y-6">

                            {details.map((detail, index) => {

                                const Icon = detail.icon;

                                return (
                                    <div key={index}>

                                        <div className="flex items-center gap-4">

                                            <div className="w-11 h-11 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
                                                <Icon
                                                    size={21}
                                                    className="text-violet-600"
                                                />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="text-sm text-gray-500 font-medium">
                                                    {detail.label}
                                                </p>

                                                <p className="mt-1 text-gray-900 font-semibold break-all capitalize">
                                                    {detail.value}
                                                </p>
                                            </div>

                                        </div>

                                        {index !== details.length - 1 && (
                                            <hr className="border-gray-100 mt-5" />
                                        )}

                                    </div>
                                );
                            })}

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default UserProfile;