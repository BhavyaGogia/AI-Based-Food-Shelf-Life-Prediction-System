const mongoose = require('mongoose');
const Product = require('../models/Product.model');

const mockProducts = [
  { _id: 'mock1', productName: 'Traditional Mango Pickle', sku: 'HS-MNG-PCK-01', category: 'pickle', unitSize: '500g Jar', baseShelfLifeDays: 365, predictedShelfLifeDays: null, riskLevel: null, isActive: true },
  { _id: 'mock2', productName: 'Organic Ginger Pickle', sku: 'HS-GNG-PCK-02', category: 'pickle', unitSize: '250g Jar', baseShelfLifeDays: 270, predictedShelfLifeDays: null, riskLevel: null, isActive: true },
  { _id: 'mock3', productName: 'Himalayan Mixed Snack', sku: 'HS-MIX-SNK-01', category: 'snack', unitSize: '200g Pouch', baseShelfLifeDays: 180, predictedShelfLifeDays: null, riskLevel: null, isActive: true },
  { _id: 'mock4', productName: 'Wild Berry Juice Concentrate', sku: 'HS-WBJ-JCE-01', category: 'juice', unitSize: '500ml Bottle', baseShelfLifeDays: 120, predictedShelfLifeDays: null, riskLevel: null, isActive: true },
  { _id: 'mock5', productName: 'Apricot Jam', sku: 'HS-APR-JAM-01', category: 'snack', unitSize: '300g Jar', baseShelfLifeDays: 300, predictedShelfLifeDays: null, riskLevel: null, isActive: true }
];

// GET /api/products
exports.getProducts = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({ success: true, count: mockProducts.length, data: mockProducts, mocked: true });
    }
    const products = await Product.find({ isActive: true });
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/products/:id
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/products
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/products/:id
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (err) {
    next(err);
  }
};
