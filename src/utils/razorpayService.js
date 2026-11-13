/**
 * Razorpay Payment Gateway Integration Service for YUKTI '27
 * 
 * Configured with seamless environment variable fallback.
 * When VITE_RAZORPAY_KEY_ID is provided in .env / Vercel Environment Variables,
 * the real Razorpay Checkout modal loads.
 * Otherwise, it smoothly falls back to mock/manual UPI QR mode with clear guidance.
 */

// Dynamically load Razorpay standard checkout script if not already present
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

// Check if Razorpay keys are configured
export const isRazorpayConfigured = () => {
  const key = import.meta.env.VITE_RAZORPAY_KEY_ID
  return Boolean(key && key.trim() !== '' && key !== 'rzp_test_placeholder')
}

export const getRazorpayKey = () => {
  return import.meta.env.VITE_RAZORPAY_KEY_ID || ''
}

/**
 * Parses fee strings like "₹500", "₹1,500", 500 into integer paise for Razorpay
 */
export const parseAmountToPaise = (feeStr) => {
  if (typeof feeStr === 'number') return feeStr * 100
  if (!feeStr) return 50000 // default 500 INR in paise
  const numeric = String(feeStr).replace(/[^0-9]/g, '')
  const parsed = parseInt(numeric, 10)
  return isNaN(parsed) ? 50000 : parsed * 100
}

/**
 * Initiates Razorpay Checkout
 * @param {Object} options
 * @param {string} options.amount - Amount in paise (e.g. 50000 for ₹500)
 * @param {string} options.name - Participant name
 * @param {string} options.email - Participant email
 * @param {string} options.phone - Participant phone
 * @param {string} options.eventTitle - Arena title
 * @param {string} options.regId - Generated docket reference ID
 * @param {Function} options.onSuccess - Callback receiving { paymentId, orderId, signature }
 * @param {Function} options.onDismiss - Callback on checkout close/dismiss
 */
export const openRazorpayCheckout = async ({
  amount,
  name,
  email,
  phone,
  eventTitle,
  regId,
  onSuccess,
  onDismiss
}) => {
  const isLoaded = await loadRazorpayScript()
  if (!isLoaded) {
    throw new Error('Razorpay SDK failed to load. Please check your internet connection.')
  }

  const keyId = getRazorpayKey()
  if (!keyId) {
    throw new Error('Razorpay Key ID is not configured.')
  }

  const options = {
    key: keyId,
    amount: amount, // in currency subunits (paise)
    currency: 'INR',
    name: "YUKTI '27 · TSM MADURAI",
    description: `Registration Fee: ${eventTitle}`,
    image: '/yukti-logo.png',
    handler: function (response) {
      if (onSuccess) {
        onSuccess({
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id || null,
          signature: response.razorpay_signature || null,
        })
      }
    },
    prefill: {
      name: name || '',
      email: email || '',
      contact: phone || '',
    },
    notes: {
      docket_id: regId,
      arena: eventTitle,
      college: 'Thiagarajar School of Management',
    },
    theme: {
      color: '#4D1D64', // Deep Royal Purple brand theme
    },
    modal: {
      ondismiss: function () {
        if (onDismiss) onDismiss()
      }
    }
  }

  const rzp = new window.Razorpay(options)
  rzp.on('payment.failed', function (response) {
    console.error('Razorpay payment failed:', response.error)
    alert(`Payment could not be completed: ${response.error.description || 'Transaction declined'}`)
  })
  rzp.open()
}
