"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cartContext";
import { createAuthApi } from "@/lib/api";
import { Loader2, ShoppingBag, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

export default function CheckoutPage() {
  const { data: session } = useSession();
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [form, setForm] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user?.accessToken) {
      toast.error("Please login to place an order");
      router.push("/login");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!form.street || !form.city || !form.state || !form.zipCode) {
      toast.error("Please fill in all address fields");
      return;
    }

    setLoading(true);
    const authApi = createAuthApi(session.user.accessToken);

    try {
      await authApi.post("/orders", {
        orderItems: items.map((item) => ({
          product: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
        })),
        shippingAddress: form,
      });

      clearCart();
      setOrderPlaced(true);
    } catch {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center gap-6 px-4">
        <div className="w-20 h-20 rounded-full bg-green-400/10 flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-green-400" />
        </div>
        <h2 className="text-3xl font-sans font-bold text-white">
          Order Placed!
        </h2>
        <p className="text-gray-400 text-center max-w-sm">
          Your order has been placed successfully. We&apos;ll notify you with
          updates.
        </p>
        <div className="flex gap-3">
          <Link
            href="/profile"
            className="px-6 py-3 bg-[#a69255] text-black font-semibold rounded-xl hover:bg-[#8a7a48] transition-colors"
          >
            View Orders
          </Link>
          <Link
            href="/shop"
            className="px-6 py-3 border border-white/10 text-white rounded-xl hover:bg-white/5 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center gap-6 px-4">
        <ShoppingBag className="h-12 w-12 text-gray-600" />
        <h2 className="text-2xl font-sans font-bold text-white">
          Cart is empty
        </h2>
        <Link
          href="/shop"
          className="text-[#a69255] hover:underline"
        >
          Go Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#121212] min-h-screen">
      <Toaster position="top-center" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <Link
          href="/cart"
          className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-[#a69255] transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Cart
        </Link>

        <h1 className="text-3xl font-sans font-bold text-white mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} id="checkout-form" className="space-y-5">
              <h3 className="text-lg font-semibold text-white mb-4">
                Shipping Address
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Street Address
                </label>
                <input
                  name="street"
                  value={form.street}
                  onChange={handleChange}
                  required
                  placeholder="123 Main Street, Apt 4B"
                  className="w-full px-4 py-3 rounded-xl bg-[#1c1c1e] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#a69255] text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    City
                  </label>
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    required
                    placeholder="Mumbai"
                    className="w-full px-4 py-3 rounded-xl bg-[#1c1c1e] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#a69255] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    State
                  </label>
                  <input
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    required
                    placeholder="Maharashtra"
                    className="w-full px-4 py-3 rounded-xl bg-[#1c1c1e] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#a69255] text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    ZIP Code
                  </label>
                  <input
                    name="zipCode"
                    value={form.zipCode}
                    onChange={handleChange}
                    required
                    placeholder="400001"
                    className="w-full px-4 py-3 rounded-xl bg-[#1c1c1e] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#a69255] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Country
                  </label>
                  <input
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[#1c1c1e] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#a69255] text-sm"
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#1c1c1e] rounded-xl border border-white/5 p-6 sticky top-28">
              <h3 className="text-lg font-sans font-semibold text-white mb-4">
                Order Summary
              </h3>

              <div className="space-y-3 border-b border-white/5 pb-4 mb-4 max-h-48 overflow-y-auto">
                {items.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span className="text-gray-400 truncate max-w-[60%]">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="text-white">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-b border-white/5 pb-4 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
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

              <button
                type="submit"
                form="checkout-form"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#a69255] hover:bg-[#8a7a48] text-black font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  "Place Order"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
