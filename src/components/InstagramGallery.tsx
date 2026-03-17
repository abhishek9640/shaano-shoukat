import Image from "next/image";
import { Instagram } from "lucide-react";
import { instagramImages } from "@/data/products";

export default function InstagramGallery() {
    return (
        <section className="py-10 sm:py-16 md:py-24 bg-[#0a0a0a]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-6 sm:mb-12">
                    <p className="text-primary text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] font-medium mb-2 sm:mb-3">
                        @shaanoshaukat
                    </p>
                    <h2 className="text-2xl sm:text-3xl md:text-5xl font-sans font-bold text-white">
                        Styled by <span className="italic text-primary">You</span>
                    </h2>
                    <p className="section-subheading mx-auto mt-3">
                        Tag us with #ShaanoShaukat to be featured in our gallery.
                    </p>
                </div>

                {/* Instagram Grid */}
                <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
                    {instagramImages.map((src, index) => (
                        <a
                            key={index}
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative aspect-square overflow-hidden rounded-xl"
                        >
                            <Image
                                src={src}
                                alt={`Instagram post ${index + 1}`}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 16vw"
                            />
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <Instagram className="h-7 w-7 text-white" />
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
