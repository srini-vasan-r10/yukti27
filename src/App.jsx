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
      camera.position.set(0, 0, 11)

      const goldMat = new THREE.MeshStandardMaterial({
        color: 0xe9c878,
        metalness: 0.88,
        roughness: 0.2,
        emissive: 0x8a5e20,
        emissiveIntensity: 0.35,
      })
      const cyberMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        metalness: 0.85,
        roughness: 0.25,
        emissive: 0x0284c7,
        emissiveIntensity: 0.45,
      })
      const violetMat = new THREE.MeshStandardMaterial({
        color: 0xa855f7,
        metalness: 0.8,
        roughness: 0.28,
        emissive: 0x6b21a8,
        emissiveIntensity: 0.4,
      })
      const wireMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        wireframe: true,
        transparent: true,
        opacity: 0.55,
      })

      // Multi-Floating Geometric Clusters distributed across full screen
      const shapes = []

      // 1. Spinning Pyramids (Tetrahedrons)
      const pyramid1 = new THREE.Mesh(new THREE.TetrahedronGeometry(1.25, 0), goldMat)
      pyramid1.position.set(-4.5, 2.2, -1.5)
      scene.add(pyramid1)
      shapes.push({ mesh: pyramid1, rotX: 0.008, rotY: 0.012, rotZ: 0.005, orbitR: 4.8, orbitY: 2.2, speed: 0.0004, phase: 0 })

      const pyramid2 = new THREE.Mesh(new THREE.ConeGeometry(0.9, 1.6, 4), violetMat)
      pyramid2.position.set(3.8, -2.6, -1.0)
      scene.add(pyramid2)
      shapes.push({ mesh: pyramid2, rotX: -0.009, rotY: 0.014, rotZ: 0.006, orbitR: 4.2, orbitY: -2.6, speed: -0.00035, phase: 2 })

      // 2. Spinning Cubes (Box Geometries with Wireframe Nested Core)
      const cube1 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.4, 1.4), cyberMat)
      cube1.position.set(-4.2, -2.4, -0.8)
      const cube1Wire = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.7, 1.7), wireMat)
      cube1.add(cube1Wire)
      scene.add(cube1)
      shapes.push({ mesh: cube1, rotX: 0.01, rotY: -0.011, rotZ: 0.007, orbitR: 4.5, orbitY: -2.4, speed: 0.0003, phase: 3.5 })

      const cube2 = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.1, 1.1), goldMat)
      cube2.position.set(4.6, 2.8, -2.0)
      scene.add(cube2)
      shapes.push({ mesh: cube2, rotX: -0.012, rotY: 0.008, rotZ: -0.006, orbitR: 5.0, orbitY: 2.8, speed: -0.00045, phase: 1.2 })

      // 3. Spinning Spheres / Balls (Icosahedrons & Smooth Spheres)
      const ball1 = new THREE.Mesh(new THREE.IcosahedronGeometry(1.1, 2), goldMat)
      ball1.position.set(-1.8, -3.2, 0)
      const ballRing = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.02, 8, 80), wireMat)
      ballRing.rotation.x = Math.PI / 3
      ball1.add(ballRing)
      scene.add(ball1)
      shapes.push({ mesh: ball1, rotX: 0.006, rotY: 0.015, rotZ: 0.009, orbitR: 2.5, orbitY: -3.2, speed: 0.0005, phase: 4.8 })

      const ball2 = new THREE.Mesh(new THREE.SphereGeometry(0.85, 24, 24), cyberMat)
      ball2.position.set(-2.2, 3.4, -1.2)
      scene.add(ball2)
      shapes.push({ mesh: ball2, rotX: 0.014, rotY: 0.008, rotZ: -0.005, orbitR: 3.0, orbitY: 3.4, speed: -0.0004, phase: 2.8 })

      const ball3 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.95, 0), violetMat)
      ball3.position.set(2.0, -3.5, -1.5)
      scene.add(ball3)
      shapes.push({ mesh: ball3, rotX: -0.008, rotY: -0.012, rotZ: 0.01, orbitR: 2.8, orbitY: -3.5, speed: 0.00035, phase: 5.6 })

      // 4. Center-Right Ambient Kinetic Geometries (filling back of hero & page)
      const midOcta = new THREE.Mesh(new THREE.OctahedronGeometry(1.3, 0), goldMat)
      midOcta.position.set(-0.2, 0.5, -2.5)
      scene.add(midOcta)
      shapes.push({ mesh: midOcta, rotX: 0.005, rotY: 0.009, rotZ: 0.004, orbitR: 1.2, orbitY: 0.5, speed: 0.0002, phase: 0 })

      // Ambient Kinetic Orbital Rings
      ringA = new THREE.Mesh(
        new THREE.TorusGeometry(3.5, 0.018, 12, 160),
        new THREE.MeshStandardMaterial({ color: 0xe9c878, metalness: 0.9, roughness: 0.2, transparent: true, opacity: 0.65 })
      )
      ringA.position.set(-1.0, 0, -2)
      ringA.rotation.set(0.8, 0.3, 0)
      scene.add(ringA)

      ringB = new THREE.Mesh(
        new THREE.TorusGeometry(4.2, 0.014, 12, 180),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.8, roughness: 0.3, transparent: true, opacity: 0.55 })
      )
      ringB.position.set(1.2, -0.5, -2.5)
      ringB.rotation.set(-0.5, 0.6, 0.2)
      scene.add(ringB)

      // Star Field
      const starCount = 1400
      const pos = new Float32Array(starCount * 3)
      for (let i = 0; i < starCount; i++) {
        const r = 5 + Math.random() * 20
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
      scene.add(new THREE.AmbientLight(0x312e81, 2.0))
      const keyLight = new THREE.PointLight(0xe9c878, 45, 40)
      keyLight.position.set(5, 5, 8)
      scene.add(keyLight)

      const rimLight = new THREE.PointLight(0x38bdf8, 35, 35)
      rimLight.position.set(-6, -4, 5)
      scene.add(rimLight)

      const violetLight = new THREE.PointLight(0xa855f7, 30, 35)
      violetLight.position.set(0, -6, 4)
      scene.add(violetLight)

      const handleResize = () => {
        renderer.setSize(window.innerWidth, window.innerHeight, false)
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
      }
      window.addEventListener('resize', handleResize)

      let animId

      const render = (t) => {
        animId = requestAnimationFrame(render)

        scrollVelocity += (targetVelocity - scrollVelocity) * 0.15
        targetVelocity *= 0.88

        const rotMultiplier = 1 + Math.abs(scrollVelocity * 2.5)

        camera.position.x += (mouseX * 0.35 - camera.position.x) * 0.04
        camera.position.y += (-mouseY * 0.25 - camera.position.y) * 0.04
        camera.lookAt(0, 0, 0)

        // Rotate and orbit all geometric primitives across the page
        shapes.forEach((item) => {
          item.mesh.rotation.x += item.rotX * rotMultiplier
          item.mesh.rotation.y += item.rotY * rotMultiplier
          item.mesh.rotation.z += item.rotZ * rotMultiplier

          // Gentle floating sine motion
          const orbitTime = t * item.speed + item.phase
          item.mesh.position.y = item.orbitY + Math.sin(orbitTime * 2.5) * 0.35
          item.mesh.position.x += Math.cos(orbitTime * 1.8) * 0.003
        })

        ringA.rotation.z -= 0.003 * rotMultiplier
        ringA.rotation.x += 0.001 * rotMultiplier

        ringB.rotation.y += 0.004 * rotMultiplier
        ringB.rotation.z += 0.002 * rotMultiplier

        particles.rotation.y += 0.0006 * rotMultiplier
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
          <img
            src="/yukti-logo.png"
            alt="YUKTI ’27 Logo"
            className="brand-logo-img"
          />
          <span className="brand-text">YUKTI <span className="gold">’27</span></span>
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

              <h1 className="hero-single-line">YUKTI ’27</h1>

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
            <div className="legacy-frosted-container">
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
