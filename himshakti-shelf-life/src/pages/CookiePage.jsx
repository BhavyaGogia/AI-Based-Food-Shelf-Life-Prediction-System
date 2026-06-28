import React from 'react'
import { motion } from 'framer-motion'
import {
  Cookie, Settings, BarChart3, Shield, Clock,
  ToggleLeft, Mail, Info
} from 'lucide-react'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
})

const cookieTypes = [
  {
    icon: Shield,
    name: 'Essential Cookies',
    required: true,
    desc: 'Required for the website to function. They enable core features like user authentication, form state preservation, and security.',
    examples: ['Session ID', 'Login token', 'CSRF protection'],
  },
  {
    icon: Settings,
    name: 'Functional Cookies',
    required: false,
    desc: 'Remember your preferences and settings, such as theme mode, form field defaults, and language preferences.',
    examples: ['Theme preference', 'Last used product type', 'Form auto-fill data'],
  },
  {
    icon: BarChart3,
    name: 'Analytics Cookies',
    required: false,
    desc: 'Help us understand how you use the application so we can improve it. All data is anonymised and aggregated.',
    examples: ['Page views', 'Feature usage frequency', 'Prediction count'],
  },
]

export default function CookiePage() {
  return (
    <div className="page-container">
      {/* Hero */}
      <motion.section className="page-hero" {...fadeUp(0)}>
        <div className="page-hero-icon">
          <Cookie size={32} strokeWidth={1.5} />
        </div>
        <h1 className="page-hero-title">Cookie Policy</h1>
        <p className="page-hero-subtitle">
          We use cookies to enhance your experience with the HimShakti shelf life
          predictor. Here's what they do and how to manage them.
        </p>
        <div className="policy-meta">
          <Clock size={13} strokeWidth={2} />
          <span>Last updated: June 2026</span>
        </div>
      </motion.section>

      {/* What are cookies */}
      <section className="page-section">
        <motion.div className="policy-section" {...fadeUp(0.1)}>
          <div className="policy-section-header">
            <Info size={22} strokeWidth={1.7} className="policy-icon" />
            <h2 className="policy-section-title">What Are Cookies?</h2>
          </div>
          <p className="policy-text">
            Cookies are small text files stored on your device when you visit a
            website. They help the site remember your preferences and improve your
            experience. Our application uses minimal cookies focused on functionality
            rather than advertising.
          </p>
        </motion.div>
      </section>

      {/* Cookie types */}
      <section className="page-section page-section-alt">
        <motion.h2 className="section-title" {...fadeUp(0.1)}>
          Types of Cookies We Use
        </motion.h2>
        <div className="cookie-grid">
          {cookieTypes.map((cookie, i) => (
            <motion.div
              key={i}
              className="cookie-card"
              {...fadeUp(0.15 + i * 0.08)}
              whileHover={{ y: -3 }}
            >
              <div className="cookie-card-header">
                <div className="cookie-card-icon">
                  <cookie.icon size={20} strokeWidth={1.8} />
                </div>
                <div className="cookie-card-meta">
                  <h3 className="cookie-card-title">{cookie.name}</h3>
                  <span className={`cookie-badge ${cookie.required ? 'cookie-required' : 'cookie-optional'}`}>
                    {cookie.required ? 'Required' : 'Optional'}
                  </span>
                </div>
              </div>
              <p className="cookie-card-desc">{cookie.desc}</p>
              <div className="cookie-examples">
                <span className="cookie-examples-label">Examples:</span>
                {cookie.examples.map((ex, j) => (
                  <span key={j} className="cookie-example-tag">{ex}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Managing cookies */}
      <section className="page-section">
        <motion.div className="policy-section" {...fadeUp(0.1)}>
          <div className="policy-section-header">
            <ToggleLeft size={22} strokeWidth={1.7} className="policy-icon" />
            <h2 className="policy-section-title">Managing Your Cookies</h2>
          </div>
          <ul className="policy-list">
            <motion.li className="policy-item" {...fadeUp(0.12)}>
              <strong>Browser settings:</strong> Most browsers allow you to block or delete
              cookies through their settings menu. Note that blocking essential cookies
              may affect site functionality.
            </motion.li>
            <motion.li className="policy-item" {...fadeUp(0.16)}>
              <strong>In-app preferences:</strong> You can manage functional and analytics
              cookies from your account settings page.
            </motion.li>
            <motion.li className="policy-item" {...fadeUp(0.2)}>
              <strong>Clear all data:</strong> To remove all stored cookies and local
              data, use your browser's "Clear browsing data" feature.
            </motion.li>
          </ul>
        </motion.div>
      </section>

      {/* Contact */}
      <section className="page-section page-section-alt">
        <motion.div className="policy-contact" {...fadeUp(0.1)}>
          <Mail size={20} strokeWidth={1.8} />
          <div>
            <h3>Questions about cookies?</h3>
            <p>
              Contact us at{' '}
              <a href="mailto:privacy@himshakti.com">privacy@himshakti.com</a>
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
