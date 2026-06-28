/**
 * ═══════════════════════════════════════════════════════════════
 *  HimShakti — Synthetic Dataset Generator (Step 2)
 *  Generates 150 AI-predicted shelf life records by calling the
 *  POST /api/shelf-life/analyse endpoint with varied inputs.
 * ═══════════════════════════════════════════════════════════════
 *
 *  Run with: node generate_synthetic_dataset.js
 *  Prerequisites: Backend must be running on http://localhost:5000
 *
 *  Output: synthetic_dataset.json (150 records)
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const API_URL = 'http://localhost:5000/api/shelf-life/analyse';
const OUTPUT_FILE = path.join(__dirname, 'synthetic_dataset.json');
const DELAY_MS = 2500; // delay between calls to respect rate limiter (10 req/15min)

// ─── Helper to pause between API calls ────────────────────────────────────────
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ─── Helper to pick random item from array ────────────────────────────────────
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ─── Helper to generate random number in range ────────────────────────────────
const rand = (min, max, step = 1) =>
  Math.round((Math.random() * (max - min) + min) / step) * step;

// ─── Known HimShakti farmers (from Intern 1 form spec) ───────────────────────
const FARMERS = [
  { name: 'Dinesh Rawat',              village: 'Lansdowne',   district: 'Pauri Garhwal',  altitude: 1350 },
  { name: 'Meera Devi',                village: 'Kotdwar',     district: 'Pauri Garhwal',  altitude: 900  },
  { name: 'Suresh Bisht',              village: 'Bageshwar',   district: 'Bageshwar',      altitude: 1800 },
  { name: 'Kamla Negi',                village: 'Munsiyari',   district: 'Pithoragarh',    altitude: 2200 },
  { name: 'Prakash Joshi',             village: 'Almora',      district: 'Almora',         altitude: 1650 },
  { name: 'Kumaon Naturals (Supplier)',village: 'Haldwani',    district: 'Nainital',       altitude: 400  },
];

// ─── Test case templates (50 per category × 3 categories = 150 total) ─────────
function buildPickleCases(products) {
  const cases = [];
  const saltOptions    = [5, 7, 9, 11, 13, 15];
  const oilOptions     = [0, 5, 10, 15, 20, 25];
  const vinegarOptions = [0, 1, 2, 3, 5];
  const moistureOpts   = [25, 30, 35, 40, 45, 55];
  const methodOptions  = ['boiled', 'steam_cooked', 'raw', 'fermented'];
  const packagingOpts  = ['glass_jar', 'plastic_bottle', 'plastic_pouch', 'vacuum_pouch'];
  const storageOpts    = ['room_temp_dry', 'room_temp_humid', 'cool_room', 'refrigerated'];
  const ingredients    = ['wild_turmeric', 'mustard', 'raw_mango'];

  const targetProducts = products.filter(p => p.category === 'pickle');

  for (let i = 0; i < 50; i++) {
    const farmer = pick(FARMERS);
    const salt   = pick(saltOptions);
    const oil    = pick(oilOptions);
    const vinegar= pick(vinegarOptions);
    const moisture= pick(moistureOpts);
    const method = pick(methodOptions);
    const pkg    = pick(packagingOpts);
    const storage= pick(storageOpts);
    const prod   = targetProducts[i % targetProducts.length];
    const ingr   = pick(ingredients);

    cases.push({
      _meta: {
        category: 'pickle',
        caseId: `SYN-PCK-${String(i + 1).padStart(3, '0')}`,
        salt, oil, vinegar, moisture, method, packaging: pkg, storage,
        farmerAltitude: farmer.altitude,
      },
      payload: {
        productIdentity: {
          productName: `Himalayan Pickle Variant ${i + 1}`,
          productId: prod ? prod._id : '667d4f9b8c0a9e7b2f4c0a1d',
          category: 'pickle',
          batchReference: `SYN-BATCH-PCK-${String(i + 1).padStart(3, '0')}`,
          analysisDate: new Date().toISOString().split('T')[0]
        },
        sourcing: {
          primaryIngredient: ingr,
          farmerName: farmer.name,
          village: farmer.village,
          district: farmer.district,
          altitudeMetres: farmer.altitude + rand(-100, 100, 50),
          harvestDate: new Date(Date.now() - rand(5, 25) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          transportDistanceKm: rand(20, 300, 10),
          storageBeforeDelivery: pick(['same_day', '1_day', '2_3_days', '1_week'])
        },
        ingredients: {
          saltPercent: salt,
          oilPercent: oil,
          vinegarPercent: vinegar,
          sugarPercent: rand(0, 5),
          turmericPercent: rand(0, 3, 0.5),
          otherSpices: 'Fenugreek 1%, Mustard seeds 0.5%',
          moisturePercent: moisture,
          waterActivity: 'not_sure'
        },
        processing: {
          method: method === 'fermented' ? 'fermented' : method === 'boiled' ? 'boiled' : 'raw',
          durationValue: method === 'fermented' ? rand(3, 7) : rand(1, 4),
          durationUnit: 'hours',
          temperatureCelsius: method === 'boiled' ? rand(80, 100, 5) : null,
          heatTreatedBeforeSealing: method === 'boiled' || method === 'steam_cooked',
          phLevel: 'not_tested'
        },
        packaging: {
          packagingType: pkg === 'plastic_bottle' ? 'pet_bottle' : (pkg === 'vacuum_pouch' ? 'plastic_pouch' : pkg),
          isAirtight: pkg === 'glass_jar' || pkg === 'vacuum_pouch',
          sealedStorageCondition: storage === 'cool_room' ? 'cold_store' : storage,
          afterOpeningStorage: pick(['refrigerated', 'room_temp']),
          storageHumidity: pick(['low', 'moderate', 'high']),
          distributionChannels: [pick(['local_market', 'city_retail', 'online'])]
        },
        notes: {
          staffObservations: `Synthetic test case PCK-${i + 1}. Salt: ${salt}%, Oil: ${oil}%, Moisture: ${moisture}%`,
          knownIssues: ['none']
        }
      }
    });
  }
  return cases;
}

function buildSnackCases(products) {
  const cases = [];
  const saltOptions    = [1, 2, 3, 4, 5];
  const oilOptions     = [5, 8, 10, 15, 20, 25];
  const sugarOptions   = [0, 5, 10, 20, 30];
  const moistureOpts   = [3, 5, 7, 10, 12, 15];
  const methodOptions  = ['roasted', 'sun_dried', 'machine_dried'];
  const packagingOpts  = ['vacuum_pouch', 'plastic_pouch', 'paper_bag', 'tin_can'];
  const storageOpts    = ['room_temp_dry', 'cool_room'];
  const ingredients    = ['himalayan_millet'];

  const targetProducts = products.filter(p => p.category === 'snack');

  for (let i = 0; i < 50; i++) {
    const farmer = pick(FARMERS);
    const salt   = pick(saltOptions);
    const oil    = pick(oilOptions);
    const sugar  = pick(sugarOptions);
    const moisture = pick(moistureOpts);
    const method = pick(methodOptions);
    const pkg    = pick(packagingOpts);
    const prod   = targetProducts[i % targetProducts.length];
    const ingr   = pick(ingredients);

    cases.push({
      _meta: {
        category: 'snack',
        caseId: `SYN-SNK-${String(i + 1).padStart(3, '0')}`,
        salt, oil, sugar, moisture, method, packaging: pkg,
        farmerAltitude: farmer.altitude,
      },
      payload: {
        productIdentity: {
          productName: `Himalayan Millet Snack Variant ${i + 1}`,
          productId: prod ? prod._id : '667d4f9b8c0a9e7b2f4c0a1d',
          category: 'snack',
          batchReference: `SYN-BATCH-SNK-${String(i + 1).padStart(3, '0')}`,
          analysisDate: new Date().toISOString().split('T')[0]
        },
        sourcing: {
          primaryIngredient: ingr,
          farmerName: farmer.name,
          village: farmer.village,
          district: farmer.district,
          altitudeMetres: farmer.altitude + rand(-50, 100, 50),
          harvestDate: new Date(Date.now() - rand(5, 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          transportDistanceKm: rand(20, 250, 10),
          storageBeforeDelivery: pick(['same_day', '1_day', '2_3_days'])
        },
        ingredients: {
          saltPercent: salt,
          oilPercent: oil,
          vinegarPercent: 0,
          sugarPercent: sugar,
          turmericPercent: rand(0, 1, 0.5),
          otherSpices: 'Cumin 0.5%, Chilli 0.3%',
          moisturePercent: moisture,
          waterActivity: moisture <= 7 ? 'below_0_80' : 'not_sure'
        },
        processing: {
          method: method === 'sun_dried' ? 'sun_dried' : method === 'roasted' ? 'raw' : 'raw',
          durationValue: method === 'sun_dried' ? rand(2, 5) : rand(1, 3),
          durationUnit: method === 'sun_dried' ? 'days' : 'hours',
          temperatureCelsius: method === 'machine_dried' ? rand(60, 90, 5) : null,
          heatTreatedBeforeSealing: method === 'roasted' || method === 'machine_dried',
          phLevel: 'not_tested'
        },
        packaging: {
          packagingType: pkg === 'vacuum_pouch' ? 'plastic_pouch' : pkg,
          isAirtight: pkg === 'vacuum_pouch' || pkg === 'tin_can',
          sealedStorageCondition: pick(storageOpts) === 'cool_room' ? 'cold_store' : 'room_temp_dry',
          afterOpeningStorage: 'room_temp',
          storageHumidity: pick(['low', 'moderate']),
          distributionChannels: [pick(['local_market', 'city_retail', 'online'])]
        },
        notes: {
          staffObservations: `Synthetic test case SNK-${i + 1}. Salt: ${salt}%, Oil: ${oil}%, Sugar: ${sugar}%, Moisture: ${moisture}%`,
          knownIssues: ['none']
        }
      }
    });
  }
  return cases;
}

function buildJuiceCases(products) {
  const cases = [];
  const sugarOptions   = [8, 12, 20, 30, 45, 60, 65];
  const moistureOpts   = [25, 35, 40, 60, 75, 85, 88, 90];
  const methodOptions  = ['cold_pressed', 'boiled', 'steam_cooked'];
  const packagingOpts  = ['glass_jar', 'plastic_bottle'];
  const storageOpts    = ['refrigerated', 'room_temp_dry', 'cool_room'];
  const ingredients    = ['apricot', 'wild_berry', 'organic_ginger'];

  const targetProducts = products.filter(p => p.category === 'juice');

  for (let i = 0; i < 50; i++) {
    const farmer = pick(FARMERS);
    const sugar  = pick(sugarOptions);
    const moisture = pick(moistureOpts);
    const method = pick(methodOptions);
    const pkg    = pick(packagingOpts);
    const heatTreated = method !== 'cold_pressed';
    const prod   = targetProducts[i % targetProducts.length];
    const ingr   = pick(ingredients);

    cases.push({
      _meta: {
        category: 'juice',
        caseId: `SYN-JCE-${String(i + 1).padStart(3, '0')}`,
        sugar, moisture, method, packaging: pkg,
        farmerAltitude: farmer.altitude,
      },
      payload: {
        productIdentity: {
          productName: `Himalayan Fruit Juice Variant ${i + 1}`,
          productId: prod ? prod._id : '667d4f9b8c0a9e7b2f4c0a1d',
          category: 'juice',
          batchReference: `SYN-BATCH-JCE-${String(i + 1).padStart(3, '0')}`,
          analysisDate: new Date().toISOString().split('T')[0]
        },
        sourcing: {
          primaryIngredient: ingr,
          farmerName: farmer.name,
          village: farmer.village,
          district: farmer.district,
          altitudeMetres: farmer.altitude + rand(-50, 200, 50),
          harvestDate: new Date(Date.now() - rand(3, 15) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          transportDistanceKm: rand(10, 200, 10),
          storageBeforeDelivery: pick(['same_day', '1_day'])
        },
        ingredients: {
          saltPercent: 0,
          oilPercent: 0,
          vinegarPercent: method === 'cold_pressed' ? rand(0, 2, 0.5) : 0,
          sugarPercent: sugar,
          turmericPercent: 0,
          otherSpices: '',
          moisturePercent: moisture,
          waterActivity: moisture > 80 ? 'above_0_90' : '0_80_to_0_90'
        },
        processing: {
          method: method === 'cold_pressed' ? 'cold_pressed' : method === 'boiled' ? 'boiled' : 'raw',
          durationValue: heatTreated ? rand(30, 90) : rand(5, 20),
          durationUnit: 'hours',
          temperatureCelsius: heatTreated ? rand(70, 90, 5) : null,
          heatTreatedBeforeSealing: heatTreated,
          phLevel: 'not_tested'
        },
        packaging: {
          packagingType: pkg === 'plastic_bottle' ? 'pet_bottle' : pkg,
          isAirtight: pkg === 'glass_jar',
          sealedStorageCondition: pick(storageOpts) === 'cool_room' ? 'cold_store' : 'refrigerated',
          afterOpeningStorage: 'refrigerated',
          storageHumidity: 'moderate',
          distributionChannels: [pick(['local_market', 'city_retail'])]
        },
        notes: {
          staffObservations: `Synthetic test case JCE-${i + 1}. Sugar: ${sugar}%, Moisture: ${moisture}%, Method: ${method}`,
          knownIssues: ['none']
        }
      }
    });
  }
  return cases;
}

// ─── Main Generator ───────────────────────────────────────────────────────────
async function generateDataset() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  HimShakti — Synthetic Dataset Generator');
  console.log('  Target: 150 records (50 pickle + 50 snack + 50 juice)');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`  API: ${API_URL}`);
  console.log(`  Delay between calls: ${DELAY_MS}ms`);
  console.log('  Starting in 3 seconds...\n');
  await sleep(3000);

  // First fetch products
  let products = [];
  try {
    const pRes = await fetch('http://localhost:5000/api/products');
    const pJson = await pRes.json();
    if (pJson.success) products = pJson.data;
  } catch(e) {
    console.error("Could not fetch products", e);
  }

  const allCases = [
    ...buildPickleCases(products),
    ...buildSnackCases(products),
    ...buildJuiceCases(products)
  ];

  const results    = [];
  const failures   = [];
  let successCount = 0;
  let failCount    = 0;

  for (let i = 0; i < allCases.length; i++) {
    const tc = allCases[i];
    const progressPct = Math.round(((i + 1) / allCases.length) * 100);
    process.stdout.write(`  [${String(i + 1).padStart(3)}/${allCases.length}] ${tc._meta.caseId} ... `);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tc.payload),
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`HTTP ${response.status}: ${err.slice(0, 100)}`);
      }

      const json = await response.json();

      if (!json.success || !json.data) {
        throw new Error(`API returned success=false: ${JSON.stringify(json).slice(0, 100)}`);
      }

      const record = {
        id: tc._meta.caseId,
        timestamp: new Date().toISOString(),
        category: tc._meta.category,
        input_summary: tc._meta,
        ai_result: {
          sealed_shelf_life_days:      json.data.sealed_shelf_life?.duration_months
                                         ? json.data.sealed_shelf_life.duration_months * 30
                                         : json.data.predictedShelfLifeDays,
          sealed_shelf_life_months:    json.data.sealed_shelf_life?.duration_months,
          best_before_date:            json.data.sealed_shelf_life?.best_before_date,
          after_opening_room_temp_days: json.data.after_opening_shelf_life?.room_temp_days,
          after_opening_refrigerated_days: json.data.after_opening_shelf_life?.refrigerated_days,
          risk_level:                  json.data.riskLevel,
          risk_factors_count:          Array.isArray(json.data.risk_factors) ? json.data.risk_factors.length : 0,
          risk_factors:                json.data.risk_factors,
          improvement_suggestions:     json.data.improvement_suggestions,
          label_ready_text:            json.data.label_ready_text,
          safety_alert:                json.data.safety_alert,
          confidence:                  json.data.sealed_shelf_life?.confidence,
          sourcing_adjustment_applied: json.data.sourcing_adjustment?.applied || false,
          sourcing_adjustment_pct:     json.data.sourcing_adjustment?.adjustment_percent || 0,
        },
        raw_full_response: json.data
      };

      results.push(record);
      successCount++;
      console.log(`✅ ${record.ai_result.sealed_shelf_life_months || '?'} months, Risk: ${record.ai_result.risk_level || 'N/A'}`);

    } catch (err) {
      failCount++;
      failures.push({ id: tc._meta.caseId, error: err.message });
      console.log(`❌ FAILED — ${err.message.slice(0, 60)}`);
    }

    // Save progress every 10 records
    if ((i + 1) % 10 === 0) {
      fs.writeFileSync(OUTPUT_FILE, JSON.stringify({
        metadata: {
          generated: new Date().toISOString(),
          total_attempted: i + 1,
          total_success: successCount,
          total_failed: failCount,
          progress: `${progressPct}%`,
          status: 'in_progress'
        },
        records: results,
        failures
      }, null, 2));
      console.log(`\n  💾 Progress saved: ${successCount} records so far...\n`);
    }

    // Respect rate limiter — wait between calls
    if (i < allCases.length - 1) await sleep(DELAY_MS);
  }

  // Final save
  const finalOutput = {
    metadata: {
      title: 'HimShakti Synthetic AI Shelf Life Dataset',
      description: 'Auto-generated using POST /api/shelf-life/analyse with 150 varied input combinations. Used for Week 5/6 validation report.',
      generated: new Date().toISOString(),
      total_records: results.length,
      total_failed: failCount,
      by_category: {
        pickle: results.filter(r => r.category === 'pickle').length,
        snack:  results.filter(r => r.category === 'snack').length,
        juice:  results.filter(r => r.category === 'juice').length,
      },
      status: 'complete'
    },
    records: results,
    failures: failures.length > 0 ? failures : undefined
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(finalOutput, null, 2));

  console.log('\n═══════════════════════════════════════════════════════');
  console.log(`  ✅ DONE! ${successCount} records generated.`);
  console.log(`  ❌ Failed: ${failCount} records.`);
  console.log(`  📁 Output: ${OUTPUT_FILE}`);
  console.log('  🔜 Next: Run validate_and_compare.js to generate report');
  console.log('═══════════════════════════════════════════════════════');
}

generateDataset().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
