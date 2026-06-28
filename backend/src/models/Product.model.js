const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  productName: {
    type: String, required: true, unique: true, trim: true
  },
  sku: {
    type: String, required: true, unique: true, uppercase: true, trim: true
  },
  category: {
    type: String, required: true, enum: ['snack', 'juice', 'pickle']
  },
  unitSize: {
    type: String, required: true, trim: true
  },
  baseShelfLifeDays: {
    type: Number, required: true, min: 1
  },
  predictedShelfLifeDays: {
    type: Number, default: null
  },
  predictedExpiryTemplate: {
    type: String, default: 'Best Before {days} Days from Packing'
  },
  riskLevel: {
    type: String, default: null, enum: ['LOW', 'MEDIUM', 'HIGH', null]
  },
  isActive: {
    type: Boolean, default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
