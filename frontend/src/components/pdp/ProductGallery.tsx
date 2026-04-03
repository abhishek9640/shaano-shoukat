"use client";

import { useState, useRef } from "react";

interface ProductGalleryProps {
  images: { url: string }[];
  lifestyleImages?: { url: string }[];
  name: string;
}

export default function ProductGallery({
  images,
  lifestyleImages,
  name,
}: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [activeTab, setActiveTab] = useState<"product" | "lifestyle">(
    "product"
  );
  const mainImageRef = useRef<HTMLDivElement>(null);

  const hasLifestyle = lifestyleImages && lifestyleImages.length > 0;
  const currentImages =
    activeTab === "lifestyle" && hasLifestyle ? lifestyleImages : images;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mainImageRef.current) return;
    const rect = mainImageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const handleTouchStart = () => setZoomed(true);
  const handleTouchEnd = () => setZoomed(false);

  const currentImage = currentImages[selectedIndex]?.url;

  return (
    <div className="flex flex-col gap-3">
      {/* Product / Lifestyle toggle */}
      {hasLifestyle && (
        <div className="flex gap-2 mb-1">
          <button
            onClick={() => {
              setActiveTab("product");
              setSelectedIndex(0);
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-body font-medium uppercase tracking-wider transition-colors ${
              activeTab === "product"
                ? "bg-[#D4AF37] text-black"
                : "bg-white/5 text-gray-400 hover:text-white"
            }`}
          >
            Product
          </button>
          <button
            onClick={() => {
              setActiveTab("lifestyle");
              setSelectedIndex(0);
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-body font-medium uppercase tracking-wider transition-colors ${
              activeTab === "lifestyle"
                ? "bg-[#D4AF37] text-black"
                : "bg-white/5 text-gray-400 hover:text-white"
            }`}
          >
            Lifestyle
          </button>
        </div>
      )}

      <div className="flex flex-col-reverse lg:flex-row gap-3 lg:gap-4">
        {/* Thumbnails */}
        {currentImages.length > 1 && (
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:max-h-[600px] pb-1 lg:pb-0 lg:pr-1 scrollbar-hide">
            {currentImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedIndex(i)}
                className={`flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                  i === selectedIndex
                    ? "border-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.3)]"
                    : "border-white/10 hover:border-white/25"
                }`}
              >
                <img
                  src={img.url}
                  alt={`${name} view ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Main Image */}
        <div
          ref={mainImageRef}
          className="relative flex-1 aspect-square bg-[#1a1a1c] rounded-xl lg:rounded-2xl overflow-hidden cursor-crosshair group"
          onMouseEnter={() => setZoomed(true)}
          onMouseLeave={() => setZoomed(false)}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {currentImage ? (
            <>
              <img
                src={currentImage}
                alt={name}
                className="w-full h-full object-cover transition-transform duration-500"
              />
              <div
                className={`hidden lg:block absolute inset-0 bg-no-repeat transition-opacity duration-300 ${
                  zoomed ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  backgroundImage: `url(${currentImage})`,
                  backgroundSize: "200%",
                  backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                }}
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600">
              No Image Available
            </div>
          )}

          {/* Image counter badge */}
          {currentImages.length > 1 && (
            <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs text-white/80">
              {selectedIndex + 1} / {currentImages.length}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
