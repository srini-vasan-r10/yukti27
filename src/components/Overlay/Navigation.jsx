/**
 * Navigation.jsx
 * Responsive navigation bar:
 * Desktop: Clean text links & CTA
 * Mobile: Elegant hamburger icon with slide-out overlay menu
 */

import { useState, useEffect } from 'react'

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <>
      <nav className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
        <a href="#home" className="nav__logo" onClick={() => setMenuOpen(false)}>
          YUKTI <span>&rsquo;27</span>
        </a>

        {/* Desktop Links */}
        <ul className="nav__links">
          <li><a href="#home" className="nav__link">Home</a></li>
          <li><a href="#nexus" className="nav__link">Nexus</a></li>
          <li><a href="#pillars" className="nav__link">Pillars</a></li>
          <li><a href="#competitions" className="nav__link">Competitions</a></li>
          <li><a href="#convergence" className="nav__link">Convergence</a></li>
          <li>
            <a href="#register" className="btn-gold" style={{ padding: '0.5rem 1.4rem', fontSize: '0.75rem' }}>
              Register
            </a>
          </li>
        </ul>

        {/* Mobile Hamburger Button */}
        <button
          className={`burger-btn ${menuOpen ? 'burger-btn--open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span className="burger-line"></span>
          <span className="burger-line"></span>
          <span className="burger-line"></span>
        </button>
      </nav>

      {/* Mobile Drawer Overlay */}
      <div className={`mobile-menu-drawer ${menuOpen ? 'mobile-menu-drawer--open' : ''}`}>
        <div className="mobile-menu-links">
          <a href="#home" className="mobile-link" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="#nexus" className="mobile-link" onClick={() => setMenuOpen(false)}>The Nexus</a>
          <a href="#pillars" className="mobile-link" onClick={() => setMenuOpen(false)}>Strategic Pillars</a>
          <a href="#competitions" className="mobile-link" onClick={() => setMenuOpen(false)}>Competitions</a>
          <a href="#convergence" className="mobile-link" onClick={() => setMenuOpen(false)}>Convergence</a>
          <a
            href="#register"
            className="btn-gold"
            style={{ width: '100%', marginTop: '1.5rem', textAlign: 'center' }}
            onClick={() => setMenuOpen(false)}
          >
            Register Now &rarr;
          </a>
        </div>
      </div>
    </>
  )
}
