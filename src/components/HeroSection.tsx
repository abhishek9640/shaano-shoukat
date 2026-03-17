import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
    return (
        <section className="relative w-full bg-[#0a0a0a] flex flex-col overflow-hidden">

            {/* Main Image Container */}
            <div className="relative w-full lg:w-[95%] max-w-[1400px] mx-auto">
                {/* Mobile: taller aspect ratio, Desktop: wider */}
                <div className="relative aspect-[3/4] sm:aspect-[4/3] md:aspect-[2.2/1] w-full">

                    {/* Main Image */}
                    <div className="absolute inset-0">
                        <Image
                            src="/images/banners/hero-banner.png"
                            alt="Luxury Home Decor"
                            fill
                            priority
                            className="object-cover object-center md:object-right-bottom"
                            sizes="(max-width: 1400px) 100vw, 1400px"
                        />
                    </div>

                    {/* Mobile gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 md:hidden" />

                    {/* Mobile Text - overlaid on image */}
                    <div className="md:hidden absolute bottom-0 left-0 right-0 p-6 pb-8 z-10 text-center">
                        <p className="text-white/60 font-body text-[10px] tracking-[0.2em] font-light mb-1.5 uppercase">
                            Premium Home Decor Crafted for Elegant Homes
                        </p>
                        <h1 className="text-xl font-sans text-white font-bold tracking-wider uppercase leading-tight">
                            Elevate Your <span className="text-[#a69255]">Living Space</span>
                        </h1>
                        <div className="flex justify-center gap-2.5 mt-4">
                            <Link
                                href="/shop"
                                className="bg-primary hover:bg-primary-dark text-black font-semibold py-2 px-4 rounded-full transition-all uppercase tracking-wider text-[10px]"
                            >
                                Shop Collection
                            </Link>
                            <Link
                                href="/shop/new-arrivals"
                                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold py-2 px-4 rounded-full transition-all uppercase tracking-wider text-[10px] border border-white/20"
                            >
                                New Arrivals
                            </Link>
                        </div>
                    </div>

                    {/* Desktop Text Overlay */}
                    <div className="hidden md:flex absolute bottom-0 right-0 w-1/2 lg:w-[45%] h-[55%] flex-col justify-end z-10 pr-10 pb-8 mr-16">
                        <div className="text-center">
                            <p className="text-white/60 font-body text-xs md:text-sm lg:text-base tracking-[0.2em] font-light mb-1 uppercase">
                                Premium Home Decor Crafted for
                            </p>
                            <h1 className="text-3xl md:text-4xl lg:text-[2.8rem] font-sans text-white font-bold tracking-wider uppercase leading-tight">
                                Elevate Your
                                <br />
                                <span className="text-[#a69255]">Living Space</span>
                            </h1>
                            <div className="flex justify-center gap-3 mt-5">
                                <Link
                                    href="/shop"
                                    className="bg-primary hover:bg-primary-dark text-black font-semibold py-2.5 px-6 rounded-full transition-all uppercase tracking-wider text-xs shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]"
                                >
                                    Shop Collection
                                </Link>
                                <Link
                                    href="/shop/new-arrivals"
                                    className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold py-2.5 px-6 rounded-full transition-all uppercase tracking-wider text-xs border border-white/20"
                                >
                                    Explore New Arrivals
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ticker Banner */}
            <div className="w-full bg-[#111111] py-3 sm:py-4 overflow-hidden mt-0 opacity-90">
                <div className="whitespace-nowrap flex animate-[marquee_25s_linear_infinite]">
                    {[...Array(8)].map((_, i) => (
                        <span key={i} className="text-[10px] sm:text-xs md:text-sm tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.3em] font-body text-[#5a5a5a] mx-6 sm:mx-8 md:mx-12 font-medium uppercase">
                            FREE SHIPPING ABOVE ₹999 &nbsp;•&nbsp; NEW ARRIVALS EVERY WEEK &nbsp;•&nbsp; LIMITED FESTIVE COLLECTION
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}
