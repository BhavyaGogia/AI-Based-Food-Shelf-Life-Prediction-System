const { analyseShelfLife } = require('../services/geminiService');
const { buildShelfLifePrompt } = require('../utils/promptBuilder');
const Product = require('../models/Product.model');

// POST /api/shelf-life/analyse
exports.analyseAndStore = async (req, res, next) => {
  try {
    const formData = req.body;
    
    // 1. Build prompt
    const prompt = buildShelfLifePrompt(formData);

    // 2. Call Gemini
    const analysisResult = await analyseShelfLife(prompt);

    // 3. (Optional but required by spec) Update the product in DB if a product match is found or ID is provided
    // For now we will return it directly to the frontend.
    // If the frontend sent productId in formData.productIdentity.productId we would update it here:
    /*
    if (formData.productIdentity.productId) {
      await Product.findByIdAndUpdate(formData.productIdentity.productId, {
        predictedShelfLifeDays: analysisResult.predictedShelfLifeDays,
        riskLevel: analysisResult.riskLevel
      });
    }
    */

    res.status(200).json({
      success: true,
      data: analysisResult
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/shelf-life/history
exports.getHistory = async (req, res, next) => {
  try {
    // Mocked for now, as history collection isn't strictly defined in the models yet
    res.status(200).json({
      success: true,
      count: 0,
      data: []
    });
  } catch (err) {
    next(err);
  }
};
