const express = require('express');
const { protect, requireAdmin } = require('../middleware/auth');
const ordersController = require('../controllers/orders');

const router = express.Router();

// GET /api/orders - Get all orders (protected)
router.get('/', protect, ordersController.getOrders);

// POST /api/orders - Create new order (protected)
router.post('/', protect, ordersController.createOrder);

// PATCH /api/orders/:id/status - Update order status (protected + admin)
router.patch('/:id/status', protect, requireAdmin, ordersController.updateOrderStatus);

// PATCH /api/orders/:id/assign-driver - Assign driver to order (protected + admin)
router.patch('/:id/assign-driver', protect, requireAdmin, ordersController.assignDriver);

module.exports = router;
