const { GoogleGenerativeAI } = require('@google/generative-ai');

function parseAIResponse(text, provider) {
  // Extract JSON from markdown blocks if present
  const jsonMatch = text.match(/```(?:json)?\n?([\s\S]*?)\n?```/) || [null, text];
  
  try {
    let cleanText = (jsonMatch[1] || text).trim();
    // Some basic cleanup in case model appended text
    if (cleanText.startsWith('{') && cleanText.endsWith('}')) {
      return JSON.parse(cleanText);
    }
    // Fallback naive parse
    return JSON.parse(cleanText.substring(cleanText.indexOf('{'), cleanText.lastIndexOf('}') + 1));
  } catch (err) {
    console.error(`Failed to parse ${provider} output:`, text);
    throw new Error(`${provider} returned invalid JSON`);
  }
}

async function analyseShelfLife(promptText) {
  // 1. Try NVIDIA First (Llama 3.1 70B)
  if (process.env.NVIDIA_API_KEY) {
    try {
      console.log("🤖 Attempting AI analysis via NVIDIA...");
      const nvidiaRes = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.NVIDIA_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "meta/llama-3.1-8b-instruct",
          messages: [
            { role: "system", content: "You are a specialized AI that ONLY outputs raw, valid JSON. Never output conversational text or markdown formatting." },
            { role: "user", content: promptText }
          ],
          temperature: 0.1,
          max_tokens: 1024
        })
      });

      if (!nvidiaRes.ok) {
        throw new Error(`NVIDIA API Error: ${nvidiaRes.status}`);
      }

      const data = await nvidiaRes.json();
      const text = data.choices[0].message.content;
      console.log("✅ NVIDIA Analysis successful!");
      return parseAIResponse(text, "NVIDIA");
    } catch (error) {
      console.error("⚠️ NVIDIA failed:", error.message);
      throw new Error(`NVIDIA API Failed: ${error.message}`);
    }
  }

  // 2. Fallback to Gemini
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    console.warn("⚠️ No API keys found! Returning mock AI prediction.");
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

  try {
    console.log("🤖 Attempting AI analysis via Google Gemini...");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const result = await model.generateContent(promptText);
    const text = result.response.text();
    console.log("✅ Gemini Analysis successful!");
    return parseAIResponse(text, "Gemini");
  } catch (err) {
    console.error("❌ Both NVIDIA and Gemini failed:", err.message);
    throw err;
  }
}

module.exports = { analyseShelfLife };
