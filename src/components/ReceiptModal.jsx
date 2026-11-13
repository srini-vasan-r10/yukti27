import React from 'react'
import { QRCodeSVG } from 'qrcode.react'

/**
 * ReceiptModal Component
 * Implements the authentic thermal printed receipt aesthetic (matching user reference)
 * Features:
 * - Silver metallic printer slot dispenser on top
 * - Zigzag paper receipt tear edges
 * - Itemized registration details
 * - QR code leading to the royal delegate pass URL
 * - Screen-capture / screenshot advisory for candidate
 */
export default function ReceiptModal({ dossier, passUrl, onOpenPass, onClose }) {
  if (!dossier) return null

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(7, 3, 16, 0.88)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      zIndex: 200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      overflowY: 'auto'
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '430px',
        margin: 'auto'
      }}>
        {/* Close Button Top Right */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '-15px',
            right: '-10px',
            background: '#1F0E2C',
            border: '1.5px solid #C59B3C',
            color: '#FFF2A6',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '1.1rem',
            zIndex: 10,
            display: 'grid',
            placeItems: 'center',
            boxShadow: '0 4px 15px rgba(0,0,0,0.6)'
          }}
          aria-label="Close Receipt"
        >
          ×
        </button>

        {/* ═══ METALLIC PRINTER SLOT (Top dispenser as in image) ═══ */}
        <div style={{
          width: '88%',
          margin: '0 auto',
          height: '24px',
          background: 'linear-gradient(180deg, #d4d4d8 0%, #71717a 50%, #27272a 100%)',
          borderRadius: '12px 12px 0 0',
          boxShadow: '0 6px 15px rgba(0,0,0,0.8), inset 0 2px 3px rgba(255,255,255,0.7)',
          position: 'relative',
          zIndex: 2,
          border: '1px solid #52525b'
        }}>
          {/* Black interior slot mouth */}
          <div style={{
            position: 'absolute',
            bottom: '2px',
            left: '12px',
            right: '12px',
            height: '6px',
            background: '#09090b',
            borderRadius: '3px',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.9)'
          }} />
        </div>

        {/* ═══ PRINTED PAPER RECEIPT ═══ */}
        <div style={{
          background: '#FFFDF7',
          color: '#1c1917',
          padding: '26px 28px 22px',
          fontFamily: "'Courier New', Courier, monospace",
          boxShadow: '0 25px 60px rgba(0,0,0,0.85)',
          position: 'relative',
          marginTop: '-4px',
          borderRadius: '0 0 4px 4px',
          animation: 'receiptSlideDown 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          {/* Status Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px dashed #78716c', paddingBottom: '12px', marginBottom: '14px' }}>
            <div>
              <strong style={{ fontSize: '1.25rem', letterSpacing: '0.08em', color: '#10b981', display: 'block' }}>PAID ✓</strong>
              <small style={{ fontSize: '0.68rem', color: '#78716c', letterSpacing: '0.05em' }}>YUKTI ’27 OFFICIAL RECEIPT</small>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 'bold' }}>{new Date().toLocaleDateString('en-IN')}</div>
              <div style={{ fontSize: '0.62rem', color: '#78716c' }}>{new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          </div>

          {/* Institution Header */}
          <div style={{ textAlign: 'center', marginBottom: '14px' }}>
            <strong style={{ fontSize: '0.92rem', display: 'block', letterSpacing: '0.04em' }}>THIAGARAJAR SCHOOL OF MANAGEMENT</strong>
            <small style={{ fontSize: '0.68rem', color: '#78716c' }}>Madurai, Tamil Nadu · Founded 1962</small>
          </div>

          {/* Itemized Docket Rows */}
          <div style={{ fontSize: '0.82rem', lineHeight: '1.6', marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>DOCKET ID:</span>
              <strong>{dossier.regId}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>LEAD PAYEE:</span>
              <span>{dossier.name}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>COLLEGE:</span>
              <span style={{ maxWidth: '190px', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {dossier.college}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>ARENA ENTRY:</span>
              <span style={{ maxWidth: '190px', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {dossier.event}
              </span>
            </div>

            {/* Team Members List */}
            {dossier.members && dossier.members.length > 0 && (
              <div style={{ borderTop: '1px dotted #a8a29e', margin: '6px 0', paddingTop: '6px' }}>
                <span style={{ fontSize: '0.72rem', color: '#78716c', display: 'block' }}>TEAM MEMBERS ({dossier.members.length}):</span>
                {dossier.members.map((m, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem' }}>
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
          <div style={{ borderTop: '2px dashed #78716c', borderBottom: '2px dashed #78716c', padding: '10px 0', margin: '12px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span>Registration Fee:</span>
              <span>{dossier.fee || '₹500'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span>Convenience Tax (0%):</span>
              <span>₹0.00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 'bold', marginTop: '4px' }}>
              <span>TOTAL PAID:</span>
              <span>{dossier.fee || '₹500'}</span>
            </div>
          </div>

          {/* Advisory Notice */}
          <div style={{
            background: '#FEF3C7',
            border: '1px solid #F59E0B',
            borderRadius: '6px',
            padding: '8px 10px',
            textAlign: 'center',
            fontSize: '0.72rem',
            color: '#92400E',
            fontWeight: 'bold',
            marginBottom: '16px'
          }}>
            📸 PLEASE SCREENSHOT THIS SCREEN FOR FUTURE REFERENCE
          </div>

          {/* ═══ SCANNABLE QR CODE FOR ROYAL PASS TREATMENT ═══ */}
          <div style={{ textAlign: 'center', borderTop: '1px dashed #a8a29e', paddingTop: '14px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 'bold', letterSpacing: '0.06em', marginBottom: '8px', color: '#1c1917' }}>
              SCAN QR BELOW FOR ROYAL DELEGATE ENTRY PASS
            </div>
            
            <div style={{
              background: '#ffffff',
              padding: '10px',
              borderRadius: '10px',
              display: 'inline-block',
              border: '1px solid #d6d3d1'
            }}>
              <QRCodeSVG
                value={passUrl}
                size={160}
                level="M"
                includeMargin={false}
                imageSettings={{
                  src: "/yukti-logo.png",
                  x: undefined,
                  y: undefined,
                  height: 30,
                  width: 30,
                  excavate: true,
                }}
              />
            </div>
            
            <small style={{ display: 'block', fontSize: '0.64rem', color: '#78716c', marginTop: '6px' }}>
              Opens your personal all-arena credential & lanyard badge
            </small>

            <button
              onClick={onOpenPass}
              style={{
                width: '100%',
                marginTop: '12px',
                padding: '10px 14px',
                background: '#1F0E2C',
                color: '#FFF2A6',
                border: '1.5px solid #C59B3C',
                borderRadius: '8px',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 'bold',
                fontSize: '0.85rem',
                cursor: 'pointer',
                letterSpacing: '0.04em'
              }}
            >
              👑 View & Print Royal Delegate Pass ↗
            </button>
          </div>

          {/* Footer Receipt Note */}
          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.68rem', color: '#78716c' }}>
            HAVE A WONDERFUL EXPERIENCE AT YUKTI ’27!
          </div>

          {/* Jagged / Zigzag paper bottom edge effect */}
          <div style={{
            position: 'absolute',
            bottom: '-10px',
            left: 0,
            right: 0,
            height: '10px',
            backgroundImage: 'radial-gradient(circle, transparent, transparent 50%, #FFFDF7 50%, #FFFDF7 100%)',
            backgroundSize: '16px 20px',
            pointerEvents: 'none'
          }} />
        </div>
      </div>
    </div>
  )
}
