const fs = require('fs');
const path = require('path');

// Base product categories
const categories = ['pickle', 'snack', 'juice'];

// Helper to get random number between min and max
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const randFloat = (min, max) => (Math.random() * (max - min) + min).toFixed(2);
const randChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];

// This simulates food science logic
function calculateRealisticShelfLife(product) {
  let baseLife = 0;
  
  if (product.category === 'pickle') {
    baseLife = 365;
    // Salt acts as preservative
    if (product.saltPercent > 10) baseLife += 30;
    if (product.saltPercent < 5) baseLife -= 60;
    
    // Oil acts as preservative
    if (product.oilPercent > 20) baseLife += 45;
    if (product.oilPercent < 10) baseLife -= 90;
    
    // Moisture reduces shelf life
    if (product.moisturePercent > 30) baseLife -= 100;
  } else if (product.category === 'snack') {
    baseLife = 180;
    if (product.moisturePercent > 10) baseLife -= 60;
    if (product.moisturePercent < 5) baseLife += 30;
    if (product.packaging === 'vacuum_sealed') baseLife += 60;
    else if (product.packaging === 'plastic_pouch') baseLife -= 30;
  } else if (product.category === 'juice') {
    baseLife = 120;
    if (product.sugarPercent > 15) baseLife += 30;
    if (product.phLevel < 3.5) baseLife += 45;
    if (product.phLevel > 4.5) baseLife -= 60;
    if (product.storageBeforeDelivery === 'cold_chain') baseLife += 30;
    else if (product.storageBeforeDelivery === 'room_temp') baseLife -= 40;
  }

  // General modifiers
  if (product.transportDistanceKm > 500) baseLife -= 15;
  if (product.heatTreatedBeforeSealing === 'true') baseLife += 45;
  
  return Math.max(7, Math.floor(baseLife)); // Minimum 7 days
}

function generateRecord(id) {
  const category = randChoice(categories);
  const record = {
    id: id,
    productName: category === 'pickle' ? randChoice(['Mango Pickle', 'Garlic Pickle', 'Chilli Pickle']) :
                 category === 'snack' ? randChoice(['Himalayan Mix', 'Roasted Foxnuts', 'Ragi Cookies']) :
                 randChoice(['Apple Juice', 'Rhododendron Squash', 'Plum Juice']),
    category: category,
    saltPercent: category === 'pickle' ? randInt(3, 15) : category === 'snack' ? randInt(1, 5) : 0,
    oilPercent: category === 'pickle' ? randInt(5, 30) : category === 'snack' ? randInt(2, 10) : 0,
    sugarPercent: category === 'juice' ? randInt(5, 25) : category === 'snack' ? randInt(0, 15) : 0,
    moisturePercent: category === 'pickle' ? randInt(10, 40) : category === 'snack' ? randInt(2, 15) : randInt(80, 95),
    phLevel: category === 'juice' ? randFloat(2.5, 5.0) : category === 'pickle' ? randFloat(3.0, 4.5) : randFloat(5.0, 7.0),
    packaging: category === 'pickle' ? randChoice(['glass_jar', 'plastic_jar']) :
               category === 'snack' ? randChoice(['vacuum_sealed', 'plastic_pouch', 'paper_box']) :
               randChoice(['glass_bottle', 'pet_bottle']),
    heatTreatedBeforeSealing: category === 'juice' || category === 'pickle' ? randChoice(['true', 'false']) : 'false',
    transportDistanceKm: randInt(10, 1000),
    storageBeforeDelivery: category === 'juice' ? randChoice(['room_temp', 'cold_chain']) : 'room_temp'
  };

  record.actualShelfLifeDays = calculateRealisticShelfLife(record);
  // Add some AI noise to simulate predictions
  record.aiPredictedShelfLifeDays = record.actualShelfLifeDays + randInt(-15, 15);
  return record;
}

function generateDataset(numRecords, filename) {
  const records = [];
  for (let i = 1; i <= numRecords; i++) {
    records.push(generateRecord(i));
  }

  if (records.length === 0) return;

  const headers = Object.keys(records[0]).join(',');
  const rows = records.map(record => Object.values(record).join(','));
  
  const csvContent = [headers, ...rows].join('\n');
  const filePath = path.join(__dirname, '../../', filename);
  
  fs.writeFileSync(filePath, csvContent);
  console.log(`✅ Generated synthetic dataset with ${numRecords} records at ${filePath}`);
}

generateDataset(200, 'himshakti_synthetic_dataset.csv');
