import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Login', to: '/login' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-forest-100 shadow-sm">
      <div className="section-container">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" id="nav-logo">
            <span className="text-2xl">🌾</span>
            <div className="leading-tight">
              <p className="font-heading font-bold text-forest-700 text-base group-hover:text-forest-600 transition-colors">
                HimShakti
              </p>
              <p className="text-xs text-amber-600 font-medium -mt-0.5">
                Shelf Life Predictor
              </p>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                id={`nav-${link.label.toLowerCase()}`}
                to={link.to}
                className={`px-4 py-2 rounded-lg font-body text-sm font-medium transition-all duration-150 ${
                  isActive(link.to)
                    ? 'bg-forest-700 text-white'
                    : 'text-gray-600 hover:bg-forest-50 hover:text-forest-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            id="nav-hamburger"
            className="md:hidden p-2 rounded-lg text-forest-700 hover:bg-forest-50 transition-colors"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 animate-slide-down" id="nav-mobile-menu">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg font-body text-sm font-medium transition-all ${
                    isActive(link.to)
                      ? 'bg-forest-700 text-white'
                      : 'text-gray-600 hover:bg-forest-50 hover:text-forest-700'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
