# 🚀 WEEK 4 — COMPLETE BACKEND GUIDE
## HimShakti AI Shelf Life Prediction System — Intern 1
> **This is the ONE file you need. Read it top to bottom. Execute every step in order.**
> **Every file has its full code written here. No missing pieces.**

---

## 📋 WHAT YOU WILL BUILD THIS WEEK

By the end of this guide you will have:

| # | What | Where |
|---|---|---|
| ✅ | MongoDB Atlas cluster connected to your Express server | Cloud |
| ✅ | 7 REST API endpoints running on `http://localhost:5000` | Backend |
| ✅ | Gemini AI integrated with a 25-second timeout guard | Backend |
| ✅ | 5 products seeded in the shared Atlas `himshakti` database | Atlas |
| ✅ | Frontend dropdown fetching real products from the API | Frontend |
| ✅ | Analyse button calling real Gemini AI and showing results | Frontend |
| ✅ | All 7 endpoints tested and exported as a Postman collection | Testing |

---

## ⚠️ BEFORE YOU START — READ THESE TWO RULES

**Rule 1 — Shared Database Contract:**
You and Intern 2 share the same MongoDB Atlas cluster and the same `himshakti` database. The `products` collection belongs to both of you. You own writes. Intern 2 reads from it. **Any field name change in `products` needs a GitHub Issue posted in Intern 2's repo with 24 hours notice. No exceptions.**

**Rule 2 — Never commit `.env`:**
Your `.env` file contains your Atlas password and Gemini API key. It must NEVER be committed to Git. You will create a `.gitignore` as the very first step.

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## PHASE 1 — MONGODB ATLAS SETUP (Do This First)
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### Step 1.1 — Create a Free Atlas Cluster

1. Go to **https://cloud.mongodb.com** → Sign in
2. Click **"Create a deployment"** → Choose **"M0 Free"** (the free tier)
3. **Cloud provider:** AWS → **Region:** Mumbai (ap-south-1) — closest to India
4. **Cluster name:** `himshakti-cluster` (or whatever you like, it doesn't matter)
5. Click **"Create Deployment"**

---

### Step 1.2 — Create a Database User

After the cluster is created:

1. On the left sidebar → **"Database Access"**
2. Click **"Add New Database User"**
3. **Authentication Method:** Password
4. **Username:** `himshakti-admin`
5. **Password:** Click "Autogenerate Secure Password" → **copy it and save it immediately**
6. **Database User Privileges:** Select "Read and write to any database"
7. Click **"Add User"**

> ⚠️ Save your username and password right now. You will paste it into your `.env` file in Step 1.4.

---

### Step 1.3 — Allow Your IP Address

1. On the left sidebar → **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Allow Access From Anywhere"** → This adds `0.0.0.0/0`
4. Click **"Confirm"**

> This is fine for development. For production, restrict to specific IPs.

---

### Step 1.4 — Get Your Connection String

1. On the left sidebar → **"Database"** → Click **"Connect"** on your cluster
2. Choose **"Drivers"**
3. **Driver:** Node.js | **Version:** 5.5 or later
4. Copy the connection string. It looks like this:
   ```
   mongodb+srv://himshakti-admin:<password>@himshakti-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. **CRITICAL: Add the database name `himshakti` before the `?`:**
   ```
   mongodb+srv://himshakti-admin:YourPassword@himshakti-cluster.xxxxx.mongodb.net/himshakti?retryWrites=true&w=majority
   ```

> The `/himshakti` part tells MongoDB which database to use. Without it, it uses `test` — which is the wrong database and Intern 2's API will not find your products.

---

### Step 1.5 — Confirm the Database Name with Intern 2

**Message Intern 2 RIGHT NOW:**
> "Hey, I'm setting up Week 4. My Atlas connection string uses database name `himshakti`. Please confirm yours is the same so we're on the same DB."

Both of you must have `/himshakti` at the end of the MongoDB URI. This is the only way your `products` collection is visible to Intern 2's `GET /api/v1/products`.

---

### Step 1.6 — Share the URI Privately

WhatsApp DM or private message only. **Never paste the MongoDB URI into GitHub, Slack channels, or any public chat.**

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## PHASE 2 — GET YOUR GEMINI API KEY
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### Step 2.1 — Create API Key

1. Go to **https://aistudio.google.com/app/apikey**
2. Click **"Create API Key"**
3. Select your Google Cloud project (or create a new one)
4. Copy the API key — it starts with `AIza...`
5. Save it. You will paste it into `.env` in Phase 3.

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## PHASE 3 — PROJECT SETUP
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### Step 3.1 — Navigate to the Backend Folder

Open VS Code terminal:
```bash
cd "c:\Users\bhavya\Desktop\internship project idea\backend"
```

If the `backend` folder doesn't exist yet:
```bash
mkdir "c:\Users\bhavya\Desktop\internship project idea\backend"
cd "c:\Users\bhavya\Desktop\internship project idea\backend"
```

---

### Step 3.2 — Initialise npm

```bash
npm init -y
```

This creates `package.json`.

---

### Step 3.3 — Install All Dependencies

```bash
npm install express cors dotenv mongoose express-validator express-rate-limit helmet @google/generative-ai
```

```bash
npm install --save-dev nodemon
```

---

### Step 3.4 — Update `package.json` Scripts

Open `backend/package.json` and replace the `"scripts"` section with:

```json
"scripts": {
  "dev": "nodemon server.js",
  "start": "node server.js",
  "seed": "node src/scripts/seedProducts.js"
}
```

---

### Step 3.5 — Create the Full Folder Structure

Run these commands one by one in the terminal (inside the `backend/` folder):

```bash
mkdir src
mkdir src\config
mkdir src\models
mkdir src\validators
mkdir src\controllers
mkdir src\middleware
mkdir src\routes
mkdir src\services
mkdir src\scripts
mkdir src\utils
mkdir tests
```

You should now have this structure:
```
backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── services/
│   ├── utils/
│   └── validators/
├── tests/
├── package.json
└── node_modules/
```

---

### Step 3.6 — Create `.gitignore`

Create file `backend/.gitignore`:

```
node_modules/
.env
*.postman_collection.json
dist/
.DS_Store
```

---

### Step 3.7 — Create `.env`

Create file `backend/.env` (this file is NEVER committed):

```
MONGODB_URI=mongodb+srv://himshakti-admin:YourPasswordHere@himshakti-cluster.xxxxx.mongodb.net/himshakti?retryWrites=true&w=majority
GEMINI_API_KEY=AIzaYourKeyHere
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Replace the URI and API key with your actual values.

---

### Step 3.8 — Create `.env.example`

Create file `backend/.env.example` (this IS committed — it's the template with no real secrets):

```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/himshakti?retryWrites=true&w=majority
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## PHASE 4 — WRITE ALL BACKEND FILES (17 files)
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create every file below **exactly as written**. Do not change field names.

---

### FILE 1 — `backend/src/config/db.js`

```javascript
const mongoose = require('mongoose');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB Atlas connected — himshakti DB');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
}

// Reconnection listeners — mandatory for Atlas free tier (drops idle connections)
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected. Attempting reconnect in 5s...');
  setTimeout(connectDB, 5000);
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err.message);
});

