import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import ResultCard from '../components/ResultCard'
import { getProducts, getStats, analyseShelfLife, getPrefetchResult, prefetchAll } from '../api/shelfLife'
import StarfieldCanvas from '../components/StarfieldCanvas'

export default function Dashboard() {
  const { theme, toggleTheme } = useTheme()
  const dashboardRef = useRef(null)
  
  const [products, setProducts] = useState([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [productsError, setProductsError] = useState(null)
  
  const [mode, setMode] = useState('deep')
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

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view')
        }
      })
    }, { threshold: 0.1 })
    
    if (dashboardRef.current) {
      const elements = dashboardRef.current.querySelectorAll('.reveal')
      elements.forEach(el => observer.observe(el))
    }
    return () => observer.disconnect()
  }, [products, stats, mode])

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

        // Do not auto switch mode here, let the user stay in their current mode
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
    <div className="min-h-screen flex bg-transparent text-slate-900 dark:text-slate-100 transition-colors duration-500 font-body" ref={dashboardRef}>
      <StarfieldCanvas />
      
      {/* Sticky Sidebar */}
      <aside className="w-[260px] hidden lg:flex flex-col fixed inset-y-0 left-0 bg-white/40 dark:bg-dark-900/40 backdrop-blur-xl border-r border-slate-200 dark:border-white/10 shadow-sm dark:shadow-glass z-40">
        <div className="p-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
              🌾
            </div>
            <div className="leading-tight">
              <p className="font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-emerald-700 dark:from-white dark:to-neon text-xl tracking-tight">HimShakti</p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase tracking-widest font-bold">Predictor</p>
            </div>
          </Link>
        </div>
        <nav className="flex-grow px-4 mt-6 space-y-3">
          <Link to="/dashboard" className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white dark:from-emerald-500 dark:to-neon dark:text-dark-950 shadow-md dark:shadow-glow font-extrabold transition-all hover:scale-[1.02]">
            <span className="text-xl">📊</span> Overview
          </Link>
          <Link to="/" className="flex items-center gap-4 px-6 py-4 rounded-2xl text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10 hover:text-emerald-700 dark:hover:text-white font-semibold transition-all">
            <span className="text-xl">🏠</span> Home
          </Link>
          <Link to="/about" className="flex items-center gap-4 px-6 py-4 rounded-2xl text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10 hover:text-emerald-700 dark:hover:text-white font-semibold transition-all">
            <span className="text-xl">ℹ️</span> About
          </Link>
        </nav>
        <div className="p-6 m-4 mt-auto bg-black/5 dark:bg-white/5 backdrop-blur-md rounded-2xl flex items-center gap-4 border border-black/5 dark:border-white/10">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-500 dark:from-neon dark:to-violet flex items-center justify-center text-white dark:text-dark-950 font-extrabold text-base shadow-sm dark:shadow-glow">HS</div>
          <div className="text-sm">
            <p className="font-bold text-slate-900 dark:text-white">Staff Portal</p>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">AI Production</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col lg:ml-[260px] min-w-0">
        
        {/* Sticky Blurred Topbar */}
        <header className="sticky top-0 z-30 bg-white/40 dark:bg-dark-950/40 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 px-8 py-6 flex items-center justify-between">
          <h1 className="font-heading font-extrabold text-3xl text-slate-900 dark:text-white tracking-tight">Analysis Dashboard</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-neon hover:border-emerald-500/40 dark:hover:border-neon/40 transition-colors shadow-sm"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full">
          {/* Dynamic Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { icon: '📦', label: 'Analyses Run', value: stats.analysesRun, color: 'text-emerald-600 dark:text-neon' },
              { icon: '🌾', label: 'Products Tracked', value: stats.productsTracked, color: 'text-emerald-600 dark:text-emerald-400' },
              { icon: '✅', label: 'Safe Batches', value: stats.safeBatches, color: 'text-teal-600 dark:text-teal-300' },
              { icon: '⚠️', label: 'Risk Warnings', value: stats.riskWarnings, color: 'text-rose-600 dark:text-pinkGlow' },
            ].map((stat, i) => (
              <div key={stat.label} className="glass-card p-6 reveal hover:border-emerald-500/40 dark:hover:border-neon/40 transition-all duration-500" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="w-12 h-12 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-2xl mb-4 shadow-inner">
                  {stat.icon}
                </div>
                <p className={`font-heading font-extrabold text-4xl mb-2 ${stat.color}`}>{stat.value}</p>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="glass-panel p-8 reveal border border-slate-200 dark:border-slate-800">
              <h3 className="font-heading font-bold text-xl mb-6 text-slate-900 dark:text-slate-100">Shelf Life Trends</h3>
              <div className="h-48 w-full border-b-2 border-l-2 border-slate-200 dark:border-slate-800 relative flex items-end justify-between pt-4 px-4 pb-0">
                {[40, 70, 45, 90, 65, 80].map((h, i) => (
                  <div key={i} className="w-10 sm:w-12 bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t-xl hover:opacity-80 transition-all cursor-pointer hover:-translate-y-2" style={{ height: `${h}%` }}></div>
                ))}
              </div>
            </div>
            <div className="glass-panel p-8 reveal border border-slate-200 dark:border-slate-800" style={{ transitionDelay: '100ms' }}>
              <h3 className="font-heading font-bold text-xl mb-6 text-slate-900 dark:text-slate-100">Risk Distribution</h3>
              <div className="h-48 w-full flex items-center justify-center">
                <div className="w-36 h-36 rounded-full border-[14px] border-emerald-500 border-r-amber-400 border-t-emerald-500 border-l-emerald-500 relative animate-blob-rotate shadow-lg">
                  <div className="absolute inset-0 flex items-center justify-center font-heading font-bold text-2xl text-slate-900 dark:text-slate-200">AI</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Predictions Table */}
          <div className="glass-panel bg-white dark:bg-slate-900 p-0 overflow-hidden mb-12 reveal border border-emerald-100 dark:border-slate-800">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-heading font-bold text-xl text-slate-800 dark:text-slate-100">Recent Predictions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-emerald-50/50 dark:bg-slate-800/50 text-emerald-800 dark:text-emerald-400 border-b border-emerald-100 dark:border-slate-800">
                    <th className="py-4 px-8 font-semibold text-sm uppercase tracking-wider">Product</th>
                    <th className="py-4 px-8 font-semibold text-sm uppercase tracking-wider">SKU</th>
                    <th className="py-4 px-8 font-semibold text-sm uppercase tracking-wider">Category</th>
                    <th className="py-4 px-8 font-semibold text-sm uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {products.slice(0, 5).map((p, i) => {
                    let status = 'Fresh';
                    let statusPill = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
                    if (p.riskLevel === 'HIGH') {
                      status = 'Expired';
                      statusPill = 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-400 border-rose-200 dark:border-rose-800';
                    } else if (p.predictedShelfLifeDays && p.predictedShelfLifeDays < 30) {
                      status = 'Expiring';
                      statusPill = 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400 border-amber-200 dark:border-amber-800';
                    }
                    return (
                      <tr key={p._id} className="reveal border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors" style={{ transitionDelay: `${i * 100}ms` }}>
                        <td className="py-5 px-8 font-semibold text-slate-800 dark:text-slate-200">{p.productName}</td>
                        <td className="py-5 px-8 text-slate-500 dark:text-slate-400 text-sm font-medium">{p.sku}</td>
                        <td className="py-5 px-8 text-slate-500 dark:text-slate-400 text-sm font-medium">{p.category}</td>
                        <td className="py-5 px-8">
                          <span className={`px-4 py-1.5 text-xs font-bold rounded-full border shadow-sm ${statusPill}`}>{status}</span>
                        </td>
                      </tr>
                    );
                  })}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-slate-500">No predictions run yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>





          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Quick Analysis Mode Layout */}
            {mode === 'quick' && (
              <div className="lg:col-span-7 space-y-8 animate-fade-in">
                
                {/* Mode Toggle Tabs Pills */}
                <div className="flex justify-start mb-2">
                  <div className="bg-slate-200/60 dark:bg-slate-900/60 p-1.5 rounded-full flex space-x-1 border border-white/10 shadow-sm">
                    <button
                      onClick={() => setMode('quick')}
                      className={`px-6 py-2.5 rounded-full font-heading font-bold text-sm transition-all duration-300 flex items-center space-x-2 ${
                        mode === 'quick'
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400'
                      }`}
                    >
                      <span>⚡ Quick Analysis</span>
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

                <div className="glass-panel p-8">
                  <h3 className="font-heading font-bold text-2xl text-emerald-800 dark:text-emerald-400 mb-6 flex items-center gap-2">
                    <span>⚡</span> Quick AI Analysis
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
                            {p.productName} ({p.sku})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  
                  <div className="mt-8 text-center">
                    <button 
                      onClick={handleAnalyse} 
                      disabled={loading || !formData.productIdentity.productId}
                      className="btn-primary flex items-center justify-center space-x-2 w-full py-4 rounded-xl text-lg font-bold shadow-lg"
                    >
                      <span>{loading ? '🤖 Analysing...' : '⚡ Run Quick Analysis'}</span>
                    </button>
                  </div>
                  
                  {error && <div className="mt-6 p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50 rounded-xl font-medium animate-pulse">❌ {error}</div>}
                </div>
              </div>
            )}

            {/* Deep Analysis Mode Layout */}
            {mode === 'deep' && (
              <>
                {/* Form Wizard */}
                <div className="lg:col-span-7 space-y-8 animate-fade-in">

                  {/* Mode Toggle Tabs Pills */}
                  <div className="flex justify-start mb-2">
                    <div className="bg-slate-200/60 dark:bg-slate-900/60 p-1.5 rounded-full flex space-x-1 border border-white/10 shadow-sm">
                      <button
                        onClick={() => setMode('quick')}
                        className={`px-6 py-2.5 rounded-full font-heading font-bold text-sm transition-all duration-300 flex items-center space-x-2 ${
                          mode === 'quick'
                            ? 'bg-emerald-600 text-white shadow-md'
                            : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400'
                        }`}
                      >
                        <span>⚡ Quick Analysis</span>
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

                  <div className="glass-panel p-8">
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
                </div>
              </>
            )}

            {/* Results Display Area (Shared across both modes) */}
            <div className="lg:col-span-5">
              {result ? (
                <ResultCard result={result} />
              ) : (
                <div className="glass-card p-12 text-center border-dashed border-2 border-slate-300 dark:border-slate-800 flex flex-col items-center justify-center min-h-[300px]">
                  <p className="text-5xl mb-4 opacity-75">🔬</p>
                  <h3 className="font-heading font-bold text-xl text-slate-600 dark:text-slate-400 mb-2">No Analysis Run Yet</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                    {mode === 'quick' 
                      ? 'Select a product and click Quick Analysis to get started.' 
                      : 'Select a product and configure production metrics, then click Analyse Shelf Life to run AI analysis.'}
                  </p>
                </div>
              )}
            </div>

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
                  ⏳ Processing... please wait (running batch AI processing per product)
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
    </div>
  )
}
