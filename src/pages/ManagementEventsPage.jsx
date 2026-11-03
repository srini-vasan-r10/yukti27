import React, { useState } from 'react'
import { MANAGEMENT_EVENTS } from '../utils/confluenceData'

export default function ManagementEventsPage({ onSelectEvent, onBackToHome, onOpenRegister }) {
  const [selectedDomain, setSelectedDomain] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const domains = ['All', 'Operations & Supply Chain', 'Best Manager Flagship', 'Finance & Quantitative Strategy', 'Business Analytics & Data Science', 'Marketing & Neuromarketing', 'Human Resources & Organizational Behaviour', 'Entrepreneurship & Venture Inception', 'Strategic Corporate Quiz & Auctions']

  const filteredEvents = MANAGEMENT_EVENTS.filter(ev => {
    const matchesDomain = selectedDomain === 'All' || ev.domain === selectedDomain
    const matchesSearch = ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ev.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ev.aiHumanAngle.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesDomain && matchesSearch
  })

  return (
    <div className="subpage-wrapper">
      {/* Page Header */}
      <div className="subpage-hero">
        <div className="subpage-hero-content">
          <button className="back-breadcrumb-btn" onClick={onBackToHome}>
            ← Return to Confluence
          </button>
          <div className="eyebrow mono" style={{ marginTop: '1rem' }}>
            Flagship National Competition Arenas · YUKTI ’27
          </div>
          <h1 className="subpage-title">
            Management <span className="gold">Arenas</span>
          </h1>
          <p className="subpage-lead">
            Where artificial intelligence and predictive algorithms meet human boardroom intuition, moral ethics, and crisis leadership. Explore our 8 competitive domains below.
          </p>

          <div className="subpage-quick-stats">
            <div>
              <strong>8 Flagship Tracks</strong>
              <small>Operations, Finance, AI, Marketing, HR, Strategy</small>
            </div>
            <div>
              <strong>₹3,00,000+</strong>
              <small>Management Cash Prize Pool & Trophies</small>
            </div>
            <div>
              <strong>National Jury</strong>
              <small>CXOs, Venture Capitalists & TSM Faculty</small>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-controls-container">
        <div className="search-box-wrap">
          <input
            type="text"
            className="confluence-search-input"
            placeholder="Search events, concepts, AI challenges..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="category-pills-row">
          {domains.map((dom) => (
            <button
              key={dom}
              className={`cat-filter-pill ${selectedDomain === dom ? 'active' : ''}`}
              onClick={() => setSelectedDomain(dom)}
            >
              {dom === 'All' ? 'All Domains' : dom.split('&')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <div className="subpage-content-container">
        <div className="mgmt-cards-grid">
          {filteredEvents.map((ev) => (
            <div key={ev.id} className="mgmt-detail-card">
              <div className="mgmt-card-head">
                <span className="mono track-badge">TRACK {ev.num}</span>
                <span className="domain-tag">{ev.domain}</span>
              </div>

              <h2 className="mgmt-card-title">{ev.title}</h2>
              <p className="mgmt-card-desc">{ev.shortDesc}</p>

              {/* The AI + Human Confluence Angle Feature Box */}
              <div className="ai-human-highlight-box">
                <div className="ai-human-tag">
                  <span className="chip-ai">AI Matrix</span>
                  <span className="confluence-symbol">✕</span>
                  <span className="chip-human">Human Touch</span>
                </div>
                <p className="ai-human-text">{ev.aiHumanAngle}</p>
              </div>

              {/* Rounds Overview */}
              <div className="rounds-summary-section">
                <span className="rounds-heading mono">Arena Rounds</span>
                <ul className="rounds-list">
                  {ev.rounds.map((r, i) => (
                    <li key={i}>
                      <strong>{r.name}:</strong> <span>{r.desc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card Footer Details */}
              <div className="mgmt-card-footer">
                <div className="meta-col">
                  <span className="meta-label">Team Formation</span>
                  <strong>{ev.teamSize}</strong>
                </div>
                <div className="meta-col">
                  <span className="meta-label">Prize Bounty</span>
                  <strong className="gold">{ev.prizes}</strong>
                </div>
                <div className="actions-col">
                  <button className="btn" onClick={() => onSelectEvent(ev)}>
                    Full Rulebook ↗
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="empty-results-box">
            <h3>No management arenas found</h3>
            <p>Try adjusting your search criteria or resetting filters.</p>
            <button className="btn ghost" onClick={() => { setSelectedDomain('All'); setSearchQuery(''); }}>
              Reset Filters
            </button>
          </div>
        )}

        {/* Global Register Banner */}
        <div className="subpage-cta-banner">
          <div className="cta-left">
            <h3>Ready to stake your claim in the boardroom?</h3>
            <p>Nominate your institution's delegation or register as an individual contender.</p>
          </div>
          <div className="cta-right">
            <button className="btn" onClick={onOpenRegister}>
              Generate Delegate Dossier ↗
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
