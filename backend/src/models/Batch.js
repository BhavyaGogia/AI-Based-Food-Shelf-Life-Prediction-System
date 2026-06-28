// backend/src/models/Batch.js
// PURPOSE: Schema/shape reference for a batch document in the 'batches' collection
// NOTE: Intern 2 owns this collection entirely — no cross-intern contract needed.

/**
 * Batch document shape (MongoDB — no ODM, raw driver)
 *
 * {
 *   _id: ObjectId,
 *   productId: ObjectId,       // ref: products collection (Intern 1's)
 *   batchCode: String,         // e.g. "BTH-2024-001"
 *   packDate: Date,
 *   expiryDate: Date,          // calculated by expiryCalculator.js
 *   quantity: Number,
 *   status: String,            // "active" | "expiring_soon" | "expired"
 *   createdAt: Date,
 *   updatedAt: Date
 * }
 */

// Shape reference — not enforced at DB level, enforced in validators/
const BATCH_SHAPE = {
  productId: 'ObjectId',
  batchCode: 'String',
  packDate: 'Date',
  expiryDate: 'Date',
  quantity: 'Number',
  status: 'String',
  createdAt: 'Date',
  updatedAt: 'Date'
};

module.exports = { BATCH_SHAPE };
