/**
 * Google Sheets / Apps Script Webhook Integration Service for YUKTI '27
 * 
 * Automatically sends verified registration & payment data to a Google Sheet.
 * Free, real-time, zero server maintenance.
 */

export const isGoogleSheetsConfigured = () => {
  const url = import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL
  return Boolean(url && url.trim() !== '' && url.startsWith('http'))
}

/**
 * Sends a registration record to the Google Apps Script Webhook
 * @param {Object} dossier - Complete registration & payment record
 */
export const submitToGoogleSheets = async (dossier) => {
  const webhookUrl = import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL
  if (!webhookUrl) {
    console.warn('Google Sheets Webhook URL is not configured. Saving locally only.')
    return { success: false, reason: 'unconfigured' }
  }

  const payload = {
    timestamp: dossier.timestamp || new Date().toISOString(),
    regId: dossier.regId || '',
    event: dossier.event || '',
    fee: dossier.fee || '',
    name: dossier.name || '',
    email: dossier.email || '',
    phone: dossier.phone || '',
    college: dossier.college || '',
    year: dossier.year || '',
    delegationType: dossier.delegationType || '',
    teamMembers: dossier.teamMembers || '',
    specialRequirements: dossier.specialRequirements || '',
    paymentMethod: dossier.paymentMethod || 'UPI QR',
    utr: dossier.utr || dossier.razorpayPaymentId || '',
    status: dossier.status || 'Confirmed'
  }

  try {
    // Mode 'no-cors' allows posting across domains to Google Apps Script endpoints seamlessly
    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      mode: 'no-cors'
    })
    console.log('✅ Registration successfully posted to Google Sheets webhook!')
    return { success: true }
  } catch (err) {
    console.error('Error sending registration to Google Sheets:', err)
    return { success: false, error: err }
  }
}
