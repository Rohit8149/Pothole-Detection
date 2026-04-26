// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controller.js/authcontroller');

// Register
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Forgot Password
router.post('/forgot-password', authController.forgotPassword);

// Verify OTP
router.post('/verify-otp', authController.verifyOTP);

// Reset Password
router.post('/reset-password', authController.resetPassword);

module.exports = router;
