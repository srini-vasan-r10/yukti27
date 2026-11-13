import React, { useState } from 'react'
import { MANAGEMENT_EVENTS, CULTURAL_EVENTS, SITE_CONFIG } from '../utils/confluenceData'
import {
  isRazorpayConfigured,
  parseAmountToPaise,
  openRazorpayCheckout
} from '../utils/razorpayService'

export default function RegistrationPortalPage({ onBackToHome }) {
  const [selectedTrackType, setSelectedTrackType] = useState('management')
  const [selectedEventId, setSelectedEventId] = useState('the-ai-ceo-challenge')

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    year: 'PG / MBA — 1st Year',
    delegationType: 'Team Entry',
    teamMembers: '',
    specialRequirements: '',
  })

  // Payment State: 'form' | 'qr_modal' | 'confirmed'
  const [paymentStep, setPaymentStep] = useState('form')
  const [utrNumber, setUtrNumber] = useState('')
  const [submittedDossier, setSubmittedDossier] = useState(null)

  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  // Find active selected event to compute fee
  const allEvents = [...MANAGEMENT_EVENTS, ...CULTURAL_EVENTS]
  const currentEvent = allEvents.find(e => e.id === selectedEventId) || MANAGEMENT_EVENTS[0]

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleInitiatePayment = async (e) => {
    e.preventDefault()
    // Generate Registration reference ID
    const regId = 'YK27-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase()
    
    // Save temporary record to LocalStorage
    const pendingRecord = {
      ...formData,
      regId,
      event: currentEvent.title,
      fee: currentEvent.fee || '₹500',
      timestamp: new Date().toISOString(),
      status: 'Awaiting Payment Verification'
    }
    localStorage.setItem('yukti_last_pending_reg', JSON.stringify(pendingRecord))
    setSubmittedDossier(pendingRecord)

    // Check if Razorpay Key ID is provisioned
    if (isRazorpayConfigured()) {
      setIsProcessingPayment(true)
      try {
        const amountPaise = parseAmountToPaise(currentEvent.fee)
        await openRazorpayCheckout({
          amount: amountPaise,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          eventTitle: currentEvent.title,
          regId: regId,
          onSuccess: (paymentResult) => {
            const confirmedRecord = {
              ...pendingRecord,
              paymentMethod: 'Razorpay Online Gateway',
              razorpayPaymentId: paymentResult.paymentId,
              razorpayOrderId: paymentResult.orderId,
              utr: paymentResult.paymentId,
              status: 'Payment Verified & Confirmed'
            }
            const existingList = JSON.parse(localStorage.getItem('yukti_local_registrations') || '[]')
            existingList.unshift(confirmedRecord)
            localStorage.setItem('yukti_local_registrations', JSON.stringify(existingList))
            setSubmittedDossier(confirmedRecord)
            setPaymentStep('confirmed')
            setIsProcessingPayment(false)
          },
          onDismiss: () => {
            setIsProcessingPayment(false)
          }
        })
      } catch (err) {
        console.error('Razorpay initialization error:', err)
        setIsProcessingPayment(false)
        // Fallback to QR checkout if popup fails
        setPaymentStep('qr_modal')
      }
    } else {
      // Default / fallback mode when key is not yet configured: Sample UPI QR modal
      setPaymentStep('qr_modal')
    }
  }

  const handleConfirmUpi = (e) => {
    e.preventDefault()
    if (!utrNumber.trim()) {
      alert('Please enter your 12-digit UPI Reference / UTR Number.')
      return
    }

    const finalRecord = {
      ...submittedDossier,
      utr: utrNumber.trim(),
      status: 'Registered & Confirmed Locally'
    }

    // Persist to local storage array
    const existingList = JSON.parse(localStorage.getItem('yukti_local_registrations') || '[]')
    existingList.unshift(finalRecord)
    localStorage.setItem('yukti_local_registrations', JSON.stringify(existingList))

    setSubmittedDossier(finalRecord)
    setPaymentStep('confirmed')
  }

  return (
    <div className="subpage-wrapper">
      <div className="subpage-hero" style={{ background: 'radial-gradient(ellipse at 80% 20%, rgba(233,200,120,0.15), transparent 60%), #0c061a' }}>
        <div className="subpage-hero-content">
          <button className="back-breadcrumb-btn" onClick={onBackToHome}>
            ← Return to Confluence
          </button>
          <div className="eyebrow mono" style={{ marginTop: '1rem' }}>
            Official Delegate Portal · YUKTI ’27
          </div>
          <h1 className="subpage-title">
            Priority <span className="gold">Registration Gateway</span>
          </h1>
          <p className="subpage-lead">
            Stake your institution's claim in the national arenas. Register your delegation, generate verified candidate credentials, and complete your registration fee via sample UPI QR checkout.
          </p>
        </div>
      </div>

      <div className="subpage-content-container">
        {paymentStep === 'form' && (
          <div className="portal-layout-grid">
            {/* Form Column */}
            <div className="portal-form-column">
              <div className="portal-card">
                <div className="portal-card-header">
                  <span className="mono gold">Step 01 / Delegate Dossier</span>
                  <h3>Participant & Institution Details</h3>
                </div>

                <form onSubmit={handleInitiatePayment} className="portal-actual-form">
                  {/* Category Switcher */}
                  <div className="form-track-switcher">
                    <button
                      type="button"
                      className={`track-pill-btn ${selectedTrackType === 'management' ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedTrackType('management')
                        setSelectedEventId(MANAGEMENT_EVENTS[0].id)
                      }}
                    >
                      Management Arenas (8)
                    </button>
                    <button
                      type="button"
                      className={`track-pill-btn ${selectedTrackType === 'cultural' ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedTrackType('cultural')
                        setSelectedEventId(CULTURAL_EVENTS[0].id)
                      }}
                    >
                      Cultural Spectacles (5)
                    </button>
                  </div>

                  {/* Specific Event Selector */}
                  <div className="field-group">
                    <label className="mono">Select Competitive Arena *</label>
                    <select
                      value={selectedEventId}
                      onChange={(e) => setSelectedEventId(e.target.value)}
                      className="portal-input"
                    >
                      {(selectedTrackType === 'management' ? MANAGEMENT_EVENTS : CULTURAL_EVENTS).map((ev) => (
                        <option key={ev.id} value={ev.id}>
                          {ev.title} ({ev.fee || '₹500'})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Standard Form Inputs */}
                  <div className="fields-row-2">
                    <div className="field-group">
                      <label className="mono">Team Lead / Participant Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Vigneshwaran K."
                        className="portal-input"
                      />
                    </div>
                    <div className="field-group">
                      <label className="mono">Official Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="delegate@institution.edu"
                        className="portal-input"
                      />
                    </div>
                  </div>

                  <div className="fields-row-2">
                    <div className="field-group">
                      <label className="mono">College / University Name *</label>
                      <input
                        type="text"
                        name="college"
                        required
                        value={formData.college}
                        onChange={handleChange}
                        placeholder="e.g. IIM Kozhikode / Loyola College"
                        className="portal-input"
                      />
                    </div>
                    <div className="field-group">
                      <label className="mono">WhatsApp Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className="portal-input"
                      />
                    </div>
                  </div>

                  <div className="fields-row-2">
                    <div className="field-group">
                      <label className="mono">Current Academic Year</label>
                      <select name="year" value={formData.year} onChange={handleChange} className="portal-input">
                        <option>UG — 1st / 2nd Year</option>
                        <option>UG — Final Year</option>
                        <option>PG / MBA — 1st Year</option>
                        <option>PG / MBA — 2nd Year</option>
                        <option>Corporate Observer</option>
                      </select>
                    </div>
                    <div className="field-group">
                      <label className="mono">Delegation Format</label>
                      <select name="delegationType" value={formData.delegationType} onChange={handleChange} className="portal-input">
                        <option>Team Entry</option>
                        <option>Individual Contender</option>
                        <option>Institutional Contingent</option>
                      </select>
                    </div>
                  </div>

                  <div className="field-group">
                    <label className="mono">Additional Team Member Names & Roles (if applicable)</label>
                    <textarea
                      name="teamMembers"
                      rows="2"
                      value={formData.teamMembers}
                      onChange={handleChange}
                      placeholder="e.g. Member 2: Priya S. (Finance), Member 3: Arun M. (Analytics)..."
                      className="portal-input"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn portal-submit-btn"
                    disabled={isProcessingPayment}
                    style={{ position: 'relative' }}
                  >
                    {isProcessingPayment ? (
                      'Connecting to Secure Gateway...'
                    ) : isRazorpayConfigured() ? (
                      `Pay via Razorpay (${currentEvent.fee || '₹500'}) ↗`
                    ) : (
                      `Proceed to Registration Checkout (${currentEvent.fee || '₹500'}) ↗`
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Event Summary & Fee Breakdown Column */}
            <div className="portal-summary-column">
              <div className="summary-card">
                <span className="mono gold">Selected Arena Overview</span>
                <h2 className="summary-event-title">{currentEvent.title}</h2>
                <span className="summary-domain-tag mono">{currentEvent.domain || currentEvent.category}</span>
                <p className="summary-desc">{currentEvent.shortDesc}</p>

                <div className="summary-highlights-box">
                  <div className="highlight-row">
                    <span>Grand Event Prize:</span>
                    <strong className="gold">{currentEvent.prizes}</strong>
                  </div>
                  <div className="highlight-row">
                    <span>Team Composition:</span>
                    <strong>{currentEvent.teamSize || currentEvent.format}</strong>
                  </div>
                  <div className="highlight-row">
                    <span>Host Campus:</span>
                    <strong>TSM Madurai</strong>
                  </div>
                </div>

                <div className="summary-pricing-tier">
                  <div className="price-tag-big">
                    {currentEvent.fee || '₹500'}
                  </div>
                  <small>Inclusive of delegate identity pass, preliminary problem brief & verified participation certificate.</small>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 02: Interactive Sample UPI QR Checkout Modal */}
        {paymentStep === 'qr_modal' && submittedDossier && (
          <div className="qr-checkout-box reveal in">
            <div className="qr-left-pane">
              <div className="mono gold" style={{ marginBottom: '8px' }}>Sample Integrated Payment Gateway</div>
              <h2>Scan & Pay via Any UPI App</h2>
              <p className="qr-sub">
                Scan the dynamic payment QR code using Google Pay, PhonePe, Paytm, or BHIM. Enter your 12-digit transaction ID below to confirm and store your registration locally.
              </p>

              {/* Dynamic Sample QR Canvas/SVG */}
              <div className="sample-qr-card">
                <svg className="sample-qr-code-svg" viewBox="0 0 200 200">
                  <rect width="200" height="200" fill="#ffffff" rx="10" />
                  {/* Top-Left Finder */}
                  <rect x="20" y="20" width="45" height="45" fill="#0c061a" rx="4" />
                  <rect x="28" y="28" width="29" height="29" fill="#ffffff" />
                  <rect x="34" y="34" width="17" height="17" fill="#f59e0b" />
                  {/* Top-Right Finder */}
                  <rect x="135" y="20" width="45" height="45" fill="#0c061a" rx="4" />
                  <rect x="143" y="28" width="29" height="29" fill="#ffffff" />
                  <rect x="149" y="34" width="17" height="17" fill="#f59e0b" />
                  {/* Bottom-Left Finder */}
                  <rect x="20" y="135" width="45" height="45" fill="#0c061a" rx="4" />
                  <rect x="28" y="143" width="29" height="29" fill="#ffffff" />
                  <rect x="34" y="149" width="17" height="17" fill="#f59e0b" />
                  {/* Procedural Data Matrix Dots */}
                  <rect x="80" y="25" width="12" height="12" fill="#0c061a" />
                  <rect x="105" y="35" width="15" height="10" fill="#0c061a" />
                  <rect x="75" y="60" width="20" height="20" fill="#0c061a" />
                  <rect x="105" y="70" width="15" height="15" fill="#f59e0b" />
                  <rect x="135" y="85" width="12" height="25" fill="#0c061a" />
                  <rect x="85" y="95" width="30" height="12" fill="#0c061a" />
                  <rect x="25" y="85" width="15" height="15" fill="#0c061a" />
                  <rect x="50" y="90" width="12" height="12" fill="#0c061a" />
                  <rect x="75" y="130" width="15" height="15" fill="#0c061a" />
                  <rect x="100" y="140" width="25" height="12" fill="#f59e0b" />
                  <rect x="140" y="140" width="20" height="20" fill="#0c061a" />
                  <rect x="165" y="165" width="15" height="15" fill="#0c061a" />
                  <rect x="135" y="170" width="15" height="10" fill="#0c061a" />
                  <rect x="90" y="165" width="20" height="15" fill="#0c061a" />
                  <circle cx="100" cy="100" r="14" fill="#0c061a" />
                  <text x="100" y="104" textAnchor="middle" fill="#f59e0b" fontSize="10" fontWeight="bold">Y27</text>
                </svg>

                <div className="qr-scan-meta">
                  <span className="mono">UPI ID: yukti27@tsm.ac.in</span>
                  <div className="amount-pill mono">Payable: {submittedDossier.fee}</div>
                </div>
              </div>
            </div>

            {/* Right Pane: UTR Confirmation */}
            <div className="qr-right-pane">
              <div className="receipt-preview-box">
                <span className="mono gold">Docket #{submittedDossier.regId}</span>
                <h4>{submittedDossier.event}</h4>
                <p>Lead: {submittedDossier.name} · {submittedDossier.college}</p>
              </div>

              <form onSubmit={handleConfirmUpi} className="utr-submit-form">
                <label className="mono">Enter 12-Digit UPI Ref / UTR Number *</label>
                <input
                  type="text"
                  required
                  maxLength="16"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  placeholder="e.g. 431209874521"
                  className="portal-input"
                  style={{ fontSize: '1.1rem', letterSpacing: '0.1em' }}
                />
                <button type="submit" className="btn" style={{ width: '100%', marginTop: '12px' }}>
                  Verify & Confirm Registration ↗
                </button>
                <button
                  type="button"
                  className="btn ghost"
                  style={{ width: '100%', marginTop: '8px' }}
                  onClick={() => setPaymentStep('form')}
                >
                  ← Edit Participant Information
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Step 03: Confirmed Dossier Certificate */}
        {paymentStep === 'confirmed' && submittedDossier && (
          <div className="confirmed-dossier-card reveal in">
            <div className="confirmed-header">
              <div className="success-icon">✓</div>
              <div>
                <span className="mono gold">YUKTI ’27 Official Registration Docket</span>
                <h2>Registration Confirmed!</h2>
                <p>Your delegate information has been recorded locally on this system.</p>
              </div>
            </div>

            <div className="dossier-grid-details">
              <div>
                <span className="mono">Registration ID</span>
                <strong className="gold" style={{ fontSize: '1.3rem' }}>{submittedDossier.regId}</strong>
              </div>
              <div>
                <span className="mono">Competitive Arena</span>
                <strong>{submittedDossier.event}</strong>
              </div>
              <div>
                <span className="mono">Primary Delegate</span>
                <strong>{submittedDossier.name}</strong>
              </div>
              <div>
                <span className="mono">College / University</span>
                <strong>{submittedDossier.college}</strong>
              </div>
              <div>
                <span className="mono">Registered Email</span>
                <strong>{submittedDossier.email}</strong>
              </div>
              <div>
                <span className="mono">{submittedDossier.paymentMethod ? 'Gateway / Ref' : 'UPI UTR Ref'}</span>
                <strong className="gold">{submittedDossier.utr || submittedDossier.razorpayPaymentId || 'Verified'}</strong>
              </div>
            </div>

            <div className="confirmed-actions">
              <button className="btn" onClick={() => window.print()}>
                Print Verified Docket / Save as PDF ↗
              </button>
              <button
                className="btn ghost"
                onClick={() => {
                  setPaymentStep('form')
                  setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    college: '',
                    year: 'PG / MBA — 1st Year',
                    delegationType: 'Team Entry',
                    teamMembers: '',
                    specialRequirements: '',
                  })
                  setUtrNumber('')
                }}
              >
                Register Another Arena
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
