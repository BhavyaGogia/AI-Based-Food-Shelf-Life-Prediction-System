function buildShelfLifePrompt(formData) {
  return `
You are an expert food scientist and shelf-life prediction AI for HimShakti Food Processing in Uttarakhand.
You need to analyse the following food product parameters and predict its shelf life.
All predictions MUST be returned as a valid JSON object.

# Product Data:
- Product Name: ${formData.productIdentity.productName}
- Category: ${formData.productIdentity.category}
- Altitude Sourced: ${formData.sourcing.altitudeMetres} meters
- Storage Before Delivery: ${formData.sourcing.storageBeforeDelivery}
- Ingredients:
  - Salt: ${formData.ingredients.saltPercent}%
  - Oil: ${formData.ingredients.oilPercent}%
  - Vinegar: ${formData.ingredients.vinegarPercent}%
  - Turmeric: ${formData.ingredients.turmericPercent}%
  - Moisture Estimate: ${formData.ingredients.moisturePercent}%
- Processing Method: ${formData.processing.method}
- pH Level: ${formData.processing.phLevel}
- Packaging Type: ${formData.packaging.packagingType}
- Sealed Storage: ${formData.packaging.sealedStorageCondition}

# Your Task:
1. Estimate the sealed shelf life in months.
2. Estimate the after-opening shelf life in days.
3. Identify any major risk factors (like high moisture, low acidity).
4. Suggest a natural improvement to extend shelf life without chemical preservatives.
5. Determine a risk level ("LOW", "MEDIUM", "HIGH").
6. Provide a label-ready text instruction.

# JSON Response Format (STRICT):
Return ONLY this JSON structure, with no markdown formatting outside of the standard JSON block.
{
  "product_name": "${formData.productIdentity.productName}",
  "analysis_date": "${formData.productIdentity.analysisDate}",
  "sealed_shelf_life": {
    "duration_months": <number>,
    "duration_display": "<string e.g. 8 months>",
    "best_before_date": "<string e.g. February 2027>",
    "storage_condition": "<string>",
    "confidence": "<High/Medium/Low>"
  },
  "after_opening_shelf_life": {
    "room_temp_days": <number>,
    "refrigerated_days": <number>,
    "display_room_temp": "<string>",
    "display_refrigerated": "<string>",
    "label_instruction": "<string>"
  },
  "risk_factors": [
    { "severity": "<warning/critical>", "message": "<string>" }
  ],
  "improvement_suggestions": [
    "<string>"
  ],
  "sourcing_adjustment": {
    "applied": <boolean>,
    "reason": "<string>",
    "adjustment_percent": <number>
  },
  "label_ready_text": "<string>",
  "safety_alert": null,
  "predictedShelfLifeDays": <number in days for database>,
  "riskLevel": "<LOW|MEDIUM|HIGH>"
}
`;
}

module.exports = { buildShelfLifePrompt };
