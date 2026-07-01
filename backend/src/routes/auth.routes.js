const express = require('express');
const { login, logout, getMe } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/me', getMe);

module.exports = router;
