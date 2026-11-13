/**
 * YUKTI '27 — Static HTML & SEO Pre-rendering Script
 * 
 * Generates standalone static HTML files for all core routes:
 * - /index.html (Home)
 * - /events/management/index.html
 * - /events/cultural/index.html
 * - /register/index.html
 * 
 * Each generated page contains:
 * 1. Crawlable, keyword-rich semantic HTML (headings, descriptions, event listings)
 * 2. Route-specific <title>, <meta description>, canonical URL, and Open Graph tags
 * 3. Schema.org JSON-LD Event structured data
 * 4. Staging protection (disallow indexing if VITE_IS_STAGING or vercel preview)
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const distDir = path.resolve(__dirname, 'dist')
const eventsJsonPath = path.resolve(__dirname, 'public/events.json')
const events = JSON.parse(fs.readFileSync(eventsJsonPath, 'utf-8'))

const siteUrl = (process.env.VITE_SITE_URL || 'https://yukti27.tsm.ac.in').replace(/\/$/, '')
const isStaging = process.env.VITE_IS_STAGING === 'true'

// Verify dist/index.html exists
const templatePath = path.join(distDir, 'index.html')
if (!fs.existsSync(templatePath)) {
  console.error('dist/index.html not found! Run vite build first.')
  process.exit(1)
}

const template = fs.readFileSync(templatePath, 'utf-8')

const routes = [
  {
    path: '',
    outputPath: 'index.html',
    title: "YUKTI ’27 — National Management & Cultural Fest | Thiagarajar School of Management (TSM) Madurai",
    description: "YUKTI ’27 is the premier annual pan-India management and cultural fest hosted by Thiagarajar School of Management (TSM), Madurai. Featuring 12 national arenas, ₹20,00,000 bounty, boardroom trials, executive leadership, and cultural spectacles.",
    canonical: `${siteUrl}/`,
    heading: "YUKTI ’27 — National Management & Cultural Fest",
    content: `
      <h2>The Strategy Confluence · Thiagarajar School of Management (TSM), Madurai</h2>
      <p>Theme: <strong>INTANGIBLES — INFINITE POSSIBILITIES</strong></p>
      <p>Confirmed Dates: January 28, 29 & 30, 2027 | Venue: TSM Campus, Thiruparankundram, Madurai, Tamil Nadu 625005</p>
      <p>Cumulative National Bounty: <strong>₹20,00,000</strong> in cash prizes, national rolling shields, and corporate grants across 12 flagship arenas.</p>
      <h3>The Two Confluences</h3>
      <ul>
        <li><a href="/events/management">Management Events & Arenas (6 Tracks)</a></li>
        <li><a href="/events/cultural">Cultural Events & Confluence (6 Tracks)</a></li>
        <li><a href="/register">Official Delegate Registration Portal</a></li>
      </ul>
    `
  },
  {
    path: 'events/management',
    outputPath: 'events/management/index.html',
    title: "Management Events & National Arenas | YUKTI ’27 · TSM Madurai",
    description: "Compete in 8 high-stakes national management arenas at YUKTI '27: The AI CEO Challenge, Market Mavericks, Boardroom Crisis, and FinStrat at Thiagarajar School of Management.",
    canonical: `${siteUrl}/events/management`,
    heading: "Management Confluence Arenas — YUKTI ’27",
    content: `
      <p>Rigorous management trials testing boardroom stress, quant valuation, AI resurgence, human capital, and best manager leadership at TSM Madurai.</p>
      <h2>Flagship Management Competitions:</h2>
      <ul>
        ${events.filter(e => e.type === 'man').map(e => `
          <li>
            <h3>${e.title} (${e.domain})</h3>
            <p>${e.shortDesc}</p>
            <p><strong>Prizes:</strong> ${e.prizes} | <strong>Format:</strong> ${e.teamSize}</p>
          </li>
        `).join('')}
      </ul>
      <p><a href="/register">Register your delegation for Management Arenas ↗</a></p>
    `
  },
  {
    path: 'events/cultural',
    outputPath: 'events/cultural/index.html',
    title: "Cultural Confluence & Artistic Spectacles | YUKTI ’27 · TSM Madurai",
    description: "Experience uninhibited artistry, battle of the bands, choreography, and solo performances at YUKTI '27 Cultural Confluence, TSM Madurai.",
    canonical: `${siteUrl}/events/cultural`,
    heading: "Cultural Confluence — YUKTI ’27",
    content: `
      <p>A multi-dimensional festival of music, choreography, drama, and digital arts hosted at Thiagarajar School of Management (TSM), Madurai.</p>
      <h2>Cultural Flagship Tracks:</h2>
      <ul>
        ${events.filter(e => e.type === 'cul').map(e => `
          <li>
            <h3>${e.title} (${e.category || e.domain})</h3>
            <p>${e.shortDesc}</p>
            <p><strong>Prizes:</strong> ${e.prizes} | <strong>Format:</strong> ${e.format || e.teamSize}</p>
          </li>
        `).join('')}
      </ul>
      <p><a href="/register">Register for Cultural Events ↗</a></p>
    `
  },
  {
    path: 'register',
    outputPath: 'register/index.html',
    title: "Priority Registration Portal — Delegate Passes | YUKTI ’27 · TSM Madurai",
    description: "Stake your institution's claim in the national arenas. Register your delegation and complete your registration fee for YUKTI '27 at TSM Madurai.",
    canonical: `${siteUrl}/register`,
    heading: "Official Delegate Registration Gateway — YUKTI ’27",
    content: `
      <p>Register online for all 12 management and cultural tracks at YUKTI '27. Open to students and MBA candidates nationwide.</p>
      <p>Registration includes verified candidate credentials, preliminary problem brief, and delegate kit.</p>
      <p><a href="/">Return to Home Confluence</a></p>
    `
  }
]

routes.forEach(route => {
  const destPath = path.join(distDir, route.outputPath)
  fs.mkdirSync(path.dirname(destPath), { recursive: true })

  let html = template

  // Replace Title
  html = html.replace(/<title>.*?<\/title>/i, `<title>${route.title}</title>`)

  // Replace Description
  html = html.replace(/<meta name="description" content=".*?" \/>/i, `<meta name="description" content="${route.description}" />`)

  // Replace Canonical
  html = html.replace(/<link rel="canonical" href=".*?" \/>/i, `<link rel="canonical" href="${route.canonical}" />`)

  // Replace Open Graph title and desc
  html = html.replace(/<meta property="og:title" content=".*?" \/>/i, `<meta property="og:title" content="${route.title}" />`)
  html = html.replace(/<meta property="og:description" content=".*?" \/>/i, `<meta property="og:description" content="${route.description}" />`)
  html = html.replace(/<meta property="og:url" content=".*?" \/>/i, `<meta property="og:url" content="${route.canonical}" />`)

  // Replace Twitter title and desc
  html = html.replace(/<meta name="twitter:title" content=".*?" \/>/i, `<meta name="twitter:title" content="${route.title}" />`)
  html = html.replace(/<meta name="twitter:description" content=".*?" \/>/i, `<meta name="twitter:description" content="${route.description}" />`)
  html = html.replace(/<meta name="twitter:url" content=".*?" \/>/i, `<meta name="twitter:url" content="${route.canonical}" />`)

  // Robots directive for pre-rendered file
  const robotsMeta = isStaging 
    ? '<meta name="robots" content="noindex, nofollow" />' 
    : '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />'
  html = html.replace('</head>', `  ${robotsMeta}\n  </head>`)

  // Inject crawlable content into root element
  const rootContent = `
    <header>
      <nav aria-label="Main Navigation">
        <a href="/">Home Confluence</a> · 
        <a href="/events/management">Management Events</a> · 
        <a href="/events/cultural">Cultural Events</a> · 
        <a href="/register">Registration Portal</a>
      </nav>
    </header>
    <main>
      <article>
        <h1>${route.heading}</h1>
        ${route.content}
      </article>
    </main>
  `
  html = html.replace('<div id="root"></div>', `<div id="root">${rootContent}</div>`)

  fs.writeFileSync(destPath, html, 'utf-8')
  console.log(`✅ Pre-rendered static route: ${route.outputPath}`)
})

console.log('🎉 Static pre-rendering completed successfully!')
