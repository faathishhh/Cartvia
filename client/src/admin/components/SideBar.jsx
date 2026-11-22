
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Tags,
    ChartNoAxesCombined,
    Settings,
    LogOut,
    ShoppingBag,
    UserRound
} from "lucide-react";

import API_URL from "../../config/api";


const SideBar = () => {

    const navigate = useNavigate();

    const menuItems = [
        {
            name: "Dashboard",
            path: "/admin",
            icon: LayoutDashboard,
        },
        {
            name: "Products",
            path: "/admin/products",
            icon: Package,
        },
        {
            name: "Add Product",
            path: "/admin/products/add",
            icon: ShoppingBag,
        },
        {
            name: "Orders",
            path: "/admin/orders",
            icon: ShoppingCart,
        },
        {
            name: "Customers",
            path: "/admin/customers",
            icon: Users,
        },
        {
            name: "Categories",
            path: "/admin/categories",
            icon: Tags,
        },
        {
            name: "Analytics",
            path: "/admin/analytics",
            icon: ChartNoAxesCombined,
        },
        {
            name: "Settings",
            path: "/admin/settings",
            icon: Settings,
        },
    ];

    const handleLogout = async () => {
        try {
            const res = await fetch(`${API_URL}/logout`, {
                method: "POST",
                credentials: "include",
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Logout failed");
            }

            toast.success("Logged out successfully!");
            navigate("/");

        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <aside className="w-64 min-h-screen bg-white border-r border-gray-200 p-5 flex flex-col">

            {/* Logo */}
            <div className="flex items-center gap-2 mb-10">
                <div className="bg-gradient-to-br from-violet-600 to-purple-800 
                    text-white p-2.5 rounded-xl shadow-md
                    group-hover:shadow-violet-300 
                    group-hover:scale-105 transition-all duration-300">

                    <ShoppingBag size={27} strokeWidth={2.2} />

                </div>

                <div className="flex flex-col">

                    <h1 className="text-3xl font-extrabold tracking-tight leading-none">

                        <span className="text-violet-700">CART</span>
                        <span className="text-gray-900">VIA</span>

                    </h1>

                    <span className="text-[9px] tracking-[3px] font-semibold 
                         text-gray-400 mt-1">
                        SHOP YOUR STYLE
                    </span>

                </div>
            </div>

            {/* Menu */}
            <nav className="space-y-2 flex-1">

                {menuItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            end={item.path === "/admin"}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive
                                    ? "bg-violet-700 text-white"
                                    : "text-gray-600 hover:bg-violet-50 hover:text-violet-700"
                                }`
                            }
                        >
                            <Icon size={20} />
                            <span className="font-medium">{item.name}</span>
                        </NavLink>
                    );
                })}

            </nav>

            {/* Admin Account */}
            <div className="border-t border-gray-200 pt-5 mt-5">

                <div className="flex items-center gap-3 px-3 py-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                        <UserRound className="text-violet-700" size={21} />
                    </div>

                    <div>
                        <p className="font-semibold text-gray-800 text-sm">
                            Administrator
                        </p>
                        <p className="text-xs text-gray-500">
                            CARTIVA Admin
                        </p>
                    </div>
                </div>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 text-red-500 hover:bg-red-50 w-full px-4 py-3 rounded-lg transition"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>

            </div>

        </aside>
    );
};

export default SideBar;
