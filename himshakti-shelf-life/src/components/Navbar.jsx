import React, { useState } from 'react'
import { NavLink, useLocation, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Wheat, Home, Workflow, Info, HelpCircle, Beaker, Menu, X } from 'lucide-react'
import Magnetic from './Magnetic'

const navItems = [
  { to: '/', label: 'HOME', icon: Home },
  { to: '/process', label: 'PROCESS', icon: Workflow },
  { to: '/about', label: 'ABOUT', icon: Info },
  { to: '/help', label: 'HELP', icon: HelpCircle },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  return (
    <motion.nav
      className="hero-nav"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <NavLink to="/" className="nav-brand" aria-label="HimShakti Home">
        <span className="nav-icon-wrap">
          <Wheat size={20} strokeWidth={2} />
        </span>
        <span className="nav-title">HIMSHAKTI</span>
      </NavLink>

      {/* Desktop nav */}
      <div className="nav-links">
        {navItems.map((item) => (
          <Magnetic key={item.label}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''}`
              }
              end={item.to === '/'}
            >
              <item.icon size={14} strokeWidth={2} className="nav-link-icon" />
              {item.label}
            </NavLink>
          </Magnetic>
        ))}
        <Magnetic>
          <Link to="/predictor" className="nav-signin" id="nav-signin-btn">
            <Beaker size={13} strokeWidth={2.5} />
            PREDICTOR
          </Link>
        </Magnetic>
      </div>

      {/* Mobile hamburger */}
      <button
        className="nav-hamburger"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `mobile-menu-link ${isActive ? 'active' : ''}`
                }
                end={item.to === '/'}
                onClick={() => setMobileOpen(false)}
              >
                <item.icon size={16} strokeWidth={2} />
                {item.label}
              </NavLink>
            ))}
            <Link
              to="/predictor"
              className="mobile-menu-signin"
              onClick={() => setMobileOpen(false)}
            >
              <Beaker size={15} strokeWidth={2.5} />
              PREDICTOR
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
