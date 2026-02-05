const express = require('express');
const router = express.Router();
const { getOrders, createOrder, updateOrderStatus, getSalesStats } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, getOrders);
router.post('/', protect, authorize('cashier', 'admin'), createOrder);
router.patch('/:id/status', protect, updateOrderStatus);
router.get('/stats', protect, authorize('admin'), getSalesStats);

module.exports = router;
