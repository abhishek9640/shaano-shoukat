"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { createAuthApi } from "@/lib/api";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  user: { name: string; email: string } | null;
  orderItems: OrderItem[];
  totalPrice: number;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  processing: "text-yellow-400 bg-yellow-400/10",
  confirmed: "text-blue-400 bg-blue-400/10",
  shipped: "text-purple-400 bg-purple-400/10",
  delivered: "text-green-400 bg-green-400/10",
  cancelled: "text-red-400 bg-red-400/10",
  pending: "text-yellow-400 bg-yellow-400/10",
  paid: "text-green-400 bg-green-400/10",
  failed: "text-red-400 bg-red-400/10",
  refunded: "text-gray-400 bg-gray-400/10",
};

const orderStatuses = [
  "processing",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

export default function AdminOrders() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = useCallback(async () => {
    if (!session?.user?.accessToken) return;
    const authApi = createAuthApi(session.user.accessToken);
    try {
      const res = await authApi.get("/orders", {
        params: { page, limit: 15 },
      });
      setOrders(res.data.data);
      setTotalPages(res.data.pagination?.pages || 1);
    } catch {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, [session, page]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (id: string, orderStatus: string) => {
    if (!session?.user?.accessToken) return;
    const authApi = createAuthApi(session.user.accessToken);
    try {
      await authApi.put(`/orders/${id}`, { orderStatus });
      toast.success(`Order status updated to ${orderStatus}`);
      fetchOrders();
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="p-6 md:p-8">
      <Toaster position="top-center" />

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-sans font-bold text-white">
          Orders
        </h1>
        <p className="text-gray-400 text-sm mt-1">Manage customer orders</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[#a69255]" />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-white/5">
            <table className="w-full text-left">
              <thead className="bg-[#1c1c1e]">
                <tr>
                  <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell">
                    Payment
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-gray-300 font-mono">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300 hidden sm:table-cell">
                      {order.user?.name || "Unknown"}
                    </td>
                    <td className="px-4 py-3 text-sm text-white font-medium">
                      ₹{order.totalPrice.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm hidden md:table-cell">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.paymentStatus] || "text-gray-400"}`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.orderStatus}
                        onChange={(e) =>
                          updateStatus(order._id, e.target.value)
                        }
                        className="bg-[#121212] border border-white/10 text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#a69255]"
                      >
                        {orderStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 hidden lg:table-cell">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-12 text-center text-gray-500"
                    >
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
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
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
