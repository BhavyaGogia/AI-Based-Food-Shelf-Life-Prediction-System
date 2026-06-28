import React from 'react'
import { motion } from 'framer-motion'
import {
  Building2, AlertCircle, Wheat, GlassWater, Utensils,
  Brain, Target, Lightbulb, MapPin, Award, Layers, Leaf
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

const products = [
  { icon: Wheat, name: 'Millet Snacks', desc: 'Nutrient-rich, traditionally roasted jowar and bajra.' },
  { icon: GlassWater, name: 'Himalayan Juices', desc: 'Cold-pressed natural fruit nectars.' },
  { icon: Utensils, name: 'Artisan Pickles', desc: 'Sun-dried, oil-preserved authentic recipes.' },
]

const challenges = [
  {
    num: '01',
    title: 'The Preservative Dilemma',
    desc: 'Modern food logistics demand long shelf lives, pushing companies to use chemical preservatives. HimShakti refuses this compromise, relying purely on natural preservation.',
    icon: AlertCircle,
  },
  {
    num: '02',
    title: 'Predicting Natural Spoilage',
    desc: 'Without synthetic chemicals, exact expiry dates fluctuate based on minute variations in moisture, salt, and processing altitude — making accurate prediction incredibly complex.',
    icon: Layers,
  },
]

const innovations = [
  { icon: Brain, name: 'AI-Powered Science', desc: 'Utilising deep learning to analyse food composition data.' },
  { icon: Target, name: 'Precision Adjustments', desc: 'Accounting for altitude, humidity, and transit distance.' },
  { icon: Lightbulb, name: 'Natural Extensions', desc: 'Providing organic suggestions to naturally extend shelf life.' },
]

export default function AboutPage() {
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
          <Building2 size={32} strokeWidth={1.5} />
        </div>
        <AnimatedText 
          text="About HimShakti" 
          className="page-hero-title" 
          delayOffset={0.1}
        />
        <p className="page-hero-subtitle">
          Pioneering the intersection of traditional Himalayan agriculture and advanced 
          food science to deliver 100% natural, preservative-free products.
        </p>
      </motion.section>

      {/* Products */}
      <section className="page-section">
        <motion.h2 className="section-title" {...fadeUp(0.1)}>Our Heritage Products</motion.h2>
        <div className="feature-grid three-col">
          {products.map((p, i) => (
            <motion.div key={i} className="feature-card" {...fadeUp(0.15 + i * 0.08)} whileHover={{ y: -4 }}>
              <div className="feature-icon"><p.icon size={24} strokeWidth={1.6} /></div>
              <h3 className="feature-card-title">{p.name}</h3>
              <p className="feature-card-desc">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* The Challenge */}
      <section className="page-section page-section-alt">
        <motion.h2 className="section-title" {...fadeUp(0.1)}>The Industry Challenge</motion.h2>
        <motion.p className="section-desc" {...fadeUp(0.15)}>
          Why predicting natural food lifespan is harder than it looks.
        </motion.p>
        <div className="problems-grid">
          {challenges.map((p, i) => (
            <motion.div key={i} className="problem-card" {...fadeUp(0.2 + i * 0.1)} whileHover={{ y: -4 }}>
              <div className="problem-header">
                <span className="problem-num">{p.num}</span>
                <p.icon size={22} strokeWidth={1.8} className="problem-icon" />
              </div>
              <h3 className="problem-card-title">{p.title}</h3>
              <p className="problem-card-desc">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Our Solution */}
      <section className="page-section">
        <motion.h2 className="section-title" {...fadeUp(0.1)}>Our AI Solution</motion.h2>
        <motion.div className="solution-banner" {...fadeUp(0.15)}>
          <div className="solution-badge">
            <Leaf size={18} strokeWidth={2} />
            Food Science meets AI
          </div>
          <h3 className="solution-title">Intelligent Shelf Life Prediction</h3>
          <p className="solution-desc">
            We developed a proprietary AI system that analyses the exact molecular drivers of food spoilage — 
            moisture percentage, pH levels, salt concentration, and processing methods. By combining traditional 
            preservation wisdom with Google Gemini's advanced models, we accurately calculate the exact 
            shelf life of our preservative-free batches.
          </p>
          <div className="solution-innovation">
            <Award size={16} strokeWidth={2} />
            Setting a new standard for natural food transparency and safety in India.
          </div>
        </motion.div>
      </section>

      {/* Technology */}
      <section className="page-section page-section-alt">
        <motion.h2 className="section-title" {...fadeUp(0.1)}>The Technology Behind It</motion.h2>
        <div className="feature-grid three-col">
          {innovations.map((s, i) => (
            <motion.div key={i} className="feature-card" {...fadeUp(0.15 + i * 0.06)} whileHover={{ y: -3 }}>
              <div className="feature-icon"><s.icon size={22} strokeWidth={1.7} /></div>
              <h3 className="feature-card-title">{s.name}</h3>
              <p className="feature-card-desc">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Location */}
      <section className="page-section">
        <motion.div className="location-banner" {...fadeUp(0.1)}>
          <MapPin size={20} strokeWidth={2} />
          <div>
            <h3 className="location-title">Headquartered in Uttarakhand, India</h3>
            <p className="location-desc">Sourcing directly from high-altitude Himalayan farmers.</p>
          </div>
        </motion.div>
      </section>
    </motion.div>
  )
}
