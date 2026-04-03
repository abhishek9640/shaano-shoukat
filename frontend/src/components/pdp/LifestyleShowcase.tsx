"use client";

interface LifestyleShowcaseProps {
  lifestyleImages?: { url: string }[];
  name: string;
}

export default function LifestyleShowcase({
  lifestyleImages,
  name,
}: LifestyleShowcaseProps) {
  if (!lifestyleImages || lifestyleImages.length === 0) return null;

  // If 1 image → full-width hero
  // If 2 images → 60/40 split
  // If 3+ → asymmetric editorial grid
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.3em] text-[#D4AF37]/60 font-body font-medium">
            In Your Space
          </span>
          <h2 className="text-2xl md:text-3xl font-sans font-semibold text-white mt-3 tracking-tight">
            See It Come Alive
          </h2>
        </div>

        {/* Editorial layout */}
        {lifestyleImages.length === 1 && (
          <div className="rounded-2xl overflow-hidden aspect-[21/9]">
            <img
              src={lifestyleImages[0].url}
              alt={`${name} in a lifestyle setting`}
              className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700"
              loading="lazy"
            />
          </div>
        )}

        {lifestyleImages.length === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6">
            <div className="md:col-span-3 rounded-2xl overflow-hidden aspect-[4/3]">
              <img
                src={lifestyleImages[0].url}
                alt={`${name} lifestyle 1`}
                className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700"
                loading="lazy"
              />
            </div>
            <div className="md:col-span-2 rounded-2xl overflow-hidden aspect-[4/3] md:aspect-auto">
              <img
                src={lifestyleImages[1].url}
                alt={`${name} lifestyle 2`}
                className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700"
                loading="lazy"
              />
            </div>
          </div>
        )}

        {lifestyleImages.length >= 3 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {/* Large hero image */}
            <div className="col-span-2 row-span-2 rounded-2xl overflow-hidden aspect-square">
              <img
                src={lifestyleImages[0].url}
                alt={`${name} lifestyle 1`}
                className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700"
                loading="lazy"
              />
            </div>
            {/* Smaller images */}
            {lifestyleImages.slice(1, 5).map((img, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden aspect-square"
              >
                <img
                  src={img.url}
                  alt={`${name} lifestyle ${i + 2}`}
                  className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
