import Image from "next/image";
import Link from "next/link";

export default function BrandStory() {
    return (
        <section className="py-10 sm:py-16 md:py-24 bg-[#121212]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                    {/* Left: Image */}
                    <div className="relative aspect-[4/5] lg:aspect-[3/4] rounded-2xl overflow-hidden group">
                        <Image
                            src="/images/lifestyle/brand-story.png"
                            alt="ShaanoShaukat - Curated luxury home decor"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </div>

                    {/* Right: Text Content */}
                    <div className="flex flex-col justify-center">
                        <p className="text-primary text-sm uppercase tracking-[0.3em] font-medium mb-4">
                            Our Story
                        </p>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-sans text-white font-bold leading-tight mb-4 sm:mb-6">
                            Timeless Elegance
                            <br />
                            <span className="italic font-light text-primary">for Modern Homes</span>
                        </h2>
                        <p className="text-gray-400 leading-relaxed mb-6 text-base md:text-lg">
                            ShaanoShaukat brings timeless elegance to modern homes with curated decor pieces
                            designed to elevate every corner of your living space.
                        </p>
                        <p className="text-gray-400 leading-relaxed mb-8 text-base md:text-lg">
                            Each piece in our collection is thoughtfully sourced and crafted, blending traditional
                            artistry with contemporary design. From handwoven textiles to artisan ceramics,
                            we believe your home should tell your story.
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8 border-t border-white/10 pt-6 sm:pt-8">
                            <div>
                                <p className="text-xl sm:text-3xl font-sans font-bold text-primary">500+</p>
                                <p className="text-gray-500 text-[10px] sm:text-sm mt-0.5 sm:mt-1">Curated Products</p>
                            </div>
                            <div>
                                <p className="text-xl sm:text-3xl font-sans font-bold text-primary">50K+</p>
                                <p className="text-gray-500 text-[10px] sm:text-sm mt-0.5 sm:mt-1">Happy Homes</p>
                            </div>
                            <div>
                                <p className="text-xl sm:text-3xl font-sans font-bold text-primary">4.9</p>
                                <p className="text-gray-500 text-[10px] sm:text-sm mt-0.5 sm:mt-1">Avg. Rating</p>
                            </div>
                        </div>

                        <Link
                            href="/about"
                            className="inline-block self-start bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-black font-semibold py-3 px-8 rounded-full transition-all uppercase tracking-widest text-sm"
                        >
                            Learn More
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
