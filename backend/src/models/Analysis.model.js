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
