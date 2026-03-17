import Link from "next/link";

export default function LifestyleBanner() {
    return (
        <section className="relative py-20 sm:py-32 md:py-44 bg-[#121212] overflow-hidden">
            {/* Background Image with Parallax Feel */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-fixed"
                style={{ backgroundImage: "url('/images/lifestyle/lifestyle-banner.png')" }}
            />
            {/* Overlays */}
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#121212]/30 via-transparent to-[#121212]/30" />

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-primary text-xs sm:text-sm uppercase tracking-[0.3em] sm:tracking-[0.4em] font-medium mb-3 sm:mb-4">
                    Curated for You
                </p>
                <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-sans text-white font-bold leading-tight tracking-wide">
                    Make Your Home
                    <br />
                    <span className="italic font-light text-primary">Truly Yours</span>
                </h2>
                <p className="text-white/50 max-w-md mx-auto mt-4 sm:mt-6 text-sm sm:text-base md:text-lg">
                    Transform every corner into a reflection of your unique style.
                </p>
                <div className="mt-8">
                    <Link
                        href="/shop"
                        className="inline-block bg-white hover:bg-primary text-black font-semibold py-3.5 px-10 rounded-full transition-all uppercase tracking-widest text-sm shadow-lg hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
                    >
                        Explore Decor
                    </Link>
                </div>
            </div>
        </section>
    );
}
