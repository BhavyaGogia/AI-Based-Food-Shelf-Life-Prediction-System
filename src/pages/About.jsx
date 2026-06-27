import { useEffect, useRef } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function About() {
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
      const elements = mainRef.current.querySelectorAll('.reveal-left, .reveal-right, .reveal')
      elements.forEach(el => observer.observe(el))
    }
    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-slate-100 transition-colors duration-500 font-body">
      <Navbar />

      <main className="flex-grow" ref={mainRef}>

        {/* Hero banner (center aligned) with ultra-dark gradient background and shimmer */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-100 via-emerald-50 to-slate-200 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950 text-slate-900 dark:text-white py-32 flex items-center justify-center text-center border-b border-slate-200 dark:border-white/10 transition-colors duration-500">
          {/* Shimmer Effect */}
          <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent,25%,rgba(0,0,0,0.03),50%,transparent,75%,rgba(0,0,0,0.03))] dark:bg-[linear-gradient(110deg,transparent,25%,rgba(255,255,255,0.05),50%,transparent,75%,rgba(255,255,255,0.05))] bg-[length:200%_100%] animate-shimmer pointer-events-none"></div>
          {/* Glows */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 dark:bg-neon/10 blur-[150px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 dark:bg-violet/10 blur-[150px] rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
          
          <div className="section-container relative z-10 reveal">
            <h1 className="font-heading font-extrabold text-5xl sm:text-7xl lg:text-8xl mb-6 tracking-tight drop-shadow-sm text-slate-900 dark:text-white">
              About This Project
            </h1>
            <p className="text-slate-700 dark:text-slate-300 text-xl sm:text-2xl max-w-2xl mx-auto font-medium">
              Understanding the mission behind the AI-Based Food Shelf Life Prediction System.
            </p>
          </div>
        </div>

        {/* Alternating 50/50 image/text sections */}
        <div className="py-32 overflow-hidden">
          <div className="section-container space-y-32">

            {/* About HimShakti */}
            <section className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20" aria-labelledby="about-company">
              <div className="w-full lg:w-1/2 reveal-left">
                <div className="relative aspect-square lg:aspect-[4/3] rounded-3xl overflow-hidden shadow-xl dark:shadow-glass-hover group border border-slate-200 dark:border-white/15 bg-white dark:bg-gradient-to-br dark:from-dark-900 dark:via-dark-850 dark:to-dark-900">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-8xl group-hover:scale-110 group-hover:rotate-[5deg] transition-all duration-500 filter drop-shadow-lg">🏢</span>
                  </div>
                  <div className="absolute inset-0 border-2 border-emerald-500/30 dark:border-neon/30 rounded-3xl z-10 pointer-events-none"></div>
                </div>
              </div>
              <div className="w-full lg:w-1/2 reveal-right">
                <h2 id="about-company" className="font-heading font-extrabold text-3xl sm:text-5xl text-slate-900 dark:text-white mb-6 tracking-tight">
                  🏢 About HimShakti
                </h2>
                <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed font-medium">
                  HimShakti Food Processing is a company based in Uttarakhand that produces
                  natural Himalayan food products — millet snacks, fruit pickles, and cold-pressed juices —
                  using traditional recipes with <strong className="text-emerald-700 dark:text-neon font-bold">no chemical preservatives</strong>.
                </p>
              </div>
            </section>

            {/* The Problem */}
            <section className="flex flex-col lg:flex-row-reverse items-center gap-16 lg:gap-20" aria-labelledby="about-problem">
              <div className="w-full lg:w-1/2 reveal-right">
                <div className="relative aspect-square lg:aspect-[4/3] rounded-3xl overflow-hidden shadow-xl dark:shadow-glass-hover group border border-slate-200 dark:border-white/15 bg-white dark:bg-gradient-to-br dark:from-dark-900 dark:via-dark-850 dark:to-dark-900">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-8xl group-hover:scale-110 group-hover:-rotate-[5deg] transition-all duration-500 filter drop-shadow-lg">❗</span>
                  </div>
                  <div className="absolute inset-0 border-2 border-rose-500/30 dark:border-pinkGlow/30 rounded-3xl z-10 pointer-events-none"></div>
                </div>
              </div>
              <div className="w-full lg:w-1/2 reveal-left">
                <h2 id="about-problem" className="font-heading font-extrabold text-3xl sm:text-5xl text-slate-900 dark:text-white mb-6 tracking-tight">
                  ❗ The Problem
                </h2>
                <div className="space-y-6 text-slate-700 dark:text-slate-300 text-lg leading-relaxed font-medium">
                  <p>
                    Without chemical preservatives, shelf life varies for every batch depending on ingredients,
                    processing method, and packaging. HimShakti's production team currently estimates expiry
                    dates manually — causing food waste, customer complaints, and inconsistent labeling.
                  </p>
                  <p>
                    Large companies use expensive lab testing. No affordable tool exists for small food
                    companies in India.
                  </p>
                </div>
              </div>
            </section>

            {/* Our Solution */}
            <section className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20" aria-labelledby="about-solution">
              <div className="w-full lg:w-1/2 reveal-left">
                <div className="relative aspect-square lg:aspect-[4/3] rounded-3xl overflow-hidden shadow-xl dark:shadow-glass-hover group border border-slate-200 dark:border-white/15 bg-white dark:bg-gradient-to-br dark:from-dark-900 dark:via-dark-850 dark:to-dark-900">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-8xl group-hover:scale-110 group-hover:rotate-[5deg] transition-all duration-500 filter drop-shadow-lg">🤖</span>
                  </div>
                  <div className="absolute inset-0 border-2 border-blue-500/30 dark:border-violet/30 rounded-3xl z-10 pointer-events-none"></div>
                </div>
              </div>
              <div className="w-full lg:w-1/2 reveal-right">
                <h2 id="about-solution" className="font-heading font-extrabold text-3xl sm:text-5xl text-slate-900 dark:text-white mb-6 tracking-tight">
                  🤖 Our Solution
                </h2>
                <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed font-medium">
                  This web application allows production staff to enter recipe and processing details,
                  and uses <strong className="text-emerald-700 dark:text-neon font-bold">Advanced AI Intelligence Models</strong> to predict exact shelf life — giving
                  the correct expiry date, risk warnings, and suggestions to make products last longer naturally.
                </p>
              </div>
            </section>

          </div>
        </div>

        {/* Glassmorphism Cards for 'Internship Context' */}
        <section aria-labelledby="about-intern" className="py-32 relative bg-slate-100/80 dark:bg-dark-900/50 overflow-hidden border-t border-slate-200 dark:border-white/10 transition-colors duration-500">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 dark:bg-neon/10 blur-[150px] rounded-full pointer-events-none"></div>
          
          <div className="section-container relative z-10 reveal">
            <div className="glass-panel max-w-4xl mx-auto p-12 sm:p-16 text-center border border-slate-200 dark:border-white/20 shadow-xl dark:shadow-glass-hover hover:-translate-y-2 transition-transform duration-500 bg-white/90 dark:bg-dark-900/90">
              <h2 id="about-intern" className="font-heading font-extrabold text-3xl sm:text-5xl text-slate-900 dark:text-white mb-6 tracking-tight">
                👤 Internship Context
              </h2>
              <p className="text-slate-700 dark:text-slate-300 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto font-medium">
                This project is built as part of the <strong className="text-emerald-700 dark:text-neon font-bold">TBI-GEU Summer Internship 2026</strong>,
                Track S26_FSD (Frontend + Full Stack Development). The goal is to demonstrate real-world
                problem solving using React, Tailwind CSS, and Advanced AI Integration.
              </p>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
