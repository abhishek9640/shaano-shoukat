import Image from "next/image";
import Link from "next/link";
import { Heart, Star, ShoppingCart } from "lucide-react";
import { bestSellers } from "@/data/products";

export default function BestSellers() {
    return (
        <section className="py-10 sm:py-16 md:py-24 bg-[#0a0a0a]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-12">
                    <div>
                        <p className="text-primary text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] font-medium mb-2 sm:mb-3">
                            Community Favorites
                        </p>
                        <h2 className="text-2xl sm:text-3xl md:text-5xl font-sans font-bold text-white">
                            Shop Our <span className="italic text-primary">Best Sellers</span>
                        </h2>
                    </div>
                    <Link
                        href="/shop/best-sellers"
                        className="hidden md:inline-flex items-center font-medium text-primary hover:text-primary-dark transition-colors border-b border-primary pb-1 self-end uppercase text-sm tracking-wider mt-4 md:mt-0"
                    >
                        View All Best Sellers
                    </Link>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                    {bestSellers.map((product) => (
                        <div
                            key={product.id}
                            className="group relative bg-[#1c1c1e] rounded-lg sm:rounded-2xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-300 hover-lift"
                        >
                            {/* Image */}
                            <div className="relative aspect-square w-full overflow-hidden bg-[#2a2a2c] image-swap">
                                <Image
                                    src={product.image}
                                    alt={product.title}
                                    fill
                                    className="object-cover img-default"
                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                                />
                                {product.hoverImage && (
                                    <Image
                                        src={product.hoverImage}
                                        alt={product.title}
                                        fill
                                        className="object-cover img-hover absolute inset-0"
                                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />

                                {product.badge && (
                                    <span className="absolute top-2 left-2 sm:top-4 sm:left-4 z-20 px-2 py-0.5 sm:px-3 sm:py-1 bg-primary text-black text-[9px] sm:text-[10px] font-bold uppercase tracking-wider rounded-full">
                                        {product.badge}
                                    </span>
                                )}

                                <button className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 p-1.5 sm:p-2 rounded-full bg-white/10 backdrop-blur-sm text-white/70 hover:text-white hover:bg-white/20 transition-colors">
                                    <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                </button>
                            </div>

                            {/* Product Info */}
                            <div className="p-3 sm:p-5">
                                <p className="text-gray-500 text-[10px] sm:text-xs uppercase tracking-wider mb-0.5 sm:mb-1">{product.category}</p>
                                <h3 className="text-white font-sans text-xs sm:text-base font-medium mb-1 sm:mb-2 truncate group-hover:text-primary transition-colors">
                                    {product.title}
                                </h3>

                                {/* Rating */}
                                {product.rating && (
                                    <div className="flex items-center gap-1 sm:gap-1.5 mb-2 sm:mb-3">
                                        <div className="star-rating">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 ${i < Math.floor(product.rating!) ? "fill-current" : "opacity-30"}`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-white/80 text-[10px] sm:text-xs font-medium">{product.rating}</span>
                                        <span className="text-gray-500 text-[10px] sm:text-xs hidden sm:inline">({product.reviews})</span>
                                    </div>
                                )}

                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-2">
                                        <span className="text-white font-semibold text-sm sm:text-base">{product.price}</span>
                                        {product.originalPrice && (
                                            <span className="text-gray-500 text-[10px] sm:text-sm line-through">{product.originalPrice}</span>
                                        )}
                                    </div>
                                    <button className="p-2 sm:p-2.5 rounded-full bg-primary hover:bg-primary-dark text-black transition-colors">
                                        <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 sm:mt-10 text-center md:hidden">
                    <Link
                        href="/shop/best-sellers"
                        className="inline-flex items-center font-medium text-primary hover:text-primary-dark transition-colors border-b border-primary pb-1 uppercase text-xs sm:text-sm tracking-wider"
                    >
                        View All Best Sellers
                    </Link>
                </div>
            </div>
        </section>
    );
}
