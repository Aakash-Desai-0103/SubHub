// routes/subscriptionRoutes.js
const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  getAllSubscriptions,
  createSubscription,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
  cancelSubscription,   // ✅ added
  upgradeSubscription,  // ✅ added
} = require('../controllers/subscriptionController');

const router = express.Router();

// ------------------- ROUTES -------------------

// Base route: /api/subscriptions
router
  .route('/')
  .get(protect, getAllSubscriptions)   // Get all subscriptions for logged-in user
  .post(protect, createSubscription);  // Create a new subscription

// Route with ID: /api/subscriptions/:id
router
  .route('/:id')
  .get(protect, getSubscriptionById)   // Get subscription by ID
  .put(protect, updateSubscription)    // Update existing subscription
  .delete(protect, deleteSubscription); // Delete a subscription

// ------------------- EXTRA ROUTES -------------------

// Cancel a subscription (sets status = Inactive)
router.patch('/:id/cancel', protect, cancelSubscription);

// Upgrade a free subscription → Paid
router.patch('/:id/upgrade', protect, upgradeSubscription);

module.exports = router;
