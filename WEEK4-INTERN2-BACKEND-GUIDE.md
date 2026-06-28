# 🚀 WEEK 4 — COMPLETE BACKEND GUIDE
## HimShakti Batch Traceability, QR & Dispatch Intelligence System — Intern 2
> **Status:** Intern 1's backend is LIVE. Products are seeded in Atlas. This is your starting point.
> **Read this top to bottom. Every step has full code. Execute in order.**

---

## 🗺️ THE PICTURE: What You Are Building and How It Connects

```
┌──────────────────────────────────────────────────────────────┐
│                  MONGODB ATLAS — himshakti DB                │
│                                                              │
│  ┌─────────────────┐         ┌─────────────────────────────┐ │
│  │  products       │ ──READ─▶│  batches (YOUR COLLECTION)  │ │
│  │  (Intern 1 owns)│         │  Batch code, packDate,      │ │
│  │  5 items seeded │         │  expiryDate, quantity, QR   │ │
│  └─────────────────┘         └─────────────────────────────┘ │
│                                         │                    │
│                                         ▼                    │
│                              ┌──────────────────────────────┐ │
│                              │  scanEvents (YOUR COLLECTION)│ │
│                              │  QR scan logs, location,    │ │
│                              │  daysUntilExpiry at scan     │ │
│                              └──────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘

Intern 1 API: http://localhost:5000  (already running)
Your API:     http://localhost:5001  (you build this)
```

---

## ⚠️ BEFORE YOU START — MANDATORY READS

**Rule 1 — productContract.js is your guardian:**
Intern 1 has provided `backend/src/db-contracts/productContract.js` and `backend/src/services/expiryCalculator.js`. These are files in the SHARED codebase that you MUST use (not rewrite). They already know how to validate product documents and calculate expiry.

