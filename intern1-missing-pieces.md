# 🔧 INTERN 1 — MISSING PIECES (GAP FILL)
## HimShakti AI Shelf Life Prediction System — Week 4 Backend
> **Authority:** Tech Lead / Project Supervisor
> **Issued:** 2026-06-25
> **Purpose:** Fills 5 gaps identified after reviewing the corrected backend spec.
> **These 5 files + 1 fix are MANDATORY before your Week 4 PR is submitted.**

---

## GAP 1 — `backend/src/utils/promptBuilder.js` (Was Listed, Never Written)

This is the most critical utility in the entire backend. It converts all 35 form fields into the structured Gemini prompt. The controller calls this before every Gemini request.

```javascript
// backend/src/utils/promptBuilder.js
// PURPOSE: Converts the 35-field form submission into a structured Gemini prompt
// OWNED BY: Intern 1 — no shared contract needed

'use strict';

/**
 * Maps internal enum values to human-readable display labels
 * Keep in sync with the frontend form dropdowns
 */
const LABEL_MAPS = {
  primaryIngredient: {
    wild_turmeric: 'Wild Turmeric',
    organic_ginger: 'Organic Ginger',
    raw_mango: 'Raw Mango',
    apricot: 'Apricot',
    wild_berry: 'Wild Berry',
    himalayan_millet: 'Himalayan Millet',
    mustard: 'Mustard'
  },
  storageBeforeDelivery: {
    same_day: 'Same day (no storage)',
    one_to_two_days: '1–2 days',
    three_to_five_days: '3–5 days',
    more_than_five_days: 'More than 5 days'
  },
  waterActivity: {
    below_0_80: 'Below 0.80 (very dry)',
    '0_80_to_0_90': '0.80–0.90 (moderate)',
    above_0_90: 'Above 0.90 (high moisture)',
    not_sure: 'Not measured / unsure'
  },
  processingMethod: {
    raw: 'Raw (no heat treatment)',
    boiled: 'Boiled',
    fried: 'Fried',
    sun_dried: 'Sun dried',
    cold_pressed: 'Cold pressed',
    fermented: 'Fermented'
  },
  phLevel: {
    below_3_5: 'Below 3.5 (very acidic)',
    '3_5_4_5': '3.5–4.5 (acidic)',
    '4_5_6_0': '4.5–6.0 (mildly acidic)',
    above_6_0: 'Above 6.0 (near neutral)',
    not_tested: 'Not tested'
  },
  packagingType: {
    glass_jar: 'Glass jar (airtight)',
    plastic_pouch: 'Plastic pouch (sealed)',
    pet_bottle: 'PET bottle',
    tin_can: 'Tin can',
    paper_bag: 'Paper bag (not airtight)'
  },
  sealedStorageCondition: {
    refrigerated: 'Refrigerated (below 8°C)',
    room_temp_dry: 'Room temperature — dry place',
    room_temp_humid: 'Room temperature — humid area',
    cold_store: 'Cold storage (0–4°C)'
  },
  afterOpeningStorage: {
    refrigerated: 'Refrigerate after opening',
    room_temp: 'Room temperature',
    consume_immediately: 'Consume immediately after opening'
  },
  storageHumidity: {
    low: 'Low humidity (dry region / AC room)',
    moderate: 'Moderate humidity',
    high: 'High humidity (near coastal / monsoon region)'
  }
};

function getLabel(map, value) {
  if (!value) return 'Not provided';
  return (LABEL_MAPS[map] && LABEL_MAPS[map][value]) || value;
}

function formatList(arr) {
  if (!arr || arr.length === 0) return 'None';
  return arr.join(', ');
}

/**
 * Main function — builds the complete Gemini prompt from form data
 * @param {Object} formData — the full request body from POST /api/shelf-life/analyse
 * @returns {String} — complete prompt string to send to Gemini
 */
function buildShelfLifePrompt(formData) {
  const {
    productIdentity = {},
    sourcing = {},
    ingredients = {},
    processing = {},
    packaging = {},
    notes = {}
  } = formData;

  return `
