# 🔧 CORRECTED & PRODUCTION-HARDENED BACKEND PROMPT — INTERN 1
## HimShakti AI Shelf Life Prediction System — Week 4 Backend
> **Authority:** Tech Lead / Project Supervisor
> **Issued:** 2026-06-25
> **Supersedes:** `backend-api-spec-intern1.md` (your self-written roadmap)
> **Action Required:** Read every section. Your original roadmap has 7 critical bugs that will break the MongoDB connection and the shared DB contract with Intern 2.

---

## 🚨 SECTION 0 — CRITICAL FIXES BEFORE YOU WRITE ANY CODE

Your `backend-api-spec-intern1.md` was reviewed by the tech lead. Here are the **7 errors that will break production** if you follow the original document as written.

---

### ❌ BUG 1 — `productName: unique: true` Will Crash Atlas

**Your original code:**
```javascript
productName: { type: String, required: true, unique: true, trim: true }
```

**Why it breaks:** If Intern 2's batch system or your seed script ever tries to insert a product with a name that already exists, MongoDB throws `E11000 duplicate key error`. This silently kills the entire batch creation flow on Intern 2's side. Product names are NOT guaranteed globally unique — `sku` is the unique identifier.

**Correct code:**
```javascript
productName: { type: String, required: true, trim: true }   // NO unique here
sku:         { type: String, required: true, unique: true, uppercase: true, trim: true }
```

---

### ❌ BUG 2 — `riskLevel` enum with `null` is Invalid Mongoose Syntax

**Your original code:**
```javascript
riskLevel: { type: String, default: null, enum: ['LOW', 'MEDIUM', 'HIGH', null] }
```

**Why it breaks:** Mongoose schema enums do not accept `null` as a valid enum value. Every product created with `riskLevel: null` will throw a `ValidatorError: riskLevel: null is not a valid enum value`. This breaks `POST /api/products` and the seed script immediately.

**Correct code:**
```javascript
riskLevel: {
  type: String,
  default: null,
  enum: { values: ['LOW', 'MEDIUM', 'HIGH'], message: '{VALUE} is not a valid risk level' },
  validate: {
    validator: function(v) { return v === null || ['LOW', 'MEDIUM', 'HIGH'].includes(v); },
    message: 'riskLevel must be LOW, MEDIUM, HIGH, or null'
  }
}
```

---

### ❌ BUG 3 — No `.env.example` = You Will Commit Real Credentials

**What's missing:** Your roadmap defines `.env` but never creates `.env.example`. Without `.env.example` committed to Git:
- Intern 2 has no idea what environment variables your backend expects
- You risk accidentally committing your real `MONGODB_URI` and leaking the Atlas password

**Action required — create this file and commit it:**
```
# .env.example — commit this file. NEVER commit .env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/himshakti?retryWrites=true&w=majority
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
NODE_ENV=development
```

**Also create `.gitignore` right now:**
```
node_modules/
.env
*.postman_collection.json
dist/
.DS_Store
```

---

### ❌ BUG 4 — `db.js` Has No Reconnection Logic — Atlas Will Time Out

**Your original code:**
```javascript
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}
```

**Why it breaks:** MongoDB Atlas free tier closes idle connections after ~30 seconds. When your Express server is idle and the frontend sends a request, you get `MongoNotConnectedError` and the API returns 500 with no explanation. There are no reconnection listeners.

**Correct `backend/src/config/db.js`:**
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

// Reconnection event listeners — MANDATORY for Atlas free tier
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected. Attempting reconnect...');
  setTimeout(connectDB, 5000);
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err.message);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed on app termination');
  process.exit(0);
});

module.exports = { connectDB };
```

---

### ❌ BUG 5 — Gemini Call Has No Timeout — Will Hang the Server

**Your original Gemini service:**
```javascript
const result = await model.generateContent(promptText);
```

**Why it breaks:** Gemini API can take 8–20 seconds on a cold request. On Atlas free tier with Render free tier, this compounds. If Gemini hangs, Express holds the connection open for ~2 minutes, blocking the event loop for any other requests. Your entire API becomes unresponsive.

**Correct `backend/src/services/geminiService.js`:**
```javascript
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const GEMINI_TIMEOUT_MS = 25000; // 25 seconds max

