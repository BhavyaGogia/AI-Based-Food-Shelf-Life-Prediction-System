const { body, validationResult } = require('express-validator');

const shelfLifeValidationRules = [

  // ── SECTION 1 — Product Identity ──────────────────────────────────────────
  body('productIdentity.productName')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ max: 100 }).withMessage('Product name must be under 100 characters'),

  body('productIdentity.productId')
    .notEmpty().withMessage('productId is required — select a product from the dropdown')
    .isMongoId().withMessage('productId must be a valid MongoDB ObjectId'),

  body('productIdentity.category')
    .notEmpty().withMessage('Category is required')
    .isIn(['snack', 'juice', 'pickle']).withMessage('Category must be: snack, juice, or pickle'),

  body('productIdentity.batchReference')
    .trim()
    .notEmpty().withMessage('Batch reference is required')
    .isLength({ max: 50 }).withMessage('Batch reference must be under 50 characters'),

  body('productIdentity.analysisDate')
    .notEmpty().withMessage('Analysis date is required')
    .isISO8601().withMessage('Analysis date must be a valid date (YYYY-MM-DD)'),

  // ── SECTION 2 — Sourcing ───────────────────────────────────────────────────
  body('sourcing.primaryIngredient')
    .notEmpty().withMessage('Primary ingredient is required')
    .isIn(['wild_turmeric', 'organic_ginger', 'raw_mango', 'apricot', 'wild_berry', 'himalayan_millet', 'mustard'])
    .withMessage('Invalid primary ingredient value'),

  body('sourcing.altitudeMetres')
    .optional({ nullable: true })
    .isFloat({ min: 0, max: 5000 }).withMessage('Altitude must be between 0 and 5000 metres'),

  body('sourcing.transportDistanceKm')
    .optional({ nullable: true })
    .isFloat({ min: 0 }).withMessage('Transport distance must be a positive number'),

  // ── SECTION 3 — Ingredients ────────────────────────────────────────────────
  body('ingredients.saltPercent')
    .notEmpty().withMessage('Salt percentage is required')
    .isFloat({ min: 0, max: 100 }).withMessage('Salt % must be 0–100'),

  body('ingredients.oilPercent')
    .notEmpty().withMessage('Oil percentage is required')
    .isFloat({ min: 0, max: 100 }).withMessage('Oil % must be 0–100'),

  body('ingredients.moisturePercent')
    .notEmpty().withMessage('Moisture percentage is required')
    .isFloat({ min: 0, max: 100 }).withMessage('Moisture % must be 0–100'),

  body('ingredients.waterActivity')
    .notEmpty().withMessage('Water activity is required')
    .isIn(['below_0_80', '0_80_to_0_90', 'above_0_90', 'not_sure'])
    .withMessage('Invalid water activity value'),

  // ── SECTION 4 — Processing ─────────────────────────────────────────────────
  body('processing.method')
    .notEmpty().withMessage('Processing method is required')
    .isIn(['raw', 'boiled', 'fried', 'sun_dried', 'cold_pressed', 'fermented'])
    .withMessage('Invalid processing method'),

  body('processing.heatTreatedBeforeSealing')
    .notEmpty().withMessage('heatTreatedBeforeSealing is required')
    .isBoolean().withMessage('heatTreatedBeforeSealing must be true or false'),

  body('processing.phLevel')
    .notEmpty().withMessage('pH level is required')
    .isIn(['below_3_5', '3_5_4_5', '4_5_6_0', 'above_6_0', 'not_tested'])
    .withMessage('Invalid pH level value'),

  // ── SECTION 5 — Packaging ──────────────────────────────────────────────────
  body('packaging.packagingType')
    .notEmpty().withMessage('Packaging type is required')
    .isIn(['glass_jar', 'plastic_pouch', 'pet_bottle', 'tin_can', 'paper_bag'])
    .withMessage('Invalid packaging type'),

  body('packaging.isAirtight')
    .notEmpty().withMessage('isAirtight is required')
    .isBoolean().withMessage('isAirtight must be true or false'),

  body('packaging.sealedStorageCondition')
    .notEmpty().withMessage('Sealed storage condition is required')
    .isIn(['refrigerated', 'room_temp_dry', 'room_temp_humid', 'cold_store'])
    .withMessage('Invalid sealed storage condition'),

  body('packaging.afterOpeningStorage')
    .notEmpty().withMessage('After-opening storage is required')
    .isIn(['refrigerated', 'room_temp', 'consume_immediately'])
    .withMessage('Invalid after-opening storage value'),

  body('packaging.distributionChannels')
    .optional()
    .isArray().withMessage('distributionChannels must be an array'),
];

function validateShelfLife(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      errors: errors.array().map(e => ({
        field: e.path,
        message: e.msg,
        received: e.value
      }))
    });
  }
  next();
}

module.exports = { shelfLifeValidationRules, validateShelfLife };
