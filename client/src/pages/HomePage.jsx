
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import {
    ArrowRight,
    ShoppingBag,
    Truck,
    ShieldCheck,
    Headphones,
    Star,
    Sparkles,
    CreditCard,
    Heart,
    MoveRight,
    Zap,
    Gift,
    CheckCircle,
    ArrowUpRight,
    Package,
    RefreshCw,
} from "lucide-react";

import API_URL from "../config/api";

// ===============================
// CARTVIA CATEGORIES
// ===============================

const categories = [
    {
        name: "Makeup",
        subtitle: "Beauty essentials",
        image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800",
    },
    {
        name: "Perfume",
        subtitle: "Find your signature scent",
        image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800",
    },
    {
        name: "Skincare",
        subtitle: "Your everyday glow",
        image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800",
    },
    {
        name: "Clothing",
        subtitle: "Everyday fashion",
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800",
    },
    {
        name: "Footwear",
        subtitle: "Step up your style",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
    },
    {
        name: "Accessories",
        subtitle: "The finishing touch",
        image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800",
    },
    {
        name: "Smartphone",
        subtitle: "Smart technology",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
    },
    {
        name: "Laptop",
        subtitle: "Power your productivity",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
    },
    {
        name: "Furniture",
        subtitle: "Comfort meets design",
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
    },
    {
        name: "Home Decor",
        subtitle: "Make your space yours",
        image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",
    },
];

// ===============================
// TRUST FEATURES
// ===============================

const trustFeatures = [
    {
        icon: Truck,
        title: "Convenient Delivery",
        description: "Delivery options for your orders",
    },
    {
        icon: ShieldCheck,
        title: "Secure Shopping",
        description: "Shop with confidence",
    },
    {
        icon: CreditCard,
        title: "Easy Checkout",
        description: "A smooth shopping experience",
    },
    {
        icon: Headphones,
        title: "Customer Support",
        description: "We're here to help",
    },
];

// ===============================
// PRODUCT SKELETON
// ===============================

const ProductSkeleton = () => {
    return (
        <div className="animate-pulse">
            <div className="aspect-[4/5] bg-gray-200 rounded-2xl"></div>

            <div className="mt-4 space-y-3">
                <div className="h-3 w-24 bg-gray-200 rounded"></div>
                <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
                <div className="h-5 w-1/2 bg-gray-200 rounded"></div>
                <div className="h-10 w-full bg-gray-200 rounded-xl mt-5"></div>
            </div>
        </div>
    );
};

// ===============================
// PRODUCT CARD
// ===============================

const ProductCard = ({ product }) => {
    const [imageError, setImageError] = useState(false);

    const image = product.images?.[0];

    const hasDiscount =
        product.discountPrice != null &&
        Number(product.discountPrice) < Number(product.price);

    const finalPrice = hasDiscount
        ? Number(product.discountPrice)
        : Number(product.price || 0);

    const discountPercentage = hasDiscount
        ? Math.round(
            ((Number(product.price) - Number(product.discountPrice)) /
                Number(product.price)) *
            100
        )
        : 0;

    return (
        <div className="group min-w-0">

            {/* Product Image */}

            <Link
                to={`/products/${product._id}`}
                className="relative block overflow-hidden rounded-2xl bg-[#F5F3F9]"
            >

                <div className="aspect-[4/5] overflow-hidden">

                    {image && !imageError ? (
                        <img
                            src={image}
                            alt={product.productName}
                            loading="lazy"
                            onError={() => setImageError(true)}
                            className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag
                                size={50}
                                className="text-violet-300"
                            />
                        </div>
                    )}

                </div>

                {/* Discount Badge */}

                {hasDiscount && (
                    <span className="absolute top-4 left-4 bg-[#EDE5FF] text-violet-800 text-xs font-bold px-3 py-2 rounded-full">
                        -{discountPercentage}%
                    </span>
                )}

                {!hasDiscount && product.isFeatured && (
                    <span className="absolute top-4 left-4 bg-white text-gray-800 text-xs font-bold px-3 py-2 rounded-full shadow-sm">
                        Featured
                    </span>
                )}

                {/* Wishlist Icon */}

                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-gray-700 shadow-sm transition group-hover:text-violet-700">
                    <Heart size={18} />
                </div>

                {/* Hover Button */}

                <div className="absolute bottom-4 left-4 right-4 translate-y-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">

                    <div className="bg-white text-gray-900 text-sm font-semibold py-3 rounded-xl text-center shadow-lg">
                        View Product
                    </div>

                </div>

            </Link>

            {/* Product Details */}

            <div className="pt-4">

                <p className="text-xs font-semibold uppercase tracking-wider text-violet-700">
                    {product.brand || product.category}
                </p>

                <Link to={`/products/${product._id}`}>
                    <h3 className="text-gray-900 font-semibold text-base mt-2 line-clamp-1 hover:text-violet-700 transition">
                        {product.productName}
                    </h3>
                </Link>

                {/* Rating */}

                <div className="flex items-center gap-1.5 mt-2">

                    <Star
                        size={14}
                        fill="currentColor"
                        className="text-amber-400"
                    />

                    <span className="text-sm font-medium text-gray-700">
                        {product.ratings || "0"}
                    </span>

                    <span className="text-xs text-gray-400">
                        ({product.numReviews || 0})
                    </span>

                </div>

                {/* Price */}

                <div className="flex flex-wrap items-center gap-2 mt-3">

                    <span className="text-lg font-bold text-gray-900">
                        ₹{finalPrice.toLocaleString("en-IN")}
                    </span>

                    {hasDiscount && (
                        <span className="text-sm text-gray-400 line-through">
                            ₹{Number(product.price).toLocaleString("en-IN")}
                        </span>
                    )}

                </div>

            </div>

        </div>
    );
};