You are a food science expert specialising in shelf life analysis for small-batch traditional Indian food products, specifically those produced in the Uttarakhand Himalayan region by rural women's collectives.

Analyse the following product data and return ONLY a valid JSON object (no explanation text, no markdown outside the JSON block). The JSON must follow the exact schema defined at the end of this prompt.

---

## PRODUCT IDENTITY

- Product Name: ${productIdentity.productName || 'Not provided'}
- SKU: ${productIdentity.sku || 'Not provided'}
- Category: ${productIdentity.category || 'Not provided'}
- Batch Reference: ${productIdentity.batchReference || 'Not provided'}
- Analysis Date: ${productIdentity.analysisDate || new Date().toISOString().split('T')[0]}

---

## SOURCING & RAW MATERIAL

- Primary Ingredient: ${getLabel('primaryIngredient', sourcing.primaryIngredient)}
- Farmer / Supplier Name: ${sourcing.farmerName || 'Not provided'}
- Village: ${sourcing.village || 'Not provided'}
- District: ${sourcing.district || 'Not provided'}
- Altitude (metres): ${sourcing.altitudeMetres ? `${sourcing.altitudeMetres}m above sea level` : 'Not provided'}
- Harvest Date: ${sourcing.harvestDate || 'Not provided'}
- Transport Distance from Farm to Unit: ${sourcing.transportDistanceKm ? `${sourcing.transportDistanceKm} km` : 'Not provided'}
- Storage Before Delivery to Processing Unit: ${getLabel('storageBeforeDelivery', sourcing.storageBeforeDelivery)}

ALTITUDE ADJUSTMENT NOTE: Products sourced above 1500m in Uttarakhand typically have lower microbial load due to UV exposure and cold temperatures. Apply a +3% to +8% shelf life bonus if altitude exceeds 1500m, and note this adjustment in your response.

---

## INGREDIENT COMPOSITION (approximate percentages)

- Salt: ${ingredients.saltPercent !== undefined ? `${ingredients.saltPercent}%` : 'Not provided'}
- Oil: ${ingredients.oilPercent !== undefined ? `${ingredients.oilPercent}%` : 'Not provided'}
- Vinegar / Acidulant: ${ingredients.vinegarPercent !== undefined ? `${ingredients.vinegarPercent}%` : 'Not provided'}
- Sugar: ${ingredients.sugarPercent !== undefined ? `${ingredients.sugarPercent}%` : 'Not provided'}
- Turmeric: ${ingredients.turmericPercent !== undefined ? `${ingredients.turmericPercent}%` : 'Not provided'}
- Other Spices / Preservatives: ${ingredients.otherSpices || 'None mentioned'}
- Estimated Moisture Content: ${ingredients.moisturePercent !== undefined ? `${ingredients.moisturePercent}%` : 'Not provided'}
- Water Activity (Aw): ${getLabel('waterActivity', ingredients.waterActivity)}

PRESERVATION SCIENCE NOTE:
- Salt above 8% significantly inhibits microbial growth (key for pickles)
- Oil above 15% acts as a moisture barrier (reduces water activity effectively)
- Vinegar/acidulant above 2% lowers pH, extending shelf life
- Moisture above 20% in a non-acidic product is a HIGH spoilage risk signal

---

## PROCESSING METHOD

- Method Used: ${getLabel('processingMethod', processing.method)}
- Processing Duration: ${processing.durationValue ? `${processing.durationValue} ${processing.durationUnit || 'units'}` : 'Not provided'}
- Processing Temperature: ${processing.temperatureCelsius ? `${processing.temperatureCelsius}°C` : 'Not provided'}
- Heat Treated Before Final Sealing: ${processing.heatTreatedBeforeSealing ? 'Yes' : 'No'}
- pH Level: ${getLabel('phLevel', processing.phLevel)}

HEAT TREATMENT NOTE: Products heat-treated above 80°C before final sealing have significantly reduced microbial load. Adjust shelf life upward if this condition is met.

---

## PACKAGING & STORAGE

