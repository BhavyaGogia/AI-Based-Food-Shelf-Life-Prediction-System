import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getProducts, getStats, analyseShelfLife } from '../api/shelfLife'

export default function Dashboard() {
  const [products, setProducts] = useState([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [productsError, setProductsError] = useState(null)
  
  const [currentStep, setCurrentStep] = useState(1)
  
  // Dynamic stats state
  const [stats, setStats] = useState({
    analysesRun: 0,
    productsTracked: 0,
    safeBatches: 0,
    riskWarnings: 0
  })

  const [formData, setFormData] = useState({
    productIdentity: {
      productId: '',
      productName: '',
      sku: '',
      category: '',
      batchReference: 'BATCH-123',
      analysisDate: new Date().toISOString().split('T')[0]
    },
    sourcing: {
      primaryIngredient: 'raw_mango',
      farmerName: 'Himalayan Organic Farms',
      village: 'Joshimath',
      district: 'Chamoli',
      altitudeMetres: 1600,
      harvestDate: new Date().toISOString().split('T')[0],
      transportDistanceKm: 12,
      storageBeforeDelivery: 'one_to_two_days'
    },
    ingredients: { 
      saltPercent: 10, 
      oilPercent: 20, 
      moisturePercent: 15, 
      waterActivity: 'not_sure',
      vinegarPercent: 2,
      sugarPercent: 5,
      turmericPercent: 1,
      otherSpices: 'Chili, Mustard seeds'
    },
    processing: { 
      method: 'raw', 
      durationValue: 2,
      durationUnit: 'hours',
      temperatureCelsius: 25,
      heatTreatedBeforeSealing: false, 
      phLevel: 'below_3_5' 
    },
    packaging: { 
      packagingType: 'glass_jar', 
      isAirtight: true, 
      sealedStorageCondition: 'room_temp_dry', 
      afterOpeningStorage: 'refrigerated',
      storageHumidity: 'moderate',
      distributionChannels: ['Local Retail', 'Direct-to-Consumer']
    },
    notes: {
      staffObservations: 'Clean batch processing',
      knownIssues: []
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Fetch products and calculate initial stats
  useEffect(() => {
    setProductsLoading(true)
    getProducts({ limit: 100 })
      .then(res => {
        if (res.success) {
          const fetchedProducts = res.data || []
          setProducts(fetchedProducts)
          
          // Calculate initial fallback stats
          const fallbackStats = {
            analysesRun: fetchedProducts.filter(p => p.predictedShelfLifeDays !== null && p.predictedShelfLifeDays !== undefined).length,
            productsTracked: fetchedProducts.length,
            safeBatches: fetchedProducts.filter(p => p.riskLevel !== 'HIGH').length,
            riskWarnings: fetchedProducts.filter(p => p.riskLevel === 'HIGH').length
          }

          // Try fetching real stats first
          getStats()
            .then(statsRes => {
              if (statsRes.success) {
                setStats(statsRes.data)
              } else {
                setStats(fallbackStats)
              }
            })
            .catch(() => {
              setStats(fallbackStats)
            })
        } else {
          setProductsError(res.error || 'Failed to retrieve products.')
        }
      })
      .catch(err => {
        console.error('Failed to fetch products:', err)
        setProductsError('Unable to connect to the backend server.')
      })
      .finally(() => {
        setProductsLoading(false)
      })
  }, []);

  const handleProductSelect = (e) => {
    const selectedId = e.target.value;
    const product = products.find(p => p._id === selectedId);
    if (!product) {
      setFormData(prev => ({
        ...prev,
        productIdentity: {
          ...prev.productIdentity,
          productId: '',
          productName: '',
          sku: '',
          category: ''
        }
      }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      productIdentity: {
        ...prev.productIdentity,
        productId: product._id,
        productName: product.productName,
        sku: product.sku,
        category: product.category
      }
    }));
  };

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleAnalyse = async () => {
    if (!formData.productIdentity.productId) {
      setError('Please select a product first');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const data = await analyseShelfLife(formData);

      if (data.success) {
        setResult(data.data);
        
        // Dynamically update stats after successful analysis
        setStats(prev => {
          const isHighRisk = data.data.riskLevel === 'HIGH';
          
          // Find if this product previously existed with High risk
          const originalProduct = products.find(p => p._id === formData.productIdentity.productId);
          const hadHighRiskBefore = originalProduct?.riskLevel === 'HIGH';
          
          let riskWarningsDiff = 0;
          if (isHighRisk && !hadHighRiskBefore) {
            riskWarningsDiff = 1;
          } else if (!isHighRisk && hadHighRiskBefore) {
            riskWarningsDiff = -1;
          }

          const newRiskWarnings = Math.max(0, prev.riskWarnings + riskWarningsDiff);
          const newSafeBatches = Math.max(0, prev.safeBatches - riskWarningsDiff);

          return {
            ...prev,
            analysesRun: prev.analysesRun + 1,
            riskWarnings: newRiskWarnings,
            safeBatches: newSafeBatches
          };
        });

        // Update local products array with new predictions
        setProducts(prev => prev.map(p => {
          if (p._id === formData.productIdentity.productId) {
            return {
              ...p,
              predictedShelfLifeDays: data.data.predictedShelfLifeDays,
              riskLevel: data.data.riskLevel
            };
          }
          return p;
        }));
      } else {
        throw new Error(data.error || 'Analysis failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  return (
    <div className="min-h-screen flex flex-col bg-emerald-50 dark:bg-midnight transition-colors duration-300">
      <Navbar />

      <main className="flex-grow">
        {/* Banner */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 text-white py-16">
          <div className="section-container text-center sm:text-left">
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-emerald-100 to-emerald-300">
              Analysis Dashboard
            </h1>
            <p className="text-white/80 text-lg max-w-xl">
              Configure food production metrics and trigger Gemini AI predictions for shelf-life estimation.
            </p>
          </div>
        </div>

        <div className="section-container py-12">
          {/* Dynamic Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {[
              { icon: '📦', label: 'Analyses Run', value: stats.analysesRun, color: 'text-emerald-600 dark:text-emerald-400' },
              { icon: '🌾', label: 'Products Tracked', value: stats.productsTracked, color: 'text-emerald-700 dark:text-emerald-300' },
              { icon: '✅', label: 'Safe Batches', value: stats.safeBatches, color: 'text-teal-600 dark:text-teal-400' },
              { icon: '⚠️', label: 'Risk Warnings', value: stats.riskWarnings, color: 'text-rose-600 dark:text-rose-400' },
            ].map((stat) => (
              <div key={stat.label} className="glass-card p-5 text-center shadow-md border border-white/20 dark:border-slate-800/80">
                <p className="text-3xl mb-2">{stat.icon}</p>
                <p className={`font-heading font-bold text-3xl ${stat.color}`}>{stat.value}</p>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form Section (Wizard style) */}
            <div className="lg:col-span-7 glass-panel p-8">
              <div className="flex items-center justify-between mb-8 border-b border-emerald-100 dark:border-slate-800 pb-4">
                <h2 className="font-heading font-bold text-2xl text-emerald-800 dark:text-emerald-400">Configure Parameters</h2>
                <span className="text-xs font-bold px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-full">
                  Step {currentStep} of 4
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full mb-8 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-500"
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                />
              </div>

              {/* Step Forms */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="font-heading font-bold text-lg text-slate-700 dark:text-slate-300 mb-4">Step 1: Product Identity</h3>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Select Product (Required)</label>
                    {productsLoading ? (
                      <div className="text-sm text-emerald-600 dark:text-emerald-400 animate-pulse py-2">🌾 Loading products database...</div>
                    ) : productsError ? (
                      <div className="text-sm text-rose-500 py-2">❌ {productsError}</div>
                    ) : (
                      <select 
                        className="w-full p-3 border rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100"
                        onChange={handleProductSelect}
                        value={formData.productIdentity.productId}
                      >
                        <option value="">-- Choose a product --</option>
                        {products.map(p => (
                          <option key={p._id} value={p._id}>{p.productName} ({p.sku})</option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">SKU</label>
                      <input 
                        type="text" 
                        readOnly 
                        placeholder="Select product to auto-fill"
                        value={formData.productIdentity.sku}
                        className="w-full p-3 border rounded-xl bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-900 text-slate-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Category</label>
                      <input 
                        type="text" 
                        readOnly 
                        placeholder="Select product to auto-fill"
                        value={formData.productIdentity.category}
                        className="w-full p-3 border rounded-xl bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-900 text-slate-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Batch Reference</label>
                      <input 
                        type="text" 
                        value={formData.productIdentity.batchReference}
                        onChange={(e) => handleInputChange('productIdentity', 'batchReference', e.target.value)}
                        className="w-full p-3 border rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Analysis Date</label>
                      <input 
                        type="date" 
                        value={formData.productIdentity.analysisDate}
                        onChange={(e) => handleInputChange('productIdentity', 'analysisDate', e.target.value)}
                        className="w-full p-3 border rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="font-heading font-bold text-lg text-slate-700 dark:text-slate-300 mb-4">Step 2: Sourcing & Ingredients</h3>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Primary Ingredient</label>
                    <select 
                      className="w-full p-3 border rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100"
                      value={formData.sourcing.primaryIngredient}
                      onChange={(e) => handleInputChange('sourcing', 'primaryIngredient', e.target.value)}
                    >
                      <option value="raw_mango">Raw Mango</option>
                      <option value="wild_turmeric">Wild Turmeric</option>
                      <option value="organic_ginger">Organic Ginger</option>
                      <option value="apricot">Apricot</option>
                      <option value="wild_berry">Wild Berry</option>
                      <option value="himalayan_millet">Himalayan Millet</option>
                      <option value="mustard">Mustard</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">
                      <span>Salt Percentage</span>
                      <span className="text-emerald-600 font-bold">{formData.ingredients.saltPercent}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="30" step="0.5"
                      value={formData.ingredients.saltPercent}
                      onChange={(e) => handleInputChange('ingredients', 'saltPercent', parseFloat(e.target.value))}
                      className="w-full accent-emerald-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">
                      <span>Oil Percentage</span>
                      <span className="text-emerald-600 font-bold">{formData.ingredients.oilPercent}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="50" step="0.5"
                      value={formData.ingredients.oilPercent}
                      onChange={(e) => handleInputChange('ingredients', 'oilPercent', parseFloat(e.target.value))}
                      className="w-full accent-emerald-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">
                      <span>Moisture Percentage</span>
                      <span className="text-emerald-600 font-bold">{formData.ingredients.moisturePercent}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="50" step="0.5"
                      value={formData.ingredients.moisturePercent}
                      onChange={(e) => handleInputChange('ingredients', 'moisturePercent', parseFloat(e.target.value))}
                      className="w-full accent-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Water Activity (Aw)</label>
                    <select 
                      className="w-full p-3 border rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100"
                      value={formData.ingredients.waterActivity}
                      onChange={(e) => handleInputChange('ingredients', 'waterActivity', e.target.value)}
                    >
                      <option value="below_0_80">Low (below 0.80)</option>
                      <option value="0_80_to_0_90">Medium (0.80–0.90)</option>
                      <option value="above_0_90">High (above 0.90)</option>
                      <option value="not_sure">Unsure / Not Measured</option>
                    </select>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="font-heading font-bold text-lg text-slate-700 dark:text-slate-300 mb-4">Step 3: Processing Details</h3>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Processing Method</label>
                    <select 
                      className="w-full p-3 border rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100"
                      value={formData.processing.method}
                      onChange={(e) => handleInputChange('processing', 'method', e.target.value)}
                    >
                      <option value="raw">Raw (no heat treatment)</option>
                      <option value="boiled">Boiled</option>
                      <option value="fried">Fried</option>
                      <option value="sun_dried">Sun Dried</option>
                      <option value="cold_pressed">Cold Pressed</option>
                      <option value="fermented">Fermented</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200/50 dark:border-slate-800/80">
                    <input 
                      type="checkbox"
                      id="heatTreated"
                      checked={formData.processing.heatTreatedBeforeSealing}
                      onChange={(e) => handleInputChange('processing', 'heatTreatedBeforeSealing', e.target.checked)}
                      className="w-5 h-5 rounded accent-emerald-600"
                    />
                    <label htmlFor="heatTreated" className="text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                      Heat treated before sealing (above 80°C)
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">pH Level</label>
                    <select 
                      className="w-full p-3 border rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100"
                      value={formData.processing.phLevel}
                      onChange={(e) => handleInputChange('processing', 'phLevel', e.target.value)}
                    >
                      <option value="below_3_5">Very Acidic (below 3.5)</option>
                      <option value="3_5_4_5">Acidic (3.5–4.5)</option>
                      <option value="4_5_6_0">Mildly Acidic (4.5–6.0)</option>
                      <option value="above_6_0">Near Neutral / Unacidified (above 6.0)</option>
                      <option value="not_tested">Not tested / Unsure</option>
                    </select>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="font-heading font-bold text-lg text-slate-700 dark:text-slate-300 mb-4">Step 4: Packaging & Storage</h3>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Packaging Type</label>
                    <select 
                      className="w-full p-3 border rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100"
                      value={formData.packaging.packagingType}
                      onChange={(e) => handleInputChange('packaging', 'packagingType', e.target.value)}
                    >
                      <option value="glass_jar">Glass Jar</option>
                      <option value="plastic_pouch">Plastic Pouch</option>
                      <option value="tin_can">Tin Can</option>
                      <option value="pet_bottle">PET Bottle</option>
                      <option value="paper_bag">Paper Bag</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200/50 dark:border-slate-800/80">
                    <input 
                      type="checkbox"
                      id="isAirtight"
                      checked={formData.packaging.isAirtight}
                      onChange={(e) => handleInputChange('packaging', 'isAirtight', e.target.checked)}
                      className="w-5 h-5 rounded accent-emerald-600"
                    />
                    <label htmlFor="isAirtight" className="text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                      Is hermetically airtight sealed
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Sealed Storage Condition</label>
                    <select 
                      className="w-full p-3 border rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100"
                      value={formData.packaging.sealedStorageCondition}
                      onChange={(e) => handleInputChange('packaging', 'sealedStorageCondition', e.target.value)}
                    >
                      <option value="room_temp_dry">Room Temperature (Dry)</option>
                      <option value="room_temp_humid">Room Temperature (Humid)</option>
                      <option value="refrigerated">Refrigerated (below 8°C)</option>
                      <option value="cold_store">Cold Store (0-4°C)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Storage After Opening</label>
                    <select 
                      className="w-full p-3 border rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100"
                      value={formData.packaging.afterOpeningStorage}
                      onChange={(e) => handleInputChange('packaging', 'afterOpeningStorage', e.target.value)}
                    >
                      <option value="refrigerated">Refrigerate</option>
                      <option value="room_temp">Room Temperature</option>
                      <option value="consume_immediately">Consume Immediately</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Wizard Navigation */}
              <div className="flex items-center justify-between mt-10 pt-6 border-t border-emerald-100 dark:border-slate-800/80">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="btn-secondary disabled:opacity-30 disabled:pointer-events-none"
                >
                  ← Back
                </button>

                {currentStep < 4 ? (
                  <button onClick={nextStep} className="btn-primary">
                    Next Step →
                  </button>
                ) : (
                  <button 
                    onClick={handleAnalyse} 
                    disabled={loading || !formData.productIdentity.productId}
                    className="btn-primary flex items-center justify-center space-x-2"
                  >
                    <span>{loading ? '🤖 Analysing...' : '🔬 Analyse Shelf Life'}</span>
                  </button>
                )}
              </div>

              {error && <div className="mt-6 p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50 rounded-xl font-medium animate-pulse">❌ {error}</div>}
            </div>

            {/* Results Display Area */}
            <div className="lg:col-span-5">
              {result ? (
                <div className="glass-panel p-8 border-l-4 border-l-emerald-500 dark:border-l-emerald-400 animate-fade-up">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="font-heading font-extrabold text-2xl text-slate-800 dark:text-slate-200">
                        {result.product_name || formData.productIdentity.productName || 'Analysis Completed'}
                      </h3>
                      {result.sku && (
                        <span className="text-xs font-mono bg-slate-100 dark:bg-slate-900 px-2.5 py-1 rounded text-slate-500 dark:text-slate-400">
                          {result.sku}
                        </span>
                      )}
                    </div>
                    {/* Confidence Score Badge */}
                    {result.sealed_shelf_life?.confidence && (
                      <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                        result.sealed_shelf_life.confidence === 'High' 
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                          : result.sealed_shelf_life.confidence === 'Medium'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}>
                        {result.sealed_shelf_life.confidence} Conf
                      </span>
                    )}
                  </div>

                  <div className="space-y-6">
                    {/* Shelf Life Highlights */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-900">
                        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">Sealed Shelf Life</span>
                        <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400">{result.sealed_shelf_life?.duration_display || 'N/A'}</span>
                        {result.sealed_shelf_life?.best_before_date && (
                          <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">Best before: {result.sealed_shelf_life.best_before_date}</span>
                        )}
                      </div>

                      {result.after_opening_shelf_life && (
                        <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-900">
                          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">After Opening</span>
                          <span className="text-lg font-bold text-teal-700 dark:text-teal-400">
                            {result.after_opening_shelf_life.display_refrigerated || result.after_opening_shelf_life.display_room_temp || result.after_opening_shelf_life.label_instruction || 'N/A'}
                          </span>
                          {result.after_opening_shelf_life.label_instruction && (
                            <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">{result.after_opening_shelf_life.label_instruction}</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Highlighted Label Ready Text */}
                    {result.label_ready_text && (
                      <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 p-5 rounded-2xl">
                        <span className="text-xs text-emerald-800 dark:text-emerald-400 font-bold uppercase tracking-wider block mb-2">📜 Generated Label Statement</span>
                        <p className="text-sm font-semibold italic text-emerald-900 dark:text-emerald-300">
                          "{result.label_ready_text}"
                        </p>
                      </div>
                    )}

                    {/* Improvement Suggestions / Storage Tips */}
                    {(result.improvement_suggestions || result.storage_tips) && (
                      <div>
                        <h4 className="font-heading font-bold text-sm text-slate-700 dark:text-slate-300 mb-2.5">💡 Storage Recommendations</h4>
                        <ul className="space-y-1.5 pl-1.5 text-sm text-slate-600 dark:text-slate-400 list-none">
                          {((result.improvement_suggestions || result.storage_tips) || []).map((tip, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-emerald-500 mr-2">✦</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Risk Factors */}
                    {result.risk_factors && result.risk_factors.length > 0 && (
                      <div>
                        <h4 className="font-heading font-bold text-sm text-slate-700 dark:text-slate-300 mb-3">⚠️ Critical Hazards & Risks</h4>
                        <div className="space-y-2.5">
                          {result.risk_factors.map((risk, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-3.5 bg-rose-50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-950 rounded-xl">
                              <span className="text-xl flex-shrink-0 text-rose-500">⚠️</span>
                              <div className="text-sm">
                                <span className={`font-bold uppercase text-xs mr-2 ${
                                  risk.severity === 'critical' ? 'text-rose-700 dark:text-rose-400' : 'text-amber-700 dark:text-amber-400'
                                }`}>
                                  [{risk.severity || 'warning'}]
                                </span>
                                <span className="text-rose-900 dark:text-slate-300 font-medium">{risk.message}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="glass-card p-12 text-center border-dashed border-2 border-slate-300 dark:border-slate-800 flex flex-col items-center justify-center min-h-[300px]">
                  <p className="text-5xl mb-4 opacity-75">🔬</p>
                  <h3 className="font-heading font-bold text-xl text-slate-600 dark:text-slate-400 mb-2">No Analysis Run Yet</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                    Select a product and configure production metrics, then click <strong>Analyse Shelf Life</strong> to query Gemini AI.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
