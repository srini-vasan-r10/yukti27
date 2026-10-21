/**
 * ScrollOverlay.jsx
 * Fully persistent, natural scroll storyboard.
 * Anchored strictly on the RIGHT side. No vanishing text.
 */

import { STRATEGIC_DOMAINS, COMPETITIONS } from '../../utils/constants'

export default function ScrollOverlay() {
  return (
    <>
      {/* ═══ SCENE 01: HERO ═══ */}
      <section className="scene-section scene-section--hero" id="home">
        <div className="storyboard-content">
          <div className="badge-pill">
            <span className="badge-dot"></span>
            National Management Summit
          </div>
          <h1 className="text-hero-title">YUKTI &rsquo;27</h1>
          <p className="text-subtitle">
            Where Strategic Intellect Meets Architectural Mastery.
          </p>
          <p className="text-desc">
            An extraordinary management summit uniting elite thinkers, industry pioneers,
            and 1,200+ delegates across high-stakes competitive arenas.
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
            <a href="#register" className="btn-gold">Explore Events &rarr;</a>
            <a href="#pillars" className="btn-secondary">The Strategic Pillars</a>
          </div>
        </div>
      </section>

      {/* ═══ SCENE 02: THE STRATEGIC NEXUS ═══ */}
      <section className="scene-section scene-section--nexus" id="nexus">
        <div className="storyboard-content">
          <div className="badge-pill">Act II &bull; The Architecture</div>
          <h2 className="text-title">
            The Strategic <span className="text-gold">Nexus</span>
          </h2>
          <p className="text-subtitle">
            Every business discipline converges into a synchronized equilibrium.
          </p>
          <p className="text-desc">
            The Nexus embodies holistic management mastery. No discipline stands in isolation;
            finance, brand strategy, operational logistics, and human systems operate as one unified engine.
          </p>
          <div className="mini-grid">
            <div className="inner-item">
              <h4>System Equilibrium</h4>
              <p>Simulating dynamic market shifts and organizational stress-tests.</p>
            </div>
            <div className="inner-item">
              <h4>Cross-Domain Synthesis</h4>
              <p>Multi-disciplinary case studies curated by Fortune 500 leadership.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SCENE 03: STRATEGIC PILLARS ═══ */}
      <section className="scene-section scene-section--pillars" id="pillars">
        <div className="storyboard-content">
          <div className="badge-pill">Act III &bull; Strategic Domains</div>
          <h2 className="text-title">
            Six Pillars of <span className="text-gold">Excellence</span>
          </h2>
          <p className="text-desc">
            Explore the summit&rsquo;s core competitive disciplines designed to assess tactical precision and visionary command.
          </p>

          <div className="mini-grid">
            {STRATEGIC_DOMAINS.map((domain, i) => (
              <div key={domain.id} className="inner-item">
                <h4>0{i + 1}. {domain.title}</h4>
                <p>{domain.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SCENE 04: COMPETITIONS ═══ */}
      <section className="scene-section scene-section--competitions" id="competitions">
        <div className="storyboard-content">
          <div className="badge-pill">Act IV &bull; Flagship Arenas</div>
          <h2 className="text-title">
            Eight Arenas of <span className="text-gold">Strategy</span>
          </h2>
          <p className="text-desc">
            High-caliber simulations crafted to challenge and crown the nation&rsquo;s foremost strategists.
          </p>

          <div className="mini-grid">
            {COMPETITIONS.map((comp) => (
              <div key={comp.name} className="inner-item">
                <h4 style={{ color: 'var(--gold-primary)' }}>{comp.name}</h4>
                <p style={{ color: '#e2e8f0', fontWeight: '500', marginBottom: '0.25rem' }}>{comp.tagline}</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--gold-accent)', textTransform: 'uppercase' }}>
                  Domain: {comp.domain}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SCENE 05: CONVERGENCE ═══ */}
      <section className="scene-section scene-section--convergence" id="convergence">
        <div className="storyboard-content">
          <div className="badge-pill">Act V &bull; The Convergence</div>
          <h2 className="text-title">
            One Summit. <span className="text-gold">Infinite Horizons.</span>
          </h2>
          <p className="text-subtitle">
            Where strategy transforms into lasting industry impact.
          </p>
          <p className="text-desc">
            A three-day convergence featuring keynote addresses by chief executives, intensive masterclasses, and prestigious national trophies.
          </p>
          <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
            <div>
              <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#fff', fontFamily: 'Cinzel' }}>&#8377; 5,00,000+</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Prize Pool</div>
            </div>
            <div>
              <div style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--gold-primary)', fontFamily: 'Cinzel' }}>40+</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Institutions</div>
            </div>
            <div>
              <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#fff', fontFamily: 'Cinzel' }}>1,200+</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Delegates</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SCENE 06: FINAL INVITATION ═══ */}
      <section className="scene-section scene-section--cta" id="register">
        <div className="storyboard-content">
          <div className="badge-pill">Act VI &bull; Registration Open</div>
          <h2 className="text-title">
            Claim Your Place in <span className="text-gold">History</span>
          </h2>
          <p className="text-subtitle">
            Delegate registration is now open for university teams and individuals.
          </p>
          <p className="text-desc">
            Secure early registration privileges, access preliminary round cases, and prepare for India&rsquo;s premier management summit.
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
            <a href="#register" className="btn-gold">Register Delegation &rarr;</a>
            <a href="#rules" className="btn-secondary">Download Rulebook</a>
          </div>
        </div>
      </section>
    </>
  )
}