async function analyseShelfLife(promptText) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // Race between Gemini call and timeout
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Gemini API timed out after 25 seconds')), GEMINI_TIMEOUT_MS)
  );

  const geminiPromise = model.generateContent(promptText);

  const result = await Promise.race([geminiPromise, timeoutPromise]);
  const text = result.response.text();

  // Extract JSON block from response
  const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/);
  if (!jsonMatch) {
    throw new Error('Gemini response did not contain a valid JSON block');
  }

  try {
    return JSON.parse(jsonMatch[1].trim());
  } catch (parseError) {
    throw new Error(`Failed to parse Gemini JSON response: ${parseError.message}`);
  }
}

module.exports = { analyseShelfLife };
```

---

### ❌ BUG 6 — `POST /api/shelf-life/analyse` Must NOT Call `PUT /api/products/:id` Internally via HTTP

**Your original spec says:**
> "After a successful analysis, this endpoint MUST also call `PUT /api/products/:id` internally"

**Why it breaks:** Controllers must never make HTTP calls to their own API routes. This creates a circular dependency, breaks when the port changes, adds unnecessary network overhead, and violates the separation-of-concerns principle.

**Correct pattern — call the Mongoose model directly in the controller:**
```javascript
// In shelfLife.controller.js — after Gemini returns the result
const { predictedShelfLifeDays, riskLevel } = geminiResult;

// Write back directly using the model — NOT via HTTP
await Product.findByIdAndUpdate(
  req.body.productIdentity.productId,
  { predictedShelfLifeDays, riskLevel },
  { new: true, runValidators: true }
);
```

---

### ❌ BUG 7 — `GET /api/shelf-life/history` Has No `Analysis` Model Defined Anywhere

**What's missing:** Your spec defines this endpoint but the `Analysis.model.js` file is completely absent from the folder structure and from every step. Intern builds the route, calls `Analysis.find(...)`, gets `ReferenceError: Analysis is not defined`, and wastes 2 hours debugging.

**Required — create `backend/src/models/Analysis.model.js`:**
```javascript
const mongoose = require('mongoose');

const AnalysisSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true        // needed for fast history queries
  },
  batchReference: { type: String, required: true },
  analysisDate:   { type: Date, default: Date.now },
  formSnapshot:   { type: mongoose.Schema.Types.Mixed }, // full 35-field input stored as-is
  geminiResult:   { type: mongoose.Schema.Types.Mixed }, // full Gemini response stored as-is
  predictedShelfLifeDays: { type: Number },
  riskLevel:      { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: null }
}, { timestamps: true });

module.exports = mongoose.model('Analysis', AnalysisSchema);
```

> This collection is **owned exclusively by Intern 1** — it is NOT in the shared schema contract and does not need a 24-hour notice to change.

---

## 🏗️ SECTION 1 — CORRECTED FOLDER STRUCTURE

```
backend/
├── src/
│   ├── config/
│   │   └── db.js                     ← FIXED — includes reconnect listeners
│   ├── models/
│   │   ├── Product.model.js           ← FIXED — correct enum and unique fields
│   │   └── Analysis.model.js          ← NEW — was completely missing
│   ├── validators/
│   │   └── shelfLife.validator.js     ← MUST BE WRITTEN — 35-field validation rules
│   ├── controllers/
│   │   ├── products.controller.js
│   │   └── shelfLife.controller.js    ← FIXED — no internal HTTP calls
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   ├── cors.js
│   │   └── rateLimiter.js             ← NEW — mandatory for Gemini endpoint
│   ├── routes/
│   │   ├── products.routes.js
│   │   └── shelfLife.routes.js
│   ├── services/
│   │   ├── geminiService.js           ← FIXED — includes timeout guard
│   │   └── expiryCalculator.js
│   ├── scripts/
│   │   └── seedProducts.js
│   └── utils/
│       └── promptBuilder.js
├── tests/
│   └── shelfLife.test.js
├── server.js                          ← FULL CODE PROVIDED BELOW
├── package.json
├── .env                               ← NEVER COMMIT
├── .env.example                       ← NEW — MUST BE COMMITTED
└── .gitignore                         ← NEW — MUST EXIST
```

---

## 🚀 SECTION 2 — `server.js` FULL CODE (Was Never Written in Your Roadmap)

Your original document referenced `server.js` in 6 different places but never actually wrote it. Here is the complete file:

```javascript
require('dotenv').config();
const express = require('express');
const { connectDB } = require('./src/config/db');
const corsMiddleware = require('./src/middleware/cors');
const errorHandler = require('./src/middleware/errorHandler');
const { shelfLifeLimiter } = require('./src/middleware/rateLimiter');

