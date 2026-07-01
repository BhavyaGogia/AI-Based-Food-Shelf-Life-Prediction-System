import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'

/**
 * Navbar — floating liquid glass top navigation bar with dark/light mode toggle.
 */
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const { isAuthenticated, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Dynamic links based on authentication state
  const getNavLinks = () => {
    const links = [
      { label: 'Home', to: '/' },
      { label: 'About', to: '/about' },
    ]
    if (isAuthenticated) {
      links.push({ label: 'Dashboard', to: '/dashboard' })
      links.push({ label: 'Logout', isAction: true })
    } else {
      links.push({ label: 'Login', to: '/login' })
    }
    return links
  }

  const currentLinks = getNavLinks()

  return (
    <nav className="fixed w-full top-0 z-50 px-4 sm:px-8 pt-4 transition-all duration-500 pointer-events-none">
      <div className={`max-w-7xl mx-auto pointer-events-auto transition-all duration-500 rounded-3xl ${
        isScrolled 
          ? 'bg-white/90 dark:bg-dark-900/90 backdrop-blur-xl border border-black/5 dark:border-white/15 shadow-lg py-3 px-6' 
          : 'bg-white/70 dark:bg-dark-900/50 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-sm py-4 px-8'
      }`}>
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group" id="nav-logo">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 dark:bg-neon/20 border border-emerald-500/30 dark:border-neon/40 flex items-center justify-center text-2xl shadow-sm dark:shadow-glow group-hover:scale-110 transition-transform duration-500">
              🌾
            </div>
            <div className="leading-tight">
              <p className="font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-emerald-700 dark:from-white dark:to-neon text-xl tracking-tight">
                HimShakti
              </p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest">
                Shelf Life Predictor
              </p>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-2 bg-black/5 dark:bg-white/5 p-1.5 rounded-2xl border border-black/5 dark:border-white/10 backdrop-blur-md">
            {currentLinks.map((link) => (
              link.isAction ? (
                <button
                  key={link.label}
                  onClick={handleLogout}
                  className="px-6 py-2.5 rounded-xl font-heading text-sm font-bold transition-all duration-500 text-slate-700 dark:text-slate-300 hover:text-pink-600 dark:hover:text-pinkGlow hover:bg-black/5 dark:hover:bg-white/10"
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.to}
                  id={`nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  to={link.to}
                  className={`px-6 py-2.5 rounded-xl font-heading text-sm font-bold transition-all duration-500 ${
                    isActive(link.to)
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white dark:from-emerald-500 dark:to-neon dark:text-dark-950 shadow-md dark:shadow-glow'
                      : 'text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </Link>
              )
            ))}

            {/* Dark / Light toggle */}
            <div className="w-px h-6 bg-slate-300 dark:bg-white/20 mx-2"></div>
            
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="group p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-neon hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-300"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5 group-hover:rotate-45 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 group-hover:-rotate-45 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              className="p-2.5 rounded-xl text-emerald-700 dark:text-neon bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10"
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
              className="p-2.5 rounded-xl text-emerald-700 dark:text-neon bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10"
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
          <div className="md:hidden pb-4 pt-4 animate-slide-down" id="nav-mobile-menu">
            <div className="flex flex-col gap-2 p-4 bg-white/95 dark:bg-dark-900/90 backdrop-blur-[30px] rounded-2xl border border-black/5 dark:border-white/15 shadow-lg">
              {currentLinks.map((link) => (
                link.isAction ? (
                  <button
                    key={link.label}
                    onClick={() => { handleLogout(); setMenuOpen(false); }}
                    className="px-5 py-3 rounded-xl font-heading text-sm font-bold transition-all text-left text-slate-700 dark:text-slate-300 hover:text-pink-600 dark:hover:text-pinkGlow hover:bg-black/5 dark:hover:bg-white/10"
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className={`px-5 py-3 rounded-xl font-heading text-sm font-bold transition-all ${
                      isActive(link.to)
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white dark:from-emerald-500 dark:to-neon dark:text-dark-950 shadow-md'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
