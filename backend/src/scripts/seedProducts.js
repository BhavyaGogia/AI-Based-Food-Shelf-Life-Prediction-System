require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product.model');
const fs = require('fs');
const path = require('path');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const datasetPath = path.join(__dirname, '../../../dataset/reference_products_india.json');
  const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));
  
  const products = dataset.products.map((p, index) => ({
    productName: p.productName,
    sku: p.id || `HS-PRD-${index}`,
    category: p.category,
    unitSize: p.packaging === 'glass_jar' ? '500g Jar' : '250g Pouch',
    baseShelfLifeDays: p.real_shelf_life.sealed_days || 180,
    predictedShelfLifeDays: null,
    predictedExpiryTemplate: 'Best Before {days} Days from Packing',
    riskLevel: null
  }));

  await Product.deleteMany({});           // clear existing
  await Product.insertMany(products);
  console.log(`✅ ${products.length} products seeded in Atlas`);

  const User = require('../models/User.model');
  const bcrypt = require('bcryptjs');
  await User.deleteMany({});
  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('himshakti123', salt);

  const users = [
    { username: 'staff', hashedPassword, role: 'production_staff' },
    { username: 'admin', hashedPassword, role: 'lab_admin' }
  ];

  await User.insertMany(users);
  console.log(`✅ 2 users seeded in Atlas (password: himshakti123)`);

  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
