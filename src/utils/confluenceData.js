import eventsDataset from '../../public/events.json'

// YUKTI '27 - Official Confluence Knowledge Base & Config

export const SITE_CONFIG = {
  edition: "2027",
  title: "YUKTI ’27",
  theme: "INTANGIBLES",
  tagline: "INFINITE POSSIBILITIES",
  subcaption: "Pan-India Management & Cultural Fest",
  institution: "Thiagarajar School of Management (TSM), Madurai",
  grandPrizePool: "₹20,00,000",
  rawPrize: "20,00,000",
  dates: "January 28, 29 & 30, 2027",
  venue: "TSM Campus, Madurai, Tamil Nadu, India",
  portalUrl: "yukti27.tsm.ac.in",
  email: "yukti@tsm.ac.in",
  socialHandle: "@yukti_tsm",
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

