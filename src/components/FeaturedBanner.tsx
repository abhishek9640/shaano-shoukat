import Image from "next/image";
import Link from "next/link";

export default function FeaturedBanner() {
    return (
        <section className="py-10 sm:py-16 md:py-24 bg-[#121212]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative w-full overflow-hidden rounded-xl sm:rounded-[2rem] bg-[#1c1c1e] border border-white/10 group shadow-2xl">
                    {/* Banner Image */}
                    <div className="relative w-full aspect-[16/7] min-h-[350px]">
                        <Image
                            src="/images/banners/featured-collection.png"
                            alt="Dear Spring Collection"
                            fill
                            className="object-cover object-center transition-transform duration-[12s] group-hover:scale-105"
                            sizes="100vw"
                        />
                        {/* Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>

                    {/* Text Content */}
                    <div className="absolute inset-0 flex flex-col justify-center px-5 sm:px-8 md:px-16 z-10">
                        <p className="text-primary text-xs sm:text-sm uppercase tracking-[0.3em] font-medium mb-3">
                            Curated Collection
                        </p>
                        <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-sans text-white max-w-lg leading-tight">
                            Dear Spring
                            <br />
                            <span className="italic font-light">Collection</span>
                        </h2>
                        <p className="text-white/60 mt-4 max-w-md text-sm md:text-base hidden sm:block">
                            Refresh your home with our curated spring collection — lighter textures, pastel hues, and botanical accents.
                        </p>
                        <div className="mt-6 md:mt-8">
                            <Link
                                href="/shop/spring-collection"
                                className="inline-block bg-primary hover:bg-primary-dark text-black font-semibold py-3 px-8 rounded-full transition-all uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]"
                            >
                                Shop Now
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
