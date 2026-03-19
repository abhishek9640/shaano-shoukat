const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// User routes
router.post('/', protect, createOrder);
router.get('/my', protect, getMyOrders);

// Admin routes (must come before /:id to avoid conflicts)
router.get('/', protect, admin, getAllOrders);

// Shared routes
router
  .route('/:id')
  .get(protect, getOrder)
  .put(protect, admin, updateOrderStatus);

module.exports = router;
