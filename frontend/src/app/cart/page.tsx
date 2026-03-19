"use client";

import Link from "next/link";
import { useCart } from "@/lib/cartContext";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems } =
    useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center gap-6 px-4">
        <div className="w-20 h-20 rounded-full bg-[#1c1c1e] flex items-center justify-center">
          <ShoppingBag className="h-10 w-10 text-gray-600" />
        </div>
        <h2 className="text-2xl font-sans font-bold text-white">
          Your cart is empty
        </h2>
        <p className="text-gray-400 text-center max-w-sm">
          Looks like you haven&apos;t added anything to your cart yet.
        </p>
        <Link
          href="/shop"
          className="px-6 py-3 bg-[#a69255] text-black font-semibold rounded-xl hover:bg-[#8a7a48] transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#121212] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-sans font-bold text-white mb-8">
          Shopping Cart{" "}
          <span className="text-lg text-gray-400 font-normal">
            ({totalItems} items)
          </span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="bg-[#1c1c1e] rounded-xl border border-white/5 p-4 flex gap-4"
              >
                {/* Image */}
                <div className="w-24 h-24 rounded-lg bg-[#2a2a2c] overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">
                      No Image
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/product/${item._id}`}
                    className="text-sm font-medium text-white hover:text-[#a69255] transition-colors line-clamp-2"
                  >
                    {item.name}
                  </Link>
                  <p className="text-lg font-semibold text-white mt-1">
                    ₹{item.price.toLocaleString()}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity */}
                    <div className="flex items-center bg-[#121212] border border-white/10 rounded-lg">
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        className="px-2.5 py-1.5 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="px-3 py-1.5 text-white text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity + 1)
                        }
                        disabled={item.quantity >= item.stock}
                        className="px-2.5 py-1.5 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-gray-400 hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#1c1c1e] rounded-xl border border-white/5 p-6 sticky top-28">
              <h3 className="text-lg font-sans font-semibold text-white mb-4">
                Order Summary
              </h3>

              <div className="space-y-3 border-b border-white/5 pb-4 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">
                    Subtotal ({totalItems} items)
                  </span>
                  <span className="text-white">
                    ₹{totalPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Shipping</span>
                  <span className="text-green-400">Free</span>
                </div>
              </div>

              <div className="flex justify-between mb-6">
                <span className="text-white font-semibold">Total</span>
                <span className="text-xl font-bold text-white">
                  ₹{totalPrice.toLocaleString()}
                </span>
              </div>

              <Link
                href="/checkout"
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#a69255] hover:bg-[#8a7a48] text-black font-semibold rounded-xl transition-colors"
              >
                Checkout
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/shop"
                className="block text-center mt-3 text-sm text-gray-400 hover:text-[#a69255] transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
