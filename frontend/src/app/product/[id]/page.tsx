"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Star,
  ShoppingCart,
  ArrowLeft,
  Loader2,
  Minus,
  Plus,
  Package,
} from "lucide-react";
import api from "@/lib/api";
import { useCart } from "@/lib/cartContext";
import toast, { Toaster } from "react-hot-toast";

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  images: { url: string }[];
  ratings: number;
  numReviews: number;
  stock: number;
  category: { _id: string; name: string } | null;
}

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data.data);
      } catch {
        console.error("Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(
      {
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0]?.url || "",
        stock: product.stock,
      },
      qty
    );
    toast.success(`${product.name} added to cart`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#a69255]" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-400 text-lg">Product not found</p>
        <Link href="/shop" className="text-[#a69255] hover:underline">
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#121212] min-h-screen">
      <Toaster position="top-center" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-[#a69255] transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-[#1c1c1e] rounded-2xl overflow-hidden border border-white/5">
              {product.images[selectedImage]?.url ? (
                <img
                  src={product.images[selectedImage].url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600 text-lg">
                  No Image Available
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      i === selectedImage
                        ? "border-[#a69255]"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`${product.name} ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            {product.category && (
              <Link
                href={`/shop`}
                className="text-sm text-[#a69255] hover:underline"
              >
                {product.category.name}
              </Link>
            )}

            <h1 className="text-3xl md:text-4xl font-sans font-bold text-white">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.round(product.ratings)
                        ? "text-[#a69255] fill-[#a69255]"
                        : "text-gray-600"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-400">
                ({product.numReviews} reviews)
              </span>
            </div>

            {/* Price */}
            <p className="text-3xl font-bold text-white">
              ₹{product.price.toLocaleString()}
            </p>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-gray-400" />
              {product.stock > 0 ? (
                <span className="text-sm text-green-400">
                  In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="text-sm text-red-400">Out of Stock</span>
              )}
            </div>

            {/* Description */}
            <div className="border-t border-white/5 pt-6">
              <h3 className="text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                Description
              </h3>
              <p className="text-gray-400 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Quantity + Add to Cart */}
            {product.stock > 0 && (
              <div className="border-t border-white/5 pt-6 space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-300">Quantity</span>
                  <div className="flex items-center bg-[#1c1c1e] border border-white/10 rounded-lg">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="px-3 py-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-2 text-white font-medium min-w-[3rem] text-center">
                      {qty}
                    </span>
                    <button
                      onClick={() =>
                        setQty(Math.min(product.stock, qty + 1))
                      }
                      className="px-3 py-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-[#a69255] hover:bg-[#8a7a48] text-black font-semibold rounded-xl transition-all duration-200 text-lg"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
