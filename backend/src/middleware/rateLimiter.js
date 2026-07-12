const rateLimit = require('express-rate-limit');

const shelfLifeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15-minute window
  max: 5000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many analysis requests. Please wait 15 minutes before trying again.'
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // Increased to prevent blockages during manual testing
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many authentication attempts. Please try again after 15 minutes.'
  }
});

module.exports = { shelfLifeLimiter, authLimiter };
