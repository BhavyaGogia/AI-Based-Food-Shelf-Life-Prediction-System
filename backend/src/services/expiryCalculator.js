// backend/src/services/expiryCalculator.js
// PURPOSE: Calculate expiry dates for batches based on product shelf-life data.
//          Uses assertProductContract to crash loudly if schema contract is violated.

const { assertProductContract } = require('../db-contracts/productContract');

/**
 * Calculate the expected expiry date for a batch.
 *
 * @param {object} product   - Product document from 'products' collection (Intern 1's data)
 * @param {Date}   packDate  - The date the batch was packed
 * @returns {{ expiryDate: Date, daysUntilExpiry: number, shelfLifeUsed: number }}
 */
function calculateExpiry(product, packDate) {
  // Contract check first — crashes loudly if Intern 1's schema changed without notice
  assertProductContract(product);

  // Use predictedShelfLifeDays if ML has run, otherwise fall back to base
  const shelfLifeUsed = product.predictedShelfLifeDays ?? product.baseShelfLifeDays;

  const expiryDate = new Date(packDate);
  expiryDate.setDate(expiryDate.getDate() + shelfLifeUsed);

  const now = new Date();
  const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));

  return {
    expiryDate,
    daysUntilExpiry,
    shelfLifeUsed
  };
}

/**
 * Determine the status of a batch based on days until expiry.
 *
 * @param {number} daysUntilExpiry
 * @returns {'expired' | 'expiring_soon' | 'active'}
 */
function getBatchStatus(daysUntilExpiry) {
  if (daysUntilExpiry <= 0) return 'expired';
  if (daysUntilExpiry <= 7) return 'expiring_soon';
  return 'active';
}

module.exports = { calculateExpiry, getBatchStatus };
