"use client";

import { useState } from "react";
import {
  Heart,
  ShoppingCart,
  Zap,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  Check,
  CreditCard,
  Tag,
} from "lucide-react";
import { useCart } from "@/lib/cartContext";
import toast from "react-hot-toast";

interface Product {
  _id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  discount?: number;
  shortDescription?: string;
  description: string;
  images: { url: string }[];
  ratings: number;
  numReviews: number;
  stock: number;
  brand?: string;
  collection?: string;
  category: { _id: string; name: string } | null;
  deliveryEstimate?: string;
  codAvailable?: boolean;
}

export default function ProductInfo({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
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
    setAddedToCart(true);
    toast.success(`Added to cart`);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    window.location.href = "/checkout";
  };

  // Use shortDescription if available, otherwise truncate description
  const displayDesc =
    product.shortDescription ||
    product.description.split(".").slice(0, 2).join(".").trim() + ".";

  return (
    <div className="space-y-6">
      {/* Brand / Collection tag */}
      {(product.brand || product.collection) && (
        <span className="inline-block text-xs uppercase tracking-[0.2em] text-[#D4AF37]/80 font-body font-medium">
          {product.brand}
          {product.brand && product.collection && " · "}
          {product.collection}
        </span>
      )}

      {/* Category tag (fallback if no brand) */}
      {!product.brand && product.category && (
        <span className="inline-block text-xs uppercase tracking-[0.2em] text-[#D4AF37]/80 font-body font-medium">
          {product.category.name}
        </span>
      )}

      {/* Product Title */}
      <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-sans font-semibold text-white leading-tight tracking-tight">
        {product.name}
      </h1>

      {/* Rating */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={`h-4 w-4 ${
                i < Math.round(product.ratings)
                  ? "text-[#D4AF37] fill-[#D4AF37]"
                  : "text-gray-600"
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="text-sm text-gray-400 font-body">
          {product.ratings.toFixed(1)} ({product.numReviews}{" "}
          {product.numReviews === 1 ? "review" : "reviews"})
        </span>
      </div>

      {/* Price with MRP + discount badge */}
      <div className="flex items-baseline gap-3 flex-wrap">
        <span className="text-3xl lg:text-4xl font-semibold text-white font-body tracking-tight">
          ₹{product.price.toLocaleString()}
        </span>
        {product.compareAtPrice && product.compareAtPrice > product.price && (
          <>
            <span className="text-lg text-gray-500 font-body line-through">
              ₹{product.compareAtPrice.toLocaleString()}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/15 text-emerald-400 text-sm font-body font-semibold rounded-full">
              <Tag className="h-3.5 w-3.5" />
              {product.discount || Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% OFF
            </span>
          </>
        )}
        {(!product.compareAtPrice ||
          product.compareAtPrice <= product.price) && (
          <span className="text-sm text-gray-500 font-body">
            MRP incl. taxes
          </span>
        )}
      </div>

      {/* Short Description */}
      <p className="text-gray-400 font-body text-base leading-relaxed max-w-lg">
        {displayDesc}
      </p>

      {/* Divider */}
      <div className="border-t border-white/5" />

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        {product.stock > 0 ? (
          <>
            <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-sm text-emerald-400 font-body font-medium">
              In Stock
            </span>
            {product.stock <= 5 && (
              <span className="text-xs text-amber-400 font-body ml-1">
                — Only {product.stock} left!
              </span>
            )}
          </>
        ) : (
          <>
            <span className="flex h-2 w-2 rounded-full bg-red-400" />
            <span className="text-sm text-red-400 font-body font-medium">
              Out of Stock
            </span>
          </>
        )}
      </div>

      {/* Quantity + CTA */}
      {product.stock > 0 && (
        <div className="space-y-4">
          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400 font-body uppercase tracking-wider">
              Qty
            </span>
            <div className="flex items-center bg-[#1c1c1e] border border-white/10 rounded-lg">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-3 py-2.5 text-gray-400 hover:text-white transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-5 py-2.5 text-white font-medium font-body min-w-[3rem] text-center border-x border-white/5">
                {qty}
              </span>
              <button
                onClick={() => setQty(Math.min(product.stock, qty + 1))}
                className="px-3 py-2.5 text-gray-400 hover:text-white transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              className={`flex-1 flex items-center justify-center gap-2.5 py-4 rounded-xl font-body font-semibold text-base transition-all duration-300 ${
                addedToCart
                  ? "bg-emerald-600 text-white"
                  : "bg-[#D4AF37] hover:bg-[#c9a530] text-black hover:shadow-[0_8px_30px_rgba(212,175,55,0.3)] hover:-translate-y-0.5"
              }`}
            >
              {addedToCart ? (
                <>
                  <Check className="h-5 w-5" />
                  Added!
                </>
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </>
              )}
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 flex items-center justify-center gap-2.5 py-4 rounded-xl border-2 border-[#D4AF37] text-[#D4AF37] font-body font-semibold text-base hover:bg-[#D4AF37]/10 transition-all duration-300 hover:-translate-y-0.5"
            >
              <Zap className="h-5 w-5" />
              Buy Now
            </button>
          </div>

          {/* Wishlist */}
          <button
            onClick={() => {
              setWishlisted(!wishlisted);
              toast.success(
                wishlisted ? "Removed from wishlist" : "Added to wishlist"
              );
            }}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#D4AF37] transition-colors font-body group"
          >
            <Heart
              className={`h-4 w-4 transition-all ${
                wishlisted
                  ? "text-red-400 fill-red-400"
                  : "group-hover:text-[#D4AF37]"
              }`}
            />
            {wishlisted ? "Saved to Wishlist" : "Add to Wishlist"}
          </button>
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-white/5" />

      {/* Delivery & Trust Info — dynamic */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm text-gray-400 font-body">
          <Truck className="h-4 w-4 text-[#D4AF37] flex-shrink-0" />
          <span>
            {product.deliveryEstimate
              ? `Delivery in ${product.deliveryEstimate}`
              : (
                <>
                  Free shipping on orders above{" "}
                  <span className="text-white font-medium">₹999</span>
                </>
              )}
          </span>
        </div>
        {product.codAvailable !== false && (
          <div className="flex items-center gap-3 text-sm text-gray-400 font-body">
            <CreditCard className="h-4 w-4 text-[#D4AF37] flex-shrink-0" />
            <span>Cash on Delivery available</span>
          </div>
        )}
        <div className="flex items-center gap-3 text-sm text-gray-400 font-body">
          <Shield className="h-4 w-4 text-[#D4AF37] flex-shrink-0" />
          <span>Secure packaging guaranteed</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-400 font-body">
          <RotateCcw className="h-4 w-4 text-[#D4AF37] flex-shrink-0" />
          <span>Easy 7-day returns</span>
        </div>
      </div>
    </div>
  );
}