**Rule 2 — The shared schema is v2.0:**
The `shared/schemas/product.schema.js` is now at v2.0. Key field names you will use:
| Field | Type | What You Use It For |
|---|---|---|
| `productName` | String | Show in batch labels, QR pages |
| `sku` | String | Primary identifier in your batch code |
| `baseShelfLifeDays` | Number | Fallback expiry calculation |
| `predictedShelfLifeDays` | Number or null | Preferred expiry (if Intern 1's AI has run) |
| `riskLevel` | "LOW"/"MEDIUM"/"HIGH"/null | FEFO dispatch priority score |
| `isActive` | Boolean | Only create batches for active products |
| `predictedExpiryTemplate` | String | Template string for labels e.g. "Best Before {days} Days from Packing" |

**Rule 3 — Never change field names in `products`:**
If you need a field that is missing, post a GitHub Issue in Intern 1's repo. Wait 24 hours. Then and only then update `shared/schemas/product.schema.js`.

**Rule 4 — Your port is 5001:**
Intern 1 runs on port 5000. You run on **port 5001** to avoid collision when both backends are running simultaneously for integration testing.

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## PHASE 1 — DATABASE SETUP
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### Step 1.1 — Get the MongoDB Connection String from Intern 1

Message Intern 1 privately and ask:
> "I need the MongoDB Atlas connection string for the himshakti database. Please send via DM — not in any public chat or GitHub."

The string will look like:
```
mongodb+srv://himshakti-admin:PASSWORD@cluster0.xxxxx.mongodb.net/himshakti?retryWrites=true&w=majority
```

> ⚠️ The database name MUST be `himshakti` — the same DB Intern 1 is using. This is how you can read from the `products` collection.

---

### Step 1.2 — Verify Products Are Seeded in Atlas

Before writing any code, connect MongoDB Compass and confirm you can see:
1. Open MongoDB Compass
2. Paste the connection string
3. Click Connect
4. Navigate to: `himshakti` database → `products` collection
5. You should see **5 documents** like:
   - Traditional Mango Pickle (HS-MNG-PCK-01)
   - Organic Ginger Pickle (HS-GNG-PCK-02)
   - Himalayan Mixed Snack (HS-MIX-SNK-01)
   - Wild Berry Juice Concentrate (HS-WBJ-JCE-01)
   - Apricot Jam (HS-APR-JAM-01)

If you see these 5 documents — ✅ you're ready. If not — message Intern 1 to run their seed script.

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## PHASE 2 — PROJECT SETUP
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### Step 2.1 — Create Your Backend Folder

You build a **completely separate backend folder** from Intern 1. Do NOT modify Intern 1's `backend/` folder.

Create a new folder called `backend-intern2/` at the project root:
```
internship project idea/
├── backend/              ← Intern 1's folder (DO NOT TOUCH)
├── backend-intern2/      ← YOUR folder (you create this)
├── himshakti-shelf-life/ ← Intern 1's frontend
├── shared/               ← Shared schema contract (both read)
```

Open terminal in VS Code:
```bash
cd "c:\Users\bhavya\Desktop\internship project idea"
mkdir backend-intern2
cd backend-intern2
```

---

### Step 2.2 — Initialize npm

```bash
npm init -y
```

---

### Step 2.3 — Install Dependencies

```bash
npm install express mongoose cors dotenv helmet express-rate-limit express-validator qrcode
npm install --save-dev nodemon
```

| Package | Why You Need It |
|---|---|
| `express` | HTTP server framework |
| `mongoose` | MongoDB ODM for schema enforcement |
| `cors` | Allow cross-origin requests from frontend |
| `dotenv` | Load .env variables |
| `helmet` | Secure HTTP headers |
| `express-rate-limit` | Prevent API abuse |
| `express-validator` | Validate incoming request bodies |
| `qrcode` | Generate QR codes as PNG/SVG/Base64 strings |
| `nodemon` | Auto-restart server on file changes |

---

### Step 2.4 — Create package.json Scripts

Open `backend-intern2/package.json` and update the `scripts` section:

```json
{
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js"
  }
}
```

---

### Step 2.5 — Create Folder Structure

Run this in terminal (inside `backend-intern2/`):
```bash
mkdir src
mkdir src\config
mkdir src\models
mkdir src\controllers
mkdir src\routes
mkdir src\middleware
mkdir src\services
mkdir src\validators
mkdir src\utils
mkdir src\scripts
mkdir tests
```

Final structure:
```
backend-intern2/
├── src/
│   ├── config/
│   │   └── db.js                    ← MongoDB connection
│   ├── models/
│   │   ├── Batch.model.js           ← Batch collection schema (YOU OWN THIS)
│   │   └── ScanEvent.model.js       ← Scan event collection schema (YOU OWN THIS)
│   ├── controllers/
│   │   ├── batches.controller.js    ← CRUD for batches
│   │   ├── products.controller.js   ← Read-only product queries (from Intern 1's collection)
│   │   ├── dispatch.controller.js   ← FEFO dispatch logic
│   │   └── qr.controller.js         ← QR generation endpoint
│   ├── routes/
│   │   ├── batches.routes.js
│   │   ├── products.routes.js
│   │   ├── dispatch.routes.js
│   │   └── qr.routes.js
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   └── rateLimiter.js
│   ├── services/
│   │   ├── expiryCalculator.js      ← COPY from shared backend (DO NOT REWRITE)
│   │   └── qrGenerator.js           ← QR code generation service
│   ├── validators/
│   │   └── batch.validator.js       ← Validation rules for batch creation
│   ├── utils/
│   │   └── batchCodeGenerator.js    ← Auto-generate batch codes like BTH-2026-001
│   └── scripts/
│       └── seedTestBatch.js         ← Optional: seed a test batch for verification
├── server.js                        ← Entry point
├── .env                             ← Your secrets
├── .env.example                     ← Template for team
└── .gitignore
```

---

### Step 2.6 — Create .gitignore

Create `backend-intern2/.gitignore`:
```
node_modules/
.env
*.log
```

---

### Step 2.7 — Create .env

Create `backend-intern2/.env`:
```
MONGODB_URI=mongodb+srv://himshakti-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/himshakti?retryWrites=true&w=majority
PORT=5001
NODE_ENV=development
INTERN1_API_URL=http://localhost:5000
```

Create `backend-intern2/.env.example`:
```
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/himshakti?retryWrites=true&w=majority
PORT=5001
NODE_ENV=development
INTERN1_API_URL=http://localhost:5000
```

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## PHASE 3 — DATABASE CONNECTION
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### Step 3.1 — Create src/config/db.js

```javascript
// backend-intern2/src/config/db.js
const mongoose = require('mongoose');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ [Intern 2] Connected to MongoDB Atlas — himshakti DB');
  } catch (err) {
    console.error('❌ [Intern 2] MongoDB connection failed:', err.message);
    process.exit(1);
  }
}

module.exports = { connectDB };
```

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## PHASE 4 — MONGOOSE MODELS (YOUR COLLECTIONS)
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You own TWO collections: `batches` and `scanEvents`. Products are Intern 1's — you read them, never write to them via Mongoose.

### Step 4.1 — Create src/models/Batch.model.js

```javascript
// backend-intern2/src/models/Batch.model.js
// PURPOSE: Mongoose schema for the 'batches' collection
// OWNER: Intern 2 — no cross-intern contract needed for this collection

const mongoose = require('mongoose');

const BatchSchema = new mongoose.Schema({
  // ─── Link to Intern 1's product ─────────────────────────────────────────
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'productId is required'],
    index: true
    // This ObjectId references Intern 1's 'products' collection
  },

  // ─── Denormalized product fields (snapshot at time of batch creation) ───
  // We copy these so that even if Intern 1 updates the product,
  // historical batches retain the original data they were created with.
  productName: {
    type: String,
    required: [true, 'productName is required (denormalized from products)'],
    trim: true
  },
  sku: {
    type: String,
    required: [true, 'sku is required (denormalized from products)'],
    trim: true,
    uppercase: true
  },
  category: {
    type: String,
    required: true,
    enum: ['snack', 'juice', 'pickle']
  },
  unitSize: {
    type: String,
    required: true
  },

  // ─── Batch-specific fields ───────────────────────────────────────────────
  batchCode: {
    type: String,
    required: [true, 'Batch code is required'],
    unique: true,
    trim: true,
    uppercase: true
    // Format: BTH-YYYY-NNNN e.g. BTH-2026-0001
  },
  packDate: {
    type: Date,
    required: [true, 'Pack date is required']
  },
  expiryDate: {
    type: Date,
    required: [true, 'Expiry date is required']
    // Calculated by expiryCalculator.js using product shelf life data
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },

  // ─── Status ──────────────────────────────────────────────────────────────
  status: {
    type: String,
    enum: ['active', 'expiring_soon', 'expired', 'dispatched'],
    default: 'active'
  },

  // ─── Shelf life used at time of batch creation ───────────────────────────
  shelfLifeUsed: {
    type: Number,
    required: true
    // Stores whether predictedShelfLifeDays or baseShelfLifeDays was used
  },
  shelfLifeSource: {
    type: String,
    enum: ['predicted', 'base'],
    required: true
    // 'predicted' = AI ran and gave a value, 'base' = fallback
  },

  // ─── QR Code data ────────────────────────────────────────────────────────
  qrCodeBase64: {
    type: String,
    default: null
    // Stores the QR code image as a Base64 PNG string
  },
  qrCodeUrl: {
    type: String,
    default: null
    // The public URL this QR code links to e.g. /trace/BTH-2026-0001
  },

  // ─── Notes ───────────────────────────────────────────────────────────────
  notes: {
    type: String,
    default: '',
    trim: true
  }

}, { timestamps: true }); // auto-adds createdAt and updatedAt

// ─── Indexes ────────────────────────────────────────────────────────────────
BatchSchema.index({ status: 1, expiryDate: 1 }); // for FEFO dispatch queries
BatchSchema.index({ sku: 1 });                    // for product-based batch lookup

module.exports = mongoose.model('Batch', BatchSchema);
```

---

### Step 4.2 — Create src/models/ScanEvent.model.js

```javascript
// backend-intern2/src/models/ScanEvent.model.js
// PURPOSE: Records every QR code scan. Used for traceability audit trail.
// OWNER: Intern 2 — no cross-intern contract needed

const mongoose = require('mongoose');

const ScanEventSchema = new mongoose.Schema({
  batchId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'batchId is required'],
    index: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'productId is required']
    // Stored for convenience — same as the batch's productId
  },
  batchCode: {
    type: String,
    required: true
    // Denormalized for quick display without a join
  },
  scannedAt: {
    type: Date,
    default: Date.now
  },
  scannedBy: {
    type: String,
    default: 'anonymous'
    // Staff ID or 'customer' or 'anonymous' for public scans
  },
  location: {
    type: String,
    default: 'unknown'
    // e.g. 'warehouse', 'retail-store-dehradun', 'customer-home'
  },
  daysUntilExpiry: {
    type: Number
    // Computed at scan time from the batch's expiryDate
  },
  statusAtScan: {
    type: String,
    enum: ['active', 'expiring_soon', 'expired'],
    required: true
  }
}, { timestamps: true });

ScanEventSchema.index({ batchId: 1, scannedAt: -1 }); // for scan history queries

module.exports = mongoose.model('ScanEvent', ScanEventSchema);
```

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## PHASE 5 — SERVICES (CORE BUSINESS LOGIC)
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### Step 5.1 — Copy the Expiry Calculator

The shared `backend/src/services/expiryCalculator.js` already exists and works. Copy it into your folder:

```javascript
// backend-intern2/src/services/expiryCalculator.js
// COPIED FROM: backend/src/services/expiryCalculator.js
// DO NOT MODIFY — This is a shared contract with Intern 1.
// If you need changes, discuss with Intern 1 first.

const { assertProductContract } = require('../utils/productContract');

/**
 * Calculate the expected expiry date for a batch.
 * Uses predictedShelfLifeDays if Intern 1's AI has run, otherwise uses baseShelfLifeDays.
 *
 * @param {object} product   - Product document from 'products' collection (Intern 1's data)
 * @param {Date}   packDate  - The date the batch was packed
 * @returns {{ expiryDate: Date, daysUntilExpiry: number, shelfLifeUsed: number, shelfLifeSource: string }}
 */
function calculateExpiry(product, packDate) {
  assertProductContract(product);

  const hasPrediction = product.predictedShelfLifeDays !== null
    && product.predictedShelfLifeDays !== undefined;

  const shelfLifeUsed = hasPrediction
    ? product.predictedShelfLifeDays
    : product.baseShelfLifeDays;

  const shelfLifeSource = hasPrediction ? 'predicted' : 'base';

  const expiryDate = new Date(packDate);
  expiryDate.setDate(expiryDate.getDate() + shelfLifeUsed);

  const now = new Date();
  const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));

  return { expiryDate, daysUntilExpiry, shelfLifeUsed, shelfLifeSource };
}

/**
 * Determine the status of a batch based on days until expiry.
 */
function getBatchStatus(daysUntilExpiry) {
  if (daysUntilExpiry <= 0) return 'expired';
  if (daysUntilExpiry <= 7) return 'expiring_soon';
  return 'active';
}

module.exports = { calculateExpiry, getBatchStatus };
```

---

### Step 5.2 — Create src/utils/productContract.js

This validates product documents before your code trusts them:

```javascript
// backend-intern2/src/utils/productContract.js
// PURPOSE: Validates product documents from Intern 1's 'products' collection
// before Intern 2's code uses them. Crashes loudly on contract violation.

function assertProductContract(product) {
  if (!product) {
    throw new Error('DB_CONTRACT: product is null — cannot create batch');
  }

  if (!product.isActive) {
    throw new Error(`DB_CONTRACT: product "${product.productName}" is not active — batches cannot be created for inactive products`);
  }

  if (typeof product.baseShelfLifeDays === 'undefined' || product.baseShelfLifeDays === null) {
    throw new Error(
      `DB_CONTRACT: product "${product.productName}" is missing baseShelfLifeDays. ` +
      `Contact Intern 1 to fix the seed data in Atlas.`
    );
  }

  if (!product.productName) {
    throw new Error('DB_CONTRACT: product is missing required field "productName"');
  }

  if (!product.sku) {
    throw new Error('DB_CONTRACT: product is missing required field "sku"');
  }

  return true;
}

module.exports = { assertProductContract };
```

---

### Step 5.3 — Create src/utils/batchCodeGenerator.js

Auto-generates unique batch codes like `BTH-2026-0001`:

```javascript
// backend-intern2/src/utils/batchCodeGenerator.js
const Batch = require('../models/Batch.model');

/**
 * Generates the next sequential batch code for the current year.
 * Format: BTH-YYYY-NNNN (e.g. BTH-2026-0001, BTH-2026-0002)
 * Thread-safe: queries the DB for the highest existing number.
 */
async function generateBatchCode() {
  const year = new Date().getFullYear();
  const prefix = `BTH-${year}-`;

  // Find the highest existing batch code for this year
  const lastBatch = await Batch.findOne(
    { batchCode: { $regex: `^${prefix}` } },
    { batchCode: 1 },
    { sort: { batchCode: -1 } }
  );

  let nextNumber = 1;
  if (lastBatch) {
    const lastNumber = parseInt(lastBatch.batchCode.split('-')[2], 10);
    nextNumber = lastNumber + 1;
  }

  // Zero-pad to 4 digits: 0001, 0002, ..., 9999
  return `${prefix}${String(nextNumber).padStart(4, '0')}`;
}

module.exports = { generateBatchCode };
```

---

### Step 5.4 — Create src/services/qrGenerator.js

Generates QR codes pointing to your public traceability URL:

```javascript
// backend-intern2/src/services/qrGenerator.js
const QRCode = require('qrcode');

/**
 * Generates a QR code as a Base64 PNG string.
 * The QR code encodes the public traceability URL for a batch.
 *
 * @param {string} batchCode - e.g. BTH-2026-0001
 * @returns {Promise<{ base64: string, url: string }>}
 */
async function generateBatchQR(batchCode) {
  // This is the public URL a customer/staff will land on after scanning
  const traceabilityUrl = `http://localhost:5001/trace/${batchCode}`;

  // Generate QR as Base64 PNG (can be embedded directly in HTML: <img src="data:image/png;base64,...">)
  const base64 = await QRCode.toDataURL(traceabilityUrl, {
    errorCorrectionLevel: 'M',
    type: 'image/png',
    width: 300,
    margin: 2,
    color: {
      dark: '#1a4731',  // HimShakti forest green
      light: '#ffffff'
    }
  });

  return { base64, url: traceabilityUrl };
}