// Graceful shutdown when process exits
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed on app termination');
  process.exit(0);
});

module.exports = { connectDB };
```

---

### FILE 2 — `backend/src/models/Product.model.js`

> This is the shared contract with Intern 2. Field names here MUST match `shared/schemas/product.schema.js`.

```javascript
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
    // NO unique: true here — SKU is the unique identifier, not the name
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    uppercase: true,
    trim: true,
    match: [/^HS-[A-Z0-9-]+$/, 'SKU must follow format HS-XXX-XXX-00']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['snack', 'juice', 'pickle'],
      message: '{VALUE} is not a valid category'
    }
  },
  unitSize: {
    type: String,
    required: [true, 'Unit size is required'],
    trim: true
  },
  baseShelfLifeDays: {
    type: Number,
    required: [true, 'Base shelf life is required'],
    min: [1, 'Shelf life must be at least 1 day']
  },
  predictedShelfLifeDays: {
    type: Number,
    default: null,
    min: 0
  },
  predictedExpiryTemplate: {
    type: String,
    default: 'Best Before {days} Days from Packing',
    trim: true
  },
  riskLevel: {
    type: String,
    default: null,
    // Custom validator — Mongoose enum does not support null values
    validate: {
      validator: function(v) {
        return v === null || ['LOW', 'MEDIUM', 'HIGH'].includes(v);
      },
      message: 'riskLevel must be LOW, MEDIUM, HIGH, or null'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,       // auto-adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index for fast frontend dropdown queries
ProductSchema.index({ isActive: 1, category: 1 });

module.exports = mongoose.model('Product', ProductSchema);
```

---

### FILE 3 — `backend/src/models/Analysis.model.js`

> This collection is owned exclusively by Intern 1. No shared contract needed.

```javascript
const mongoose = require('mongoose');

const AnalysisSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true        // index for fast history queries
  },
  batchReference: {
    type: String,
    required: true
  },
  analysisDate: {
    type: Date,
    default: Date.now
  },
  formSnapshot: {
    type: mongoose.Schema.Types.Mixed   // stores the full 35-field form input as-is
  },
  geminiResult: {
    type: mongoose.Schema.Types.Mixed   // stores the full Gemini response as-is
  },
  predictedShelfLifeDays: {
    type: Number
  },
  riskLevel: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH'],
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Analysis', AnalysisSchema);
```

---

### FILE 4 — `backend/src/middleware/errorHandler.js`

```javascript
function errorHandler(err, req, res, next) {
  console.error('ERROR:', err.stack || err.message);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: messages
    });
  }

  // Mongoose duplicate key error (e.g. duplicate SKU)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      error: `Duplicate value for field '${field}': ${err.keyValue[field]}`
    });
  }

  // Mongoose CastError (invalid ObjectId format)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: `Invalid value for field '${err.path}': ${err.value}`
    });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
}

