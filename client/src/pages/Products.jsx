
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import {
    ShoppingCart,
    Search,
    Star,
    Heart,
    SlidersHorizontal,
    PackageSearch,
} from "lucide-react";

const Products = () => {

    // Products state
    const [products, setProducts] = useState([]);

    // Loading and error states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Search, category and wishlist states
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [wishlist, setWishlist] = useState([]);

    // Fetch products from backend
    const fetchProducts = async () => {

        try {
            setLoading(true);
            setError("");

            const res = await fetch("http://localhost:5000/products");

            const data = await res.json();

            console.log("Products Response:", data);

            if (!res.ok) {
                throw new Error(data.message || "Failed to fetch products");
            }

            if (data.success) {
                setProducts(data.products || []);
            } else {
                setError(data.message || "Unable to load products");
            }

        } catch (error) {

            console.error("Fetch Products Error:", error);
            setError(error.message || "Something went wrong");

        } finally {
            setLoading(false);
        }
    };

    // Call API when page loads
    useEffect(() => {
        fetchProducts();
    }, []);

    // Get categories dynamically
    const categories = [
        "All",
        ...new Set(products.map((product) => product.category))
    ];

    // Search and category filtering
    const filteredProducts = products.filter((product) => {

        const matchesSearch =
            product.productName?.toLowerCase().includes(search.toLowerCase()) ||
            product.brand?.toLowerCase().includes(search.toLowerCase());

        const matchesCategory =
            category === "All" || product.category === category;

        return matchesSearch && matchesCategory;
    });

    // Wishlist functionality
    const toggleWishlist = (productId) => {

        setWishlist((previous) =>
            previous.includes(productId)
                ? previous.filter((id) => id !== productId)
                : [...previous, productId]
        );

    };

    // Add to cart (temporary)
    const handleAddToCart = async (product) => {

        if (product.stock === 0) {
            alert("Sorry! This product is out of stock.");
            return;
        }

        try {
            const price =
                product.discountPrice != null &&
                    product.discountPrice < product.price
                    ? product.discountPrice
                    : product.price;

            const res = await fetch("http://localhost:5000/add-to-cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    id: product._id,
                    price: price
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to add product");
            }

            alert(`${product.productName} added to cart!`);

        } catch (error) {
            console.error("Add to cart error:", error);
            alert(error.message);
        }
    };
    return (

        <div className="min-h-screen bg-[#F8F7FC] px-5 py-10 md:px-12">

            {/* Page Heading */}
            <div className="max-w-7xl mx-auto mb-10">

                <p className="text-violet-700 font-semibold uppercase tracking-widest text-sm">
                    Explore CARTIVA
                </p>

                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-3">
                    Discover Our{" "}
                    <span className="text-violet-700">Products.</span>
                </h1>

                <p className="text-gray-500 mt-3 text-lg">
                    Find your favourites. Shop your style. Love every purchase.
                </p>

            </div>


            {/* Search and Filters */}
            <div className="max-w-7xl mx-auto mb-10">

                <div className="flex flex-col lg:flex-row gap-5 justify-between">

                    {/* Search */}
                    <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-3 lg:w-96 focus-within:ring-2 focus-within:ring-violet-500">

                        <Search size={20} className="text-gray-400" />

                        <input
                            type="text"
                            placeholder="Search products or brands..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full outline-none bg-transparent px-3 text-gray-700"
                        />

                    </div>


                    {/* Categories */}
                    <div className="flex flex-wrap gap-2 items-center">

                        <SlidersHorizontal
                            size={19}
                            className="text-violet-700 mr-1"
                        />

                        {categories.map((item) => (

                            <button
                                key={item}
                                onClick={() => setCategory(item)}
                                className={`px-5 py-2.5 rounded-xl font-semibold transition ${category === item
                                    ? "bg-violet-700 text-white shadow-lg shadow-violet-200"
                                    : "bg-white text-gray-600 hover:bg-violet-100"
                                    }`}
                            >
                                {item}
                            </button>

                        ))}

                    </div>

                </div>

            </div>


            {/* Product Count */}
            <div className="max-w-7xl mx-auto mb-6 flex justify-between items-center">

                <p className="text-gray-600 font-medium">
                    Showing{" "}
                    <span className="text-violet-700 font-bold">
                        {loading ? "..." : filteredProducts.length}
                    </span>{" "}
                    products
                </p>

            </div>


            {/* Product Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">

                {loading ? (

                    // Loading State
                    <div className="col-span-full text-center py-20">

                        <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-700 rounded-full animate-spin mx-auto mb-4"></div>

                        <p className="text-violet-700 font-semibold">
                            Loading products...
                        </p>

                    </div>

                ) : error ? (

                    // Error State
                    <div className="col-span-full text-center py-20 bg-white rounded-2xl">

                        <p className="text-red-500 font-semibold text-lg">
                            {error}
                        </p>

                        <button
                            onClick={fetchProducts}
                            className="mt-5 bg-violet-700 text-white px-6 py-3 rounded-xl hover:bg-violet-800 transition"
                        >
                            Try Again
                        </button>

                    </div>

                ) : filteredProducts.length > 0 ? (

                    // Display Products
                    filteredProducts.map((product) => (

                        <div
                            key={product._id}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 group"
                        >

                            {/* Product Image */}
                            <div className="relative h-64 bg-gray-100 overflow-hidden">

                                <Link to={`/products/${product._id}`}>

                                    <img
                                        src={product.images?.[0]}
                                        alt={product.productName}
                                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                    />

                                </Link>


                                {/* Featured Badge */}
                                {product.isFeatured && (

                                    <span className="absolute top-4 left-4 bg-violet-700 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                                        FEATURED
                                    </span>

                                )}


                                {/* Wishlist */}
                                <button
                                    onClick={() => toggleWishlist(product._id)}
                                    className="absolute top-4 right-4 bg-white p-2.5 rounded-full shadow-md hover:scale-110 transition"
                                    aria-label="Toggle wishlist"
                                >

                                    <Heart
                                        size={19}
                                        className={
                                            wishlist.includes(product._id)
                                                ? "text-red-500 fill-red-500"
                                                : "text-gray-500"
                                        }
                                    />

                                </button>


                                {/* Stock Badge */}
                                {product.stock === 0 && (

                                    <span className="absolute bottom-4 left-4 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-full">
                                        OUT OF STOCK
                                    </span>

                                )}

                            </div>


                            {/* Product Details */}
                            <div className="p-5">

                                <div className="flex justify-between items-center">

                                    <p className="text-sm text-violet-700 font-semibold">
                                        {product.brand}
                                    </p>

                                    <p className="text-xs text-gray-400">
                                        {product.category}
                                    </p>

                                </div>


                                {/* Product Name */}
                                <Link to={`/products/${product._id}`}>

                                    <h2 className="text-lg font-bold text-gray-900 mt-3 hover:text-violet-700 transition">
                                        {product.productName}
                                    </h2>

                                </Link>


                                {/* Description */}
                                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                                    {product.description}
                                </p>


                                {/* Ratings */}
                                <div className="flex items-center gap-1 mt-3">

                                    <Star
                                        size={16}
                                        fill="currentColor"
                                        className="text-yellow-400"
                                    />

                                    <span className="text-sm font-semibold text-gray-700">
                                        {product.ratings}
                                    </span>

                                    <span className="text-xs text-gray-400">
                                        ({product.numReviews} reviews)
                                    </span>

                                </div>


                                {/* Price and Cart */}
                                <div className="flex items-center justify-between mt-5">

                                    <div>

                                        <p className="text-xl font-extrabold text-gray-900">
                                            ₹{(
                                                product.discountPrice != null &&
                                                    product.discountPrice < product.price
                                                    ? product.discountPrice
                                                    : product.price
                                            ).toLocaleString("en-IN")}
                                        </p>

                                        {product.discountPrice != null &&
                                            product.discountPrice < product.price && (

                                                <p className="text-sm text-gray-400 line-through">
                                                    ₹{product.price.toLocaleString("en-IN")}
                                                </p>

                                            )}

                                    </div>


                                    {/* Add to Cart */}
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        disabled={product.stock === 0}
                                        className="bg-violet-700 text-white p-3 rounded-xl hover:bg-violet-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                                        aria-label={`Add ${product.productName} to cart`}
                                    >
                                        <ShoppingCart size={20} />
                                    </button>

                                </div>


                                {/* View Details Button */}
                                <Link
                                    to={`/products/${product._id}`}
                                    className="block w-full text-center mt-4 border border-violet-600 text-violet-700 py-3 rounded-xl font-semibold hover:bg-violet-700 hover:text-white transition"
                                >
                                    View Details
                                </Link>

                            </div>

                        </div>

                    ))

                ) : (

                    // No Products Found
                    <div className="col-span-full text-center py-20 bg-white rounded-2xl">

                        <PackageSearch
                            size={55}
                            className="mx-auto text-violet-300 mb-4"
                        />

                        <h2 className="text-2xl font-bold text-gray-800">
                            No Products Found
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Try another search or category.
                        </p>

                    </div>

                )}

            </div>

        </div>

    );

};

export default Products;
