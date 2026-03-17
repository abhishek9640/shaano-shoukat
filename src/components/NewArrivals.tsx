"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, ShoppingBag } from "lucide-react";
import { newArrivals } from "@/data/products";
import { useRef } from "react";

export default function NewArrivals() {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const scrollAmount = 320;
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    return (
        <section className="py-10 sm:py-16 md:py-24 bg-[#0a0a0a]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex items-end justify-between mb-6 sm:mb-12">
                    <div>
                        <p className="text-primary text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] font-medium mb-2 sm:mb-3">
                            Just Dropped
                        </p>
                        <h2 className="text-2xl sm:text-3xl md:text-5xl font-sans font-bold text-white">
                            New <span className="italic text-primary">Arrivals</span>
                        </h2>
                    </div>
                    <div className="hidden md:flex items-center gap-3">
                        <button
                            onClick={() => scroll("left")}
                            className="p-3 rounded-full border border-white/20 text-white/60 hover:border-primary hover:text-primary transition-colors"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <button
                            onClick={() => scroll("right")}
                            className="p-3 rounded-full border border-white/20 text-white/60 hover:border-primary hover:text-primary transition-colors"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>

                {/* Horizontal Scroll Carousel */}
                <div
                    ref={scrollRef}
                    className="scroll-container"
                >
                    {newArrivals.map((product) => (
                        <div
                            key={product.id}
                            className="group w-[200px] sm:w-[280px] md:w-[300px] bg-[#1c1c1e] rounded-xl sm:rounded-2xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-300 hover-lift flex-shrink-0"
                        >
                            {/* Image */}
                            <div className="relative aspect-square w-full overflow-hidden bg-[#2a2a2c]">
                                <Image
                                    src={product.image}
                                    alt={product.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    sizes="300px"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />

                                {product.badge && (
                                    <span className="absolute top-4 left-4 z-20 px-3 py-1 bg-primary text-black text-[10px] font-bold uppercase tracking-wider rounded-full">
                                        {product.badge}
                                    </span>
                                )}

                                {/* Hover Actions */}
                                <div className="absolute bottom-4 left-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-3 group-hover:translate-y-0">
                                    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full bg-primary text-black font-semibold text-xs uppercase tracking-wider hover:bg-primary-dark transition-colors">
                                        <ShoppingBag className="h-3.5 w-3.5" />
                                        Add to Cart
                                    </button>
                                    <button className="p-2.5 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors">
                                        <Eye className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="p-3 sm:p-5">
                                <p className="text-gray-500 text-[10px] sm:text-xs uppercase tracking-wider mb-0.5 sm:mb-1">{product.category}</p>
                                <h3 className="text-white font-sans text-xs sm:text-base font-medium mb-1 sm:mb-2 truncate group-hover:text-primary transition-colors">
                                    {product.title}
                                </h3>
                                <span className="text-white font-semibold text-sm sm:text-base">{product.price}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile: View all link */}
                <div className="mt-10 text-center">
                    <Link
                        href="/shop/new-arrivals"
                        className="inline-flex items-center font-medium text-primary hover:text-primary-dark transition-colors border-b border-primary pb-1 uppercase text-sm tracking-wider"
                    >
                        View All New Arrivals
                    </Link>
                </div>
            </div>
        </section>
    );
}
