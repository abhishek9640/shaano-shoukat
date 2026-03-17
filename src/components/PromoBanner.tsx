import Image from "next/image";
import Link from "next/link";

export default function PromoBanner() {
    return (
        <section className="py-24 bg-[#0a0a0a]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Banner Container with Soft Border Radius */}
                <div className="relative w-full overflow-hidden rounded-[2.5rem] bg-[#1c1c1e] border border-white/10 group shadow-2xl">

                    {/* Main Banner Image */}
                    <div className="relative w-full aspect-[21/9] min-h-[400px]">
                        <Image
                            src="/images/banners/2151074456 1.png"
                            alt="Beautify Your Home with Real Like Plants"
                            fill
                            className="object-cover object-center transform group-hover:scale-105 transition-transform duration-[15s]"
                            sizes="100vw"
                        />
                        {/* Gradient Overlay for Text Readability */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
                    </div>

                    {/* Text Content */}
                    <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 z-10">
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-sans text-white max-w-lg leading-tight tracking-wide">
                            BEAUTIFY YOUR HOME<br />
                            <span className="font-light">REAL LIKE </span>
                            <span className="inline-block bg-white text-black px-4 py-1 mt-2 rotate-[-2deg] font-bold tracking-widest uppercase origin-bottom-left hover:rotate-0 transition-transform">
                                PLANTS
                            </span>
                        </h2>
                        <div className="mt-8">
                            <Link
                                href="#products"
                                className="inline-block bg-primary hover:bg-primary-dark text-black font-semibold py-3 px-8 rounded-full transition-colors uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]"
                            >
                                Shop Collection
                            </Link>
                        </div>
                    </div>

                    {/* Decorative Dots Navigation (Static mimic of the reference design) */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
                        <button className="w-2.5 h-2.5 rounded-full bg-white opacity-100"></button>
                        <button className="w-2.5 h-2.5 rounded-full bg-white opacity-40 hover:opacity-100 transition-opacity"></button>
                        <button className="w-2.5 h-2.5 rounded-full bg-white opacity-40 hover:opacity-100 transition-opacity"></button>
                        <button className="w-2.5 h-2.5 rounded-full bg-white opacity-40 hover:opacity-100 transition-opacity"></button>
                        <button className="w-2.5 h-2.5 rounded-full bg-white opacity-40 hover:opacity-100 transition-opacity"></button>
                    </div>

                </div>
            </div>
        </section>
    );
}
