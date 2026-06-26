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
  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <Hero />

        {/* Features Section */}
        <section id="features" className="py-20 sm:py-28 relative">
          <div className="section-container relative z-10">
            <div className="text-center mb-16 animate-fade-up">
              <h2 className="section-heading">Everything You Need</h2>
              <p className="section-subheading max-w-xl mx-auto">
                A complete AI toolkit for natural food shelf life prediction — built for HimShakti's production team.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featureCards.map((card, index) => (
                <div key={card.title} className="animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <Card {...card} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="products" className="py-20 sm:py-28 relative overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-400/20 dark:bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none"></div>
          
          <div className="section-container relative z-10">
            <div className="text-center mb-16 animate-fade-up">
              <h2 className="section-heading">HimShakti Products</h2>
              <p className="section-subheading max-w-xl mx-auto">
                Three core product categories — each with unique shelf life characteristics.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {productCards.map((card, index) => (
                <div key={card.title} className="animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <Card {...card} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section id="cta-banner" className="py-20 relative">
          <div className="section-container">
            <div className="glass-panel relative overflow-hidden p-12 text-center rounded-3xl animate-fade-up">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-emerald-400/20 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-jade-400/20 blur-3xl"></div>
              
              <div className="relative z-10">
                <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-emerald-950 dark:text-emerald-50 mb-6 tracking-tight">
                  Ready to Predict Shelf Life?
                </h2>
                <p className="text-emerald-800/80 dark:text-emerald-200/80 text-lg sm:text-xl mb-10 max-w-2xl mx-auto font-light">
                  Week 4 Completed: Full AI analysis and the ingredient form are now live in the Dashboard.
                </p>
                <a
                  href="/dashboard"
                  id="cta-banner-btn"
                  className="btn-primary inline-flex items-center gap-3 text-lg px-8 py-4"
                >
                  <span className="text-xl">🔬</span>
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
