import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TestTube, Calendar, MapPin, Scale, Box, Thermometer,
  FileText, FlaskConical, Beaker, Zap, CheckCircle, ShieldAlert,
  ChevronRight, AlertTriangle
} from 'lucide-react'
import AnimatedText from '../components/AnimatedText'
import StarfieldCanvas from '../components/StarfieldCanvas'

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] },
})

export default function PredictorPage() {
  const [isAnalysing, setIsAnalysing] = useState(false)
  const [result, setResult] = useState(null)
  const [productsList, setProductsList] = useState([])
  const [fetchError, setFetchError] = useState(null)
  
  // Section 1: Product Identity
  const [productName, setProductName] = useState('')
  const [category, setCategory] = useState('')
  const [customCategory, setCustomCategory] = useState('')
  const [batchRef, setBatchRef] = useState('')
  const [analysisDate, setAnalysisDate] = useState(new Date().toISOString().split('T')[0])

  // Section 2: Sourcing
  const [ingredient, setIngredient] = useState('')
  const [customIngredient, setCustomIngredient] = useState('')
  const [supplier, setSupplier] = useState('')
  const [altitude, setAltitude] = useState(1200)
  const [harvestDate, setHarvestDate] = useState('')
  const [distance, setDistance] = useState('')
  const [storageBefore, setStorageBefore] = useState('same_day')

  // Section 3: Composition
  const [salt, setSalt] = useState(5)
  const [oil, setOil] = useState(0)
  const [vinegar, setVinegar] = useState(0)
  const [sugar, setSugar] = useState(0)
  const [turmeric, setTurmeric] = useState(0)
  const [moisture, setMoisture] = useState(15)

  // Section 4: Processing
  const [method, setMethod] = useState('')
  const [duration, setDuration] = useState('')
  const [durationUnit, setDurationUnit] = useState('hours')
  const [temp, setTemp] = useState('')
  const [isCooked, setIsCooked] = useState(false)
  const [ph, setPh] = useState('not_tested')

  // Section 5: Packaging
  const [packaging, setPackaging] = useState('')
  const [isAirtight, setIsAirtight] = useState(false)
  const [storageSealed, setStorageSealed] = useState('')
  const [storageOpened, setStorageOpened] = useState('')

  // Section 6: Notes
  const [notes, setNotes] = useState('')

  const totalPercent = salt + oil + vinegar + sugar + turmeric

  const handleSupplierChange = (e) => {
    const val = e.target.value
    setSupplier(val)
    if (val === 'Kamla Negi') setAltitude(2200)
    else if (val === 'Dinesh Rawat') setAltitude(1500)
    else if (val === 'Kumaon Naturals (Supplier)') setAltitude(800)
  }

  React.useEffect(() => {
    // Fetch products on mount
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProductsList(data.data)
        }
      })
      .catch(err => {
        console.error('Failed to fetch products:', err)
      })
  }, [])

  const handleAnalyse = async (e) => {
    e.preventDefault()
    setIsAnalysing(true)
    setResult(null)
    setFetchError(null)
    
    const payload = {
      productIdentity: {
        productName: productName,
        category: category === 'other' ? customCategory : category,
        batchReference: batchRef,
        analysisDate: analysisDate
      },
      sourcing: {
        primaryIngredient: ingredient === 'custom' ? customIngredient : ingredient,
        farmerName: supplier,
        altitudeMetres: altitude,
        storageBeforeDelivery: storageBefore
      },
      ingredients: {
        saltPercent: salt,
        oilPercent: oil,
        vinegarPercent: vinegar,
        sugarPercent: sugar,
        turmericPercent: turmeric,
        moisturePercent: moisture
      },
      processing: {
        method: method,
        phLevel: ph
      },
      packaging: {
        packagingType: packaging,
        sealedStorageCondition: storageSealed
      }
    }

    try {
      const response = await fetch('/api/shelf-life/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      const data = await response.json()
      
      if (!data.success) throw new Error(data.error || 'API Error')
      
      const apiResult = data.data
      setResult({
        sealed: apiResult.sealed_shelf_life.duration_display,
        date: apiResult.sealed_shelf_life.best_before_date,
        opened: apiResult.after_opening_shelf_life.display_room_temp,
        risks: apiResult.risk_factors.map(r => r.message),
        tips: apiResult.improvement_suggestions
      })
      
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
      }, 100)
    } catch (err) {
      console.error(err)
      setFetchError('Analysis failed. Please try again or check server connection.')
    } finally {
      setIsAnalysing(false)
    }
  }

  return (
    <motion.div 
      className="page-container" 
      style={{ background: 'transparent' }}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <StarfieldCanvas />
      <motion.section className="page-hero" style={{ paddingBottom: '30px' }} {...fadeUp(0)}>
        <AnimatedText 
          text="Shelf Life Predictor" 
          className="page-hero-title" 
          delayOffset={0.1}
        />
        <p className="page-hero-subtitle">
          Input your product data to generate a scientific shelf life analysis.
        </p>
      </motion.section>

      <div className="predictor-layout">
        <form onSubmit={handleAnalyse} className="predictor-form">
          
          {/* Section 1 */}
          <motion.div className="form-section" {...fadeUp(0.1)}>
            <div className="form-section-header">
              <Box className="form-section-icon" size={20} />
              <h2>1. Product Identity</h2>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Product Name *</label>
                <input list="product-names" required value={productName} onChange={e => setProductName(e.target.value)} placeholder="e.g. Himalayan Millet Pickle" />
                <datalist id="product-names">
                  {productsList.map(p => (
                    <option key={p._id} value={p.productName} />
                  ))}
                </datalist>
              </div>
              <div className="form-group">
                <label>Category *</label>
                <select required value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="">— Select Category —</option>
                  <option value="millet_snack">Millet Snack</option>
                  <option value="fruit_pickle">Fruit Pickle</option>
                  <option value="vegetable_pickle">Vegetable Pickle</option>
                  <option value="fruit_juice">Fruit Juice</option>
                  <option value="other">Other</option>
                </select>
              </div>
              {category === 'other' && (
                <div className="form-group">
                  <label>Specify Category</label>
                  <input type="text" required value={customCategory} onChange={e => setCustomCategory(e.target.value)} />
                </div>
              )}
              <div className="form-group">
                <label>Batch Ref (Optional)</label>
                <input type="text" value={batchRef} onChange={e => setBatchRef(e.target.value)} placeholder="e.g. BATCH-042" />
              </div>
              <div className="form-group">
                <label>Analysis Date *</label>
                <input type="date" required value={analysisDate} onChange={e => setAnalysisDate(e.target.value)} />
              </div>
            </div>
          </motion.div>

          {/* Section 2 */}
          <motion.div className="form-section" {...fadeUp(0.2)}>
            <div className="form-section-header">
              <MapPin className="form-section-icon" size={20} />
              <h2>2. Raw Material Sourcing</h2>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Primary Ingredient *</label>
                <select required value={ingredient} onChange={e => setIngredient(e.target.value)}>
                  <option value="">— Select —</option>
                  <option value="jowar">Jowar (Sorghum)</option>
                  <option value="wild_turmeric">Wild Himalayan Turmeric</option>
                  <option value="mustard">Mustard</option>
                  <option value="custom">Add Custom...</option>
                </select>
              </div>
              {ingredient === 'custom' && (
                <div className="form-group">
                  <label>Custom Ingredient *</label>
                  <input type="text" required value={customIngredient} onChange={e => setCustomIngredient(e.target.value)} />
                </div>
              )}
              <div className="form-group">
                <label>Supplier / Farmer *</label>
                <select required value={supplier} onChange={handleSupplierChange}>
                  <option value="">— Select —</option>
                  <option value="Kamla Negi">Kamla Negi (Munsiyari)</option>
                  <option value="Dinesh Rawat">Dinesh Rawat (Lansdowne)</option>
                  <option value="Kumaon Naturals (Supplier)">Kumaon Naturals (Haldwani)</option>
                  <option value="manual">Enter Manually...</option>
                </select>
              </div>
              <div className="form-group slider-group">
                <label>Altitude (m): <span>{altitude}m</span></label>
                <input type="range" min="200" max="3500" step="50" value={altitude} onChange={e => setAltitude(e.target.value)} />
                <small className="slider-hint">{altitude > 1500 ? '✅ High altitude bonus applies' : 'Standard altitude'}</small>
              </div>
              <div className="form-group">
                <label>Storage Before Delivery *</label>
                <select required value={storageBefore} onChange={e => setStorageBefore(e.target.value)}>
                  <option value="same_day">Same day (Fresh)</option>
                  <option value="1_day">1 day</option>
                  <option value="2_3_days">2–3 days</option>
                  <option value="more_than_week">More than 1 week ⚠️</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Section 3 */}
          <motion.div className="form-section" {...fadeUp(0.3)}>
            <div className="form-section-header">
              <FlaskConical className="form-section-icon" size={20} />
              <h2>3. Ingredient Composition</h2>
            </div>
            <p className="section-help">Use sliders to set the preservative percentages of your recipe.</p>
            <div className="form-grid">
              <div className="form-group slider-group">
                <label>Salt Content: <span>{salt}%</span></label>
                <input type="range" min="0" max="25" step="0.5" value={salt} onChange={e => setSalt(Number(e.target.value))} />
              </div>
              <div className="form-group slider-group">
                <label>Mustard Oil: <span>{oil}%</span></label>
                <input type="range" min="0" max="40" step="1" value={oil} onChange={e => setOil(Number(e.target.value))} />
              </div>
              <div className="form-group slider-group">
                <label>Vinegar / Acetic: <span>{vinegar}%</span></label>
                <input type="range" min="0" max="10" step="0.5" value={vinegar} onChange={e => setVinegar(Number(e.target.value))} />
              </div>
              <div className="form-group slider-group">
                <label>Sugar: <span>{sugar}%</span></label>
                <input type="range" min="0" max="60" step="1" value={sugar} onChange={e => setSugar(Number(e.target.value))} />
              </div>
              <div className="form-group slider-group">
                <label>Turmeric: <span>{turmeric}%</span></label>
                <input type="range" min="0" max="10" step="0.5" value={turmeric} onChange={e => setTurmeric(Number(e.target.value))} />
              </div>
              <div className="form-group slider-group">
                <label className="critical-label">Final Moisture Estimate *: <span>{moisture}%</span></label>
                <input type="range" min="0" max="80" step="1" value={moisture} onChange={e => setMoisture(Number(e.target.value))} />
                <small className="slider-hint warning-hint">{moisture > 25 ? '⚠️ High moisture increases risk' : '✅ Safe moisture level'}</small>
              </div>
            </div>
            <div className="total-tracker">
              <strong>Total Additives: {totalPercent}%</strong>
              <small>Remaining {100 - totalPercent}% is the base ingredient.</small>
            </div>
          </motion.div>

          {/* Section 4 & 5 Combined visually */}
          <motion.div className="form-section" {...fadeUp(0.4)}>
            <div className="form-section-header">
              <Thermometer className="form-section-icon" size={20} />
              <h2>4. Processing & Packaging</h2>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Processing Method *</label>
                <select required value={method} onChange={e => setMethod(e.target.value)}>
                  <option value="">— Select —</option>
                  <option value="sun_dried">Sun-dried</option>
                  <option value="machine_dried">Machine-dried</option>
                  <option value="steam_cooked">Steam Cooked</option>
                  <option value="boiled">Boiled / Pressure</option>
                  <option value="raw">Raw / Minimal</option>
                </select>
              </div>
              <div className="form-group">
                <label>pH Level Estimate</label>
                <select value={ph} onChange={e => setPh(e.target.value)}>
                  <option value="not_tested">Not tested — let AI estimate</option>
                  <option value="below_3.5">Below 3.5 (Very Acidic)</option>
                  <option value="3.5_4.5">3.5–4.5 (Acidic)</option>
                  <option value="4.5_6">4.5–6.0 (Mildly Acidic)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Packaging Type *</label>
                <select required value={packaging} onChange={e => setPackaging(e.target.value)}>
                  <option value="">— Select —</option>
                  <option value="glass_jar">Glass Jar</option>
                  <option value="vacuum_sealed_pouch">Vacuum Pouch</option>
                  <option value="plastic_bottle">Plastic Bottle</option>
                  <option value="regular_plastic_pouch">Standard Pouch</option>
                </select>
              </div>
              <div className="form-group">
                <label>Sealed Storage Condition *</label>
                <select required value={storageSealed} onChange={e => setStorageSealed(e.target.value)}>
                  <option value="">— Select —</option>
                  <option value="room_temp_dry">Room Temp (Dry)</option>
                  <option value="cool_room">Cool Room</option>
                  <option value="refrigerated">Refrigerated</option>
                </select>
              </div>
            </div>
          </motion.div>

          <div className="form-submit-row">
            <AnimatePresence mode="popLayout">
              {!result && (
                <motion.button 
                  type="submit" 
                  className="btn-primary analyse-btn" 
                  disabled={isAnalysing}
                  layoutId="resultBox"
                  initial={{ borderRadius: 8 }}
                >
                  {isAnalysing ? (
                    <><span className="spinner"></span> Analysing with AI...</>
                  ) : (
                    <><Zap size={18} /> Generate AI Prediction</>
                  )}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
          {fetchError && (
            <div style={{ color: 'red', marginTop: '1rem', textAlign: 'center' }}>
              <AlertTriangle size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              {fetchError}
            </div>
          )}
        </form>

        {/* RESULT SECTION */}
        <AnimatePresence>
          {result && (
            <motion.div 
              className="result-container" 
              layoutId="resultBox"
              initial={{ borderRadius: 8, opacity: 0 }}
              animate={{ borderRadius: 16, opacity: 1 }}
              transition={{ type: 'spring', bounce: 0.2, duration: 0.8 }}
            >
              <div className="result-header">
                <h2><CheckCircle color="var(--sage)" size={24} /> Analysis Complete</h2>
              <p>For <strong>{productName || 'Your Product'}</strong></p>
            </div>
            
            <div className="result-grid">
              <div className="result-card primary-result">
                <h3><Calendar size={18} /> Sealed Shelf Life</h3>
                <div className="result-value">{result.sealed}</div>
                <div className="result-label-date">Best Before: {result.date}</div>
              </div>
              
              <div className="result-card">
                <h3><TestTube size={18} /> After Opening</h3>
                <div className="result-value sm">{result.opened}</div>
                <div className="result-sub">Requires refrigeration</div>
              </div>
            </div>

            <div className="result-feedback">
              <div className="feedback-box alert">
                <h4><AlertTriangle size={16} /> Risk Factors Detected</h4>
                <ul>
                  {result.risks.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
              
              <div className="feedback-box tip">
                <h4><Beaker size={16} /> Improvement Suggestions</h4>
                <ul>
                  {result.tips.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </motion.div>
  )
}
