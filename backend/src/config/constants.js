// backend/src/config/constants.js
// PURPOSE: App-level constants (cache TTL, limits, env flags, etc.)

module.exports = {
  CACHE_TTL_MS: 5 * 60 * 1000,       // 5 minutes
  MAX_BATCH_SIZE: 500,
  EXPIRY_WARNING_DAYS: 7,             // Warn if product expires within 7 days
  NODE_ENV: process.env.NODE_ENV || 'development'
};