module.exports = errorHandler;
```

---

### FILE 5 — `backend/src/middleware/cors.js`

```javascript
const cors = require('cors');

const allowedOrigins = [
  'http://localhost:5173',   // Vite dev server
  'http://localhost:3000',   // CRA / alternative
  process.env.FRONTEND_URL   // production Vercel URL
].filter(Boolean);

module.exports = cors({
  origin: function (origin, callback) {
    // Allow Postman and server-to-server calls (no origin header)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: Origin ${origin} not allowed`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
  // NO credentials: true — this project has no cookies or sessions
});
```

---

### FILE 6 — `backend/src/middleware/rateLimiter.js`

> Protects the Gemini endpoint. Without this, anyone can spam your free API quota dry in minutes.

```javascript
const rateLimit = require('express-rate-limit');

const shelfLifeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15-minute window
  max: 10,                     // 10 Gemini calls per IP per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many analysis requests. Please wait 15 minutes before trying again.'
  }
});

module.exports = { shelfLifeLimiter };
```

---

### FILE 7 — `backend/src/services/geminiService.js`

```javascript
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const GEMINI_TIMEOUT_MS = 25000; // 25 seconds max — Gemini free tier can be slow

async function analyseShelfLife(promptText) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // Race: Gemini call vs timeout — whichever finishes first wins
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(
      () => reject(new Error('Gemini API timed out after 25 seconds')),
      GEMINI_TIMEOUT_MS
    )
  );

  const geminiPromise = model.generateContent(promptText);
  const result = await Promise.race([geminiPromise, timeoutPromise]);
  const text = result.response.text();

  // Extract the JSON block from Gemini's response
  const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/);
  if (!jsonMatch) {
    throw new Error('Gemini response did not contain a valid JSON block. Raw response: ' + text.substring(0, 200));
  }

  try {
    return JSON.parse(jsonMatch[1].trim());
  } catch (parseError) {
    throw new Error(`Failed to parse Gemini JSON: ${parseError.message}`);
  }
}

module.exports = { analyseShelfLife };
```

---

### FILE 8 — `backend/src/utils/promptBuilder.js`

```javascript
'use strict';

// Maps frontend enum values to human-readable labels for the Gemini prompt
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

function getLabel(mapName, value) {
  if (!value) return 'Not provided';
  return (LABEL_MAPS[mapName] && LABEL_MAPS[mapName][value]) || value;
}

function formatList(arr) {
  if (!arr || arr.length === 0) return 'None';
  return arr.join(', ');
}

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
You are a food science expert specialising in shelf life analysis for small-batch traditional Indian food products produced in the Uttarakhand Himalayan region.

Analyse the following product data and return ONLY a valid JSON object inside a json code block. No explanation text outside the JSON block.

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
- Farmer / Supplier: ${sourcing.farmerName || 'Not provided'}
- Village: ${sourcing.village || 'Not provided'}
- District: ${sourcing.district || 'Not provided'}
- Altitude: ${sourcing.altitudeMetres ? `${sourcing.altitudeMetres}m above sea level` : 'Not provided'}
- Harvest Date: ${sourcing.harvestDate || 'Not provided'}
- Transport Distance: ${sourcing.transportDistanceKm ? `${sourcing.transportDistanceKm} km` : 'Not provided'}
- Storage Before Delivery: ${getLabel('storageBeforeDelivery', sourcing.storageBeforeDelivery)}