// ===============================
// HOME PAGE
// ===============================

const Home = () => {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ===============================
    // FETCH PRODUCTS
    // ===============================

    useEffect(() => {

        const fetchProducts = async () => {

            try {

                setLoading(true);
                setError("");

                const res = await fetch(`${API_URL}/products`);

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(
                        data.message || "Failed to fetch products"
                    );
                }

                const productList = Array.isArray(data)
                    ? data
                    : data.products || data.data || [];

                if (!Array.isArray(productList)) {
                    throw new Error("Invalid products response");
                }

                setProducts(productList);

            } catch (error) {

                console.error("Home Products Error:", error);

                setError(
                    error.message || "Something went wrong"
                );

            } finally {

                setLoading(false);

            }

        };

        fetchProducts();

    }, []);

    // ===============================
    // FEATURED PRODUCTS
    // ===============================

    const featuredProducts = products
        .filter(
            (product) =>
                product.isFeatured &&
                product.isActive !== false
        )
        .slice(0, 4);

    const displayProducts =
        featuredProducts.length > 0
            ? featuredProducts
            : products
                .filter(
                    (product) =>
                        product.isActive !== false
                )
                .slice(0, 4);

    return (

        <main className="bg-white text-gray-900">

            {/* ==================================
                PREMIUM HERO SECTION
            ================================== */}

            {/* HERO SECTION */}
            {/* PROFESSIONAL HERO SECTION */}

            <section className="relative isolate overflow-hidden rounded-[28px] bg-[#f7f4ff]">

                {/* Background decoration */}
                <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-purple-200/40 blur-3xl"></div>
                <div className="absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-pink-200/30 blur-3xl"></div>

                <div className="relative grid items-center gap-12 px-6 py-14 sm:px-10 lg:grid-cols-2 lg:px-16 lg:py-20">

                    {/* LEFT CONTENT */}

                    <div className="z-10">

                        <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[2px] text-purple-700 shadow-sm">
                            <Sparkles size={15} />
                            Welcome to CARTVIA
                        </div>

                        <h1 className="mt-7 text-4xl font-extrabold leading-[1.15] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">

                            Discover Your
                            <span className="block text-purple-700">
                                Style. Your Way.
                            </span>

                        </h1>

                        <p className="mt-6 max-w-lg text-base leading-8 text-gray-600 sm:text-lg">
                            From everyday essentials to your favourite finds,
                            explore a world of products designed to make
                            shopping simple, exciting and effortless.
                        </p>

                        {/* BUTTONS */}

                        <div className="mt-9 flex flex-wrap items-center gap-4">

                            <Link
                                to="/products"
                                className="group inline-flex items-center gap-3 rounded-xl bg-purple-700 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-purple-200 transition duration-300 hover:-translate-y-1 hover:bg-purple-800"
                            >
                                Explore Products

                                <ArrowRight
                                    size={18}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </Link>

                            <Link
                                to="/categories"
                                className="rounded-xl border border-gray-300 bg-white px-7 py-4 text-sm font-bold text-gray-800 transition duration-300 hover:border-purple-400 hover:text-purple-700"
                            >
                                Browse Categories
                            </Link>

                        </div>

                        {/* TRUST INDICATORS */}

                        <div className="mt-10 flex flex-wrap gap-x-7 gap-y-4 border-t border-purple-200 pt-7">

                            <div className="flex items-center gap-2">
                                <ShieldCheck size={20} className="text-purple-700" />
                                <span className="text-sm font-medium text-gray-600">
                                    Secure Shopping
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <ShoppingBag size={20} className="text-purple-700" />
                                <span className="text-sm font-medium text-gray-600">
                                    Multiple Categories
                                </span>
                            </div>

                        </div>

                    </div>


                    {/* RIGHT IMAGE */}

                    <div className="relative mx-auto w-full max-w-[520px] lg:ml-auto">

                        {/* Main image */}

                        <div className="relative overflow-hidden rounded-[28px] shadow-2xl shadow-purple-200/60">

                            <img
                                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=85"
                                alt="Fashion and lifestyle shopping"
                                className="h-[360px] w-full object-cover sm:h-[450px]"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>

                        </div>


                        {/* SALE BADGE */}

                        <div className="absolute -right-4 -top-5 flex h-24 w-24 flex-col items-center justify-center rounded-full bg-purple-700 text-white shadow-xl sm:-right-6 sm:h-28 sm:w-28">

                            <span className="text-[10px] font-semibold uppercase tracking-widest">
                                Discover
                            </span>

                            <span className="text-2xl font-extrabold tracking-wide">
                                MORE
                            </span>

                            <span className="text-[9px] font-medium">
                                WITH CARTVIA
                            </span>

                        </div>


                        {/* FLOATING PROMO CARD */}

                        <div className="absolute -bottom-6 -left-3 flex items-center gap-3 rounded-2xl border border-white bg-white p-4 shadow-xl sm:-left-8 sm:p-5">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                                <Gift size={24} />
                            </div>

                            <div>
                                <p className="text-sm font-bold text-gray-900">
                                    Find Your Favourites
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                    Something for everyone.
                                </p>
                            </div>

                        </div>

                    </div>

                </div>

            </section>

            {/* ==================================
                TRUST FEATURES
            ================================== */}

            <section className="max-w-7xl mx-auto px-5 sm:px-8 py-10 lg:py-14">

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

                    {trustFeatures.map((feature) => {

                        const Icon = feature.icon;

                        return (

                            <div
                                key={feature.title}
                                className="flex items-start gap-3"
                            >

                                <div className="w-12 h-12 shrink-0 rounded-xl bg-violet-50 flex items-center justify-center">

                                    <Icon
                                        size={23}
                                        className="text-violet-700"
                                    />

                                </div>

                                <div>

                                    <h3 className="font-bold text-sm sm:text-base text-gray-900">
                                        {feature.title}
                                    </h3>

                                    <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-5">
                                        {feature.description}
                                    </p>

                                </div>

                            </div>

                        );

                    })}

                </div>

            </section>


            {/* ==================================
                CATEGORIES
            ================================== */}

            <section className="bg-[#FAF9FC] py-16 lg:py-20">

                <div className="max-w-7xl mx-auto px-5 sm:px-8">

                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-9">

                        <div>

                            <p className="text-violet-700 text-xs font-bold uppercase tracking-[3px]">
                                Find your favourites
                            </p>

                            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3">
                                Shop by Category
                            </h2>

                            <p className="text-gray-500 mt-3">
                                Explore a collection for every part of your life.
                            </p>

                        </div>

                        <Link
                            to="/categories"
                            className="inline-flex items-center gap-2 text-violet-700 font-bold hover:gap-4 transition-all"
                        >

                            View All

                            <MoveRight size={19} />

                        </Link>

                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">

                        {categories.map((category) => (

                            <Link
                                key={category.name}
                                to={`/products?category=${encodeURIComponent(category.name)}`}
                                className="group"
                            >

                                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gray-200">

                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        loading="lazy"
                                        className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>

                                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 text-white">

                                        <h3 className="font-bold text-lg sm:text-xl">
                                            {category.name}
                                        </h3>

                                        <p className="text-white/80 text-xs sm:text-sm mt-1">
                                            {category.subtitle}
                                        </p>

                                        <div className="w-9 h-9 rounded-full bg-white text-gray-900 flex items-center justify-center mt-4 transition group-hover:bg-violet-700 group-hover:text-white">

                                            <ArrowUpRight size={17} />

                                        </div>

                                    </div>

                                </div>

                            </Link>

                        ))}

                    </div>

                </div>

            </section>


            {/* ==================================
                FEATURED PRODUCTS
            ================================== */}

            <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16 lg:py-20">

                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-10">

                    <div>

                        <div className="inline-flex items-center gap-2 text-violet-700">

                            <Zap size={17} />

                            <p className="text-xs font-bold uppercase tracking-[3px]">
                                Worth a closer look
                            </p>

                        </div>

                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3">
                            Featured Products
                        </h2>

                        <p className="text-gray-500 mt-3">
                            Products selected for your next discovery.
                        </p>

                    </div>

                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 text-violet-700 font-bold hover:gap-4 transition-all"
                    >

                        Shop All Products

                        <ArrowRight size={19} />

                    </Link>

                </div>


                {/* Loading State */}

                {loading ? (

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-7">

                        {[1, 2, 3, 4].map((item) => (
                            <ProductSkeleton key={item} />
                        ))}

                    </div>

                ) : error ? (

                    /* Error State */

                    <div className="text-center py-16 bg-[#FAF9FC] rounded-2xl">

                        <ShoppingBag
                            size={45}
                            className="mx-auto text-violet-300"
                        />

                        <h3 className="text-xl font-bold mt-4">
                            Products are temporarily unavailable
                        </h3>

                        <p className="text-gray-500 mt-2">
                            Please try again in a little while.
                        </p>

                        <button
                            onClick={() => window.location.reload()}
                            className="inline-flex items-center gap-2 mt-5 bg-violet-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-violet-800 transition"
                        >

                            <RefreshCw size={16} />

                            Try Again

                        </button>

                    </div>

                ) : displayProducts.length > 0 ? (

                    /* Products */

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-7">

                        {displayProducts.map((product) => (

                            <ProductCard
                                key={product._id}
                                product={product}
                            />

                        ))}

                    </div>

                ) : (

                    /* Empty State */

                    <div className="text-center py-16 bg-[#FAF9FC] rounded-2xl">

                        <ShoppingBag
                            size={45}
                            className="mx-auto text-violet-300"
                        />

                        <h3 className="text-xl font-bold mt-4">
                            Products Coming Soon
                        </h3>

                        <p className="text-gray-500 mt-2">
                            We're getting the store ready for you.
                        </p>

                        <Link
                            to="/products"
                            className="inline-flex mt-5 bg-violet-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-violet-800 transition"
                        >

                            Explore Shop

                        </Link>

                    </div>

                )}

            </section>


            {/* ==================================
                PROMOTIONAL BANNER
            ================================== */}

            <section className="max-w-7xl mx-auto px-5 sm:px-8 pb-16 lg:pb-20">

                <div className="relative overflow-hidden rounded-[28px] bg-[#21103D]">

                    <div className="absolute -right-20 -top-32 w-80 h-80 rounded-full bg-violet-500/20 blur-3xl"></div>

                    <div className="absolute right-40 -bottom-40 w-80 h-80 rounded-full bg-purple-400/20 blur-3xl"></div>

                    <div className="relative z-10 grid md:grid-cols-2 items-center gap-10 px-7 py-12 sm:px-12 lg:px-16 lg:py-16">

                        <div className="text-white">

                            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-2 rounded-full text-sm font-semibold">

                                <Gift size={17} />

                                Your next favourite is waiting

                            </div>

                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mt-6">

                                Discover more.

                                <br />

                                Shop your way.

                            </h2>

                            <p className="text-violet-200 leading-7 mt-5 max-w-lg">

                                Explore a world of beauty, fashion,
                                technology and everyday essentials
                                all in one place.

                            </p>

                            <Link
                                to="/products"
                                className="inline-flex items-center gap-3 bg-white text-violet-800 px-7 py-4 rounded-xl font-bold mt-8 hover:bg-violet-100 transition"
                            >

                                Explore CARTVIA

                                <ArrowRight size={19} />

                            </Link>

                        </div>

                        <div className="hidden md:flex justify-center">

                            <div className="relative w-72 h-72 rounded-full border border-white/20 bg-white/5 flex items-center justify-center">

                                <div className="w-56 h-56 rounded-full border border-white/20 bg-white/5 flex flex-col items-center justify-center text-white">

                                    <ShoppingBag size={48} />

                                    <h3 className="text-3xl font-extrabold mt-5">
                                        CARTVIA
                                    </h3>

                                    <p className="text-violet-200 text-xs tracking-[3px] mt-2">
                                        SHOP YOUR WAY
                                    </p>

                                </div>

                                <div className="absolute top-7 right-2 w-12 h-12 rounded-full bg-violet-500 flex items-center justify-center text-white shadow-lg">

                                    <Sparkles size={22} />

                                </div>

                                <div className="absolute bottom-10 left-0 w-12 h-12 rounded-full bg-white flex items-center justify-center text-violet-700 shadow-lg">

                                    <Heart size={21} />

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* ==================================
                WHY CHOOSE CARTVIA
            ================================== */}

            <section className="bg-[#FAF9FC] py-16 lg:py-20">

                <div className="max-w-7xl mx-auto px-5 sm:px-8">

                    <div className="max-w-2xl mx-auto text-center">

                        <p className="text-violet-700 text-xs font-bold uppercase tracking-[3px]">
                            The CARTVIA experience
                        </p>

                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-4">
                            Shopping, made simple.
                        </h2>

                        <p className="text-gray-500 mt-4 leading-7">

                            Discover products, explore collections and
                            find everything you need in one convenient place.

                        </p>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">

                        <div className="bg-white rounded-2xl p-7 border border-gray-100">

                            <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">

                                <Package
                                    size={24}
                                    className="text-violet-700"
                                />

                            </div>

                            <h3 className="font-bold text-lg mt-5">
                                Explore More
                            </h3>

                            <p className="text-gray-500 text-sm leading-6 mt-3">

                                Browse different categories and discover
                                products for your everyday needs.

                            </p>

                        </div>

                        <div className="bg-white rounded-2xl p-7 border border-gray-100">

                            <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">

                                <ShoppingBag
                                    size={24}
                                    className="text-violet-700"
                                />

                            </div>

                            <h3 className="font-bold text-lg mt-5">
                                Easy Shopping
                            </h3>

                            <p className="text-gray-500 text-sm leading-6 mt-3">

                                Find your favourites and add them
                                to your shopping cart with ease.

                            </p>

                        </div>

                        <div className="bg-white rounded-2xl p-7 border border-gray-100">

                            <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">

                                <CheckCircle
                                    size={24}
                                    className="text-violet-700"
                                />

                            </div>

                            <h3 className="font-bold text-lg mt-5">
                                Simple Experience
                            </h3>

                            <p className="text-gray-500 text-sm leading-6 mt-3">

                                Enjoy a clean and convenient shopping
                                experience across your devices.

                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* ==================================
                FINAL CALL TO ACTION
            ================================== */}

            <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16 lg:py-20">

                <div className="text-center">

                    <p className="text-violet-700 text-xs font-bold uppercase tracking-[3px]">
                        Your next discovery starts here
                    </p>

                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-4">

                        Ready to find your favourites?

                    </h2>

                    <p className="text-gray-500 mt-4 max-w-xl mx-auto leading-7">

                        Explore the CARTVIA collection and discover
                        products you'll love.

                    </p>

                    <Link
                        to="/products"
                        className="inline-flex items-center gap-3 bg-violet-700 text-white px-8 py-4 rounded-xl font-bold mt-8 hover:bg-violet-800 transition shadow-lg shadow-violet-200"
                    >

                        Start Shopping

                        <ArrowRight size={19} />

                    </Link>

                </div>

            </section>

        </main>

    );
};

export default Home;
