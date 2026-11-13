import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { SITE_CONFIG, SPONSORS_DATA, MANAGEMENT_EVENTS, CULTURAL_EVENTS } from './utils/confluenceData'
import SEOHead from './utils/SEOHead'
import ManagementEventsPage from './pages/ManagementEventsPage'
import CulturalEventsPage from './pages/CulturalEventsPage'
import RegistrationPortalPage from './pages/RegistrationPortalPage'
import Yukti26SponsorsPage from './pages/Yukti26SponsorsPage'

export default function App() {
  const canvasRef = useRef(null)
  const [currentPage, setCurrentPage] = useState('home') // 'home' | 'management' | 'cultural' | 'portal' | 'sponsors'
  const [menuOpen, setMenuOpen] = useState(false)
  const [modalData, setModalData] = useState(null)
  const [previewMode, setPreviewMode] = useState(false)

  // Sync clean browser URL without full reload (preserves SEO navigation & direct sharing)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase()
      if (path.includes('management')) setCurrentPage('management')
      else if (path.includes('cultural')) setCurrentPage('cultural')
      else if (path.includes('register') || path.includes('portal')) setCurrentPage('portal')
      else if (path.includes('sponsors')) setCurrentPage('sponsors')
      else setCurrentPage('home')
    }

    // Initial check from URL
    handlePopState()
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigateTo = (pageId) => {
    setCurrentPage(pageId)
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })

    const pathMap = {
      home: '/',
      management: '/events/management',
      cultural: '/events/cultural',
      portal: '/register',
      sponsors: '/sponsors'
    }
    const targetPath = pathMap[pageId] || '/'
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ pageId }, '', targetPath)
    }
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

      // Strict Royal Purple & Brilliant Metallic Gold Materials (Zero Blue Tones)
      const deepGoldMat = new THREE.MeshStandardMaterial({
        color: 0xC59B3C, // Deep Gold #C59B3C
        metalness: 0.92,
        roughness: 0.16,
        emissive: 0x4D1D64, // Medium Purple Shading #4D1D64
        emissiveIntensity: 0.4,
      })
      const brightGoldMat = new THREE.MeshStandardMaterial({
        color: 0xF5D77F, // Golden Yellow Highlights #F5D77F
        metalness: 0.88,
        roughness: 0.18,
        emissive: 0xC59B3C,
        emissiveIntensity: 0.45,
      })
      const royalPurpleMat = new THREE.MeshStandardMaterial({
        color: 0x4D1D64, // Royal Medium Purple #4D1D64
        metalness: 0.85,
        roughness: 0.25,
        emissive: 0x1F0E2C, // Deep Purple #1F0E2C
        emissiveIntensity: 0.55,
      })
      const sparkWireMat = new THREE.MeshBasicMaterial({
        color: 0xFFF2A6, // Bright Spark #FFF2A6
        wireframe: true,
        transparent: true,
        opacity: 0.65,
      })

      // Multi-Floating Geometric Clusters distributed across full screen
      const shapes = []

      // 1. Spinning Pyramids (Tetrahedrons)
      const pyramid1 = new THREE.Mesh(new THREE.TetrahedronGeometry(1.25, 0), deepGoldMat)
      pyramid1.position.set(-4.5, 2.2, -1.5)
      scene.add(pyramid1)
      shapes.push({ mesh: pyramid1, rotX: 0.008, rotY: 0.012, rotZ: 0.005, orbitR: 4.8, orbitY: 2.2, speed: 0.0004, phase: 0 })

      const pyramid2 = new THREE.Mesh(new THREE.ConeGeometry(0.9, 1.6, 4), royalPurpleMat)
      pyramid2.position.set(3.8, -2.6, -1.0)
      scene.add(pyramid2)
      shapes.push({ mesh: pyramid2, rotX: -0.009, rotY: 0.014, rotZ: 0.006, orbitR: 4.2, orbitY: -2.6, speed: -0.00035, phase: 2 })

      // 2. Spinning Cubes (Box Geometries with Wireframe Nested Core)
      const cube1 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.4, 1.4), brightGoldMat)
      cube1.position.set(-4.2, -2.4, -0.8)
      const cube1Wire = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.7, 1.7), sparkWireMat)
      cube1.add(cube1Wire)
      scene.add(cube1)
      shapes.push({ mesh: cube1, rotX: 0.01, rotY: -0.011, rotZ: 0.007, orbitR: 4.5, orbitY: -2.4, speed: 0.0003, phase: 3.5 })

      const cube2 = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.1, 1.1), deepGoldMat)
      cube2.position.set(4.6, 2.8, -2.0)
      scene.add(cube2)
      shapes.push({ mesh: cube2, rotX: -0.012, rotY: 0.008, rotZ: -0.006, orbitR: 5.0, orbitY: 2.8, speed: -0.00045, phase: 1.2 })

      // 3. Spinning Spheres / Balls (Icosahedrons & Smooth Spheres)
      const ball1 = new THREE.Mesh(new THREE.IcosahedronGeometry(1.1, 2), brightGoldMat)
      ball1.position.set(-1.8, -3.2, 0)
      const ballRing = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.02, 8, 80), sparkWireMat)
      ballRing.rotation.x = Math.PI / 3
      ball1.add(ballRing)
      scene.add(ball1)
      shapes.push({ mesh: ball1, rotX: 0.006, rotY: 0.015, rotZ: 0.009, orbitR: 2.5, orbitY: -3.2, speed: 0.0005, phase: 4.8 })

      const ball2 = new THREE.Mesh(new THREE.SphereGeometry(0.85, 24, 24), royalPurpleMat)
      ball2.position.set(-2.2, 3.4, -1.2)
      scene.add(ball2)
      shapes.push({ mesh: ball2, rotX: 0.014, rotY: 0.008, rotZ: -0.005, orbitR: 3.0, orbitY: 3.4, speed: -0.0004, phase: 2.8 })

      const ball3 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.95, 0), deepGoldMat)
      ball3.position.set(2.0, -3.5, -1.5)
      scene.add(ball3)
      shapes.push({ mesh: ball3, rotX: -0.008, rotY: -0.012, rotZ: 0.01, orbitR: 2.8, orbitY: -3.5, speed: 0.00035, phase: 5.6 })

      // 4. Center-Right Ambient Kinetic Geometries (filling back of hero & page)
      const midOcta = new THREE.Mesh(new THREE.OctahedronGeometry(1.3, 0), brightGoldMat)
      midOcta.position.set(-0.2, 0.5, -2.5)
      scene.add(midOcta)
      shapes.push({ mesh: midOcta, rotX: 0.005, rotY: 0.009, rotZ: 0.004, orbitR: 1.2, orbitY: 0.5, speed: 0.0002, phase: 0 })

      // Ambient Kinetic Orbital Rings (Gold & Deep Purple)
      ringA = new THREE.Mesh(
        new THREE.TorusGeometry(3.5, 0.018, 12, 160),
        new THREE.MeshStandardMaterial({ color: 0xF5D77F, metalness: 0.95, roughness: 0.15, transparent: true, opacity: 0.7 })
      )
      ringA.position.set(-1.0, 0, -2)
      ringA.rotation.set(0.8, 0.3, 0)
      scene.add(ringA)

      ringB = new THREE.Mesh(
        new THREE.TorusGeometry(4.2, 0.014, 12, 180),
        new THREE.MeshStandardMaterial({ color: 0xC59B3C, metalness: 0.9, roughness: 0.2, transparent: true, opacity: 0.6 })
      )
      ringB.position.set(1.2, -0.5, -2.5)
      ringB.rotation.set(-0.5, 0.6, 0.2)
      scene.add(ringB)

      // Star Field (Golden and Purple Stardust)
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
        new THREE.PointsMaterial({ color: 0xFFF2A6, size: 0.024, transparent: true, opacity: 0.8, sizeAttenuation: true })
      )
      scene.add(particles)

      // Lighting: Warm Gold & Royal Purple Radiance
      scene.add(new THREE.AmbientLight(0x27113A, 2.2))
      const keyLight = new THREE.PointLight(0xFFF2A6, 50, 45)
      keyLight.position.set(5, 5, 8)
      scene.add(keyLight)

      const rimLight = new THREE.PointLight(0xF5D77F, 40, 40)
      rimLight.position.set(-6, -4, 5)
      scene.add(rimLight)

      const violetLight = new THREE.PointLight(0x4D1D64, 45, 40)
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
            src="/yukti-logo.webp"
            alt="YUKTI ’27 Logo"
            className="brand-logo-img"
            width="42"
            height="42"
            fetchpriority="high"
          />
          <div className="brand-text-block">
            <span className="brand-text">YUKTI <span className="gold">’27</span></span>
            <span className="brand-theme-sub">INTANGIBLES</span>
          </div>
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
          {/*
          <a
            href="#sponsors"
            className={currentPage === 'sponsors' ? 'active-nav-link' : ''}
            onClick={(e) => { e.preventDefault(); navigateTo('sponsors') }}
          >
            YUKTI ’26 Sponsors
          </a>
          */}

          {/* Mobile-only menu CTA */}
          {menuOpen && (
            <button
              className="btn"
              style={{ marginTop: '14px', width: '100%' }}
              onClick={() => navigateTo('portal')}
            >
              Join Confluence ↗
            </button>
          )}
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
      {currentPage === 'home' && (
        <SEOHead
          path="/"
          eventSchema={true}
        />
      )}

      {currentPage === 'management' && (
        <>
          <SEOHead
            title="Management Events & National Flagship Arenas"
            description="Explore 8 flagship national management events at YUKTI '27: The AI CEO Challenge, Market Mavericks, Boardroom Crisis, and more at TSM Madurai. Register your team."
            path="/events/management"
            subEvents={MANAGEMENT_EVENTS}
            eventSchema={true}
          />
          <ManagementEventsPage
            onSelectEvent={(ev) => setModalData(ev)}
            onBackToHome={() => navigateTo('home')}
            onOpenRegister={() => navigateTo('portal')}
          />
        </>
      )}

      {currentPage === 'cultural' && (
        <>
          <SEOHead
            title="Cultural Confluence & Artistic Spectacles"
            description="Experience uninhibited artistry, battle of the bands, choreography, and solo performances at YUKTI '27 Cultural Confluence, TSM Madurai."
            path="/events/cultural"
            subEvents={CULTURAL_EVENTS}
            eventSchema={true}
          />
          <CulturalEventsPage
            onSelectEvent={(ev) => setModalData(ev)}
            onBackToHome={() => navigateTo('home')}
            onOpenRegister={() => navigateTo('portal')}
          />
        </>
      )}

      {currentPage === 'portal' && (
        <>
          <SEOHead
            title="Registration Portal — Delegate Passes & Arena Entry"
            description="Register your delegation and team for YUKTI '27 at Thiagarajar School of Management (TSM), Madurai. Stake your claim in the ₹20,00,000 national bounty."
            path="/register"
          />
          <RegistrationPortalPage
            onBackToHome={() => navigateTo('home')}
          />
        </>
      )}

      {currentPage === 'sponsors' && (
        <>
          <SEOHead
            title="Sponsors & Corporate Partners"
            description="Corporate partners, sponsors, and supporters of YUKTI at Thiagarajar School of Management (TSM), Madurai."
            path="/sponsors"
          />
          <Yukti26SponsorsPage
            onBackToHome={() => navigateTo('home')}
            onOpenRegister={() => navigateTo('portal')}
          />
        </>
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

              <div className="hero-titles-wrap">
                <h1 className="hero-single-line">YUKTI ’27</h1>
                <div className="hero-theme-clean-subtitle">
                  <div className="theme-super-title">INTANGIBLES</div>
                  <div className="theme-tagline-text mono">INFINITE POSSIBILITIES</div>
                </div>
              </div>

              <div className="theme-headline-badge mono">
                Pan-India Management & Cultural Fest
              </div>

              <p className="hero-sub">
                Exploring the human-AI nexus, celebrating the core values of innovation and creativity. Where logic meets magic and human intuition collaborates with artificial intelligence.
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
                    Twenty Lakhs Rupees in total cash bounties, national rolling shields, and corporate incubation grants across 12 flagship arenas.
                  </p>
                </div>
              </div>

              {/* Primary Call-to-Action Buttons */}
              <div className="hero-actions">
                <button className="btn" onClick={() => navigateTo('portal')}>
                  Register for YUKTI ’27 ↗
                </button>
                <button className="btn ghost" onClick={() => navigateTo('management')}>
                  Management Tracks (6) ↗
                </button>
                <button className="btn ghost" onClick={() => navigateTo('cultural')}>
                  Cultural Tracks (6) ↗
                </button>
              </div>

              <div className="hero-meta">
                <div><span className="mono">Grand Bounty</span><strong className="gold">₹20,00,000</strong></div>
                <div><span className="mono">Theme</span><strong>INTANGIBLES</strong></div>
                <div><span className="mono">Confirmed Dates</span><strong>{SITE_CONFIG.dates}</strong></div>
                <div><span className="mono">Campus</span><strong>TSM · Madurai</strong></div>
              </div>
            </div>

            <div className="scroll-cue"><span></span>Scroll to explore the summit</div>
            <div className="side-note">INNOVATION · CULTURE · LEADERSHIP</div>
          </section>

          {/* ═══ NEW: ABOUT YUKTI '27 SECTION ═══ */}
          <section className="section about-yukti-section">
            <div className="about-frosted-container">
              <div className="about-split-grid">
                <div className="about-copy-col">
                  <span className="mono gold">The Essence & Philosophy</span>
                  <h2 className="about-title">ABOUT YUKTI ’27</h2>
                  <blockquote className="about-quote">
                    "{SITE_CONFIG.aboutQuote}"
                  </blockquote>
                  <p className="about-description">
                    For over two decades, YUKTI has stood as the premier pan-India platform where the brightest business minds and creative powerhouses converge. The 2027 edition explores the <strong>INTANGIBLES</strong>—celebrating visionary leadership, deep strategy, and pure creative expression.
                  </p>
                  <div className="about-pillars-row">
                    <div className="pillar-item">
                      <span className="pillar-icon">✦</span>
                      <div>
                        <strong>INNOVATION</strong>
                        <small>Algorithmic Strategy & Boardroom Trials</small>
                      </div>
                    </div>
                    <div className="pillar-item">
                      <span className="pillar-icon">◈</span>
                      <div>
                        <strong>CULTURE</strong>
                        <small>Uninhibited Artistry & Musical Mastery</small>
                      </div>
                    </div>
                    <div className="pillar-item">
                      <span className="pillar-icon">❖</span>
                      <div>
                        <strong>LEADERSHIP</strong>
                        <small>Executive Composure Under Extreme Flux</small>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="about-crest-showcase">
                  <div className="tsm-crest-frame">
                    <img
                      src="/tsm-logo.webp"
                      alt="TSM Madurai Crest"
                      className="about-tsm-crest-img"
                      loading="lazy"
                      width="160"
                      height="160"
                    />
                    <div className="crest-halo" />
                  </div>
                  <div className="tsm-legacy-badge">
                    <strong>THIAGARAJAR SCHOOL OF MANAGEMENT</strong>
                    <span>Madurai, Tamil Nadu · Founded 1962</span>
                    <small className="mono gold">NAAC A+ & NBA ACCREDITED B-SCHOOL</small>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ═══ SPONSORSHIP CONTINUOUS MARQUEE (Restored on Homepage) ═══ */}
          <section className="sponsors-marquee-section">
            <div className="marquee-section-head">
              <span className="mono gold">Legacy of Trust · Corporate Partners & Supporters</span>
              <h3>Proudly Supported by Industry Titans</h3>
            </div>

            <div className="sponsors-marquee-track-wrap">
              <div className="sponsors-marquee-track single-line-loop">
                {[...SPONSORS_DATA, ...SPONSORS_DATA].map((sp, idx) => (
                  <div key={idx} className="marquee-sponsor-tile">
                    <div className="tile-ambient-glow" style={{ background: sp.bg }} />
                    <div className="marquee-tile-content">
                      <div className="marquee-tile-logo-frame">
                        <img
                          src={sp.logoImg}
                          alt={sp.name}
                          className="marquee-sponsor-img"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <div className="marquee-tile-info">
                        <span className="marquee-sp-name">{sp.name}</span>
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

          {/* ═══ NEW: WHY ATTEND SECTION ═══ */}
          <section className="section why-attend-section">
            <div className="section-head reveal in">
              <div>
                <div className="mono gold">The Collegiate Crucible</div>
                <h2>WHY ATTEND <span className="gold">YUKTI ’27?</span></h2>
              </div>
              <p className="section-intro">
                More than a competition — a crucible of national leadership, venture stress-testing, and stage mastery designed to accelerate your corporate and creative trajectory.
              </p>
            </div>

            <div className="why-attend-grid">
              <div className="why-card">
                <div className="why-icon-badge">✦</div>
                <h3>Pan-India Networking</h3>
                <p>Congregate alongside 1,800+ top-tier delegates and university delegations spanning 60+ premiere Indian B-schools and universities.</p>
                <span className="mono gold why-stat">60+ Premier Institutions</span>
              </div>

              <div className="why-card">
                <div className="why-icon-badge">◈</div>
                <h3>Innovation & Strategy</h3>
                <p>Test your strategic decision-making against unscripted boardroom crisis simulations, valuation sprints, and algorithmic cases.</p>
                <span className="mono gold why-stat">Real-World Case Juries</span>
              </div>

              <div className="why-card">
                <div className="why-icon-badge">❖</div>
                <h3>Pan-India Exposure</h3>
                <p>Present before veteran industry CEOs, venture capitalists, and national critics with direct corporate mentorship and placement mindshare.</p>
                <span className="mono gold why-stat">Executive Evaluation</span>
              </div>

              <div className="why-card highlighted-why-card">
                <div className="why-icon-badge">★</div>
                <h3>Cash Bounties & Honors</h3>
                <p>Compete for the monumental ₹20,00,000 national bounty pool, prestigious rolling shields, medals, and startup incubation grants.</p>
                <span className="mono gold why-stat">₹20L Total Bounty</span>
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

      {/* ── Creative High-Impact Global Footer ─────────────────── */}
      <footer className="site-footer creative-footer">
        <div className="footer-top-row">
          <div className="footer-brand-col">
            <div className="footer-dual-logos">
              <div className="footer-logo-ring">
                <img src="/yukti-logo.webp" alt="YUKTI ’27 Logo" className="footer-yukti-logo" loading="lazy" width="64" height="64" />
              </div>
              <div className="footer-logo-divider" />
              <div className="footer-logo-ring">
                <img src="/tsm-logo.webp" alt="TSM Madurai Crest" className="footer-tsm-logo" loading="lazy" width="64" height="64" />
              </div>
            </div>
            <div className="footer-titles">
              <span className="footer-super">YUKTI ’27 · INTANGIBLES</span>
              <p className="footer-venue">Thiagarajar School of Management (TSM), Madurai – 625005</p>
              <small className="mono gold">NAAC A+ & NBA ACCREDITED · ESTD 1962</small>
            </div>
          </div>

          <div className="footer-nav-columns">
            <div className="footer-col-block">
              <span className="mono gold col-title">Confluences</span>
              <a href="#management" onClick={(e) => { e.preventDefault(); navigateTo('management') }}>Management Arenas (6)</a>
              <a href="#cultural" onClick={(e) => { e.preventDefault(); navigateTo('cultural') }}>Cultural Confluence (6)</a>
              <a href="#portal" onClick={(e) => { e.preventDefault(); navigateTo('portal') }}>Registration Portal</a>
              {/*
              <a href="#sponsors" onClick={(e) => { e.preventDefault(); navigateTo('sponsors') }}>YUKTI ’26 Sponsors</a>
              */}
            </div>

            <div className="footer-col-block">
              <span className="mono gold col-title">Reach Out</span>
              <span className="contact-link">Email: <a href="mailto:yukti@tsm.ac.in">yukti@tsm.ac.in</a></span>
              <span className="contact-link">Portal: <a href="https://yukti27.tsm.ac.in" target="_blank" rel="noreferrer">yukti27.tsm.ac.in</a></span>
              <span className="contact-link">Instagram: <a href="https://instagram.com/yukti_tsm" target="_blank" rel="noreferrer">@yukti_tsm</a></span>
            </div>
          </div>
        </div>

        {/* Brochure Footer Pillar Ribbon */}
        <div className="footer-ribbon-bar">
          <div className="ribbon-text mono">
            POWERED BY <span className="gold">INNOVATION</span> | <span className="gold">CULTURE</span> | <span className="gold">LEADERSHIP</span>
          </div>
          <div className="footer-sub-note">
            © 2027 Thiagarajar School of Management. All rights reserved.
          </div>
        </div>
      </footer>

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
