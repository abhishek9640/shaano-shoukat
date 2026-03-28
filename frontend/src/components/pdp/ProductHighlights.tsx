"use client";

import { Gem, Paintbrush, Home, Sparkles } from "lucide-react";

interface ProductHighlightsProps {
  highlights?: {
    icon: string;
    label: string;
    value: string;
  }[];
}

const defaultHighlights = [
  { icon: "material", label: "Material", value: "Premium Quality" },
  { icon: "finish", label: "Finish", value: "Handcrafted" },
  { icon: "use", label: "Use", value: "Home Decor / Gifting" },
  { icon: "care", label: "Care", value: "Wipe Clean" },
];

const iconMap: Record<string, React.ReactNode> = {
  material: <Gem className="h-5 w-5" />,
  finish: <Paintbrush className="h-5 w-5" />,
  use: <Home className="h-5 w-5" />,
  care: <Sparkles className="h-5 w-5" />,
};

export default function ProductHighlights({
  highlights,
}: ProductHighlightsProps) {
  const items = highlights || defaultHighlights;

  return (
    <section className="py-10 border-y border-white/5">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {items.map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-3 group">
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
