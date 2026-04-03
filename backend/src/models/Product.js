const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    // ── 1. Basic Information ──
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      maxlength: [300, 'Short description cannot exceed 300 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    longDescription: {
      type: String,
      maxlength: [10000, 'Long description cannot exceed 10000 characters'],
    },
    brand: { type: String, trim: true },
    collection: { type: String, trim: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please provide a category'],
    },
    tags: [{ type: String, trim: true }],

    // ── 2. Pricing & Inventory ──
    price: {
      type: Number,
      required: [true, 'Please provide a product price'],
      min: [0, 'Price cannot be negative'],
    },
    compareAtPrice: {
      type: Number,
      min: [0, 'Compare-at price cannot be negative'],
    },
    costPrice: {
      type: Number,
      min: [0, 'Cost price cannot be negative'],
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    sku: {
      type: String,
      trim: true,
      sparse: true,
    },
    stock: {
      type: Number,
      required: [true, 'Please provide stock quantity'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
      min: 0,
    },

    // ── 3. Media ──
    images: [
      {
        url: { type: String, required: true },
        key: { type: String },
      },
    ],
    coverImage: {
      url: { type: String },
      key: { type: String },
    },
    lifestyleImages: [
      {
        url: { type: String, required: true },
        key: { type: String },
      },
    ],
    videoUrl: { type: String, trim: true },

    // ── 4. Product Specifications ──
    material: { type: String, trim: true },
    color: { type: String, trim: true },
    dimensions: {
      length: { type: String },
      width: { type: String },
      height: { type: String },
    },
    weight: { type: String, trim: true },
    finish: { type: String, trim: true },
    setIncludes: { type: String, trim: true },
    countryOfOrigin: { type: String, trim: true, default: 'India' },

    // ── 5. Shipping & Handling ──
    packageDimensions: { type: String, trim: true },
    packageWeight: { type: String, trim: true },
    shippingClass: {
      type: String,
      enum: ['standard', 'fragile', 'heavy'],
      default: 'standard',
    },
    deliveryEstimate: { type: String, trim: true, default: '5-7 business days' },
    codAvailable: { type: Boolean, default: true },

    // ── 6. Content / Luxury Layer ──
    story: { type: String, maxlength: [5000, 'Story cannot exceed 5000 characters'] },
    careInstructions: { type: String, maxlength: [2000] },
    usageSuggestions: { type: String, maxlength: [2000] },
    stylingTips: { type: String, maxlength: [2000] },

    // ── 7. SEO ──
    metaTitle: { type: String, maxlength: [100] },
    metaDescription: { type: String, maxlength: [300] },
    keywords: [{ type: String, trim: true }],
    ogImage: {
      url: { type: String },
      key: { type: String },
    },

    // ── 8. Merchandising ──
    featured: { type: Boolean, default: false },
    bestSeller: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: false },
    relatedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    upsellProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],

    // ── 9. Ratings & Reviews ──
    ratings: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot exceed 5'],
    },
    numReviews: {
      type: Number,
      default: 0,
    },

    // ── 10. Admin Controls ──
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    visibility: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug from name
productSchema.pre('save', function (next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  // Auto-calculate discount from price and compareAtPrice
  if (this.compareAtPrice && this.compareAtPrice > this.price) {
    this.discount = Math.round(
      ((this.compareAtPrice - this.price) / this.compareAtPrice) * 100
    );
  } else {
    this.discount = 0;
  }
  next();
});

// Also handle findOneAndUpdate for discount calculation
productSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (update.compareAtPrice && update.price) {
    if (update.compareAtPrice > update.price) {
      update.discount = Math.round(
        ((update.compareAtPrice - update.price) / update.compareAtPrice) * 100
      );
    } else {
      update.discount = 0;
    }
  }
  next();
});

// Text index for search
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ slug: 1 });
productSchema.index({ status: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ bestSeller: 1 });
productSchema.index({ newArrival: 1 });

module.exports = mongoose.model('Product', productSchema);
