"use client";

import { useState } from "react";

interface ProductTabsProps {
  description: string;
  longDescription?: string;
  material?: string;
  color?: string;
  dimensions?: { length?: string; width?: string; height?: string };
  weight?: string;
  finish?: string;
  countryOfOrigin?: string;
  setIncludes?: string;
  careInstructions?: string;
  usageSuggestions?: string;
  stylingTips?: string;
}

const tabs = ["Description", "Specifications", "Care & Usage"];

export default function ProductTabs({
  description,
  longDescription,
  material,
  color,
  dimensions,
  weight,
  finish,
  countryOfOrigin,
  setIncludes,
  careInstructions,
  usageSuggestions,
  stylingTips,
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState(0);

  // Build specs dynamically
  const specs: [string, string][] = [];
  if (material) specs.push(["Material", material]);
  if (color) specs.push(["Color", color]);
  if (dimensions) {
    const parts = [
      dimensions.length && `L: ${dimensions.length}`,
      dimensions.width && `W: ${dimensions.width}`,
      dimensions.height && `H: ${dimensions.height}`,
    ]
      .filter(Boolean)
      .join(" × ");
    if (parts) specs.push(["Dimensions", parts]);
  }
  if (weight) specs.push(["Weight", weight]);
  if (finish) specs.push(["Finish", finish]);
  if (countryOfOrigin) specs.push(["Country of Origin", countryOfOrigin]);
  if (setIncludes) specs.push(["Package Contents", setIncludes]);

  // Fallback specs for existing products without data
  if (specs.length === 0) {
    specs.push(
      ["Material", "Premium Quality"],
      ["Dimensions", "Varies by product"],
      ["Weight", "Refer to packaging"],
      ["Color", "As shown"],
      ["Origin", "India"],
      ["Package Contents", "1 Unit"]
    );
  }

  // Build care content dynamically
  const careItems: { heading: string; content: string }[] = [];
  if (careInstructions)
    careItems.push({ heading: "Care Instructions", content: careInstructions });
  if (usageSuggestions)
    careItems.push({ heading: "Usage Suggestions", content: usageSuggestions });
  if (stylingTips)
    careItems.push({ heading: "Styling Tips", content: stylingTips });

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Tab Headers */}
        <div className="flex border-b border-white/10 mb-8 overflow-x-auto scrollbar-hide">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`relative px-6 py-3 text-sm font-body font-medium tracking-wider uppercase whitespace-nowrap transition-colors duration-300 ${
                i === activeTab
                  ? "text-[#D4AF37]"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab}
              {i === activeTab && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37] rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[200px]">
          {activeTab === 0 && (
            <div className="animate-fadeIn">
              <p className="text-gray-300 font-body leading-relaxed text-base whitespace-pre-line">
                {longDescription || description}
              </p>
            </div>
          )}

          {activeTab === 1 && (
            <div className="animate-fadeIn">
              <table className="w-full">
                <tbody className="divide-y divide-white/5">
                  {specs.map(([label, value]) => (
                    <tr key={label}>
                      <td className="py-3 pr-8 text-sm text-gray-500 font-body font-medium uppercase tracking-wider w-1/3">
                        {label}
                      </td>
                      <td className="py-3 text-sm text-gray-300 font-body">
                        {value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 2 && (
            <div className="animate-fadeIn space-y-8">
              {careItems.length > 0 ? (
                careItems.map((item, i) => (
                  <div key={i}>
                    <h4 className="text-sm font-body font-semibold text-[#D4AF37] uppercase tracking-wider mb-3">
                      {item.heading}
                    </h4>
                    <div className="space-y-2">
                      {item.content.split("\n").map((line, j) => (
                        <div key={j} className="flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-2 flex-shrink-0" />
                          <p className="text-gray-300 font-body text-base">
                            {line}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="space-y-4">
                  {[
                    "Wipe gently with a soft, dry cloth to remove dust",
                    "Avoid using harsh chemicals or abrasive cleaners",
                    "Keep away from direct sunlight to prevent discoloration",
                    "Handle with care — decorative items are delicate",
                  ].map((text, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-2 flex-shrink-0" />
                      <p className="text-gray-300 font-body text-base">
                        {text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
