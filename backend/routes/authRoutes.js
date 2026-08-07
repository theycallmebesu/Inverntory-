const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const { authMiddleware } = require('../middleware/auth');

// POST /api/login
router.post('/login', authController.login);

// PUT /api/auth/reset
router.put('/reset', authMiddleware, authController.resetCredentials);

module.exports = router;