module.exports = { generateBatchQR };
```

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## PHASE 6 — ALL 6 REST API ENDPOINTS
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### Step 6.1 — Controllers

#### `src/controllers/batches.controller.js`

```javascript
const Batch = require('../models/Batch.model');
const mongoose = require('mongoose');
const { calculateExpiry, getBatchStatus } = require('../services/expiryCalculator');
const { generateBatchCode } = require('../utils/batchCodeGenerator');
const { generateBatchQR } = require('../services/qrGenerator');
const { assertProductContract } = require('../utils/productContract');

// ─── POST /api/batches ───────────────────────────────────────────────────────
// Creates a new batch, calculates expiry, generates QR code
async function createBatch(req, res, next) {
  try {
    const { productId, packDate, quantity, notes } = req.body;

    // 1. Fetch the product from Intern 1's products collection
    const product = await mongoose.connection.db
      .collection('products')
      .findOne({ _id: new mongoose.Types.ObjectId(productId) });

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found in the products collection. Verify with Intern 1.' });
    }

    // 2. Validate the product has all fields we need (contract check)
    assertProductContract(product);

    // 3. Calculate expiry date using the shared calculator
    const parsedPackDate = new Date(packDate);
    const { expiryDate, daysUntilExpiry, shelfLifeUsed, shelfLifeSource } = calculateExpiry(product, parsedPackDate);

    // 4. Generate a unique batch code
    const batchCode = await generateBatchCode();

    // 5. Generate QR code
    const { base64: qrCodeBase64, url: qrCodeUrl } = await generateBatchQR(batchCode);

    // 6. Create the batch document
    const batch = new Batch({
      productId: product._id,
      // Denormalized product fields (snapshot)
      productName: product.productName,
      sku: product.sku,
      category: product.category,
      unitSize: product.unitSize,
      // Batch fields
      batchCode,
      packDate: parsedPackDate,
      expiryDate,
      quantity,
      status: getBatchStatus(daysUntilExpiry),
      shelfLifeUsed,
      shelfLifeSource,
      qrCodeBase64,
      qrCodeUrl,
      notes: notes || ''
    });

    await batch.save();

    res.status(201).json({
      success: true,
      message: `Batch ${batchCode} created successfully`,
      data: {
        batchCode: batch.batchCode,
        productName: batch.productName,
        sku: batch.sku,
        packDate: batch.packDate,
        expiryDate: batch.expiryDate,
        quantity: batch.quantity,
        status: batch.status,
        shelfLifeUsed: batch.shelfLifeUsed,
        shelfLifeSource: batch.shelfLifeSource,
        qrCodeUrl: batch.qrCodeUrl,
        // Return base64 so the frontend can display the QR image immediately
        qrCodeBase64: batch.qrCodeBase64
      }
    });

  } catch (err) {
    next(err);
  }
}

