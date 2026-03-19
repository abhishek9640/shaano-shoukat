"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/lib/cartContext";
import {
  Search,
  ShoppingCart,
  Menu,
  User,
  Heart,
  X,
  LogOut,
  Shield,
  ChevronDown,
} from "lucide-react";

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
  const [userDropdown, setUserDropdown] = useState(false);
  const { data: session, status } = useSession();

  const { totalItems } = useCart();

  const isAdmin = session?.user?.role === "admin";

  const handleLogout = async () => {
    setUserDropdown(false);
    await signOut({ callbackUrl: "/" });
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              href="/"
              className="text-2xl font-sans font-bold tracking-wider text-white"
            >
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

            {/* User / Auth */}
            {status === "loading" ? (
              <div className="h-5 w-5 rounded-full bg-white/10 animate-pulse hidden sm:block" />
            ) : session ? (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center gap-1 text-gray-400 hover:text-[#a69255] transition-colors"
                >
                  <User className="h-5 w-5" />
                  <ChevronDown className="h-3 w-3" />
                </button>

                {/* User Dropdown */}
                {userDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserDropdown(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#1c1c1e] border border-white/10 shadow-2xl z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-sm font-medium text-white truncate">
                          {session.user.name}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {session.user.email}
                        </p>
                      </div>
                      <div className="py-1">
                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setUserDropdown(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-[#a69255] transition-colors"
                          >
                            <Shield className="h-4 w-4" />
                            Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-red-400 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="text-gray-400 hover:text-[#a69255] transition-colors hidden sm:block"
              >
                <User className="h-5 w-5" />
              </Link>
            )}

            <Link href="/cart" className="text-gray-400 hover:text-[#a69255] transition-colors relative">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#a69255] text-black text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              className="lg:hidden text-gray-400 hover:text-white p-1"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-Out Menu */}
      <div
        className={`fixed inset-0 z-[100] lg:hidden transition-opacity duration-300 ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60"
          onClick={() => setMobileOpen(false)}
        />

        {/* Drawer */}
        <div
          className={`absolute top-0 right-0 h-full w-[300px] bg-[#0a0a0a] border-l border-white/10 p-6 transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex justify-between items-center mb-8">
            <span className="text-lg font-sans font-bold text-white tracking-wider">
              Menu
            </span>
            <button
              onClick={() => setMobileOpen(false)}
              className="text-gray-400 hover:text-white"
            >
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

          <div className="border-t border-white/10 mt-6 pt-6">
            {session ? (
              <div className="space-y-1">
                <div className="px-3 py-2 mb-2">
                  <p className="text-sm font-medium text-white">
                    {session.user.name}
                  </p>
                  <p className="text-xs text-gray-400">{session.user.email}</p>
                </div>
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 text-gray-300 hover:text-[#a69255] hover:bg-white/5 transition-colors py-3 px-3 rounded-lg"
                  >
                    <Shield className="h-4 w-4" />
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-2 w-full text-gray-300 hover:text-red-400 hover:bg-white/5 transition-colors py-3 px-3 rounded-lg"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center py-2.5 bg-[#a69255] text-black font-semibold rounded-lg hover:bg-[#8a7a48] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center py-2.5 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
