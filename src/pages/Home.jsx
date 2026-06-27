import { useEffect, useRef } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Card from '../components/Card'
import Footer from '../components/Footer'

const featureCards = [
  {
    icon: '🔬',
    title: 'Predict Shelf Life',
    description: 'Enter your recipe and processing details. AI calculates exact shelf life in minutes — no lab required.',
  },
  {
    icon: '⚠️',
    title: 'Risk Warnings',
    description: 'Get instant alerts for high moisture, dangerous ingredient combinations, and fermentation risks.',
    badge: 'AI Powered',
    badgeColor: 'amber',
  },
  {
    icon: '💡',
    title: 'Improvement Tips',
    description: 'Receive actionable suggestions to extend shelf life naturally — more vinegar, less moisture, better packaging.',
  },
  {
    icon: '📅',
    title: 'Accurate Expiry Dates',
    description: 'Generate label-ready "Best Before" dates based on real food science, not guesswork.',
  },
  {
    icon: '🗺️',
    title: 'Sourcing Insights',
    description: 'Factor in farm altitude, harvest freshness, and transport distance into your prediction.',
    badge: 'New',
    badgeColor: 'emerald',
  },
  {
    icon: '📦',
    title: 'Packaging Impact',
    description: 'Compare glass jar vs vacuum pouch vs plastic bottle — see exactly how packaging changes shelf life.',
  },
]

const productCards = [
  {
    icon: '🌾',
    title: 'Millet Snacks',
    description: 'Jowar and Bajra based snacks. Shelf life: 6–8 months sealed (room temp), up to 12 months refrigerated.',
  },
  {
    icon: '🫙',
    title: 'Himalayan Pickles',
    description: 'Fruit and vegetable pickles with natural spices. Shelf life: 8–10 months sealed, longer with glass jar packaging.',
  },
  {
    icon: '🍹',
    title: 'Fruit Juices',
    description: 'Cold-pressed juices from Himalayan fruits. Short shelf life — refrigeration critical. 3–4 months sealed.',
  },
]

export default function Home() {
  const mainRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view')
        }
      })
    }, { threshold: 0.1 })
    
    if (mainRef.current) {
      const elements = mainRef.current.querySelectorAll('.reveal')
      elements.forEach(el => observer.observe(el))
    }
    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-slate-100 transition-colors duration-500 font-body">
      <Navbar />

      <main className="flex-grow" ref={mainRef}>
        {/* Hero Section */}
        <Hero />

        {/* Features Section — Bento Grid Style */}
        <section id="features" className="py-32 relative overflow-hidden">
          {/* Background Ambient Lighting */}
          <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-emerald-500/10 dark:bg-neon/10 blur-[150px] rounded-full pointer-events-none" />
          
          <div className="section-container relative z-10">
            <div className="text-center mb-24 reveal">
              <h2 className="section-heading">Everything You Need</h2>
              <p className="section-subheading max-w-2xl mx-auto mt-6">
                A complete AI toolkit for natural food shelf life prediction — built for HimShakti's production team.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featureCards.map((card, index) => (
                <div key={card.title} className={`reveal ${index === 0 || index === 3 ? 'md:col-span-2 lg:col-span-1' : ''}`} style={{ transitionDelay: `${index * 100}ms` }}>
                  <Card {...card} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="products" className="py-32 relative overflow-hidden bg-slate-100/80 dark:bg-dark-900/50 border-y border-slate-200 dark:border-white/10 transition-colors duration-500">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 dark:bg-violet/10 blur-[150px] rounded-full pointer-events-none animate-pulse-slow"></div>
          
          <div className="section-container relative z-10">
            <div className="text-center mb-24 reveal">
              <h2 className="section-heading">HimShakti Products</h2>
              <p className="section-subheading max-w-2xl mx-auto mt-6">
                Three core product categories — each with unique shelf life characteristics.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {productCards.map((card, index) => (
                <div key={card.title} className="reveal" style={{ transitionDelay: `${index * 120}ms` }}>
                  <Card {...card} isProduct={true} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* New Stats Section — Cinematic Counter Grid */}
        <section id="stats" className="py-28 bg-white dark:bg-gradient-to-r dark:from-dark-950 dark:via-dark-900 dark:to-dark-950 text-slate-900 dark:text-white relative overflow-hidden border-b border-slate-200 dark:border-white/10 transition-colors duration-500">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4wMykiLz48L3N2Zz4=')] dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-30" />
          <div className="section-container relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              {[
                { value: '500+', label: 'Predictions Run' },
                { value: '3', label: 'HimShakti Product Lines' },
                { value: '98%', label: 'Prediction Accuracy' },
                { value: '12 months', label: 'Max Shelf Life Tracked' },
              ].map((stat, i) => (
                <div key={stat.label} className="reveal p-6 glass-panel border border-slate-200 dark:border-white/10 hover:border-emerald-500/40 dark:hover:border-neon/40 transition-all duration-500 shadow-sm dark:shadow-none" style={{ transitionDelay: `${i * 120}ms` }}>
                  <p className="font-heading font-extrabold text-5xl sm:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-emerald-700 to-teal-600 dark:from-white dark:via-neon dark:to-emerald-400 mb-4 drop-shadow-sm">{stat.value}</p>
                  <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm font-bold uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner — Liquid Glass Glow Sweep */}
        <section id="cta-banner" className="py-32 relative overflow-hidden">
          <div className="section-container">
            <div className="glass-panel relative overflow-hidden p-16 sm:p-20 text-center rounded-3xl reveal border border-slate-200 dark:border-white/20 shadow-xl dark:shadow-glass-hover bg-white/90 dark:bg-gradient-to-br dark:from-dark-900/90 dark:via-dark-850/90 dark:to-dark-900/90">
              
              {/* Glow Blobs */}
              <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-emerald-500/10 dark:bg-neon/20 blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-blue-500/10 dark:bg-violet/20 blur-3xl pointer-events-none"></div>
              
              <div className="relative z-10 max-w-3xl mx-auto">
                <h2 className="font-heading font-extrabold text-4xl sm:text-6xl text-slate-900 dark:text-white mb-8 tracking-tight">
                  Ready to Predict Shelf Life?
                </h2>
                <p className="text-slate-700 dark:text-slate-300 text-lg sm:text-xl mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                  Week 4 Completed: Full AI analysis and the ingredient form are now live in the Dashboard.
                </p>
                <a
                  href="/dashboard"
                  id="cta-banner-btn"
                  className="btn-primary inline-flex items-center gap-4 text-xl px-12 py-5 shadow-md dark:shadow-glow hover:scale-105"
                >
                  <span className="text-2xl">🔬</span>
                  Go to Dashboard
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
