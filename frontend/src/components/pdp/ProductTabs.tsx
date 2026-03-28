"use client";

import { useState } from "react";

interface ProductTabsProps {
  description: string;
}

const tabs = ["Description", "Specifications", "Care Instructions"];

export default function ProductTabs({ description }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState(0);

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
                {description}
              </p>
            </div>
          )}

          {activeTab === 1 && (
            <div className="animate-fadeIn">
              <table className="w-full">
                <tbody className="divide-y divide-white/5">
                  {[
                    ["Material", "Premium Quality"],
                    ["Dimensions", "Varies by product"],
                    ["Weight", "Refer to packaging"],
                    ["Color", "As shown"],
                    ["Origin", "India"],
                    ["Package Contents", "1 Unit"],
                  ].map(([label, value]) => (
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
            <div className="animate-fadeIn space-y-4">
              <div className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-2 flex-shrink-0" />
                <p className="text-gray-300 font-body text-base">
                  Wipe gently with a soft, dry cloth to remove dust
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-2 flex-shrink-0" />
                <p className="text-gray-300 font-body text-base">
                  Avoid using harsh chemicals or abrasive cleaners
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-2 flex-shrink-0" />
                <p className="text-gray-300 font-body text-base">
                  Keep away from direct sunlight to prevent discoloration
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-2 flex-shrink-0" />
                <p className="text-gray-300 font-body text-base">
                  Handle with care — decorative items are delicate
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
