"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Package,
  ShoppingBag,
  FolderTree,
  DollarSign,
  Loader2,
} from "lucide-react";
import { createAuthApi } from "@/lib/api";

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalCategories: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalOrders: 0,
    totalCategories: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!session?.user?.accessToken) return;

      const authApi = createAuthApi(session.user.accessToken);

      try {
        const [productsRes, ordersRes, categoriesRes] = await Promise.all([
          authApi.get("/products?limit=1"),
          authApi.get("/orders"),
          authApi.get("/categories"),
        ]);

        setStats({
          totalProducts: productsRes.data.pagination?.total || 0,
          totalOrders: ordersRes.data.pagination?.total || 0,
          totalCategories: categoriesRes.data.count || 0,
          totalRevenue: ordersRes.data.totalRevenue || 0,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [session]);

  const statCards = [
    {
      label: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
    {
      label: "Categories",
      value: stats.totalCategories,
      icon: FolderTree,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
    },
    {
      label: "Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-[#a69255]",
      bg: "bg-[#a69255]/10",
    },
  ];

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-sans font-bold text-white">
          Dashboard
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Welcome back, {session?.user?.name || "Admin"}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[#a69255]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="bg-[#1c1c1e] rounded-xl border border-white/5 p-6 hover:border-white/10 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`${card.bg} p-3 rounded-lg`}
                >
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{card.value}</p>
              <p className="text-sm text-gray-400 mt-1">{card.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
