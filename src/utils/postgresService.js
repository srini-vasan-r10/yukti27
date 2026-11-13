/**
 * PostgreSQL / Supabase Integration Service for YUKTI '27
 * 
 * Provides direct connection to a PostgreSQL database (e.g. via Supabase REST API).
 * Enables querying, viewing, and exporting delegate data.
 */

export const isPostgresConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY
  return Boolean(url && key && url.trim() !== '' && key.trim() !== '')
}

/**
 * Inserts a registration dossier into the PostgreSQL / Supabase 'registrations' table
 */
export const submitToPostgres = async (dossier) => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!isPostgresConfigured()) {
    return { success: false, reason: 'unconfigured' }
  }

  const payload = {
    reg_id: dossier.regId,
    event_title: dossier.event,
    fee_amount: dossier.fee,
    lead_name: dossier.name,
    email: dossier.email,
    phone: dossier.phone,
    college: dossier.college,
    academic_year: dossier.year,
    delegation_type: dossier.delegationType,
    team_members: dossier.teamMembers,
    special_requirements: dossier.specialRequirements,
    payment_method: dossier.paymentMethod || 'UPI QR',
    transaction_ref: dossier.utr || dossier.razorpayPaymentId || '',
    status: dossier.status || 'Confirmed'
  }

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/registrations`, {
      method: 'POST',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(payload)
    })

    if (!res.ok) {
      const errText = await res.text()
      throw new Error(`Database error: ${res.status} - ${errText}`)
    }

    console.log('✅ Registration successfully recorded in PostgreSQL database!')
    return { success: true }
  } catch (err) {
    console.error('Error posting to PostgreSQL database:', err)
    return { success: false, error: err }
  }
}
