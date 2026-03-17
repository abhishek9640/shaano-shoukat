import Image from "next/image";
import Link from "next/link";
import { categories } from "@/data/products";

export default function CategoryShowcase() {
    return (
        <section className="py-10 sm:py-16 md:py-24 bg-[#0a0a0a]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-6 sm:mb-12 md:mb-16">
                    <p className="text-primary text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] font-medium mb-2 sm:mb-3">
                        Browse by Category
                    </p>
                    <h2 className="text-2xl sm:text-3xl md:text-5xl font-sans font-bold text-white">
                        Shop Our <span className="italic text-primary">Collections</span>
                    </h2>
                </div>

                {/* Desktop / Tablet Grid */}
                <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
                    {categories.map((cat, i) => (
                        <Link
                            key={cat.id}
                            href={cat.href}
                            className={`group relative overflow-hidden rounded-2xl hover-lift ${i === 0 ? "lg:row-span-2 lg:aspect-auto" : "aspect-square"}`}
                        >
                            <Image
                                src={cat.image}
                                alt={cat.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                sizes="(max-width: 768px) 50vw, 25vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-5">
                                <h3 className="text-white font-sans text-lg font-semibold tracking-wide">
                                    {cat.name}
                                </h3>
                                <span className="text-white/60 text-sm group-hover:text-primary transition-colors">
                                    Explore →
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Mobile: 2-column grid with scroll for overflow */}
                <div className="md:hidden grid grid-cols-2 gap-3">
                    {categories.slice(0, 6).map((cat) => (
                        <Link
                            key={cat.id}
                            href={cat.href}
                            className="group relative aspect-[3/4] overflow-hidden rounded-xl"
                        >
                            <Image
                                src={cat.image}
                                alt={cat.name}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                sizes="50vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                                <h3 className="text-white font-sans text-sm font-semibold">
                                    {cat.name}
                                </h3>
                            </div>
                        </Link>
                    ))}
                    {/* Last category full-width */}
                    {categories.length > 6 && (
                        <Link
                            href={categories[6].href}
                            className="group relative aspect-[2/1] overflow-hidden rounded-xl col-span-2"
                        >
                            <Image
                                src={categories[6].image}
                                alt={categories[6].name}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                sizes="100vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                                <h3 className="text-white font-sans text-sm font-semibold">
                                    {categories[6].name}
                                </h3>
                                <span className="text-white/50 text-xs group-hover:text-primary transition-colors">
                                    Explore →
                                </span>
                            </div>
                        </Link>
                    )}
                </div>
            </div>
        </section>
    );
}