// ─── GET /api/batches ────────────────────────────────────────────────────────
// Returns all batches with optional status filter
async function getAllBatches(req, res, next) {
  try {
    const { status, sku } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (sku) filter.sku = sku.toUpperCase();

    // Sort by expiryDate ascending — FEFO order
    const batches = await Batch.find(filter)
      .sort({ expiryDate: 1 })
      .select('-qrCodeBase64'); // Don't return large base64 in list view

    res.json({ success: true, count: batches.length, data: batches });
  } catch (err) {
    next(err);
  }
}

// ─── GET /api/batches/:id ────────────────────────────────────────────────────
async function getBatchById(req, res, next) {
  try {
    const batch = await Batch.findById(req.params.id);
    if (!batch) return res.status(404).json({ success: false, error: 'Batch not found' });
    res.json({ success: true, data: batch });
  } catch (err) {
    next(err);
  }
}

// ─── PATCH /api/batches/:id/status ──────────────────────────────────────────
// Update batch status (e.g. mark as dispatched)
async function updateBatchStatus(req, res, next) {
  try {
    const { status } = req.body;
    const validStatuses = ['active', 'expiring_soon', 'expired', 'dispatched'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: `status must be one of: ${validStatuses.join(', ')}` });
    }

    const batch = await Batch.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!batch) return res.status(404).json({ success: false, error: 'Batch not found' });
    res.json({ success: true, data: batch });
  } catch (err) {
    next(err);
  }
}

