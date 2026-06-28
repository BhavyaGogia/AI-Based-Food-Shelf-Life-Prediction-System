import React from 'react'
import { motion } from 'framer-motion'
import {
  Shield, Database, Eye, Lock, UserCheck, Clock,
  Mail, FileText, Server, Trash2
} from 'lucide-react'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
})

const sections = [
  {
    icon: Database,
    title: 'Information We Collect',
    items: [
      'Product composition data (ingredient percentages, processing methods, packaging types) entered into the shelf life prediction form.',
      'Account information (username, email) if you create an account.',
      'Usage data such as pages visited, features used, and prediction history.',
      'Device and browser information for analytics and compatibility purposes.',
    ],
  },
  {
    icon: Eye,
    title: 'How We Use Your Information',
    items: [
      'To generate AI-powered shelf life predictions using Google Gemini API.',
      'To improve the accuracy and quality of our prediction models.',
      'To maintain your prediction history for future reference.',
      'To communicate service updates, security notices, and system improvements.',
    ],
  },
  {
    icon: Server,
    title: 'Data Storage & Security',
    items: [
      'Product data is stored in MongoDB Atlas with encryption at rest.',
      'We use HTTPS for all data transmission between your browser and our servers.',
      'API keys and sensitive credentials are stored as environment variables, never in source code.',
      'Access to the database is restricted to authorized applications only.',
    ],
  },
  {
    icon: Lock,
    title: 'Third-Party Services',
    items: [
      'Google Gemini API — processes food composition data to generate shelf life predictions. Subject to Google\'s Privacy Policy.',
      'MongoDB Atlas — cloud database for storing product and analysis data.',
      'Vercel / GitHub Pages — hosting platform for the web application.',
      'We do not sell or share your personal information with advertisers.',
    ],
  },
  {
    icon: UserCheck,
    title: 'Your Rights',
    items: [
      'Access — Request a copy of the data we hold about you.',
      'Correction — Request correction of inaccurate data.',
      'Deletion — Request deletion of your account and associated data.',
      'Portability — Request your data in a machine-readable format.',
    ],
  },
  {
    icon: Trash2,
    title: 'Data Retention',
    items: [
      'Prediction history is retained for 12 months for your reference.',
      'Account data is retained until you request deletion.',
      'Anonymous, aggregated analytics data may be retained indefinitely for product improvement.',
      'You can delete your prediction history at any time from your account settings.',
    ],
  },
]

export default function PrivacyPage() {
  return (
    <div className="page-container">
      {/* Hero */}
      <motion.section className="page-hero" {...fadeUp(0)}>
        <div className="page-hero-icon">
          <Shield size={32} strokeWidth={1.5} />
        </div>
        <h1 className="page-hero-title">Privacy Policy</h1>
        <p className="page-hero-subtitle">
          Your privacy matters. Here's how we handle your data in the HimShakti
          AI Shelf Life Prediction System.
        </p>
        <div className="policy-meta">
          <Clock size={13} strokeWidth={2} />
          <span>Last updated: June 2026</span>
        </div>
      </motion.section>

      {/* Policy Sections */}
      {sections.map((section, i) => (
        <section
          key={i}
          className={`page-section ${i % 2 === 1 ? 'page-section-alt' : ''}`}
        >
          <motion.div className="policy-section" {...fadeUp(0.1)}>
            <div className="policy-section-header">
              <section.icon size={22} strokeWidth={1.7} className="policy-icon" />
              <h2 className="policy-section-title">{section.title}</h2>
            </div>
            <ul className="policy-list">
              {section.items.map((item, j) => (
                <motion.li key={j} className="policy-item" {...fadeUp(0.12 + j * 0.04)}>
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </section>
      ))}

      {/* Contact */}
      <section className="page-section">
        <motion.div className="policy-contact" {...fadeUp(0.1)}>
          <Mail size={20} strokeWidth={1.8} />
          <div>
            <h3>Questions about our Privacy Policy?</h3>
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
