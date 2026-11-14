import React, { useEffect, useState, useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import JsBarcode from 'jsbarcode'
import SEOHead from '../utils/SEOHead'

/**
 * DelegatePassPage Component
 * Perfectly calibrated for standard A4 sheet single-page printing.
 * In browser: Luxurious dark gold/purple boarding pass aesthetic.
 * In print / PDF: Automatically converts to crisp black-and-white / gold A4 page with 0 page breaks, 0 clipping, and perfect 1-page fit!
 */
export default function DelegatePassPage({ onBackToHome }) {
  const [passData, setPassData] = useState(null)
  const [isDirectAccess, setIsDirectAccess] = useState(false)
  const [typedKeys, setTypedKeys] = useState('')
  const [emojis, setEmojis] = useState([])
  const [celebrating, setCelebrating] = useState(false)
  const [jumbledLetters, setJumbledLetters] = useState(['K', 'U', 'I', 'Y', 'T'])
  const barcodeRef = useRef(null)

  // Wholesome, fun, safe emojis pool
  const safeEmojis = [
    '✨', '🚀', '🎉', '🌟', '🦄', '🔥', '⚡', '🏆', 
    '🎈', '🎊', '👑', '💎', '🎯', '🍀', '🍕', '🎮', 
    '👾', '🌈', '🥳', '🪄', '💡', '🎸', '🛸', '⭐'
  ]

  // Reshuffle jumbled letters periodically or on click
  const shuffleJumbledLetters = () => {
    const letters = ['Y', 'U', 'K', 'T', 'I']
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]]
    }
    setJumbledLetters(letters)
  }

  // Trigger input for a character (used by both keyboard typing and phone/tablet jumbled button taps)
  const handleCharInput = (char) => {
    const key = char.toLowerCase()
    const randomEmoji = safeEmojis[Math.floor(Math.random() * safeEmojis.length)]
    const newEmojiItem = {
      id: Date.now() + Math.random(),
      char: randomEmoji,
      letter: key.toUpperCase(),
      x: Math.random() * 75 + 12,
      y: Math.random() * 55 + 20
    }
    setEmojis(prev => [...prev.slice(-8), newEmojiItem])

    setTypedKeys(prev => {
      const next = (prev + key).slice(-5)
      if (next === 'yukti') {
        setCelebrating(true)
        setTimeout(() => {
          window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1'
        }, 1800)
      }
      return next
    })
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const name = params.get('name')
    const regId = params.get('regId')

    // If directly accessed without query params or without a valid regId / name
    if (!name && !regId) {
      setIsDirectAccess(true)
      shuffleJumbledLetters()
      return
    }

    const college = params.get('college')
    const phone = params.get('phone')
    const email = params.get('email')
    const event = params.get('event')
    const teamName = params.get('teamName')
    const year = params.get('year')
    const delegationType = params.get('delegationType')
    const members = params.get('members')
    const fee = params.get('fee')
    const utr = params.get('utr')

    setPassData({
      name: name || 'Valued Delegate',
      college: college || 'Thiagarajar School of Management (TSM)',
      phone: phone || '',
      email: email || '',
      event: event || 'All-Confluence Arena',
      teamName: teamName || (name ? `${name}'s Squad` : 'YUKTI Delegation'),
      regId: regId || 'YK27-DELEGATE',
      year: year || 'PG / MBA Final Year',
      delegationType: delegationType || 'Competitor Pass (Team Entry)',
      members: members ? members.split(',').filter(Boolean) : [],
      fee: fee || '₹500',
      utr: utr || 'VERIFIED-UPI'
    })
  }, [])

  // Easter Egg keyboard listener for direct 404 page
  useEffect(() => {
    if (!isDirectAccess) return

    const handleKeyDown = (e) => {
      // Ignore meta / control keys
      if (e.metaKey || e.ctrlKey || e.altKey) return
      
      const key = e.key.toLowerCase()
      if (key.length === 1 && key >= 'a' && key <= 'z') {
        handleCharInput(key)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isDirectAccess])

  // Render authentic Code 128 barcode once passData is loaded
  useEffect(() => {
    if (barcodeRef.current && passData?.regId) {
      try {
        JsBarcode(barcodeRef.current, passData.regId, {
          format: 'CODE128',
          lineColor: '#C59B3C',
          width: 1.4,
          height: 38,
          displayValue: false,
          margin: 0,
          background: 'transparent'
        })
      } catch (e) {
        console.warn('JsBarcode render error:', e)
      }
    }
  }, [passData])

  // If user directly opened /pass with no valid credentials/query params, show the Easter Egg 404
  if (isDirectAccess) {
    return (
      <div className="pass-page-wrapper" style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', textAlign: 'center', padding: '40px 20px', position: 'relative', overflow: 'hidden' }}>
        <SEOHead
          title="404 — Delegate Pass Not Found | YUKTI ’27"
          description="Direct access restricted. Pass dockets are accessible only through verified registration or official QR scan."
          path="/pass"
        />

        {/* Floating animated emojis typed by user */}
        {emojis.map(item => (
          <div
            key={item.id}
            style={{
              position: 'absolute',
              left: `${item.x}%`,
              top: `${item.y}%`,
              fontSize: '2.5rem',
              pointerEvents: 'none',
              animation: 'floatUpFade 1.8s ease-out forwards',
              zIndex: 40
            }}
          >
            {item.char}
            <span style={{ fontSize: '0.8rem', color: '#FFF2A6', fontWeight: 'bold', display: 'block', textShadow: '0 0 8px #000' }}>
              {item.letter}
            </span>
          </div>
        ))}

        <div style={{ maxWidth: '640px', background: '#150924', border: '2px solid #C59B3C', borderRadius: '24px', padding: '40px 30px', boxShadow: '0 20px 80px rgba(0,0,0,0.9)', zIndex: 30, position: 'relative' }}>
          <div className="mono gold" style={{ fontSize: '0.9rem', letterSpacing: '0.2em' }}>RESTRICTED SECURITY ZONE · 404</div>
          
          <h1 style={{ fontSize: 'clamp(3.5rem, 8vw, 6rem)', margin: '10px 0', color: '#F5D77F', fontFamily: "'Space Grotesk', sans-serif" }}>
            404
          </h1>

          <h2 style={{ fontSize: '1.4rem', color: '#FFF2A6', marginBottom: '14px' }}>
            {celebrating ? '🎉 BINGO! YUKTI CONFLUENCE UNLOCKED! 🎉' : 'Delegate Pass Docket Not Found'}
          </h2>

          <p style={{ color: '#cbd5e1', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '22px' }}>
            {celebrating ? (
              <strong style={{ color: '#10b981' }}>Stand by... Transporting you to the Grand Symphony! 🚀🎶</strong>
            ) : (
              <>
                Pass credentials cannot be accessed directly without an authenticated registration docket or scanning your verified physical/receipt QR code.
              </>
            )}
          </p>

          {/* Easter egg instruction prompt (Dual: PC typing & Mobile/Tablet touch keypad) */}
          <div style={{
            background: 'rgba(77,29,100,0.4)',
            border: '1px dashed #C59B3C',
            borderRadius: '14px',
            padding: '18px 20px',
            marginBottom: '26px'
          }}>
            <div style={{ fontSize: '0.82rem', color: '#F5D77F', fontWeight: 'bold', marginBottom: '6px' }}>
              🕹️ DESKTOP, PHONE OR TABLET EASTER EGG
            </div>
            <div style={{ fontSize: '0.84rem', color: '#e2d9eb', lineHeight: '1.5' }}>
              On PC? Type <strong style={{ color: '#FFF2A6', letterSpacing: '0.15em', background: '#1F0E2C', padding: '2px 8px', borderRadius: '4px', border: '1px solid #C59B3C' }}>"yukti"</strong>.
              <br />
              On a Phone / Tablet? Tap the jumbled letters below in order to spell <strong>Y-U-K-T-I</strong>!
            </div>

            {/* Jumbled YUKTI Interactive Keypad for Phone & Tablet */}
            <div style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                {jumbledLetters.map((char, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleCharInput(char)}
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '12px',
                      background: 'linear-gradient(145deg, #2b133d 0%, #150924 100%)',
                      border: '2px solid #C59B3C',
                      color: '#FFF2A6',
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: '1.35rem',
                      fontWeight: '800',
                      cursor: 'pointer',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.6), inset 0 1px 2px rgba(255,255,255,0.2)',
                      transition: 'transform 0.15s ease, background 0.2s',
                      display: 'grid',
                      placeItems: 'center'
                    }}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.92)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    onTouchStart={(e) => e.currentTarget.style.transform = 'scale(0.92)'}
                    onTouchEnd={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    aria-label={`Letter ${char}`}
                  >
                    {char}
                  </button>
                ))}
              </div>

              {/* Reshuffle button */}
              <button
                type="button"
                onClick={shuffleJumbledLetters}
                style={{
                  marginTop: '12px',
                  background: 'transparent',
                  border: 'none',
                  color: '#F5D77F',
                  fontFamily: 'monospace',
                  fontSize: '0.72rem',
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                🔀 Reshuffle Jumbled Letters
              </button>
            </div>

            {typedKeys && (
              <div className="mono" style={{ marginTop: '12px', fontSize: '0.80rem', color: '#10b981', background: 'rgba(0,0,0,0.4)', padding: '6px 12px', borderRadius: '6px', display: 'inline-block' }}>
                Letters Pressed: [{typedKeys.toUpperCase()}]
              </div>
            )}
          </div>

          <button
            className="btn"
            onClick={onBackToHome}
            style={{
              padding: '12px 28px',
              fontSize: '0.88rem',
              background: 'linear-gradient(135deg, #FFF2A6 0%, #C59B3C 100%)',
              color: '#1F0E2C',
              fontWeight: 800,
              border: 'none',
              borderRadius: '10px'
            }}
          >
            ← Return to Confluence Home
          </button>
        </div>

        <style>{`
          @keyframes floatUpFade {
            0% { transform: translateY(0) scale(0.6); opacity: 1; }
            100% { transform: translateY(-70px) scale(1.3); opacity: 0; }
          }
        `}</style>
      </div>
    )
  }

  if (!passData) return null

  // Payload encoded in the entry security QR code on the pass:
  // Provides full structured information for fast gate scanner apps / smartphones:
  // Team name, arena/event, team leader and contact details, and member roster.
  const qrPassPayload = [
    `YUKTI '27 OFFICIAL ENTRY PASS`,
    `----------------------------`,
    `DOCKET ID: ${passData.regId}`,
    `TEAM: ${passData.teamName || 'N/A'}`,
    `EVENT: ${passData.event || 'Flagship Arena'}`,
    `TEAM LEADER: ${passData.name}`,
    passData.phone ? `CONTACT: ${passData.phone}` : null,
    passData.email ? `EMAIL: ${passData.email}` : null,
    `COLLEGE: ${passData.college}`,
    `MEMBERS: ${passData.members && passData.members.length > 0 ? passData.members.join(', ') : 'Single Contender'}`,
    `STATUS: PAID & VERIFIED (${passData.fee || '₹500'})`,
    `UTR REF: ${passData.utr || 'VERIFIED'}`,
    `VENUE: TSM Madurai (Jan 28-30, 2027)`
  ].filter(Boolean).join('\n')

  return (
    <div className="pass-page-wrapper">
      <SEOHead
        title="Official Delegate Entry Pass — YUKTI ’27"
        description="Official YUKTI '27 delegate entry badge and security pass for Thiagarajar School of Management (TSM), Madurai."
        path="/pass"
      />

      {/* Screen-Only Controls Bar */}
      <div className="no-print pass-screen-bar">
        <button className="back-breadcrumb-btn" onClick={onBackToHome}>
          ← Return to Confluence
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="mono gold" style={{ fontSize: '0.78rem' }}>1-PAGE A4 FRIENDLY PASS</span>
          <button className="btn print-trigger-btn" onClick={() => window.print()}>
            🖨️ Print Pass / Save as PDF
          </button>
        </div>
      </div>

      {/* ═══ STANDARDIZED SINGLE-PAGE A4 PASS SHEET ═══ */}
      <div className="a4-pass-container">
        {/* Pass Outer Border Box */}
        <div className="a4-pass-card">
          
          {/* 1. Header with Dual Logos & Accreditation */}
          <div className="pass-header-section">
            <div className="pass-logo-title-group">
              <img src="/yukti-logo.png" alt="YUKTI '27 Logo" className="pass-yukti-crest" />
              <div>
                <h2 className="pass-inst-title">THIAGARAJAR SCHOOL OF MANAGEMENT (TSM) · MADURAI</h2>
                <span className="pass-inst-sub">NAAC A+ & NBA ACCREDITED B-SCHOOL · FOUNDED 1962</span>
              </div>
            </div>
            <img src="/tsm-logo.png" alt="TSM Crest" className="pass-tsm-crest" />
          </div>

          {/* 2. Main Fest Title & Theme Banner */}
          <div className="pass-hero-banner">
            <h1 className="pass-main-title">YUKTI ’27</h1>
            <div className="pass-theme-tagline">INTANGIBLES — INFINITE POSSIBILITIES</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
              <span className="pass-status-pill">OFFICIAL ALL-CONFLUENCE DELEGATE ENTRY BADGE</span>
              {passData.event && (
                <span className="pass-status-pill" style={{ background: 'rgba(197,155,60,0.18)', borderColor: '#C59B3C', color: '#FFF2A6' }}>
                  ARENA: {passData.event}
                </span>
              )}
            </div>
          </div>

          {/* 3. Delegate Credentials & Barcode Grid */}
          <div className="pass-details-grid">
            {/* Avatar / Barcode Column */}
            <div className="pass-avatar-box">
              <div className="pass-avatar-icon">🎓</div>
              {/* Authentic Barcode generated via jsbarcode */}
              <div className="pass-barcode-wrapper">
                <svg ref={barcodeRef} className="pass-real-barcode"></svg>
              </div>
              <span className="pass-docket-id">{passData.regId}</span>
            </div>

            {/* Delegate Info */}
            <div className="pass-meta-col">
              <div className="pass-field">
                <span className="pass-field-label">TEAM LEADER (PRIMARY)</span>
                <strong className="pass-field-value-primary">{passData.name}</strong>
              </div>
              <div className="pass-field">
                <span className="pass-field-label">COLLEGE / INSTITUTION</span>
                <span className="pass-field-value">{passData.college}</span>
              </div>
              {passData.phone && (
                <div className="pass-field">
                  <span className="pass-field-label">LEADER CONTACT</span>
                  <span className="pass-field-value mono" style={{ fontSize: '0.78rem', color: '#F5D77F' }}>
                    {passData.phone}
                  </span>
                </div>
              )}
            </div>

            {/* Pass Category & Academic Level */}
            <div className="pass-meta-col">
              <div className="pass-field">
                <span className="pass-field-label">TEAM SQUAD NAME</span>
                <strong className="pass-field-value-gold" style={{ color: '#FFF2A6' }}>
                  {passData.teamName || `${passData.name}'s Contingent`}
                </strong>
              </div>
              <div className="pass-field">
                <span className="pass-field-label">ACADEMIC LEVEL</span>
                <strong className="pass-field-value">{passData.year}</strong>
              </div>
              <div className="pass-field">
                <span className="pass-field-label">PASS CLASSIFICATION</span>
                <span className="pass-field-value-gold">🎖️ {passData.delegationType}</span>
              </div>
            </div>
          </div>

          {/* 4. Contingent Members Roster (One team, one pass) */}
          {passData.members && passData.members.length > 0 && (
            <div className="pass-members-box">
              <span className="pass-section-label">CONFIRMED CONTINGENT TEAM ROSTER:</span>
              <div className="pass-members-chips">
                {passData.members.map((m, idx) => (
                  <span key={idx} className="pass-member-chip">
                    👤 {m}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 5. Access Zones & Verification QR Row */}
          <div className="pass-zones-qr-row">
            {/* Permitted Campus Zones */}
            <div className="pass-zones-box">
              <span className="pass-section-label">PERMITTED ALL-CONFLUENCE CAMPUS ZONES:</span>
              <div className="pass-zones-checklist">
                <div>☑ Auditorium A (Main Stage & Keynotes)</div>
                <div>☑ Boardroom Syndicate Rooms</div>
                <div>☑ Open Amphitheatre (Cultural Evening)</div>
                <div>☑ Executive Networking & Dining Hall</div>
              </div>

              {/* Logistics & Dates */}
              <div className="pass-logistics-strip">
                <div>
                  <span className="pass-micro-label">CONFERENCE DATES</span>
                  <strong>January 28, 29 & 30, 2027</strong>
                </div>
                <div>
                  <span className="pass-micro-label">REPORTING DESK</span>
                  <strong>08:30 AM IST · Main Foyer</strong>
                </div>
                <div>
                  <span className="pass-micro-label">CAMPUS VENUE</span>
                  <strong>TSM Madurai – 625005</strong>
                </div>
              </div>
            </div>

            {/* Verification Security QR & Stamp */}
            <div className="pass-security-box">
              <span className="pass-qr-header">SCAN AT GATE ENTRY</span>
              <div className="pass-qr-frame">
                <QRCodeSVG
                  value={qrPassPayload}
                  size={118}
                  level="M"
                  includeMargin={false}
                />
              </div>
              <div className="pass-verified-badge">PAID & VERIFIED — {passData.fee}</div>
              <span className="pass-txn-ref">Txn Ref: {passData.utr}</span>
            </div>
          </div>

          {/* 6. Footer Legal & Guidelines */}
          <div className="pass-guidelines-footer">
            <div>1. Mandatory valid Student / College ID card must be presented with this pass at the gate.</div>
            <div>2. Non-transferable ticket; committee reserves right of admission. 3. Wi-Fi: TSM-GUEST.</div>
            <div>4. Committee helpline: yukti@tsm.ac.in | Instagram: @yukti.tsm | Website: yukti27.tsm.ac.in</div>
          </div>
        </div>
      </div>

      {/* ═══ PRINT & SCREEN STYLES (Strict A4 Page Formatting) ═══ */}
      <style>{`
        .pass-page-wrapper {
          min-height: 100vh;
          padding: 90px 4vw 60px;
          background: #090412;
          color: #ffffff;
          font-family: 'Plus Jakarta Sans', sans-serif;
          position: relative;
          z-index: 25;
        }
        .pass-screen-bar {
          max-width: 900px;
          margin: 0 auto 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          position: relative;
          z-index: 30;
        }
        .print-trigger-btn {
          background: linear-gradient(135deg, #FFF2A6 0%, #C59B3C 100%);
          color: #1F0E2C;
          font-weight: 800;
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        /* Screen Presentation of Pass */
        .a4-pass-container {
          max-width: 900px;
          margin: 0 auto;
          position: relative;
          z-index: 30;
        }
        .a4-pass-card {
          background: #150924;
          border: 2px solid #C59B3C;
          border-radius: 20px;
          padding: 28px 32px;
          box-shadow: 0 30px 80px rgba(0,0,0,0.95), 0 0 50px rgba(77,29,100,0.5);
          position: relative;
          z-index: 30;
        }
        .pass-header-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1.5px solid rgba(197,155,60,0.3);
          padding-bottom: 14px;
          margin-bottom: 16px;
        }
        .pass-logo-title-group {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .pass-yukti-crest {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          border: 1.5px solid #C59B3C;
        }
        .pass-tsm-crest {
          width: 50px;
          height: 50px;
          object-fit: contain;
        }
        .pass-inst-title {
          margin: 0;
          font-size: 0.96rem;
          letter-spacing: 0.04em;
          color: #ffffff;
        }
        .pass-inst-sub {
          font-size: 0.68rem;
          color: #F5D77F;
          font-family: monospace;
          letter-spacing: 0.1em;
          display: block;
          margin-top: 2px;
        }

        .pass-hero-banner {
          text-align: center;
          margin-bottom: 20px;
        }
        .pass-main-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 2.6rem;
          margin: 0;
          line-height: 1;
          color: #FFF2A6;
          letter-spacing: -0.02em;
          font-weight: 800;
        }
        .pass-theme-tagline {
          font-family: monospace;
          font-size: 0.85rem;
          color: #F5D77F;
          letter-spacing: 0.2em;
          margin-top: 6px;
        }
        .pass-status-pill {
          display: inline-block;
          margin-top: 8px;
          background: rgba(16,185,129,0.15);
          border: 1px solid #10b981;
          color: #10b981;
          font-size: 0.68rem;
          font-weight: 800;
          padding: 4px 14px;
          border-radius: 999px;
          letter-spacing: 0.1em;
        }

        .pass-details-grid {
          display: grid;
          grid-template-columns: 140px 1fr 1fr;
          gap: 18px;
          align-items: center;
          background: rgba(255,255,255,0.035);
          border: 1px solid rgba(197,155,60,0.25);
          border-radius: 14px;
          padding: 16px 20px;
          margin-bottom: 16px;
        }
        .pass-avatar-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          border-right: 1px solid rgba(197,155,60,0.2);
          padding-right: 16px;
        }
        .pass-avatar-icon {
          width: 58px;
          height: 58px;
          border-radius: 12px;
          background: rgba(77,29,100,0.5);
          border: 1.5px solid #C59B3C;
          display: grid;
          place-items: center;
          font-size: 1.6rem;
        }
        .pass-barcode-wrapper {
          margin-top: 6px;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          overflow: hidden;
        }
        .pass-real-barcode {
          max-width: 110px;
          height: 32px;
          display: block;
        }
        .pass-docket-id {
          font-family: monospace;
          font-size: 0.72rem;
          color: #F5D77F;
          font-weight: bold;
          margin-top: 4px;
        }

        .pass-field {
          margin-bottom: 8px;
        }
        .pass-field-label {
          font-size: 0.62rem;
          font-family: monospace;
          color: #a69cb4;
          display: block;
          letter-spacing: 0.1em;
        }
        .pass-field-value-primary {
          font-size: 1.15rem;
          color: #ffffff;
          display: block;
        }
        .pass-field-value {
          font-size: 0.88rem;
          color: #e2d9eb;
          display: block;
        }
        .pass-field-value-gold {
          font-size: 0.88rem;
          color: #F5D77F;
          font-weight: bold;
          display: block;
        }

        .pass-members-box {
          background: rgba(77,29,100,0.25);
          border: 1px solid rgba(197,155,60,0.25);
          border-radius: 12px;
          padding: 10px 16px;
          margin-bottom: 16px;
        }
        .pass-section-label {
          font-family: monospace;
          font-size: 0.68rem;
          color: #F5D77F;
          letter-spacing: 0.12em;
          display: block;
          margin-bottom: 6px;
        }
        .pass-members-chips {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .pass-member-chip {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.78rem;
          color: #ffffff;
        }

        .pass-zones-qr-row {
          display: grid;
          grid-template-columns: 1fr 200px;
          gap: 18px;
          margin-bottom: 16px;
        }
        .pass-zones-box {
          background: rgba(15,7,32,0.6);
          border: 1px solid rgba(197,155,60,0.25);
          border-radius: 14px;
          padding: 14px 18px;
        }
        .pass-zones-checklist {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
          font-size: 0.76rem;
          color: #cbd5e1;
          margin-bottom: 12px;
        }
        .pass-logistics-strip {
          display: flex;
          justify-content: space-between;
          border-top: 1px solid rgba(197,155,60,0.2);
          padding-top: 10px;
          font-size: 0.74rem;
        }
        .pass-micro-label {
          font-family: monospace;
          font-size: 0.6rem;
          color: #a69cb4;
          display: block;
        }

        .pass-security-box {
          background: rgba(255,255,255,0.035);
          border: 1px dashed rgba(197,155,60,0.4);
          border-radius: 14px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .pass-qr-header {
          font-family: monospace;
          font-size: 0.65rem;
          color: #F5D77F;
          font-weight: bold;
          letter-spacing: 0.1em;
          margin-bottom: 8px;
        }
        .pass-qr-frame {
          background: #ffffff;
          padding: 6px;
          border-radius: 8px;
          display: inline-block;
          margin-bottom: 8px;
        }
        .pass-verified-badge {
          font-size: 0.72rem;
          color: #10b981;
          font-weight: bold;
        }
        .pass-txn-ref {
          font-family: monospace;
          font-size: 0.62rem;
          color: #cbd5e1;
          margin-top: 2px;
        }

        .pass-guidelines-footer {
          border-top: 1px solid rgba(197,155,60,0.25);
          padding-top: 10px;
          font-size: 0.62rem;
          color: #94a3b8;
          line-height: 1.45;
        }

        /* ══════════════════════════════════════════════════════════
           STRICT A4 PRINT STYLES (Single Page Perfection, No Bleed)
           ══════════════════════════════════════════════════════════ */
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          body, html {
            background: #ffffff !important;
            color: #000000 !important;
            font-size: 11pt;
            margin: 0 !important;
            padding: 0 !important;
          }
          .no-print, header, footer, #webgl-container, .admin, .progress {
            display: none !important;
          }
          .pass-page-wrapper {
            padding: 0 !important;
            background: #ffffff !important;
            min-height: auto !important;
          }
          .a4-pass-container {
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .a4-pass-card {
            background: #ffffff !important;
            color: #000000 !important;
            border: 2px solid #000000 !important;
            border-radius: 12px !important;
            padding: 20px !important;
            box-shadow: none !important;
            page-break-inside: avoid !important;
          }
          .pass-header-section {
            border-bottom: 2px solid #000000 !important;
          }
          .pass-inst-title {
            color: #000000 !important;
            font-size: 11pt !important;
            font-weight: bold !important;
          }
          .pass-inst-sub {
            color: #333333 !important;
          }
          .pass-main-title {
            color: #000000 !important;
            font-size: 26pt !important;
          }
          .pass-theme-tagline {
            color: #222222 !important;
            font-weight: bold !important;
          }
          .pass-status-pill {
            background: #f4f4f5 !important;
            border: 1px solid #000000 !important;
            color: #000000 !important;
          }
          .pass-details-grid {
            background: #f8fafc !important;
            border: 1px solid #000000 !important;
            color: #000000 !important;
          }
          .pass-avatar-icon {
            background: #e2e8f0 !important;
            border: 1px solid #000000 !important;
          }
          .pass-field-value-primary {
            color: #000000 !important;
          }
          .pass-field-value, .pass-field-value-gold {
            color: #111111 !important;
          }
          .pass-members-box {
            background: #f8fafc !important;
            border: 1px solid #000000 !important;
          }
          .pass-member-chip {
            background: #ffffff !important;
            border: 1px solid #888888 !important;
            color: #000000 !important;
          }
          .pass-zones-box {
            background: #f8fafc !important;
            border: 1px solid #000000 !important;
            color: #000000 !important;
          }
          .pass-zones-checklist {
            color: #111111 !important;
          }
          .pass-security-box {
            background: #ffffff !important;
            border: 1px dashed #000000 !important;
          }
          .pass-qr-frame {
            border: 1px solid #000000 !important;
          }
          .pass-verified-badge {
            color: #000000 !important;
            font-weight: bold !important;
          }
          .pass-docket-id, .pass-txn-ref, .pass-guidelines-footer {
            color: #333333 !important;
          }
        }
      `}</style>
    </div>
  )
}