ALTITUDE RULE: Products sourced above 1500m have lower microbial load. Apply +3% to +8% shelf life bonus if altitude > 1500m.

---

## INGREDIENT COMPOSITION
- Salt: ${ingredients.saltPercent !== undefined ? `${ingredients.saltPercent}%` : 'Not provided'}
- Oil: ${ingredients.oilPercent !== undefined ? `${ingredients.oilPercent}%` : 'Not provided'}
- Vinegar / Acidulant: ${ingredients.vinegarPercent !== undefined ? `${ingredients.vinegarPercent}%` : 'Not provided'}
- Sugar: ${ingredients.sugarPercent !== undefined ? `${ingredients.sugarPercent}%` : 'Not provided'}
- Turmeric: ${ingredients.turmericPercent !== undefined ? `${ingredients.turmericPercent}%` : 'Not provided'}
- Other Spices: ${ingredients.otherSpices || 'None mentioned'}
- Moisture Content: ${ingredients.moisturePercent !== undefined ? `${ingredients.moisturePercent}%` : 'Not provided'}
- Water Activity (Aw): ${getLabel('waterActivity', ingredients.waterActivity)}

SCIENCE NOTES: Salt > 8% inhibits microbial growth. Oil > 15% reduces water activity. Vinegar > 2% lowers pH. Moisture > 20% in non-acidic product = HIGH spoilage risk.

---

## PROCESSING
- Method: ${getLabel('processingMethod', processing.method)}
- Duration: ${processing.durationValue ? `${processing.durationValue} ${processing.durationUnit || 'units'}` : 'Not provided'}
- Temperature: ${processing.temperatureCelsius ? `${processing.temperatureCelsius}°C` : 'Not provided'}
- Heat Treated Before Sealing: ${processing.heatTreatedBeforeSealing ? 'Yes' : 'No'}
- pH Level: ${getLabel('phLevel', processing.phLevel)}

HEAT NOTE: Products heat-treated above 80°C before sealing have significantly lower microbial load. Adjust shelf life upward.

---

## PACKAGING & STORAGE
- Packaging Type: ${getLabel('packagingType', packaging.packagingType)}
- Airtight: ${packaging.isAirtight ? 'Yes — airtight sealed' : 'No — not airtight'}
- Sealed Storage: ${getLabel('sealedStorageCondition', packaging.sealedStorageCondition)}
- After Opening: ${getLabel('afterOpeningStorage', packaging.afterOpeningStorage)}
- Storage Humidity: ${getLabel('storageHumidity', packaging.storageHumidity)}
- Distribution: ${formatList(packaging.distributionChannels)}

---

## STAFF NOTES
- Observations: ${notes.staffObservations || 'None'}
- Known Issues: ${formatList(notes.knownIssues)}

---

## REQUIRED JSON RESPONSE

Return ONLY this structure. Be conservative (not optimistic) with shelf life estimates.

\`\`\`json
{
  "product_name": "string",
  "sku": "string or null",
  "analysis_date": "YYYY-MM-DD",
  "sealed_shelf_life": {
    "duration_months": 0,
    "duration_display": "string",
    "best_before_date": "string",
    "storage_condition": "string",
    "confidence": "High | Medium | Low"
  },
  "after_opening_shelf_life": {
    "room_temp_days": 0,
    "refrigerated_days": 0,
    "display_room_temp": "string",
    "display_refrigerated": "string",
    "label_instruction": "string"
  },
  "risk_factors": [
    { "severity": "critical | warning | info", "message": "string" }
  ],
  "improvement_suggestions": ["string"],
  "sourcing_adjustment": {
    "applied": true,
    "reason": "string or null",
    "adjustment_percent": 0
  },
  "label_ready_text": "string",
  "safety_alert": "string or null",
  "predictedShelfLifeDays": 0,
  "riskLevel": "LOW | MEDIUM | HIGH"
}
\`\`\`
`.trim();
}

module.exports = { buildShelfLifePrompt };
```

---

### FILE 9 — `backend/src/validators/shelfLife.validator.js`

```javascript
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
```

---

### FILE 10 — `backend/src/controllers/products.controller.js`

```javascript
const Product = require('../models/Product.model');
const mongoose = require('mongoose');

// GET /api/products — list all active products
exports.getAllProducts = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;

    const products = await Product.find(filter)
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

// GET /api/products/:id — get single product
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

// POST /api/products — create new product
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        error: `SKU '${req.body.sku}' already exists. SKU must be unique.`
      });
    }
    next(err);
  }
};

