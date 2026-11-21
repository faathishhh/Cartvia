import React from 'react'

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PackageSearch } from "lucide-react";

const Categories = () => {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("http://localhost:5000/products");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch products");
      }

      if (data.success) {
        setProducts(data.products || []);
      } else {
        setError(data.message || "Unable to load categories");
      }

    } catch (error) {
      console.error("Categories Error:", error);
      setError(error.message);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Create categories dynamically
  const categories = Object.values(
    products.reduce((acc, product) => {

      const categoryName = product.category?.trim();

      if (!categoryName) return acc;

      if (!acc[categoryName]) {
        acc[categoryName] = {
          name: categoryName,
          image: product.images?.[0] || "",
          count: 0
        };
      }

      acc[categoryName].count++;

      return acc;

    }, {})
  );

  return (

    <div className="min-h-screen bg-[#F8F7FC] px-5 py-12 md:px-12">

      {/* Heading */}
      <div className="max-w-7xl mx-auto text-center mb-12">

        <p className="text-violet-700 font-semibold uppercase tracking-widest text-sm">
          Explore CARTVIA
        </p>

        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-3">
          Shop By{" "}
          <span className="text-violet-700">
            Category.
          </span>
        </h1>

        <p className="text-gray-500 mt-4 text-lg">
          Explore our collections and find exactly what you love.
        </p>

      </div>

      {/* Loading */}
      {loading ? (

        <div className="text-center py-20">

          <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-700 rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-violet-700 font-semibold">
            Loading categories...
          </p>

        </div>

      ) : error ? (

        <div className="text-center py-20">

          <p className="text-red-500 font-semibold">
            {error}
          </p>

          <button
            onClick={fetchProducts}
            className="mt-5 bg-violet-700 text-white px-6 py-3 rounded-xl hover:bg-violet-800"
          >
            Try Again
          </button>

        </div>

      ) : categories.length > 0 ? (

        /* Category Cards */
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">

          {categories.map((category) => (

            <Link
              to={`/products?category=${encodeURIComponent(category.name)}`}
              key={category.name}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300"
            >

              {/* Category Image */}
              <div className="h-64 bg-violet-100 overflow-hidden">

                {category.image ? (

                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />

                ) : (

                  <div className="w-full h-full flex items-center justify-center">
                    <PackageSearch
                      size={65}
                      className="text-violet-400"
                    />
                  </div>

                )}

              </div>

              {/* Category Details */}
              <div className="p-6 text-center">

                <h2 className="text-xl font-bold text-gray-900 group-hover:text-violet-700 transition">
                  {category.name}
                </h2>

                <p className="text-gray-500 mt-2">
                  {category.count} Products
                </p>

                <span className="inline-block mt-5 text-violet-700 font-semibold group-hover:underline">
                  Explore Collection →
                </span>

              </div>

            </Link>

          ))}

        </div>

      ) : (

        <div className="text-center py-20 bg-white rounded-2xl max-w-3xl mx-auto">

          <PackageSearch
            size={55}
            className="mx-auto text-violet-300 mb-4"
          />

          <h2 className="text-2xl font-bold text-gray-800">
            No Categories Found
          </h2>

          <p className="text-gray-500 mt-2">
            Add products from your admin dashboard to see categories here.
          </p>

        </div>

      )}

    </div>

  );
};

export default Categories;