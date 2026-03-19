"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal, X, Loader2, Star, ShoppingCart } from "lucide-react";
import api from "@/lib/api";
import { useCart } from "@/lib/cartContext";
import toast, { Toaster } from "react-hot-toast";

interface Product {
  _id: string;
  name: string;
  price: number;
  images: { url: string }[];
  ratings: number;
  stock: number;
  category: { _id: string; name: string } | null;
}

interface Category {
  _id: string;
  name: string;
}

export default function ShopPage() {
  const router = useRouter();
  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sort, setSort] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, limit: 12, sort };
      if (search) params.search = search;
      if (selectedCategory) params.category = selectedCategory;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const res = await api.get("/products", { params });
      setProducts(res.data.data);
      setTotalPages(res.data.pagination?.pages || 1);
    } catch {
      console.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, [page, search, selectedCategory, sort, minPrice, maxPrice]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data.data);
    } catch {
      console.error("Failed to fetch categories");
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
    setPage(1);
    router.push("/shop");
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0]?.url || "",
      stock: product.stock,
    });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="bg-[#121212] min-h-screen">
      <Toaster position="top-center" />

      {/* Hero Banner */}
      <div className="relative bg-gradient-to-b from-[#1c1c1e] to-[#121212] py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-sans font-bold text-white mb-3">
          Our Collection
        </h1>
        <p className="text-gray-400 max-w-lg mx-auto">
          Discover premium home decor curated for elegant living
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search + Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#1c1c1e] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#a69255] text-sm"
            />
          </form>
          <div className="flex gap-3">
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="px-4 py-3 rounded-xl bg-[#1c1c1e] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#a69255]"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="name_asc">Name: A-Z</option>
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#1c1c1e] border border-white/10 text-gray-300 hover:text-white transition-colors text-sm"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-[#1c1c1e] rounded-xl border border-white/5 p-6 mb-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
                className="w-full px-4 py-2.5 rounded-lg bg-[#121212] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#a69255]"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Min Price (₹)</label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-2.5 rounded-lg bg-[#121212] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#a69255]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Max Price (₹)</label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="99999"
                className="w-full px-4 py-2.5 rounded-lg bg-[#121212] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#a69255]"
              />
            </div>
            <div className="sm:col-span-3 flex justify-end">
              <button onClick={clearFilters} className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors">
                <X className="h-4 w-4" /> Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Product Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#a69255]" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No products found</p>
            <button onClick={clearFilters} className="mt-4 text-[#a69255] hover:underline text-sm">
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <div key={product._id} className="group bg-[#1c1c1e] rounded-xl border border-white/5 overflow-hidden hover:border-white/10 transition-all duration-300 hover-lift">
                <Link href={`/product/${product._id}`}>
                  <div className="aspect-square bg-[#2a2a2c] relative overflow-hidden">
                    {product.images[0]?.url ? (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600">
                        No Image
                      </div>
                    )}
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">Out of Stock</span>
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <Link href={`/product/${product._id}`}>
                    <h3 className="text-sm font-medium text-white truncate hover:text-[#a69255] transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-gray-500 mt-1">
                    {product.category?.name || "Uncategorized"}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < Math.round(product.ratings) ? "text-[#a69255] fill-[#a69255]" : "text-gray-600"}`} />
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-semibold text-white">
                      ₹{product.price.toLocaleString()}
                    </span>
                    {product.stock > 0 && (
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="p-2 rounded-lg bg-[#a69255]/10 text-[#a69255] hover:bg-[#a69255]/20 transition-colors"
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg text-sm border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
              .map((p, idx, arr) => (
                <span key={p} className="flex items-center">
                  {idx > 0 && arr[idx - 1] !== p - 1 && <span className="text-gray-500 mx-1">...</span>}
                  <button
                    onClick={() => setPage(p)}
                    className={`px-3 py-1.5 rounded text-sm transition-colors ${p === page ? "bg-[#a69255] text-black font-semibold" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
                  >
                    {p}
                  </button>
                </span>
              ))}
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg text-sm border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
