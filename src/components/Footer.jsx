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
    <footer className="bg-midnight border-t border-emerald-900/50 text-white" role="contentinfo">
      <div className="section-container py-16">

        {/* Top grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">

          {/* Brand column */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🌾</span>
              <p className="font-heading font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-jade-300">HimShakti</p>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed font-light">
              AI-powered shelf life prediction for natural Himalayan food products.
              No chemicals. No guesswork. Just science.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-heading font-semibold text-sm uppercase tracking-widest text-emerald-500 mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-slate-400 hover:text-emerald-400 text-sm transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Project info */}
          <div>
            <h4 className="font-heading font-semibold text-sm uppercase tracking-widest text-emerald-500 mb-5">
              About This Project
            </h4>
            <ul className="space-y-3 text-slate-400 text-sm font-light">
              <li>TBI-GEU Summer Internship 2026</li>
              <li>Track: S26_FSD Frontend Foundations</li>
              <li>Company: HimShakti Food Processing</li>
              <li>Location: Uttarakhand, India</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-emerald-900/50 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-emerald-500/50 text-xs font-light">
          <p>© {currentYear} HimShakti Food Processing. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