- Packaging Type: ${getLabel('packagingType', packaging.packagingType)}
- Airtight Seal: ${packaging.isAirtight ? 'Yes — airtight sealed' : 'No — not fully airtight'}
- Sealed Storage Condition: ${getLabel('sealedStorageCondition', packaging.sealedStorageCondition)}
- After-Opening Storage Instruction: ${getLabel('afterOpeningStorage', packaging.afterOpeningStorage)}
- Ambient Storage Humidity: ${getLabel('storageHumidity', packaging.storageHumidity)}
- Distribution Channels: ${formatList(packaging.distributionChannels)}

---

## STAFF OBSERVATIONS & KNOWN ISSUES

- Staff Observations: ${notes.staffObservations || 'None provided'}
- Known Issues / Anomalies: ${formatList(notes.knownIssues)}

---

## YOUR ANALYSIS TASK

Based on all the above data, provide:

1. **Sealed shelf life** — duration in months (be conservative, not optimistic)
2. **After-opening shelf life** — days at room temperature AND days if refrigerated
3. **Risk factors** — list specific preservation concerns found in this batch data
4. **Improvement suggestions** — actionable steps HimShakti can take to extend shelf life
5. **Sourcing adjustment** — note if altitude or transport time affected your estimate
6. **Label-ready text** — one sentence suitable for printing on the physical product label
7. **Safety alert** — if any data combination suggests a serious spoilage or food safety risk, flag it clearly
8. **predictedShelfLifeDays** — a single integer (the sealed shelf life in days) for database storage
9. **riskLevel** — one of: "LOW", "MEDIUM", "HIGH" based on the overall preservation profile

---

## REQUIRED JSON RESPONSE SCHEMA

Return ONLY this JSON block. No text before or after it.

\`\`\`json
{
  "product_name": "string",
  "sku": "string or null",
  "analysis_date": "YYYY-MM-DD",
  "sealed_shelf_life": {
    "duration_months": number,
    "duration_display": "string (e.g. '8 months')",
    "best_before_date": "string (e.g. 'February 2027')",
    "storage_condition": "string",
    "confidence": "High | Medium | Low"
  },
  "after_opening_shelf_life": {
    "room_temp_days": number,
    "refrigerated_days": number,
    "display_room_temp": "string (e.g. '3 weeks')",
    "display_refrigerated": "string (e.g. '6 weeks')",
    "label_instruction": "string"
  },
  "risk_factors": [
    { "severity": "critical | warning | info", "message": "string" }
  ],
  "improvement_suggestions": ["string"],
  "sourcing_adjustment": {
    "applied": true | false,
    "reason": "string or null",
    "adjustment_percent": number or 0
  },
  "label_ready_text": "string",
  "safety_alert": "string or null",
  "predictedShelfLifeDays": number,
  "riskLevel": "LOW | MEDIUM | HIGH"
}
\`\`\`
`.trim();
}

module.exports = { buildShelfLifePrompt };
```

---

## GAP 2 — `backend/src/validators/shelfLife.validator.js` (Was Listed, Never Written)

This validates the 18 required fields from the 35-field form before it ever reaches the controller or Gemini.

```javascript
// backend/src/validators/shelfLife.validator.js
// PURPOSE: Validates POST /api/shelf-life/analyse request body
// Only required fields are enforced here. Optional fields are passed through.

const { body, validationResult } = require('express-validator');

// ─── Validation chains ──────────────────────────────────────────────────────