// Route imports
const productRoutes = require('./src/routes/products.routes');
const shelfLifeRoutes = require('./src/routes/shelfLife.routes');

const app = express();

// --- Middleware ---
app.use(corsMiddleware);
app.use(express.json({ limit: '10kb' }));       // Body size limit — prevents large payload attacks
app.use(express.urlencoded({ extended: false }));

// --- Health check (never requires auth) ---
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'himshakti-shelf-life-api',
    timestamp: new Date().toISOString(),
    db: require('mongoose').connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// --- Routes ---
app.use('/api/products', productRoutes);
app.use('/api/shelf-life', shelfLifeLimiter, shelfLifeRoutes);  // Rate limiter on AI route only

// --- 404 handler ---
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.method} ${req.path} not found` });
});

// --- Global error handler (MUST be last) ---
app.use(errorHandler);

// --- Start server ---
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/health`);
  });
});
```

---

## 🛡️ SECTION 3 — RATE LIMITER (Was Completely Missing)

**Without this, one person can spam `POST /api/shelf-life/analyse` and drain your entire Gemini free API quota in minutes.**

Install:
```bash
npm install express-rate-limit helmet
```

Create `backend/src/middleware/rateLimiter.js`:
```javascript
const rateLimit = require('express-rate-limit');

const shelfLifeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minute window
  max: 10,                      // max 10 Gemini calls per IP per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many analysis requests. Please wait 15 minutes before trying again.'
  }
});

module.exports = { shelfLifeLimiter };
```

Also add `helmet` to `server.js` (security headers):
```javascript
const helmet = require('helmet');
app.use(helmet());  // Add this BEFORE other middleware
```

---

## ✅ SECTION 4 — CORRECTED `Product.model.js` (Full, Final Version)

```javascript
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
    // NO unique: true here — sku is the unique identifier
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
    enum: { values: ['snack', 'juice', 'pickle'], message: '{VALUE} is not a valid category' }
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
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for fast active-product queries (used by frontend dropdown)
ProductSchema.index({ isActive: 1, category: 1 });

module.exports = mongoose.model('Product', ProductSchema);
```

---

## 📋 SECTION 5 — CORS FIX (Remove Unnecessary `credentials: true`)

**Your original:**
```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT'],
  credentials: true   // ❌ NOT NEEDED — you have no cookies or sessions
}));
```

**`credentials: true` is only for cookie/session-based auth.** This project uses no cookies. Having it set can cause unexpected preflight failures.

Create `backend/src/middleware/cors.js`:
```javascript
const cors = require('cors');

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL   // for production deployment on Vercel
].filter(Boolean);

