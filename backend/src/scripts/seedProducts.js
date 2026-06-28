require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product.model');

const products = [
  {
    productName: 'Traditional Mango Pickle',
    sku: 'HS-MNG-PCK-01',
    category: 'pickle',
    unitSize: '500g Jar',
    baseShelfLifeDays: 365,
    predictedShelfLifeDays: null,
    predictedExpiryTemplate: 'Best Before {days} Days from Packing',
    riskLevel: null
  },
  {
    productName: 'Organic Ginger Pickle',
    sku: 'HS-GNG-PCK-02',
    category: 'pickle',
    unitSize: '250g Jar',
    baseShelfLifeDays: 270,
    predictedShelfLifeDays: null,
    predictedExpiryTemplate: 'Best Before {days} Days from Packing',
    riskLevel: null
  },
  {
    productName: 'Himalayan Mixed Snack',
    sku: 'HS-MIX-SNK-01',
    category: 'snack',
    unitSize: '200g Pouch',
    baseShelfLifeDays: 180,
    predictedShelfLifeDays: null,
    predictedExpiryTemplate: 'Best Before {days} Days from Manufacturing',
    riskLevel: null
  },
  {
    productName: 'Wild Berry Juice Concentrate',
    sku: 'HS-WBJ-JCE-01',
    category: 'juice',
    unitSize: '500ml Bottle',
    baseShelfLifeDays: 120,
    predictedShelfLifeDays: null,
    predictedExpiryTemplate: 'Best Before {days} Days from Bottling',
    riskLevel: null
  },
  {
    productName: 'Apricot Jam',
    sku: 'HS-APR-JAM-01',
    category: 'snack',
    unitSize: '300g Jar',
    baseShelfLifeDays: 300,
    predictedShelfLifeDays: null,
    predictedExpiryTemplate: 'Best Before {days} Days from Packing',
    riskLevel: null
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  await Product.deleteMany({});           // clear existing
  await Product.insertMany(products);
  console.log('✅ 5 products seeded in Atlas');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
