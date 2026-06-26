import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ResultCard from '../components/ResultCard'
import { getProducts, getStats, analyseShelfLife, getPrefetchResult, prefetchAll } from '../api/shelfLife'

export default function Dashboard() {
  const [products, setProducts] = useState([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [productsError, setProductsError] = useState(null)
  
  // Option C: Dual Mode State ('quick' | 'deep')
  const [mode, setMode] = useState('quick')
  const [currentStep, setCurrentStep] = useState(1)
  
  // Prefetch cache state for Quick View
  const [prefetchLoading, setPrefetchLoading] = useState(false)
  const [prefetchResult, setPrefetchResult] = useState(null)
  const [prefetchError, setPrefetchError] = useState(null)
  const [lastAnalysedDate, setLastAnalysedDate] = useState(null)
  
  // Admin panel state
  const [adminProcessing, setAdminProcessing] = useState(false)
  const [adminMessage, setAdminMessage] = useState(null)
  
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

  // Check if URL has admin=true
  const isAdmin = new URLSearchParams(window.location.search).get('admin') === 'true';

  // Fetch products and calculate initial stats
  const fetchProductsAndStats = () => {
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
  };

  useEffect(() => {
    fetchProductsAndStats();
  }, []);

  // Fetch prefetch/cache result when product selected in quick mode
  const fetchCachedResult = (productId) => {
    if (!productId) {
      setPrefetchResult(null);
      setPrefetchError(null);
      return;
    }
    
    setPrefetchLoading(true);
    setPrefetchError(null);
    setPrefetchResult(null);

    getPrefetchResult(productId)
      .then(res => {
        if (res.success && res.data) {
          setPrefetchResult(res.data);
          setLastAnalysedDate(res.lastAnalysedAt);
        } else {
          setPrefetchResult(null);
          setPrefetchError(res.message || 'No cached result found.');
        }
      })
      .catch(err => {
        setPrefetchResult(null);
        setPrefetchError('Failed to fetch cached analysis.');
      })
      .finally(() => {
        setPrefetchLoading(false);
      });
  };

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
      setPrefetchResult(null);
      setPrefetchError(null);
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

    // Trigger prefetch result immediately if in quick view mode
    if (mode === 'quick') {
      fetchCachedResult(product._id);
    }
  };

  // If user switches modes, sync prefetch result for currently selected product
  useEffect(() => {
    if (mode === 'quick' && formData.productIdentity.productId) {
      fetchCachedResult(formData.productIdentity.productId);
    }
  }, [mode]);

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

        // Update local products array with new predictions & cached state
        setProducts(prev => prev.map(p => {
          if (p._id === formData.productIdentity.productId) {
            return {
              ...p,
              predictedShelfLifeDays: data.data.predictedShelfLifeDays,
              riskLevel: data.data.riskLevel,
              lastAnalysisResult: data.data
            };
          }
          return p;
        }));

        // Set prefetch cache state immediately so it loads in Quick View
        setPrefetchResult(data.data);
        setLastAnalysedDate(new Date().toISOString());

        // Auto switch back to Quick View mode to show result
        setMode('quick');
      } else {
        throw new Error(data.error || 'Analysis failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminPrefetchAll = () => {
    setAdminProcessing(true);
    setAdminMessage(null);
    prefetchAll()
      .then(res => {
        if (res.success) {
          setAdminMessage(`✅ Done! ${res.processed} products prefetched, ${res.failed} failed.`);
          // Reload products database to get the new cached states (⚡ icon)
          fetchProductsAndStats();
        } else {
          setAdminMessage(`❌ Error: ${res.message || 'Prefetch operation failed.'}`);
        }
      })
      .catch(err => {
        setAdminMessage(`❌ Error: ${err.message || 'Failed to call prefetch endpoint.'}`);
      })
      .finally(() => {
        setAdminProcessing(false);
      });
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  // Date formatter helper: "DD MMM YYYY"
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };

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

          {/* Mode Toggle Tabs Pills */}
          <div className="flex justify-center mb-8">
            <div className="bg-slate-200/60 dark:bg-slate-900/60 p-1.5 rounded-full flex space-x-1 border border-white/10">
              <button
                onClick={() => setMode('quick')}
                className={`px-6 py-2.5 rounded-full font-heading font-bold text-sm transition-all duration-300 flex items-center space-x-2 ${
                  mode === 'quick'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400'
                }`}
              >
                <span>⚡ Quick View</span>
              </button>
              <button
                onClick={() => setMode('deep')}
                className={`px-6 py-2.5 rounded-full font-heading font-bold text-sm transition-all duration-300 flex items-center space-x-2 ${
                  mode === 'deep'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400'
                }`}
              >
                <span>🔬 Deep Analysis</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Quick View Mode Layout */}
            {mode === 'quick' && (
              <div className="lg:col-span-12 space-y-8 animate-fade-in">
                <div className="glass-panel p-8 max-w-2xl mx-auto">
                  <h3 className="font-heading font-bold text-xl text-emerald-800 dark:text-emerald-400 mb-6 flex items-center gap-2">
                    <span>⚡</span> Instant Cached Prediction
                  </h3>

                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Select Product</label>
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
                          <option key={p._id} value={p._id}>
                            {p.lastAnalysisResult ? '⚡ ' : ''}{p.productName} ({p.sku})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Cache State Router */}
                  {formData.productIdentity.productId && (
                    <div className="mt-6 border-t border-slate-100 dark:border-slate-800/80 pt-6">
                      {prefetchLoading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500 mb-3"></div>
                          <span className="text-sm text-slate-500">Retrieving cached food science analysis...</span>
                        </div>
                      ) : prefetchResult ? (
                        <div className="space-y-6">
                          {/* Cache Info Badge */}
                          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-400 rounded-full text-xs font-bold border border-emerald-100/50 dark:border-emerald-900/50">
                            <span>⚡ Cached result</span>
                            <span className="text-emerald-300">•</span>
                            <span>Last analysed: {formatDate(lastAnalysedDate)}</span>
                          </div>

                          <ResultCard result={prefetchResult} />

                          <div className="text-center mt-6">
                            <button
                              onClick={() => setMode('deep')}
                              className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 underline flex items-center justify-center gap-1 mx-auto"
                            >
                              🔄 Re-run Fresh Analysis
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="glass-card p-8 text-center border-dashed border-2 border-slate-300 dark:border-slate-800 flex flex-col items-center justify-center">
                          <p className="text-4xl mb-3">🔬</p>
                          <h4 className="font-heading font-bold text-lg text-slate-700 dark:text-slate-300 mb-1">No quick result yet for this product.</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 max-w-xs leading-relaxed">
                            Run a full Deep Analysis once to enable instant Quick View for this product.
                          </p>
                          <button
                            onClick={() => setMode('deep')}
                            className="btn-primary py-2 px-4 text-xs"
                          >
                            Switch to Deep Analysis →
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {!formData.productIdentity.productId && (
                    <div className="text-center py-10 text-slate-400 font-medium">
                      Select a product from the list above to view its cached shelf life status instantly.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Deep Analysis Mode Layout */}
            {mode === 'deep' && (
              <>
                {/* Form Wizard */}
                <div className="lg:col-span-7 glass-panel p-8 animate-fade-in">
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
                              <option key={p._id} value={p._id}>
                                {p.lastAnalysisResult ? '⚡ ' : ''}{p.productName} ({p.sku})
                              </option>
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
                    <ResultCard result={result} />
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
              </>
            )}
          </div>

          {/* Optional Admin Panel */}
          {isAdmin && (
            <div className="mt-12 glass-panel p-8 max-w-3xl mx-auto border-t-4 border-t-emerald-600">
              <h3 className="font-heading font-bold text-xl text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
                <span>🛠️</span> Admin: Prefetch Manager
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Pre-generate AI analysis for all products that don't have a cached result yet.
              </p>
              
              <button
                onClick={handleAdminPrefetchAll}
                disabled={adminProcessing}
                className="btn-primary bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-6 rounded-xl flex items-center space-x-2 disabled:opacity-50"
              >
                <span>🚀 Prefetch All Products</span>
              </button>

              {adminProcessing && (
                <div className="mt-4 text-sm text-emerald-600 dark:text-emerald-400 animate-pulse font-medium">
                  ⏳ Processing... please wait (this calls Gemini AI with 1500ms delay per product)
                </div>
              )}

              {adminMessage && (
                <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {adminMessage}
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  )
}
