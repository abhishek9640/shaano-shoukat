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
  Star,
  TrendingUp,
  Sparkles,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { createAuthApi } from "@/lib/api";

interface Product {
  _id: string;
  name: string;
  slug?: string;
  price: number;
  compareAtPrice?: number;
  discount?: number;
  sku?: string;
  stock: number;
  ratings: number;
  category: { _id: string; name: string } | null;
  images: { url: string; key?: string }[];
  description: string;
  shortDescription?: string;
  status?: string;
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  createdAt: string;
}

interface Category {
  _id: string;
  name: string;
}

interface ImageEntry {
  url: string;
  key?: string;
  file?: File;
}

interface ProductForm {
  // Basic Info
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  longDescription: string;
  brand: string;
  collection: string;
  category: string;
  tags: string;
  // Pricing
  price: string;
  compareAtPrice: string;
  costPrice: string;
  sku: string;
  stock: string;
  lowStockThreshold: string;
  // Specs
  material: string;
  color: string;
  dimensionLength: string;
  dimensionWidth: string;
  dimensionHeight: string;
  weight: string;
  finish: string;
  setIncludes: string;
  countryOfOrigin: string;
  // Shipping
  packageDimensions: string;
  packageWeight: string;
  shippingClass: string;
  deliveryEstimate: string;
  codAvailable: boolean;
  // Content
  story: string;
  careInstructions: string;
  usageSuggestions: string;
  stylingTips: string;
  // SEO
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  // Merchandising
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  status: string;
  videoUrl: string;
}

const emptyForm: ProductForm = {
  name: "",
  slug: "",
  shortDescription: "",
  description: "",
  longDescription: "",
  brand: "",
  collection: "",
  category: "",
  tags: "",
  price: "",
  compareAtPrice: "",
  costPrice: "",
  sku: "",
  stock: "",
  lowStockThreshold: "5",
  material: "",
  color: "",
  dimensionLength: "",
  dimensionWidth: "",
  dimensionHeight: "",
  weight: "",
  finish: "",
  setIncludes: "",
  countryOfOrigin: "India",
  packageDimensions: "",
  packageWeight: "",
  shippingClass: "standard",
  deliveryEstimate: "5-7 business days",
  codAvailable: true,
  story: "",
  careInstructions: "",
  usageSuggestions: "",
  stylingTips: "",
  metaTitle: "",
  metaDescription: "",
  keywords: "",
  featured: false,
  bestSeller: false,
  newArrival: false,
  status: "draft",
  videoUrl: "",
};

const sectionTabs = [
  "Basic Info",
  "Pricing",
  "Media",
  "Specs",
  "Shipping",
  "Content",
  "SEO",
  "Merchandising",
];