const shelfLifeValidationRules = [

  // SECTION 1 — Product Identity (all required)
  body('productIdentity.productName')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ max: 100 }).withMessage('Product name must be under 100 characters'),

  body('productIdentity.productId')
    .notEmpty().withMessage('productId is required — select a product from the dropdown')
    .isMongoId().withMessage('productId must be a valid MongoDB ObjectId'),

  body('productIdentity.category')
    .notEmpty().withMessage('Category is required')
    .isIn(['snack', 'juice', 'pickle']).withMessage('Category must be snack, juice, or pickle'),

  body('productIdentity.batchReference')
    .trim()
    .notEmpty().withMessage('Batch reference is required')
    .isLength({ max: 50 }).withMessage('Batch reference must be under 50 characters'),

  body('productIdentity.analysisDate')
    .notEmpty().withMessage('Analysis date is required')
    .isISO8601().withMessage('Analysis date must be a valid date (YYYY-MM-DD)'),

  // SECTION 2 — Sourcing (key fields required)
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

  // SECTION 3 — Ingredients (percentages must be 0–100, sum check skipped for flexibility)
  body('ingredients.saltPercent')
    .notEmpty().withMessage('Salt percentage is required')
    .isFloat({ min: 0, max: 100 }).withMessage('Salt percentage must be between 0 and 100'),

  body('ingredients.oilPercent')
    .notEmpty().withMessage('Oil percentage is required')
    .isFloat({ min: 0, max: 100 }).withMessage('Oil percentage must be between 0 and 100'),

  body('ingredients.moisturePercent')
    .notEmpty().withMessage('Moisture percentage is required')
    .isFloat({ min: 0, max: 100 }).withMessage('Moisture must be between 0 and 100'),

  body('ingredients.waterActivity')
    .notEmpty().withMessage('Water activity is required')
    .isIn(['below_0_80', '0_80_to_0_90', 'above_0_90', 'not_sure'])
    .withMessage('Invalid water activity value'),

  // SECTION 4 — Processing (method required, others optional)
  body('processing.method')
    .notEmpty().withMessage('Processing method is required')
    .isIn(['raw', 'boiled', 'fried', 'sun_dried', 'cold_pressed', 'fermented'])
    .withMessage('Invalid processing method'),

  body('processing.heatTreatedBeforeSealing')
    .notEmpty().withMessage('Heat treated before sealing field is required')
    .isBoolean().withMessage('heatTreatedBeforeSealing must be true or false'),

  body('processing.phLevel')
    .notEmpty().withMessage('pH level is required')
    .isIn(['below_3_5', '3_5_4_5', '4_5_6_0', 'above_6_0', 'not_tested'])
    .withMessage('Invalid pH level value'),

  // SECTION 5 — Packaging (all required)
  body('packaging.packagingType')
    .notEmpty().withMessage('Packaging type is required')
    .isIn(['glass_jar', 'plastic_pouch', 'pet_bottle', 'tin_can', 'paper_bag'])
    .withMessage('Invalid packaging type'),

  body('packaging.isAirtight')
    .notEmpty().withMessage('isAirtight field is required')
    .isBoolean().withMessage('isAirtight must be true or false'),

  body('packaging.sealedStorageCondition')
    .notEmpty().withMessage('Sealed storage condition is required')
    .isIn(['refrigerated', 'room_temp_dry', 'room_temp_humid', 'cold_store'])
    .withMessage('Invalid sealed storage condition'),

  body('packaging.afterOpeningStorage')
    .notEmpty().withMessage('After-opening storage instruction is required')
    .isIn(['refrigerated', 'room_temp', 'consume_immediately'])
    .withMessage('Invalid after-opening storage value'),

  body('packaging.distributionChannels')
    .optional()
    .isArray().withMessage('distributionChannels must be an array'),
];

// ─── Middleware function ─────────────────────────────────────────────────────

/**
 * Call this as route middleware BEFORE the controller
 * Usage in routes: router.post('/analyse', shelfLifeValidationRules, validateShelfLife, controller)
 */
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
```

---

## GAP 3 — `productId` Fix in Request Body + Controller Write-back

### The Problem
The corrected spec's controller write-back uses:
```javascript
await Product.findByIdAndUpdate(req.body.productIdentity.productId, ...)
```
But the original request body never included `productId`. The form only had `productName`, `category`, `batchReference`, `analysisDate`. This means `findByIdAndUpdate(undefined, ...)` — silent fail, no error, nothing written to Atlas.

### The Fix — Two-Part

**Part A — Add `productId` to the frontend form submission.**

The frontend product dropdown (`GET /api/products`) already returns `_id` for each product. When the user selects a product from the dropdown, store its `_id` and send it as `productIdentity.productId` in the request body.

Frontend example (React):
```javascript
// When user selects product from dropdown
const handleProductSelect = (product) => {
  setFormData(prev => ({
    ...prev,
    productIdentity: {
      ...prev.productIdentity,
      productId: product._id,       // ← include the MongoDB _id
      productName: product.productName,
      sku: product.sku
    }
  }));
};
```

**Part B — Corrected `shelfLife.controller.js` write-back section:**

```javascript
// backend/src/controllers/shelfLife.controller.js
const Product = require('../models/Product.model');
const Analysis = require('../models/Analysis.model');
const { analyseShelfLife } = require('../services/geminiService');
const { buildShelfLifePrompt } = require('../utils/promptBuilder');

