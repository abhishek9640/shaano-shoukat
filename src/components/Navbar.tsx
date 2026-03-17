"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingCart, Menu, User, Heart, X } from "lucide-react";

const navLinks = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Home Decor", href: "/shop/home-decor" },
    { label: "Kitchen & Dining", href: "/shop/kitchen-dining" },
    { label: "Textiles", href: "/shop/home-textile" },
    { label: "Artificial Plants", href: "/shop/flowers-greens" },
    { label: "Gift Sets", href: "/shop/gift-collection" },
    { label: "Sale", href: "/shop/sale" },
];

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 w-full bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="text-2xl font-sans font-bold tracking-wider text-white">
                            SHAANO<span className="text-[#a69255]">SHAUKAT</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex space-x-5 xl:space-x-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className={`text-gray-400 hover:text-[#a69255] transition-colors duration-200 font-medium tracking-wide text-sm ${link.label === "Sale" ? "text-red-400 hover:text-red-300" : ""}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Icons */}
                    <div className="flex items-center space-x-4 md:space-x-5">
                        <button className="text-gray-400 hover:text-[#a69255] transition-colors hidden sm:block">
                            <Search className="h-5 w-5" />
                        </button>
                        <button className="text-gray-400 hover:text-[#a69255] transition-colors hidden sm:block">
                            <Heart className="h-5 w-5" />
                        </button>
                        <button className="text-gray-400 hover:text-[#a69255] transition-colors hidden sm:block">
                            <User className="h-5 w-5" />
                        </button>
                        <button className="text-gray-400 hover:text-[#a69255] transition-colors relative">
                            <ShoppingCart className="h-5 w-5" />
                            <span className="absolute -top-2 -right-2 bg-[#a69255] text-black text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                2
                            </span>
                        </button>

                        {/* Mobile menu button */}
                        <button
                            className="lg:hidden text-gray-400 hover:text-white p-1"
                            onClick={() => setMobileOpen(!mobileOpen)}
                        >
                            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Slide-Out Menu */}
            <div
                className={`fixed inset-0 z-[100] lg:hidden transition-opacity duration-300 ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
            >
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />

                {/* Drawer */}
                <div
                    className={`absolute top-0 right-0 h-full w-[300px] bg-[#0a0a0a] border-l border-white/10 p-6 transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
                >
                    <div className="flex justify-between items-center mb-8">
                        <span className="text-lg font-sans font-bold text-white tracking-wider">Menu</span>
                        <button onClick={() => setMobileOpen(false)} className="text-gray-400 hover:text-white">
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="flex flex-col space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className={`text-gray-300 hover:text-[#a69255] hover:bg-white/5 transition-colors py-3 px-3 rounded-lg font-medium tracking-wide ${link.label === "Sale" ? "text-red-400" : ""}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="border-t border-white/10 mt-6 pt-6 flex items-center space-x-5">
                        <button className="text-gray-400 hover:text-[#a69255] transition-colors">
                            <Search className="h-5 w-5" />
                        </button>
                        <button className="text-gray-400 hover:text-[#a69255] transition-colors">
                            <Heart className="h-5 w-5" />
                        </button>
                        <button className="text-gray-400 hover:text-[#a69255] transition-colors">
                            <User className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
