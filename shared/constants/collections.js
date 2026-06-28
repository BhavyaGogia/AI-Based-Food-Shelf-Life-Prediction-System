// shared/constants/collections.js
// PURPOSE: Single source of truth for MongoDB collection name strings.
//          Import from here — never hardcode collection names as raw strings.

module.exports = {
  PRODUCTS: 'products',
  BATCHES: 'batches',
  SCAN_EVENTS: 'scanEvents',
  AI_AUDITS: 'ai_audits'
};
