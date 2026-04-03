const express = require('express');
const {
  createProduct,
  getProducts,
  getProduct,
  getProductBySlug,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router
  .route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

// Slug-based lookup (must come before :id to avoid conflict)
router.get('/slug/:slug', getProductBySlug);

router
  .route('/:id')
  .get(getProduct)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

module.exports = router;
