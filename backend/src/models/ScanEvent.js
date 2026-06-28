// backend/src/models/ScanEvent.js
// PURPOSE: Shape reference for a scan event in the 'scanEvents' collection
// Recorded whenever a QR/barcode scan happens on a batch.

/**
 * ScanEvent document shape
 *
 * {
 *   _id: ObjectId,
 *   batchId: ObjectId,         // ref: batches collection
 *   productId: ObjectId,       // ref: products collection (Intern 1's)
 *   scannedAt: Date,
 *   scannedBy: String,         // user id or device id
 *   location: String,          // optional: warehouse, retail, etc.
 *   daysUntilExpiry: Number    // computed at scan time
 * }
 */

const SCAN_EVENT_SHAPE = {
  batchId: 'ObjectId',
  productId: 'ObjectId',
  scannedAt: 'Date',
  scannedBy: 'String',
  location: 'String',
  daysUntilExpiry: 'Number'
};

module.exports = { SCAN_EVENT_SHAPE };
