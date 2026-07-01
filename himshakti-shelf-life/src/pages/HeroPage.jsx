import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ClipboardList, Brain, BarChart3, ArrowRight } from 'lucide-react'
import AnimatedText from '../components/AnimatedText'
import Magnetic from '../components/Magnetic'
import { Link } from 'react-router-dom'
import StarfieldCanvas from '../components/StarfieldCanvas'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
})

const stagger = {
  animate: { transition: { staggerChildren: 0.12 } },
}

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
}

const processSteps = [
  {
    icon: ClipboardList,
    title: 'Input Product Data',
    desc: 'Enter your food composition — salt, oil, moisture, packaging & more.',
  },
  {
    icon: Brain,
    title: 'AI Analyses',
    desc: 'Gemini AI applies food science rules to your unique Himalayan recipe.',
  },
  {
    icon: BarChart3,
    title: 'Get Shelf Life Report',
    desc: 'Receive exact expiry dates, risk warnings & improvement suggestions.',
  },
]

export default function HeroPage() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  })
  
  // Parallax: moving up slightly faster than the scroll
  const yImage = useTransform(scrollYProgress, [0, 1], [0, -150])

  return (
    <motion.div 
      className="hero-page" 
      ref={ref}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <StarfieldCanvas />
      {/* === HERO CONTENT === */}
      <motion.section
        className="hero-content"
        variants={stagger}
        initial="initial"
        animate="animate"
      >
        <AnimatedText 
          text="Welcome." 
          className="hero-heading" 
          delayOffset={0.1}
        />
        <motion.p className="hero-subtext" {...fadeUp(0.6)}>
          AI-powered shelf life prediction for natural Himalayan food products.
          <br />
          From farm to label — powered by food science & Gemini AI.
        </motion.p>
      </motion.section>

      {/* === HERO ILLUSTRATION BANNER === */}
      <motion.div
        className="illustration-band"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{ y: yImage }}
      >
        <img
          src="/hero-banner.jpg"
          alt="Himalayan woman farmer walking toward HimShakti food products — pickles, foxnuts, juice, and spices in watercolor art style"
          className="hero-banner-img"
        />
      </motion.div>

      {/* === PROCESS FLOW SECTION === */}
      <motion.section
        className="process-section"
        id="process"
        variants={stagger}
        initial="initial"
        animate="animate"
      >
        <motion.h2 className="process-title" {...fadeUp(0.4)}>
          How It Works
        </motion.h2>
        <div className="process-steps">
          {processSteps.map((step, i) => (
            <motion.div
              key={i}
              className="process-card"
              {...fadeUp(0.5 + i * 0.15)}
              whileHover={{ y: -6, boxShadow: '0 12px 40px rgba(180, 130, 100, 0.15)' }}
            >
              <div className="process-icon-wrap">
                <span className="process-icon">
                  <step.icon size={22} strokeWidth={1.8} />
                </span>
                <span className="process-step-num">0{i + 1}</span>
              </div>
              <h3 className="process-card-title">{step.title}</h3>
              <p className="process-card-desc">{step.desc}</p>
              {i < processSteps.length - 1 && (
                <div className="process-connector">
                  <ArrowRight size={20} strokeWidth={1.5} color="#c4a882" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* === PREDICTOR CTA === */}
      <motion.section
        className="login-section"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', paddingBottom: '60px' }}
      >
        <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--brown-text)' }}>Ready to analyse your product?</h2>
        <Magnetic>
          <Link to="/predictor" className="login-button" style={{ display: 'inline-flex', width: 'auto', padding: '16px 32px', textDecoration: 'none' }}>
            LAUNCH PREDICTOR
          </Link>
        </Magnetic>
      </motion.section>
    </motion.div>
  )
}
