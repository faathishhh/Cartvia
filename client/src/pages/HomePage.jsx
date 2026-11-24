
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
    PackageSearch,
} from "lucide-react";

import API_URL from "../config/api";

// =====================================
// TRUST FEATURES
// =====================================

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

// =====================================
// PRODUCT SKELETON
// =====================================

const ProductSkeleton = () => (
    <div className="animate-pulse">
        <div className="aspect-[4/5] rounded-2xl bg-gray-200" />

        <div className="mt-4 space-y-3">
            <div className="h-3 w-24 rounded bg-gray-200" />
            <div className="h-5 w-3/4 rounded bg-gray-200" />
            <div className="h-5 w-1/2 rounded bg-gray-200" />
            <div className="mt-5 h-10 w-full rounded-xl bg-gray-200" />
        </div>
    </div>
);

// =====================================
// PRODUCT CARD
// =====================================

const ProductCard = ({ product }) => {

    const [imageError, setImageError] = useState(false);

    const image = product.images?.[0];

    const hasDiscount =
        product.discountPrice != null &&
        Number(product.discountPrice) > 0 &&
        Number(product.discountPrice) < Number(product.price);

    const finalPrice = hasDiscount
        ? Number(product.discountPrice)
        : Number(product.price || 0);

    const discountPercentage = hasDiscount
        ? Math.round(
            ((Number(product.price) - Number(product.discountPrice)) /
                Number(product.price)) * 100
        )
        : 0;

    return (
        <div className="group min-w-0">

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
                            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        />

                    ) : (

                        <div className="flex h-full w-full items-center justify-center">
                            <ShoppingBag
                                size={50}
                                className="text-violet-300"
                            />
                        </div>

                    )}

                </div>

                {hasDiscount && (
                    <span className="absolute left-4 top-4 rounded-full bg-[#EDE5FF] px-3 py-2 text-xs font-bold text-violet-800">
                        -{discountPercentage}%
                    </span>
                )}

                {!hasDiscount && product.isFeatured && (
                    <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-2 text-xs font-bold text-gray-800 shadow-sm">
                        Featured
                    </span>
                )}

                <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-sm transition group-hover:text-violet-700">
                    <Heart size={18} />
                </div>

                <div className="absolute bottom-4 left-4 right-4 translate-y-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">

                    <div className="rounded-xl bg-white py-3 text-center text-sm font-semibold text-gray-900 shadow-lg">
                        View Product
                    </div>

                </div>

            </Link>

            <div className="pt-4">

                <p className="text-xs font-semibold uppercase tracking-wider text-violet-700">
                    {product.brand || product.category}
                </p>

                <Link to={`/products/${product._id}`}>
                    <h3 className="mt-2 line-clamp-1 text-base font-semibold text-gray-900 transition hover:text-violet-700">
                        {product.productName}
                    </h3>
                </Link>

                <div className="mt-2 flex items-center gap-1.5">

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

                <div className="mt-3 flex flex-wrap items-center gap-2">

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

// =====================================
// CATEGORY SKELETON
// =====================================

const CategorySkeleton = () => (
    <div className="animate-pulse overflow-hidden rounded-2xl bg-white">
        <div className="aspect-[4/5] bg-gray-200" />
        <div className="space-y-3 p-4">
            <div className="mx-auto h-5 w-2/3 rounded bg-gray-200" />
            <div className="mx-auto h-3 w-1/3 rounded bg-gray-200" />
        </div>
    </div>
);

// =====================================
// HOME PAGE
// =====================================

