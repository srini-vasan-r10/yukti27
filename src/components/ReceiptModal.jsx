import React, { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'

/**
 * ReceiptModal Component
 * Redesigned with:
 * 1. Two-stage dynamic printing animation:
 *    - Stage 1: Compact metallic thermal printer positioned centered on screen with realistic mechanical slot.
 *    - The paper receipt slides out smoothly from the printer mouth with CSS keyframe translation and feed sound effect visual cue.
 *    - Stage 2: Camera zooms smoothly to fit 80vh, perfectly framed within the viewport (no 40% overflow!).
 * 2. Responsive scrollable receipt paper with authentic thermal docket typography.
 * 3. Prominent screenshot advisory.
 * 4. Scannable QR code leading to the candidate's personal pass.
 */
export default function ReceiptModal({ dossier, passUrl, onOpenPass, onClose }) {
  if (!dossier) return null

  // animationStep: 'printing' (paper emerging) -> 'zoomed' (zoomed to 80vh)
  const [isZoomed, setIsZoomed] = useState(false)

  useEffect(() => {
    // After 1.8s of printing feed animation, transition to zoomed view
    const timer = setTimeout(() => {
      setIsZoomed(true)
    }, 1800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(7, 3, 16, 0.92)',
      backdropFilter: 'blur(25px)',
      WebkitBackdropFilter: 'blur(25px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      overflow: 'hidden'
    }}>
      {/* Container scaling smoothly from printing to 80vh inspection */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: isZoomed ? '420px' : '360px',
        maxHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transform: isZoomed ? 'scale(1)' : 'scale(0.88)',
        transition: 'all 0.65s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '-18px',
            right: '-10px',
            background: '#1F0E2C',
            border: '1.5px solid #C59B3C',
            color: '#FFF2A6',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '1.2rem',
            zIndex: 30,
            display: 'grid',
            placeItems: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.8)'
          }}
          aria-label="Close Receipt"
        >
          ×
        </button>

        {/* ═══ COMPACT REALISTIC METALLIC THERMAL PRINTER HEAD ═══ */}
        <div style={{
          width: '92%',
          height: '42px',
          background: 'linear-gradient(180deg, #e4e4e7 0%, #a1a1aa 40%, #52525b 85%, #27272a 100%)',
          borderRadius: '16px 16px 0 0',
          boxShadow: '0 8px 30px rgba(0,0,0,0.9), inset 0 2px 4px rgba(255,255,255,0.8)',
          position: 'relative',
          zIndex: 10,
          border: '1px solid #71717a',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 18px'
        }}>
          {/* Printer brand label & LED indicators */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: 'monospace', fontSize: '0.62rem', fontWeight: 'bold', color: '#18181b', letterSpacing: '0.12em' }}>
              YUKTI-POS 27
            </span>
            <div style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 8px #10b981',
              animation: 'blinkLed 1s infinite alternate'
            }} />
          </div>

          <span style={{ fontSize: '0.58rem', fontFamily: 'monospace', color: '#3f3f46', textTransform: 'uppercase' }}>
            {isZoomed ? 'PRINT COMPLETE' : 'PRINTING...'}
          </span>

          {/* Deep mechanical exit slot mouth */}
          <div style={{
            position: 'absolute',
            bottom: '0',
            left: '14px',
            right: '14px',
            height: '7px',
            background: '#09090b',
            borderRadius: '4px 4px 0 0',
            boxShadow: 'inset 0 3px 6px rgba(0,0,0,0.95)'
          }} />
        </div>

        {/* ═══ PRINTED PAPER RECEIPT FEED (Scrollable & auto-contained in 80vh) ═══ */}
        <div className="receipt-paper-scroll" style={{
          width: '88%',
          background: '#FFFDF7',
          color: '#1c1917',
          padding: '24px 22px 20px',
          fontFamily: "'Courier New', Courier, monospace",
          boxShadow: '0 30px 70px rgba(0,0,0,0.85)',
          position: 'relative',
          borderRadius: '0 0 6px 6px',
          overflowY: 'auto',
          maxHeight: 'calc(80vh - 46px)',
          animation: 'feedPaperOut 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards',
          boxSizing: 'border-box'
        }}>
          {/* Status Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px dashed #78716c', paddingBottom: '10px', marginBottom: '12px' }}>
            <div>
              <strong style={{ fontSize: '1.25rem', letterSpacing: '0.06em', color: '#10b981', display: 'block' }}>PAID ✓</strong>
              <small style={{ fontSize: '0.64rem', color: '#78716c', letterSpacing: '0.04em' }}>YUKTI ’27 OFFICIAL RECEIPT</small>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 'bold' }}>{new Date().toLocaleDateString('en-IN')}</div>
              <div style={{ fontSize: '0.62rem', color: '#78716c' }}>{new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          </div>

          {/* Institution Header */}
          <div style={{ textAlign: 'center', marginBottom: '12px' }}>
            <strong style={{ fontSize: '0.84rem', display: 'block', letterSpacing: '0.04em' }}>THIAGARAJAR SCHOOL OF MANAGEMENT</strong>
            <small style={{ fontSize: '0.64rem', color: '#78716c' }}>Madurai, Tamil Nadu · Founded 1962</small>
          </div>

          {/* Itemized Docket Rows */}
          <div style={{ fontSize: '0.78rem', lineHeight: '1.55', marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>DOCKET ID:</span>
              <strong style={{ color: '#000' }}>{dossier.regId}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>LEAD PAYEE:</span>
              <span style={{ fontWeight: 'bold' }}>{dossier.name}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>COLLEGE:</span>
              <span style={{ maxWidth: '180px', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {dossier.college}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>ARENA ENTRY:</span>
              <span style={{ maxWidth: '180px', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {dossier.event}
              </span>
            </div>

            {/* Team Members List */}
            {dossier.members && dossier.members.length > 0 && (
              <div style={{ borderTop: '1px dotted #a8a29e', margin: '6px 0', paddingTop: '6px' }}>
                <span style={{ fontSize: '0.68rem', color: '#78716c', display: 'block' }}>TEAM MEMBERS ({dossier.members.length}):</span>
                {dossier.members.map((m, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                    <span>• {m.name || m}</span>
                    <span style={{ color: '#78716c' }}>PASS INCL.</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', borderTop: '1px dotted #a8a29e', paddingTop: '6px' }}>
              <span>TXN / UTR REF:</span>
              <span style={{ fontWeight: 'bold' }}>{dossier.utr || 'VERIFIED'}</span>
            </div>
          </div>

          {/* Pricing Total Breakdown */}
          <div style={{ borderTop: '2px dashed #78716c', borderBottom: '2px dashed #78716c', padding: '8px 0', margin: '10px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
              <span>Registration Fee:</span>
              <span>{dossier.fee || '₹500'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
              <span>Convenience Tax (0%):</span>
              <span>₹0.00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.98rem', fontWeight: 'bold', marginTop: '4px' }}>
              <span>TOTAL PAID:</span>
              <span>{dossier.fee || '₹500'}</span>
            </div>
          </div>

          {/* Advisory Notice */}
          <div style={{
            background: '#FEF3C7',
            border: '1px solid #F59E0B',
            borderRadius: '6px',
            padding: '7px 10px',
            textAlign: 'center',
            fontSize: '0.68rem',
            color: '#92400E',
            fontWeight: 'bold',
            marginBottom: '14px'
          }}>
            📸 PLEASE SCREENSHOT THIS SCREEN FOR FUTURE REFERENCE
          </div>

          {/* ═══ SCANNABLE QR CODE FOR ROYAL PASS TREATMENT ═══ */}
          <div style={{ textAlign: 'center', borderTop: '1px dashed #a8a29e', paddingTop: '12px' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 'bold', letterSpacing: '0.04em', marginBottom: '8px', color: '#1c1917' }}>
              SCAN QR BELOW FOR ROYAL DELEGATE ENTRY PASS
            </div>
            
            <div style={{
              background: '#ffffff',
              padding: '8px',
              borderRadius: '10px',
              display: 'inline-block',
              border: '1px solid #d6d3d1'
            }}>
              <QRCodeSVG
                value={passUrl}
                size={140}
                level="M"
                includeMargin={false}
                imageSettings={{
                  src: "/yukti-logo.png",
                  x: undefined,
                  y: undefined,
                  height: 26,
                  width: 26,
                  excavate: true,
                }}
              />
            </div>
            
            <small style={{ display: 'block', fontSize: '0.62rem', color: '#78716c', marginTop: '5px' }}>
              Scan with phone camera to view full A4 printable pass
            </small>

            <button
              onClick={onOpenPass}
              style={{
                width: '100%',
                marginTop: '10px',
                padding: '10px 14px',
                background: '#1F0E2C',
                color: '#FFF2A6',
                border: '1.5px solid #C59B3C',
                borderRadius: '8px',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 'bold',
                fontSize: '0.82rem',
                cursor: 'pointer',
                letterSpacing: '0.03em'
              }}
            >
              👑 View & Print A4 Delegate Pass ↗
            </button>
          </div>

          {/* Footer Receipt Note */}
          <div style={{ textAlign: 'center', marginTop: '14px', fontSize: '0.64rem', color: '#78716c' }}>
            HAVE A WONDERFUL EXPERIENCE AT YUKTI ’27!
          </div>

          {/* Jagged / Zigzag paper bottom edge effect */}
          <div style={{
            position: 'absolute',
            bottom: '-8px',
            left: 0,
            right: 0,
            height: '8px',
            backgroundImage: 'radial-gradient(circle, transparent, transparent 50%, #FFFDF7 50%, #FFFDF7 100%)',
            backgroundSize: '14px 16px',
            pointerEvents: 'none'
          }} />
        </div>
      </div>

      {/* Embedded CSS Keyframes for Realistic Mechanical Printing Animation */}
      <style>{`
        @keyframes feedPaperOut {
          0% {
            transform: translateY(-80px) scaleY(0.2);
            opacity: 0.3;
          }
          40% {
            transform: translateY(-20px) scaleY(0.7);
            opacity: 0.9;
          }
          100% {
            transform: translateY(0) scaleY(1);
            opacity: 1;
          }
        }
        @keyframes blinkLed {
          0% { opacity: 0.4; }
          100% { opacity: 1; }
        }
        .receipt-paper-scroll::-webkit-scrollbar {
          width: 5px;
        }
        .receipt-paper-scroll::-webkit-scrollbar-thumb {
          background: #d6d3d1;
          border-radius: 4px;
        }
      `}</style>
    </div>
  )
}
