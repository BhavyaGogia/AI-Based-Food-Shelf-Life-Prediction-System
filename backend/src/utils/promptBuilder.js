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

CRITICAL: For 'product_name' and 'sku', you MUST output EXACTLY the strings provided in the PRODUCT IDENTITY section. Do NOT invent, rename, or guess the product name.

Return ONLY this JSON block. No text before or after it.

\`\`\`json
{
  "product_name": "${(productIdentity.productName || 'string').replace(/"/g, '\\"')}",
  "sku": "${(productIdentity.sku || 'string').replace(/"/g, '\\"')}",
  "analysis_date": "YYYY-MM-DD",
  "sealed_shelf_life": {
    "duration_months": 0,
    "duration_display": "string (e.g. '8 months')",
    "best_before_date": "string (e.g. 'February 2027')",
    "storage_condition": "string",
    "confidence": "High"
  },
  "after_opening_shelf_life": {
    "room_temp_days": 0,
    "refrigerated_days": 0,
    "display_room_temp": "string (e.g. '3 weeks')",
    "display_refrigerated": "string (e.g. '6 weeks')",
    "label_instruction": "string"
  },
  "risk_factors": [
    { "severity": "warning", "message": "string" }
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
  "riskLevel": "LOW"
}
\`\`\`
`.trim();
}

module.exports = { buildShelfLifePrompt };