const Home = () => {

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);
    const [categoriesLoading, setCategoriesLoading] = useState(true);

    const [error, setError] = useState("");
    const [categoryError, setCategoryError] = useState("");

    // =====================================
    // FETCH PRODUCTS
    // =====================================

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
                setError(error.message || "Something went wrong");

            } finally {

                setLoading(false);

            }

        };

        fetchProducts();

    }, []);

    // =====================================
    // FETCH ADMIN CATEGORIES
    // =====================================

    useEffect(() => {

        const fetchCategories = async () => {

            try {

                setCategoriesLoading(true);
                setCategoryError("");

                const res = await fetch(`${API_URL}/categories`);
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(
                        data.message || "Failed to fetch categories"
                    );
                }

                if (!data.success) {
                    throw new Error(
                        data.message || "Unable to load categories"
                    );
                }

                const categoryList = (data.categories || []).filter(
                    (category) => category.isActive !== false
                );

                setCategories(categoryList);

            } catch (error) {

                console.error("Home Categories Error:", error);
                setCategoryError(error.message);

            } finally {

                setCategoriesLoading(false);

            }

        };

        fetchCategories();

    }, []);

    // =====================================
    // FEATURED PRODUCTS
    // =====================================

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

            

            <section
                className="relative isolate min-h-[600px] overflow-hidden rounded-[28px] bg-cover bg-center sm:min-h-[650px] lg:min-h-[700px]"
                style={{
                    backgroundImage: `
            linear-gradient(
                90deg,
                rgba(15, 15, 20, 0.88) 0%,
                rgba(20, 15, 30, 0.78) 55%,
                rgba(30, 15, 45, 0.55) 100%
            ),
            url('/images/cartvia-hero3.jpg')
        `,
                }}
            >
                {/* Subtle purple lighting */}

                <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-purple-600/20 blur-[100px]" />

                <div className="pointer-events-none absolute -bottom-40 left-0 h-96 w-96 rounded-full bg-violet-600/20 blur-[100px]" />

                <div className="relative mx-auto grid min-h-[600px] w-full max-w-7xl items-center gap-14 px-6 py-20 sm:px-10 lg:min-h-[700px] lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-14">

                    {/* LEFT CONTENT */}

                    <div className="relative z-10 max-w-2xl">

                        {/* Welcome Badge */}

                        <div className="inline-flex items-center gap-2 rounded-full border border-purple-300/30 bg-white/10 px-5 py-3 text-xs font-bold uppercase tracking-[2px] text-purple-200 shadow-lg backdrop-blur-md">
                            <Sparkles size={16} className="text-purple-300" />
                            Welcome to CARTVIA
                        </div>

                        {/* Main Heading */}

                        <h1 className="mt-8 text-4xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-[64px]">
                            Discover Your

                            <span className="mt-2 block bg-gradient-to-r from-purple-300 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                                Style. Your Way.
                            </span>
                        </h1>

                        {/* Description */}

                        <p className="mt-7 max-w-xl text-base leading-8 text-gray-200 sm:text-lg">
                            From everyday essentials to your favourite finds,
                            explore a world of products designed to make
                            shopping simple, exciting and effortless.
                        </p>

                        {/* Buttons */}

                        <div className="mt-9 flex flex-wrap items-center gap-4">

                            <Link
                                to="/products"
                                className="group inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-violet-700 to-purple-600 px-7 py-4 text-sm font-bold text-white shadow-xl shadow-purple-950/40 transition duration-300 hover:-translate-y-1 hover:from-violet-600 hover:to-purple-500"
                            >
                                Explore Products

                                <ArrowRight
                                    size={19}
                                    className="transition-transform duration-300 group-hover:translate-x-1"
                                />
                            </Link>

                            <Link
                                to="/categories"
                                className="inline-flex items-center gap-3 rounded-xl border border-white/40 bg-white/10 px-7 py-4 text-sm font-bold text-white backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-white hover:bg-white hover:text-gray-900"
                            >
                                Browse Categories

                                <ArrowUpRight size={18} />
                            </Link>

                        </div>

                        {/* Trust Information */}

                        <div className="mt-11 flex flex-wrap items-center gap-x-8 gap-y-5 border-t border-white/20 pt-7">

                            <div className="flex items-center gap-2.5 text-white/90">
                                <ShieldCheck size={20} className="text-purple-300" />

                                <span className="text-sm font-medium">
                                    Secure Shopping
                                </span>
                            </div>

                            <div className="flex items-center gap-2.5 text-white/90">
                                <ShoppingBag size={20} className="text-purple-300" />

                                <span className="text-sm font-medium">
                                    Multiple Categories
                                </span>
                            </div>

                        </div>

                    </div>

                    {/* RIGHT IMAGE CONTENT */}

                    {/* RIGHT VIDEO CONTENT */}

                    <div className="relative z-10 mx-auto w-full max-w-[510px] lg:ml-auto">

                        <div className="group relative aspect-[4/5] overflow-hidden rounded-[28px] border border-white/20 bg-gray-900 shadow-2xl shadow-black/40 sm:aspect-[4/3]">

                            <video
                                autoPlay
                                muted
                                loop
                                playsInline
                                preload="auto"
                                poster="/images/cartvia-side2.jpg"
                                className="absolute inset-0 h-full w-full object-cover object-center"
                            >
                                <source src="/videos/cartvia-hero.mp4" type="video/mp4" />
                            </video>

                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                        </div>

                        {/* Floating Badge */}

                        <div className="absolute -right-3 -top-8 z-20 flex h-24 w-24 flex-col items-center justify-center rounded-full border-4 border-white/10 bg-gradient-to-br from-violet-600 to-purple-800 text-white shadow-2xl sm:-right-7 sm:h-32 sm:w-32">

                            <span className="text-[10px] font-semibold uppercase tracking-widest">
                                Discover
                            </span>

                            <span className="text-2xl font-extrabold sm:text-3xl">
                                MORE
                            </span>

                            <span className="text-[9px] font-medium">
                                WITH CARTVIA
                            </span>

                        </div>

                        {/* Floating Card */}

                        <div className="absolute -bottom-7 left-3 z-20 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-2xl sm:-left-10 sm:p-5">

                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
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

            {/* =====================================
                TRUST FEATURES
            ===================================== */}

            <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-14">

                <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">

                    {trustFeatures.map((feature) => {

                        const Icon = feature.icon;

                        return (

                            <div
                                key={feature.title}
                                className="flex items-start gap-3"
                            >

                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-50">
                                    <Icon size={23} className="text-violet-700" />
                                </div>

                                <div>
                                    <h3 className="text-sm font-bold text-gray-900 sm:text-base">
                                        {feature.title}
                                    </h3>

                                    <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
                                        {feature.description}
                                    </p>
                                </div>

                            </div>

                        );

                    })}

                </div>

            </section>

            {/* =====================================
                DYNAMIC ADMIN CATEGORIES
            ===================================== */}

            <section className="bg-[#FAF9FC] py-16 lg:py-20">

                <div className="mx-auto max-w-7xl px-5 sm:px-8">

                    <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

                        <div>
                            <p className="text-xs font-bold uppercase tracking-[3px] text-violet-700">
                                Find your favourites
                            </p>

                            <h2 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                                Shop by Category
                            </h2>

                            <p className="mt-3 text-gray-500">
                                Explore a collection for every part of your life.
                            </p>
                        </div>

                        <Link
                            to="/categories"
                            className="inline-flex items-center gap-2 font-bold text-violet-700 transition-all hover:gap-4"
                        >
                            View All
                            <MoveRight size={19} />
                        </Link>

                    </div>

                    {categoriesLoading ? (

                        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-5">

                            {[1, 2, 3, 4, 5].map((item) => (
                                <CategorySkeleton key={item} />
                            ))}

                        </div>

                    ) : categoryError ? (

                        <div className="rounded-2xl bg-white py-14 text-center">

                            <PackageSearch
                                size={45}
                                className="mx-auto text-violet-300"
                            />

                            <h3 className="mt-4 text-lg font-bold text-gray-800">
                                Categories are temporarily unavailable
                            </h3>

                            <p className="mt-2 text-sm text-gray-500">
                                Please try again in a little while.
                            </p>

                        </div>

                    ) : categories.length > 0 ? (

                        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-5">

                            {categories.map((category) => (

                                <Link
                                    key={category._id}
                                    to={`/products?category=${encodeURIComponent(category.name)}`}
                                    className="group min-w-0"
                                >

                                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br from-violet-100 to-purple-200 shadow-sm transition duration-500 group-hover:-translate-y-1 group-hover:shadow-xl">

                                        {/* ADMIN-UPLOADED CLOUDINARY IMAGE */}

                                        {category.image ? (

                                            <img
                                                src={category.image}
                                                alt={category.name}
                                                loading="lazy"
                                                className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = "none";
                                                }}
                                            />

                                        ) : (

                                            <div className="flex h-full w-full items-center justify-center">
                                                <PackageSearch
                                                    size={50}
                                                    className="text-violet-400"
                                                />
                                            </div>

                                        )}

                                        {/* IMAGE OVERLAY */}

                                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

                                        {/* CATEGORY DETAILS */}

                                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white sm:p-5">

                                            <h3 className="text-lg font-bold sm:text-xl">
                                                {category.name}
                                            </h3>

                                            <p className="mt-1 text-xs text-white/80 sm:text-sm">
                                                {category.productCount ?? 0} Products
                                            </p>

                                            <div className="mt-4 flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-900 transition duration-300 group-hover:bg-violet-700 group-hover:text-white">
                                                <ArrowUpRight size={17} />
                                            </div>

                                        </div>

                                    </div>

                                </Link>

                            ))}

                        </div>

                    ) : (

                        <div className="rounded-2xl bg-white py-14 text-center">

                            <PackageSearch
                                size={45}
                                className="mx-auto text-violet-300"
                            />

                            <h3 className="mt-4 text-lg font-bold text-gray-800">
                                No Categories Available
                            </h3>

                            <p className="mt-2 text-sm text-gray-500">
                                Categories will appear here once added by the admin.
                            </p>

                        </div>

                    )}

                </div>

            </section>

            {/* =====================================
                FEATURED PRODUCTS
            ===================================== */}

            <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">

                <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

                    <div>

                        <div className="inline-flex items-center gap-2 text-violet-700">
                            <Zap size={17} />

                            <p className="text-xs font-bold uppercase tracking-[3px]">
                                Worth a closer look
                            </p>
                        </div>

                        <h2 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Featured Products
                        </h2>

                        <p className="mt-3 text-gray-500">
                            Products selected for your next discovery.
                        </p>

                    </div>

                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 font-bold text-violet-700 transition-all hover:gap-4"
                    >
                        Shop All Products
                        <ArrowRight size={19} />
                    </Link>

                </div>

                {loading ? (

                    <div className="grid grid-cols-2 gap-5 sm:gap-7 lg:grid-cols-4">
                        {[1, 2, 3, 4].map((item) => (
                            <ProductSkeleton key={item} />
                        ))}
                    </div>

                ) : error ? (

                    <div className="rounded-2xl bg-[#FAF9FC] py-16 text-center">

                        <ShoppingBag
                            size={45}
                            className="mx-auto text-violet-300"
                        />

                        <h3 className="mt-4 text-xl font-bold">
                            Products are temporarily unavailable
                        </h3>

                        <p className="mt-2 text-gray-500">
                            Please try again in a little while.
                        </p>

                        <button
                            onClick={() => window.location.reload()}
                            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-700 px-6 py-3 font-semibold text-white transition hover:bg-violet-800"
                        >
                            <RefreshCw size={16} />
                            Try Again
                        </button>

                    </div>

                ) : displayProducts.length > 0 ? (

                    <div className="grid grid-cols-2 gap-5 sm:gap-7 lg:grid-cols-4">

                        {displayProducts.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                            />
                        ))}

                    </div>

                ) : (

                    <div className="rounded-2xl bg-[#FAF9FC] py-16 text-center">

                        <ShoppingBag
                            size={45}
                            className="mx-auto text-violet-300"
                        />

                        <h3 className="mt-4 text-xl font-bold">
                            Products Coming Soon
                        </h3>

                        <p className="mt-2 text-gray-500">
                            We're getting the store ready for you.
                        </p>

                        <Link
                            to="/products"
                            className="mt-5 inline-flex rounded-xl bg-violet-700 px-6 py-3 font-semibold text-white transition hover:bg-violet-800"
                        >
                            Explore Shop
                        </Link>

                    </div>

                )}

            </section>

            {/* =====================================
                PROMOTIONAL BANNER
            ===================================== */}

            <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:pb-20">

                <div className="relative overflow-hidden rounded-[28px] bg-[#21103D]">

                    <div className="absolute -right-20 -top-32 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />

                    <div className="absolute -bottom-40 right-40 h-80 w-80 rounded-full bg-purple-400/20 blur-3xl" />

                    <div className="relative z-10 grid items-center gap-10 px-7 py-12 sm:px-12 md:grid-cols-2 lg:px-16 lg:py-16">

                        <div className="text-white">

                            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold">
                                <Gift size={17} />
                                Your next favourite is waiting
                            </div>

                            <h2 className="mt-6 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
                                Discover more.
                                <br />
                                Shop your way.
                            </h2>

                            <p className="mt-5 max-w-lg leading-7 text-violet-200">
                                Explore a world of beauty, fashion,
                                technology and everyday essentials
                                all in one place.
                            </p>

                            <Link
                                to="/products"
                                className="mt-8 inline-flex items-center gap-3 rounded-xl bg-white px-7 py-4 font-bold text-violet-800 transition hover:bg-violet-100"
                            >
                                Explore CARTVIA
                                <ArrowRight size={19} />
                            </Link>

                        </div>

                        <div className="hidden justify-center md:flex">

                            <div className="relative flex h-72 w-72 items-center justify-center rounded-full border border-white/20 bg-white/5">

                                <div className="flex h-56 w-56 flex-col items-center justify-center rounded-full border border-white/20 bg-white/5 text-white">

                                    <ShoppingBag size={48} />

                                    <h3 className="mt-5 text-3xl font-extrabold">
                                        CARTVIA
                                    </h3>

                                    <p className="mt-2 text-xs tracking-[3px] text-violet-200">
                                        SHOP YOUR WAY
                                    </p>

                                </div>

                                <div className="absolute right-2 top-7 flex h-12 w-12 items-center justify-center rounded-full bg-violet-500 text-white shadow-lg">
                                    <Sparkles size={22} />
                                </div>

                                <div className="absolute bottom-10 left-0 flex h-12 w-12 items-center justify-center rounded-full bg-white text-violet-700 shadow-lg">
                                    <Heart size={21} />
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

            {/* =====================================
                WHY CHOOSE CARTVIA
            ===================================== */}

            <section className="bg-[#FAF9FC] py-16 lg:py-20">

                <div className="mx-auto max-w-7xl px-5 sm:px-8">

                    <div className="mx-auto max-w-2xl text-center">

                        <p className="text-xs font-bold uppercase tracking-[3px] text-violet-700">
                            The CARTVIA experience
                        </p>

                        <h2 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Shopping, made simple.
                        </h2>

                        <p className="mt-4 leading-7 text-gray-500">
                            Discover products, explore collections and
                            find everything you need in one convenient place.
                        </p>

                    </div>

                    <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

                        <div className="rounded-2xl border border-gray-100 bg-white p-7">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100">
                                <Package size={24} className="text-violet-700" />
                            </div>

                            <h3 className="mt-5 text-lg font-bold">
                                Explore More
                            </h3>

                            <p className="mt-3 text-sm leading-6 text-gray-500">
                                Browse different categories and discover
                                products for your everyday needs.
                            </p>

                        </div>

                        <div className="rounded-2xl border border-gray-100 bg-white p-7">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100">
                                <ShoppingBag size={24} className="text-violet-700" />
                            </div>

                            <h3 className="mt-5 text-lg font-bold">
                                Easy Shopping
                            </h3>

                            <p className="mt-3 text-sm leading-6 text-gray-500">
                                Find your favourites and add them
                                to your shopping cart with ease.
                            </p>

                        </div>

                        <div className="rounded-2xl border border-gray-100 bg-white p-7">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100">
                                <CheckCircle size={24} className="text-violet-700" />
                            </div>

                            <h3 className="mt-5 text-lg font-bold">
                                Simple Experience
                            </h3>

                            <p className="mt-3 text-sm leading-6 text-gray-500">
                                Enjoy a clean and convenient shopping
                                experience across your devices.
                            </p>

                        </div>

                    </div>

                </div>

            </section>

            {/* =====================================
                FINAL CALL TO ACTION
            ===================================== */}

            <section className="mx-auto max-w-7xl px-5 py-16 text-center sm:px-8 lg:py-20">

                <p className="text-xs font-bold uppercase tracking-[3px] text-violet-700">
                    Your next discovery starts here
                </p>

                <h2 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                    Ready to find your favourites?
                </h2>

                <p className="mx-auto mt-4 max-w-xl leading-7 text-gray-500">
                    Explore the CARTVIA collection and discover
                    products you'll love.
                </p>

                <Link
                    to="/products"
                    className="mt-8 inline-flex items-center gap-3 rounded-xl bg-violet-700 px-8 py-4 font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-800"
                >
                    Start Shopping
                    <ArrowRight size={19} />
                </Link>

            </section>

        </main>

    );
};

export default Home;
