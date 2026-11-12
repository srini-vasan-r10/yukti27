import React, { useState, useEffect, useRef } from 'react'
import { SPONSORS_DATA } from '../utils/confluenceData'

export default function Yukti26SponsorsPage({ onBackToHome, onOpenRegister }) {
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
    <div className="subpage-wrapper yukti26-stage-wrapper">
      {/* ── THEATRICAL STAGE AMBIENCE ── */}
      <div className="stage-aurora-bg" />
      <div className="stage-spotlight-beam beam-left" />
      <div className="stage-spotlight-beam beam-center-left" />
      <div className="stage-spotlight-beam beam-center-right" />
      <div className="stage-spotlight-beam beam-right" />
      <div className="stage-pedestal-light" />

      <div className="subpage-hero" style={{ paddingBottom: '1rem', position: 'relative', zIndex: 10 }}>
        <div className="subpage-hero-content text-center" style={{ maxWidth: '880px', margin: '0 auto' }}>
          <button className="back-breadcrumb-btn" onClick={onBackToHome} style={{ margin: '0 auto 1.2rem' }}>
            ← Return to YUKTI ’27 Confluence
          </button>

          {/* YUKTI '26 Crest & Badge */}
          <div className="yukti26-crest-holder">
            <div className="yukti26-crest-frame">
              <img
                src="/yukti26-logo.png"
                alt="YUKTI '26 - Values Over Victory"
                className="yukti26-logo-img"
              />
            </div>
          </div>

          <div className="eyebrow mono" style={{ justifyContent: 'center', marginTop: '1.2rem', color: 'var(--gold-figure)' }}>
            Honoring the Pillars of YUKTI ’26
          </div>

          <h1 className="subpage-title yukti26-title">
            YUKTI ’26 <span className="gold">SPONSORS</span>
          </h1>

          <div className="yukti26-theme-subtitle mono">
            VALUES OVER VICTORY · HALL OF PATRONS
          </div>

          <p className="subpage-lead" style={{ margin: '0.8rem auto 0', maxWidth: '640px' }}>
            A heartfelt tribute to the esteemed industry titans and corporate partners whose visionary support powered the landmark triumph of YUKTI ’26.
          </p>
        </div>
      </div>

      {/* ── INTERACTIVE SPOTLIGHT STAGE ── */}
      <div
        className="stage-display-container"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="stage-pedestal-base">
          {/* Card with 3D Holographic Frosted Glass effect */}
          <div className="stage-sponsor-card" key={currentIndex}>
            <div className="stage-card-glow" />

            {/* Rank / Tier Badge Provision */}
            <div className="stage-card-top-row">
              <span className="sponsor-rank-pill mono">
                <span className="rank-star">✦</span>
                <span className="rank-label">{currentSponsor.type || 'Corporate Partner'}</span>
              </span>
              <span className="sponsor-counter-badge mono">
                {String(currentIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </span>
            </div>

            {/* Featured Center Logo */}
            <div className="stage-logo-presentation">
              <div className="stage-logo-halo" />
              <div className="stage-logo-plate">
                <img
                  src={currentSponsor.logoImg}
                  alt={currentSponsor.name}
                  className="stage-sponsor-full-logo"
                />
              </div>
            </div>

            {/* Sponsor Brand Name */}
            <div className="stage-sponsor-identity">
              <h2 className="stage-sponsor-name">{currentSponsor.name}</h2>
              <div className="stage-sponsor-line" />
            </div>
          </div>
        </div>

        {/* ── STEP INDICATOR DOTS ONLY (No Controls) ── */}
        <div className="stage-dots-rack">
          {SPONSORS_DATA.map((sp, idx) => (
            <button
              key={idx}
              className={`stage-dot-pill ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Jump to sponsor ${sp.name}`}
              title={sp.name}
            >
              <span className="dot-fill" />
            </button>
          ))}
        </div>
      </div>

      {/* ── CALL TO COLLABORATE BANNER ── */}
      <div className="section" style={{ paddingTop: '20px', paddingBottom: '80px', position: 'relative', zIndex: 10 }}>
        <div className="legacy-frosted-container" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          <span className="mono gold" style={{ letterSpacing: '0.16em', fontSize: '0.72rem' }}>
            BECOME PART OF THE LEGACY
          </span>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3.2vw, 2.4rem)', margin: '10px 0 14px' }}>
            Partner with <span className="gold">YUKTI ’27: INTANGIBLES</span>
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: '580px', margin: '0 auto 24px' }}>
            Connect with 1,800+ executive delegates, national talent pools, and premier institutions across India. Reach out to our corporate relations panel.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="mailto:yukti@tsm.ac.in" className="btn">
              Inquire Corporate Partnership ↗
            </a>
            <button className="btn ghost" onClick={onBackToHome}>
              Back to Confluence Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