// PUT /api/products/:id — update product
exports.updateProduct = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, error: 'Invalid product ID format' });
    }

    // Prevent accidental overwrite of _id field
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

// DELETE /api/products/:id — soft delete (sets isActive: false, does NOT delete from DB)
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
      message: `Product '${product.productName}' deactivated`,
      data: product
    });
  } catch (err) {
    next(err);
  }
};
```

---

### FILE 11 — `backend/src/controllers/shelfLife.controller.js`

```javascript
const mongoose = require('mongoose');
const Product = require('../models/Product.model');
const Analysis = require('../models/Analysis.model');
const { analyseShelfLife: callGemini } = require('../services/geminiService');
const { buildShelfLifePrompt } = require('../utils/promptBuilder');

// POST /api/shelf-life/analyse
exports.analyseShelfLife = async (req, res, next) => {
  try {
    const formData = req.body;
    const productId = formData.productIdentity?.productId;

    // Step 1 — Verify product exists BEFORE calling Gemini (fail fast, save quota)
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: `Product with id '${productId}' not found. Ensure the frontend sends productIdentity.productId.`
      });
    }

    // Step 2 — Build prompt and call Gemini
    const prompt = buildShelfLifePrompt(formData);
    const geminiResult = await callGemini(prompt);

    // Step 3 — Write back predictedShelfLifeDays and riskLevel to products collection
    // IMPORTANT: Use Mongoose directly — never make an internal HTTP call to your own API
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
    next(err);
  }
};

