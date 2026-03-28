"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";
import toast, { Toaster } from "react-hot-toast";

import ProductGallery from "@/components/pdp/ProductGallery";
import ProductInfo from "@/components/pdp/ProductInfo";
import ProductHighlights from "@/components/pdp/ProductHighlights";
import ProductTabs from "@/components/pdp/ProductTabs";
import RelatedProducts from "@/components/pdp/RelatedProducts";
import StickyMobileCTA from "@/components/pdp/StickyMobileCTA";

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

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#D4AF37]" />
          <p className="text-sm text-gray-500 font-body">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-400 text-lg font-body">Product not found</p>
        <Link
          href="/shop"
          className="text-[#D4AF37] hover:underline font-body"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#121212] min-h-screen pb-20 lg:pb-0">
      <Toaster position="top-center" />

      {/* ── Breadcrumb ── */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <ol className="flex items-center gap-1.5 text-xs text-gray-500 font-body">
          <li>
            <Link
              href="/"
              className="hover:text-[#D4AF37] transition-colors"
            >
              Home
            </Link>
          </li>
          <li className="text-gray-600">/</li>
          <li>
            <Link
              href="/shop"
              className="hover:text-[#D4AF37] transition-colors"
            >
              Shop
            </Link>
          </li>
          {product.category && (
            <>
              <li className="text-gray-600">/</li>
              <li>
                <Link
                  href="/shop"
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  {product.category.name}
                </Link>
              </li>
            </>
          )}
          <li className="text-gray-600">/</li>
          <li className="text-gray-400 truncate max-w-[180px]">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* ── Product Hero: Gallery + Info ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
          <ProductGallery images={product.images} name={product.name} />
          <ProductInfo product={product} />
        </div>
      </section>

      {/* ── Product Highlights ── */}
      <ProductHighlights />

      {/* ── Editorial Lifestyle Section ── */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Lifestyle Image */}
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#1c1c1e]">
              {product.images[1]?.url ? (
                <img
                  src={product.images[1].url}
                  alt={`${product.name} lifestyle`}
                  className="w-full h-full object-cover"
                />
              ) : product.images[0]?.url ? (
                <img
                  src={product.images[0].url}
                  alt={`${product.name} lifestyle`}
                  className="w-full h-full object-cover opacity-80"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600 font-body">
                  Lifestyle Image
                </div>
              )}
            </div>

            {/* Editorial Content */}
            <div className="space-y-6 lg:pl-4">
              <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-body font-medium">
                The ShaanoShaukat Difference
              </span>
              <h2 className="text-3xl md:text-4xl font-sans font-semibold text-white leading-snug">
                Designed to Elevate
                <br />
                <span className="text-[#D4AF37]">Every Corner</span>
              </h2>
              <p className="text-gray-400 font-body text-base leading-relaxed max-w-md">
                Each piece in our collection is thoughtfully curated to bring
                warmth, character, and a touch of luxury to your living spaces.
                From statement decor to understated accents — we believe your
                home deserves the extraordinary.
              </p>
              <div className="flex gap-8 pt-4">
                <div>
                  <p className="text-2xl font-sans font-semibold text-white">
                    10K+
                  </p>
                  <p className="text-xs text-gray-500 font-body uppercase tracking-wider mt-1">
                    Happy Homes
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-sans font-semibold text-white">
                    500+
                  </p>
                  <p className="text-xs text-gray-500 font-body uppercase tracking-wider mt-1">
                    Products
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-sans font-semibold text-white">
                    4.8
                  </p>
                  <p className="text-xs text-gray-500 font-body uppercase tracking-wider mt-1">
                    Avg Rating
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Product Tabs (Description / Specs / Care) ── */}
      <ProductTabs description={product.description} />

      {/* ── Trust & Social Proof ── */}
      <section className="py-16 md:py-20 bg-[#161618]">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-sans font-semibold text-white mb-10">
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Priya S.",
                text: "Absolutely stunning piece! The quality exceeded my expectations. It looks even better in person.",
                rating: 5,
              },
              {
                name: "Rahul M.",
                text: "Perfect addition to our living room. The packaging was premium and delivery was quick.",
                rating: 5,
              },
              {
                name: "Ananya K.",
                text: "Bought this as a gift and it was a huge hit! Will definitely order more from ShaanoShaukat.",
                rating: 4,
              },
            ].map((review, i) => (
              <div
                key={i}
                className="bg-[#1c1c1e] rounded-xl p-6 border border-white/5 text-left"
              >
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <svg
                      key={j}
                      className={`h-4 w-4 ${
                        j < review.rating
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
                <p className="text-gray-300 font-body text-sm leading-relaxed mb-4">
                  &ldquo;{review.text}&rdquo;
                </p>
                <p className="text-xs text-gray-500 font-body font-medium uppercase tracking-wider">
                  — {review.name}
                </p>
              </div>
            ))}
          </div>

          {/* Trust Badge */}
          <div className="mt-10 inline-flex items-center gap-2 px-5 py-2.5 bg-[#D4AF37]/10 rounded-full border border-[#D4AF37]/20">
            <svg
              className="h-4 w-4 text-[#D4AF37] fill-[#D4AF37]"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm text-[#D4AF37] font-body font-medium">
              Loved by 10,000+ homes across India
            </span>
          </div>
        </div>
      </section>

      {/* ── Related Products ── */}
      {product.category && (
        <RelatedProducts
          categoryId={product.category._id}
          currentProductId={product._id}
        />
      )}

      {/* ── Sticky Mobile CTA ── */}
      <StickyMobileCTA product={product} />
    </div>
  );
}
