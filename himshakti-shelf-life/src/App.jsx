import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Lenis from 'lenis'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HeroPage from './pages/HeroPage'
import ProcessPage from './pages/ProcessPage'
import AboutPage from './pages/AboutPage'
import HelpPage from './pages/HelpPage'
import PrivacyPage from './pages/PrivacyPage'
import CookiePage from './pages/CookiePage'
import PredictorPage from './pages/PredictorPage'
import CustomCursor from './components/CustomCursor'

function AnimatedRoutes() {
  const location = useLocation()
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HeroPage />} />
        <Route path="/process" element={<ProcessPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/cookies" element={<CookiePage />} />
        <Route path="/predictor" element={<PredictorPage />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  return (
    <BrowserRouter>
      <div className="app-layout">
        <CustomCursor />
        <Navbar />
        <main className="app-main">
          <AnimatedRoutes />
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
