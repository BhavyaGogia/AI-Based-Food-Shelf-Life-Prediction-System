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
    <footer className="bg-forest-900 text-white" role="contentinfo">
      <div className="section-container py-12">

        {/* Top grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">

          {/* Brand column */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🌾</span>
              <p className="font-heading font-bold text-lg">HimShakti</p>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              AI-powered shelf life prediction for natural Himalayan food products.
              No chemicals. No guesswork. Just science.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-amber-400 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-white/60 hover:text-white text-sm transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Project info */}
          <div>
            <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-amber-400 mb-4">
              About This Project
            </h4>
            <ul className="space-y-2 text-white/60 text-sm">
              <li>TBI-GEU Summer Internship 2026</li>
              <li>Track: S26_FSD Frontend Foundations</li>
              <li>Company: HimShakti Food Processing</li>
              <li>Location: Uttarakhand, India</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-white/40 text-xs">
          <p>© {currentYear} HimShakti Food Processing. All rights reserved.</p>
          <p>Built with ❤️ for TBI-GEU Internship Program</p>
        </div>
      </div>
    </footer>
  )
}
