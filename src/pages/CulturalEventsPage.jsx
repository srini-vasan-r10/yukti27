import React, { useState } from 'react'
import { CULTURAL_EVENTS } from '../utils/confluenceData'

export default function CulturalEventsPage({ onSelectEvent, onBackToHome, onOpenRegister }) {
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', 'Runway & Haute Couture', 'Battle of the Bands', 'Visual Storytelling', 'Thematic Dance Showcase', 'Street & Proscenium Theatre']

  const filteredEvents = CULTURAL_EVENTS.filter(ev => {
    return selectedCategory === 'All' || ev.category === selectedCategory
  })

  return (
    <div className="subpage-wrapper">
      {/* Page Hero */}
      <div className="subpage-hero cultural-hero-gradient">
        <div className="subpage-hero-content">
          <button className="back-breadcrumb-btn" onClick={onBackToHome}>
            ← Return to Confluence
          </button>
          <div className="eyebrow mono" style={{ marginTop: '1rem' }}>
            Beyond Business · The Grand Cultural Confluence
          </div>
          <h1 className="subpage-title">
            Cultural <span className="gold">Confluence</span>
          </h1>
          <p className="subpage-lead">
            When theatrical craft, high-octane musical battles, and avant-garde runway design take the spotlight. Explore the cultural competitions of YUKTI ’27.
          </p>

          <div className="subpage-quick-stats">
            <div>
              <strong>5 Stellar Arenas</strong>
              <small>Couture, Bands, Dance, Street Theatre, Photography</small>
            </div>
            <div>
              <strong>₹7,75,000+</strong>
              <small>Cultural Cash Rewards & Studio Grants</small>
            </div>
            <div>
              <strong>Open Stage</strong>
              <small>Auditorium, Open Amphitheatre & Madurai Heritage</small>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="filter-controls-container">
        <div className="category-pills-row">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`cat-filter-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Cultural Events List */}
      <div className="subpage-content-container">
        <div className="cultural-cards-grid">
          {filteredEvents.map((cult) => (
            <div key={cult.id} className="cult-detail-card">
              <div className="cult-visual-strip">
                <span className="cult-badge mono">{cult.category}</span>
                <h2 className="cult-title">{cult.title}</h2>
              </div>

              <div className="cult-body-content">
                <p className="cult-desc">{cult.shortDesc}</p>

                {/* Staging Format & Criteria */}
                <div className="cult-meta-block">
                  <div className="cult-format">
                    <span className="mono">Participation Format:</span>
                    <p style={{ margin: '4px 0 0', color: '#cbd5e1', fontSize: '0.85rem' }}>{cult.format}</p>
                  </div>

                  {cult.judging && (
                    <div className="cult-criteria" style={{ marginTop: '14px' }}>
                      <span className="mono">Adjudication Criteria:</span>
                      <ul className="criteria-tags" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', listStyle: 'none', padding: 0, marginTop: '8px' }}>
                        {cult.judging.map((c, i) => (
                          <li key={i} style={{ background: 'rgba(255,255,255,0.06)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', color: '#cbd5e1' }}>
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Footer and Prize */}
                <div className="cult-footer" style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span className="meta-label" style={{ display: 'block', fontSize: '0.68rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Bounty & Honors</span>
                    <strong className="gold" style={{ fontSize: '1.1rem' }}>{cult.prizes}</strong>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>Fee: {cult.fee}</span>
                  </div>
                  <button className="btn" onClick={() => onSelectEvent(cult)}>
                    Full Rulebook ↗
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="subpage-cta-banner" style={{ marginTop: '45px', padding: '32px', background: 'rgba(245,158,11,0.06)', border: '1px solid var(--line)', borderRadius: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div className="cta-left">
            <h3 style={{ margin: '0 0 6px', fontFamily: "'Space Grotesk', sans-serif" }}>Bring your crew, your instruments, your voice.</h3>
            <p style={{ margin: 0, color: '#cbd5e1' }}>Registration for university dance crews, musical bands, models, and photographers is now open.</p>
          </div>
          <div className="cta-right">
            <button className="btn" onClick={onOpenRegister}>
              Register Cultural Crew ↗
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
