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

module.exports = { shelfLifeLimiter };