export default function AdminProducts() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [images, setImages] = useState<ImageEntry[]>([]);
  const [lifestyleImages, setLifestyleImages] = useState<ImageEntry[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dragOver, setDragOver] = useState(false);
  const [lifestyleDragOver, setLifestyleDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lifestyleFileInputRef = useRef<HTMLInputElement>(null);
  const [activeSection, setActiveSection] = useState(0);

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
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm({
        ...form,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else {
      setForm({ ...form, [name]: value });
    }

    // Auto-generate slug from name
    if (name === "name" && !editingId) {
      setForm((prev) => ({
        ...prev,
        [name]: value,
        slug: value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
      }));
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setImages([]);
    setLifestyleImages([]);
    setActiveSection(0);
    setShowModal(true);
  };

  const openEdit = (product: Product & Record<string, unknown>) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      slug: (product.slug as string) || "",
      shortDescription: (product.shortDescription as string) || "",
      description: product.description,
      longDescription: (product.longDescription as string) || "",
      brand: (product.brand as string) || "",
      collection: (product.collection as string) || "",
      category: product.category?._id || "",
      tags: Array.isArray(product.tags)
        ? (product.tags as string[]).join(", ")
        : "",
      price: String(product.price),
      compareAtPrice: product.compareAtPrice
        ? String(product.compareAtPrice)
        : "",
      costPrice: product.costPrice ? String(product.costPrice) : "",
      sku: (product.sku as string) || "",
      stock: String(product.stock),
      lowStockThreshold: product.lowStockThreshold
        ? String(product.lowStockThreshold)
        : "5",
      material: (product.material as string) || "",
      color: (product.color as string) || "",
      dimensionLength:
        (product.dimensions as Record<string, string>)?.length || "",
      dimensionWidth:
        (product.dimensions as Record<string, string>)?.width || "",
      dimensionHeight:
        (product.dimensions as Record<string, string>)?.height || "",
      weight: (product.weight as string) || "",
      finish: (product.finish as string) || "",
      setIncludes: (product.setIncludes as string) || "",
      countryOfOrigin: (product.countryOfOrigin as string) || "India",
      packageDimensions: (product.packageDimensions as string) || "",
      packageWeight: (product.packageWeight as string) || "",
      shippingClass: (product.shippingClass as string) || "standard",
      deliveryEstimate:
        (product.deliveryEstimate as string) || "5-7 business days",
      codAvailable: product.codAvailable !== false,
      story: (product.story as string) || "",
      careInstructions: (product.careInstructions as string) || "",
      usageSuggestions: (product.usageSuggestions as string) || "",
      stylingTips: (product.stylingTips as string) || "",
      metaTitle: (product.metaTitle as string) || "",
      metaDescription: (product.metaDescription as string) || "",
      keywords: Array.isArray(product.keywords)
        ? (product.keywords as string[]).join(", ")
        : "",
      featured: !!product.featured,
      bestSeller: !!product.bestSeller,
      newArrival: !!product.newArrival,
      status: (product.status as string) || "draft",
      videoUrl: (product.videoUrl as string) || "",
    });
    setImages(product.images.map((img) => ({ url: img.url, key: img.key })));
    setLifestyleImages(
      Array.isArray(product.lifestyleImages)
        ? (product.lifestyleImages as { url: string; key?: string }[]).map(
            (img) => ({ url: img.url, key: img.key })
          )
        : []
    );
    setActiveSection(0);
    setShowModal(true);
  };

  // ── Image handling helpers ──
  const addFiles = (
    files: FileList | File[],
    setter: React.Dispatch<React.SetStateAction<ImageEntry[]>>
  ) => {
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
      url: URL.createObjectURL(file),
      file,
    }));
    setter((prev) => [...prev, ...newEntries]);
  };

  const removeImage = (
    index: number,
    list: ImageEntry[],
    setter: React.Dispatch<React.SetStateAction<ImageEntry[]>>
  ) => {
    const img = list[index];
    if (img.file) URL.revokeObjectURL(img.url);
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadPendingFiles = async (
    imageList: ImageEntry[]
  ): Promise<{ url: string; key?: string }[]> => {
    if (!session?.user?.accessToken) return [];
    const authApi = createAuthApi(session.user.accessToken);
    const existing = imageList
      .filter((img) => !img.file)
      .map((img) => ({ url: img.url, key: img.key }));
    const pendingFiles = imageList.filter((img) => img.file);
    if (pendingFiles.length === 0) return existing;

    const formData = new FormData();
    pendingFiles.forEach((entry) => formData.append("images", entry.file!));
    const res = await authApi.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const uploaded: { url: string; key: string }[] = res.data.data;
    pendingFiles.forEach((entry) => URL.revokeObjectURL(entry.url));
    return [...existing, ...uploaded];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.accessToken) return;

    if (images.length === 0) {
      toast.error("Please add at least one product image");
      setActiveSection(2);
      return;
    }

    setSubmitting(true);
    const authApi = createAuthApi(session.user.accessToken);

    try {
      const finalImages = await uploadPendingFiles(images);
      const finalLifestyleImages = await uploadPendingFiles(lifestyleImages);

      const payload: Record<string, unknown> = {
        name: form.name,
        slug: form.slug || undefined,
        shortDescription: form.shortDescription || undefined,
        description: form.description,
        longDescription: form.longDescription || undefined,
        brand: form.brand || undefined,
        collection: form.collection || undefined,
        category: form.category,
        tags: form.tags
          ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
        price: Number(form.price),
        compareAtPrice: form.compareAtPrice
          ? Number(form.compareAtPrice)
          : undefined,
        costPrice: form.costPrice ? Number(form.costPrice) : undefined,
        sku: form.sku || undefined,
        stock: Number(form.stock),
        lowStockThreshold: Number(form.lowStockThreshold) || 5,
        images: finalImages,
        lifestyleImages: finalLifestyleImages,
        videoUrl: form.videoUrl || undefined,
        // Specs
        material: form.material || undefined,
        color: form.color || undefined,
        dimensions: {
          length: form.dimensionLength || undefined,
          width: form.dimensionWidth || undefined,
          height: form.dimensionHeight || undefined,
        },
        weight: form.weight || undefined,
        finish: form.finish || undefined,
        setIncludes: form.setIncludes || undefined,
        countryOfOrigin: form.countryOfOrigin || "India",
        // Shipping
        packageDimensions: form.packageDimensions || undefined,
        packageWeight: form.packageWeight || undefined,
        shippingClass: form.shippingClass,
        deliveryEstimate: form.deliveryEstimate || "5-7 business days",
        codAvailable: form.codAvailable,
        // Content
        story: form.story || undefined,
        careInstructions: form.careInstructions || undefined,
        usageSuggestions: form.usageSuggestions || undefined,
        stylingTips: form.stylingTips || undefined,
        // SEO
        metaTitle: form.metaTitle || undefined,
        metaDescription: form.metaDescription || undefined,
        keywords: form.keywords
          ? form.keywords.split(",").map((k) => k.trim()).filter(Boolean)
          : [],
        // Merchandising
        featured: form.featured,
        bestSeller: form.bestSeller,
        newArrival: form.newArrival,
        status: form.status,
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

  const closeModal = () => {
    images.forEach((img) => {
      if (img.file) URL.revokeObjectURL(img.url);
    });
    lifestyleImages.forEach((img) => {
      if (img.file) URL.revokeObjectURL(img.url);
    });
    setShowModal(false);
  };

  // ── Shared UI helpers ──
  const inputClass =
    "w-full px-4 py-2.5 rounded-lg bg-[#121212] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#a69255] text-sm";
  const labelClass = "block text-sm font-medium text-gray-300 mb-1";

  const ImageUploadZone = ({
    list,
    setter,
    drag,
    setDrag,
    inputRefObj,
    label,
  }: {
    list: ImageEntry[];
    setter: React.Dispatch<React.SetStateAction<ImageEntry[]>>;
    drag: boolean;
    setDrag: React.Dispatch<React.SetStateAction<boolean>>;
    inputRefObj: React.RefObject<HTMLInputElement | null>;
    label: string;
  }) => (
    <div>
      <label className={labelClass}>{label}</label>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          if (e.dataTransfer.files) addFiles(e.dataTransfer.files, setter);
        }}
        onClick={() => inputRefObj.current?.click()}
        className={`relative flex flex-col items-center justify-center gap-2 p-5 rounded-lg border-2 border-dashed cursor-pointer transition-all ${
          drag
            ? "border-[#a69255] bg-[#a69255]/10"
            : "border-white/10 hover:border-white/20 bg-[#121212]"
        }`}
      >
        <Upload className="h-6 w-6 text-gray-500" />
        <p className="text-sm text-gray-400">
          <span className="text-[#a69255] font-medium">Click to upload</span>{" "}
          or drag and drop
        </p>
        <p className="text-xs text-gray-500">
          JPG, PNG, WebP, GIF — max 5 MB each
        </p>
        <input
          ref={inputRefObj}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          onChange={(e) => {
            if (e.target.files) {
              addFiles(e.target.files, setter);
              e.target.value = "";
            }
          }}
          className="hidden"
        />
      </div>
      {list.length > 0 && (
        <div className="grid grid-cols-4 gap-2 mt-3">
          {list.map((img, idx) => (
            <div
              key={idx}
              className="relative group rounded-lg overflow-hidden border border-white/10 aspect-square"
            >
              <img
                src={img.url}
                alt={`Image ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(idx, list, setter);
                }}
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
      {list.length === 0 && (
        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
          <ImageIcon className="h-3 w-3" />
          <span>No images added yet</span>
        </div>
      )}
    </div>
  );

  // ── Section renderers ──
  const renderBasicInfo = () => (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Product Name *</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className={inputClass}
          placeholder="e.g. Handcrafted Brass Candle Holder"
        />
      </div>
      <div>
        <label className={labelClass}>Slug</label>
        <input
          name="slug"
          value={form.slug}
          onChange={handleChange}
          className={inputClass}
          placeholder="auto-generated-from-name"
        />
        <p className="text-xs text-gray-500 mt-1">
          Auto-generated from name. Edit for custom URL.
        </p>
      </div>
      <div>
        <label className={labelClass}>Short Description</label>
        <input
          name="shortDescription"
          value={form.shortDescription}
          onChange={handleChange}
          maxLength={300}
          className={inputClass}
          placeholder="Brief tagline for product cards"
        />
      </div>
      <div>
        <label className={labelClass}>Description *</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          rows={3}
          className={`${inputClass} resize-none`}
          placeholder="Main product description"
        />
      </div>
      <div>
        <label className={labelClass}>Long Description</label>
        <textarea
          name="longDescription"
          value={form.longDescription}
          onChange={handleChange}
          rows={4}
          className={`${inputClass} resize-none`}
          placeholder="Extended detailed description"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Brand</label>
          <input
            name="brand"
            value={form.brand}
            onChange={handleChange}
            className={inputClass}
            placeholder="e.g. ShaanoShaukat"
          />
        </div>
        <div>
          <label className={labelClass}>Collection</label>
          <input
            name="collection"
            value={form.collection}
            onChange={handleChange}
            className={inputClass}
            placeholder="e.g. Royal Heritage"
          />
        </div>
      </div>
      <div>
        <label className={labelClass}>Category *</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          className={inputClass}
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelClass}>Tags</label>
        <input
          name="tags"
          value={form.tags}
          onChange={handleChange}
          className={inputClass}
          placeholder="luxury, handmade, gift (comma-separated)"
        />
      </div>
    </div>
  );

  const renderPricing = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Selling Price (₹) *</label>
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            required
            min="0"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>MRP / Compare-at (₹)</label>
          <input
            name="compareAtPrice"
            type="number"
            value={form.compareAtPrice}
            onChange={handleChange}
            min="0"
            className={inputClass}
            placeholder="Original price before discount"
          />
        </div>
      </div>
      {form.compareAtPrice &&
        Number(form.compareAtPrice) > Number(form.price) && (
          <div className="text-sm text-emerald-400 bg-emerald-400/10 px-3 py-2 rounded-lg">
            💰 Discount:{" "}
            {Math.round(
              ((Number(form.compareAtPrice) - Number(form.price)) /
                Number(form.compareAtPrice)) *
                100
            )}
            % OFF
          </div>
        )}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Cost Price (₹)</label>
          <input
            name="costPrice"
            type="number"
            value={form.costPrice}
            onChange={handleChange}
            min="0"
            className={inputClass}
            placeholder="Your cost (internal)"
          />
        </div>
        <div>
          <label className={labelClass}>SKU</label>
          <input
            name="sku"
            value={form.sku}
            onChange={handleChange}
            className={inputClass}
            placeholder="e.g. SS-BRZ-001"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Stock *</label>
          <input
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            required
            min="0"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Low Stock Alert</label>
          <input
            name="lowStockThreshold"
            type="number"
            value={form.lowStockThreshold}
            onChange={handleChange}
            min="0"
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );

  const renderMedia = () => (
    <div className="space-y-6">
      <ImageUploadZone
        list={images}
        setter={setImages}
        drag={dragOver}
        setDrag={setDragOver}
        inputRefObj={fileInputRef}
        label="Product Images *"
      />
      <ImageUploadZone
        list={lifestyleImages}
        setter={setLifestyleImages}
        drag={lifestyleDragOver}
        setDrag={setLifestyleDragOver}
        inputRefObj={lifestyleFileInputRef}
        label="Lifestyle Images (editorial / room shots)"
      />
      <div>
        <label className={labelClass}>Video URL</label>
        <input
          name="videoUrl"
          value={form.videoUrl}
          onChange={handleChange}
          className={inputClass}
          placeholder="https://youtube.com/watch?v=..."
        />
      </div>
    </div>
  );

  const renderSpecs = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Material</label>
          <input
            name="material"
            value={form.material}
            onChange={handleChange}
            className={inputClass}
            placeholder="e.g. Brass, Ceramic, Wood"
          />
        </div>
        <div>
          <label className={labelClass}>Color</label>
          <input
            name="color"
            value={form.color}
            onChange={handleChange}
            className={inputClass}
            placeholder="e.g. Antique Gold"
          />
        </div>
      </div>
      <div>
        <label className={labelClass}>Dimensions</label>
        <div className="grid grid-cols-3 gap-3">
          <input
            name="dimensionLength"
            value={form.dimensionLength}
            onChange={handleChange}
            className={inputClass}
            placeholder="Length"
          />
          <input
            name="dimensionWidth"
            value={form.dimensionWidth}
            onChange={handleChange}
            className={inputClass}
            placeholder="Width"
          />
          <input
            name="dimensionHeight"
            value={form.dimensionHeight}
            onChange={handleChange}
            className={inputClass}
            placeholder="Height"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Weight</label>
          <input
            name="weight"
            value={form.weight}
            onChange={handleChange}
            className={inputClass}
            placeholder="e.g. 1.2 kg"
          />
        </div>
        <div>
          <label className={labelClass}>Finish</label>
          <input
            name="finish"
            value={form.finish}
            onChange={handleChange}
            className={inputClass}
            placeholder="e.g. Matte, Glossy, Brushed"
          />
        </div>
      </div>
      <div>
        <label className={labelClass}>Set Includes</label>
        <input
          name="setIncludes"
          value={form.setIncludes}
          onChange={handleChange}
          className={inputClass}
          placeholder="e.g. 1 candle holder, 1 tray"
        />
      </div>
      <div>
        <label className={labelClass}>Country of Origin</label>
        <input
          name="countryOfOrigin"
          value={form.countryOfOrigin}
          onChange={handleChange}
          className={inputClass}
        />
      </div>
    </div>
  );

  const renderShipping = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Package Dimensions</label>
          <input
            name="packageDimensions"
            value={form.packageDimensions}
            onChange={handleChange}
            className={inputClass}
            placeholder="e.g. 30 × 20 × 15 cm"
          />
        </div>
        <div>
          <label className={labelClass}>Package Weight</label>
          <input
            name="packageWeight"
            value={form.packageWeight}
            onChange={handleChange}
            className={inputClass}
            placeholder="e.g. 1.5 kg"
          />
        </div>
      </div>
      <div>
        <label className={labelClass}>Shipping Class</label>
        <select
          name="shippingClass"
          value={form.shippingClass}
          onChange={handleChange}
          className={inputClass}
        >
          <option value="standard">Standard</option>
          <option value="fragile">Fragile</option>
          <option value="heavy">Heavy</option>
        </select>
      </div>
      <div>
        <label className={labelClass}>Delivery Estimate</label>
        <input
          name="deliveryEstimate"
          value={form.deliveryEstimate}
          onChange={handleChange}
          className={inputClass}
        />
      </div>
      <div className="flex items-center gap-3 pt-2">
        <input
          type="checkbox"
          name="codAvailable"
          checked={form.codAvailable}
          onChange={handleChange}
          className="w-4 h-4 rounded border-white/10 accent-[#a69255]"
        />
        <label className="text-sm text-gray-300">
          Cash on Delivery Available
        </label>
      </div>
    </div>
  );

  const renderContent = () => (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Brand Story (Luxury Layer)</label>
        <textarea
          name="story"
          value={form.story}
          onChange={handleChange}
          rows={5}
          className={`${inputClass} resize-none`}
          placeholder="Tell the story behind this product — craftsmanship, heritage, inspiration..."
        />
      </div>
      <div>
        <label className={labelClass}>Care Instructions</label>
        <textarea
          name="careInstructions"
          value={form.careInstructions}
          onChange={handleChange}
          rows={3}
          className={`${inputClass} resize-none`}
          placeholder="How to maintain and care for this product"
        />
      </div>
      <div>
        <label className={labelClass}>Usage Suggestions</label>
        <textarea
          name="usageSuggestions"
          value={form.usageSuggestions}
          onChange={handleChange}
          rows={3}
          className={`${inputClass} resize-none`}
          placeholder="How customers can use or display this product"
        />
      </div>
      <div>
        <label className={labelClass}>Styling Tips</label>
        <textarea
          name="stylingTips"
          value={form.stylingTips}
          onChange={handleChange}
          rows={3}
          className={`${inputClass} resize-none`}
          placeholder="Interior design tips — pair with, place in, etc."
        />
      </div>
    </div>
  );

  const renderSEO = () => (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Meta Title</label>
        <input
          name="metaTitle"
          value={form.metaTitle}
          onChange={handleChange}
          maxLength={100}
          className={inputClass}
          placeholder="SEO title (auto-filled from product name if empty)"
        />
        <p className="text-xs text-gray-500 mt-1">
          {form.metaTitle.length}/100 characters
        </p>
      </div>
      <div>
        <label className={labelClass}>Meta Description</label>
        <textarea
          name="metaDescription"
          value={form.metaDescription}
          onChange={handleChange}
          maxLength={300}
          rows={3}
          className={`${inputClass} resize-none`}
          placeholder="SEO description for search engine results"
        />
        <p className="text-xs text-gray-500 mt-1">
          {form.metaDescription.length}/300 characters
        </p>
      </div>
      <div>
        <label className={labelClass}>Keywords</label>
        <input
          name="keywords"
          value={form.keywords}
          onChange={handleChange}
          className={inputClass}
          placeholder="home decor, brass, luxury (comma-separated)"
        />
      </div>
    </div>
  );

  const renderMerchandising = () => (
    <div className="space-y-6">
      <div>
        <label className={labelClass}>Status</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className={inputClass}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Badges & Flags
        </label>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="featured"
            checked={form.featured}
            onChange={handleChange}
            className="w-4 h-4 rounded border-white/10 accent-[#a69255]"
          />
          <span className="flex items-center gap-1.5 text-sm text-gray-300">
            <Star className="h-3.5 w-3.5 text-yellow-500" />
            Featured Product
          </span>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="bestSeller"
            checked={form.bestSeller}
            onChange={handleChange}
            className="w-4 h-4 rounded border-white/10 accent-[#a69255]"
          />
          <span className="flex items-center gap-1.5 text-sm text-gray-300">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
            Best Seller
          </span>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="newArrival"
            checked={form.newArrival}
            onChange={handleChange}
            className="w-4 h-4 rounded border-white/10 accent-[#a69255]"
          />
          <span className="flex items-center gap-1.5 text-sm text-gray-300">
            <Sparkles className="h-3.5 w-3.5 text-purple-400" />
            New Arrival
          </span>
        </div>
      </div>
    </div>
  );

  const sectionRenderers = [
    renderBasicInfo,
    renderPricing,
    renderMedia,
    renderSpecs,
    renderShipping,
    renderContent,
    renderSEO,
    renderMerchandising,
  ];

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
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                    Flags
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
                        <div>
                          <p className="text-sm font-medium text-white truncate max-w-[200px]">
                            {product.name}
                          </p>
                          {product.sku && (
                            <p className="text-xs text-gray-500">
                              {product.sku}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <span className="text-sm text-gray-300">
                          ₹{product.price.toLocaleString()}
                        </span>
                        {product.discount && product.discount > 0 ? (
                          <span className="ml-1.5 text-xs text-emerald-400">
                            {product.discount}% off
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm hidden sm:table-cell">
                      <span
                        className={`${product.stock > 0 ? "text-green-400" : "text-red-400"}`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          product.status === "published"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-yellow-500/10 text-yellow-400"
                        }`}
                      >
                        {product.status === "published" ? (
                          <Eye className="h-3 w-3" />
                        ) : (
                          <EyeOff className="h-3 w-3" />
                        )}
                        {product.status || "draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex gap-1">
                        {product.featured && (
                          <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                        )}
                        {product.bestSeller && (
                          <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                        )}
                        {product.newArrival && (
                          <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            openEdit(
                              product as Product & Record<string, unknown>
                            )
                          }
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
                      colSpan={6}
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

      {/* ── Full-Page Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="relative w-full max-w-2xl bg-[#1c1c1e] rounded-xl border border-white/10 max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
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

            {/* Section Tabs */}
            <div className="flex items-center gap-1 px-4 py-2 border-b border-white/5 overflow-x-auto scrollbar-hide">
              <button
                type="button"
                onClick={() =>
                  setActiveSection(Math.max(0, activeSection - 1))
                }
                disabled={activeSection === 0}
                className="p-1 text-gray-500 hover:text-white disabled:opacity-30 flex-shrink-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {sectionTabs.map((tab, i) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveSection(i)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    i === activeSection
                      ? "bg-[#a69255] text-black"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {tab}
                </button>
              ))}
              <button
                type="button"
                onClick={() =>
                  setActiveSection(
                    Math.min(sectionTabs.length - 1, activeSection + 1)
                  )
                }
                disabled={activeSection === sectionTabs.length - 1}
                className="p-1 text-gray-500 hover:text-white disabled:opacity-30 flex-shrink-0"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Form Content */}
            <form
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto px-6 py-5"
            >
              {sectionRenderers[activeSection]()}

              {/* Navigation + Submit */}
              <div className="flex items-center justify-between gap-3 pt-6 mt-6 border-t border-white/5">
                <div className="flex gap-2">
                  {activeSection > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveSection(activeSection - 1)}
                      className="px-4 py-2 text-sm text-gray-400 hover:text-white border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      ← Previous
                    </button>
                  )}
                  {activeSection < sectionTabs.length - 1 && (
                    <button
                      type="button"
                      onClick={() => setActiveSection(activeSection + 1)}
                      className="px-4 py-2 text-sm text-gray-300 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      Next →
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-[#a69255] text-black font-semibold rounded-lg hover:bg-[#8a7a48] transition-colors text-sm flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : editingId ? (
                    "Update Product"
                  ) : (
                    "Create Product"
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
