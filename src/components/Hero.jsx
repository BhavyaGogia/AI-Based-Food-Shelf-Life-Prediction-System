import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-midnight text-white"
    >
      {/* Dynamic Background */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/40 via-midnight to-midnight" />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-emerald-500/20 blur-[100px] mix-blend-screen" />
        <div className="absolute top-1/4 -left-20 w-[400px] h-[400px] rounded-full bg-jade-500/10 blur-[80px] mix-blend-screen" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-emerald-700/20 blur-[120px] mix-blend-screen" />
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNykiLz48L3N2Zz4=')] opacity-50" />
      </div>

      <div className="section-container relative py-20 sm:py-32 lg:py-40">
        <div className="max-w-4xl mx-auto text-center">

          {/* Badge */}
          <div className="animate-fade-in inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-emerald-500/30 rounded-full px-5 py-2 mb-8 text-sm font-medium text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <span className="animate-pulse">✨</span>
            <span className="tracking-wide">HimShakti Food Processing — Uttarakhand</span>
          </div>

          {/* Headline */}
          <h1 className="animate-fade-up font-heading font-extrabold text-5xl sm:text-6xl lg:text-7xl leading-[1.1] mb-8 tracking-tight">
            Predict. <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-jade-300">Protect.</span> Preserve.
          </h1>

          {/* Subtext */}
          <p className="animate-fade-up opacity-0 [animation-delay:200ms] [animation-fill-mode:forwards] text-xl sm:text-2xl text-slate-300 leading-relaxed mb-10 max-w-2xl mx-auto font-light">
            AI-powered shelf life prediction for natural Himalayan foods — no chemical preservatives,
            no guesswork. Get exact expiry dates instantly.
          </p>

          {/* CTAs */}
          <div className="animate-fade-up opacity-0 [animation-delay:400ms] [animation-fill-mode:forwards] flex flex-wrap items-center justify-center gap-5">
            <Link
              id="hero-cta-primary"
              to="/dashboard"
              className="btn-primary text-lg px-10 py-4 shadow-glow"
            >
              <span className="text-xl">🔬</span>
              Analyse Shelf Life
            </Link>
            <Link
              id="hero-cta-secondary"
              to="/about"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-heading font-semibold px-10 py-4 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
            >
              Learn More →
            </Link>
          </div>

          {/* Stats row */}
          <div className="animate-fade-up opacity-0 [animation-delay:600ms] [animation-fill-mode:forwards] mt-20 pt-10 border-t border-white/10 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { icon: '🌾', value: '6', label: 'Product Types' },
              { icon: '🤖', value: 'AI', label: 'Powered by Gemini' },
              { icon: '📅', value: '100%', label: 'Natural Foods' },
            ].map((stat) => (
              <div key={stat.label} className="text-center group">
                <p className="text-3xl mb-2 filter drop-shadow-md group-hover:scale-110 transition-transform duration-300">{stat.icon}</p>
                <p className="font-heading font-bold text-3xl text-emerald-400 mb-1">{stat.value}</p>
                <p className="text-sm text-slate-400 uppercase tracking-widest font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
