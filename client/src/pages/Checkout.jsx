import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    ArrowLeft,
    MapPin,
    Truck,
    ShieldCheck,
    ShoppingBag,
    CreditCard,
    CheckCircle,
} from "lucide-react";

import toast from "react-hot-toast";
import API_URL from "../config/api";

const Checkout = () => {

    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [placingOrder, setPlacingOrder] = useState(false);

    const [address, setAddress] = useState({
        fullName: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
    });

    // Fetch Cart
    const fetchCart = async () => {
        try {
            const res = await fetch(`${API_URL}/cart`, {
                credentials: "include",
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Unable to fetch cart");
            }

            const items = data.cart?.items || [];

            setCartItems(items);

            if (items.length === 0) {
                toast.error("Your cart is empty");
                navigate("/products");
            }

        } catch (error) {
            toast.error(error.message);
            navigate("/cart");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    // Handle Address Changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setAddress((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Calculate Total
    const subtotal = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const deliveryCharge = subtotal >= 999 ? 0 : 50;

    const totalAmount = subtotal + deliveryCharge;

    const formatPrice = (price) => {
        return `₹${Number(price || 0).toLocaleString("en-IN")}`;
    };

    // Place Order
    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        try {
            setPlacingOrder(true);

            const res = await fetch(`${API_URL}/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    shippingAddress: address,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Unable to place order");
            }

            toast.success("Order placed successfully!");

            navigate("/order-success", {
                state: {
                    order: data.order,
                },
            });

        } catch (error) {
            toast.error(error.message);
        } finally {
            setPlacingOrder(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <Link
                    to="/cart"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-violet-600 mb-6"
                >
                    <ArrowLeft size={18} />
                    Back to Cart
                </Link>

                <div className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                        Checkout
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Complete your delivery information and place your order.
                    </p>
                </div>

                <form onSubmit={handlePlaceOrder}>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Delivery Address */}

                        <div className="lg:col-span-2">

                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">

                                <div className="flex items-center gap-3 mb-7">

                                    <div className="bg-violet-100 p-3 rounded-xl">
                                        <MapPin className="text-violet-700" size={22} />
                                    </div>

                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            Delivery Address
                                        </h2>

                                        <p className="text-sm text-gray-500">
                                            Enter your shipping information.
                                        </p>
                                    </div>

                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                    {/* Full Name */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Full Name
                                        </label>

                                        <input
                                            type="text"
                                            name="fullName"
                                            value={address.fullName}
                                            onChange={handleChange}
                                            placeholder="Enter your full name"
                                            required
                                            className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
                                        />
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Phone Number
                                        </label>

                                        <input
                                            type="tel"
                                            name="phone"
                                            value={address.phone}
                                            onChange={handleChange}
                                            placeholder="Enter phone number"
                                            pattern="[0-9]{10}"
                                            maxLength="10"
                                            required
                                            className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
                                        />
                                    </div>

                                    {/* Street */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Street / Address
                                        </label>

                                        <input
                                            type="text"
                                            name="street"
                                            value={address.street}
                                            onChange={handleChange}
                                            placeholder="House name, street"
                                            required
                                            className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
                                        />
                                    </div>

                                    {/* City */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            City
                                        </label>

                                        <input
                                            type="text"
                                            name="city"
                                            value={address.city}
                                            onChange={handleChange}
                                            placeholder="Enter city"
                                            required
                                            className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
                                        />
                                    </div>

                                    {/* State */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            State
                                        </label>

                                        <input
                                            type="text"
                                            name="state"
                                            value={address.state}
                                            onChange={handleChange}
                                            placeholder="Enter state"
                                            required
                                            className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
                                        />
                                    </div>

                                    {/* Pincode */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Pincode
                                        </label>

                                        <input
                                            type="text"
                                            name="pincode"
                                            value={address.pincode}
                                            onChange={handleChange}
                                            placeholder="Enter pincode"
                                            pattern="[0-9]{6}"
                                            maxLength="6"
                                            required
                                            className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
                                        />
                                    </div>

                                    {/* Country */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Country
                                        </label>

                                        <input
                                            type="text"
                                            name="country"
                                            value={address.country}
                                            onChange={handleChange}
                                            required
                                            className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
                                        />
                                    </div>

                                </div>

                            </div>

                            {/* Payment Method */}

                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mt-6">

                                <div className="flex items-center gap-3 mb-5">

                                    <div className="bg-green-100 p-3 rounded-xl">
                                        <CreditCard className="text-green-700" size={22} />
                                    </div>

                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            Payment Method
                                        </h2>

                                        <p className="text-sm text-gray-500">
                                            Choose your payment option.
                                        </p>
                                    </div>

                                </div>

                                <div className="border-2 border-violet-500 bg-violet-50 rounded-xl p-4 flex items-center justify-between">

                                    <div className="flex items-center gap-3">

                                        <div className="w-5 h-5 rounded-full border-2 border-violet-600 flex items-center justify-center">
                                            <div className="w-2.5 h-2.5 rounded-full bg-violet-600"></div>
                                        </div>

                                        <div>
                                            <p className="font-semibold text-gray-800">
                                                Cash on Delivery
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                Pay when your order arrives.
                                            </p>
                                        </div>

                                    </div>

                                    <CheckCircle className="text-violet-600" />

                                </div>

                            </div>

                        </div>

                        {/* Order Summary */}

                        <div>

                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">

                                <h2 className="text-xl font-bold text-gray-900 mb-6">
                                    Order Summary
                                </h2>

                                <div className="space-y-5 mb-6">

                                    {cartItems.map((item) => (

                                        <div
                                            key={item._id}
                                            className="flex items-center gap-4"
                                        >

                                            <img
                                                src={item.product?.images?.[0]}
                                                alt={item.product?.productName}
                                                className="w-16 h-16 rounded-xl object-cover bg-gray-100"
                                            />

                                            <div className="flex-1 min-w-0">

                                                <p className="font-semibold text-gray-800 truncate">
                                                    {item.product?.productName || "Product"}
                                                </p>

                                                <p className="text-sm text-gray-500">
                                                    Qty: {item.quantity}
                                                </p>

                                            </div>

                                            <p className="font-semibold text-gray-800">
                                                {formatPrice(item.price * item.quantity)}
                                            </p>

                                        </div>

                                    ))}

                                </div>

                                <div className="border-t border-gray-200 pt-5 space-y-4">

                                    <div className="flex justify-between text-gray-500">
                                        <span>Subtotal</span>
                                        <span className="font-semibold text-gray-800">
                                            {formatPrice(subtotal)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between text-gray-500">
                                        <span>Delivery</span>
                                        <span className="font-semibold text-gray-800">
                                            {deliveryCharge === 0
                                                ? "FREE"
                                                : formatPrice(deliveryCharge)}
                                        </span>
                                    </div>

                                    <div className="border-t border-gray-200 pt-4 flex justify-between">
                                        <span className="font-bold text-gray-900">
                                            Total
                                        </span>

                                        <span className="text-2xl font-bold text-violet-600">
                                            {formatPrice(totalAmount)}
                                        </span>
                                    </div>

                                </div>

                                <button
                                    type="submit"
                                    disabled={placingOrder}
                                    className="w-full mt-7 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white py-4 rounded-xl font-semibold transition"
                                >
                                    {placingOrder
                                        ? "Placing Order..."
                                        : "Place Order"}
                                </button>

                                <div className="mt-6 space-y-4">

                                    <div className="flex items-center gap-3 text-sm text-gray-500">
                                        <Truck size={19} className="text-violet-600" />
                                        Free delivery above ₹999
                                    </div>

                                    <div className="flex items-center gap-3 text-sm text-gray-500">
                                        <ShieldCheck size={19} className="text-violet-600" />
                                        Secure checkout
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default Checkout;