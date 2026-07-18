# Prompt Engineering Log

This log documents the prompt design iterations, testing, and selection process for the HimShakti AI-Based Food Shelf Life Prediction System.

---

## System Role & Instructions

All prompt variations utilize a consistent expert role:
> **Role:** Food science expert specialising in shelf life analysis for small-batch traditional Indian food products, specifically those produced in the Uttarakhand Himalayan region by rural women's collectives.
> **Constraint:** Output MUST be a single raw, valid JSON object following the specified schema without any markdown outer formatting unless inside code blocks, and no conversational preamble.

---

## Prompt Variation 1: Naive Parameter Dump
This version simply listed the raw parameters extracted from the frontend without explaining the preservation science context behind them.

### Prompt Structure
```
Analyze this food product data and return a JSON object with predicted shelf life:
- Product Name: {productName}
- Ingredients: Salt: {salt}%, Oil: {oil}%, Moisture: {moisture}%
- Processing: Method: {method}, pH: {pH}
- Packaging: Type: {packagingType}, Airtight: {isAirtight}
...
```

### Example Input
- **Product Name:** Himalayan Apple Jam
- **Salt:** 0%
- **Sugar:** 5%
- **Moisture:** 15%
- **pH:** 3.5–4.5
- **Packaging:** Glass jar (airtight)

### Example Output
```json
{
  "product_name": "Himalayan Apple Jam",
  "sealed_shelf_life": {
    "duration_months": 6,
    "duration_display": "6 months",
    "best_before_date": "January 2027",
    "storage_condition": "Store in a cool dry place",
    "confidence": "Medium"
  },
  "risk_factors": [],
  "improvement_suggestions": [],
  "predictedShelfLifeDays": 180,
  "riskLevel": "LOW"
}
```

### Evaluation
* **Result:** Output was too generic and often miscalculated the shelf life of high-acid/high-sugar preserves, treating them as high-risk due to lack of standard chemical preservatives.
* **Drawback:** The AI did not account for the mountainous Himalayan sourcing context.

---

## Prompt Variation 2: Contextual Sourcing & Altitude Correction
This version introduced the regional Himalayan details (village, district, altitude) and instructed the AI to apply an altitude-based safety adjustment.

### Prompt Structure
```
Analyze this product data. Sourced at {altitude} meters. 
Altitude Adjustment Rule: Sourcing above 1500m reduces microbial load. Apply a +5% shelf life bonus if altitude exceeds 1500m.
...
```

### Example Input
- **Product Name:** Himalayan Apple Jam
- **Altitude:** 1600 meters
- **Salt:** 0%
- **Sugar:** 5%
- **Moisture:** 15%
- **pH:** 3.5–4.5
- **Packaging:** Glass jar (airtight)

### Example Output
```json
{
  "product_name": "Himalayan Apple Jam",
  "sealed_shelf_life": {
    "duration_months": 7,
    "duration_display": "7 months",
    "best_before_date": "February 2027",
    "storage_condition": "Store in dry room temperature conditions",
    "confidence": "High"
  },
  "sourcing_adjustment": {
    "applied": true,
    "reason": "Altitude of 1600m reduces initial microbial load",
    "adjustment_percent": 5
  },
  "predictedShelfLifeDays": 210,
  "riskLevel": "LOW"
}
```

### Evaluation
* **Result:** Successfully calculated local preservation adjustments.
* **Drawback:** Frequently outputted conversational text ("Here is your analysis:") before the JSON payload, breaking the frontend's JSON parser.

---

## Prompt Variation 3: Complete Domain-Specific & Strict Schema Guard (SELECTED)
This version incorporates exact preservation science logic (rules for salt, oil, vinegar percentages), explicit altitude formulas, and strict output constraint guards to prevent parser crashes.

### Prompt Structure
```
You are a food science expert...
Analyse the following product data and return ONLY a valid JSON object (no explanation text, no markdown outside the JSON block).

ALTITUDE ADJUSTMENT NOTE: Products sourced above 1500m in Uttarakhand typically have lower microbial load due to UV exposure and cold temperatures. Apply a +3% to +8% shelf life bonus if altitude exceeds 1500m.

PRESERVATION SCIENCE NOTE:
- Salt above 8% significantly inhibits microbial growth (key for pickles)
- Oil above 15% acts as a moisture barrier
- Vinegar/acidulant above 2% lowers pH
- Moisture above 20% in a non-acidic product is a HIGH spoilage risk

REQUIRED JSON RESPONSE SCHEMA:
...
```

### Example Input
- **Product Name:** Himalayan Apple Jam
- **Altitude:** 1600 meters
- **Sugar:** 5%
- **Moisture:** 15%
- **pH:** below 3.5
- **Airtight:** Yes

### Example Output
```json
{
  "product_name": "Himalayan Apple Jam",
  "sku": "JAM-APP-01",
  "analysis_date": "2026-07-19",
  "sealed_shelf_life": {
    "duration_months": 12,
    "duration_display": "12 months",
    "best_before_date": "July 2027",
    "storage_condition": "Room temperature, dry place",
    "confidence": "High"
  },
  "after_opening_shelf_life": {
    "room_temp_days": 14,
    "refrigerated_days": 30,
    "display_room_temp": "2 weeks",
    "display_refrigerated": "1 month",
    "label_instruction": "Refrigerate after opening."
  },
  "risk_factors": [
    { "severity": "warning", "message": "High moisture requires tight sealing." }
  ],
  "improvement_suggestions": [
    "Reduce moisture by 5% to extend room temp shelf life."
  ],
  "sourcing_adjustment": {
    "applied": true,
    "reason": "High altitude sourcing",
    "adjustment_percent": 5
  },
  "label_ready_text": "Best Before: July 2027 | Refrigerate after opening",
  "safety_alert": null,
  "predictedShelfLifeDays": 365,
  "riskLevel": "LOW"
}
```

### Why Variation 3 Worked Best
1. **Parser Safety:** Adding strict schema templates with escaping directives prevented trailing/leading text and invalid JSON syntax.
2. **Scientific Grounding:** Incorporating preservation rules (pH thresholds, salinity, moisture ratios) enabled the LLM to output realistic shelf-life estimates rather than arbitrary numbers.
3. **Regional Sensitivity:** Standardized the mountain altitude adjustment factor to reflect HimShakti's unique highland sourcing.
