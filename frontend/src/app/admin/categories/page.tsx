"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Plus, Trash2, X, Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { createAuthApi } from "@/lib/api";

interface Category {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export default function AdminCategories() {
  const { data: session } = useSession();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = useCallback(async () => {
    if (!session?.user?.accessToken) return;
    const authApi = createAuthApi(session.user.accessToken);
    try {
      const res = await authApi.get("/categories");
      setCategories(res.data.data);
    } catch {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.accessToken) return;

    setSubmitting(true);
    const authApi = createAuthApi(session.user.accessToken);
    try {
      await authApi.post("/categories", form);
      toast.success("Category created");
      setShowModal(false);
      setForm({ name: "", description: "" });
      fetchCategories();
    } catch {
      toast.error("Failed to create category");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    if (!session?.user?.accessToken) return;

    const authApi = createAuthApi(session.user.accessToken);
    try {
      await authApi.delete(`/categories/${id}`);
      toast.success("Category deleted");
      fetchCategories();
    } catch {
      toast.error("Failed to delete category");
    }
  };

  return (
    <div className="p-6 md:p-8">
      <Toaster position="top-center" />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-sans font-bold text-white">
          Categories
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#a69255] text-black font-semibold rounded-lg hover:bg-[#8a7a48] transition-colors text-sm"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[#a69255]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="bg-[#1c1c1e] rounded-xl border border-white/5 p-5 hover:border-white/10 transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-semibold text-white">
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p className="text-sm text-gray-400 mt-1">
                      {cat.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Created {new Date(cat.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {categories.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              No categories yet. Create one to get started.
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowModal(false)}
          />
          <div className="relative w-full max-w-md bg-[#1c1c1e] rounded-xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-sans font-semibold text-white">
                Create Category
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Name
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-[#121212] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#a69255] text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description (optional)
                </label>
                <input
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-lg bg-[#121212] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#a69255] text-sm"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-white/10 text-gray-300 rounded-lg hover:bg-white/5 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-[#a69255] text-black font-semibold rounded-lg hover:bg-[#8a7a48] transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Create"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
