"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Search,
  Upload,
  ImageIcon,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { createAuthApi } from "@/lib/api";

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  ratings: number;
  category: { _id: string; name: string } | null;
  images: { url: string; key?: string }[];
  description: string;
  createdAt: string;
}

interface Category {
  _id: string;
  name: string;
}

// An image can be either an existing S3 image or a local file pending upload
interface ImageEntry {
  url: string; // S3 URL or local blob URL
  key?: string; // S3 key (only for already-uploaded images)
  file?: File; // local file (only for pending uploads)
}

interface ProductForm {
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
}

const emptyForm: ProductForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category: "",
};

export default function AdminProducts() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [images, setImages] = useState<ImageEntry[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProducts = useCallback(async () => {
    if (!session?.user?.accessToken) return;
    const authApi = createAuthApi(session.user.accessToken);
    try {
      const params: Record<string, string | number> = { page, limit: 10 };
      if (search) params.search = search;
      const res = await authApi.get("/products", { params });
      setProducts(res.data.data);
      setTotalPages(res.data.pagination?.pages || 1);
    } catch {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, [session, page, search]);

  const fetchCategories = useCallback(async () => {
    if (!session?.user?.accessToken) return;
    const authApi = createAuthApi(session.user.accessToken);
    try {
      const res = await authApi.get("/categories");
      setCategories(res.data.data);
    } catch {
      console.error("Failed to fetch categories");
    }
  }, [session]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setImages([]);
    setShowModal(true);
  };

  const openEdit = (product: Product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      stock: String(product.stock),
      category: product.category?._id || "",
    });
    // Existing images from S3 (no file property)
    setImages(product.images.map((img) => ({ url: img.url, key: img.key })));
    setShowModal(true);
  };

  // ── Add local files (no upload yet, just preview) ──
  const addFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    const allowed = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    const invalid = fileArray.filter((f) => !allowed.includes(f.type));
    if (invalid.length > 0) {
      toast.error("Only image files (jpg, png, webp, gif) are allowed");
      return;
    }

    const tooBig = fileArray.filter((f) => f.size > 5 * 1024 * 1024);
    if (tooBig.length > 0) {
      toast.error("Each file must be under 5 MB");
      return;
    }

    const newEntries: ImageEntry[] = fileArray.map((file) => ({
      url: URL.createObjectURL(file), // local blob URL for preview
      file, // keep the file for later upload
    }));

    setImages((prev) => [...prev, ...newEntries]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(e.target.files);
      e.target.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) {
      addFiles(e.dataTransfer.files);
    }
  };

  const removeImage = (index: number) => {
    const img = images[index];
    // Revoke blob URL to free memory
    if (img.file) {
      URL.revokeObjectURL(img.url);
    }
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Upload pending files to S3 only on form submit ──
  const uploadPendingFiles = async (): Promise<
    { url: string; key?: string }[]
  > => {
    if (!session?.user?.accessToken) return [];
    const authApi = createAuthApi(session.user.accessToken);

    // Separate existing S3 images from new local files
    const existing = images
      .filter((img) => !img.file)
      .map((img) => ({ url: img.url, key: img.key }));

    const pendingFiles = images.filter((img) => img.file);

    if (pendingFiles.length === 0) return existing;

    // Upload new files to S3
    const formData = new FormData();
    pendingFiles.forEach((entry) => formData.append("images", entry.file!));

    const res = await authApi.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const uploaded: { url: string; key: string }[] = res.data.data;

    // Revoke all blob URLs
    pendingFiles.forEach((entry) => URL.revokeObjectURL(entry.url));

    return [...existing, ...uploaded];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.accessToken) return;

    if (images.length === 0) {
      toast.error("Please add at least one image");
      return;
    }

    setSubmitting(true);
    const authApi = createAuthApi(session.user.accessToken);

    try {
      // Upload pending files to S3 first
      const finalImages = await uploadPendingFiles();

      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        category: form.category,
        images: finalImages,
      };

      if (editingId) {
        await authApi.put(`/products/${editingId}`, payload);
        toast.success("Product updated");
      } else {
        await authApi.post("/products", payload);
        toast.success("Product created");
      }
      setShowModal(false);
      fetchProducts();
    } catch {
      toast.error("Failed to save product");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    if (!session?.user?.accessToken) return;

    setDeletingId(id);
    const authApi = createAuthApi(session.user.accessToken);
    try {
      await authApi.delete(`/products/${id}`);
      toast.success("Product deleted");
      fetchProducts();
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  // Clean up blob URLs when modal closes
  const closeModal = () => {
    images.forEach((img) => {
      if (img.file) URL.revokeObjectURL(img.url);
    });
    setShowModal(false);
  };

  return (
    <div className="p-6 md:p-8">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-sans font-bold text-white">
          Products
        </h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#a69255] text-black font-semibold rounded-lg hover:bg-[#8a7a48] transition-colors text-sm"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#1c1c1e] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#a69255] text-sm"
          />
        </div>
      </div>

      {/* Table */}
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
                    Product
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                    Stock
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell">
                    Category
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {product.images[0]?.url && (
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="h-10 w-10 rounded-lg object-cover border border-white/10"
                          />
                        )}
                        <p className="text-sm font-medium text-white truncate max-w-[200px]">
                          {product.name}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">
                      ₹{product.price.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm hidden sm:table-cell">
                      <span
                        className={`${product.stock > 0 ? "text-green-400" : "text-red-400"}`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400 hidden md:table-cell">
                      {product.category?.name || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(product)}
                          className="p-1.5 text-gray-400 hover:text-[#a69255] transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          disabled={deletingId === product._id}
                          className="p-1.5 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
                        >
                          {deletingId === product._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-12 text-center text-gray-500"
                    >
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={closeModal}
          />
          <div className="relative w-full max-w-lg bg-[#1c1c1e] rounded-xl border border-white/10 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-sans font-semibold text-white">
                {editingId ? "Edit Product" : "Create Product"}
              </h3>
              <button
                onClick={closeModal}
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
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-[#121212] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#a69255] text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg bg-[#121212] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#a69255] text-sm resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Price (₹)
                  </label>
                  <input
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-4 py-2.5 rounded-lg bg-[#121212] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#a69255] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Stock
                  </label>
                  <input
                    name="stock"
                    type="number"
                    value={form.stock}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-4 py-2.5 rounded-lg bg-[#121212] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#a69255] text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-[#121212] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#a69255] text-sm"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* ── Image Upload Section ── */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Product Images
                </label>

                {/* Drop Zone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative flex flex-col items-center justify-center gap-2 p-6 rounded-lg border-2 border-dashed cursor-pointer transition-all ${
                    dragOver
                      ? "border-[#a69255] bg-[#a69255]/10"
                      : "border-white/10 hover:border-white/20 bg-[#121212]"
                  }`}
                >
                  <Upload className="h-8 w-8 text-gray-500" />
                  <p className="text-sm text-gray-400">
                    <span className="text-[#a69255] font-medium">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    JPG, PNG, WebP, GIF — max 5 MB each
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>

                {/* Image Previews */}
                {images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {images.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative group rounded-lg overflow-hidden border border-white/10 aspect-square"
                      >
                        <img
                          src={img.url}
                          alt={`Product ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 p-1 bg-black/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3 text-white" />
                        </button>
                        {idx === 0 && (
                          <span className="absolute bottom-1 left-1 px-1.5 py-0.5 text-[10px] font-medium bg-[#a69255] text-black rounded">
                            Main
                          </span>
                        )}
                        {img.file && (
                          <span className="absolute top-1 left-1 px-1.5 py-0.5 text-[10px] font-medium bg-blue-500/80 text-white rounded">
                            New
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {images.length === 0 && (
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <ImageIcon className="h-3 w-3" />
                    <span>No images added yet</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
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
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : editingId ? (
                    "Update"
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
