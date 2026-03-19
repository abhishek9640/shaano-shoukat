import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { rooms } from "@/data/products";

export default function ShopByRoom() {
    return (
        <section className="py-10 sm:py-16 md:py-24 bg-[#121212]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-6 sm:mb-12 md:mb-16">
                    <p className="text-primary text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] font-medium mb-2 sm:mb-3">
                        Room Inspiration
                    </p>
                    <h2 className="text-2xl sm:text-3xl md:text-5xl font-sans font-bold text-white">
                        Shop by <span className="italic text-primary">Room</span>
                    </h2>
                    <p className="section-subheading mx-auto mt-2 sm:mt-3">
                        Find curated collections designed for every room in your home.
                    </p>
                </div>

                {/* Room Grid - 4 columns on desktop, 2 on tablet, 1 on mobile with different heights */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
                    {rooms.map((room, index) => (
                        <Link
                            key={room.id}
                            href={room.href}
                            className={`group relative overflow-hidden rounded-2xl hover-lift ${index === 0 || index === 3 ? "aspect-[3/4]" : "aspect-square"
                                }`}
                        >
                            <Image
                                src={room.image}
                                alt={room.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-black/90 transition-colors duration-300" />

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6 flex items-end justify-between">
                                <div>
                                    <h3 className="text-white font-sans text-sm sm:text-xl font-semibold tracking-wide mb-0.5 sm:mb-1">
                                        {room.name}
                                    </h3>
                                    <p className="text-white/50 text-[10px] sm:text-sm">{room.productCount} Products</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm p-1.5 sm:p-2 rounded-full group-hover:bg-primary group-hover:text-black text-white transition-all duration-300">
                                    <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
