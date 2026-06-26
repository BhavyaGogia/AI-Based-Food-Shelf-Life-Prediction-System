import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Login', to: '/login' },
]

/**
 * Navbar — sticky top navigation bar with dark/light mode toggle.
 * Uses ThemeContext to read and toggle the current theme.
 */
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-midnight/80 backdrop-blur-md border-b border-white/20 dark:border-white/10 shadow-sm transition-colors duration-300">
      <div className="section-container">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group" id="nav-logo">
            <span className="text-3xl filter drop-shadow-md group-hover:scale-110 transition-transform duration-300">🌾</span>
            <div className="leading-tight">
              <p className="font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-jade-600 dark:from-emerald-400 dark:to-jade-300 text-xl tracking-tight transition-all duration-300">
                HimShakti
              </p>
              <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80 font-medium tracking-wide">
                Shelf Life Predictor
              </p>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-2 bg-white/50 dark:bg-slate-800/50 p-1.5 rounded-2xl border border-white/40 dark:border-white/10 shadow-sm">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                id={`nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                to={link.to}
                className={`px-5 py-2 rounded-xl font-heading text-sm font-semibold transition-all duration-300 ${
                  isActive(link.to)
                    ? 'bg-gradient-to-r from-emerald-600 to-jade-500 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700/80 hover:text-emerald-700 dark:hover:text-emerald-300'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Dark / Light toggle */}
            <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1"></div>
            
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-white/80 dark:hover:bg-slate-700/80 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-300"
            >
              {theme === 'dark' ? (
                /* Sun icon */
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              ) : (
                /* Moon icon */
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile: theme toggle + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              id="theme-toggle-mobile-btn"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-xl text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            <button
              id="nav-hamburger"
              className="p-2 rounded-xl text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 pt-2 animate-slide-down" id="nav-mobile-menu">
            <div className="flex flex-col gap-2 p-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl border border-emerald-100 dark:border-emerald-900/50 shadow-lg">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl font-heading text-sm font-semibold transition-all ${
                    isActive(link.to)
                      ? 'bg-gradient-to-r from-emerald-600 to-jade-500 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-700 hover:text-emerald-700'
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