// GET /api/shelf-life/history?product=:id&limit=10&page=1
exports.getAnalysisHistory = async (req, res, next) => {
  try {
    const { product, limit = 10, page = 1 } = req.query;

    if (!product || !mongoose.Types.ObjectId.isValid(product)) {
      return res.status(400).json({
        success: false,
        error: 'product query param is required and must be a valid MongoDB ObjectId'
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [analyses, total] = await Promise.all([
      Analysis.find({ productId: product })
        .sort({ analysisDate: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select('-formSnapshot -__v'),   // exclude large snapshot from list view
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

### FILE 12 — `backend/src/routes/products.routes.js`

```javascript
const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deactivateProduct
} = require('../controllers/products.controller');

// GET    /api/products        — list all active products (frontend dropdown)
// GET    /api/products/:id    — get single product by ID
// POST   /api/products        — create a new product
// PUT    /api/products/:id    — update product (write-back predictedShelfLifeDays, riskLevel)
// DELETE /api/products/:id    — soft delete (sets isActive: false)

router.get('/',       getAllProducts);
router.get('/:id',    getProductById);
router.post('/',      createProduct);
router.put('/:id',    updateProduct);
router.delete('/:id', deactivateProduct);

module.exports = router;
```

---

### FILE 13 — `backend/src/routes/shelfLife.routes.js`

```javascript
const express = require('express');
const router = express.Router();
const {
  analyseShelfLife,
  getAnalysisHistory
} = require('../controllers/shelfLife.controller');
const {
  shelfLifeValidationRules,
  validateShelfLife
} = require('../validators/shelfLife.validator');

// POST /api/shelf-life/analyse  — run AI shelf life analysis (Gemini)
// GET  /api/shelf-life/history  — get past analyses with pagination

router.post(
  '/analyse',
  shelfLifeValidationRules,   // Step 1: run all 18 validation rules
  validateShelfLife,           // Step 2: return 400 if any rule fails
  analyseShelfLife             // Step 3: only runs if validation passes
);

router.get('/history', getAnalysisHistory);

module.exports = router;
```

---

### FILE 14 — `backend/src/scripts/seedProducts.js`

```javascript
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Product = require('../models/Product.model');

const products = [
  {
    productName: 'Traditional Mango Pickle',
    sku: 'HS-MNG-PCK-01',
    category: 'pickle',
    unitSize: '500g Jar',
    baseShelfLifeDays: 365,
    predictedShelfLifeDays: null,
    predictedExpiryTemplate: 'Best Before {days} Days from Packing',
    riskLevel: null
  },
  {
    productName: 'Organic Ginger Pickle',
    sku: 'HS-GNG-PCK-02',
    category: 'pickle',
    unitSize: '250g Jar',
    baseShelfLifeDays: 270,
    predictedShelfLifeDays: null,
    predictedExpiryTemplate: 'Best Before {days} Days from Packing',
    riskLevel: null
  },
  {
    productName: 'Himalayan Mixed Snack',
    sku: 'HS-MIX-SNK-01',
    category: 'snack',
    unitSize: '200g Pouch',
    baseShelfLifeDays: 180,
    predictedShelfLifeDays: null,
    predictedExpiryTemplate: 'Best Before {days} Days from Manufacturing',
    riskLevel: null
  },
  {
    productName: 'Wild Berry Juice Concentrate',
    sku: 'HS-WBJ-JCE-01',
    category: 'juice',
    unitSize: '500ml Bottle',
    baseShelfLifeDays: 120,
    predictedShelfLifeDays: null,
    predictedExpiryTemplate: 'Best Before {days} Days from Bottling',
    riskLevel: null
  },
  {
    productName: 'Apricot Jam',
    sku: 'HS-APR-JAM-01',
    category: 'snack',
    unitSize: '300g Jar',
    baseShelfLifeDays: 300,
    predictedShelfLifeDays: null,
    predictedExpiryTemplate: 'Best Before {days} Days from Packing',
    riskLevel: null
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to Atlas');

    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    const inserted = await Product.insertMany(products);
    console.log(`✅ ${inserted.length} products seeded in Atlas`);

    inserted.forEach(p => console.log(`  → ${p.sku} | ${p.productName} | ${p.category}`));

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
```

---

### FILE 15 — `backend/server.js`

```javascript
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const { connectDB } = require('./src/config/db');
const corsMiddleware = require('./src/middleware/cors');
const errorHandler = require('./src/middleware/errorHandler');
const { shelfLifeLimiter } = require('./src/middleware/rateLimiter');

const productRoutes = require('./src/routes/products.routes');
const shelfLifeRoutes = require('./src/routes/shelfLife.routes');

const app = express();

// ── Security & Parsing ────────────────────────────────────────────────────────
app.use(helmet());                                // security headers
app.use(corsMiddleware);                          // CORS
app.use(express.json({ limit: '10kb' }));         // body parser, size-limited
app.use(express.urlencoded({ extended: false }));

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  const mongoose = require('mongoose');
  res.json({
    status: 'ok',
    service: 'himshakti-shelf-life-api',
    timestamp: new Date().toISOString(),
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/products', productRoutes);
app.use('/api/shelf-life', shelfLifeLimiter, shelfLifeRoutes);

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.path} not found`
  });
});

// ── Global Error Handler (must be last) ───────────────────────────────────────
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/health`);
    console.log(`🌿 Products API: http://localhost:${PORT}/api/products`);
  });
});
```

---

### FILE 16 — Update `shared/schemas/product.schema.js` (v2.0 — DO THIS NOW)

Open `shared/schemas/product.schema.js` and replace the entire file content:

```javascript
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
```

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## PHASE 5 — RUN AND TEST
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### Step 5.1 — Seed the Database

```bash
cd backend
npm run seed
```

Expected output:
```
✅ Connected to Atlas
🗑️  Cleared existing products
✅ 5 products seeded in Atlas
  → HS-MNG-PCK-01 | Traditional Mango Pickle | pickle
  → HS-GNG-PCK-02 | Organic Ginger Pickle | pickle
  → HS-MIX-SNK-01 | Himalayan Mixed Snack | snack
  → HS-WBJ-JCE-01 | Wild Berry Juice Concentrate | juice
  → HS-APR-JAM-01 | Apricot Jam | snack
```

Verify in Atlas: Go to `cloud.mongodb.com` → Your Cluster → **Browse Collections** → `himshakti` database → `products` collection → you should see 5 documents.

---

### Step 5.2 — Start the Dev Server

```bash
npm run dev
```

Expected output:
```
✅ MongoDB Atlas connected — himshakti DB
🚀 Server running on http://localhost:5000
📡 Health check: http://localhost:5000/health
🌿 Products API: http://localhost:5000/api/products
```

---

### Step 5.3 — Test All 7 Endpoints in Postman

Open Postman. Create a new Collection called `HimShakti Intern 1 API`. Add these 7 requests:

---

**Request 1 — Health Check**
- Method: `GET`
- URL: `http://localhost:5000/health`
- Expected: `{ "status": "ok", "db": "connected" }`

---

**Request 2 — Get All Products**
- Method: `GET`
- URL: `http://localhost:5000/api/products`
- Expected: `{ "success": true, "count": 5, "data": [...] }`

---

**Request 3 — Get Single Product**
- Method: `GET`
- URL: `http://localhost:5000/api/products/PASTE_AN_ID_FROM_REQUEST_2`
- Expected: `{ "success": true, "data": { ... } }`

---

**Request 4 — Create Product**
- Method: `POST`
- URL: `http://localhost:5000/api/products`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "productName": "Test Lime Pickle",
  "sku": "HS-LME-PCK-01",
  "category": "pickle",
  "unitSize": "200g Jar",
  "baseShelfLifeDays": 240
}
```
- Expected: `201 Created`

---

**Request 5 — Update Product**
- Method: `PUT`
- URL: `http://localhost:5000/api/products/PASTE_AN_ID`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "predictedShelfLifeDays": 220,
  "riskLevel": "LOW"
}
```
- Expected: `200 OK` with updated product

---

**Request 6 — Run AI Analysis**
- Method: `POST`
- URL: `http://localhost:5000/api/shelf-life/analyse`
- Headers: `Content-Type: application/json`
- Body (raw JSON) — paste a real `_id` from Request 2 as `productId`:
```json
{
  "productIdentity": {
    "productName": "Traditional Mango Pickle",
    "productId": "PASTE_REAL_PRODUCT_ID_HERE",
    "sku": "HS-MNG-PCK-01",
    "category": "pickle",
    "batchReference": "BATCH-2026-042",
    "analysisDate": "2026-06-25"
  },
  "sourcing": {
    "primaryIngredient": "raw_mango",
    "farmerName": "Kamla Negi",
    "village": "Munsiyari",
    "district": "Pithoragarh",
    "altitudeMetres": 2200,
    "harvestDate": "2026-04-01",
    "transportDistanceKm": 185,
    "storageBeforeDelivery": "same_day"
  },
  "ingredients": {
    "saltPercent": 9,
    "oilPercent": 18,
    "vinegarPercent": 3,
    "sugarPercent": 0,
    "turmericPercent": 2,
    "otherSpices": "Fenugreek 1.5%",
    "moisturePercent": 25,
    "waterActivity": "not_sure"
  },
  "processing": {
    "method": "boiled",
    "durationValue": 2,
    "durationUnit": "hours",
    "temperatureCelsius": 90,
    "heatTreatedBeforeSealing": true,
    "phLevel": "3_5_4_5"
  },
  "packaging": {
    "packagingType": "glass_jar",
    "isAirtight": true,
    "sealedStorageCondition": "room_temp_dry",
    "afterOpeningStorage": "refrigerated",
    "storageHumidity": "moderate",
    "distributionChannels": ["local_market", "city_retail"]
  },
  "notes": {
    "staffObservations": "Batch made just after monsoon",
    "knownIssues": []
  }
}
```
- Expected: `200 OK` with full Gemini shelf life analysis

