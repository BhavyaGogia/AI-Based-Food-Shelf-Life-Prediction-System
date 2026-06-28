import React from 'react'
import { Link } from 'react-router-dom'
import { Wheat, Shield, Cookie, Mail, MapPin, ExternalLink } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        {/* Brand column */}
        <div className="footer-col footer-brand-col">
          <div className="footer-brand">
            <Wheat size={20} strokeWidth={2} />
            <span className="footer-brand-name">HimShakti</span>
          </div>
          <p className="footer-tagline">
            AI-powered shelf life prediction for natural Himalayan food products.
            From farm to label — no chemical preservatives.
          </p>
          <div className="footer-location">
            <MapPin size={13} strokeWidth={2} />
            <span>Uttarakhand, India</span>
          </div>
        </div>

        {/* Quick links column */}
        <div className="footer-col">
          <h4 className="footer-col-title">Quick Links</h4>
          <Link to="/" className="footer-link">Home</Link>
          <Link to="/process" className="footer-link">How It Works</Link>
          <Link to="/about" className="footer-link">About</Link>
          <Link to="/help" className="footer-link">Help & FAQ</Link>
        </div>

        {/* Legal column */}
        <div className="footer-col">
          <h4 className="footer-col-title">Legal</h4>
          <Link to="/privacy" className="footer-link">
            <Shield size={13} strokeWidth={2} />
            Privacy Policy
          </Link>
          <Link to="/cookies" className="footer-link">
            <Cookie size={13} strokeWidth={2} />
            Cookie Policy
          </Link>
        </div>

        {/* Contact column */}
        <div className="footer-col">
          <h4 className="footer-col-title">Contact</h4>
          <a href="mailto:info@himshakti.com" className="footer-link">
            <Mail size={13} strokeWidth={2} />
            info@himshakti.com
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <p className="footer-copyright">
            © 2026 HimShakti Food Processing. All rights reserved.
          </p>
        </div>
      </div>

      {/* Gradient accent */}
      <div className="hero-footer-accent" />
    </footer>
  )
}
