const express = require('express');
const { protect, requireAdmin } = require('../middleware/auth');
const usersController = require('../controllers/users');

const router = express.Router();

// GET /api/users - Get all customers (protected + admin)
router.get('/', protect, requireAdmin, usersController.getUsers);

// GET /api/users/:id - Get single user with their orders (protected + admin)
router.get('/:id', protect, requireAdmin, usersController.getUserWithOrders);

module.exports = router;