---

**Request 7 — Analysis History**
- Method: `GET`
- URL: `http://localhost:5000/api/shelf-life/history?product=PASTE_PRODUCT_ID&limit=5&page=1`
- Expected: `{ "success": true, "count": 1, "total": 1, "data": [...] }`

---

### Step 5.4 — Export Postman Collection

In Postman:
1. Right-click the collection → **Export**
2. Format: **Collection v2.1**
3. Save as `HimShakti-Intern1-API.postman_collection.json` in your project root

> ⚠️ This file is in `.gitignore` — do NOT commit it. Keep it locally for demo.

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## PHASE 6 — FRONTEND INTEGRATION
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### Step 6.1 — Configure Vite Proxy

Open `himshakti-shelf-life/vite.config.js` and update:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
```

This means any request to `/api/...` from the frontend will be forwarded to the backend at port 5000. No CORS issues.

---

### Step 6.2 — Fetch Products from API in the Form

In the frontend form component (wherever the product dropdown is), replace any hardcoded product list:

```javascript
// In your form component
const [products, setProducts] = useState([]);

useEffect(() => {
  fetch('/api/products')
    .then(res => res.json())
    .then(data => {
      if (data.success) setProducts(data.data);
    })
    .catch(err => console.error('Failed to fetch products:', err));
}, []);
```

When user selects a product from dropdown, store its `_id`:

```javascript
const handleProductSelect = (product) => {
  setFormData(prev => ({
    ...prev,
    productIdentity: {
      ...prev.productIdentity,
      productId: product._id,          // CRITICAL — needed for write-back
      productName: product.productName,
      sku: product.sku,
      category: product.category
    }
  }));
};
```

---

### Step 6.3 — Wire the Analyse Button

```javascript
const [loading, setLoading] = useState(false);
const [result, setResult] = useState(null);
const [error, setError] = useState(null);

