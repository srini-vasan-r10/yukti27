import React, { useState, useEffect, useRef } from 'react'
import { SPONSORS_DATA } from '../utils/confluenceData'

export default function Yukti26SponsorsPage({ onBackToHome }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef(null)
  const total = SPONSORS_DATA.length

  // Auto transition every 4.5 seconds
  useEffect(() => {
    if (isPaused) return
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total)
    }, 4500)
    return () => clearInterval(timerRef.current)
  }, [isPaused, total])

  const currentSponsor = SPONSORS_DATA[currentIndex] || SPONSORS_DATA[0]

  return (
    <div className="subpage-wrapper yukti26-blueprint-page">
      {/* ── RETURN BREADCRUMB ── */}
      <div className="blueprint-top-bar">
        <button className="back-breadcrumb-btn" onClick={onBackToHome}>
          ← Return to YUKTI ’27 Confluence
        </button>
      </div>

      <div className="blueprint-container">
        {/* ═══ SECTION 1: HEADER SPLIT ROW ═══ */}
        {/* Left: Titles & Gratitude statement | Right: Circular Yukti '26 Logo */}
        <div className="blueprint-header-row">
          <div className="blueprint-header-left">
            <h1 className="blueprint-title">YUKTI '26</h1>
            <div className="blueprint-subtitle">Values over Victory</div>

            {/* Gratitude statement with continuous divider line */}
            <div className="blueprint-gratitude-wrap">
              <p className="blueprint-gratitude-text">
                Our Grateful Acknowledgment to Last Year's Sponsors
              </p>
              <div className="blueprint-gratitude-divider" />
            </div>
          </div>

          <div className="blueprint-header-right">
            <div className="blueprint-yukti26-crest-frame">
              <img
                src="/yukti26-logo.webp"
                alt="YUKTI '26 Logo"
                className="blueprint-yukti26-logo-img"
              />
            </div>
          </div>
        </div>

        {/* ═══ SECTION 2: RADIANT SPOTLIGHT STAGE ═══ */}
        <div
          className="blueprint-stage-section"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Splayed Spotlight Beams aiming downwards toward the card */}
          <div className="blueprint-beams-rig">
            <div className="blueprint-beam b-fan-1" />
            <div className="blueprint-beam b-fan-2" />
            <div className="blueprint-beam b-fan-3" />
            <div className="blueprint-beam b-fan-4" />
            <div className="blueprint-beam b-fan-5" />
            <div className="blueprint-beam b-fan-6" />
          </div>

          {/* Pedestal Ground Glow */}
          <div className="blueprint-pedestal-glow" />

          {/* SPONSOR CARD: Split (Left: Sponsor Logo | Right: Type of Sponsor & Sponsor Name) */}
          <div className="blueprint-sponsor-card" key={currentIndex}>
            {/* Left Box: Logo of the Sponsor */}
            <div className="blueprint-card-left-logo">
              <div className="blueprint-logo-window">
                <img
                  src={currentSponsor.logoImg}
                  alt={currentSponsor.name}
                  className="blueprint-sponsor-actual-img"
                />
              </div>
            </div>

            {/* Right Box: Type of Sponsor + Underline + Sponsor Name */}
            <div className="blueprint-card-right-info">
              <div className="blueprint-type-wrap">
                <span className="blueprint-type-label mono">
                  {currentSponsor.type || 'Corporate Partner'}
                </span>
                <div className="blueprint-type-underline" />
              </div>

              <h2 className="blueprint-sponsor-name">
                {currentSponsor.name}
              </h2>

              <div className="blueprint-sponsor-counter mono">
                PARTNER {String(currentIndex + 1).padStart(2, '0')} OF {String(total).padStart(2, '0')}
              </div>
            </div>
          </div>

          {/* Step Indicator Dots */}
          <div className="blueprint-dots-rack">
            {SPONSORS_DATA.map((sp, idx) => (
              <button
                key={idx}
                className={`blueprint-dot-btn ${idx === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Jump to sponsor ${sp.name}`}
                title={sp.name}
              >
                <span className="dot-core" />
              </button>
            ))}
          </div>
        </div>

        {/* ═══ FOOTER COLLABORATION STRIP ═══ */}
        <div className="blueprint-footer-note">
          <p>
            Interested in partnering for <strong>YUKTI ’27: INTANGIBLES</strong>?
          </p>
          <a href="mailto:yukti@tsm.ac.in" className="btn" style={{ padding: '8px 20px', fontSize: '0.78rem' }}>
            Inquire Corporate Partnership
          </a>
        </div>
      </div>
    </div>
  )
}
