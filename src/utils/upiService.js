/**
 * Dynamic UPI URI Generator & QR Helper for YUKTI '27
 * 
 * Target VPA: sv100204-1@okaxis (Srinivasan R)
 * Context Link Format:
 * upi://pay?pa=sv100204-1@okaxis&pn=Srinivasan%20R&am=...&cu=INR&tn=...
 * 
 * Note Format:
 * Payee : $Registering_Candidate_Name, Event : $Event_Name
 */

export const UPI_CONFIG = {
  vpa: 'sv100204-1@okaxis',
  payeeName: 'Srinivasan R',
  currency: 'INR'
}

/**
 * Extracts numeric fee float from strings like "₹500", "₹1,500 per team", 500
 */
export const extractNumericAmount = (feeStr) => {
  if (typeof feeStr === 'number') return feeStr.toFixed(2)
  if (!feeStr) return '500.00'
  const numeric = String(feeStr).replace(/[^0-9.]/g, '')
  const parsed = parseFloat(numeric)
  return isNaN(parsed) ? '500.00' : parsed.toFixed(2)
}

/**
 * Builds the official UPI deep-link URI
 * @param {Object} params
 * @param {string|number} params.amount - Numeric fee e.g. "500" or "500.00"
 * @param {string} params.candidateName - Name of the registering candidate
 * @param {string} params.eventName - Registered competition name
 * @returns {string} upi://pay?...
 */
export const buildUpiUri = ({ amount, candidateName, eventName }) => {
  const formattedAmount = extractNumericAmount(amount)
  const safeName = (candidateName || 'Delegate').trim()
  const safeEvent = (eventName || 'YUKTI 27 Arena').trim()
  
  // Format requested: "Payee : $Registering_Candidate_Name, Event : $Event_Name"
  const noteRaw = `Payee : ${safeName}, Event : ${safeEvent}`
  const encodedNote = encodeURIComponent(noteRaw)
  const encodedPayeeName = encodeURIComponent(UPI_CONFIG.payeeName)

  return `upi://pay?pa=${UPI_CONFIG.vpa}&pn=${encodedPayeeName}&am=${formattedAmount}&cu=${UPI_CONFIG.currency}&tn=${encodedNote}`
}
