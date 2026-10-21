import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

export default function App() {
  const canvasRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [modalData, setModalData] = useState(null)
  const [previewMode, setPreviewMode] = useState(false)
  const [dossier, setDossier] = useState(null)

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

      // Update progress bar
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
        metalness: 0.85,
        roughness: 0.2,
        emissive: 0x8a5e20,
        emissiveIntensity: 0.35,
      })
      const purpleMat = new THREE.MeshStandardMaterial({
        color: 0x986aff,
        metalness: 0.65,
        roughness: 0.3,
        emissive: 0x3d146e,
        emissiveIntensity: 0.5,
      })

      // Core icosahedron
      core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.3, 2), goldMat)
      group.add(core)

      const innerWire = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.95, 1),
        new THREE.MeshBasicMaterial({ color: 0x3b1c60, wireframe: true, transparent: true, opacity: 0.85 })
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
        new THREE.MeshStandardMaterial({ color: 0x9a70ff, metalness: 0.8, roughness: 0.3, transparent: true, opacity: 0.75 })
      )
      ringB.rotation.set(0.6, 0.4, 0.2)
      group.add(ringB)

      ringC = new THREE.Mesh(
        new THREE.TorusGeometry(3.3, 0.01, 12, 180),
        new THREE.MeshStandardMaterial({ color: 0xe9c878, metalness: 0.8, roughness: 0.2, transparent: true, opacity: 0.6 })
      )
      ringC.rotation.set(-0.4, 0.7, -0.3)
      group.add(ringC)

      // 8 Satellite Nodes
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2
        const node = new THREE.Mesh(
          new THREE.OctahedronGeometry(0.13 + (i % 3) * 0.025, 0),
          i % 2 ? purpleMat : goldMat
        )
        node.position.set(Math.cos(a) * 2.8, Math.sin(a) * 1.8, Math.sin(a * 2) * 0.6)
        group.add(node)

        const lineGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, 0),
          node.position.clone(),
        ])
        const line = new THREE.Line(
          lineGeo,
          new THREE.LineBasicMaterial({ color: i % 2 ? 0x986aff : 0xe9c878, transparent: true, opacity: 0.3 })
        )
        group.add(line)
        stars.push({ node, a })
      }

      // Star particle field
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
        new THREE.PointsMaterial({ color: 0xc8b2ff, size: 0.022, transparent: true, opacity: 0.75, sizeAttenuation: true })
      )
      scene.add(particles)

      // Lighting
      scene.add(new THREE.AmbientLight(0x8b6ebc, 1.8))
      const keyLight = new THREE.PointLight(0xe9c878, 40, 35)
      keyLight.position.set(4, 5, 6)
      scene.add(keyLight)

      const rimLight = new THREE.PointLight(0x8c51ff, 28, 30)
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

        // Direction-aware velocity rotation: + scroll down = clockwise, - scroll up = anticlockwise
        const rotDelta = 0.005 + (scrollVelocity * 0.08)

        // Desktop: Left side (-2.8) | Mobile (< 850px): Centered in the middle (0)
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

  // Form submission handler
  const handleEoiSubmit = (e) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const name = String(fd.get('name')).trim()
    const college = String(fd.get('college')).trim()
    const email = String(fd.get('email')).trim()
    const interest = String(fd.get('interest')).trim()
    const id = 'YK27-' + Math.random().toString(36).slice(2, 6).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase()

    setDossier({ name, college, email, interest, id })
  }

  return (
    <>
      <div className="progress" id="progress-bar"></div>

      {/* ── Persistent 3D Viewport ────────────────────────────── */}
      <div id="webgl-container">
        <canvas ref={canvasRef} className="hero-canvas" aria-label="3D Strategic Universe Canvas" />
      </div>

      {/* ── Header ───────────────────────────────────────────── */}
      <header className="topbar">
        <a className="brand" href="#home" onClick={() => setMenuOpen(false)}>
          <span className="brandmark"><span>Y</span></span>
          <span>YUKTI <span className="gold">’27</span></span>
        </a>

        {/* Desktop nav */}
        <nav className={`nav ${menuOpen ? 'open' : ''}`}>
          <a href="#vision" onClick={() => setMenuOpen(false)}>The Vision</a>
          <a href="#events" onClick={() => setMenuOpen(false)}>Arena Events</a>
          <a href="#culture" onClick={() => setMenuOpen(false)}>Beyond Business</a>
          <a href="#legacy" onClick={() => setMenuOpen(false)}>Legacy</a>
          <a href="#updates" onClick={() => setMenuOpen(false)}>Signal Desk</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          <a className="btn" href="#register" style={{ marginTop: '10px' }} onClick={() => setMenuOpen(false)}>
            Join the Confluence ↗
          </a>
        </nav>

        <a className="btn" href="#register">Join the Confluence ↗</a>

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
          COMMITTEE PREVIEW MODE — illustrative dates and sample announcements are not official
        </div>
      )}

      <main>
        {/* ═══ SCENE 01: HERO ═══ */}
        <section className="hero" id="home">
          <div className="hero-copy">
            <div className="eyebrow mono">Thiagarajar School of Management · Madurai</div>
            <h1>YUKTI<br /><em>’27</em></h1>
            <p className="hero-sub">
              Where strategy meets imagination. A national-level management and cultural confluence shaped by the next generation of thinkers, builders and performers.
            </p>
            <div className="hero-actions">
              <a className="btn" href="#events">Explore the arena <span>↗</span></a>
              <a className="btn ghost" href="#vision">Enter the experience ↓</a>
            </div>
            <div className="hero-meta">
              <div><span className="mono">Edition</span><strong>2027 · Upcoming</strong></div>
              <div><span className="mono">Dates</span><strong>{previewMode ? 'SAMPLE DATE · NOT OFFICIAL' : 'To be announced'}</strong></div>
              <div><span className="mono">Venue</span><strong>TSM · Madurai</strong></div>
            </div>
          </div>
          <div className="scroll-cue"><span></span>Scroll to enter the nexus</div>
          <div className="side-note">STRATEGY · CREATIVITY · CONFLUENCE</div>
        </section>

        {/* ═══ SCENE 02: MANIFESTO / VISION ═══ */}
        <section className="section manifesto" id="vision">
          <div className="section-head reveal in">
            <div>
              <div className="mono">01 / The Idea</div>
              <h2>A meeting of<br /><span className="gold">many minds.</span></h2>
            </div>
            <p className="section-intro">
              YUKTI — a Sanskrit word for strategy — brings management thought, competition and culture into one shared arena. This is where ideas are tested, perspectives collide and new possibilities take shape.
            </p>
          </div>
          <p className="manifesto-line reveal in">
            Not just a summit.<br /><span>A living network of ambition, insight and action.</span>
          </p>
          <div className="pillar-orbit reveal in" aria-label="Strategic nexus visual">
            <div className="orbit-core">THE<br />NEXUS</div>
            <span className="orbit-label o1">Operations</span>
            <span className="orbit-label o2">Marketing</span>
            <span className="orbit-label o3">Analytics</span>
            <span className="orbit-label o4">Finance</span>
            <span className="orbit-label o5">People</span>
            <span className="orbit-label o6">Strategy</span>
            <span className="orbit-label o7">Enterprise</span>
          </div>
        </section>

        {/* ═══ SCENE 03: EVENTS ARENA ═══ */}
        <section className="section section-dark" id="events">
          <div className="section-head reveal in">
            <div>
              <div className="mono">02 / The Arena</div>
              <h2>Choose your<br /><span className="gold">battleground.</span></h2>
            </div>
            <p className="section-intro">
              Explore the competition tracks that have shaped YUKTI’s event identity. The 2027 rulebooks, eligibility, fees and prizes will be published after committee confirmation.
            </p>
          </div>
          <div className="events-grid">
            {[
              { num: '01', title: 'Optimize', cat: 'Operations & Supply Chain', desc: 'Think in systems. Solve operational constraints, improve flows and turn process complexity into competitive advantage. Format and rulebook pending committee release.' },
              { num: '02', title: 'The Last Knight', cat: 'Best Manager', desc: 'A multi-round test of managerial judgement, leadership, communication and decision-making under pressure. Exact rounds and rules pending release.' },
              { num: '03', title: 'Fintorum', cat: 'Finance & Decision-Making', desc: 'Interrogate numbers, assess risk and make decisions with financial discipline. Official case format and scoring criteria TBA.' },
              { num: '04', title: 'DataVista', cat: 'Business Analytics', desc: 'Turn data into insight. Challenge assumptions, interpret evidence and communicate business recommendations. Dataset and tools TBA.' },
              { num: '05', title: 'Emporia', cat: 'Marketing & Brand Strategy', desc: 'Build customer understanding, shape compelling propositions and translate market insight into a strong brand and growth strategy.' },
              { num: '06', title: 'Manav Prasth', cat: 'Human Resources & People', desc: 'Explore people strategy, organisational behaviour and talent decisions that help teams and businesses thrive.' },
              { num: '07', title: 'BizThrive / TerraPitch', cat: 'Entrepreneurship & Venture Building', desc: 'Move from problem to opportunity. Test venture thinking, market logic and the ability to pitch a business with purpose.' },
              { num: '08', title: 'Quorum Quest', cat: 'Business Quiz & Strategic Auctions', desc: 'A fast-moving arena for business awareness, recall, strategic bidding and team decisions.' },
              { num: '09', title: 'More to Come', cat: 'Official 2027 Announcements', desc: 'The organising committee may add, revise or retire event formats for YUKTI ’27. Follow official announcements for confirmed rulebooks.' },
            ].map((ev, i) => (
              <article
                key={i}
                className="event reveal in"
                onClick={() => setModalData(ev)}
              >
                <div className="num">TRACK {ev.num} / MANAGEMENT</div>
                <div>
                  <h3>{ev.title}</h3>
                  <p>{ev.cat}</p>
                </div>
                <div className="event-foot">
                  <span>Details pending release</span>
                  <span className="arrow">↗</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ═══ SCENE 04: CULTURE ═══ */}
        <section className="section" id="culture">
          <div className="culture">
            <div className="culture-art reveal in"><div className="culture-symbol">Y!</div></div>
            <div className="reveal in">
              <div className="mono">03 / Beyond Business</div>
              <h2>Make some<br /><span className="gold">noise.</span></h2>
              <p className="section-intro">
                The cultural side of YUKTI gives the stage to style, rhythm and visual storytelling. Bring your craft, your crew and your point of view.
              </p>
              <div className="culture-links">
                {[
                  { title: 'StyleVerse', cat: 'Fashion & Style', desc: 'A stage for style, presence and creative expression. Official rules and details TBA.' },
                  { title: 'Rhythm', cat: 'Music & Performance', desc: 'Bring the sound, energy and performance. Exact formats and timings pending release.' },
                  { title: 'Lens', cat: 'Photography & Visual Storytelling', desc: 'See the story others miss. Theme, submission requirements and judging criteria TBA.' },
                ].map((cult, i) => (
                  <button
                    key={i}
                    className="pill"
                    onClick={() => setModalData(cult)}
                  >
                    {cult.title} ↗
                  </button>
                ))}
              </div>
              <p className="fineprint" style={{ marginTop: '22px' }}>
                All listed event names are historical programme references and are subject to confirmation for the 2027 edition.
              </p>
            </div>
          </div>
        </section>

        {/* ═══ SCENE 05: LEGACY / TIMELINE ═══ */}
        <section className="section section-dark" id="legacy">
          <div className="section-head reveal in">
            <div>
              <div className="mono">04 / The Institution</div>
              <h2>Rooted in legacy.<br /><span className="gold">Built for what’s next.</span></h2>
            </div>
            <p className="section-intro">
              YUKTI is hosted by Thiagarajar School of Management (TSM), Madurai. The institution’s heritage and academic credentials represent over 60 years of excellence.
            </p>
          </div>
          <div className="timeline reveal in">
            <div className="timeline-item"><div className="mono">1962</div><strong>TSM Founded</strong><p>Established by philanthropist Karumuttu Thiagarajan Chettiar.</p></div>
            <div className="timeline-item"><div className="mono">1999*</div><strong>YUKTI Tradition</strong><p>The genesis of YUKTI as a national management confluence.</p></div>
            <div className="timeline-item"><div className="mono">17 Acres*</div><strong>A Green Campus</strong><p>A residential campus at Pamban Swamy Nagar, Thiruparankundram, Madurai.</p></div>
            <div className="timeline-item"><div className="mono">2027</div><strong>The Next Chapter</strong><p>A new edition shaped by visionary delegates across the nation.</p></div>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '35px' }} className="reveal in">
            <span className="pill">NAAC A+ Accredited</span>
            <span className="pill">AICTE Approved</span>
            <span className="pill">NBA Accredited</span>
            <span className="pill">AIU Equivalence</span>
            <span className="pill">UN-PRME Member</span>
          </div>
        </section>

        {/* ═══ SCENE 06: REGISTRATION & DOSSIER ═══ */}
        <section className="section register" id="register">
          <div className="register-layout">
            <div className="reveal in">
              <div className="mono">05 / Your First Step</div>
              <h2>Get on the<br /><span className="gold">radar.</span></h2>
              <p className="section-intro">
                Register your interest to receive updates when the official schedule, event rulebooks, delegate fees and participation details are announced.
              </p>
              <div style={{ marginTop: '28px' }}>
                <div className="step"><span>01</span><div><strong>Tell us who you are</strong><small>Basic participant details</small></div></div>
                <div className="step"><span>02</span><div><strong>Choose your interests</strong><small>Management, culture or both</small></div></div>
                <div className="step"><span>03</span><div><strong>Generate your dossier</strong><small>Printable priority delegate reference</small></div></div>
              </div>
            </div>

            <div className="form-panel reveal in">
              <div className="mono" style={{ marginBottom: '20px' }}>Priority delegate · expression of interest</div>
              <form onSubmit={handleEoiSubmit}>
                <div className="fields">
                  <div className="field"><label htmlFor="name">Full name *</label><input id="name" name="name" required placeholder="Your name" /></div>
                  <div className="field"><label htmlFor="email">Email address *</label><input id="email" name="email" type="email" required placeholder="you@college.edu" /></div>
                  <div className="field"><label htmlFor="college">College / institution *</label><input id="college" name="college" required placeholder="Institution name" /></div>
                  <div className="field"><label htmlFor="phone">Phone number</label><input id="phone" name="phone" type="tel" placeholder="Optional" /></div>
                  <div className="field">
                    <label htmlFor="year">Current year / role</label>
                    <select id="year" name="year">
                      <option value="">Choose one</option>
                      <option>UG — 1st year</option>
                      <option>UG — 2nd year</option>
                      <option>UG — 3rd year</option>
                      <option>UG — Final year</option>
                      <option>PG / MBA</option>
                      <option>Faculty / Other</option>
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="interest">Primary interest *</label>
                    <select id="interest" name="interest" required>
                      <option value="">Choose one</option>
                      <option>Management events</option>
                      <option>Cultural events</option>
                      <option>Both management and culture</option>
                      <option>Corporate partnership</option>
                    </select>
                  </div>
                  <div className="field full"><label htmlFor="eventsInterest">Events you may be interested in</label><input id="eventsInterest" name="eventsInterest" placeholder="e.g. DataVista, Emporia, Rhythm" /></div>
                  <div className="field full"><label htmlFor="notes">Anything else? (optional)</label><textarea id="notes" name="notes" rows={3} placeholder="Accessibility needs, team interest, questions…" /></div>
                </div>
                <div className="form-actions">
                  <button className="btn" type="submit">Generate my dossier ↗</button>
                  <span className="fineprint">No payment is collected. Official registration opens after committee release.</span>
                </div>
              </form>

              {dossier && (
                <div className="dossier show">
                  <div className="mono">YUKTI ’27 · Priority Delegate Dossier</div>
                  <h3>Welcome to the radar, {dossier.name}.</h3>
                  <p className="fineprint">{dossier.college} · {dossier.interest} · {dossier.email}</p>
                  <div className="dossier-id">{dossier.id}</div>
                  <p className="fineprint">This is a locally generated reference, not an official ticket.</p>
                  <button className="btn ghost" type="button" onClick={() => window.print()}>
                    Print / Save as PDF ↗
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ═══ SCENE 07: SIGNAL DESK ═══ */}
        <section className="section" id="updates">
          <div className="section-head reveal in">
            <div>
              <div className="mono">06 / Signal Desk</div>
              <h2>Watch this<br /><span className="gold">space.</span></h2>
            </div>
            <p className="section-intro">
              Official dates, theme, rulebooks, registration fees, prize pool and sponsor announcements will appear here once released by the committee.
            </p>
          </div>
          <div className="announcement reveal in">
            <div className="date">STATUS / 2027</div>
            <div>
              <h3>YUKTI ’27 Information Release</h3>
              <p>Dates, theme, registration fees, prize pool, event rulebooks and title sponsors: <span className="gold">TBA — Pending Committee Release.</span></p>
            </div>
            <span className="tba">PENDING</span>
          </div>
        </section>

        {/* ═══ SCENE 08: CONTACT ═══ */}
        <section className="section section-dark" id="contact">
          <div className="section-head reveal in">
            <div>
              <div className="mono">07 / Find Your Way</div>
              <h2>Let’s make it<br /><span className="gold">happen.</span></h2>
            </div>
            <p className="section-intro">
              For institutional information and event-related enquiries, use the contact channels below.
            </p>
          </div>
          <div className="contact-grid reveal in">
            <div className="contact">
              <small>YUKTI Enquiries</small>
              <strong><a href="mailto:yukti@tsm.ac.in">yukti@tsm.ac.in</a></strong>
            </div>
            <div className="contact">
              <small>Admissions / Institution</small>
              <strong><a href="mailto:admissioncell@tsm.ac.in">admissioncell@tsm.ac.in</a></strong>
            </div>
            <div className="contact">
              <small>Official Website</small>
              <strong><a href="https://tsm.ac.in" target="_blank" rel="noopener noreferrer">tsm.ac.in ↗</a></strong>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div>© YUKTI ’27 · Thiagarajar School of Management</div>
        <div>Strategy · Creativity · Confluence</div>
        <div>Built for the next chapter.</div>
      </footer>

      {/* Admin preview toggle button */}
      <button className="admin" onClick={() => setPreviewMode(!previewMode)}>
        {previewMode ? 'PREVIEW MODE: ON ✓' : 'COMMITTEE PREVIEW ↗'}
      </button>

      {/* Event Details Modal */}
      {modalData && (
        <div className="modal open" role="dialog">
          <div className="modal-box">
            <button className="modal-close" onClick={() => setModalData(null)}>×</button>
            <div className="mono">{modalData.cat}</div>
            <h2>{modalData.title}</h2>
            <p>{modalData.desc}</p>
            <span className="tba">2027 DETAILS · TBA</span>
            <div style={{ marginTop: '24px' }}>
              <a className="btn" href="#register" onClick={() => setModalData(null)}>Register Interest ↗</a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
