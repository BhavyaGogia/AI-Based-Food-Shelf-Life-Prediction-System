import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HelpCircle, ChevronDown, BookOpen, Microscope, Brain,
  AlertTriangle, Lightbulb, Package, Thermometer, Salad,
  Mail, MessageCircle
} from 'lucide-react'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
})

const faqs = [
  {
    q: 'What is the Shelf Life Predictor?',
    a: 'It\'s an AI-powered tool that analyses food ingredients, processing methods, and packaging to predict exactly how long a food product will last — giving the correct expiry date without expensive lab testing.',
    icon: Microscope,
  },
  {
    q: 'How does the AI predict shelf life?',
    a: 'The system uses Google Gemini API with food science context. It evaluates salt %, oil content, moisture levels, pH, processing method, packaging type, and storage conditions to calculate a precise shelf life estimate.',
    icon: Brain,
  },
  {
    q: 'What product types are supported?',
    a: 'Currently supports Millet Snacks (Jowar/Bajra based), Fruit Pickles (Himalayan fruit + spices), Vegetable Pickles, Fruit Juices (cold-pressed/fresh), Mixed Millet Products, and custom product types.',
    icon: Package,
  },
  {
    q: 'How accurate is the prediction?',
    a: 'The AI prediction is calibrated against food science principles for natural preservatives. While it provides a strong estimate, the system also flags confidence levels and suggests lab testing for borderline cases.',
    icon: AlertTriangle,
  },
  {
    q: 'What do the risk warnings mean?',
    a: 'Risk warnings alert you to potential issues — like moisture levels that could shorten shelf life, ingredient combinations that risk fermentation, or packaging that doesn\'t provide adequate oxygen barrier.',
    icon: AlertTriangle,
  },
  {
    q: 'How do improvement suggestions work?',
    a: 'The AI analyses your recipe and suggests changes that could extend shelf life naturally — like increasing vinegar %, switching to vacuum-sealed packaging, or adjusting the processing method.',
    icon: Lightbulb,
  },
  {
    q: 'What ingredients affect shelf life the most?',
    a: 'Moisture content is the #1 factor. After that: salt % (natural preservative), oil content (oxygen barrier in pickles), pH level (acidity prevents bacterial growth), and processing method (heat kills pathogens).',
    icon: Salad,
  },
  {
    q: 'Does storage condition matter?',
    a: 'Absolutely. Room temperature storage in a dry place vs humid kitchen, refrigerated vs frozen — each dramatically changes the shelf life. The AI generates separate sealed and after-opening estimates.',
    icon: Thermometer,
  },
]

const steps = [
  { num: '01', title: 'Open the predictor', desc: 'Navigate to the shelf life prediction form from the homepage.' },
  { num: '02', title: 'Fill in product details', desc: 'Select product type, enter ingredient percentages, choose processing method.' },
  { num: '03', title: 'Select packaging & storage', desc: 'Choose packaging type and expected storage conditions.' },
  { num: '04', title: 'Click "Analyse Shelf Life"', desc: 'The AI processes your input in seconds.' },
  { num: '05', title: 'Review the report', desc: 'Get shelf life, expiry date, risk warnings, and improvement tips.' },
]

function FAQItem({ faq, index, isOpen, toggle }) {
  return (
    <motion.div
      className={`faq-item ${isOpen ? 'faq-item-open' : ''}`}
      {...fadeUp(0.1 + index * 0.04)}
    >
      <button className="faq-question" onClick={toggle} aria-expanded={isOpen}>
        <div className="faq-q-left">
          <faq.icon size={18} strokeWidth={1.8} className="faq-q-icon" />
          <span>{faq.q}</span>
        </div>
        <ChevronDown
          size={18}
          strokeWidth={2}
          className={`faq-chevron ${isOpen ? 'faq-chevron-open' : ''}`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="faq-answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <p>{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function HelpPage() {
  const [openFAQ, setOpenFAQ] = useState(0)

  return (
    <div className="page-container">
      {/* Hero */}
      <motion.section className="page-hero" {...fadeUp(0)}>
        <div className="page-hero-icon">
          <HelpCircle size={32} strokeWidth={1.5} />
        </div>
        <h1 className="page-hero-title">Help & FAQ</h1>
        <p className="page-hero-subtitle">
          Everything you need to know about using the AI Shelf Life Prediction System.
        </p>
      </motion.section>

      {/* Quick Start Guide */}
      <section className="page-section">
        <motion.h2 className="section-title" {...fadeUp(0.1)}>
          <BookOpen size={22} strokeWidth={1.8} className="section-title-icon" />
          Quick Start Guide
        </motion.h2>
        <div className="quickstart-grid">
          {steps.map((s, i) => (
            <motion.div key={i} className="quickstart-step" {...fadeUp(0.15 + i * 0.06)}>
              <span className="quickstart-num">{s.num}</span>
              <div className="quickstart-text">
                <h4 className="quickstart-title">{s.title}</h4>
                <p className="quickstart-desc">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="page-section page-section-alt">
        <motion.h2 className="section-title" {...fadeUp(0.1)}>
          Frequently Asked Questions
        </motion.h2>
        <div className="faq-list">
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              index={i}
              isOpen={openFAQ === i}
              toggle={() => setOpenFAQ(openFAQ === i ? -1 : i)}
            />
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="page-section">
        <motion.h2 className="section-title" {...fadeUp(0.1)}>Still Need Help?</motion.h2>
        <div className="contact-grid">
          <motion.div className="contact-card" {...fadeUp(0.15)} whileHover={{ y: -3 }}>
            <Mail size={22} strokeWidth={1.7} />
            <h4>Email Support</h4>
            <p>Reach us at <a href="mailto:info@himshakti.com">info@himshakti.com</a></p>
          </motion.div>
          <motion.div className="contact-card" {...fadeUp(0.2)} whileHover={{ y: -3 }}>
            <MessageCircle size={22} strokeWidth={1.7} />
            <h4>Live Chat</h4>
            <p>Available weekdays, 9 AM — 5 PM IST</p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
