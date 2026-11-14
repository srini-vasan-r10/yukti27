import React, { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { MANAGEMENT_EVENTS, CULTURAL_EVENTS, SITE_CONFIG, getSiteUrl } from '../utils/confluenceData'
import {
  isRazorpayConfigured,
  parseAmountToPaise,
  openRazorpayCheckout
} from '../utils/razorpayService'
import { submitToGoogleSheets } from '../utils/googleSheetsService'
import { submitToPostgres } from '../utils/postgresService'
import { buildUpiUri, extractNumericAmount, UPI_CONFIG } from '../utils/upiService'
import { getTeamSizeRange } from '../utils/teamSizeHelper'
import ReceiptModal from '../components/ReceiptModal'
import CustomSelect from '../components/CustomSelect'
import { generateRandomTeamName } from '../utils/teamNameGenerator'

export default function RegistrationPortalPage({ onBackToHome, onOpenPass, onReceiptModalToggle }) {
  const [selectedTrackType, setSelectedTrackType] = useState('management')
  const [selectedEventId, setSelectedEventId] = useState('the-ai-ceo-challenge')

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    teamName: '',
    year: 'PG / MBA — 1st Year',
    delegationType: 'Team Entry',
    specialRequirements: '',
  })

  // Dynamic additional team members array: [{ name: '', role: '' }]
  const [additionalMembers, setAdditionalMembers] = useState([])
  const [showAddMemberPrompt, setShowAddMemberPrompt] = useState(false)

  // Payment State: 'form' | 'qr_modal' | 'confirmed'
  const [paymentStep, setPaymentStep] = useState('form')
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [utrNumber, setUtrNumber] = useState('')
  const [submittedDossier, setSubmittedDossier] = useState(null)

  // Notify parent App when receipt modal is opened/closed to suppress footer
  useEffect(() => {
    if (onReceiptModalToggle) {
      onReceiptModalToggle(showReceiptModal)
    }
  }, [showReceiptModal, onReceiptModalToggle])

  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  // Find active selected event to compute fee & team constraints
  const allEvents = [...MANAGEMENT_EVENTS, ...CULTURAL_EVENTS]
  const currentEvent = allEvents.find(e => e.id === selectedEventId) || MANAGEMENT_EVENTS[0]
  const teamConstraints = getTeamSizeRange(currentEvent)

  // Auto-calibrate member slots based on event constraints from events.json
  useEffect(() => {
    if (!teamConstraints.isTeam || teamConstraints.max <= 1) {
      setAdditionalMembers([])
      setFormData(prev => ({ ...prev, delegationType: 'Individual Contender' }))
    } else {
      setFormData(prev => ({ ...prev, delegationType: 'Team Entry' }))
      // Pre-populate minimum required extra members (team size - 1 for primary lead)
      const minExtraNeeded = Math.max(0, teamConstraints.min - 1)
      setAdditionalMembers(prev => {
        if (prev.length < minExtraNeeded) {
          const added = []
          for (let i = prev.length; i < minExtraNeeded; i++) {
            added.push({ name: '', role: `Team Member ${i + 2}` })
          }
          return [...prev, ...added]
        }
        return prev
      })
    }
  }, [selectedEventId])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleAddMemberSlot = () => {
    const currentTotal = 1 + additionalMembers.length
    if (teamConstraints.max && currentTotal >= teamConstraints.max) {
      alert(`Maximum team size for ${currentEvent.title} is ${teamConstraints.max} members.`)
      return
    }
    setAdditionalMembers(prev => [...prev, { name: '', role: `Team Member ${prev.length + 2}` }])
    setShowAddMemberPrompt(false)
  }

  const handleRemoveMemberSlot = (index) => {
    setAdditionalMembers(prev => prev.filter((_, idx) => idx !== index))
  }

  const handleMemberChange = (index, field, value) => {
    setAdditionalMembers(prev => {
      const updated = [...prev]
      updated[index][field] = value
      return updated
    })
  }

  const handleInitiatePayment = async (e) => {
    e.preventDefault()

    // Validate minimum required team members
    const totalMembers = 1 + additionalMembers.filter(m => m.name.trim()).length
    if (teamConstraints.min && totalMembers < teamConstraints.min) {
      alert(`This event requires a minimum of ${teamConstraints.min} members. Please add ${teamConstraints.min - totalMembers} more member(s).`)
      return
    }

    // Generate Registration reference ID
    const regId = 'YK27-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase()
    
    // Save temporary record to LocalStorage
    const resolvedTeamName = formData.teamName?.trim() || generateRandomTeamName()
    const pendingRecord = {
      ...formData,
      teamName: resolvedTeamName,
      regId,
      event: currentEvent.title,
      fee: currentEvent.fee || '₹500',
      members: additionalMembers.filter(m => m.name.trim()).map(m => m.name.trim()),
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
            // Automatically sync with cloud database / sheets
            submitToGoogleSheets(confirmedRecord)
            submitToPostgres(confirmedRecord)

            setSubmittedDossier(confirmedRecord)
            setPaymentStep('confirmed')
            setShowReceiptModal(true)
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
      // Default / fallback mode: Real dynamic UPI QR modal
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

    // Automatically sync with cloud database / sheets
    submitToGoogleSheets(finalRecord)
    submitToPostgres(finalRecord)

    setSubmittedDossier(finalRecord)
    setPaymentStep('confirmed')
    setShowReceiptModal(true) // Display authentic thermal receipt modal
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
                    <CustomSelect
                      value={selectedEventId}
                      onChange={(val) => setSelectedEventId(val)}
                      options={(selectedTrackType === 'management' ? MANAGEMENT_EVENTS : CULTURAL_EVENTS).map((ev) => ({
                        value: ev.id,
                        label: ev.title,
                        badge: ev.fee || '₹500'
                      }))}
                    />
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

                  {/* Optional Team / Contingent Name with Randomizer */}
                  <div className="field-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label className="mono" style={{ margin: 0 }}>Team / Squad Name (Optional)</label>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, teamName: generateRandomTeamName() }))}
                        style={{
                          background: 'rgba(197, 155, 60, 0.15)',
                          border: '1px solid rgba(197, 155, 60, 0.35)',
                          color: '#F5D77F',
                          padding: '3px 10px',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontFamily: 'monospace',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                        title="Generate a unique team name from 100 power prefixes and 100 arena suffixes"
                      >
                        ⚡ Generate Cool Team Name
                      </button>
                    </div>
                    <input
                      type="text"
                      name="teamName"
                      value={formData.teamName}
                      onChange={handleChange}
                      placeholder="e.g. Apex Syndicate, Quantum Mavericks, or your custom name"
                      className="portal-input"
                    />
                  </div>

                  <div className="fields-row-2">
                    <div className="field-group">
                      <label className="mono">Current Academic Year</label>
                      <CustomSelect
                        value={formData.year}
                        onChange={(val) => setFormData(prev => ({ ...prev, year: val }))}
                        options={[
                          'UG — 1st / 2nd Year',
                          'UG — 3rd / 4th Year (4th Sem / Final Year)',
                          'PG / MBA — 1st Year',
                          'PG / MBA — 2nd Year',
                          'Corporate Observer'
                        ]}
                      />
                    </div>
                    <div className="field-group">
                      <label className="mono">Delegation Format</label>
                      <CustomSelect
                        value={formData.delegationType}
                        onChange={(val) => setFormData(prev => ({ ...prev, delegationType: val }))}
                        options={[
                          'Team Entry',
                          'Individual Contender',
                          'Institutional Contingent'
                        ]}
                      />
                    </div>
                  </div>

                  {/* Dynamic Team Member Management (Replaced static textarea with + / auto constraints) */}
                  {teamConstraints.isTeam && (
                    <div style={{
                      background: 'rgba(77,29,100,0.22)',
                      border: '1px solid rgba(197,155,60,0.3)',
                      borderRadius: '16px',
                      padding: '18px 20px',
                      marginTop: '6px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                        <div>
                          <span className="mono gold" style={{ fontSize: '0.72rem', letterSpacing: '0.12em' }}>TEAM COMPOSITION ROSTER</span>
                          <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '2px' }}>
                            Arena Format: <strong>{currentEvent.teamSize || currentEvent.format}</strong>
                            <span style={{ color: '#F5D77F', marginLeft: '8px' }}>({1 + additionalMembers.length} Members registered)</span>
                          </div>
                        </div>

                        {/* Add Member Button (+ Button) */}
                        {(!teamConstraints.max || (1 + additionalMembers.length) < teamConstraints.max) && (
                          <button
                            type="button"
                            onClick={handleAddMemberSlot}
                            className="btn"
                            style={{ padding: '6px 14px', fontSize: '0.76rem', background: '#1F0E2C', border: '1px solid #C59B3C' }}
                          >
                            + Add Team Member
                          </button>
                        )}
                      </div>

                      {/* Primary Lead Display */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', marginBottom: '10px', fontSize: '0.82rem' }}>
                        <span style={{ color: '#F5D77F' }}>Primary Leader:</span>
                        <strong style={{ color: '#fff' }}>{formData.name || 'Primary Delegate'}</strong>
                        <span style={{ color: '#94a3b8', fontSize: '0.72rem' }}>({formData.email || 'Email above'})</span>
                      </div>

                      {/* Additional Member Slot Inputs */}
                      {additionalMembers.map((member, index) => (
                        <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                          <input
                            type="text"
                            required
                            placeholder={`Member ${index + 2} Full Name *`}
                            value={member.name}
                            onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                            className="portal-input"
                            style={{ flex: 2, padding: '10px 12px', fontSize: '0.84rem' }}
                          />
                          <input
                            type="text"
                            placeholder="Role / Domain (e.g. Finance / Pitch)"
                            value={member.role}
                            onChange={(e) => handleMemberChange(index, 'role', e.target.value)}
                            className="portal-input"
                            style={{ flex: 1.5, padding: '10px 12px', fontSize: '0.84rem' }}
                          />
                          {(1 + additionalMembers.length) > (teamConstraints.min || 1) && (
                            <button
                              type="button"
                              onClick={() => handleRemoveMemberSlot(index)}
                              style={{
                                background: 'rgba(239, 68, 68, 0.15)',
                                border: '1px solid rgba(239, 68, 68, 0.4)',
                                color: '#f87171',
                                borderRadius: '8px',
                                width: '34px',
                                height: '34px',
                                cursor: 'pointer',
                                display: 'grid',
                                placeItems: 'center',
                                flexShrink: 0
                              }}
                              title="Remove Member"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}

                      {/* Interactive prompt if under max capacity */}
                      {(!teamConstraints.max || (1 + additionalMembers.length) < teamConstraints.max) && (
                        <div style={{ marginTop: '8px', fontSize: '0.74rem', color: '#a69cb4' }}>
                          Need to register additional squad members? Click <strong>+ Add Team Member</strong> above to add them to your official pass roster.
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn portal-submit-btn"
                    disabled={isProcessingPayment}
                    style={{ position: 'relative' }}
                  >
                    {isProcessingPayment ? (
                      'Connecting to Secure Gateway...'
                    ) : isRazorpayConfigured() ? (
                      `Pay via Razorpay (${currentEvent.fee || '₹500'})`
                    ) : (
                      `Proceed to Registration Checkout (${currentEvent.fee || '₹500'})`
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

        {/* Step 02: Interactive Real UPI QR Checkout Modal */}
        {paymentStep === 'qr_modal' && submittedDossier && (() => {
          const upiUri = buildUpiUri({
            amount: submittedDossier.fee,
            candidateName: submittedDossier.name,
            eventName: submittedDossier.event
          })
          const formattedAmount = extractNumericAmount(submittedDossier.fee)

          return (
            <div className="qr-checkout-box reveal in">
              <div className="qr-left-pane">
                <div className="mono gold" style={{ marginBottom: '8px' }}>Official UPI Payment Gateway</div>
                <h2>Scan & Pay via Any UPI App</h2>
                <p className="qr-sub">
                  Scan this dynamic QR code using <strong>Google Pay, PhonePe, Paytm, BHIM</strong>, or any bank UPI app. The exact payable fee (<strong>₹{formattedAmount}</strong>) and your delegate docket note are pre-configured automatically.
                </p>

                {/* Real Dynamic Scannable UPI QR */}
                <div className="sample-qr-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ background: '#ffffff', padding: '12px', borderRadius: '12px', display: 'inline-block' }}>
                    <QRCodeSVG
                      value={upiUri}
                      size={200}
                      level="M"
                      includeMargin={false}
                      imageSettings={{
                        src: "/yukti-logo.webp",
                        x: undefined,
                        y: undefined,
                        height: 36,
                        width: 36,
                        excavate: true,
                      }}
                    />
                  </div>

                  <div className="qr-scan-meta" style={{ marginTop: '14px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.82rem', color: '#1F0E2C', fontWeight: 600 }}>
                      Payee: <strong>{UPI_CONFIG.payeeName}</strong>
                    </div>
                    <span className="mono" style={{ fontSize: '0.78rem', color: '#4D1D64', display: 'block', marginTop: '2px' }}>
                      UPI VPA: {UPI_CONFIG.vpa}
                    </span>
                    <div className="amount-pill mono" style={{ fontSize: '1.05rem', marginTop: '6px' }}>
                      Payable: ₹{formattedAmount}
                    </div>
                    
                    {/* Direct tap to launch UPI app on mobile devices */}
                    <a
                      href={upiUri}
                      className="btn"
                      style={{
                        display: 'inline-block',
                        marginTop: '12px',
                        padding: '8px 16px',
                        fontSize: '0.78rem',
                        background: '#1F0E2C',
                        color: '#FFF2A6',
                        border: '1px solid #C59B3C',
                        borderRadius: '8px'
                      }}
                    >
                      Open UPI App Directly
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Pane: UTR Confirmation */}
              <div className="qr-right-pane">
                <div className="receipt-preview-box">
                  <span className="mono gold">Docket #{submittedDossier.regId}</span>
                  <h4>{submittedDossier.event}</h4>
                  <p>Lead: {submittedDossier.name} · {submittedDossier.college}</p>
                  <p style={{ marginTop: '6px', fontSize: '0.76rem', color: '#cbd5e1' }}>
                    <em>Note attached: "Payee : {submittedDossier.name}, Event : {submittedDossier.event}"</em>
                  </p>
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
                    Verify & Confirm Registration
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
          )
        })()}

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
              <button
                className="btn"
                style={{ background: 'linear-gradient(135deg, #FFF2A6 0%, #C59B3C 100%)', color: '#1F0E2C', fontWeight: '800' }}
                onClick={() => setShowReceiptModal(true)}
              >
                View Official Payment Receipt
              </button>
              <button
                className="btn"
                onClick={() => {
                  const siteUrl = getSiteUrl()
                  const membersList = (submittedDossier.members || []).join(',')
                  const queryParams = new URLSearchParams({
                    name: submittedDossier.name || '',
                    college: submittedDossier.college || '',
                    phone: submittedDossier.phone || '',
                    email: submittedDossier.email || '',
                    event: submittedDossier.event || '',
                    teamName: submittedDossier.teamName || submittedDossier.name + ' Contingent',
                    regId: submittedDossier.regId || '',
                    year: submittedDossier.year || '',
                    delegationType: submittedDossier.delegationType || '',
                    members: membersList,
                    fee: submittedDossier.fee || '',
                    utr: submittedDossier.utr || ''
                  })
                  window.history.pushState({}, '', `/pass?${queryParams.toString()}`)
                  if (onOpenPass) onOpenPass()
                }}
              >
                View Official Delegate Pass
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
        {/* Thermal Payment Receipt Modal (Matches user uploaded second image) */}
        {showReceiptModal && submittedDossier && (() => {
          const siteUrl = getSiteUrl()
          // Construct self-contained pass URL with query parameters including team, leader contact & event
          const membersList = (submittedDossier.members || []).join(',')
          const queryParams = new URLSearchParams({
            name: submittedDossier.name || '',
            college: submittedDossier.college || '',
            phone: submittedDossier.phone || '',
            email: submittedDossier.email || '',
            event: submittedDossier.event || '',
            teamName: submittedDossier.teamName || submittedDossier.name + ' Contingent',
            regId: submittedDossier.regId || '',
            year: submittedDossier.year || '',
            delegationType: submittedDossier.delegationType || '',
            members: membersList,
            fee: submittedDossier.fee || '',
            utr: submittedDossier.utr || ''
          })
          const passFullUrl = `${siteUrl}/pass?${queryParams.toString()}`

          return (
            <ReceiptModal
              dossier={submittedDossier}
              passUrl={passFullUrl}
              onOpenPass={() => {
                setShowReceiptModal(false)
                window.history.pushState({}, '', passFullUrl)
                if (onOpenPass) onOpenPass()
              }}
              onClose={() => setShowReceiptModal(false)}
            />
          )
        })()}
      </div>
    </div>
  )
}
