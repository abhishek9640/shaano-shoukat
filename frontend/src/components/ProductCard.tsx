import Image from "next/image";
import { Heart } from "lucide-react";
import { Product } from "@/data/products";

export default function ProductCard({ product }: { product: Product }) {
    return (
        <div className="group relative bg-[#1c1c1e] rounded-lg sm:rounded-xl overflow-hidden shadow-lg border border-white/5 transition-all duration-300 hover:border-primary/50 hover:shadow-primary/10">

            {/* Product Image Area */}
            <div className="relative aspect-square sm:aspect-[3/4] w-full overflow-hidden bg-[#2a2a2c] image-swap">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-60"></div>
                <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover transform group-hover:scale-105 transition-transform duration-500 z-0 img-default"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                {product.hoverImage && (
                    <Image
                        src={product.hoverImage}
                        alt={product.title}
                        fill
                        className="object-cover img-hover absolute inset-0 z-0"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                )}

                {/* Favorite Button */}
                <button className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 p-1.5 sm:p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                    <Heart className="h-4 w-4 sm:h-5 sm:w-5 hover:fill-current" />
                </button>

                {/* Optional Badge */}
                {(product.isPopular || product.badge) && (
                    <span className="absolute top-2 left-2 sm:top-3 sm:left-3 z-20 px-2 py-0.5 sm:px-3 sm:py-1 bg-primary text-black text-[9px] sm:text-xs font-bold uppercase tracking-wider rounded-full">
                        {product.badge || "Popular"}
                    </span>
                )}
            </div>

            {/* Product Content */}
            <div className="p-3 sm:p-4 flex flex-col justify-between">
                <div>
                    <p className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-wider mb-0.5 sm:mb-1 font-sans">{product.category}</p>
                    <h3 className="text-white font-sans text-xs sm:text-base font-medium mb-1 sm:mb-2 truncate group-hover:text-primary transition-colors">
                        {product.title}
                    </h3>
                </div>
                <div className="flex items-center justify-between mt-2 sm:mt-3">
                    <span className="text-white font-medium text-sm sm:text-base">{product.price}</span>
                    <button className="hidden sm:inline text-xs font-semibold text-primary hover:text-primary-dark transition-colors uppercase tracking-wider border-b border-primary pb-0.5">
                        Add to Cart
                    </button>
                    <button className="sm:hidden text-[10px] font-semibold text-primary uppercase tracking-wide">
                        + Cart
                    </button>
                </div>
            </div>
        </div>
    );
}
