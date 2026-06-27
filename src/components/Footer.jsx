import { Link } from 'react-router-dom'

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Login', to: '/login' },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-100 dark:bg-dark-950 border-t border-slate-200 dark:border-white/10 text-slate-900 dark:text-white relative overflow-hidden transition-colors duration-500" role="contentinfo">
      {/* Glow ambient background */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/5 dark:bg-neon/5 blur-[120px] pointer-events-none" />

      <div className="section-container py-20 relative z-10">

        {/* Top grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">

          {/* Brand column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-2xl shadow-sm">
                🌾
              </div>
              <p className="font-heading font-extrabold text-3xl text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-emerald-700 dark:from-white dark:to-neon tracking-tight">HimShakti</p>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed font-medium max-w-sm">
              AI-powered shelf life prediction for natural Himalayan food products.
              No chemicals. No guesswork. Just science.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-widest text-emerald-700 dark:text-neon mb-6">
              Quick Links
            </h4>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-white text-base transition-colors duration-300 font-medium hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Project info */}
          <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-widest text-emerald-700 dark:text-neon mb-6">
              About This Project
            </h4>
            <ul className="space-y-4 text-slate-600 dark:text-slate-400 text-base font-medium">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-neon"></span> TBI-GEU Summer Internship 2026</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-violet"></span> Track: S26_FSD Frontend Foundations</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400"></span> Company: HimShakti Food Processing</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-pink-500 dark:bg-pinkGlow"></span> Location: Uttarakhand, India</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 dark:border-white/10 pt-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 dark:text-slate-400 text-sm font-medium">
          <p>© {currentYear} HimShakti Food Processing. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
