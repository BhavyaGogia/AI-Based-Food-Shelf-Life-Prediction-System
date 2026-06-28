# 📦 HimShakti — Dataset & Validation Tools
## AI Shelf Life Prediction System | TBI-GEU Internship 2026

This folder contains the complete 3-step dataset pipeline for Intern 1's project.

---

## 📁 Files in This Folder

| File | Purpose |
|---|---|
| `reference_products_india.json` | ✅ **DONE** — 30 real Indian food products curated from Open Food Facts + FSSAI + food science literature |
| `generate_synthetic_dataset.js` | ▶️ **STEP 2** — Generates 150 AI-predicted records by calling your backend |
| `validate_and_compare.js` | ▶️ **STEP 3** — Compares AI predictions vs real data, produces HTML report |
| `synthetic_dataset.json` | ⏳ Created after you run Step 2 |
| `validation_report.html` | ⏳ Created after you run Step 3 |
| `validation_report.json` | ⏳ Created after you run Step 3 |

---

## 🚀 How to Run (In Order)

### Prerequisites
- Your backend must be running: `npm run dev` in the `backend/` folder (port 5000)
- You must have seeded products in Atlas

### Step 1 — Reference Data
Already done! See `reference_products_india.json` — 30 real Indian products.

### Step 2 — Generate Synthetic Dataset
```bash
cd "c:\Users\bhavya\Desktop\internship project idea\dataset"
node generate_synthetic_dataset.js
```

**What it does:**
- Generates 150 varied form input combinations (50 pickle + 50 snack + 50 juice)
- Calls your `POST /api/shelf-life/analyse` endpoint for each
- Saves AI predictions to `synthetic_dataset.json`
- Has 2.5 second delay between calls to respect your rate limiter

**Expected time:** ~7 minutes (150 calls × 2.5s delay)

### Step 3 — Generate Validation Report
```bash
node validate_and_compare.js
```

**What it does:**
- Compares your AI predictions to the 30 real-world reference products
- Computes accuracy metrics, correlations, and insights
- Generates `validation_report.html` — open in your browser to view the report

---

## 📊 What the Report Shows

1. **Overall Accuracy %** — How close AI predictions are to real-world shelf life values
2. **Category Analytics** — Shelf life stats for pickle, snack, juice
3. **Salt-Shelf Life Correlation** — Validates AI is correctly applying food science
4. **Packaging Impact** — Glass jar vs vacuum seal vs plastic pouch
5. **Altitude Sourcing Bonus** — Shows how many predictions got the Himalayan sourcing boost
6. **Direct Comparison Table** — AI predicted vs real known values, side by side
7. **Visual Charts** — Bar charts for easy presentation

---

## 🎓 How to Use This in Your Week 5/6 Report

1. Take a screenshot of `validation_report.html`
2. In your report, write: *"We validated our AI predictions against 30 real Indian food products sourced from Open Food Facts and FSSAI standards. The AI achieved X% accuracy within a ±20% tolerance window..."*
3. Include the comparison table as your accuracy evidence
4. The altitude sourcing section proves HimShakti's Himalayan advantage is being captured

---

## 📚 Data Sources

| Source | What We Used |
|---|---|
| **Open Food Facts API** | Nutritional profiles (salt%, fat%, sugar%) of real Indian brands |
| **FSSAI Food Labelling Regulations 2011** | Official shelf life standards for Indian packaged food |
| **ICMR Dietary Guidelines** | Indian food preservation standards |
| **Food Science Literature** | Potter & Hotchkiss, Featherstone — food preservation principles |
| **HimShakti Product Data** | Direct product profiles from Intern 1's seed data |
