"use client";

export default function NewsletterSignup() {
    return (
        <section className="py-10 sm:py-16 md:py-24 bg-[#121212]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2c] rounded-xl sm:rounded-[2rem] p-6 sm:p-8 md:p-16 border border-white/10 overflow-hidden text-center">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                    <div className="relative z-10">
                        <p className="text-primary text-sm uppercase tracking-[0.3em] font-medium mb-3">
                            Stay Connected
                        </p>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans text-white font-bold mb-3 sm:mb-4">
                            Join the ShaanoShaukat Community
                        </h2>
                        <p className="text-gray-400 max-w-md mx-auto mb-2 text-sm sm:text-base">
                            Subscribe for exclusive offers, styling tips, and early access to new collections.
                        </p>
                        <p className="text-primary font-semibold text-sm mb-8">
                            Get 10% off your first order
                        </p>

                        <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 bg-[#0a0a0a] border border-white/20 rounded-full py-3.5 px-6 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors text-sm"
                            />
                            <button
                                type="submit"
                                className="bg-primary hover:bg-primary-dark text-black font-semibold py-3.5 px-8 rounded-full transition-all uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] whitespace-nowrap"
                            >
                                Subscribe
                            </button>
                        </form>

                        <p className="text-gray-600 text-xs mt-4">
                            No spam, ever. Unsubscribe anytime.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
