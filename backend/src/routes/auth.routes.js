const express = require('express');
const { login, logout, getMe, register, googleVerify, onboard } = require('../controllers/auth.controller');
const { validateRegister, validateLogin } = require('../validators/auth.validator');
const { authLimiter } = require('../middleware/rateLimiter');
const { requireAuth } = require('../middleware/requireAuth');

const router = express.Router();

router.post('/register', authLimiter, validateRegister, register);
router.post('/login', authLimiter, validateLogin, login);
router.post('/google/verify', authLimiter, googleVerify);
router.post('/logout', logout);
router.get('/me', requireAuth, getMe);
router.put('/onboard', requireAuth, onboard);

module.exports = router;