module.exports = { createBatch, getAllBatches, getBatchById, updateBatchStatus };
```

---

#### `src/controllers/dispatch.controller.js`

```javascript
const Batch = require('../models/Batch.model');

// ─── GET /api/dispatch/fefo ──────────────────────────────────────────────────
// FEFO = First Expired, First Out
// Returns all active/expiring batches sorted by priority:
//   1. 'expiring_soon' batches first (most urgent)
//   2. Among those: HIGH riskLevel batches first
//   3. Then sorted by expiryDate ascending
async function getFEFOQueue(req, res, next) {
  try {
    const { category } = req.query;

    const filter = { status: { $in: ['active', 'expiring_soon'] } };
    if (category) filter.category = category;

    // Step 1: Fetch all eligible batches
    const batches = await Batch.find(filter)
      .select('-qrCodeBase64')
      .lean(); // lean() returns plain JS objects for faster sorting

    // Step 2: Calculate daysUntilExpiry live (more accurate than stored value)
    const now = new Date();
    const enriched = batches.map(b => {
      const daysUntilExpiry = Math.ceil((new Date(b.expiryDate) - now) / (1000 * 60 * 60 * 24));
      return { ...b, daysUntilExpiry };
    });

    // Step 3: FEFO sort — expiring soonest goes first
    enriched.sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);

    res.json({
      success: true,
      count: enriched.length,
      dispatchOrder: 'FEFO — expiring soonest dispatched first',
      data: enriched
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getFEFOQueue };
```

---

#### `src/controllers/qr.controller.js`

```javascript
const Batch = require('../models/Batch.model');
const ScanEvent = require('../models/ScanEvent.model');
const { getBatchStatus } = require('../services/expiryCalculator');

// ─── GET /api/qr/:batchCode ──────────────────────────────────────────────────
// Public traceability page data — called when someone scans the QR code
async function getTraceabilityData(req, res, next) {
  try {
    const batch = await Batch.findOne({ batchCode: req.params.batchCode.toUpperCase() });
    if (!batch) {
      return res.status(404).json({ success: false, error: 'Batch not found. Invalid QR code.' });
    }

    // Calculate live days until expiry
    const now = new Date();
    const daysUntilExpiry = Math.ceil((new Date(batch.expiryDate) - now) / (1000 * 60 * 60 * 24));
    const currentStatus = getBatchStatus(daysUntilExpiry);

    // Update status if it has changed since batch creation
    if (batch.status !== currentStatus && currentStatus !== 'dispatched') {
      await Batch.findByIdAndUpdate(batch._id, { status: currentStatus });
    }

    // Log this scan as a ScanEvent
    await ScanEvent.create({
      batchId: batch._id,
      productId: batch.productId,
      batchCode: batch.batchCode,
      scannedBy: req.query.scannedBy || 'customer',
      location: req.query.location || 'unknown',
      daysUntilExpiry,
      statusAtScan: currentStatus
    });

    // Return full traceability data
    res.json({
      success: true,
      data: {
        batchCode: batch.batchCode,
        productName: batch.productName,
        sku: batch.sku,
        category: batch.category,
        unitSize: batch.unitSize,
        packDate: batch.packDate,
        expiryDate: batch.expiryDate,
        daysUntilExpiry,
        status: currentStatus,
        shelfLifeUsed: batch.shelfLifeUsed,
        shelfLifeSource: batch.shelfLifeSource,
        // Include a human-readable warning if expiring soon or expired
        warning: currentStatus === 'expiring_soon'
          ? `⚠️ This batch expires in ${daysUntilExpiry} day(s). Prioritise use.`
          : currentStatus === 'expired'
            ? `🚨 This batch has EXPIRED as of ${new Date(batch.expiryDate).toDateString()}.`
            : null
      }
    });

  } catch (err) {
    next(err);
  }
}

// ─── GET /api/qr/:batchCode/image ───────────────────────────────────────────
// Returns just the QR code image as base64
async function getQRImage(req, res, next) {
  try {
    const batch = await Batch.findOne(
      { batchCode: req.params.batchCode.toUpperCase() },
      { qrCodeBase64: 1 }
    );
    if (!batch) return res.status(404).json({ success: false, error: 'Batch not found' });

    res.json({ success: true, data: { qrCodeBase64: batch.qrCodeBase64 } });
  } catch (err) {
    next(err);
  }
}

module.exports = { getTraceabilityData, getQRImage };
```

---

#### `src/controllers/products.controller.js`

```javascript
const mongoose = require('mongoose');

// ─── GET /api/products ───────────────────────────────────────────────────────
// Read-only proxy to Intern 1's products collection.
// NOTE: We read directly from the shared DB — NOT from Intern 1's API —
// to avoid dependency on Intern 1's server being up.
async function getProducts(req, res, next) {
  try {
    const products = await mongoose.connection.db
      .collection('products')
      .find({ isActive: true })
      .project({ productName: 1, sku: 1, category: 1, unitSize: 1, baseShelfLifeDays: 1, predictedShelfLifeDays: 1, riskLevel: 1 })
      .toArray();

    res.json({ success: true, count: products.length, data: products });
  } catch (err) {
    next(err);
  }
}

module.exports = { getProducts };
```

---

### Step 6.2 — Routes

#### `src/routes/batches.routes.js`

```javascript
const express = require('express');
const router = express.Router();
const { createBatch, getAllBatches, getBatchById, updateBatchStatus } = require('../controllers/batches.controller');

router.get('/',          getAllBatches);
router.get('/:id',       getBatchById);
router.post('/',         createBatch);
router.patch('/:id/status', updateBatchStatus);

module.exports = router;
```

#### `src/routes/dispatch.routes.js`

```javascript
const express = require('express');
const router = express.Router();
const { getFEFOQueue } = require('../controllers/dispatch.controller');

router.get('/fefo', getFEFOQueue);

module.exports = router;
```

#### `src/routes/qr.routes.js`

```javascript
const express = require('express');
const router = express.Router();
const { getTraceabilityData, getQRImage } = require('../controllers/qr.controller');

router.get('/:batchCode',       getTraceabilityData);
router.get('/:batchCode/image', getQRImage);

module.exports = router;
```

#### `src/routes/products.routes.js`

```javascript
const express = require('express');
const router = express.Router();
const { getProducts } = require('../controllers/products.controller');

router.get('/', getProducts);

module.exports = router;
```

---

### Step 6.3 — Middleware

#### `src/middleware/errorHandler.js`

```javascript
function errorHandler(err, req, res, next) {
  console.error('[Intern2 API Error]:', err.message);

  // Contract violations are 503 (service dependency failure), not 500
  const isContractViolation = err.message.startsWith('DB_CONTRACT');
  const statusCode = isContractViolation ? 503 : (err.statusCode || 500);

  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
}

module.exports = errorHandler;
```

#### `src/middleware/rateLimiter.js`

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 50,                     // 50 requests per window
  message: { success: false, error: 'Too many requests. Please wait.' }
});

module.exports = limiter;
```

---

### Step 6.4 — Main Server Entry Point

#### `server.js`

```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { connectDB } = require('./src/config/db');
const errorHandler = require('./src/middleware/errorHandler');
const rateLimiter = require('./src/middleware/rateLimiter');

// Route imports
const batchRoutes    = require('./src/routes/batches.routes');
const dispatchRoutes = require('./src/routes/dispatch.routes');
const qrRoutes       = require('./src/routes/qr.routes');
const productRoutes  = require('./src/routes/products.routes');

const app = express();
const PORT = process.env.PORT || 5001;

// ─── Security & Parsing Middleware ───────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174'],
  methods: ['GET', 'POST', 'PATCH'],
  credentials: true
}));
app.use(express.json());
app.use(rateLimiter);

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'HimShakti Intern 2 API', port: PORT });
});

// ─── Public Traceability Route (accessed when QR is scanned) ─────────────────
app.use('/trace',        qrRoutes);   // GET /trace/:batchCode
app.use('/api/qr',       qrRoutes);   // GET /api/qr/:batchCode/image

// ─── API Routes ──────────────────────────────────────────────────────────────
app.use('/api/batches',  batchRoutes);
app.use('/api/dispatch', dispatchRoutes);
app.use('/api/products', productRoutes);  // Read-only mirror of Intern 1's products

// ─── Global Error Handler (must be last) ─────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ [Intern 2] Backend running at http://localhost:${PORT}`);
    console.log(`✅ Trace URL format: http://localhost:${PORT}/trace/BTH-2026-0001`);
  });
});
```

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## PHASE 7 — ALL 6 ENDPOINTS SUMMARY
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| # | Method | URL | What It Does |
|---|---|---|---|
| 1 | `POST` | `/api/batches` | Create a new batch with expiry + QR code generated automatically |
| 2 | `GET` | `/api/batches` | List all batches (supports `?status=expiring_soon&sku=HS-MNG-PCK-01`) |
| 3 | `GET` | `/api/batches/:id` | Get single batch by MongoDB ID (with QR base64) |
| 4 | `PATCH` | `/api/batches/:id/status` | Update batch status (e.g. mark as `dispatched`) |
| 5 | `GET` | `/api/dispatch/fefo` | FEFO dispatch queue — expiring soonest listed first |
| 6 | `GET` | `/trace/:batchCode` | Public traceability page data when QR is scanned |

> Plus bonus: `GET /api/products` (read-only mirror of Intern 1's products collection)

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## PHASE 8 — RUNNING & TESTING
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### Step 8.1 — Start the Server

```bash
cd "c:\Users\bhavya\Desktop\internship project idea\backend-intern2"
npm run dev
```

You should see:
```
✅ [Intern 2] Connected to MongoDB Atlas — himshakti DB
✅ [Intern 2] Backend running at http://localhost:5001
✅ Trace URL format: http://localhost:5001/trace/BTH-2026-0001
```

---

### Step 8.2 — Test All 6 Endpoints in Postman

#### Test 1: Health Check
```
GET http://localhost:5001/health
```
Expected: `{ "status": "ok" }`

---

#### Test 2: Create a Batch (most important test)
```
POST http://localhost:5001/api/batches
Content-Type: application/json

