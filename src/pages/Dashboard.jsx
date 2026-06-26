import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const placeholderStats = [
  { icon: '📦', label: 'Analyses Run', value: '—' },
  { icon: '🌾', label: 'Products Tracked', value: '—' },
  { icon: '✅', label: 'Safe Batches', value: '—' },
  { icon: '⚠️', label: 'Risk Warnings', value: '—' },
]

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    productIdentity: {
      productId: '',
      productName: '',
      sku: '',
      category: '',
      batchReference: 'BATCH-123',
      analysisDate: new Date().toISOString().split('T')[0]
    },
    sourcing: { primaryIngredient: 'raw_mango' },
    ingredients: { saltPercent: 10, oilPercent: 20, moisturePercent: 15, waterActivity: 'not_sure' },
    processing: { method: 'raw', heatTreatedBeforeSealing: false, phLevel: 'below_3_5' },
    packaging: { packagingType: 'glass_jar', isAirtight: true, sealedStorageCondition: 'room_temp_dry', afterOpeningStorage: 'refrigerated' }
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success) setProducts(data.data);
      })
      .catch(err => console.error('Failed to fetch products:', err));
  }, []);

  const handleProductSelect = (e) => {
    const selectedId = e.target.value;
    const product = products.find(p => p._id === selectedId);
    if (!product) return;
    
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

  const handleAnalyse = async () => {
    if (!formData.productIdentity.productId) {
      setError('Please select a product first');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/shelf-life/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setResult(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream-100 dark:bg-gray-950 transition-colors duration-300">
      <Navbar />

      <main className="flex-grow">
        <div className="bg-forest-700 text-white py-16 sm:py-20">
          <div className="section-container">
            <h1 className="font-heading font-bold text-4xl sm:text-5xl mb-4">
              Analysis Dashboard
            </h1>
            <p className="text-white/75 text-lg max-w-xl">
              Select a product from the database to run an AI shelf life prediction.
            </p>
          </div>
        </div>

        <div className="section-container py-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {placeholderStats.map((stat) => (
              <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-xl p-5 text-center shadow-sm border border-gray-100 dark:border-gray-700">
                <p className="text-3xl mb-2">{stat.icon}</p>
                <p className="font-heading font-bold text-2xl text-forest-700 dark:text-forest-300">{stat.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="font-heading font-bold text-2xl text-forest-700 dark:text-forest-300 mb-6">Run AI Analysis</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Product (From API)</label>
              <select 
                className="w-full max-w-md p-3 border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-700"
                onChange={handleProductSelect}
                value={formData.productIdentity.productId}
              >
                <option value="">-- Select a product --</option>
                {products.map(p => (
                  <option key={p._id} value={p._id}>{p.productName} ({p.sku})</option>
                ))}
              </select>
            </div>

            <button 
              onClick={handleAnalyse} 
              disabled={loading || !formData.productIdentity.productId}
              className="bg-forest-600 hover:bg-forest-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50"
            >
              {loading ? '🤖 AI is analysing your product...' : '🔬 Analyse Shelf Life'}
            </button>

            {error && <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-lg">❌ {error}</div>}

            {result && (
              <div className="mt-8 p-6 bg-green-50 dark:bg-gray-900 border border-green-200 dark:border-forest-800 rounded-xl">
                <h3 className="font-bold text-xl mb-4 text-forest-800 dark:text-forest-400">Analysis Result</h3>
                <p><strong>Shelf Life:</strong> {result.sealed_shelf_life?.duration_display}</p>
                <p><strong>Best Before:</strong> {result.sealed_shelf_life?.best_before_date}</p>
                <p><strong>Label text:</strong> {result.label_ready_text}</p>
                <div className="mt-4">
                  <strong>Risk Factors:</strong>
                  <ul className="list-disc pl-5 mt-2">
                    {result.risk_factors?.map((risk, idx) => (
                      <li key={idx} className="text-red-600">{risk.message}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
