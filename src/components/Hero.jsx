import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

export default function Hero() {
  const heroRef = useRef(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect()
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
      }
    }

    const currentHero = heroRef.current
    if (currentHero) {
      currentHero.addEventListener('mousemove', handleMouseMove)
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view')
        }
      })
    }, { threshold: 0.1 })

    if (heroRef.current) {
      const elements = heroRef.current.querySelectorAll('.reveal, .reveal-left, .reveal-right')
      elements.forEach(el => observer.observe(el))
    }
    return () => {
      if (currentHero) {
        currentHero.removeEventListener('mousemove', handleMouseMove)
      }
      observer.disconnect()
    }
  }, [])

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen overflow-hidden bg-transparent text-slate-900 dark:text-white pt-36 pb-24 flex items-center justify-center transition-colors duration-500"
    >
      {/* Dynamic Aurora Background & Spotlight */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[800px] h-[800px] rounded-full aurora-bg opacity-30 transition-all duration-300 ease-out"
          style={{
            left: `${mousePos.x - 400}px`,
            top: `${mousePos.y - 400}px`,
          }}
        />
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-500/10 dark:bg-neon/10 blur-[150px] animate-blob-rotate" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500/10 dark:bg-violet/10 blur-[150px] animate-blob-rotate" style={{ animationDelay: '5s' }} />

        {/* Futuristic grid overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4wMykiLz48L3N2Zz4=')] dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-40" />
      </div>

      <div className="section-container relative z-10 w-full">
        {/* Top Header: Badge */}
        <div className="text-center lg:text-left mb-8 reveal-left">
          <div className="inline-flex items-center gap-3 bg-white/80 dark:bg-white/5 backdrop-blur-[30px] border border-emerald-500/20 dark:border-white/15 rounded-full px-6 py-2.5 text-xs sm:text-sm font-bold text-emerald-700 dark:text-neon shadow-sm dark:shadow-glow">
            <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-neon animate-ping"></span>
            <span className="tracking-widest uppercase">HimShakti Food Processing — Uttarakhand</span>
          </div>
        </div>

        {/* Full width watercolor banner container - min-h pushes text down so you must scroll */}
        <div className="w-full min-h-[60vh] lg:min-h-[70vh] flex items-center justify-center mb-16 relative">
          <div className="w-full rounded-3xl overflow-hidden shadow-xl border border-emerald-500/20 dark:border-white/15 reveal relative group cursor-pointer transition-all duration-500 bg-[#fbf6f0] hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.6)] dark:hover:shadow-[0_0_50px_-10px_rgba(52,211,153,0.5)] hover:-translate-y-1">
            
            {/* -mt-[6%] crops the top white space and -mb-[1%] crops the bottom, while w-full h-auto guarantees the left/right woman and jars are NEVER cut! */}
            <img src="/watercolor_banner.jpeg" alt="HimShakti Brand Story" className="w-full h-auto block -mt-[8%] md:-mt-[6%] -mb-[2%] md:-mb-[1%] group-hover:scale-[1.02] transition-transform duration-700" />
            
            {/* Blinking / Pulsing overlay effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:animate-pulse bg-emerald-500/10 mix-blend-overlay transition-opacity duration-500 pointer-events-none z-10"></div>
            
            <div className="absolute inset-0 rounded-3xl ring-2 ring-inset ring-transparent group-hover:ring-emerald-500 dark:group-hover:ring-neon transition-all duration-500 pointer-events-none z-20"></div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-12">

          {/* Left Text Content (55%) */}
          <div className="w-full lg:w-[55%] text-left">
            {/* Cinematic Headline */}
            <h1 className="reveal-left [transition-delay:100ms] font-heading font-extrabold text-5xl sm:text-7xl lg:text-8xl text-slate-900 dark:text-white leading-[1.05] mb-8 tracking-tight">
              Predict. <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-blue-600 dark:from-emerald-400 dark:via-neon dark:to-violet animate-gradient">
                Protect.
              </span> Preserve.
            </h1>

            {/* Subtext */}
            <p className="reveal-left [transition-delay:200ms] text-lg sm:text-xl text-slate-700 dark:text-slate-300 leading-relaxed mb-10 max-w-xl font-medium">
              AI-powered shelf life prediction for natural Himalayan foods — no chemical preservatives,
              no guesswork. Get exact expiry dates instantly.
            </p>

            {/* CTAs */}
            <div className="reveal-left [transition-delay:300ms] flex flex-wrap items-center gap-6">
              <Link
                id="hero-cta-primary"
                to="/dashboard"
                className="btn-primary text-lg px-9 py-4 shadow-md dark:shadow-glow hover:scale-105"
              >
                <span className="text-2xl">🔬</span>
                Analyse Shelf Life
              </Link>
              <Link
                id="hero-cta-secondary"
                to="/about"
                className="btn-secondary text-lg px-9 py-4 group"
              >
                Learn More <span className="transition-transform group-hover:translate-x-2">→</span>
              </Link>
            </div>

            {/* Stats row */}
            <div className="reveal-left [transition-delay:400ms] mt-16 pt-10 border-t border-slate-200 dark:border-white/10 grid grid-cols-3 gap-8 max-w-lg">
              {[
                { icon: '🌾', value: '6', label: 'Product Types' },
                { icon: '🤖', value: 'AI', label: 'Advanced AI Model' },
                { icon: '📅', value: '100%', label: 'Natural Foods' },
              ].map((stat) => (
                <div key={stat.label} className="group text-left">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl filter drop-shadow-md group-hover:scale-110 transition-transform duration-300">{stat.icon}</span>
                    <span className="font-heading font-extrabold text-3xl text-emerald-600 dark:text-neon">{stat.value}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Card Content (45%) — Floating Liquid Glass Dashboard Preview */}
          <div className="w-full lg:w-[45%] relative reveal-right [transition-delay:200ms]">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400 to-blue-500 dark:from-neon dark:to-violet blur-3xl opacity-20 animate-pulse-slow rounded-3xl" />

            <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/80 dark:border-white/20 shadow-xl dark:shadow-glass-hover animate-float relative overflow-hidden group hover:border-emerald-500/50 dark:hover:border-neon/50 transition-colors duration-500">

              {/* Glossy reflection sweep */}
              <div className="absolute -top-40 -left-40 w-80 h-80 bg-white/30 dark:bg-white/10 rounded-full blur-2xl group-hover:translate-x-96 group-hover:translate-y-96 transition-transform duration-1000 pointer-events-none" />

              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200 dark:border-white/10">
                <h3 className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white tracking-tight">Live Prediction Preview</h3>
                <span className="flex h-3.5 w-3.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 dark:bg-neon opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 dark:bg-neon shadow-sm dark:shadow-glow"></span>
                </span>
              </div>

              <div className="space-y-4 mb-8">
                {/* Row 1 */}
                <div className="flex items-center justify-between p-5 bg-white/80 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/10 hover:border-emerald-500/40 dark:hover:border-neon/40 transition-all duration-300 shadow-sm">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl bg-slate-100 dark:bg-dark-800 p-2.5 rounded-xl border border-slate-200 dark:border-white/10">🌾</span>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-base">Millet Snacks</p>
                      <p className="text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">Fresh</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-heading font-extrabold text-xl text-emerald-600 dark:text-neon">8 months</p>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="flex items-center justify-between p-5 bg-white/80 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/10 hover:border-emerald-500/40 dark:hover:border-neon/40 transition-all duration-300 shadow-sm">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl bg-slate-100 dark:bg-dark-800 p-2.5 rounded-xl border border-slate-200 dark:border-white/10">🫙</span>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-base">Himalayan Pickles</p>
                      <p className="text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">Fresh</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-heading font-extrabold text-xl text-emerald-600 dark:text-neon">9 months</p>
                  </div>
                </div>

                {/* Row 3 */}
                <div className="flex items-center justify-between p-5 bg-white/80 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/10 hover:border-pink-500/40 dark:hover:border-pinkGlow/40 transition-all duration-300 shadow-sm">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl bg-slate-100 dark:bg-dark-800 p-2.5 rounded-xl border border-slate-200 dark:border-white/10">🍹</span>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-base">Fruit Juices</p>
                      <p className="text-pink-600 dark:text-pinkGlow text-xs font-bold uppercase tracking-wider">Expiring</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-heading font-extrabold text-xl text-pink-600 dark:text-pinkGlow">3 months</p>
                  </div>
                </div>
              </div>

              <Link to="/dashboard" className="group flex items-center justify-center w-full py-4 bg-emerald-600 text-white dark:bg-white/10 dark:text-white border border-transparent dark:border-white/15 hover:bg-emerald-700 dark:hover:bg-neon dark:hover:text-dark-950 rounded-2xl font-heading font-bold text-base transition-all duration-500 shadow-md dark:shadow-glow">
                Open Dashboard <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
              </Link>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
