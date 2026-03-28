"use client";

import { useState, useRef } from "react";

interface ProductGalleryProps {
  images: { url: string }[];
  name: string;
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const mainImageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mainImageRef.current) return;
    const rect = mainImageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const handleTouchStart = () => setZoomed(true);
  const handleTouchEnd = () => setZoomed(false);

  const currentImage = images[selectedIndex]?.url;

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-3 lg:gap-4">
      {/* Thumbnails — bottom on mobile, left on desktop */}
      {images.length > 1 && (
        <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:max-h-[600px] pb-1 lg:pb-0 lg:pr-1 scrollbar-hide">
          {images.map((img, i) => (
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
            {/* Base image */}
            <img
              src={currentImage}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500"
            />
            {/* Zoom overlay (desktop only) */}
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
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs text-white/80">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
}
