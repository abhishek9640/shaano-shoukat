"use client";

interface StorySectionProps {
  story?: string;
  brand?: string;
}

export default function StorySection({ story, brand }: StorySectionProps) {
  if (!story) return null;

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#121212] via-[#161618] to-[#121212]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent to-[#D4AF37]/30" />

      <div className="relative max-w-3xl mx-auto px-6 text-center">
        {/* Section label */}
        <span className="inline-block text-xs uppercase tracking-[0.35em] text-[#D4AF37]/70 font-body font-medium mb-6">
          {brand ? `The ${brand} Story` : "The Story"}
        </span>

        {/* Decorative line */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="w-12 h-px bg-[#D4AF37]/30" />
          <svg
            className="w-4 h-4 text-[#D4AF37]/40"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path d="M8 0l2.5 5.3L16 6.2l-4 3.8 1 5.5L8 13l-5 2.5 1-5.5-4-3.8 5.5-.9L8 0z" />
          </svg>
          <div className="w-12 h-px bg-[#D4AF37]/30" />
        </div>

        {/* Story content — editorial serif typography */}
        <div className="space-y-6">
          {story.split("\n\n").map((paragraph, i) => (
            <p
              key={i}
              className="text-gray-300 font-body text-lg md:text-xl leading-relaxed md:leading-loose"
              style={{ fontStyle: i === 0 ? "italic" : "normal" }}
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Bottom decorative line */}
        <div className="mt-12 flex items-center justify-center">
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
        </div>
      </div>
    </section>
  );
}
