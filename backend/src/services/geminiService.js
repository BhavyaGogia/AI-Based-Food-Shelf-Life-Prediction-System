const { GoogleGenerativeAI } = require('@google/generative-ai');

async function analyseShelfLife(promptText) {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    console.warn("⚠️ No GEMINI_API_KEY found! Returning mock AI prediction.");
    // Simulate API delay
    await new Promise(r => setTimeout(r, 2000));
    return {
      "product_name": "Himalayan Apple Jam (Mocked)",
      "analysis_date": new Date().toISOString().split('T')[0],
      "sealed_shelf_life": {
        "duration_months": 12,
        "duration_display": "12 months",
        "best_before_date": "June 2027",
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
      "label_ready_text": "Best Before: June 2027 | Refrigerate after opening",
      "safety_alert": null,
      "predictedShelfLifeDays": 365,
      "riskLevel": "LOW"
    };
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const result = await model.generateContent(promptText);
  const text = result.response.text();

  // Extract JSON from the response
  const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || [null, text];
  
  try {
    return JSON.parse(jsonMatch[1].trim());
  } catch (err) {
    console.error("Failed to parse Gemini output:", jsonMatch[1]);
    throw new Error("Gemini returned invalid JSON");
  }
}

module.exports = { analyseShelfLife };
