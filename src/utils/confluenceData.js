import eventsDataset from '../../public/events.json'

// ====================================================================
// YUKTI '27 — CENTRALIZED DOMAIN & SEO CONFIGURATION
// ====================================================================
// Domain Independence:
// Uses VITE_SITE_URL if configured.
// Automatically falls back to window.location.origin during browser runtime,
// and defaults to the intended custom domain or staging URL.
// ====================================================================

const ENV_SITE_URL = import.meta.env.VITE_SITE_URL || ''
const IS_PROD_ENV = import.meta.env.PROD
const IS_STAGING_ENV = import.meta.env.VITE_IS_STAGING === 'true'

export const getSiteUrl = () => {
  if (ENV_SITE_URL && ENV_SITE_URL.trim() !== '') {
    return ENV_SITE_URL.replace(/\/$/, '')
  }
  if (typeof window !== 'undefined' && window.location.origin) {
    return window.location.origin.replace(/\/$/, '')
  }
  // Production default fallback (easily overridden via .env VITE_SITE_URL)
  return 'https://yukti27.tsm.ac.in'
}

/**
 * Checks if current environment is staging
 * Staging environments protect against accidental search engine indexing
 */
export const isStagingEnvironment = () => {
  if (IS_STAGING_ENV) return true
  if (typeof window !== 'undefined') {
    const host = window.location.hostname
    if (host.includes('vercel.app') || host.includes('netlify.app') || host.includes('localhost') || host === '127.0.0.1') {
      return true
    }
  }
  return false
}

export const SITE_CONFIG = {
  edition: "2027",
  title: "YUKTI ’27 — National Management Fest | TSM Madurai",
  shortTitle: "YUKTI ’27",
  theme: "INTANGIBLES",
  tagline: "INFINITE POSSIBILITIES",
  subcaption: "Pan-India Management & Cultural Fest",
  institution: "Thiagarajar School of Management (TSM)",
  location: "Thiruparankundram, Madurai, Tamil Nadu, India",
  pinCode: "625005",
  grandPrizePool: "₹20,00,000",
  rawPrize: "20,00,000",
  dates: "January 28, 29 & 30, 2027",
  isoStartDate: "2027-01-28T09:00:00+05:30",
  isoEndDate: "2027-01-30T19:00:00+05:30",
  venue: "TSM Campus, Thiruparankundram, Madurai, Tamil Nadu 625005",
  portalUrl: "yukti27.tsm.ac.in",
  organizerUrl: "https://tsm.ac.in",
  email: "yukti@tsm.ac.in",
  socialHandle: "@yukti.tsm",
  socialLinks: {
    youtube: "https://www.youtube.com/@ThiagarajarSchoolofManagement",
    twitter: "https://x.com/tsmmadurai",
    linkedin: "https://www.linkedin.com/school/thiagarajar-school-of-management/",
    instagram: "https://instagram.com/yukti.tsm",
    facebook: "https://www.facebook.com/tsmmadurai/"
  },
  metaDescription: "Join YUKTI ’27 at Thiagarajar School of Management (TSM), Madurai. Compete in 12 national management & cultural arenas for a ₹20 Lakh bounty pool.",
  stats: {
    prizePool: "₹20,00,000",
    institutions: "60+ Premier B-Schools",
    delegates: "1,800+ National Leaders",
    tracks: "12 Competitive Arenas"
  },
  aboutQuote: "Exploring the human-AI nexus, celebrating the core values of innovation and creativity. Where logic meets magic and human intuition collaborates with artificial intelligence to shape the next era of enterprise leadership."
};

export const SPONSORS_DATA = [
  { name: "Thangamayil", logoImg: "/sponsors/thangamayil.png", type: "Gold Partner", color: "#F5D77F", bg: "rgba(255,255,255,0.06)" },
  { name: "HDFC Credila", logoImg: "/sponsors/hdfc credilla.png", type: "Education Loan Partner", color: "#FFF2A6", bg: "rgba(255,255,255,0.06)" },
  { name: "Bank of Baroda", logoImg: "/sponsors/bob.png", type: "Banking Partner", color: "#C59B3C", bg: "rgba(255,255,255,0.06)" },
  { name: "Federal Bank", logoImg: "/sponsors/federal.png", type: "Associate Partner", color: "#FFF2A6", bg: "rgba(255,255,255,0.06)" },
  { name: "State Bank of India", logoImg: "/sponsors/sbi.png", type: "Banking Partner", color: "#F5D77F", bg: "rgba(255,255,255,0.06)" },
  { name: "Pepsi", logoImg: "/sponsors/pepsi.png", type: "Beverage Partner", color: "#FFF2A6", bg: "rgba(255,255,255,0.06)" },
  { name: "Red Taxi", logoImg: "/sponsors/red taxi.png", type: "Mobility Partner", color: "#F5D77F", bg: "rgba(255,255,255,0.06)" },
  { name: "Greenlight", logoImg: "/sponsors/greenlight.png", type: "Photography Partner", color: "#C59B3C", bg: "rgba(255,255,255,0.06)" },
  { name: "Hotel Arasan Sapthagiri", logoImg: "/sponsors/hotel arasan saptagiri.png", type: "Hospitality Partner", color: "#F5D77F", bg: "rgba(255,255,255,0.06)" },
  { name: "TAPL", logoImg: "/sponsors/tapl.png", type: "Corporate Sponsor", color: "#FFF2A6", bg: "rgba(255,255,255,0.06)" },
  { name: "Star Guru", logoImg: "/sponsors/starguru.png", type: "Talent Partner", color: "#F5D77F", bg: "rgba(255,255,255,0.06)" },
  { name: "ARS HTA", logoImg: "/sponsors/ars hta.png", type: "Logistics Partner", color: "#C59B3C", bg: "rgba(255,255,255,0.06)" },
  { name: "Ramachandra", logoImg: "/sponsors/ramachandra.png", type: "Retail Partner", color: "#F5D77F", bg: "rgba(255,255,255,0.06)" },
  { name: "Anuj", logoImg: "/sponsors/anuj.png", type: "Merchandise Partner", color: "#FFF2A6", bg: "rgba(255,255,255,0.06)" }
];

export const MANAGEMENT_EVENTS = eventsDataset.filter(ev => ev.type === 'man');

export const CULTURAL_EVENTS = eventsDataset.filter(ev => ev.type === 'cul');
