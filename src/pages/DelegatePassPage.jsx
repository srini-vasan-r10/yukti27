import React, { useEffect, useState, useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import JsBarcode from 'jsbarcode'
import html2canvas from 'html2canvas'
import SEOHead from '../utils/SEOHead'
import { YUKTI_LOGO_DATA_URI, TSM_LOGO_DATA_URI } from '../utils/passLogos'

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
  const [keystrokes, setKeystrokes] = useState([])
  const [celebrating, setCelebrating] = useState(false)
  const [jumbledLetters, setJumbledLetters] = useState(['K', 'U', 'I', 'Y', 'T'])
  const [isDownloadingPass, setIsDownloadingPass] = useState(false)
  const barcodeRef = useRef(null)
  const passCardRef = useRef(null)

  const handleDownloadPassImage = async () => {
    if (!passCardRef.current) return
    setIsDownloadingPass(true)
    try {
      const canvas = await html2canvas(passCardRef.current, {
        scale: 2,
        backgroundColor: '#150924',
        useCORS: true,
        logging: false
      })
      const img = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.href = img
      link.download = `YUKTI27-PASS-${passData?.regId || 'DELEGATE'}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.warn('Error saving pass image:', err)
      // Fallback to browser print if image capture is prevented on device
      window.print()
    } finally {
      setIsDownloadingPass(false)
    }
  }

  // Reshuffle jumbled letters periodically or on click
  const shuffleJumbledLetters = () => {
    const letters = ['Y', 'U', 'K', 'T', 'I']
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]]
    }
    setJumbledLetters(letters)
  }

  // Trigger input for a character (clean geometric ripple pulse instead of emojis)
  const handleCharInput = (char) => {
    const key = char.toLowerCase()
    const newSparkItem = {
      id: Date.now() + Math.random(),
      letter: key.toUpperCase(),
      x: Math.random() * 75 + 12,
      y: Math.random() * 55 + 20
    }
    setKeystrokes(prev => [...prev.slice(-8), newSparkItem])

    setTypedKeys(prev => {
      const next = (prev + key).slice(-5)
      if (next === 'yukti') {
        setCelebrating(true)
        setTimeout(() => {
          window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1'
        }, 1600)
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
          lineColor: '#000000',
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

        {/* Minimal geometric golden letter accents typed by user (Zero emojis) */}
        {keystrokes.map(item => (
          <div
            key={item.id}
            style={{
              position: 'absolute',
              left: `${item.x}%`,
              top: `${item.y}%`,
              pointerEvents: 'none',
              animation: 'floatUpFade 1.6s ease-out forwards',
              zIndex: 40,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #F5D77F 0%, #C59B3C 80%)',
              color: '#1F0E2C',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '1.1rem',
              fontWeight: '900',
              display: 'grid',
              placeItems: 'center',
              boxShadow: '0 0 15px rgba(245,215,127,0.7)'
            }}>
              {item.letter}
            </div>
          </div>
        ))}

        <div style={{ maxWidth: '600px', background: '#150924', border: '1.5px solid #C59B3C', borderRadius: '20px', padding: '38px 28px', boxShadow: '0 25px 70px rgba(0,0,0,0.9)', zIndex: 30, position: 'relative' }}>
          <div className="mono gold" style={{ fontSize: '0.82rem', letterSpacing: '0.18em' }}>RESTRICTED ACCESS · ERROR 404</div>
          
          <h1 style={{ fontSize: 'clamp(3.2rem, 7vw, 5.5rem)', margin: '8px 0', color: '#F5D77F', fontFamily: "'Space Grotesk', sans-serif" }}>
            404
          </h1>

          <h2 style={{ fontSize: '1.3rem', color: '#FFF2A6', marginBottom: '12px' }}>
            {celebrating ? 'Access Granted: Confluence Protocol Initiated' : 'Delegate Docket Not Found'}
          </h2>

          <p style={{ color: '#cbd5e1', fontSize: '0.90rem', lineHeight: '1.6', marginBottom: '22px' }}>
            {celebrating ? (
              <strong style={{ color: '#10b981' }}>Connecting to official fest broadcast stream...</strong>
            ) : (
              <>
                Delegate credentials are tied directly to an approved registration docket or scanned from your physical registration badge.
              </>
            )}
          </p>

          {/* Interactive Input Terminal */}
          <div style={{
            background: 'rgba(77,29,100,0.35)',
            border: '1px solid rgba(197,155,60,0.4)',
            borderRadius: '12px',
            padding: '16px 18px',
            marginBottom: '24px'
          }}>
            <div className="mono gold" style={{ fontSize: '0.74rem', marginBottom: '6px' }}>
              KEY SEQUENCE VERIFICATION
            </div>
            <div style={{ fontSize: '0.82rem', color: '#e2d9eb', lineHeight: '1.5' }}>
              Keyboard users: Type <strong>"yukti"</strong>.
              <br />
              Touchscreen users: Tap the sequence <strong>Y-U-K-T-I</strong> below.
            </div>

            {/* Jumbled Keypad Buttons (Professional metallic badge styling, no emojis) */}
            <div style={{ marginTop: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {jumbledLetters.map((char, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleCharInput(char)}
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '10px',
                      background: 'linear-gradient(180deg, #2b133d 0%, #150924 100%)',
                      border: '1.5px solid #C59B3C',
                      color: '#FFF2A6',
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: '1.25rem',
                      fontWeight: '800',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
                      transition: 'transform 0.15s ease',
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

              <button
                type="button"
                onClick={shuffleJumbledLetters}
                style={{
                  marginTop: '10px',
                  background: 'transparent',
                  border: 'none',
                  color: '#F5D77F',
                  fontFamily: 'monospace',
                  fontSize: '0.70rem',
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Reshuffle Sequence
              </button>
            </div>

            {typedKeys && (
              <div className="mono" style={{ marginTop: '10px', fontSize: '0.76rem', color: '#10b981', background: 'rgba(0,0,0,0.4)', padding: '5px 10px', borderRadius: '4px', display: 'inline-block' }}>
                Input: [{typedKeys.toUpperCase()}]
              </div>
            )}
          </div>

          <button
            className="btn"
            onClick={onBackToHome}
            style={{
              padding: '11px 24px',
              fontSize: '0.84rem',
              background: 'linear-gradient(135deg, #FFF2A6 0%, #C59B3C 100%)',
              color: '#1F0E2C',
              fontWeight: 800,
              border: 'none',
              borderRadius: '8px'
            }}
          >
            Return to Confluence
          </button>
        </div>

        <style>{`
          @keyframes floatUpFade {
            0% { transform: translateY(0) scale(0.7); opacity: 1; }
            100% { transform: translateY(-60px) scale(1.15); opacity: 0; }
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span className="mono gold" style={{ fontSize: '0.78rem' }}>1-PAGE A4 FORMAT</span>
          <button
            className="btn print-trigger-btn"
            onClick={handleDownloadPassImage}
            disabled={isDownloadingPass}
          >
            {isDownloadingPass ? 'Saving Pass...' : 'Download Pass (.PNG)'}
          </button>
          <button className="btn print-trigger-btn" onClick={() => window.print()}>
            Print Pass / PDF
          </button>
        </div>
      </div>

      {/* ═══ MOBILE / TABLET DEDICATED PROMINENT ACTION CARD ═══ */}
      <div className="no-print mobile-pass-action-banner">
        <div className="mobile-action-inner">
          <div className="mobile-success-indicator">
            <span className="mobile-check-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
            <div>
              <h3 className="mobile-action-heading">Official Delegate Pass Verified</h3>
              <p className="mobile-action-sub">
                Registration docket confirmed for <strong>{passData.name}</strong>. Save the pass image directly to your device or print for gate inspection.
              </p>
            </div>
          </div>

          <div className="mobile-buttons-row">
            <button
              type="button"
              className="mobile-download-btn"
              onClick={handleDownloadPassImage}
              disabled={isDownloadingPass}
            >
              {isDownloadingPass ? 'Generating Image...' : 'Click Here to Download Pass'}
            </button>
            <button
              type="button"
              className="mobile-print-btn"
              onClick={() => window.print()}
            >
              Print / Save as PDF
            </button>
          </div>
        </div>
      </div>

      {/* ═══ STANDARDIZED SINGLE-PAGE A4 PASS SHEET ═══ */}
      <div className="a4-pass-container">
        {/* Pass Outer Border Box */}
        <div ref={passCardRef} className="a4-pass-card">
          
          {/* 1. Header with Dual Logos & Accreditation */}
          <div className="pass-header-section">
            <div className="pass-logo-badge">
              <img src={YUKTI_LOGO_DATA_URI} alt="YUKTI '27 Logo" className="pass-yukti-crest" />
            </div>
            <div className="pass-inst-title-block">
              <h2 className="pass-inst-title">THIAGARAJAR SCHOOL OF MANAGEMENT (TSM) · MADURAI</h2>
              <span className="pass-inst-sub">NAAC A+ & NBA ACCREDITED B-SCHOOL · FOUNDED 1962</span>
            </div>
            <div className="pass-logo-badge">
              <img src={TSM_LOGO_DATA_URI} alt="TSM Crest" className="pass-tsm-crest" />
            </div>
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
            {/* Barcode & Docket Column (Clean, zero icons) */}
            <div className="pass-avatar-box">
              {/* Flat barcode box with tight, clean padding and zero elevation shadow */}
              <div className="pass-barcode-box">
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
                <span className="pass-field-value-gold">{passData.delegationType}</span>
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
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 5. Access Zones & Verification QR Row (Boarding Pass Architecture with Tear-off Perforation Notch) */}
          <div className="pass-zones-qr-row">
            {/* Permitted Campus Zones & Logistics (Main Body) */}
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

            {/* Boarding Pass Tear-Off Perforation Divider with Top & Bottom Cutout Notches */}
            <div className="pass-tearoff-divider">
              <div className="notch-cut notch-top"></div>
              <div className="dashed-tear-line"></div>
              <span className="tear-label mono">TEAR / SCAN</span>
              <div className="notch-cut notch-bottom"></div>
            </div>

            {/* Verification Security QR & Stamp (Gate Entry Stub) */}
            <div className="pass-security-box">
              <span className="pass-qr-header">SCAN AT GATE ENTRY</span>
              <div className="pass-qr-frame">
                <QRCodeSVG
                  value={qrPassPayload}
                  size={124}
                  level="M"
                  includeMargin={false}
                />
              </div>
              <div className="pass-verified-badge">PAID & VERIFIED — {passData.fee}</div>
              <span className="pass-txn-ref">Txn Ref: {passData.utr}</span>
            </div>
          </div>

          {/* 6. Footer Legal, Campus Guidelines & Comprehensive Terms & Conditions */}
          <div className="pass-guidelines-footer">
            <div className="pass-terms-title mono gold">TERMS OF ADMISSION & CONFLUENCE CODE OF CONDUCT</div>
            <div className="pass-terms-grid">
              <div>• <strong>Identity Verification:</strong> A valid physical college/institution photo ID card and this verified delegate pass docket must be produced at the registration desk for badge clearance.</div>
              <div>• <strong>Access Protocols:</strong> Admission is restricted strictly to registered delegates and authorized contingent members. Badges are non-transferable; impersonation entails immediate disqualification.</div>
              <div>• <strong>Campus Discipline:</strong> Thiagarajar School of Management (TSM) maintains a strict zero-tolerance policy against substance use, hazing, harassment, or property damage. Violators face immediate debarment.</div>
              <div>• <strong>Schedule & Jury Governance:</strong> Decisions rendered by appointed corporate judges and executive review panels are definitive and binding across all management and cultural arenas.</div>
              <div>• <strong>Bounty & Honors:</strong> Cash bounties, trophies, and certificates are disbursed post-valedictory verification to designated primary team leads via official banking conduits.</div>
              <div>• <strong>Helpdesk & Network:</strong> Wi-Fi SSID: <em>TSM-GUEST</em> | Support: <em>yukti@tsm.ac.in</em> | Web: <em>yukti27.tsm.ac.in</em> | Campus Security Desk Ext: 402.</div>
            </div>
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
          padding: 10px 18px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.82rem;
          transition: transform 0.2s ease;
        }
        .print-trigger-btn:hover {
          transform: translateY(-2px);
        }

        /* ═══ MOBILE / TABLET DEDICATED ACTION BANNER ═══ */
        .mobile-pass-action-banner {
          max-width: 900px;
          margin: 0 auto 24px;
          position: relative;
          z-index: 30;
        }
        .mobile-action-inner {
          background: linear-gradient(145deg, rgba(77,29,100,0.55) 0%, rgba(31,14,44,0.95) 100%);
          border: 1.5px solid #C59B3C;
          border-radius: 18px;
          padding: 20px 22px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.7), 0 0 25px rgba(197,155,60,0.25);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .mobile-success-indicator {
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }
        .mobile-check-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #10b981;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 0 12px #10b981;
        }
        .mobile-action-heading {
          margin: 0 0 4px;
          color: #FFF2A6;
          font-size: 1.15rem;
          font-weight: 800;
        }
        .mobile-action-sub {
          margin: 0;
          color: #cbd5e1;
          font-size: 0.84rem;
          line-height: 1.5;
        }
        .mobile-buttons-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .mobile-download-btn {
          flex: 1 1 200px;
          padding: 13px 18px;
          background: linear-gradient(135deg, #FFF2A6 0%, #C59B3C 100%);
          color: #1F0E2C;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 800;
          font-size: 0.88rem;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          box-shadow: 0 4px 18px rgba(197,155,60,0.35);
          transition: transform 0.15s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .mobile-download-btn:active {
          transform: scale(0.97);
        }
        .mobile-print-btn {
          flex: 1 1 140px;
          padding: 13px 18px;
          background: rgba(31,14,44,0.85);
          color: #FFF2A6;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 700;
          font-size: 0.88rem;
          border: 1.5px solid #C59B3C;
          border-radius: 10px;
          cursor: pointer;
          transition: transform 0.15s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .mobile-print-btn:active {
          transform: scale(0.97);
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
          gap: 16px;
          border-bottom: 1.5px solid rgba(197,155,60,0.3);
          padding-bottom: 14px;
          margin-bottom: 16px;
        }
        .pass-logo-badge {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pass-inst-title-block {
          flex: 1;
          text-align: center;
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
          font-size: 0.98rem;
          letter-spacing: 0.04em;
          color: #ffffff;
          text-align: center;
        }
        .pass-inst-sub {
          font-size: 0.68rem;
          color: #F5D77F;
          font-family: monospace;
          letter-spacing: 0.1em;
          display: block;
          margin-top: 3px;
          text-align: center;
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
          justify-content: center;
          border-right: 1px solid rgba(197,155,60,0.2);
          padding-right: 16px;
        }
        /* Crisp, flat monochrome barcode container with tight padding and zero drop shadow */
        .pass-barcode-box {
          background: #ffffff;
          padding: 4px 6px;
          border-radius: 4px;
          border: 1px solid #111111;
          box-shadow: none;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          box-sizing: border-box;
        }
        .pass-real-barcode {
          width: 100%;
          max-width: 120px;
          height: 38px;
          display: block;
        }
        .pass-docket-id {
          font-family: monospace;
          font-size: 0.72rem;
          color: #F5D77F;
          font-weight: bold;
          margin-top: 6px;
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
          grid-template-columns: 1fr 28px 210px;
          gap: 12px;
          align-items: stretch;
          margin-bottom: 16px;
          position: relative;
        }
        .pass-tearoff-divider {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          position: relative;
          padding: 8px 0;
        }
        .dashed-tear-line {
          width: 1px;
          height: 100%;
          border-left: 2px dashed rgba(197,155,60,0.5);
        }
        .tear-label {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(90deg);
          white-space: nowrap;
          font-size: 0.52rem;
          color: #F5D77F;
          letter-spacing: 0.2em;
          background: #150924;
          padding: 2px 6px;
        }
        .notch-cut {
          width: 18px;
          height: 18px;
          background: #090412;
          border-radius: 50%;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          z-index: 5;
        }
        .notch-top {
          top: -14px;
          box-shadow: inset 0 -2px 4px rgba(0,0,0,0.8);
        }
        .notch-bottom {
          bottom: -14px;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.8);
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
          border-top: 1.5px solid rgba(197,155,60,0.3);
          padding-top: 14px;
          margin-top: 14px;
        }
        .pass-terms-title {
          font-size: 0.70rem;
          margin-bottom: 8px;
          letter-spacing: 0.14em;
        }
        .pass-terms-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px 16px;
          font-size: 0.62rem;
          color: #a69cb4;
          line-height: 1.5;
        }

        /* Hide full pass presentation on Mobile & Tablet to prevent clutter, keeping only the direct Print/Save action */
        @media screen and (max-width: 900px) {
          .a4-pass-container {
            display: none !important;
          }
          .pass-screen-bar {
            margin-bottom: 12px;
          }
        }

        /* ══════════════════════════════════════════════════════════
           STRICT A4 PRINT STYLES (Single Page Perfection, No Bleed)
           ══════════════════════════════════════════════════════════ */
        @media print {
          @page {
            size: A4 portrait;
            margin: 6mm 8mm;
          }
          body, html {
            background: #ffffff !important;
            color: #000000 !important;
            font-size: 10.5pt;
            margin: 0 !important;
            padding: 0 !important;
          }
          .no-print, header, footer, #webgl-container, .admin, .progress, .mobile-pass-action-banner {
            display: none !important;
          }
          .pass-page-wrapper {
            padding: 0 !important;
            background: #ffffff !important;
            min-height: auto !important;
          }
          .a4-pass-container {
            display: block !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .a4-pass-card {
            background: #ffffff !important;
            color: #000000 !important;
            border: 2px solid #000000 !important;
            border-radius: 12px !important;
            padding: 22px 24px 20px !important;
            box-shadow: none !important;
            page-break-inside: avoid !important;
            min-height: 258mm !important; /* Calibrated to fill 88-90% of A4 portrait gracefully */
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            box-sizing: border-box !important;
          }
          .pass-header-section {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            border-bottom: 2px solid #000000 !important;
            padding-bottom: 12px !important;
            margin-bottom: 14px !important;
          }
          .pass-inst-title-block {
            flex: 1 !important;
            text-align: center !important;
          }
          .pass-inst-title {
            color: #000000 !important;
            font-size: 11.5pt !important;
            font-weight: bold !important;
            text-align: center !important;
          }
          .pass-inst-sub {
            color: #333333 !important;
            font-size: 7pt !important;
            text-align: center !important;
          }
          .pass-hero-banner {
            margin-bottom: 16px !important;
          }
          .pass-main-title {
            color: #000000 !important;
            font-size: 26pt !important;
            letter-spacing: -0.01em !important;
          }
          .pass-theme-tagline {
            color: #222222 !important;
            font-weight: bold !important;
            font-size: 9pt !important;
            letter-spacing: 0.16em !important;
          }
          .pass-status-pill {
            background: #f4f4f5 !important;
            border: 1px solid #000000 !important;
            color: #000000 !important;
            font-size: 7.5pt !important;
            padding: 3px 10px !important;
          }
          .pass-details-grid {
            background: #f8fafc !important;
            border: 1.5px solid #000000 !important;
            color: #000000 !important;
            padding: 14px 18px !important;
            margin-bottom: 14px !important;
            grid-template-columns: 145px 1fr 1fr !important;
          }
          .pass-barcode-box {
            background: #ffffff !important;
            border: 1.5px solid #000000 !important;
            box-shadow: none !important;
            padding: 4px 6px !important;
          }
          .pass-real-barcode {
            max-width: 130px !important;
            height: 38px !important;
          }
          .pass-field-label {
            color: #444444 !important;
            font-size: 6.5pt !important;
          }
          .pass-field-value-primary {
            color: #000000 !important;
            font-size: 12.5pt !important;
            font-weight: bold !important;
          }
          .pass-field-value, .pass-field-value-gold {
            color: #111111 !important;
            font-size: 9.5pt !important;
          }
          .pass-members-box {
            background: #f8fafc !important;
            border: 1px solid #000000 !important;
            padding: 10px 14px !important;
            margin-bottom: 14px !important;
          }
          .pass-section-label {
            color: #111111 !important;
            font-weight: bold !important;
            font-size: 7.5pt !important;
          }
          .pass-member-chip {
            background: #ffffff !important;
            border: 1px solid #666666 !important;
            color: #000000 !important;
            font-size: 8pt !important;
          }
          .pass-zones-qr-row {
            grid-template-columns: 1fr 24px 190px !important;
            gap: 8px !important;
            margin-bottom: 14px !important;
          }
          .pass-zones-box {
            background: #f8fafc !important;
            border: 1.5px solid #000000 !important;
            color: #000000 !important;
            padding: 14px 16px !important;
          }
          .pass-zones-checklist {
            color: #111111 !important;
            font-size: 8.5pt !important;
            line-height: 1.5 !important;
          }
          .pass-logistics-strip {
            border-top: 1px solid #cccccc !important;
            padding-top: 10px !important;
            font-size: 8pt !important;
          }
          .pass-micro-label {
            color: #555555 !important;
            font-size: 6.5pt !important;
          }
          /* Boarding Pass Tear-Off Divider in Print */
          .pass-tearoff-divider {
            display: flex !important;
          }
          .dashed-tear-line {
            border-left: 2px dashed #000000 !important;
          }
          .tear-label {
            background: #ffffff !important;
            color: #000000 !important;
            font-weight: bold !important;
            font-size: 5.5pt !important;
            border: 1px solid #000000 !important;
          }
          .notch-cut {
            background: #ffffff !important;
            border: 2px solid #000000 !important;
            box-shadow: none !important;
          }
          .notch-top {
            border-bottom: none !important;
            border-radius: 0 0 16px 16px !important;
            top: -22px !important;
            height: 12px !important;
            width: 22px !important;
          }
          .notch-bottom {
            border-top: none !important;
            border-radius: 16px 16px 0 0 !important;
            bottom: -22px !important;
            height: 12px !important;
            width: 22px !important;
          }
          .pass-security-box {
            background: #ffffff !important;
            border: 1.5px dashed #000000 !important;
            padding: 10px !important;
          }
          .pass-qr-header {
            color: #000000 !important;
            font-weight: bold !important;
            font-size: 7pt !important;
          }
          .pass-qr-frame {
            border: 1.5px solid #000000 !important;
            padding: 4px !important;
          }
          .pass-verified-badge {
            color: #000000 !important;
            font-weight: bold !important;
            font-size: 7.5pt !important;
          }
          .pass-docket-id, .pass-txn-ref {
            color: #111111 !important;
            font-size: 7pt !important;
          }
          .pass-guidelines-footer {
            border-top: 1.5px solid #000000 !important;
            padding-top: 12px !important;
            margin-top: 10px !important;
          }
          .pass-terms-title {
            color: #000000 !important;
            font-weight: bold !important;
            font-size: 7.5pt !important;
            margin-bottom: 6px !important;
          }
          .pass-terms-grid {
            color: #222222 !important;
            font-size: 6.8pt !important;
            line-height: 1.45 !important;
          }
        }
      `}</style>
    </div>
  )
}
