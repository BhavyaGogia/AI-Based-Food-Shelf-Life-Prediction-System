require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Product = require('../models/Product.model');

const regions = ['Kumaon', 'Garhwal', 'Joshimath', 'Chamoli', 'Almora', 'Nainital', 'Ranikhet', 'Dehradun', 'Munsiyari', 'Mukteshwar'];
const adjectives = ['Traditional', 'Organic', 'Spicy', 'Tangy', 'Premium', 'Homemade', 'Natural', 'Classic', 'Royal', 'Pure'];

function generateUniqueName(category, index) {
  const region = regions[index % regions.length];
  const adj = adjectives[Math.floor(index / regions.length) % adjectives.length];
  
  if (category === 'pickle') {
    const types = ['Mango Pickle', 'Garlic Pickle', 'Red Chilli Pickle', 'Ginger Chutney', 'Mixed Vegetable Pickle', 'Lemon Pickle', 'Turmeric Pickle'];
    const type = types[index % types.length];
    return `${region} ${adj} ${type}`;
  } else if (category === 'snack') {
    const types = ['Ragi Cookies', 'Millet Roasted Mix', 'Roasted Foxnuts', 'Apricot Nut Mix', 'Barley Bites', 'Multigrain Crackers', 'Spiced Chickpeas'];
    const type = types[index % types.length];
    return `${region} ${adj} ${type}`;
  } else {
    const types = ['Rhododendron Flower Squash', 'Fresh Apple Juice', 'Wild Berry Juice', 'Plum Nectar', 'Seabuckthorn Cooler', 'Ginger Lemon Squash', 'Apricot Juice'];
    const type = types[index % types.length];
    return `${region} ${adj} ${type}`;
  }
}

async function importDataset() {
  try {
    if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('localhost')) {
      console.log('⚠️ Localhost / missing MongoDB URI detected. Processing CSV dataset offline...');
    } else {
      await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 2000 });
      console.log('✅ Connected to MongoDB Atlas');
    }

    // Read the generated CSV file
    const csvPath = path.join(__dirname, '../../himshakti_synthetic_dataset.csv');
    if (!fs.existsSync(csvPath)) {
      console.error(`❌ CSV dataset not found at ${csvPath}. Run generateSyntheticData.js first.`);
      process.exit(1);
    }

    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n').filter(line => line.trim() !== '');
    
    // Parse headers
    const headers = lines[0].split(',');
    
    const productsToInsert = [];

    // Parse rows starting from index 1
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index];
      });

      const id = row.id;
      const category = row.category.toLowerCase();
      const actualShelfLifeDays = Math.max(0, parseInt(row.actualShelfLifeDays, 10) || 120);
      const aiPredictedShelfLifeDays = Math.max(0, parseInt(row.aiPredictedShelfLifeDays, 10) || 120);

      // Determine risk level based on predicted shelf life days
      let riskLevel = 'LOW';
      if (aiPredictedShelfLifeDays < 90) {
        riskLevel = 'HIGH';
      } else if (aiPredictedShelfLifeDays < 180) {
        riskLevel = 'MEDIUM';
      }

      // Generate a beautiful unique name
      const productName = generateUniqueName(category, i);
      const sku = `HS-SYN-${category.substring(0, 3).toUpperCase()}-${id.padStart(3, '0')}`;

      productsToInsert.push({
        productName,
        sku,
        category,
        unitSize: category === 'pickle' ? '500g Jar' : category === 'snack' ? '200g Pouch' : '500ml Bottle',
        baseShelfLifeDays: actualShelfLifeDays,
        predictedShelfLifeDays: aiPredictedShelfLifeDays,
        predictedExpiryTemplate: 'Best Before {days} Days from Manufacture',
        riskLevel: riskLevel,
        isActive: true
      });
    }

    if (mongoose.connection.readyState === 1) {
      console.log(`🗑️ Clearing existing active products...`);
      await Product.deleteMany({});

      console.log(`🌱 Inserting ${productsToInsert.length} products with descriptive names...`);
      const inserted = await Product.insertMany(productsToInsert);
      console.log(`✅ Successfully seeded ${inserted.length} descriptive products in Atlas!`);
    } else {
      console.log(`📊 Dry-Run / Offline Mode: Successfully processed ${productsToInsert.length} records from synthetic CSV dataset!`);
      console.log(`💡 Example Record 1:`, productsToInsert[0]);
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to import synthetic dataset:', err);
    process.exit(1);
  }
}

importDataset();