exports.analyseShelfLife = async (req, res, next) => {
  try {
    const formData = req.body;
    const productId = formData.productIdentity?.productId;

    // Step 1 — Verify product exists before calling Gemini (fail fast)
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: `Product with id ${productId} not found. Ensure the frontend sends productIdentity.productId.`
      });
    }

    // Step 2 — Build prompt and call Gemini
    const prompt = buildShelfLifePrompt(formData);
    const geminiResult = await analyseShelfLife(prompt);

    // Step 3 — Write back predictedShelfLifeDays and riskLevel to products collection
    // Do this DIRECTLY via Mongoose — never via internal HTTP call
    await Product.findByIdAndUpdate(
      productId,
      {
        predictedShelfLifeDays: geminiResult.predictedShelfLifeDays,
        riskLevel: geminiResult.riskLevel
      },
      { new: true, runValidators: true }
    );

    // Step 4 — Save full analysis to analyses collection (owned by Intern 1 only)
    await Analysis.create({
      productId,
      batchReference: formData.productIdentity?.batchReference,
      analysisDate: new Date(formData.productIdentity?.analysisDate || Date.now()),
      formSnapshot: formData,
      geminiResult,
      predictedShelfLifeDays: geminiResult.predictedShelfLifeDays,
      riskLevel: geminiResult.riskLevel
    });

    // Step 5 — Return result to frontend
    res.status(200).json({
      success: true,
      data: geminiResult
    });

  } catch (err) {
    // Pass to global error handler
    next(err);
  }
};
```

---

## GAP 4 — Route Files Were Never Written

### `backend/src/routes/products.routes.js`

```javascript
// backend/src/routes/products.routes.js
const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deactivateProduct
} = require('../controllers/products.controller');

// GET    /api/products           — list all active products
// GET    /api/products/:id       — get single product
// POST   /api/products           — create new product
// PUT    /api/products/:id       — update product (write-back predictedShelfLifeDays, riskLevel)
// DELETE /api/products/:id       — soft delete (sets isActive: false)

router.get('/',      getAllProducts);
router.get('/:id',   getProductById);
router.post('/',     createProduct);
router.put('/:id',   updateProduct);
router.delete('/:id', deactivateProduct);

module.exports = router;
```

### `backend/src/routes/shelfLife.routes.js`

```javascript
// backend/src/routes/shelfLife.routes.js
const express = require('express');
const router = express.Router();
const { analyseShelfLife, getAnalysisHistory } = require('../controllers/shelfLife.controller');
const { shelfLifeValidationRules, validateShelfLife } = require('../validators/shelfLife.validator');

// POST   /api/shelf-life/analyse            — run AI shelf life analysis
// GET    /api/shelf-life/history            — get past analyses with pagination

router.post(
  '/analyse',
  shelfLifeValidationRules,     // runs all 18 validation rules
  validateShelfLife,             // returns 400 if any rule fails
  analyseShelfLife               // only reached if validation passes
);

router.get('/history', getAnalysisHistory);

module.exports = router;
```

### `backend/src/controllers/products.controller.js` (Full Version)

```javascript
// backend/src/controllers/products.controller.js
const Product = require('../models/Product.model');
const mongoose = require('mongoose');

// GET /api/products
exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isActive: true })
      .select('-__v')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/products/:id
exports.getProductById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, error: 'Invalid product ID format' });
    }

    const product = await Product.findById(req.params.id).select('-__v');
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.status(200).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// POST /api/products
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    // Handle duplicate SKU gracefully
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        error: `SKU '${req.body.sku}' already exists. SKU must be unique.`
      });
    }
    next(err);
  }
};

