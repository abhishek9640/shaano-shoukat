"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Loader2, Star, ShoppingCart, ArrowLeft } from "lucide-react";
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

// Map slug → display name for heading
const slugMap: Record<string, string> = {
  "home-decor": "Home Decor",
  "kitchen-dining": "Kitchen & Dining",
  "home-textile": "Textiles",
  "flowers-greens": "Artificial Plants",
  "gift-collection": "Gift Sets",
  "sale": "Sale",
};

export default function CategoryPage() {
  const params = useParams();
  const slug = params.category as string;
  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categoryId, setCategoryId] = useState<string>("");

  // Find category by matching slug to category name
  const findCategory = useCallback(async () => {
    try {
      const res = await api.get("/categories");
      const cats: Category[] = res.data.data;
      const displayName = slugMap[slug] || slug;
      const match = cats.find(
        (c) => c.name.toLowerCase() === displayName.toLowerCase()
      );
      if (match) setCategoryId(match._id);
    } catch {
      console.error("Failed to fetch categories");
    }
  }, [slug]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, limit: 12 };
      if (categoryId) params.category = categoryId;
      const res = await api.get("/products", { params });
      setProducts(res.data.data);
      setTotalPages(res.data.pagination?.pages || 1);
    } catch {
      console.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, [page, categoryId]);

  useEffect(() => {
    findCategory();
  }, [findCategory]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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

  const displayName = slugMap[slug] || slug;

  return (
    <div className="bg-[#121212] min-h-screen">
      <Toaster position="top-center" />

      {/* Hero */}
      <div className="relative bg-gradient-to-b from-[#1c1c1e] to-[#121212] py-16 px-4 text-center">
        <Link
          href="/shop"
          className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-[#a69255] transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Shop
        </Link>
        <h1 className="text-4xl md:text-5xl font-sans font-bold text-white mb-3">
          {displayName}
        </h1>
        <p className="text-gray-400">
          Browse our {displayName.toLowerCase()} collection
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#a69255]" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No products in this category yet</p>
            <Link href="/shop" className="mt-4 inline-block text-[#a69255] hover:underline text-sm">
              Browse all products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <div key={product._id} className="group bg-[#1c1c1e] rounded-xl border border-white/5 overflow-hidden hover:border-white/10 transition-all duration-300 hover-lift">
                <Link href={`/product/${product._id}`}>
                  <div className="aspect-square bg-[#2a2a2c] relative overflow-hidden">
                    {product.images[0]?.url ? (
                      <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600">No Image</div>
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
                    <h3 className="text-sm font-medium text-white truncate hover:text-[#a69255] transition-colors">{product.name}</h3>
                  </Link>
                  <div className="flex items-center gap-1 mt-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < Math.round(product.ratings) ? "text-[#a69255] fill-[#a69255]" : "text-gray-600"}`} />
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-semibold text-white">₹{product.price.toLocaleString()}</span>
                    {product.stock > 0 && (
                      <button onClick={() => handleAddToCart(product)} className="p-2 rounded-lg bg-[#a69255]/10 text-[#a69255] hover:bg-[#a69255]/20 transition-colors">
                        <ShoppingCart className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} className={`px-3 py-1.5 rounded text-sm transition-colors ${p === page ? "bg-[#a69255] text-black font-semibold" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
