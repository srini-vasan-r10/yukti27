import React, { useState, useEffect, useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import html2canvas from 'html2canvas'

/**
 * ReceiptModal Component
 * Redesigned to strictly match the mechanical thermal POS printer:
 * 1. Physical connection: The printer head sits flush and seamlessly atop the receipt paper.
 * 2. Downward emerging animation: The receipt comes down continuously from the printer slot.
 * 3. Auto-download bill image: Captures high-res JPEG/PNG receipt bill image and downloads it automatically for the user.
 * 4. Contained viewport: Modal stays centered and perfectly contained within 85vh with smooth internal scroll.
 */
export default function ReceiptModal({ dossier, passUrl, onOpenPass, onClose }) {
  if (!dossier) return null

  const [isPrinting, setIsPrinting] = useState(true)
  const [downloadSuccess, setDownloadSuccess] = useState(false)
  const receiptCaptureRef = useRef(null)

  useEffect(() => {
    // Printing feeder motion completes after 1.6s
    const timer = setTimeout(() => {
      setIsPrinting(false)
      // Auto-trigger clean bill image download once printed
      triggerBillDownload()
    }, 1600)
    return () => clearTimeout(timer)
  }, [])

  const triggerBillDownload = async () => {
    if (!receiptCaptureRef.current) return
    try {
      // Small delay to ensure QR code and DOM are fully rendered
      setTimeout(async () => {
        if (!receiptCaptureRef.current) return
        const canvas = await html2canvas(receiptCaptureRef.current, {
          scale: 2, // High resolution capture
          backgroundColor: '#FFFDF7',
          useCORS: true,
          logging: false
        })
        const image = canvas.toDataURL('image/png')
        const link = document.createElement('a')
        link.href = image
        link.download = `YUKTI27-RECEIPT-${dossier.regId || 'BILL'}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        setDownloadSuccess(true)
      }, 500)
    } catch (err) {
      console.warn('Receipt image download error:', err)
    }
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(7, 3, 16, 0.94)',
      backdropFilter: 'blur(25px)',
      WebkitBackdropFilter: 'blur(25px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px 14px',
      overflow: 'hidden'
    }}>
      {/* Outer Assembly: Printer + Attached Paper Feed */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '380px',
        maxHeight: '86vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '-16px',
            right: '-10px',
            background: '#1F0E2C',
            border: '1.5px solid #C59B3C',
            color: '#FFF2A6',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '1.2rem',
            zIndex: 40,
            display: 'grid',
            placeItems: 'center',
            boxShadow: '0 4px 18px rgba(0,0,0,0.85)'
          }}
          aria-label="Close Receipt"
        >
          ×
        </button>

        {/* ═══ REALISTIC METALLIC POS PRINTER HEAD (Flush on Top) ═══ */}
        <div style={{
          width: '100%',
          height: '46px',
          background: 'linear-gradient(180deg, #d4d4d8 0%, #a1a1aa 35%, #52525b 80%, #27272a 100%)',
          borderRadius: '16px 16px 4px 4px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.9), inset 0 2px 3px rgba(255,255,255,0.7)',
          position: 'relative',
          zIndex: 20,
          border: '1px solid #71717a',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 18px',
          boxSizing: 'border-box'
        }}>
          {/* Printer brand label & LED indicators */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: 'monospace', fontSize: '0.64rem', fontWeight: 'bold', color: '#18181b', letterSpacing: '0.12em' }}>
              YUKTI-POS 27
            </span>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: isPrinting ? '#10b981' : '#22c55e',
              boxShadow: isPrinting ? '0 0 10px #10b981' : '0 0 4px #22c55e',
              animation: isPrinting ? 'blinkLed 0.8s infinite alternate' : 'none'
            }} />
          </div>

          <span style={{ fontSize: '0.58rem', fontFamily: 'monospace', color: '#27272a', fontWeight: '600', letterSpacing: '0.06em' }}>
            {isPrinting ? 'PRINTING...' : 'PRINT COMPLETE'}
          </span>

          {/* Deep mechanical exit slot mouth at the bottom edge */}
          <div style={{
            position: 'absolute',
            bottom: '0',
            left: '20px',
            right: '20px',
            height: '6px',
            background: '#09090b',
            borderRadius: '4px 4px 0 0',
            boxShadow: 'inset 0 3px 5px rgba(0,0,0,0.95)',
            zIndex: 22
          }} />
        </div>

        {/* ═══ CONTINUOUS PAPER FEED WRAPPER (Attached seamlessly to printer) ═══ */}
        <div style={{
          width: '92%',
          position: 'relative',
          zIndex: 10,
          marginTop: '-4px', // Tucks paper directly beneath the printer slot
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: 'calc(86vh - 46px)'
        }}>
          {/* Sliding receipt paper */}
          <div
            ref={receiptCaptureRef}
            className="receipt-paper-scroll"
            style={{
              background: '#FFFDF7',
              color: '#1c1917',
              padding: '18px 20px 28px',
              fontFamily: "'Courier New', Courier, monospace",
              boxShadow: '0 20px 50px rgba(0,0,0,0.85)',
              position: 'relative',
              borderRadius: '0 0 6px 6px',
              overflowY: 'auto',
              maxHeight: 'calc(86vh - 54px)',
              animation: 'slideDownFromPrinter 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards',
              boxSizing: 'border-box'
            }}
          >
            {/* Status Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px dashed #78716c', paddingBottom: '10px', marginBottom: '12px' }}>
              <div>
                <strong style={{ fontSize: '1.2rem', letterSpacing: '0.06em', color: '#059669', display: 'block' }}>PAID ✓</strong>
                <small style={{ fontSize: '0.62rem', color: '#78716c', letterSpacing: '0.04em' }}>YUKTI ’27 OFFICIAL RECEIPT</small>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 'bold' }}>{new Date().toLocaleDateString('en-IN')}</div>
                <div style={{ fontSize: '0.62rem', color: '#78716c' }}>{new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            </div>

            {/* Institution Header */}
            <div style={{ textAlign: 'center', marginBottom: '12px' }}>
              <strong style={{ fontSize: '0.82rem', display: 'block', letterSpacing: '0.04em' }}>THIAGARAJAR SCHOOL OF MANAGEMENT</strong>
              <small style={{ fontSize: '0.64rem', color: '#78716c' }}>Madurai, Tamil Nadu · Founded 1962</small>
            </div>

            {/* Itemized Docket Rows */}
            <div style={{ fontSize: '0.76rem', lineHeight: '1.55', marginBottom: '10px' }}>
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
                <span style={{ maxWidth: '170px', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {dossier.college}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>ARENA ENTRY:</span>
                <span style={{ maxWidth: '170px', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem' }}>
                <span>Registration Fee:</span>
                <span>{dossier.fee || '₹500'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem' }}>
                <span>Convenience Tax (0%):</span>
                <span>₹0.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.94rem', fontWeight: 'bold', marginTop: '4px' }}>
                <span>TOTAL PAID:</span>
                <span>{dossier.fee || '₹500'}</span>
              </div>
            </div>

            {/* Advisory Notice */}
            <div style={{
              background: '#FEF3C7',
              border: '1px solid #F59E0B',
              borderRadius: '6px',
              padding: '6px 8px',
              textAlign: 'center',
              fontSize: '0.66rem',
              color: '#92400E',
              fontWeight: 'bold',
              marginBottom: '12px'
            }}>
              📸 PLEASE SCREENSHOT THIS SCREEN FOR FUTURE REFERENCE
            </div>

            {/* ═══ SCANNABLE QR CODE FOR ROYAL PASS TREATMENT ═══ */}
            <div style={{ textAlign: 'center', borderTop: '1px dashed #a8a29e', paddingTop: '10px' }}>
              <div style={{ fontSize: '0.66rem', fontWeight: 'bold', letterSpacing: '0.04em', marginBottom: '8px', color: '#1c1917' }}>
                SCAN QR BELOW FOR ROYAL DELEGATE ENTRY PASS
              </div>
              
              <div style={{
                background: '#ffffff',
                padding: '8px',
                borderRadius: '8px',
                display: 'inline-block',
                border: '1px solid #d6d3d1'
              }}>
                <QRCodeSVG
                  value={passUrl}
                  size={130}
                  level="M"
                  includeMargin={false}
                  imageSettings={{
                    src: "/yukti-logo.png",
                    x: undefined,
                    y: undefined,
                    height: 24,
                    width: 24,
                    excavate: true,
                  }}
                />
              </div>
              
              <small style={{ display: 'block', fontSize: '0.60rem', color: '#78716c', marginTop: '4px' }}>
                Scan with phone camera to view full A4 printable pass
              </small>

              {/* Action Buttons Row: View Pass & Download Bill Image */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={onOpenPass}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: '#1F0E2C',
                    color: '#FFF2A6',
                    border: '1.5px solid #C59B3C',
                    borderRadius: '8px',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 'bold',
                    fontSize: '0.80rem',
                    cursor: 'pointer',
                    letterSpacing: '0.03em'
                  }}
                >
                  👑 View & Print A4 Delegate Pass ↗
                </button>

                <button
                  type="button"
                  onClick={triggerBillDownload}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: 'rgba(16, 185, 129, 0.12)',
                    color: '#047857',
                    border: '1px solid #10b981',
                    borderRadius: '8px',
                    fontFamily: "'Courier New', Courier, monospace",
                    fontWeight: 'bold',
                    fontSize: '0.74rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  📥 {downloadSuccess ? '✓ Bill Image Downloaded' : 'Download Receipt Bill Image (.PNG)'}
                </button>
              </div>
            </div>

            {/* Footer Receipt Note with generous bottom padding so jagged edge never touches text */}
            <div style={{ textAlign: 'center', marginTop: '14px', paddingBottom: '16px', fontSize: '0.62rem', color: '#78716c' }}>
              HAVE A WONDERFUL EXPERIENCE AT YUKTI ’27!
            </div>

            {/* Jagged / Zigzag paper bottom edge effect */}
            <div style={{
              position: 'absolute',
              bottom: '0',
              left: 0,
              right: 0,
              height: '8px',
              backgroundImage: 'radial-gradient(circle, transparent, transparent 50%, #FFFDF7 50%, #FFFDF7 100%)',
              backgroundSize: '12px 14px',
              pointerEvents: 'none'
            }} />
          </div>
        </div>
      </div>

      {/* Embedded CSS Keyframes for Realistic Mechanical Printing Animation */}
      <style>{`
        @keyframes slideDownFromPrinter {
          0% {
            transform: translateY(-90%);
            opacity: 0.1;
          }
          30% {
            transform: translateY(-60%);
            opacity: 0.7;
          }
          70% {
            transform: translateY(-20%);
            opacity: 0.95;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes blinkLed {
          0% { opacity: 0.3; }
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
