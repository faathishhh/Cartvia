import React from 'react'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ShoppingBag } from "lucide-react";
import API_URL from "../../config/api";


const AdminLogin = () => {


    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e) => {

        e.preventDefault()

        try {

            setLoading(true)

            // Login API

            const res = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Login failed");
            }


            // Verify logged-in user's role
            const userRes = await fetch(`${API_URL}/me`, {
                credentials: "include",
            });

            const userData = await userRes.json()

            if (!userRes.ok || userData.user?.role !== "admin") {
                throw new Error("Access denied. Admin account required.")
            }

            toast.success("Welcome to CARTIVA Admin!");
            navigate("/");

        } catch (error) {

            toast.error(error.message);

        } finally {

            setLoading(false);
        }
    }



    return (



        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

            <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">

                <div className="flex justify-center items-center gap-2 mb-6">

                    <ShoppingBag size={32} className="text-violet-700" />

                    <h1 className="text-3xl font-bold">
                        <span className="text-violet-700">CART</span>
                        <span className="text-gray-900">IVA</span>
                    </h1>

                </div>

                <h2 className="text-2xl font-bold text-center text-gray-800">
                    Admin Login
                </h2>

                <p className="text-gray-500 text-center mt-2 mb-8">
                    Login to manage your store
                </p>

                <form onSubmit={handleLogin} className="space-y-5">

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Email Address
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-violet-700 hover:bg-violet-800 text-white font-semibold py-3 rounded-lg transition disabled:opacity-60"
                    >
                        {loading ? "Logging in..." : "Login to Dashboard"}
                    </button>

                </form>

                <p className="text-center text-xs text-gray-400 mt-6">
                    CARTIVA Admin Panel
                </p>

            </div>

        </div>
    )
}

export default AdminLogin