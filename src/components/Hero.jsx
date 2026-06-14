import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-gradient-to-br from-forest-700 via-forest-800 to-forest-900 text-white"
    >
      {/* Decorative leaf shapes */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-forest-600 opacity-20" />
        <div className="absolute bottom-0 -left-12 w-56 h-56 rounded-full bg-amber-600 opacity-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white opacity-[0.03]" />
      </div>

      <div className="section-container relative py-20 sm:py-28 lg:py-36">
        <div className="max-w-3xl">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6 text-sm font-medium text-amber-300">
            <span>🏔️</span>
            <span>HimShakti Food Processing — Uttarakhand</span>
          </div>

          {/* Headline */}
          <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
            Predict.&nbsp;
            <span className="text-amber-400">Protect.</span>
            &nbsp;Preserve.
          </h1>

          {/* Subtext */}
          <p className="text-lg sm:text-xl text-white/80 leading-relaxed mb-8 max-w-xl">
            AI-powered shelf life prediction for natural Himalayan foods — no chemical preservatives,
            no guesswork. Get exact expiry dates and improvement tips instantly.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <Link
              id="hero-cta-primary"
              to="/dashboard"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-forest-900 font-heading font-semibold px-8 py-3.5 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <span>🔬</span>
              Analyse Shelf Life
            </Link>
            <Link
              id="hero-cta-secondary"
              to="/about"
              className="inline-flex items-center gap-2 border-2 border-white/40 hover:border-white text-white hover:bg-white/10 font-heading font-semibold px-8 py-3.5 rounded-lg transition-all duration-200"
            >
              Learn More →
            </Link>
          </div>

          {/* Stats row */}
          <div className="mt-12 pt-8 border-t border-white/20 grid grid-cols-3 gap-6 max-w-md">
            {[
              { icon: '🌾', value: '6', label: 'Product Types' },
              { icon: '🤖', value: 'AI', label: 'Powered by Gemini' },
              { icon: '📅', value: '100%', label: 'Natural Foods' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl mb-0.5">{stat.icon}</p>
                <p className="font-heading font-bold text-xl text-amber-400">{stat.value}</p>
                <p className="text-xs text-white/60 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
