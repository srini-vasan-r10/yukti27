import React, { useState } from 'react'
import { CULTURAL_EVENTS } from '../utils/confluenceData'

export default function CulturalEventsPage({ onSelectEvent, onBackToHome, onOpenRegister }) {
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', 'Fashion, Runway & Sustainable Style', 'Acoustic & Fusion Battle of the Bands', 'Visual Storytelling & Photojournalism', 'Contemporary & Classical Thematic Dance', 'Street Play & Proscenium Drama']

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
            Beyond Business · The Soul of YUKTI ’27
          </div>
          <h1 className="subpage-title">
            Cultural <span className="gold">Confluence</span>
          </h1>
          <p className="subpage-lead">
            When raw human emotion, rhythm, theatrical craft, and visual storytelling collide with generative aesthetics. Explore the vibrant cultural celebrations of YUKTI ’27.
          </p>

          <div className="subpage-quick-stats">
            <div>
              <strong>5 Stellar Arenas</strong>
              <small>Couture, Bands, Dance, Street Theatre, Photography</small>
            </div>
            <div>
              <strong>₹1,80,000+</strong>
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
              {cat === 'All' ? 'All Disciplines' : cat.split('&')[0]}
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

                {/* AI + Human Feature Pill */}
                <div className="ai-human-highlight-box">
                  <div className="ai-human-tag">
                    <span className="chip-ai">Digital Canvas</span>
                    <span className="confluence-symbol">✕</span>
                    <span className="chip-human">Human Soul</span>
                  </div>
                  <p className="ai-human-text">{cult.aiHumanAngle}</p>
                </div>

                {/* Staging Format & Criteria */}
                <div className="cult-meta-block">
                  <div className="cult-format">
                    <span className="mono">Participation Format:</span>
                    <p>{cult.format}</p>
                  </div>

                  <div className="cult-criteria">
                    <span className="mono">Adjudication Criteria:</span>
                    <ul className="criteria-tags">
                      {cult.judgingCriteria.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer and Prize */}
                <div className="cult-footer">
                  <div>
                    <span className="meta-label">Bounty & Honors</span>
                    <strong className="gold">{cult.prizes}</strong>
                  </div>
                  <button className="btn" onClick={() => onSelectEvent(cult)}>
                    Event Dossier ↗
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="subpage-cta-banner">
          <div className="cta-left">
            <h3>Bring your crew, your instruments, your voice.</h3>
            <p>Registration for university dance crews, musical bands, models, and photographers is now open.</p>
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