const handleAnalyse = async () => {
  setLoading(true);
  setError(null);

  try {
    const response = await fetch('/api/shelf-life/analyse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Analysis failed');
    }

    setResult(data.data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

In your JSX:
```jsx
<button onClick={handleAnalyse} disabled={loading}>
  {loading ? '🤖 AI is analysing your product...' : '🔬 Analyse Shelf Life'}
</button>

{error && <div className="error-toast">❌ {error}</div>}

{result && (
  <div className="result-card">
    <h2>Shelf Life: {result.sealed_shelf_life.duration_display}</h2>
    <p>Best Before: {result.sealed_shelf_life.best_before_date}</p>
    <p>{result.label_ready_text}</p>
  </div>
)}
```

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## FINAL CHECKLIST — EXECUTE IN THIS ORDER
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| # | Task | Done |
|---|---|---|
| 1 | Create Atlas cluster + database user + whitelist IP | ☐ |
| 2 | Copy MongoDB URI → replace `<password>` → add `/himshakti` to URI | ☐ |
| 3 | Get Gemini API key from aistudio.google.com | ☐ |
| 4 | Message Intern 2 to confirm DB name is `himshakti` | ☐ |
| 5 | Create `.gitignore` | ☐ |
| 6 | Create `.env` with real credentials | ☐ |
| 7 | Create `.env.example` with placeholder values | ☐ |
| 8 | `npm init -y` + install all dependencies | ☐ |
| 9 | Create all folder structure (`mkdir src\config` etc.) | ☐ |
| 10 | Write FILE 1 — `src/config/db.js` | ☐ |
| 11 | Write FILE 2 — `src/models/Product.model.js` | ☐ |
| 12 | Write FILE 3 — `src/models/Analysis.model.js` | ☐ |
| 13 | Write FILE 4 — `src/middleware/errorHandler.js` | ☐ |
| 14 | Write FILE 5 — `src/middleware/cors.js` | ☐ |
| 15 | Write FILE 6 — `src/middleware/rateLimiter.js` | ☐ |
| 16 | Write FILE 7 — `src/services/geminiService.js` | ☐ |
| 17 | Write FILE 8 — `src/utils/promptBuilder.js` | ☐ |
| 18 | Write FILE 9 — `src/validators/shelfLife.validator.js` | ☐ |
| 19 | Write FILE 10 — `src/controllers/products.controller.js` | ☐ |
| 20 | Write FILE 11 — `src/controllers/shelfLife.controller.js` | ☐ |
| 21 | Write FILE 12 — `src/routes/products.routes.js` | ☐ |
| 22 | Write FILE 13 — `src/routes/shelfLife.routes.js` | ☐ |
| 23 | Write FILE 14 — `src/scripts/seedProducts.js` | ☐ |
| 24 | Write FILE 15 — `server.js` | ☐ |
| 25 | Update FILE 16 — `shared/schemas/product.schema.js` to v2.0 | ☐ |
| 26 | Comment on Intern 2's GitHub Issue #1 to acknowledge schema change | ☐ |
| 27 | `npm run seed` → verify 5 products in Atlas UI | ☐ |
| 28 | `npm run dev` → verify server starts, `/health` returns `"db": "connected"` | ☐ |
| 29 | Test all 7 endpoints in Postman (in order) | ☐ |
| 30 | Export Postman collection as JSON | ☐ |
| 31 | Update `vite.config.js` with API proxy | ☐ |
| 32 | Connect frontend product dropdown to `GET /api/products` | ☐ |
| 33 | Connect Analyse button to `POST /api/shelf-life/analyse` | ☐ |
| 34 | Verify loading state shows while waiting for Gemini | ☐ |
| 35 | Verify error state shows if API call fails | ☐ |

---

## 📌 SUMMARY OF YOUR 7 ENDPOINTS

| # | Method | URL | HTTP Status |
|---|---|---|---|
| 1 | GET | `/api/products` | 200 |
| 2 | GET | `/api/products/:id` | 200 / 404 |
| 3 | POST | `/api/products` | 201 / 400 |
| 4 | PUT | `/api/products/:id` | 200 / 404 |
| 5 | DELETE | `/api/products/:id` | 200 / 404 |
| 6 | POST | `/api/shelf-life/analyse` | 200 / 400 / 404 / 500 |
| 7 | GET | `/api/shelf-life/history` | 200 / 400 |

---

> 📌 *This single file supersedes all previous spec documents for Week 4.*
> 📌 *Every file is written here. Follow Phase 1 → 2 → 3 → 4 → 5 → 6 in order.*
> 📌 *Do not skip Phase 1 (Atlas setup) — without it, Phase 5 will fail.*
