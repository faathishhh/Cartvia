import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    Plus,
    Search,
    Pencil,
    Trash2,
    Package,
    X,
} from "lucide-react";

import toast from "react-hot-toast";


const AdminProduct = () => {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [editProduct, setEditProduct] = useState(null);

    const [formData, setFormData] = useState({
        productName: "",
        description: "",
        price: "",
        discountPrice: "",
        category: "",
        brand: "",
        stock: "",
        images: "",
        sizes: "",
        colors: "",
        isFeatured: false,
        isActive: true,
    });


    // HANDLE EDIT

    const handleEdit = (product) => {

        setEditProduct(product);

        setFormData({
            productName: product.productName || "",
            description: product.description || "",
            price: product.price || "",
            discountPrice: product.discountPrice ?? "",
            category: product.category || "",
            brand: product.brand || "",
            stock: product.stock ?? "",
            images: product.images?.join("\n") || "",
            sizes: product.sizes?.join(", ") || "",
            colors: product.colors?.join(", ") || "",
            isFeatured: product.isFeatured || false,
            isActive: product.isActive !== false,
        });

    };


    // HANDLE INPUT CHANGE

    const handleChange = (e) => {

        const { name, value, type, checked } = e.target;

        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });

    };


    // UPDATE PRODUCT

    const handleUpdate = async (e) => {

        e.preventDefault();

        try {

            const productData = {
                ...formData,

                price: Number(formData.price),

                discountPrice: formData.discountPrice
                    ? Number(formData.discountPrice)
                    : null,

                stock: Number(formData.stock),

                images: formData.images
                    .split("\n")
                    .map((url) => url.trim())
                    .filter(Boolean),

                sizes: formData.sizes
                    .split(",")
                    .map((size) => size.trim())
                    .filter(Boolean),

                colors: formData.colors
                    .split(",")
                    .map((color) => color.trim())
                    .filter(Boolean),
            };


            const res = await fetch(
                `http://localhost:5000/products/${editProduct._id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    credentials: "include",

                    body: JSON.stringify(productData),
                }
            );


            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to update product");
            }


            toast.success("Product updated successfully!");

            setEditProduct(null);

            fetchProducts();


        } catch (error) {

            toast.error(error.message);

        }

    };


    // DELETE CONFIRMATION TOAST

    const handleDelete = (id) => {

        toast((t) => (

            <div className="flex flex-col gap-3 w-full">

                <div className="flex items-center gap-3">

                    <div className="bg-red-100 text-red-600 p-2 rounded-full">
                        <Trash2 size={20} />
                    </div>

                    <div>
                        <p className="font-semibold text-gray-800">
                            Delete Product?
                        </p>

                        <p className="text-sm text-gray-500">
                            Are you sure you want to delete this product?
                        </p>
                    </div>

                </div>


                <div className="flex justify-end gap-2">

                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                    >
                        Cancel
                    </button>


                    <button
                        onClick={() => {
                            toast.dismiss(t.id);
                            confirmDelete(id);
                        }}
                        className="px-4 py-2 text-sm font-medium rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                    >
                        Delete
                    </button>

                </div>

            </div>

        ), {
            duration: Infinity,
            position: "top-center",
        });

    };


    // CONFIRM DELETE PRODUCT

    const confirmDelete = async (id) => {

        try {

            const res = await fetch(
                `http://localhost:5000/products/${id}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );


            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to delete product");
            }


            toast.success("Product deleted successfully!");

            fetchProducts();


        } catch (error) {

            toast.error(error.message);

        }

    };


    // FETCH ALL PRODUCTS

    const fetchProducts = async () => {

        try {

            setLoading(true);

            const res = await fetch("http://localhost:5000/products");

            const data = await res.json();

            console.log("API Response:", data);


            if (!res.ok) {
                throw new Error(data.message || "Failed to fetch products");
            }


            if (data.success && Array.isArray(data.products)) {

                setProducts(data.products);

            } else {

                setProducts([]);

            }


        } catch (error) {

            console.error("Fetch products error:", error);

            toast.error(error.message);

        } finally {

            setLoading(false);

        }

    };


    // LOAD PRODUCTS

    useEffect(() => {

        fetchProducts();

    }, []);


    // SEARCH FILTER

    const filteredProducts = products.filter((product) =>

        product.productName?.toLowerCase().includes(search.toLowerCase()) ||

        product.brand?.toLowerCase().includes(search.toLowerCase())

    );


    return (

        <div>

            {/* HEADER */}

            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">

                <div>

                    <h1 className="text-3xl font-bold text-gray-800">
                        Products
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Manage your CARTIVA products.
                    </p>

                </div>


                <Link
                    to="/products/add"
                    className="flex items-center justify-center gap-2 bg-violet-700 text-white px-5 py-3 rounded-lg hover:bg-violet-800"
                >

                    <Plus size={20} />

                    Add Product

                </Link>

            </div>


            {/* PRODUCT TABLE */}

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">

                <div className="p-5 border-b flex flex-col sm:flex-row justify-between gap-4">

                    <h2 className="font-semibold text-gray-800">
                        All Products ({filteredProducts.length})
                    </h2>


                    {/* SEARCH */}

                    <div className="flex items-center border rounded-lg px-3 py-2">

                        <Search size={18} className="text-gray-400" />

                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="outline-none px-2 text-sm"
                        />

                    </div>

                </div>


                {/* LOADING */}

                {loading ? (

                    <div className="p-10 text-center text-gray-500">
                        Loading products...
                    </div>

                ) : filteredProducts.length === 0 ? (

                    <div className="p-10 text-center text-gray-500">

                        <Package
                            size={40}
                            className="mx-auto mb-3 text-gray-300"
                        />

                        No products found.

                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full text-left">

                            <thead className="bg-gray-50 text-gray-500 text-sm">

                                <tr>

                                    <th className="p-4">Product</th>

                                    <th className="p-4">Category</th>

                                    <th className="p-4">Price</th>

                                    <th className="p-4">Stock</th>

                                    <th className="p-4">Status</th>

                                    <th className="p-4">Actions</th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredProducts.map((product) => (

                                    <tr key={product._id} className="border-t">

                                        {/* PRODUCT */}

                                        <td className="p-4">

                                            <div className="flex items-center gap-3">

                                                <img
                                                    src={product.images?.[0] || "https://placehold.co/60"}
                                                    alt={product.productName}
                                                    className="w-12 h-12 object-cover rounded-lg"
                                                />

                                                <div>

                                                    <p className="font-medium text-gray-800">
                                                        {product.productName}
                                                    </p>

                                                    <p className="text-xs text-gray-500">
                                                        {product.brand}
                                                    </p>

                                                </div>

                                            </div>

                                        </td>


                                        {/* CATEGORY */}

                                        <td className="p-4 text-gray-600">
                                            {product.category}
                                        </td>


                                        {/* PRICE */}

                                        <td className="p-4 font-medium">
                                            ₹{product.discountPrice || product.price}
                                        </td>


                                        {/* STOCK */}

                                        <td className="p-4">
                                            {product.stock}
                                        </td>


                                        {/* STATUS */}

                                        <td className="p-4">

                                            <span
                                                className={`px-3 py-1 rounded-full text-xs ${
                                                    product.isActive !== false
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >

                                                {product.isActive !== false
                                                    ? "Active"
                                                    : "Inactive"}

                                            </span>

                                        </td>


                                        {/* ACTIONS */}

                                        <td className="p-4">

                                            <div className="flex items-center gap-3">

                                                {/* EDIT BUTTON */}

                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    title="Edit product"
                                                    className="text-violet-700 hover:text-violet-900"
                                                >

                                                    <Pencil size={18} />

                                                </button>


                                                {/* DELETE BUTTON */}

                                                <button
                                                    onClick={() => handleDelete(product._id)}
                                                    title="Delete product"
                                                    className="text-red-500 hover:text-red-700"
                                                >

                                                    <Trash2 size={18} />

                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>


            {/* EDIT PRODUCT MODAL */}

            {editProduct && (

                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

                    <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">


                        {/* MODAL HEADER */}

                        <div className="flex justify-between items-center mb-6">

                            <h2 className="text-2xl font-bold text-gray-800">
                                Edit Product
                            </h2>


                            <button
                                onClick={() => setEditProduct(null)}
                                className="text-gray-500 hover:text-red-500"
                            >

                                <X size={24} />

                            </button>

                        </div>


                        {/* EDIT FORM */}

                        <form
                            onSubmit={handleUpdate}
                            className="space-y-4"
                        >

                            {[
                                ["productName", "Product Name"],
                                ["brand", "Brand"],
                                ["category", "Category"],
                                ["price", "Price"],
                                ["discountPrice", "Discount Price"],
                                ["stock", "Stock"],
                            ].map(([name, label]) => (

                                <div key={name}>

                                    <label className="block text-sm font-medium mb-1">
                                        {label}
                                    </label>

                                    <input
                                        type="text"
                                        name={name}
                                        value={formData[name]}
                                        onChange={handleChange}
                                        required={["productName", "brand", "category", "price", "stock"].includes(name)}
                                        className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-violet-500"
                                    />

                                </div>

                            ))}


                            {/* DESCRIPTION */}

                            <div>

                                <label className="block text-sm font-medium mb-1">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    rows="3"
                                    className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-violet-500"
                                />

                            </div>


                            {/* IMAGES */}

                            <div>

                                <label className="block text-sm font-medium mb-1">
                                    Image URLs (one per line)
                                </label>

                                <textarea
                                    name="images"
                                    value={formData.images}
                                    onChange={handleChange}
                                    required
                                    rows="3"
                                    className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-violet-500"
                                />

                            </div>


                            {/* SIZES */}

                            <div>

                                <label className="block text-sm font-medium mb-1">
                                    Sizes (comma separated)
                                </label>

                                <input
                                    name="sizes"
                                    value={formData.sizes}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg p-3"
                                />

                            </div>


                            {/* COLORS */}

                            <div>

                                <label className="block text-sm font-medium mb-1">
                                    Colors (comma separated)
                                </label>

                                <input
                                    name="colors"
                                    value={formData.colors}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg p-3"
                                />

                            </div>


                            {/* FEATURED PRODUCT */}

                            <label className="flex items-center gap-2">

                                <input
                                    type="checkbox"
                                    name="isFeatured"
                                    checked={formData.isFeatured}
                                    onChange={handleChange}
                                />

                                Featured Product

                            </label>


                            {/* ACTIVE PRODUCT */}

                            <label className="flex items-center gap-2">

                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                />

                                Active Product

                            </label>


                            {/* FORM BUTTONS */}

                            <div className="flex justify-end gap-3 pt-4">

                                <button
                                    type="button"
                                    onClick={() => setEditProduct(null)}
                                    className="px-5 py-3 border rounded-lg hover:bg-gray-100"
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="px-5 py-3 bg-violet-700 text-white rounded-lg hover:bg-violet-800"
                                >
                                    Update Product
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>

    );

};

export default AdminProduct;