"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { createAuthApi } from "@/lib/api";
import { Loader2, Package, User as UserIcon } from "lucide-react";

interface Order {
  _id: string;
  orderItems: { name: string; quantity: number; price: number }[];
  totalPrice: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  processing: "text-yellow-400 bg-yellow-400/10",
  confirmed: "text-blue-400 bg-blue-400/10",
  shipped: "text-purple-400 bg-purple-400/10",
  delivered: "text-green-400 bg-green-400/10",
  cancelled: "text-red-400 bg-red-400/10",
};

export default function ProfilePage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = useCallback(async () => {
    if (!session?.user?.accessToken) return;
    const authApi = createAuthApi(session.user.accessToken);
    try {
      const res = await authApi.get("/orders/my", {
        params: { page, limit: 10 },
      });
      setOrders(res.data.data);
      setTotalPages(res.data.pagination?.pages || 1);
    } catch {
      console.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, [session, page]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="bg-[#121212] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Profile Header */}
        <div className="bg-[#1c1c1e] rounded-xl border border-white/5 p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#a69255]/10 flex items-center justify-center">
              <UserIcon className="h-8 w-8 text-[#a69255]" />
            </div>
            <div>
              <h1 className="text-2xl font-sans font-bold text-white">
                {session?.user?.name || "User"}
              </h1>
              <p className="text-gray-400 text-sm">
                {session?.user?.email || ""}
              </p>
              {session?.user?.role === "admin" && (
                <span className="inline-block mt-1 px-2 py-0.5 bg-[#a69255]/10 text-[#a69255] text-xs rounded-full font-medium">
                  Admin
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Orders */}
        <h2 className="text-xl font-sans font-bold text-white mb-4">
          My Orders
        </h2>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-[#a69255]" />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-[#1c1c1e] rounded-xl border border-white/5 p-12 text-center">
            <Package className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-[#1c1c1e] rounded-xl border border-white/5 p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                  <div>
                    <p className="text-sm font-mono text-gray-400">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        statusColors[order.orderStatus] || "text-gray-400"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-3 space-y-2">
                  {order.orderItems.map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-gray-300">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="text-gray-400">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/5 pt-3 mt-3 flex justify-between">
                  <span className="text-sm text-gray-400">Total</span>
                  <span className="text-white font-semibold">
                    ₹{order.totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`px-3 py-1.5 rounded text-sm transition-colors ${
                        p === page
                          ? "bg-[#a69255] text-black font-semibold"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
