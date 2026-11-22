import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
    ShoppingBag,
    ShoppingCart,
    Search,
    Menu,
    X,
    UserRound,
    Package,
} from "lucide-react";
import API_URL from "../config/api";



const NavBar = () => {

    const [cartCount, setCartCount] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [search, setSearch] = useState("");

    const navigate = useNavigate();


    // Fetch cart count
    const fetchCartCount = async () => {
        try {
            const res = await fetch(`${API_URL}/cart`, {
                method: "GET",
                credentials: "include",
            });

            const data = await res.json();

            if (res.ok && data.success) {
                const items = data.cart?.items || [];

                const totalQuantity = items.reduce(
                    (total, item) => total + item.quantity,
                    0
                );

                setCartCount(totalQuantity);
            }

        } catch (error) {
            console.log("Cart count error:", error);
        }
    };


    // Fetch cart count when component mounts
    useEffect(() => {
        fetchCartCount();

        const handleCartUpdate = () => {
            fetchCartCount();
        };

        window.addEventListener("cartUpdated", handleCartUpdate);

        return () => {
            window.removeEventListener("cartUpdated", handleCartUpdate);
        };

    }, []);


    // Logout functionality
    const handleLogout = async () => {
        try {
            const res = await fetch(`${API_URL}/logout`, {
                method: "POST",
                credentials: "include",
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Logged out successfully");

                setCartCount(0);
                setIsMenuOpen(false);

                navigate("/login");
            } else {
                toast.error(data.message || "Logout failed");
            }

        } catch (error) {
            console.log("Logout error:", error);
            toast.error("Something went wrong");
        }
    };


    // Search functionality
    const handleSearch = (e) => {
        e.preventDefault();

        if (search.trim()) {
            navigate(`/products?search=${encodeURIComponent(search.trim())}`);

            setSearch("");
            setIsMenuOpen(false);
        }
    };


    // Navigation link styling
    const navLinkStyle = ({ isActive }) =>
        `transition-all duration-200 ${isActive
            ? "text-blue-600 font-semibold"
            : "text-gray-600 hover:text-blue-600"
        }`;


    return (

        <nav className="sticky top-0 z-50 bg-white shadow-sm">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex items-center justify-between h-20">


                    {/* LOGO */}

                    <Link
                        to="/"
                        className="flex items-center gap-2.5 group"
                    >

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

                            <span className="text-[9px] tracking-[3px] font-semibold text-gray-400 mt-1">
                                SHOP YOUR STYLE
                            </span>

                        </div>

                    </Link>


                    {/* DESKTOP NAVIGATION */}

                    <div className="hidden md:flex items-center gap-8">

                        <NavLink to="/" className={navLinkStyle}>
                            Home
                        </NavLink>

                        <NavLink to="/products" className={navLinkStyle}>
                            Products
                        </NavLink>

                        <NavLink to="/categories" className={navLinkStyle}>
                            Categories
                        </NavLink>

                        <NavLink to="/my-orders" className={navLinkStyle}>
                            My Orders
                        </NavLink>

                    </div>


                    {/* DESKTOP SEARCH */}

                    <form
                        onSubmit={handleSearch}
                        className="hidden lg:flex items-center bg-gray-100 rounded-full px-4 py-2 w-64"
                    >

                        <Search size={18} className="text-gray-500" />

                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-transparent outline-none px-3 w-full text-sm"
                        />

                    </form>


                    {/* RIGHT SIDE */}

                    <div className="hidden md:flex items-center gap-6">


                        {/* CART */}

                        <Link
                            to="/cart"
                            className="relative text-gray-700 hover:text-blue-600 transition"
                        >

                            <ShoppingCart size={24} />

                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-3 bg-blue-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                    {cartCount > 99 ? "99+" : cartCount}
                                </span>
                            )}

                        </Link>


                        {/* PROFILE */}

                        <Link
                            to="/profile"
                            className="text-gray-700 hover:text-blue-600 transition"
                        >
                            <UserRound size={24} />
                        </Link>


                        {/* LOGOUT */}

                        <button
                            onClick={handleLogout}
                            className="text-gray-600 hover:text-blue-600 font-medium"
                        >
                            Logout
                        </button>

                    </div>


                    {/* MOBILE MENU BUTTON */}

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden text-gray-700"
                    >

                        {isMenuOpen ? (
                            <X size={27} />
                        ) : (
                            <Menu size={27} />
                        )}

                    </button>

                </div>


                {/* MOBILE MENU */}

                {isMenuOpen && (

                    <div className="md:hidden border-t border-gray-100 py-5 space-y-5">


                        {/* MOBILE SEARCH */}

                        <form
                            onSubmit={handleSearch}
                            className="flex items-center bg-gray-100 rounded-full px-4 py-3"
                        >

                            <Search size={18} className="text-gray-500" />

                            <input
                                type="text"
                                placeholder="Search products..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="bg-transparent outline-none px-3 w-full text-sm"
                            />

                        </form>


                        {/* MOBILE LINKS */}

                        <div className="flex flex-col gap-5">

                            <NavLink
                                to="/"
                                className={navLinkStyle}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Home
                            </NavLink>


                            <NavLink
                                to="/products"
                                className={navLinkStyle}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Products
                            </NavLink>


                            <NavLink
                                to="/categories"
                                className={navLinkStyle}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Categories
                            </NavLink>


                            {/* MOBILE MY ORDERS */}

                            <NavLink
                                to="/my-orders"
                                className="flex items-center gap-3 text-gray-600 hover:text-blue-600"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <Package size={20} />
                                My Orders
                            </NavLink>


                            {/* MOBILE CART */}

                            <Link
                                to="/cart"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-3 text-gray-600 hover:text-blue-600"
                            >
                                <ShoppingCart size={20} />
                                Cart ({cartCount})
                            </Link>


                            {/* MOBILE PROFILE */}

                            <Link
                                to="/profile"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-3 text-gray-600 hover:text-blue-600"
                            >
                                <UserRound size={20} />
                                My Profile
                            </Link>


                            {/* MOBILE LOGOUT */}

                            <button
                                onClick={handleLogout}
                                className="text-left text-gray-600 hover:text-blue-600"
                            >
                                Logout
                            </button>

                        </div>

                    </div>

                )}

            </div>

        </nav>

    );

};


export default NavBar;