"use client";

import { ShoppingCart, Tag } from "lucide-react";
import { useCart } from "@/lib/cartContext";
import toast from "react-hot-toast";

interface StickyMobileCTAProps {
  product: {
    _id: string;
    name: string;
    price: number;
    compareAtPrice?: number;
    discount?: number;
    images: { url: string }[];
    stock: number;
  };
}

export default function StickyMobileCTA({ product }: StickyMobileCTAProps) {
  const { addToCart } = useCart();

  if (product.stock <= 0) return null;

  const handleAdd = () => {
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0]?.url || "",
      stock: product.stock,
    });
    toast.success("Added to cart");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-[#1c1c1e]/95 backdrop-blur-lg border-t border-white/10 px-4 py-3 safe-area-bottom">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-baseline gap-2">
            <p className="text-lg font-semibold text-white font-body">
              ₹{product.price.toLocaleString()}
            </p>
            {product.compareAtPrice &&
              product.compareAtPrice > product.price && (
                <p className="text-xs text-gray-500 font-body line-through">
                  ₹{product.compareAtPrice.toLocaleString()}
                </p>
              )}
          </div>
          <div className="flex items-center gap-2">
            {product.discount && product.discount > 0 ? (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-body font-medium">
                <Tag className="h-3 w-3" />
                {product.discount}% OFF
              </span>
            ) : (
              <p className="text-[11px] text-gray-500 font-body">
                MRP incl. taxes
              </p>
            )}
          </div>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-black font-body font-semibold text-sm rounded-xl hover:bg-[#c9a530] transition-colors"
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