module.exports = cors({
  origin: function (origin, callback) {
    // Allow Postman and server-to-server calls (no origin)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: Origin ${origin} not allowed`));
    }
  },
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization']
  // NO credentials: true
});
```

Also add `FRONTEND_URL=` (blank) to your `.env.example`.

---

## 📋 SECTION 6 — UPDATED WEEK 4 CHECKLIST (Corrected + Expanded)

| # | Task | Priority | Status |
|---|---|---|---|
| 1 | Create `.gitignore` with `node_modules/`, `.env`, `*.postman_collection.json` | 🔴 BLOCKING | ☐ |
| 2 | Create `.env.example` and commit it | 🔴 BLOCKING | ☐ |
| 3 | Update `shared/schemas/product.schema.js` to v2.0 | 🔴 BLOCKING | ☐ |
| 4 | Comment on Intern 2's GitHub Issue #1 to acknowledge schema reconciliation | 🔴 BLOCKING | ☐ |
| 5 | `npm init -y` + install: `express cors dotenv mongoose express-validator express-rate-limit helmet @google/generative-ai` | 🔴 BLOCKING | ☐ |
| 6 | `npm install --save-dev nodemon` | 🟠 HIGH | ☐ |
| 7 | Write `server.js` using the FULL CODE from Section 2 above | 🔴 BLOCKING | ☐ |
| 8 | Write `src/config/db.js` with reconnection listeners (Section 0, Bug 4) | 🔴 BLOCKING | ☐ |
| 9 | Write `Product.model.js` using CORRECTED version from Section 4 | 🔴 BLOCKING | ☐ |
| 10 | Write `Analysis.model.js` — was completely missing (Section 0, Bug 7) | 🔴 BLOCKING | ☐ |
| 11 | Run `seedProducts.js` — confirm 5 products visible in Atlas UI | 🔴 BLOCKING | ☐ |
| 12 | Confirm Atlas DB name is `himshakti` with Intern 2 — share URI privately | 🔴 BLOCKING | ☐ |
| 13 | Write `rateLimiter.js` middleware (Section 3) | 🟠 HIGH | ☐ |
| 14 | Write `cors.js` middleware with corrected config (Section 5) | 🟠 HIGH | ☐ |
| 15 | Write `errorHandler.js` middleware | 🟠 HIGH | ☐ |
| 16 | Write `geminiService.js` with timeout guard (Section 0, Bug 5) | 🔴 BLOCKING | ☐ |
| 17 | Write `promptBuilder.js` utility | 🟠 HIGH | ☐ |
| 18 | Write `shelfLife.validator.js` with express-validator rules for all required fields | 🟠 HIGH | ☐ |
| 19 | Implement all 6 REST endpoints (controllers + routes) | 🔴 BLOCKING | ☐ |
| 20 | Fix `shelfLife.controller.js` to write back to Product using Mongoose directly — NOT via internal HTTP call (Section 0, Bug 6) | 🔴 BLOCKING | ☐ |
| 21 | Test all 6 endpoints in Postman | 🔴 BLOCKING | ☐ |
| 22 | Verify `/health` endpoint returns `"db": "connected"` | 🟠 HIGH | ☐ |
| 23 | Export Postman collection as JSON — DO NOT commit (add to `.gitignore`) | 🟡 MEDIUM | ☐ |
| 24 | Connect frontend dropdown to `GET /api/products` | 🟠 HIGH | ☐ |
| 25 | Connect Analyse button to `POST /api/shelf-life/analyse` with loading state | 🟠 HIGH | ☐ |
| 26 | Configure Vite proxy in `vite.config.js` | 🟠 HIGH | ☐ |
| 27 | Document the Week 4 deviation (skipping in-memory, going direct to Atlas) in your PR description | 🟡 MEDIUM | ☐ |

---

## 🔗 SECTION 7 — DEPENDENCY INSTALL REFERENCE (Complete, Corrected)

```bash
cd backend
npm init -y
npm install express cors dotenv mongoose express-validator express-rate-limit helmet @google/generative-ai
npm install --save-dev nodemon
```

Final `package.json` scripts:
```json
"scripts": {
  "dev": "nodemon server.js",
  "start": "node server.js",
  "seed": "node src/scripts/seedProducts.js"
}
```

---

## 📌 SECTION 8 — SHARED DB CONTRACT REMINDER

> You and Intern 2 are writing to the **same MongoDB Atlas cluster, same `himshakti` database**.
>
> **Collections you OWN (you can change freely):**
> - `analyses` — your Analysis history collection
>
> **Collections that are SHARED CONTRACT (24-hour notice required for ANY change):**
> - `products` — both interns read and write this
>
> Any change to `products` collection field names, types, or indexes MUST be posted as a GitHub Issue in Intern 2's repo BEFORE you push to Atlas. This is not optional.

---

> 📌 *Issued by Tech Lead — TBI-GEU Summer Internship 2026*
> 📌 *This document supersedes `backend-api-spec-intern1.md` entirely*
> 📌 *All 7 bugs listed in Section 0 must be fixed before your Week 4 PR is submitted*
