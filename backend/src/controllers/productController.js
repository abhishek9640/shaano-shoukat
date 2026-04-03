const Product = require('../models/Product');
const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
const BUCKET = process.env.AWS_S3_BUCKET || 'shaanoshoukat';

/**
 * Helper: delete an array of S3 images by key
 */
const deleteS3Images = async (images) => {
  const promises = images
    .filter((img) => img.key)
    .map((img) =>
      s3
        .send(new DeleteObjectCommand({ Bucket: BUCKET, Key: img.key }))
        .catch((err) => console.error(`Failed to delete S3 image ${img.key}:`, err))
    );
  await Promise.all(promises);
};

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private/Admin
 */
const createProduct = async (req, res, next) => {
  try {
    req.body.createdBy = req.user._id;
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all products with pagination, search, and filters
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};

    // Category filter
    if (req.query.category) {
      filter.category = req.query.category;
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }

    // Rating filter
    if (req.query.rating) {
      filter.ratings = { $gte: Number(req.query.rating) };
    }

    // In-stock filter
    if (req.query.inStock === 'true') {
      filter.stock = { $gt: 0 };
    }

    // Status filter (default to published for public)
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Merchandising filters
    if (req.query.featured === 'true') filter.featured = true;
    if (req.query.bestSeller === 'true') filter.bestSeller = true;
    if (req.query.newArrival === 'true') filter.newArrival = true;

    // Brand / Collection filters
    if (req.query.brand) filter.brand = req.query.brand;
    if (req.query.collection) filter.collection = req.query.collection;

    // Text search
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    // Sort
    let sort = { createdAt: -1 };
    if (req.query.sort) {
      const sortMap = {
        'price_asc': { price: 1 },
        'price_desc': { price: -1 },
        'rating': { ratings: -1 },
        'newest': { createdAt: -1 },
        'name_asc': { name: 1 },
        'name_desc': { name: -1 },
      };
      sort = sortMap[req.query.sort] || sort;
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name')
      .populate('relatedProducts', 'name price images slug discount compareAtPrice')
      .populate('upsellProducts', 'name price images slug discount compareAtPrice');

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single product by slug
 * @route   GET /api/products/slug/:slug
 * @access  Public
 */
const getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate('category', 'name')
      .populate('relatedProducts', 'name price images slug discount compareAtPrice')
      .populate('upsellProducts', 'name price images slug discount compareAtPrice');

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
const updateProduct = async (req, res, next) => {
  try {
    const existing = await Product.findById(req.params.id);

    if (!existing) {
      res.status(404);
      throw new Error('Product not found');
    }

    // Track who updated
    req.body.updatedBy = req.user._id;

    // If gallery images are being updated, delete removed S3 images
    if (req.body.images) {
      const newKeys = new Set(
        req.body.images.map((img) => img.key).filter(Boolean)
      );
      const removedImages = existing.images.filter(
        (img) => img.key && !newKeys.has(img.key)
      );
      await deleteS3Images(removedImages);
    }

    // If lifestyle images are being updated, delete removed S3 images
    if (req.body.lifestyleImages) {
      const newKeys = new Set(
        req.body.lifestyleImages.map((img) => img.key).filter(Boolean)
      );
      const removedImages = (existing.lifestyleImages || []).filter(
        (img) => img.key && !newKeys.has(img.key)
      );
      await deleteS3Images(removedImages);
    }

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    // Delete all S3 images (gallery + lifestyle + cover + og)
    const allImages = [
      ...product.images,
      ...(product.lifestyleImages || []),
    ];
    if (product.coverImage?.key) allImages.push(product.coverImage);
    if (product.ogImage?.key) allImages.push(product.ogImage);

    await deleteS3Images(allImages);
    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  getProductBySlug,
  updateProduct,
  deleteProduct,
};
