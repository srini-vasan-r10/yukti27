import React, { useState } from 'react'
import { MANAGEMENT_EVENTS } from '../utils/confluenceData'

export default function ManagementEventsPage({ onSelectEvent, onBackToHome, onOpenRegister }) {
  const [selectedDomain, setSelectedDomain] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const domains = ['All', 'Executive Leadership & Best Manager', 'Brand Strategy & Digital Campaigns', 'Supply Chain, Logistics & Systems', 'Consulting & Financial Restructuring', 'Corporate Trivia & Dynamic Auctions', 'Startup Inception & Angel Pitch']

  const filteredEvents = MANAGEMENT_EVENTS.filter(ev => {
    const matchesDomain = selectedDomain === 'All' || ev.domain === selectedDomain
    const matchesSearch = ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ev.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ev.domain.toLowerCase().includes(searchQuery.toLowerCase())
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
            Where artificial intelligence and predictive algorithms meet human boardroom intuition, moral ethics, and crisis leadership. Explore our 6 flagship competitive domains below.
          </p>

          <div className="subpage-quick-stats">
            <div>
              <strong>6 Flagship Arenas</strong>
              <small>Leadership, Strategy, Supply Chain, Consulting, M&A, Inception</small>
            </div>
            <div>
              <strong>₹10,00,000+</strong>
              <small>Management Cash Bounties, Shields & Incubation</small>
            </div>
            <div>
              <strong>National Corporate Jury</strong>
              <small>Industry CEOs, Venture Capitalists & TSM Faculty</small>
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
            placeholder="Search events, concepts, leadership challenges..."
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
              {dom === 'All' ? 'All Arenas' : dom.split('&')[0]}
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
                <span className="mono track-badge">ARENA {ev.num}</span>
                <span className="domain-tag">{ev.domain}</span>
              </div>

              <h2 className="mgmt-card-title">{ev.title}</h2>
              <p className="mgmt-card-desc">{ev.shortDesc}</p>

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
                  <span style={{ fontSize: '0.72rem', color: '#a69cb4', marginTop: '2px' }}>Fee: {ev.fee}</span>
                </div>
                <div className="meta-col">
                  <span className="meta-label">Prize Bounty</span>
                  <strong className="gold">{ev.prizes}</strong>
                </div>
                <div className="actions-col">
                  <button className="btn" onClick={() => onSelectEvent(ev)}>
                    Full Rulebook
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
              Generate Delegate Dossier
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
