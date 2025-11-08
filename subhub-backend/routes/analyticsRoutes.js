// routes/analyticsRoutes.js
const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const analyticsController = require('../controllers/analyticsController');

const router = express.Router();

// GET /api/analytics?period=6months
router.get('/', protect, analyticsController.getAnalytics);

module.exports = router;
