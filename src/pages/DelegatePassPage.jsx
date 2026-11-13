import React, { useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { SITE_CONFIG } from '../utils/confluenceData'
import SEOHead from '../utils/SEOHead'

export default function DelegatePassPage({ onBackToHome }) {
  const [passData, setPassData] = useState(null)

  useEffect(() => {
    // Parse query params or fallback to local storage
    const params = new URLSearchParams(window.location.search)
    const name = params.get('name')
    const college = params.get('college')
    const regId = params.get('regId')
    const year = params.get('year')
    const delegationType = params.get('delegationType')
    const members = params.get('members')
    const fee = params.get('fee')
    const utr = params.get('utr')

    if (name || regId) {
      setPassData({
        name: name || 'Valued Delegate',
        college: college || 'Thiagarajar School of Management (TSM)',
        regId: regId || 'YK27-DELEGATE',
        year: year || 'PG / MBA Final Year',
        delegationType: delegationType || 'Competitor Pass (Team Entry)',
        members: members ? members.split(',') : [],
        fee: fee || '₹500',
        utr: utr || 'VERIFIED-UPI'
      })
    } else {
      // Try local storage
      const lastReg = JSON.parse(localStorage.getItem('yukti_last_pending_reg') || 'null')
      if (lastReg) {
        setPassData({
          name: lastReg.name || 'Valued Delegate',
          college: lastReg.college || 'Thiagarajar School of Management (TSM)',
          regId: lastReg.regId || 'YK27-DELEGATE',
          year: lastReg.year || 'PG / MBA Final Year',
          delegationType: lastReg.delegationType || 'Competitor Pass (Team Entry)',
          members: lastReg.members ? (Array.isArray(lastReg.members) ? lastReg.members.map(m=>m.name||m) : [lastReg.members]) : [],
          fee: lastReg.fee || '₹500',
          utr: lastReg.utr || 'VERIFIED-UPI'
        })
      } else {
        // Sample fallback for direct preview
        setPassData({
          name: 'Srinivasan Rengarajan',
          college: 'Thiagarajar School of Management (TSM)',
          regId: 'YK27-A8F2-9X41',
          year: 'PG / MBA Final Year',
          delegationType: 'Competitor Pass (Team Entry)',
          members: ['Member 2: Priya S.', 'Member 3: Arun M.'],
          fee: '₹500',
          utr: '431209874521'
        })
      }
    }
  }, [])

  if (!passData) return null

  // URL encoded self-link for the QR code on the pass itself
  const passUrl = typeof window !== 'undefined' ? window.location.href : 'https://yukti27.tsm.ac.in/pass'

  return (
    <div className="subpage-wrapper" style={{ minHeight: '100vh', padding: '100px 5vw 60px' }}>
      <SEOHead
        title="Official Delegate Entry Pass — YUKTI ’27"
        description="Official YUKTI '27 delegate entry badge and security pass for Thiagarajar School of Management (TSM), Madurai."
        path="/pass"
      />

      <div style={{ maxWidth: '1050px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <button className="back-breadcrumb-btn" onClick={onBackToHome}>
            ← Return to Confluence
          </button>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn" onClick={() => window.print()}>
              🖨️ Print Pass / Save as PDF
            </button>
          </div>
        </div>

        <div className="pass-welcome-banner" style={{
          background: 'linear-gradient(135deg, rgba(77,29,100,0.5), rgba(31,14,44,0.9))',
          border: '1px solid rgba(197,155,60,0.3)',
          borderRadius: '16px',
          padding: '16px 24px',
          marginBottom: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <span className="mono gold" style={{ fontSize: '0.72rem', letterSpacing: '0.14em' }}>ROYAL PASS TREATMENT · CONFIRMED DELEGATE</span>
            <h3 style={{ margin: '4px 0 0', color: '#fff', fontSize: '1.25rem' }}>Welcome to YUKTI ’27, {passData.name}!</h3>
          </div>
          <span className="mono" style={{ color: '#10b981', background: 'rgba(16,185,129,0.15)', border: '1px solid #10b981', padding: '6px 14px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold' }}>
            ✓ ALL-ARENA ACCESS GRANTED
          </span>
        </div>

        {/* ═══ THE DELUXE ENTRY PASS CARD (Matching user reference layout) ═══ */}
        <div className="deluxe-ticket-container" style={{
          position: 'relative',
          background: 'radial-gradient(ellipse at 80% 20%, #1a0a2a 0%, #0d0617 100%)',
          borderRadius: '24px',
          border: '1.5px solid rgba(197,155,60,0.4)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.9), 0 0 50px rgba(197,155,60,0.15)',
          overflow: 'hidden',
          display: 'flex',
          flexWrap: 'wrap',
          color: '#ffffff'
        }}>
          {/* Main Badge / Left & Middle Body (70%) */}
          <div style={{ flex: '1 1 640px', padding: '36px 36px 28px', position: 'relative' }}>
            {/* Header with Dual Crests & Institution Details */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(197,155,60,0.25)', paddingBottom: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <img src="/yukti-logo.webp" alt="YUKTI '27" style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1.5px solid #C59B3C' }} />
                <div>
                  <strong style={{ fontSize: '0.98rem', letterSpacing: '0.04em', display: 'block', color: '#fff' }}>
                    THIAGARAJAR SCHOOL OF MANAGEMENT (TSM) · MADURAI
                  </strong>
                  <small className="mono gold" style={{ fontSize: '0.68rem', letterSpacing: '0.12em' }}>
                    NAAC A+ & NBA ACCREDITED B-SCHOOL · FOUNDED 1962
                  </small>
                </div>
              </div>
              <img src="/tsm-logo.webp" alt="TSM Crest" style={{ width: '46px', height: '46px', objectFit: 'contain' }} />
            </div>

            {/* Title & Theme Banner */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h1 style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '2.8rem',
                margin: '0',
                lineHeight: '1',
                background: 'linear-gradient(135deg, #FFF2A6 20%, #F5D77F 60%, #C59B3C 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: '800'
              }}>
                YUKTI ’27
              </h1>
              <div className="mono" style={{ fontSize: '0.86rem', color: '#F5D77F', letterSpacing: '0.22em', marginTop: '6px' }}>
                INTANGIBLES — INFINITE POSSIBILITIES
              </div>
            </div>

            {/* Delegate Details Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr 1fr',
              gap: '20px',
              alignItems: 'center',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(197,155,60,0.2)',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '22px'
            }}>
              {/* Avatar placeholder / Barcode */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '74px',
                  height: '74px',
                  borderRadius: '12px',
                  background: 'rgba(77,29,100,0.5)',
                  border: '1.5px solid #C59B3C',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '1.8rem'
                }}>
                  🎓
                </div>
                <div style={{ letterSpacing: '2px', fontFamily: 'monospace', fontSize: '0.62rem', color: '#cbd5e1' }}>
                  ||||| | ||||| ||
                </div>
                <span className="mono gold" style={{ fontSize: '0.72rem', fontWeight: 'bold' }}>{passData.regId}</span>
              </div>

              {/* Delegate Info */}
              <div>
                <span className="mono" style={{ fontSize: '0.65rem', color: '#a69cb4', display: 'block' }}>Primary Delegate</span>
                <strong style={{ fontSize: '1.15rem', color: '#ffffff', display: 'block', margin: '2px 0 6px' }}>
                  {passData.name}
                </strong>
                <span className="mono" style={{ fontSize: '0.65rem', color: '#a69cb4', display: 'block' }}>Institution</span>
                <span style={{ fontSize: '0.85rem', color: '#e2d9eb', display: 'block' }}>
                  {passData.college}
                </span>
              </div>

              {/* Pass Category & Team Details */}
              <div>
                <span className="mono" style={{ fontSize: '0.65rem', color: '#a69cb4', display: 'block' }}>Academic Level</span>
                <strong style={{ fontSize: '0.92rem', color: '#ffffff', display: 'block', margin: '2px 0 6px' }}>
                  {passData.year}
                </strong>
                <span className="mono" style={{ fontSize: '0.65rem', color: '#a69cb4', display: 'block' }}>Pass Category</span>
                <span className="gold" style={{ fontSize: '0.85rem', fontWeight: 'bold', display: 'block' }}>
                  🎖️ {passData.delegationType}
                </span>
              </div>
            </div>

            {/* Additional Team Members (If Any) */}
            {passData.members && passData.members.length > 0 && (
              <div style={{
                background: 'rgba(77,29,100,0.2)',
                border: '1px solid rgba(197,155,60,0.25)',
                borderRadius: '12px',
                padding: '12px 18px',
                marginBottom: '20px'
              }}>
                <span className="mono gold" style={{ fontSize: '0.68rem', letterSpacing: '0.12em' }}>CONFIRMED CONTINGENT MEMBERS:</span>
                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '6px' }}>
                  {passData.members.map((m, idx) => (
                    <span key={idx} style={{ fontSize: '0.82rem', color: '#f1e9f9', background: 'rgba(255,255,255,0.06)', padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>
                      👤 {m}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Venue Zones Permitted (Universal Pass - One team one pass) */}
            <div style={{
              background: 'rgba(15,7,32,0.6)',
              border: '1px solid rgba(197,155,60,0.2)',
              borderRadius: '14px',
              padding: '16px 20px',
              marginBottom: '20px'
            }}>
              <span className="mono gold" style={{ fontSize: '0.68rem', letterSpacing: '0.12em', display: 'block', marginBottom: '8px' }}>
                PERMITTED ALL-CONFLUENCE ZONES:
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', fontSize: '0.82rem', color: '#cbd5e1' }}>
                <div>☑ Auditorium A (Main Stage)</div>
                <div>☑ Boardroom Syndicate Rooms</div>
                <div>☑ Amphitheatre (Cultural Evening)</div>
                <div>☑ Dining & Executive Networking Hall</div>
              </div>
            </div>

            {/* Schedule & Reporting */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(197,155,60,0.25)', paddingTop: '14px', fontSize: '0.78rem', color: '#cbd5e1', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <span className="mono" style={{ fontSize: '0.65rem', color: '#a69cb4', display: 'block' }}>Conference Dates</span>
                <strong style={{ color: '#fff' }}>January 28, 29 & 30, 2027</strong>
              </div>
              <div>
                <span className="mono" style={{ fontSize: '0.65rem', color: '#a69cb4', display: 'block' }}>Reporting Desk</span>
                <strong style={{ color: '#fff' }}>08:30 AM IST · Main Foyer</strong>
              </div>
              <div>
                <span className="mono" style={{ fontSize: '0.65rem', color: '#a69cb4', display: 'block' }}>Campus Venue</span>
                <strong style={{ color: '#fff' }}>TSM Madurai – 625005</strong>
              </div>
            </div>

            <div style={{ marginTop: '14px', fontSize: '0.64rem', color: '#94a3b8', lineHeight: '1.4' }}>
              GUIDELINES: 1. Mandatory valid Student / College ID card. 2. Non-transferable pass. 3. Wi-Fi: TSM-GUEST. 4. Committee helpline: yukti@tsm.ac.in | Instagram @yukti.tsm.
            </div>
          </div>

          {/* Right Stub: Verification QR Code & Security Stamp (30%) */}
          <div style={{
            flex: '0 1 300px',
            borderLeft: '2px dashed rgba(197,155,60,0.4)',
            padding: '36px 28px',
            background: 'linear-gradient(180deg, rgba(31,14,44,0.7) 0%, rgba(13,6,26,0.95) 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            textAlign: 'center',
            position: 'relative'
          }}>
            <div>
              <span className="mono gold" style={{ fontSize: '0.78rem', letterSpacing: '0.16em', fontWeight: '800' }}>
                SCAN FOR GATE ENTRY
              </span>
              
              <div style={{
                background: '#ffffff',
                padding: '14px',
                borderRadius: '16px',
                margin: '18px auto',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                display: 'inline-block'
              }}>
                <QRCodeSVG
                  value={passUrl}
                  size={170}
                  level="M"
                  includeMargin={false}
                  imageSettings={{
                    src: "/yukti-logo.png",
                    x: undefined,
                    y: undefined,
                    height: 32,
                    width: 32,
                    excavate: true,
                  }}
                />
              </div>

              <div style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 'bold' }}>
                PAID & VERIFIED — {passData.fee}
              </div>
              <div className="mono" style={{ fontSize: '0.68rem', color: '#cbd5e1', marginTop: '4px' }}>
                Txn Ref: {passData.utr}
              </div>
            </div>

            {/* Official Metallic Gold Security Hologram Stamp */}
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #FFF2A6 0%, #C59B3C 50%, #F5D77F 100%)',
              color: '#1F0E2C',
              padding: '6px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 25px rgba(245,215,127,0.4), inset 0 0 10px rgba(255,255,255,0.6)',
              margin: '20px auto 0',
              fontWeight: 'bold',
              border: '2px solid #FFF2A6'
            }}>
              <div style={{ fontSize: '1.4rem' }}>🛡️</div>
              <span style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>YUKTI ’27</span>
              <small style={{ fontSize: '0.52rem', textTransform: 'uppercase' }}>SECURE ACCESS</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
