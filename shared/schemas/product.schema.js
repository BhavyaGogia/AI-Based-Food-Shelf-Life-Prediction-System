// shared/schemas/product.schema.js
// OWNED BY: Both interns — any change requires 24-hour notice (see shared/README.md)
// VERSION: 2.0 — Reconciled 2026-06-25
// CHANGELOG: Added sku, riskLevel, unitSize, predictedExpiryTemplate
//            Renamed 'name' → 'productName'
//            Aligned category enums to lowercase

const PRODUCT_SCHEMA = {
  _id:                      'ObjectId',
  productName:              'String',          // RENAMED from 'name'
  sku:                      'String',          // NEW — Required, Unique
  category:                 'String',          // ENUM: "snack" | "juice" | "pickle"
  unitSize:                 'String',          // NEW — e.g. "500g Jar"
  baseShelfLifeDays:        'Number',          // Required — Intern 2 uses this as fallback
  predictedShelfLifeDays:   'Number | null',   // Intern 1 writes after ML/AI runs
  predictedExpiryTemplate:  'String',          // NEW — e.g. "Best Before {days} Days from Packing"
  riskLevel:                'String | null',   // NEW — "LOW" | "MEDIUM" | "HIGH" | null
  isActive:                 'Boolean',
  createdAt:                'Date',
  updatedAt:                'Date'
};

module.exports = PRODUCT_SCHEMA;
