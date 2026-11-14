import React, { useState, useEffect, useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import html2canvas from 'html2canvas'

/**
 * ReceiptModal Component
 * 1. Physical connection: The metallic POS printer head sits flush and seamlessly atop the receipt paper.
 * 2. Downward emerging animation: The receipt emerges continuously from the printer slot.
 * 3. Compact & Responsive:
 *    - Mobile/Tablet: Compact width (max 295px) so printer head, paper, and buttons are visible without scrolling out of frame.
 *    - PC / Desktop: Dedicated right docking panel for action buttons ("View & Print Pass" + "Download Bill Image").
 */
export default function ReceiptModal({ dossier, passUrl, onOpenPass, onClose }) {
  if (!dossier) return null

  const [isPrinting, setIsPrinting] = useState(true)
  const [downloadSuccess, setDownloadSuccess] = useState(false)
  const receiptCaptureRef = useRef(null)

  useEffect(() => {
    // Printing feeder motion completes after 1.4s
    const timer = setTimeout(() => {
      setIsPrinting(false)
      // Auto-trigger clean bill image download once printed
      triggerBillDownload()
    }, 1400)
    return () => clearTimeout(timer)
  }, [])

  const triggerBillDownload = async () => {
    if (!receiptCaptureRef.current) return
    try {
      const el = receiptCaptureRef.current
      const originalScrollTop = el.scrollTop
      const originalMaxHeight = el.style.maxHeight
      const originalOverflow = el.style.overflowY

      el.style.maxHeight = 'none'
      el.style.overflowY = 'visible'

      const canvas = await html2canvas(el, {
        scale: 2,
        backgroundColor: '#FFFDF7',
        useCORS: true,
        logging: false,
        windowWidth: el.scrollWidth,
        windowHeight: el.scrollHeight
      })

      el.style.maxHeight = originalMaxHeight
      el.style.overflowY = originalOverflow
      el.scrollTop = originalScrollTop

      const image = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.href = image
      link.download = `YUKTI27-RECEIPT-${dossier.regId || 'BILL'}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      setDownloadSuccess(true)
    } catch (err) {
      console.warn('Receipt image download error:', err)
    }
  }

  return (
    <div className="receipt-modal-backdrop">
      {/* Outer Assembly: Split Layout on PC (Receipt Left, Action Dock Right) */}
      <div className="receipt-assembly-wrap">
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="receipt-modal-close-btn"
          aria-label="Close Receipt"
        >
          ×
        </button>

        {/* ═══ THERMAL PRINTER + PAPER ASSEMBLY (Scaled for Instant Visibility) ═══ */}
        <div className="receipt-printer-column">
          {/* ═══ REALISTIC METALLIC POS PRINTER HEAD (Flush on Top) ═══ */}
          <div className="pos-printer-head">
            {/* Printer brand label & LED indicators */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="printer-brand-label">
                YUKTI-POS 27
              </span>
              <div
                className="printer-status-led"
                style={{
                  background: isPrinting ? '#10b981' : '#22c55e',
                  boxShadow: isPrinting ? '0 0 10px #10b981' : '0 0 4px #22c55e',
                  animation: isPrinting ? 'blinkLed 0.8s infinite alternate' : 'none'
                }}
              />
            </div>

            <span className="printer-status-text">
              {isPrinting ? 'PRINTING...' : 'PRINT COMPLETE'}
            </span>

            {/* Deep mechanical exit slot mouth at the bottom edge */}
            <div className="printer-exit-slot" />
          </div>

          {/* ═══ CONTINUOUS PAPER FEED WRAPPER (Attached seamlessly to printer) ═══ */}
          <div className="receipt-feed-wrapper">
            {/* Sliding receipt paper */}
            <div
              ref={receiptCaptureRef}
              className="receipt-paper-scroll"
            >
              {/* Status Header */}
              <div className="receipt-status-header">
                <div>
                  <span className="receipt-paid-badge">PAID ✓</span>
                  <small className="receipt-official-sub">YUKTI ’27 OFFICIAL RECEIPT</small>
                </div>
                <div className="receipt-timestamp-block">
                  <div>{dossier.date || '14/11/2026'}</div>
                  <div>{dossier.time || '10:53 am'}</div>
                </div>
              </div>

              {/* Institution Header */}
              <div className="receipt-inst-header">
                <div className="receipt-inst-name">
                  THIAGARAJAR SCHOOL OF MANAGEMENT
                </div>
                <div className="receipt-inst-sub">
                  Madurai, Tamil Nadu · Founded 1962
                </div>
              </div>

              {/* Receipt Details Table */}
              <div className="receipt-details-table">
                <div className="receipt-row">
                  <span className="receipt-label">DOCKET ID:</span>
                  <strong className="receipt-docket-val">{dossier.regId || 'YK27-DEMO-001'}</strong>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">LEAD PAYEE:</span>
                  <span className="receipt-val-bold">{dossier.name || 'Delegate Contender'}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">COLLEGE:</span>
                  <span className="receipt-val-truncated">
                    {dossier.college || 'Institution'}
                  </span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">ARENA ENTRY:</span>
                  <span className="receipt-val-truncated receipt-val-bold">{dossier.event || 'Flagship Arena'}</span>
                </div>
                <div className="receipt-dotted-div" />
                <div className="receipt-row" style={{ fontFamily: 'monospace' }}>
                  <span className="receipt-label">TXN / UTR REF:</span>
                  <span>{dossier.txRef || '111111111111'}</span>
                </div>
              </div>

              {/* Financials & Total */}
              <div className="receipt-financials-block">
                <div className="receipt-row receipt-fee-row">
                  <span>Registration Fee:</span>
                  <span>{dossier.fee || '₹500'}</span>
                </div>
                <div className="receipt-row receipt-fee-row">
                  <span>Convenience Tax (0%):</span>
                  <span>₹0.00</span>
                </div>
                <div className="receipt-row receipt-total-row">
                  <span>TOTAL PAID:</span>
                  <span>{dossier.fee || '₹500'}</span>
                </div>
              </div>

              {/* ═══ SCANNABLE QR CODE FOR VERIFIED PASS ═══ */}
              <div className="receipt-qr-section">
                <div className="receipt-qr-heading">
                  SCAN QR BELOW FOR OFFICIAL DELEGATE ENTRY PASS
                </div>
                
                <div className="receipt-qr-container">
                  <QRCodeSVG
                    value={passUrl}
                    size={110}
                    level="M"
                    includeMargin={false}
                  />
                </div>
                
                <small className="receipt-qr-footnote">
                  Scan with mobile camera to view full A4 printable pass
                </small>
              </div>

              {/* Clean Receipt Footer Note */}
              <div className="receipt-inst-footnote">
                THIAGARAJAR SCHOOL OF MANAGEMENT · YUKTI ’27
              </div>
            </div>

            {/* Mobile-Only Action Dock (Positioned beneath paper when screen < 680px) */}
            <div className="receipt-mobile-actions-panel">
              <button
                type="button"
                onClick={onOpenPass}
                className="receipt-action-btn-primary"
              >
                View & Print A4 Delegate Pass
              </button>

              <button
                type="button"
                onClick={triggerBillDownload}
                className="receipt-action-btn-secondary"
              >
                {downloadSuccess ? '✓ Bill Image Downloaded' : 'Download Receipt Bill Image (.PNG)'}
              </button>
            </div>
          </div>
        </div>

        {/* ═══ PC-VIEW DEDICATED RIGHT DOCKING ACTION PANEL (Screen width >= 680px) ═══ */}
        <div className="receipt-pc-actions-dock">
          <div className="dock-card-header">
            <span className="mono gold" style={{ fontSize: '0.70rem', letterSpacing: '0.12em' }}>OFFICIAL VERIFIED DOCKET</span>
            <h4 style={{ color: '#FFF2A6', margin: '6px 0 8px', fontSize: '1.1rem', fontFamily: "'Space Grotesk', sans-serif" }}>
              Registration Verified
            </h4>
            <p style={{ color: '#cbd5e1', fontSize: '0.80rem', lineHeight: 1.5, margin: 0 }}>
              Your delegate registration docket has been secured on the official TSM Madurai registry.
            </p>
          </div>

          <div className="dock-buttons-wrap">
            <button
              type="button"
              onClick={onOpenPass}
              className="receipt-action-btn-primary"
            >
              View & Print A4 Delegate Pass
            </button>

            <button
              type="button"
              onClick={triggerBillDownload}
              className="receipt-action-btn-secondary"
            >
              {downloadSuccess ? '✓ Bill Image Downloaded' : 'Download Receipt Bill Image (.PNG)'}
            </button>
          </div>

          <div className="dock-card-footer">
            <div style={{ fontSize: '0.70rem', color: '#94a3b8', lineHeight: 1.45 }}>
              Tip: The A4 Delegate Pass is calibrated for 1-page PDF printing. Present it at the security check-in gate on event day.
            </div>
          </div>
        </div>
      </div>

      {/* Embedded CSS Keyframes & Responsive Dock Styling */}
      <style>{`
        .receipt-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(7, 3, 16, 0.94);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px 12px;
          overflow: hidden;
        }

        .receipt-assembly-wrap {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          max-width: 720px;
          width: 100%;
          max-height: 90vh;
        }

        .receipt-modal-close-btn {
          position: absolute;
          top: -20px;
          right: -10px;
          background: #1F0E2C;
          border: 1.5px solid #C59B3C;
          color: #FFF2A6;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.25rem;
          z-index: 50;
          display: grid;
          place-items: center;
          box-shadow: 0 4px 18px rgba(0,0,0,0.85);
          transition: transform 0.2s ease, background 0.2s ease;
        }
        .receipt-modal-close-btn:hover {
          transform: scale(1.08);
          background: #4D1D64;
        }

        .receipt-printer-column {
          position: relative;
          width: 100%;
          max-width: 310px;
          display: flex;
          flex-direction: column;
          align-items: center;
          flex-shrink: 0;
        }

        .pos-printer-head {
          width: 100%;
          height: 42px;
          background: linear-gradient(180deg, #d4d4d8 0%, #a1a1aa 35%, #52525b 80%, #27272a 100%);
          border-radius: 14px 14px 4px 4px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.9), inset 0 2px 3px rgba(255,255,255,0.7);
          position: relative;
          z-index: 20;
          border: 1px solid #71717a;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          box-sizing: border-box;
        }

        .printer-brand-label {
          font-family: monospace;
          font-size: 0.62rem;
          font-weight: bold;
          color: #18181b;
          letter-spacing: 0.12em;
        }

        .printer-status-led {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: inline-block;
        }

        .printer-status-text {
          font-size: 0.56rem;
          font-family: monospace;
          color: #27272a;
          font-weight: 600;
          letter-spacing: 0.06em;
        }

        .printer-exit-slot {
          position: absolute;
          bottom: 0;
          left: 16px;
          right: 16px;
          height: 5px;
          background: #09090b;
          border-radius: 4px 4px 0 0;
          box-shadow: inset 0 3px 5px rgba(0,0,0,0.95);
          z-index: 22;
        }

        .receipt-feed-wrapper {
          width: 94%;
          position: relative;
          z-index: 10;
          margin-top: -4px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          max-height: calc(82vh - 44px);
        }

        .receipt-paper-scroll {
          background: #FFFDF7;
          color: #1c1917;
          padding: 14px 16px 20px;
          font-family: 'Courier New', Courier, monospace;
          box-shadow: 0 16px 45px rgba(0,0,0,0.85);
          position: relative;
          border-radius: 0 0 6px 6px;
          overflow-y: auto;
          max-height: calc(82vh - 50px);
          animation: slideDownFromPrinter 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          box-sizing: border-box;
        }

        .receipt-status-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px dashed #78716c;
          padding-bottom: 8px;
          margin-bottom: 10px;
        }
        .receipt-paid-badge {
          font-size: 0.98rem;
          font-weight: bold;
          color: #047857;
          letter-spacing: 0.08em;
        }
        .receipt-official-sub {
          display: block;
          font-size: 0.56rem;
          color: #78716c;
          margin-top: 1px;
        }
        .receipt-timestamp-block {
          text-align: right;
          font-size: 0.60rem;
          color: #44403c;
        }

        .receipt-inst-header {
          text-align: center;
          padding: 4px 0 8px;
        }
        .receipt-inst-name {
          font-weight: bold;
          font-size: 0.76rem;
          letter-spacing: 0.03em;
          line-height: 1.25;
        }
        .receipt-inst-sub {
          font-size: 0.58rem;
          color: #78716c;
          margin-top: 2px;
        }

        .receipt-details-table {
          border-top: 1px dashed #a8a29e;
          border-bottom: 1px dashed #a8a29e;
          padding: 8px 0;
          font-size: 0.68rem;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .receipt-row {
          display: flex;
          justify-content: space-between;
        }
        .receipt-label {
          color: #78716c;
        }
        .receipt-docket-val {
          font-family: monospace;
          letter-spacing: 0.04em;
        }
        .receipt-val-bold {
          font-weight: 600;
        }
        .receipt-val-truncated {
          max-width: 145px;
          text-align: right;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .receipt-dotted-div {
          border-top: 1px dotted #d6d3d1;
          margin: 3px 0;
        }

        .receipt-financials-block {
          border-bottom: 2px dashed #78716c;
          padding: 8px 0;
          font-size: 0.70rem;
        }
        .receipt-fee-row {
          color: #57534e;
          margin-bottom: 2px;
        }
        .receipt-total-row {
          font-weight: bold;
          font-size: 0.82rem;
          padding-top: 3px;
          color: #1c1917;
        }

        .receipt-qr-section {
          text-align: center;
          padding-top: 6px;
        }
        .receipt-qr-heading {
          font-size: 0.62rem;
          font-weight: bold;
          letter-spacing: 0.03em;
          margin-bottom: 6px;
          color: #1c1917;
        }
        .receipt-qr-container {
          background: #ffffff;
          padding: 6px;
          border-radius: 6px;
          display: inline-block;
          border: 1px solid #d6d3d1;
        }
        .receipt-qr-footnote {
          display: block;
          font-size: 0.58rem;
          color: #78716c;
          margin-top: 3px;
        }
        .receipt-inst-footnote {
          text-align: center;
          margin-top: 12px;
          padding-bottom: 4px;
          font-size: 0.60rem;
          color: #78716c;
          letter-spacing: 0.04em;
        }

        /* ═══ PC DOCK (>= 680px) ═══ */
        .receipt-pc-actions-dock {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: rgba(31, 14, 44, 0.95);
          border: 1.5px solid rgba(197, 155, 60, 0.4);
          border-radius: 18px;
          padding: 24px;
          max-width: 320px;
          width: 100%;
          box-shadow: 0 20px 50px rgba(0,0,0,0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-sizing: border-box;
          gap: 18px;
        }

        .dock-buttons-wrap {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .receipt-action-btn-primary {
          width: 100%;
          padding: 12px 16px;
          background: linear-gradient(135deg, #1F0E2C 0%, #3b1754 100%);
          color: #FFF2A6;
          border: 1.5px solid #C59B3C;
          border-radius: 10px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: bold;
          font-size: 0.84rem;
          cursor: pointer;
          letter-spacing: 0.03em;
          box-shadow: 0 4px 14px rgba(0,0,0,0.5);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .receipt-action-btn-primary:hover {
          background: linear-gradient(135deg, #3b1754 0%, #5b2182 100%);
          border-color: #F5D77F;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(197, 155, 60, 0.35);
        }

        .receipt-action-btn-secondary {
          width: 100%;
          padding: 10px 14px;
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1.2px solid #10b981;
          border-radius: 10px;
          font-family: 'Courier New', Courier, monospace;
          font-weight: bold;
          font-size: 0.76rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.25s ease;
        }
        .receipt-action-btn-secondary:hover {
          background: rgba(16, 185, 129, 0.25);
          color: #6ee7b7;
          border-color: #34d399;
          transform: translateY(-2px);
        }

        .receipt-mobile-actions-panel {
          display: none;
        }

        /* ═══ MOBILE / TABLET ADAPTATION (< 680px) ═══ */
        @media (max-width: 680px) {
          .receipt-assembly-wrap {
            flex-direction: column;
            gap: 12px;
            max-height: 94vh;
          }
          .receipt-pc-actions-dock {
            display: none;
          }
          .receipt-mobile-actions-panel {
            display: flex;
            flex-direction: column;
            gap: 8px;
            background: rgba(31, 14, 44, 0.95);
            border: 1.5px solid rgba(197, 155, 60, 0.35);
            border-radius: 0 0 12px 12px;
            padding: 10px 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.85);
            z-index: 30;
          }
          .receipt-printer-column {
            max-width: 295px;
          }
          .pos-printer-head {
            height: 38px;
            padding: 0 12px;
          }
          .printer-brand-label {
            font-size: 0.58rem;
          }
          .receipt-feed-wrapper {
            max-height: calc(88vh - 40px);
          }
          .receipt-paper-scroll {
            padding: 12px 14px 16px;
            max-height: calc(52vh);
          }
        }

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
      `}</style>
    </div>
  )
}
