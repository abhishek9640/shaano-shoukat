"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart, Tag } from "lucide-react";
import api from "@/lib/api";
import { useCart } from "@/lib/cartContext";
import toast from "react-hot-toast";

interface RelatedProduct {
  _id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  discount?: number;
  images: { url: string }[];
  category: { _id: string; name: string } | null;
}

interface RelatedProductsProps {
  categoryId: string;
  currentProductId: string;
  relatedProducts?: RelatedProduct[];
  upsellProducts?: RelatedProduct[];
}

export default function RelatedProducts({
  categoryId,
  currentProductId,
  relatedProducts,
  upsellProducts,
}: RelatedProductsProps) {
  const [products, setProducts] = useState<RelatedProduct[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    // Use pre-populated related/upsell if available
    const prePopulated = [
      ...(relatedProducts || []),
      ...(upsellProducts || []),
    ].filter((p) => p._id !== currentProductId);

    if (prePopulated.length > 0) {
      setProducts(prePopulated.slice(0, 4));
      return;
    }

    // Fallback: fetch by category
    const fetchRelated = async () => {
      try {
        const res = await api.get("/products", {
          params: { category: categoryId, limit: 5 },
        });
        const filtered = res.data.data.filter(
          (p: RelatedProduct) => p._id !== currentProductId
        );
        setProducts(filtered.slice(0, 4));
      } catch {
        console.error("Failed to fetch related products");
      }
    };
    if (categoryId) fetchRelated();
  }, [categoryId, currentProductId, relatedProducts, upsellProducts]);

  if (products.length === 0) return null;

  const handleQuickAdd = (p: RelatedProduct) => {
    addToCart({
      _id: p._id,
      name: p.name,
      price: p.price,
      image: p.images[0]?.url || "",
      stock: 99,
    });
    toast.success(`${p.name} added to cart`);
  };

  return (
    <section className="py-16 md:py-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-sans font-semibold text-white tracking-tight">
            You May Also Like
          </h2>
          <p className="text-sm text-gray-500 font-body mt-2">
            Curated pieces from the same collection
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p) => (
            <div
              key={p._id}
              className="group bg-[#1c1c1e] rounded-xl overflow-hidden border border-white/5 hover:border-[#D4AF37]/30 transition-all duration-300 hover-lift"
            >
              <Link href={`/product/${p._id}`}>
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={p.images[0]?.url || ""}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Discount badge */}
                  {p.discount && p.discount > 0 && (
                    <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/90 text-white text-xs font-body font-semibold rounded-full">
                      <Tag className="h-3 w-3" />
                      {p.discount}% OFF
                    </span>
                  )}
                  {/* Quick Add overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleQuickAdd(p);
                      }}
                      className="px-4 py-2 bg-[#D4AF37] text-black text-xs font-body font-semibold uppercase tracking-wider rounded-lg hover:bg-[#c9a530] transition-colors flex items-center gap-1.5"
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      Quick Add
                    </button>
                  </div>
                </div>
              </Link>
              <div className="p-3 md:p-4">
                <p className="text-[10px] text-gray-500 uppercase tracking-[0.15em] font-body mb-1">
                  {p.category?.name || ""}
                </p>
                <Link href={`/product/${p._id}`}>
                  <h3 className="text-sm font-body font-medium text-white truncate hover:text-[#D4AF37] transition-colors">
                    {p.name}
                  </h3>
                </Link>
                <div className="flex items-baseline gap-2 mt-1.5">
                  <p className="text-sm text-white font-body font-medium">
                    ₹{p.price.toLocaleString()}
                  </p>
                  {p.compareAtPrice && p.compareAtPrice > p.price && (
                    <p className="text-xs text-gray-500 font-body line-through">
                      ₹{p.compareAtPrice.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