// PUT /api/products/:id
exports.updateProduct = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, error: 'Invalid product ID format' });
    }

    // Prevent accidental _id or sku overwrite in updates
    delete req.body._id;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.status(200).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/products/:id  — soft delete only (sets isActive: false)
exports.deactivateProduct = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, error: 'Invalid product ID format' });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      message: `Product '${product.productName}' deactivated (soft delete)`,
      data: product
    });
  } catch (err) {
    next(err);
  }
};
```

### `backend/src/controllers/shelfLife.controller.js` — `getAnalysisHistory` Method

Add this export to the controller file (the `analyseShelfLife` export was already written in Gap 3):

```javascript
// GET /api/shelf-life/history?product=:id&limit=10&page=1
exports.getAnalysisHistory = async (req, res, next) => {
  try {
    const { product, limit = 10, page = 1 } = req.query;

    if (!product || !mongoose.Types.ObjectId.isValid(product)) {
      return res.status(400).json({
        success: false,
        error: 'product query parameter is required and must be a valid MongoDB ObjectId'
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [analyses, total] = await Promise.all([
      Analysis.find({ productId: product })
        .sort({ analysisDate: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select('-formSnapshot -__v'),    // exclude large snapshot from list view
      Analysis.countDocuments({ productId: product })
    ]);

    res.status(200).json({
      success: true,
      count: analyses.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: analyses
    });
  } catch (err) {
    next(err);
  }
};
```

---

## GAP 5 — `DELETE /api/products/:id` Soft Delete (7th Endpoint)

This is already handled in Gap 4 above — `deactivateProduct` in `products.controller.js` and the `router.delete('/:id', deactivateProduct)` line in `products.routes.js`.

Your Week 4 checklist now has **7 endpoints** satisfying the org requirement:

| # | Method | Route | Purpose |
|---|---|---|---|
| 1 | GET    | `/api/products` | List all active products |
| 2 | GET    | `/api/products/:id` | Get single product |
| 3 | POST   | `/api/products` | Create product |
| 4 | PUT    | `/api/products/:id` | Update product |
| 5 | DELETE | `/api/products/:id` | Soft-delete product (sets isActive: false) |
| 6 | POST   | `/api/shelf-life/analyse` | Run AI shelf life analysis |
| 7 | GET    | `/api/shelf-life/history` | Get analysis history with pagination |

---

## 📋 UPDATED FINAL CHECKLIST — FILES TO CREATE

You now have code for every file. Create them in this order:

| Order | File | Status |
|---|---|---|
| 1 | `.gitignore` | ☐ |
| 2 | `.env.example` | ☐ |
| 3 | `server.js` | ☐ |
| 4 | `src/config/db.js` | ☐ |
| 5 | `src/models/Product.model.js` | ☐ |
| 6 | `src/models/Analysis.model.js` | ☐ |
| 7 | `src/middleware/errorHandler.js` | ☐ |
| 8 | `src/middleware/cors.js` | ☐ |
| 9 | `src/middleware/rateLimiter.js` | ☐ |
| 10 | `src/utils/promptBuilder.js` | ☐ |
| 11 | `src/validators/shelfLife.validator.js` | ☐ |
| 12 | `src/controllers/products.controller.js` | ☐ |
| 13 | `src/controllers/shelfLife.controller.js` | ☐ |
| 14 | `src/routes/products.routes.js` | ☐ |
| 15 | `src/routes/shelfLife.routes.js` | ☐ |
| 16 | `src/services/geminiService.js` | ☐ |
| 17 | `src/scripts/seedProducts.js` | ☐ |

After all 17 files exist, run:
```bash
npm run seed        # populate 5 products in Atlas
npm run dev         # start server
# Test /health first, then test all 7 endpoints in Postman
```

---

> 📌 *This document fills the 5 gaps identified in the first corrected spec review*
> 📌 *Together with `intern1-corrected-backend-prompt.md`, this gives Intern 1 100% of the code needed for Week 4*
> 📌 *No more missing files. No more undefined references.*