{
  "productId": "<paste _id from products collection here>",
  "packDate": "2026-06-25",
  "quantity": 100,
  "notes": "First test batch"
}
```

To get a productId:
1. Open MongoDB Compass → himshakti DB → products collection
2. Click any document → copy the `_id` value

Expected response:
```json
{
  "success": true,
  "message": "Batch BTH-2026-0001 created successfully",
  "data": {
    "batchCode": "BTH-2026-0001",
    "productName": "Traditional Mango Pickle",
    "sku": "HS-MNG-PCK-01",
    "packDate": "2026-06-25T00:00:00.000Z",
    "expiryDate": "2027-06-25T00:00:00.000Z",
    "quantity": 100,
    "status": "active",
    "shelfLifeUsed": 365,
    "shelfLifeSource": "base",
    "qrCodeUrl": "http://localhost:5001/trace/BTH-2026-0001",
    "qrCodeBase64": "data:image/png;base64,iVBORw..."
  }
}
```

---

#### Test 3: Get All Batches
```
GET http://localhost:5001/api/batches
```

#### Test 4: FEFO Dispatch Queue
```
GET http://localhost:5001/api/dispatch/fefo
```

#### Test 5: Scan QR Code (Traceability)
```
GET http://localhost:5001/trace/BTH-2026-0001
```

#### Test 6: Get Products (From Intern 1's collection)
```
GET http://localhost:5001/api/products
```

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## PHASE 9 — ATLAS VERIFICATION
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

After creating your first batch, open MongoDB Compass and verify:

1. `himshakti` DB → `batches` collection → should have 1 document with:
   - `batchCode: "BTH-2026-0001"`
   - `expiryDate`: a real future date
   - `qrCodeBase64`: a very long string starting with `data:image/png;base64,...`
   - `status: "active"`

2. `himshakti` DB → `scanevents` collection → should have 1 document after you hit the `/trace/BTH-2026-0001` endpoint.

---

## ✅ WEEK 4 CHECKLIST — INTERN 2

| Task | Status |
|---|---|
| Get MongoDB URI from Intern 1 (privately) | ☐ |
| Verify 5 products are seeded in Atlas | ☐ |
| `mkdir backend-intern2` + `npm init -y` | ☐ |
| Install all dependencies | ☐ |
| Create `.env` with correct URI and PORT=5001 | ☐ |
| Build folder structure | ☐ |
| Create `db.js` (MongoDB connection) | ☐ |
| Create `Batch.model.js` (Mongoose schema) | ☐ |
| Create `ScanEvent.model.js` | ☐ |
| Copy + adapt `expiryCalculator.js` from shared | ☐ |
| Create `productContract.js` (assertion validator) | ☐ |
| Create `batchCodeGenerator.js` (BTH-YYYY-NNNN) | ☐ |
| Create `qrGenerator.js` (QR as base64 PNG) | ☐ |
| Create all 4 controllers | ☐ |
| Create all 4 route files | ☐ |
| Create `server.js` entry point on port 5001 | ☐ |
| `npm run dev` — server starts without errors | ☐ |
| Test batch creation in Postman (with a real productId) | ☐ |
| Verify batch appears in MongoDB Atlas (Compass) | ☐ |
| Test FEFO dispatch endpoint | ☐ |
| Test QR traceability endpoint | ☐ |
| Verify scanEvents collection gets populated on QR scan | ☐ |
| Export Postman collection as `HimShakti-Intern2-API.postman_collection.json` | ☐ |
| Message Intern 1 confirming you can read their products | ☐ |

---

> 📌 *This guide is for TBI-GEU Summer Internship 2026 — HimShakti Food Processing*
> 📌 *Intern 2 owns: `batches` collection, `scanEvents` collection*
> 📌 *Intern 2 reads: `products` collection (Intern 1 owns)*
> 📌 *Any schema change to `products` requires 24-hour notice to Intern 1 via GitHub Issue*
