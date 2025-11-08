// routes/authRoutes.js
const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const authController = require('../controllers/authController'); // Import controller functions

const router = express.Router();

// --- AUTHENTICATION ROUTES ---

// Register new user
// POST /api/auth/register
router.post('/register', authController.register);

// Login existing user
// POST /api/auth/login
router.post('/login', authController.login);

// --- PROTECTED USER ACCOUNT ROUTES ---

// Update user profile (name)
// PUT /api/auth/profile
router.put('/profile', protect, authController.updateProfile);

// Change password
// POST /api/auth/password
router.post('/password', protect, authController.changePassword);

// Delete user account
// DELETE /api/auth/account
router.delete('/account', protect, authController.deleteAccount);

module.exports = router;
