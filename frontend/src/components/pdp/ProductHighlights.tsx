"use client";

import { Gem, Paintbrush, Home, Sparkles, MapPin, Package } from "lucide-react";
import { ReactNode } from "react";

interface ProductHighlightsProps {
  material?: string;
  finish?: string;
  countryOfOrigin?: string;
  setIncludes?: string;
  deliveryEstimate?: string;
  codAvailable?: boolean;
}

const iconMap: Record<string, ReactNode> = {
  material: <Gem className="h-5 w-5" />,
  finish: <Paintbrush className="h-5 w-5" />,
  origin: <MapPin className="h-5 w-5" />,
  includes: <Package className="h-5 w-5" />,
  delivery: <Home className="h-5 w-5" />,
  cod: <Sparkles className="h-5 w-5" />,
};

export default function ProductHighlights({
  material,
  finish,
  countryOfOrigin,
  setIncludes,
  deliveryEstimate,
  codAvailable,
}: ProductHighlightsProps) {
  // Build highlights dynamically from available data
  const items: { icon: string; label: string; value: string }[] = [];

  if (material) items.push({ icon: "material", label: "Material", value: material });
  if (finish) items.push({ icon: "finish", label: "Finish", value: finish });
  if (countryOfOrigin)
    items.push({ icon: "origin", label: "Origin", value: countryOfOrigin });
  if (setIncludes)
    items.push({ icon: "includes", label: "Includes", value: setIncludes });
  if (deliveryEstimate)
    items.push({ icon: "delivery", label: "Delivery", value: deliveryEstimate });
  if (codAvailable !== false)
    items.push({ icon: "cod", label: "Payment", value: "COD Available" });

  // Fallback if no data
  if (items.length === 0) {
    items.push(
      { icon: "material", label: "Material", value: "Premium Quality" },
      { icon: "finish", label: "Finish", value: "Handcrafted" },
      { icon: "origin", label: "Origin", value: "India" },
      { icon: "cod", label: "Payment", value: "COD Available" }
    );
  }

  return (
    <section className="py-10 border-y border-white/5">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {items.slice(0, 4).map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center gap-3 group"
            >
              <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37]/20 transition-colors duration-300">
                {iconMap[item.icon] || <Sparkles className="h-5 w-5" />}
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-[0.15em] font-body mb-0.5">
                  {item.label}
                </p>
                <p className="text-sm text-white font-body font-medium">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
