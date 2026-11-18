
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    ShoppingBag,
    ArrowLeft,
    Truck,
    ShieldCheck,
    ShoppingCart,
    Package,
    Plus,
    Minus,
    Trash2,
} from "lucide-react";

import toast from "react-hot-toast";

const Cart = () => {

    // Cart states
    const [cartItems, setCartItems] = useState([]);

    // Price states
    const [subtotal, setSubtotal] = useState(0);
    const [originalTotal, setOriginalTotal] = useState(0);
    const [savings, setSavings] = useState(0);
    const [delivery, setDelivery] = useState(0);
    const [total, setTotal] = useState(0);

    // Loading and error states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // Fetch cart
    const fetchCart = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await fetch("http://localhost:5000/cart", {
                method: "GET",
                credentials: "include",
            });

            const data = await res.json();

            console.log("Cart API Response:", data);

            if (!res.ok) {
                throw new Error(data.message || "Unable to fetch cart");
            }

            const items = data.cart?.items || [];

            setCartItems(items);

            setSubtotal(Number(data.subtotal) || 0);
            setOriginalTotal(Number(data.originalTotal) || 0);
            setSavings(Number(data.savings) || 0);
            setDelivery(Number(data.delivery) || 0);
            setTotal(Number(data.total) || 0);

        } catch (error) {
            console.error("Cart Error:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };


    // Load cart when component mounts
    useEffect(() => {

        fetchCart();

    }, []);

    //remove

    const handleRemoveFromCart = async (prodId) => {
        try {
            const res = await fetch(`http://localhost:5000/cart/${prodId}`, { method: "DELETE", credentials: "include" })
            const data = await res.json()
            console.log(data);
            toast.success("Item removed from cart")
            setCartItems(data.cartItems)
            fetchCart()

        } catch (error) {
            console.log(error);


        }
    }

    useEffect(() => {
        fetchCart()
    }, [])


    //update quantity

    const handleUpdateQuantity=async(prodId,action)=>{
        try {
            const res=await fetch(`http://localhost:5000/cart/${prodId}/${action}`,{method:"PUT" ,credentials:"include"})
            const data=await res.json()
            console.log(data);
            fetchCart()
            
        } catch (error) {
            
        }
    }


    // Format currency
    const formatPrice = (price) => {
        return `₹${Number(price || 0).toLocaleString("en-IN")}`;
    };


    // Loading screen
    if (loading) {

        return (

            <div className="min-h-screen bg-gray-50 flex items-center justify-center">

                <div className="text-center">

                    <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

                    <p className="text-gray-500 font-medium">
                        Loading your cart...
                    </p>

                </div>

            </div>

        );

    }


    // Error screen
    if (error) {

        return (

            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">

                <ShoppingBag
                    size={55}
                    className="text-red-400 mb-4"
                />

                <h2 className="text-xl font-bold text-gray-800 mb-2">
                    Something went wrong
                </h2>

                <p className="text-red-500 mb-5 text-center">
                    {error}
                </p>

                <button
                    onClick={fetchCart}
                    className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl font-semibold"
                >
                    Try Again
                </button>

            </div>

        );

    }


    // Empty cart
    if (cartItems.length === 0) {

        return (

            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

                <div className="text-center max-w-md">

                    <div className="w-28 h-28 mx-auto bg-violet-100 rounded-full flex items-center justify-center mb-6">

                        <ShoppingBag
                            size={48}
                            className="text-violet-600"
                        />

                    </div>

                    <h2 className="text-3xl font-bold text-gray-900 mb-3">
                        Your Cart is Empty
                    </h2>

                    <p className="text-gray-500 mb-8">
                        You haven't added anything to your cart yet.
                        Explore our collection and find something you love!
                    </p>

                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-7 py-3 rounded-xl font-semibold transition"
                    >
                        <ShoppingCart size={19} />
                        Continue Shopping
                    </Link>

                </div>

            </div>

        );

    }


    return (

        <div className="min-h-screen bg-gray-50 py-12">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


                {/* Page Header */}

                <div className="mb-10">

                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-violet-600 mb-5 transition"
                    >
                        <ArrowLeft size={18} />
                        Continue Shopping
                    </Link>

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                        Shopping Cart
                    </h1>

                    <p className="text-gray-500 mt-2">
                        You have {cartItems.length} item(s) in your cart.
                    </p>

                </div>



                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">


                    {/* Cart Products */}

                    <div className="lg:col-span-2 space-y-5">

                        {cartItems.map((item) => {

                            const product = item.product;

                            // Handle missing product data
                            if (!product || typeof product !== "object") {

                                return (

                                    <div
                                        key={item._id}
                                        className="bg-white p-6 rounded-2xl border border-gray-100"
                                    >
                                        <p className="text-red-500">
                                            Product information is unavailable.
                                        </p>

                                    </div>

                                );

                            }


                            return (

                                <div
                                    key={item._id}
                                    className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
                                >

                                    <div className="flex flex-col sm:flex-row gap-5">


                                        {/* Product Image */}

                                        <div className="w-full sm:w-36 h-40 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">

                                            {product.images?.length > 0 ? (

                                                <img
                                                    src={product.images[0]}
                                                    alt={product.productName}
                                                    className="w-full h-full object-cover"
                                                />

                                            ) : (

                                                <div className="w-full h-full flex items-center justify-center">

                                                    <Package
                                                        size={40}
                                                        className="text-gray-400"
                                                    />

                                                </div>

                                            )}

                                        </div>



                                        {/* Product Information */}

                                        <div className="flex-1 flex flex-col justify-between">

                                            <div>

                                                <p className="text-sm text-violet-600 font-semibold mb-1">
                                                    {product.brand}
                                                </p>

                                                <h3 className="text-lg font-bold text-gray-800">
                                                    {product.productName}
                                                </h3>
                                                <button
                                                    onClick={() => handleRemoveFromCart(product._id)}
                                                    className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm font-semibold mt-3 transition"
                                                >
                                                    <Trash2 size={17} />
                                                    Remove
                                                </button>

                                                <p className="text-sm text-gray-500 mt-2">
                                                    Category: {product.category}
                                                </p>

                                            </div>



                                            {/* Quantity and Price */}

                                            <div className="flex flex-wrap items-center justify-between gap-4 mt-5">

                                                <div>

                                                    <p className="text-sm text-gray-500 mb-2">
                                                        Quantity
                                                    </p>

                                                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden w-fit">

                                                        {/* Decrease Quantity */}
                                                        <button
                                                            className="p-2 text-gray-600 hover:bg-violet-100 hover:text-violet-700 transition"

                                                            onClick={()=>handleUpdateQuantity(item.product._id,"decrement" )}
                                                        >
                                                            <Minus size={17} />
                                                        </button>

                                                        {/* Quantity */}
                                                        <span className="px-4 font-semibold text-gray-800">
                                                            {item.quantity}
                                                        </span>

                                                        {/* Increase Quantity */}
                                                        <button
                                                            className="p-2 text-gray-600 hover:bg-violet-100 hover:text-violet-700 transition"
                                                            onClick={()=>handleUpdateQuantity(item.product._id,"increment" )}
                                                        >
                                                            <Plus size={17} />
                                                        </button>

                                                    </div>

                                                </div>


                                                <div className="text-right">

                                                    <p className="text-xl font-bold text-gray-900">
                                                        {formatPrice(item.price * item.quantity)}
                                                    </p>

                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {formatPrice(item.price)} each
                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            );

                        })}

                    </div>




                    {/* Order Summary */}

                    <div className="lg:col-span-1">

                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">

                            <h2 className="text-xl font-bold text-gray-900 mb-6">
                                Order Summary
                            </h2>



                            {/* Subtotal */}

                            <div className="flex justify-between mb-4">

                                <span className="text-gray-500">
                                    Subtotal
                                </span>

                                <span className="font-semibold text-gray-800">
                                    {formatPrice(subtotal)}
                                </span>

                            </div>



                            {/* Original Total */}

                            <div className="flex justify-between mb-4">

                                <span className="text-gray-500">
                                    Original Price
                                </span>

                                <span className="font-semibold text-gray-800">
                                    {formatPrice(originalTotal)}
                                </span>

                            </div>



                            {/* Savings */}

                            <div className="flex justify-between mb-4">

                                <span className="text-gray-500">
                                    Your Savings
                                </span>

                                <span className="font-semibold text-green-600">
                                    -{formatPrice(savings)}
                                </span>

                            </div>



                            {/* Delivery */}

                            <div className="flex justify-between mb-4">

                                <span className="text-gray-500">
                                    Delivery
                                </span>

                                <span className="font-semibold text-gray-800">

                                    {delivery === 0
                                        ? "FREE"
                                        : formatPrice(delivery)
                                    }

                                </span>

                            </div>



                            <div className="border-t border-gray-200 my-5"></div>



                            {/* Final Total */}

                            <div className="flex justify-between items-center mb-6">

                                <span className="text-lg font-bold text-gray-900">
                                    Total
                                </span>

                                <span className="text-2xl font-bold text-violet-600">
                                    {formatPrice(total)}
                                </span>

                            </div>



                            {/* Checkout Button */}

                            <button
                                disabled
                                className="w-full bg-violet-600 text-white py-3.5 rounded-xl font-semibold opacity-60 cursor-not-allowed"
                            >
                                Checkout Coming Soon
                            </button>



                            {/* Benefits */}

                            <div className="mt-7 space-y-4">

                                <div className="flex items-center gap-3 text-sm text-gray-500">

                                    <Truck
                                        size={20}
                                        className="text-violet-600"
                                    />

                                    <span>
                                        Free delivery above ₹999
                                    </span>

                                </div>


                                <div className="flex items-center gap-3 text-sm text-gray-500">

                                    <ShieldCheck
                                        size={20}
                                        className="text-violet-600"
                                    />

                                    <span>
                                        Secure shopping experience
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default Cart;
