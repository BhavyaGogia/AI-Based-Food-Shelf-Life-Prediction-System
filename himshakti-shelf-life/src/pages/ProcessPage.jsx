import React from 'react'
import { motion } from 'framer-motion'
import {
  Settings2, ListChecks, TestTube, Thermometer, Box, PackageOpen, BrainCircuit, Activity,
  ArrowDown, Calendar, AlertTriangle, Lightbulb, Tag, ShieldCheck, Zap
} from 'lucide-react'
import AnimatedText from '../components/AnimatedText'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
})

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
}

const steps = [
  { icon: Settings2, title: 'Define the Product', desc: 'Select product type and harvest details. High-altitude sourcing yields different preservation traits.' },
  { icon: ListChecks, title: 'Ingredient Profiling', desc: 'Input the exact percentage of salt, mustard oil, vinegar, and turmeric — the core natural preservatives.' },
  { icon: TestTube, title: 'Moisture & pH Analysis', desc: 'Crucial step: Moisture percentage is the primary driver of microbial growth. We measure this down to the percent.' },
  { icon: Thermometer, title: 'Processing Variables', desc: 'Is it sun-dried for 3 days? Steam cooked? Cold pressed? Heat alters the baseline bacterial load.' },
  { icon: Box, title: 'Packaging Barriers', desc: 'Specify airtight glass jars vs porous plastic pouches. Oxygen exposure dictates oxidative rancidity.' },
  { icon: PackageOpen, title: 'Storage Environments', desc: 'Map out the temperature journey from our warehouse (sealed) to the customer\'s shelf (after opening).' },
  { icon: BrainCircuit, title: 'AI Computation', desc: 'Our proprietary Gemini AI model correlates these 35+ variables against established food microbiology baselines.' },
  { icon: Activity, title: 'Comprehensive Output', desc: 'Instantly receive exact Best Before dates, risk matrices, and natural preservation improvement strategies.' },
]

const aiOutputs = [
  { icon: Calendar, label: 'Predicted Shelf Life', value: '~8 months at room temperature', color: 'var(--sage)' },
  { icon: Tag, label: 'Label-Ready Date', value: 'Best Before: March 2027', color: 'var(--golden)' },
  { icon: AlertTriangle, label: 'Risk Warning', value: 'Moisture >12% accelerates spoilage', color: 'var(--terracotta)' },
  { icon: Lightbulb, label: 'Preservation Tip', value: 'Add 2% vinegar to extend to 11 months', color: 'var(--sage)' },
  { icon: ShieldCheck, label: 'Safety Validation', value: 'Ingredient synergy looks safe', color: 'var(--sage-dark)' },
  { icon: Zap, label: 'Fermentation Alert', value: 'Low acid + sugar detected — check pH', color: 'var(--terracotta-dark)' },
]

export default function ProcessPage() {
  return (
    <motion.div 
      className="page-container"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Hero */}
      <motion.section className="page-hero" {...fadeUp(0)}>
        <div className="page-hero-icon">
          <BrainCircuit size={32} strokeWidth={1.5} />
        </div>
        <AnimatedText 
          text="The Science Behind the Prediction" 
          className="page-hero-title" 
          delayOffset={0.1}
        />
        <p className="page-hero-subtitle">
          How HimShakti transforms 35+ complex food science variables into a precise, 
          actionable shelf life prediction in seconds.
        </p>
      </motion.section>

      {/* 8-Step Flow */}
      <section className="page-section">
        <motion.h2 className="section-title" {...fadeUp(0.1)}>
          The Evaluation Workflow
        </motion.h2>
        <div className="timeline-grid">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              className="timeline-card"
              {...fadeUp(0.1 + i * 0.06)}
              whileHover={{ y: -4, boxShadow: '0 10px 35px rgba(180, 130, 100, 0.12)' }}
            >
              <div className="timeline-num">{String(i + 1).padStart(2, '0')}</div>
              <div className="timeline-icon">
                <step.icon size={22} strokeWidth={1.8} />
              </div>
              <h3 className="timeline-card-title">{step.title}</h3>
              <p className="timeline-card-desc">{step.desc}</p>
              {i < steps.length - 1 && (
                <div className="timeline-arrow">
                  <ArrowDown size={16} strokeWidth={1.5} color="var(--golden)" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* AI Input → Output */}
      <section className="page-section page-section-alt">
        <motion.h2 className="section-title" {...fadeUp(0.1)}>
          What the Engine Delivers
        </motion.h2>
        <motion.p className="section-desc" {...fadeUp(0.15)}>
          The system doesn't just guess a date. It provides a comprehensive analysis of 
          the product's chemical composition and physical vulnerabilities.
        </motion.p>
        <div className="ai-output-grid">
          {aiOutputs.map((item, i) => (
            <motion.div
              key={i}
              className="ai-output-card"
              {...fadeUp(0.15 + i * 0.06)}
              whileHover={{ y: -3 }}
            >
              <div className="ai-output-icon" style={{ color: item.color }}>
                <item.icon size={20} strokeWidth={1.8} />
              </div>
              <div className="ai-output-text">
                <span className="ai-output-label">{item.label}</span>
                <span className="ai-output-value">{item.value}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  )
}
