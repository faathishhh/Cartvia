import React from 'react'
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Plus, Save } from "lucide-react";
import toast from "react-hot-toast";
import API_URL from "../../config/api";




const AddProduct = () => {

    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        productName: "",
        description: "",
        price: "",
        discountPrice: "",
        category: "",
        brand: "",
        images: "",
        stock: "",
        sizes: "",
        colors: "",
        isFeatured: false,
        isActive: true,
    });


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const productData = {
                productName: formData.productName,
                description: formData.description,
                price: Number(formData.price),
                discountPrice: formData.discountPrice
                    ? Number(formData.discountPrice)
                    : null,
                category: formData.category,
                brand: formData.brand,
                images: formData.images
                    .split("\n")
                    .map((url) => url.trim())
                    .filter(Boolean),
                stock: Number(formData.stock),
                sizes: formData.sizes
                    .split(",")
                    .map((size) => size.trim())
                    .filter(Boolean),
                colors: formData.colors
                    .split(",")
                    .map((color) => color.trim())
                    .filter(Boolean),
                isFeatured: formData.isFeatured,
                isActive: formData.isActive,
            };

            if (productData.images.length === 0) {
                toast.error("Please add at least one image URL");
                return;
            }

            const res = await fetch(`${API_URL}/products`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(productData),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to add product");
            }

            toast.success("Product added successfully!");
            navigate("/products");

        } catch (error) {
            toast.error(error.message);
            console.error("Add product error:", error);
        } finally {
            setLoading(false);
        }
    };




    return (
        <div className="max-w-5xl mx-auto">

            {/* Header */}
            <div className="flex items-center gap-4 mb-8">

                <Link
                    to="/products"
                    className="p-2 rounded-lg hover:bg-violet-100 text-gray-600"
                >
                    <ArrowLeft size={22} />
                </Link>

                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Add Product
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Add a new product to your CARTIVA store.
                    </p>
                </div>

            </div>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8"
            >

                {/* Basic Information */}
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                    Basic Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Product Name *
                        </label>

                        <input
                            type="text"
                            name="productName"
                            value={formData.productName}
                            onChange={handleChange}
                            placeholder="Enter product name"
                            required
                            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Brand *
                        </label>

                        <input
                            type="text"
                            name="brand"
                            value={formData.brand}
                            onChange={handleChange}
                            placeholder="Enter brand name"
                            required
                            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Category *
                        </label>

                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
                        >
                            <option value="">Select Category</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Fashion">Fashion</option>
                            <option value="Home & Living">Home & Living</option>
                            <option value="Beauty">Beauty</option>
                            <option value="Furniture">Furniture</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Stock Quantity *
                        </label>

                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            placeholder="Enter stock quantity"
                            min="0"
                            required
                            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
                        />
                    </div>

                </div>

                {/* Description */}
                <div className="mt-5">

                    <label className="block text-sm font-medium mb-2">
                        Description *
                    </label>

                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter product description"
                        rows="4"
                        required
                        className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
                    />

                </div>

                {/* Pricing */}
                <h2 className="text-xl font-semibold text-gray-800 mt-9 mb-6">
                    Pricing Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Original Price (₹) *
                        </label>

                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="Enter price"
                            min="0"
                            required
                            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Discount Price (₹)
                        </label>

                        <input
                            type="number"
                            name="discountPrice"
                            value={formData.discountPrice}
                            onChange={handleChange}
                            placeholder="Enter discount price"
                            min="0"
                            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
                        />
                    </div>

                </div>

                {/* Images */}
                <h2 className="text-xl font-semibold text-gray-800 mt-9 mb-6">
                    Product Images
                </h2>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Image URLs *
                    </label>

                    <textarea
                        name="images"
                        value={formData.images}
                        onChange={handleChange}
                        placeholder={"Enter image URLs, one per line"}
                        rows="3"
                        required
                        className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
                    />

                    <p className="text-xs text-gray-400 mt-2">
                        Add multiple image URLs, one URL per line.
                    </p>
                </div>

                {/* Additional Information */}
                <h2 className="text-xl font-semibold text-gray-800 mt-9 mb-6">
                    Additional Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Available Sizes
                        </label>

                        <input
                            type="text"
                            name="sizes"
                            value={formData.sizes}
                            onChange={handleChange}
                            placeholder="S, M, L, XL"
                            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Available Colors
                        </label>

                        <input
                            type="text"
                            name="colors"
                            value={formData.colors}
                            onChange={handleChange}
                            placeholder="Black, White, Blue"
                            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
                        />
                    </div>

                </div>

                {/* Product Status */}
                <div className="mt-8 space-y-4">

                    <label className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            name="isFeatured"
                            checked={formData.isFeatured}
                            onChange={handleChange}
                            className="w-4 h-4 accent-violet-700"
                        />

                        <span className="text-sm text-gray-700">
                            Mark as Featured Product
                        </span>
                    </label>

                    <label className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                            className="w-4 h-4 accent-violet-700"
                        />

                        <span className="text-sm text-gray-700">
                            Product Active
                        </span>
                    </label>

                </div>

                {/* Submit */}
                <div className="flex justify-end gap-4 mt-10 pt-6 border-t">

                    <Link
                        to="/products"
                        className="px-6 py-3 rounded-lg border text-gray-600 hover:bg-gray-50"
                    >
                        Cancel
                    </Link>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-3 rounded-lg bg-violet-700 text-white hover:bg-violet-800 disabled:opacity-50"
                    >
                        <Save size={18} />
                        {loading ? "Saving..." : "Save Product"}
                    </button>

                </div>

            </form>

        </div>
    );
};

export default AddProduct