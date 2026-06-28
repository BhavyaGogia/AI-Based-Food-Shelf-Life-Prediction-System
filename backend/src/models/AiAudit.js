// backend/src/models/AiAudit.js
// PURPOSE: Shape reference for AI audit logs in the 'ai_audits' collection
// Records ML model predictions for shelf-life vs actual expiry comparisons.

/**
 * AiAudit document shape
 *
 * {
 *   _id: ObjectId,
 *   productId: ObjectId,               // ref: products collection (Intern 1's)
 *   batchId: ObjectId,                 // ref: batches collection
 *   predictedShelfLifeDays: Number,    // from ML model
 *   actualShelfLifeDays: Number,       // from base product data
 *   deltadays: Number,                 // predicted - actual
 *   modelVersion: String,
 *   auditedAt: Date
 * }
 */

const AI_AUDIT_SHAPE = {
  productId: 'ObjectId',
  batchId: 'ObjectId',
  predictedShelfLifeDays: 'Number',
  actualShelfLifeDays: 'Number',
  deltaDays: 'Number',
  modelVersion: 'String',
  auditedAt: 'Date'
};

module.exports = { AI_AUDIT_SHAPE };
