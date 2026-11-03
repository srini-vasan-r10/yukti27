import React from 'react'
import { PREVIOUS_SPONSORS } from '../utils/confluenceData'

export default function SponsorsSection() {
  // Vibrant brand colours for each sponsor tile
  const brandStyles = {
    'TCS': { bg: 'linear-gradient(135deg, #1e3a8a, #0284c7)', accent: '#38bdf8', glow: 'rgba(56, 189, 248, 0.45)' },
    'HCL': { bg: 'linear-gradient(135deg, #0369a1, #06b6d4)', accent: '#22d3ee', glow: 'rgba(34, 211, 238, 0.45)' },
    'TVS': { bg: 'linear-gradient(135deg, #991b1b, #dc2626)', accent: '#f87171', glow: 'rgba(239, 68, 68, 0.45)' },
    'ICICI': { bg: 'linear-gradient(135deg, #9a3412, #ea580c)', accent: '#fb923c', glow: 'rgba(249, 115, 22, 0.45)' },
    'MARICO': { bg: 'linear-gradient(135deg, #15803d, #22c55e)', accent: '#4ade80', glow: 'rgba(74, 222, 128, 0.45)' },
    'FEDERAL': { bg: 'linear-gradient(135deg, #1e40af, #3b82f6)', accent: '#60a5fa', glow: 'rgba(96, 165, 250, 0.45)' },
    'APOLLO': { bg: 'linear-gradient(135deg, #701a75, #a21caf)', accent: '#e879f9', glow: 'rgba(217, 70, 239, 0.45)' },
    'ZOHO': { bg: 'linear-gradient(135deg, #b91c1c, #d97706)', accent: '#fde047', glow: 'rgba(250, 204, 21, 0.45)' },
    'HBL': { bg: 'linear-gradient(135deg, #374151, #4b5563)', accent: '#e9c878', glow: 'rgba(233, 200, 120, 0.45)' },
    'RED BULL': { bg: 'linear-gradient(135deg, #1e1b4b, #be123c)', accent: '#f43f5e', glow: 'rgba(244, 63, 94, 0.55)' },
    'MIRCHI': { bg: 'linear-gradient(135deg, #be123c, #f97316)', accent: '#fdba74', glow: 'rgba(251, 146, 60, 0.45)' },
    'STARTUP': { bg: 'linear-gradient(135deg, #0f766e, #14b8a6)', accent: '#5eead4', glow: 'rgba(45, 212, 191, 0.45)' },
  }

  // Flatten sponsors for the floating visual marquee
  const allSponsors = PREVIOUS_SPONSORS.flatMap(c => c.sponsors)

  return (
    <section className="section sponsors-section" id="sponsors">
      <div className="section-head reveal in">
        <div>
          <div className="mono">Institutional Champions · Legacy of Trust</div>
          <h2>
            Previous Year <span className="gold">Sponsors & Partners</span>
          </h2>
        </div>
        <p className="section-intro">
          YUKTI has been proudly supported by India's preeminent enterprises, Fortune 500 conglomerates, disruptive startups, and media institutions who believe in nurturing the nation's foremost management intellect.
        </p>
      </div>

      {/* ── Floating Colour Sponsor Logo Tiles Marquee ──────────────── */}
      <div className="floating-tiles-showcase reveal in">
        <div className="mono floating-strip-label">
          <span>✦ Interactive Partner Constellation</span>
        </div>

        <div className="floating-tiles-grid">
          {allSponsors.map((sp, idx) => {
            const style = brandStyles[sp.logo] || {
              bg: 'linear-gradient(135deg, #4338ca, #6366f1)',
              accent: '#a5b4fc',
              glow: 'rgba(99, 102, 241, 0.4)'
            }
            // Generate subtle staggered animation delays
            const floatDelay = `${(idx % 4) * 0.4}s`
            const floatDuration = `${3.2 + (idx % 3) * 0.6}s`

            return (
              <div
                key={idx}
                className="floating-colour-tile"
                style={{
                  '--tile-bg': style.bg,
                  '--tile-accent': style.accent,
                  '--tile-glow': style.glow,
                  animationDelay: floatDelay,
                  animationDuration: floatDuration,
                }}
              >
                <div className="tile-ambient-glow" />
                <div className="tile-inner">
                  <div className="tile-emblem">
                    <span className="tile-badge-text">{sp.logo}</span>
                  </div>
                  <div className="tile-meta">
                    <h5 className="tile-name">{sp.name}</h5>
                    <span className="tile-type mono">{sp.type}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Sponsor Category Grids */}
      <div className="sponsors-categories-wrap" style={{ marginTop: '60px' }}>
        {PREVIOUS_SPONSORS.map((cat, idx) => (
          <div key={idx} className="sponsor-category-block">
            <h3 className="sponsor-category-title mono">
              <span>{cat.category}</span>
            </h3>

            <div className="sponsor-logo-grid">
              {cat.sponsors.map((sp, sIdx) => {
                const style = brandStyles[sp.logo] || {
                  bg: 'linear-gradient(135deg, #1e1b4b, #312e81)',
                  accent: '#e9c878',
                  glow: 'rgba(233, 200, 120, 0.3)'
                }
                return (
                  <div key={sIdx} className="sponsor-card">
                    <div className="sponsor-badge-top">
                      <span
                        className="sponsor-logo-emblem"
                        style={{
                          background: style.bg,
                          color: '#ffffff',
                          boxShadow: `0 4px 18px ${style.glow}`,
                          border: `1px solid ${style.accent}`
                        }}
                      >
                        {sp.logo}
                      </span>
                    </div>
                    <h4 className="sponsor-name">{sp.name}</h4>
                    <span className="sponsor-type mono">{sp.type}</span>
                    <p className="sponsor-desc">{sp.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Corporate Partnership Invitation Bar */}
      <div className="sponsor-callout-box reveal in">
        <div className="callout-content">
          <div className="mono gold">Partner with YUKTI ’27</div>
          <h3>Join the Vanguard of Industry & Academia</h3>
          <p>
            Connect with 1,500+ top MBA delegates, undergraduate talent, and corporate juries across India. Custom track sponsorships, live hackathons, recruitment corridors, and keynote slots available for the 2027 edition.
          </p>
        </div>
        <div className="callout-actions">
          <a href="mailto:yukti@tsm.ac.in?subject=YUKTI%202027%20Corporate%20Partnership%20Proposal" className="btn">
            Request Partnership Deck ↗
          </a>
          <a href="#contact" className="btn ghost">
            Contact Sponsorship Desk
          </a>
        </div>
      </div>
    </section>
  )
}
