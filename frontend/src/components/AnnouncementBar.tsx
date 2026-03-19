"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function AnnouncementBar() {
    const [visible, setVisible] = useState(true);

    if (!visible) return null;

    return (
        <div className="relative bg-[#D4AF37] text-black py-2.5 px-4 text-center z-[60]">
            <div className="max-w-7xl mx-auto flex items-center justify-center">
                <p className="text-xs sm:text-sm font-medium tracking-wide">
                    <span className="hidden sm:inline">
                        Free Shipping above ₹999 &nbsp;|&nbsp; New Arrivals &nbsp;|&nbsp; Limited Festive Collection
                    </span>
                    <span className="sm:hidden">
                        Free Shipping above ₹999 • New Arrivals
                    </span>
                </p>
            </div>
            <button
                onClick={() => setVisible(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-black/10 rounded-full transition-colors"
                aria-label="Dismiss"
            >
                <X className="h-3.5 w-3.5" />
            </button>
        </div>  
    );
}
