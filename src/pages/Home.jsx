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
    badgeColor: 'forest',
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
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <Hero />

        {/* Features Section */}
        <section id="features" className="py-16 sm:py-24 bg-cream-100">
          <div className="section-container">
            <div className="text-center mb-12">
              <h2 className="section-heading">Everything You Need</h2>
              <p className="section-subheading max-w-xl mx-auto">
                A complete AI toolkit for natural food shelf life prediction — built for HimShakti's production team.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featureCards.map((card) => (
                <Card key={card.title} {...card} />
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="products" className="py-16 sm:py-24 bg-white">
          <div className="section-container">
            <div className="text-center mb-12">
              <h2 className="section-heading">HimShakti Products</h2>
              <p className="section-subheading max-w-xl mx-auto">
                Three core product categories — each with unique shelf life characteristics.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {productCards.map((card) => (
                <Card key={card.title} {...card} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section id="cta-banner" className="py-16 bg-amber-500">
          <div className="section-container text-center">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-forest-900 mb-4">
              Ready to Predict Shelf Life?
            </h2>
            <p className="text-forest-800 text-lg mb-8 max-w-xl mx-auto">
              AI analysis coming in Week 3. The full ingredient form will be available in the Dashboard.
            </p>
            <a
              href="/dashboard"
              id="cta-banner-btn"
              className="inline-flex items-center gap-2 bg-forest-700 hover:bg-forest-600 text-white font-heading font-semibold px-8 py-3.5 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              🔬 Go to Dashboard
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
