import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { SITE_CONFIG, SPONSORS_DATA } from './utils/confluenceData'
import ManagementEventsPage from './pages/ManagementEventsPage'
import CulturalEventsPage from './pages/CulturalEventsPage'
import RegistrationPortalPage from './pages/RegistrationPortalPage'
import ElephantMascotChat from './components/ElephantMascotChat'

export default function App() {
  const canvasRef = useRef(null)
  const [currentPage, setCurrentPage] = useState('home') // 'home' | 'management' | 'cultural' | 'portal'
  const [menuOpen, setMenuOpen] = useState(false)
  const [modalData, setModalData] = useState(null)
  const [previewMode, setPreviewMode] = useState(false)

  const navigateTo = (pageId) => {
    setCurrentPage(pageId)
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ── Three.js Persistent 3D Background Engine ────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let renderer, scene, camera, core, group, particles, ringA, ringB, ringC, stars = []
    let mouseX = 0, mouseY = 0
    let scrollYCurrent = window.scrollY, lastScrollY = window.scrollY
    let scrollVelocity = 0, targetVelocity = 0

    const handleScroll = () => {
      scrollYCurrent = window.scrollY
      const delta = scrollYCurrent - lastScrollY
      targetVelocity = delta * 0.04
      lastScrollY = scrollYCurrent

      const max = document.documentElement.scrollHeight - window.innerHeight
      const progressBar = document.getElementById('progress-bar')
      if (progressBar) {
        progressBar.style.width = (max > 0 ? (scrollYCurrent / max * 100) : 0) + '%'
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('pointermove', handleMouseMove, { passive: true })

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: window.innerWidth > 700,
        powerPreference: 'high-performance',
      })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8))
      renderer.setSize(window.innerWidth, window.innerHeight, false)
      renderer.setClearColor(0x000000, 0)

      scene = new THREE.Scene()
      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)
      camera.position.set(0, 0.2, 10.5)

      group = new THREE.Group()
      scene.add(group)

      const goldMat = new THREE.MeshStandardMaterial({
        color: 0xe9c878,
        metalness: 0.88,
        roughness: 0.18,
        emissive: 0x8a5e20,
        emissiveIntensity: 0.35,
      })
      const cyberMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        metalness: 0.8,
        roughness: 0.25,
        emissive: 0x0284c7,
        emissiveIntensity: 0.45,
      })

      // Dual Nested Icosahedron Core
      core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.35, 2), goldMat)
      group.add(core)

      const innerWire = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.0, 1),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.85 })
      )
      core.add(innerWire)

      // Orbital Rings
      ringA = new THREE.Mesh(
        new THREE.TorusGeometry(2.2, 0.016, 12, 160),
        new THREE.MeshStandardMaterial({ color: 0xe9c878, metalness: 0.9, roughness: 0.2, transparent: true, opacity: 0.85 })
      )
      ringA.rotation.x = 1.1
      group.add(ringA)

      ringB = new THREE.Mesh(
        new THREE.TorusGeometry(2.8, 0.012, 12, 180),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.8, roughness: 0.3, transparent: true, opacity: 0.75 })
      )
      ringB.rotation.set(0.6, 0.4, 0.2)
      group.add(ringB)

      ringC = new THREE.Mesh(
        new THREE.TorusGeometry(3.3, 0.01, 12, 180),
        new THREE.MeshStandardMaterial({ color: 0xe9c878, metalness: 0.8, roughness: 0.2, transparent: true, opacity: 0.6 })
      )
      ringC.rotation.set(-0.4, 0.7, -0.3)
      group.add(ringC)

      // 8 Satellite Cognitive Nodes
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2
        const mat = i % 2 === 0 ? goldMat : cyberMat
        const node = new THREE.Mesh(
          new THREE.OctahedronGeometry(0.13 + (i % 3) * 0.025, 0),
          mat
        )
        node.position.set(Math.cos(a) * 2.8, Math.sin(a) * 1.8, Math.sin(a * 2) * 0.6)
        group.add(node)

        const lineGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, 0),
          node.position.clone(),
        ])
        const line = new THREE.Line(
          lineGeo,
          new THREE.LineBasicMaterial({
            color: i % 2 ? 0x38bdf8 : 0xe9c878,
            transparent: true,
            opacity: 0.35
          })
        )
        group.add(line)
        stars.push({ node, a })
      }

      // Star Field
      const starCount = 1400
      const pos = new Float32Array(starCount * 3)
      for (let i = 0; i < starCount; i++) {
        const r = 5 + Math.random() * 18
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
        pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
        pos[i * 3 + 2] = r * Math.cos(phi) - 3
      }
      const sg = new THREE.BufferGeometry()
      sg.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      particles = new THREE.Points(
        sg,
        new THREE.PointsMaterial({ color: 0x93c5fd, size: 0.022, transparent: true, opacity: 0.75, sizeAttenuation: true })
      )
      scene.add(particles)

      // Lighting
      scene.add(new THREE.AmbientLight(0x312e81, 1.8))
      const keyLight = new THREE.PointLight(0xe9c878, 40, 35)
      keyLight.position.set(4, 5, 6)
      scene.add(keyLight)

      const rimLight = new THREE.PointLight(0x38bdf8, 28, 30)
      rimLight.position.set(-6, -3, 3)
      scene.add(rimLight)

      const handleResize = () => {
        renderer.setSize(window.innerWidth, window.innerHeight, false)
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
      }
      window.addEventListener('resize', handleResize)

      let currentGlobeX = -2.8
      let currentGlobeY = 0
      let animId

      const render = (t) => {
        animId = requestAnimationFrame(render)

        scrollVelocity += (targetVelocity - scrollVelocity) * 0.15
        targetVelocity *= 0.88

        const rotDelta = 0.005 + (scrollVelocity * 0.08)

        const isMobile = window.innerWidth <= 850
        const targetX = isMobile ? 0 : -2.8
        const targetY = isMobile ? 0.6 : 0
        currentGlobeX += (targetX - currentGlobeX) * 0.08
        currentGlobeY += (targetY - currentGlobeY) * 0.08
        group.position.x = currentGlobeX
        group.position.y = currentGlobeY

        camera.position.x += (mouseX * 0.25 - camera.position.x) * 0.04
        camera.position.y += (-mouseY * 0.2 - camera.position.y) * 0.04
        camera.lookAt(0, 0, 0)

        group.rotation.y += rotDelta * 0.8
        group.rotation.x += rotDelta * 0.25

        core.rotation.y += rotDelta * 1.2
        core.rotation.x += rotDelta * 0.7

        ringA.rotation.z -= rotDelta * 1.4
        ringB.rotation.y += rotDelta * 1.1
        ringC.rotation.x -= rotDelta * 0.9

        const time = t * 0.0003
        stars.forEach((s, i) => {
          s.node.position.x = Math.cos(s.a + time * 0.25) * 2.8
          s.node.position.y = Math.sin(s.a + time * 0.25) * 1.8
          s.node.rotation.x += rotDelta * (i % 2 ? 1 : -1)
        })

        particles.rotation.y += rotDelta * 0.15
        renderer.render(scene, camera)
      }
      render(0)

      return () => {
        cancelAnimationFrame(animId)
        window.removeEventListener('scroll', handleScroll)
        window.removeEventListener('pointermove', handleMouseMove)
        window.removeEventListener('resize', handleResize)
        renderer.dispose()
      }
    } catch (err) {
      console.warn('3D initialization failed:', err)
    }
  }, [])

  return (
    <>
      <div className="progress" id="progress-bar"></div>

      {/* ── Persistent 3D Viewport ────────────────────────────── */}
      <div id="webgl-container">
        <canvas ref={canvasRef} className="hero-canvas" aria-label="3D Strategic Universe Canvas" />
      </div>

      {/* ── Header ───────────────────────────────────────────── */}
      <header className="topbar">
        <a className="brand" href="#home" onClick={(e) => { e.preventDefault(); navigateTo('home') }}>
          <span className="brandmark"><span>Y</span></span>
          <span>YUKTI <span className="gold">’27</span></span>
        </a>

        {/* Desktop Nav */}
        <nav className={`nav ${menuOpen ? 'open' : ''}`}>
          <a
            href="#home"
            className={currentPage === 'home' ? 'active-nav-link' : ''}
            onClick={(e) => { e.preventDefault(); navigateTo('home') }}
          >
            Home Confluence
          </a>
          <a
            href="#management"
            className={currentPage === 'management' ? 'active-nav-link' : ''}
            onClick={(e) => { e.preventDefault(); navigateTo('management') }}
          >
            Management Events
          </a>
          <a
            href="#cultural"
            className={currentPage === 'cultural' ? 'active-nav-link' : ''}
            onClick={(e) => { e.preventDefault(); navigateTo('cultural') }}
          >
            Cultural Events
          </a>
          <a
            href="#portal"
            className={currentPage === 'portal' ? 'active-nav-link' : ''}
            onClick={(e) => { e.preventDefault(); navigateTo('portal') }}
          >
            Registration Portal
          </a>

          <button
            className="btn"
            style={{ marginTop: menuOpen ? '10px' : '0' }}
            onClick={() => navigateTo('portal')}
          >
            Join Confluence ↗
          </button>
        </nav>

        <button className="btn topbar-cta-btn" onClick={() => navigateTo('portal')}>
          Join Confluence ↗
        </button>

        {/* Mobile Burger Button */}
        <button
          className={`menu ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </header>

      {previewMode && (
        <div className="admin-banner show">
          COMMITTEE PREVIEW MODE — illustrative dates and announcements are for review only
        </div>
      )}

      {/* ── SEPARATE PAGE ROUTING ───────────────────────────────── */}
      {currentPage === 'management' && (
        <ManagementEventsPage
          onSelectEvent={(ev) => setModalData(ev)}
          onBackToHome={() => navigateTo('home')}
          onOpenRegister={() => navigateTo('portal')}
        />
      )}

      {currentPage === 'cultural' && (
        <CulturalEventsPage
          onSelectEvent={(ev) => setModalData(ev)}
          onBackToHome={() => navigateTo('home')}
          onOpenRegister={() => navigateTo('portal')}
        />
      )}

      {currentPage === 'portal' && (
        <RegistrationPortalPage
          onBackToHome={() => navigateTo('home')}
        />
      )}

      {/* ── HOMEPAGE: Dedicated Hero Banner, ₹20L Prize Announcement & Infinite Marquee ── */}
      {currentPage === 'home' && (
        <main>
          {/* ═══ SCENE 01: HERO BANNER ═══ */}
          <section className="hero" id="home">
            <div className="hero-copy">
              <div className="eyebrow mono">
                Thiagarajar School of Management (TSM) · Madurai
              </div>

              <h1>YUKTI<br /><em>’27</em></h1>

              <div className="theme-headline-badge mono">
                The Strategic Confluence · National Summit
              </div>

              <p className="hero-sub">
                Where visionary thinkers, corporate leaders, and university delegators congregate across high-stakes management battlegrounds and cultural confluences.
              </p>

              {/* ═══ MONUMENTAL ₹20,00,000 PRIZE ANNOUNCEMENT ═══ */}
              <div className="grand-prize-hero-banner">
                <div className="prize-glow-bg" />
                <div className="prize-banner-inner">
                  <div className="prize-label-row">
                    <span className="mono prize-badge">CUMULATIVE NATIONAL BOUNTY</span>
                    <span className="prize-status-dot">CONFIRMED 2027 PRIZE POOL</span>
                  </div>
                  <div className="prize-sum-display">
                    {SITE_CONFIG.grandPrizePool}
                  </div>
                  <p className="prize-caption">
                    Twenty Lakhs Rupees in total cash bounties, national rolling shields, and corporate incubation grants across 13 flagship arenas.
                  </p>
                </div>
              </div>

              {/* Primary Call-to-Action Buttons */}
              <div className="hero-actions">
                <button className="btn" onClick={() => navigateTo('portal')}>
                  Register for YUKTI ’27 ↗
                </button>
                <button className="btn ghost" onClick={() => navigateTo('management')}>
                  Management Tracks (8) ↗
                </button>
                <button className="btn ghost" onClick={() => navigateTo('cultural')}>
                  Cultural Confluences (5) ↗
                </button>
              </div>

              <div className="hero-meta">
                <div><span className="mono">Grand Prize</span><strong className="gold">₹20,00,000</strong></div>
                <div><span className="mono">Edition</span><strong>2027 · Confluence</strong></div>
                <div><span className="mono">Dates</span><strong>{SITE_CONFIG.dates}</strong></div>
                <div><span className="mono">Venue</span><strong>TSM · Madurai</strong></div>
              </div>
            </div>

            <div className="scroll-cue"><span></span>Scroll to explore the summit</div>
            <div className="side-note">STRATEGY · CULTURE · CONFLUENCE</div>
          </section>

          {/* ═══ SPONSORSHIP CONTINUOUS MARQUEE (Right to Left Scrolling) ═══ */}
          <section className="sponsors-marquee-section">
            <div className="marquee-section-head">
              <span className="mono gold">Legacy of Trust · Previous Champions & Partners</span>
              <h3>Proudly Supported by Industry Titans</h3>
            </div>

            {/* Seamless Infinite CSS Marquee Strip */}
            <div className="sponsors-marquee-track-wrap">
              <div className="sponsors-marquee-track">
                {/* Repeat list twice for seamless infinite right-to-left loop */}
                {[...SPONSORS_DATA, ...SPONSORS_DATA].map((sp, idx) => (
                  <div key={idx} className="marquee-sponsor-tile">
                    <div className="tile-ambient-glow" style={{ background: sp.bg }} />
                    <div className="marquee-tile-content">
                      <span className="marquee-tile-emblem" style={{ background: sp.bg, color: '#fff' }}>
                        {sp.logo}
                      </span>
                      <div className="marquee-tile-info">
                        <span className="marquee-sp-name">{sp.name}</span>
                        <span className="marquee-sp-type mono">{sp.type}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ═══ SUMMIT OVERVIEW & QUICK PORTALS ═══ */}
          <section className="section section-dark">
            <div className="section-head reveal in">
              <div>
                <div className="mono">The Two Confluences</div>
                <h2>
                  Command or <span className="gold">Spectacle.</span>
                </h2>
              </div>
              <p className="section-intro">
                Choose your battleground. YUKTI ’27 separates its rigorous management arenas from its electrifying cultural spectacles into two dedicated confluences.
              </p>
            </div>

            <div className="home-dual-cards-grid">
              <div className="home-arena-portal-card" onClick={() => navigateTo('management')}>
                <div className="portal-card-top">
                  <span className="mono gold">TRACK DOMAIN 01</span>
                  <h3>Management Arenas</h3>
                  <p>8 intense trials testing operational stress, quant valuation, brand resurgence, human systems, and best manager leadership.</p>
                </div>
                <div className="portal-card-foot">
                  <span>Explore 8 Arenas & Rulebooks</span>
                  <span className="arrow">↗</span>
                </div>
              </div>

              <div className="home-arena-portal-card" onClick={() => navigateTo('cultural')}>
                <div className="portal-card-top">
                  <span className="mono gold">TRACK DOMAIN 02</span>
                  <h3>Cultural Confluence</h3>
                  <p>5 creative arenas spanning runway haute couture, battle of the bands, photojournalism, thematic dance, and street drama.</p>
                </div>
                <div className="portal-card-foot">
                  <span>Explore 5 Cultural Arenas</span>
                  <span className="arrow">↗</span>
                </div>
              </div>
            </div>
          </section>

          {/* ═══ LEGACY TIMELINE ═══ */}
          <section className="section" id="legacy">
            <div className="section-head reveal in">
              <div>
                <div className="mono">Over 6 Decades of Excellence</div>
                <h2>Rooted in Legacy.<br /><span className="gold">Built for Tomorrow.</span></h2>
              </div>
              <p className="section-intro">
                Hosted by Thiagarajar School of Management (TSM), Madurai — an institution of national repute fostering visionary management leaders since 1962.
              </p>
            </div>

            <div className="timeline reveal in">
              <div className="timeline-item"><div className="mono">1962</div><strong>TSM Founded</strong><p>Established by philanthropist Karumuttu Thiagarajan Chettiar.</p></div>
              <div className="timeline-item"><div className="mono">1999*</div><strong>YUKTI Inception</strong><p>The genesis of YUKTI as an all-India corporate and cultural confluence.</p></div>
              <div className="timeline-item"><div className="mono">17 Acres*</div><strong>Serene Campus</strong><p>A residential academic sanctuary at Pamban Swamy Nagar, Madurai.</p></div>
              <div className="timeline-item"><div className="mono">2027</div><strong>₹20L Confluence</strong><p>A milestone edition celebrating ambitious student leaders across the nation.</p></div>
            </div>
          </section>
        </main>
      )}

      {/* ── Global Footer ────────────────────────────────────── */}
      <footer>
        <div>
          <strong>YUKTI ’27 — The Strategic Confluence</strong><br />
          Thiagarajar School of Management (TSM), Madurai 625005
        </div>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <a href="#home" onClick={(e) => { e.preventDefault(); navigateTo('home') }}>Home</a>
          <a href="#management" onClick={(e) => { e.preventDefault(); navigateTo('management') }}>Management Tracks</a>
          <a href="#cultural" onClick={(e) => { e.preventDefault(); navigateTo('cultural') }}>Cultural Tracks</a>
          <a href="#portal" onClick={(e) => { e.preventDefault(); navigateTo('portal') }}>Register Portal</a>
        </div>
        <div>Built for the next chapter of enterprise leadership.</div>
      </footer>

      {/* ── Floating 3D Elephant Mascot with Integrated AI Chatbot ── */}
      <ElephantMascotChat onNavigate={navigateTo} />

      {/* Committee Preview Toggle Button */}
      <button className="admin" onClick={() => setPreviewMode(!previewMode)}>
        {previewMode ? 'PREVIEW MODE: ON ✓' : 'COMMITTEE PREVIEW ↗'}
      </button>

      {/* Event Details Modal */}
      {modalData && (
        <div className="modal open" role="dialog">
          <div className="modal-box">
            <button className="modal-close" onClick={() => setModalData(null)}>×</button>
            <div className="mono gold">{modalData.domain || modalData.category}</div>
            <h2>{modalData.title}</h2>
            <p>{modalData.shortDesc}</p>

            {modalData.rounds && (
              <div style={{ marginTop: '14px' }}>
                <span className="mono" style={{ fontSize: '0.72rem' }}>Competition Rounds:</span>
                <ul style={{ paddingLeft: '18px', marginTop: '6px', fontSize: '0.84rem', color: '#b6a8cb' }}>
                  {modalData.rounds.map((r, i) => (
                    <li key={i} style={{ marginBottom: '4px' }}>
                      <strong style={{ color: '#fff' }}>{r.name}:</strong> {r.desc}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '22px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px' }}>
              <span className="tba">
                {modalData.prizes} · {modalData.fee || 'Fee TBA'}
              </span>
              <button
                className="btn"
                onClick={() => {
                  setModalData(null)
                  navigateTo('portal')
                }}
              >
                Register Team ↗
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
