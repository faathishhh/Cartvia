import React from 'react'

import { useEffect, useState } from "react";
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    X,
    Upload,
    Image as ImageIcon,
    Loader2,
    Tags,
} from "lucide-react";

import toast from "react-hot-toast";
import API_URL from "../../config/api";

const AdminCategories = () => {

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        image: "",
        isActive: true,
    });

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_URL}/categories`, {
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch categories");
            }

            setCategories(data.categories || []);

        } catch (error) {
            toast.error(error.message);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    // Upload image to Cloudinary
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        try {
            setUploading(true);

            const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
            const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

            if (!cloudName || !uploadPreset) {
                throw new Error("Cloudinary environment variables are missing");
            }

            const imageData = new FormData();

            imageData.append("file", file);
            imageData.append("upload_preset", uploadPreset);
            imageData.append("folder", "cartvia/categories");

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                {
                    method: "POST",
                    body: imageData,
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || "Image upload failed");
            }

            setFormData((prev) => ({
                ...prev,
                image: data.secure_url,
            }));

            toast.success("Image uploaded successfully!");

        } catch (error) {
            toast.error(error.message);

        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    // Open add modal
    const handleAdd = () => {
        setEditId(null);

        setFormData({
            name: "",
            description: "",
            image: "",
            isActive: true,
        });

        setShowModal(true);
    };

    // Open edit modal
    const handleEdit = (category) => {
        setEditId(category._id);

        setFormData({
            name: category.name || "",
            description: category.description || "",
            image: category.image || "",
            isActive: category.isActive ?? true,
        });

        setShowModal(true);
    };

    // Add or update category
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error("Please enter a category name");
            return;
        }

        try {
            setSaving(true);

            const url = editId
                ? `${API_URL}/categories/${editId}`
                : `${API_URL}/categories`;

            const response = await fetch(url, {
                method: editId ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            toast.success(
                editId
                    ? "Category updated successfully!"
                    : "Category added successfully!"
            );

            setShowModal(false);
            fetchCategories();

        } catch (error) {
            toast.error(error.message);

        } finally {
            setSaving(false);
        }
    };

    // Delete category
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this category?"
        );

        if (!confirmDelete) return;

        try {
            const response = await fetch(`${API_URL}/categories/${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to delete category");
            }

            toast.success("Category deleted successfully!");
            fetchCategories();

        } catch (error) {
            toast.error(error.message);
        }
    };

    // Search categories
    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">

            {/* Header */}
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Categories
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage your store categories
                    </p>
                </div>

                <button
                    onClick={handleAdd}
                    className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
                >
                    <Plus size={19} />
                    Add Category
                </button>

            </div>

            {/* Summary */}
            <div className="mb-6 rounded-xl border bg-white p-5 shadow-sm">

                <div className="flex items-center gap-4">

                    <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                        <Tags size={25} />
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Total Categories
                        </p>

                        <h2 className="text-2xl font-bold text-gray-800">
                            {categories.length}
                        </h2>
                    </div>

                </div>

            </div>

            {/* Search */}
            <div className="mb-6">

                <div className="relative max-w-md">

                    <Search
                        size={19}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-lg border bg-white py-3 pl-10 pr-4 outline-none focus:border-blue-500"
                    />

                </div>

            </div>

            {/* Categories Table */}
            <div className="overflow-hidden rounded-xl border bg-white shadow-sm">

                {loading ? (

                    <div className="flex justify-center py-16">
                        <Loader2 className="animate-spin text-blue-600" size={30} />
                    </div>

                ) : filteredCategories.length === 0 ? (

                    <div className="py-16 text-center">

                        <Tags
                            size={40}
                            className="mx-auto mb-3 text-gray-300"
                        />

                        <p className="font-medium text-gray-600">
                            No categories found
                        </p>

                        <p className="mt-1 text-sm text-gray-400">
                            Add a category to get started.
                        </p>

                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[650px] text-left">

                            <thead className="border-b bg-gray-50">

                                <tr className="text-sm text-gray-600">

                                    <th className="px-5 py-4">Category</th>
                                    <th className="px-5 py-4">Products</th>
                                    <th className="px-5 py-4">Status</th>
                                    <th className="px-5 py-4 text-center">Actions</th>

                                </tr>

                            </thead>

                            <tbody className="divide-y">

                                {filteredCategories.map((category) => (

                                    <tr
                                        key={category._id}
                                        className="transition hover:bg-gray-50"
                                    >

                                        <td className="px-5 py-4">

                                            <div className="flex items-center gap-3">

                                                {category.image ? (

                                                    <img
                                                        src={category.image}
                                                        alt={category.name}
                                                        className="h-12 w-12 rounded-lg border object-cover"
                                                    />

                                                ) : (

                                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                                                        <ImageIcon size={22} />
                                                    </div>

                                                )}

                                                <div>
                                                    <p className="font-semibold text-gray-800">
                                                        {category.name}
                                                    </p>

                                                    <p className="max-w-xs truncate text-xs text-gray-400">
                                                        {category.description || "No description"}
                                                    </p>
                                                </div>

                                            </div>

                                        </td>

                                        <td className="px-5 py-4 text-sm text-gray-600">
                                            {category.productCount ?? 0}
                                        </td>

                                        <td className="px-5 py-4">

                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-medium ${category.isActive
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-600"
                                                    }`}
                                            >
                                                {category.isActive ? "Active" : "Inactive"}
                                            </span>

                                        </td>

                                        <td className="px-5 py-4">

                                            <div className="flex justify-center gap-2">

                                                <button
                                                    onClick={() => handleEdit(category)}
                                                    className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                                                    title="Edit"
                                                >
                                                    <Pencil size={17} />
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(category._id)}
                                                    className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={17} />
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

            {/* Add / Edit Modal */}
            {showModal && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

                    <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-xl">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b p-5">

                            <h2 className="text-xl font-bold text-gray-800">
                                {editId ? "Edit Category" : "Add New Category"}
                            </h2>

                            <button
                                onClick={() => setShowModal(false)}
                                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                            >
                                <X size={21} />
                            </button>

                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5 p-5">

                            {/* Category Name */}
                            <div>

                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Category Name *
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter category name"
                                    required
                                    className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
                                />

                            </div>

                            {/* Description */}
                            <div>

                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="3"
                                    placeholder="Enter category description"
                                    className="w-full resize-none rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
                                />

                            </div>

                            {/* Image Upload */}
                            <div>

                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Category Image
                                </label>

                                <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-5 transition hover:border-blue-500">

                                    {uploading ? (

                                        <Loader2
                                            size={28}
                                            className="animate-spin text-blue-600"
                                        />

                                    ) : (

                                        <Upload
                                            size={28}
                                            className="mb-2 text-gray-400"
                                        />

                                    )}

                                    <span className="text-sm font-medium text-gray-600">
                                        {uploading ? "Uploading..." : "Click to upload image"}
                                    </span>

                                    <span className="mt-1 text-xs text-gray-400">
                                        PNG, JPG or WEBP
                                    </span>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={uploading}
                                        className="hidden"
                                    />

                                </label>

                                {formData.image && (

                                    <div className="relative mt-4 inline-block">

                                        <img
                                            src={formData.image}
                                            alt="Category preview"
                                            className="h-24 w-24 rounded-lg border object-cover"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    image: "",
                                                }))
                                            }
                                            className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white"
                                        >
                                            <X size={14} />
                                        </button>

                                    </div>

                                )}

                            </div>

                            {/* Status */}
                            <label className="flex cursor-pointer items-center gap-3">

                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                    className="h-4 w-4 accent-blue-600"
                                />

                                <span className="text-sm font-medium text-gray-700">
                                    Active Category
                                </span>

                            </label>

                            {/* Buttons */}
                            <div className="flex justify-end gap-3 border-t pt-5">

                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="rounded-lg border px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving || uploading}
                                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {saving && (
                                        <Loader2 size={17} className="animate-spin" />
                                    )}

                                    {editId ? "Update Category" : "Add Category"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
};

export default AdminCategories;