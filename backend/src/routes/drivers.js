const express = require('express');
const { protect, requireAdmin } = require('../middleware/auth');
const driversController = require('../controllers/drivers');

const router = express.Router();

// GET /api/drivers - Get all drivers with availability status (protected)
router.get('/', protect, driversController.getDrivers);

// POST /api/drivers - Create new driver (protected + admin)
router.post('/', protect, requireAdmin, driversController.createDriver);

// PATCH /api/drivers/:id/availability - Toggle driver availability (protected)
router.patch('/:id/availability', protect, driversController.toggleAvailability);

module.exports = router;
