/**
 * YUKTI '27 — Automated Sitemap & Robots.txt Generator
 * 
 * Generates:
 * 1. sitemap.xml: Canonical XML sitemap with all public routes & lastmod dates
 * 2. robots.txt: Dynamically configured based on staging vs production:
 *    - In Staging: Disallow: / & noindex
 *    - In Production: Allow: / & Sitemap reference
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const distDir = path.resolve(__dirname, 'dist')
const publicDir = path.resolve(__dirname, 'public')

const siteUrl = (process.env.VITE_SITE_URL || 'https://yukti27.tsm.ac.in').replace(/\/$/, '')
const isStaging = process.env.VITE_IS_STAGING === 'true'

const today = new Date().toISOString().split('T')[0]

// Public-facing routes with priority & change frequency
const routes = [
  { url: '', priority: '1.0', changefreq: 'weekly' },
  { url: '/events/management', priority: '0.9', changefreq: 'weekly' },
  { url: '/events/cultural', priority: '0.9', changefreq: 'weekly' },
  { url: '/register', priority: '0.9', changefreq: 'daily' },
  { url: '/sponsors', priority: '0.7', changefreq: 'monthly' },
]

// 1. Generate Sitemap XML
const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${routes.map(r => `  <url>
    <loc>${siteUrl}${r.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
    <image:image>
      <image:loc>${siteUrl}/og-image.webp</image:loc>
      <image:title>YUKTI ’27 — National Management &amp; Cultural Fest</image:title>
    </image:image>
  </url>`).join('\n')}
</urlset>`

// Write sitemap.xml to both public and dist (if dist exists)
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapContent, 'utf-8')
if (fs.existsSync(distDir)) {
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapContent, 'utf-8')
}
console.log('✅ Generated sitemap.xml')

// 2. Generate Robots.txt
let robotsContent = ''
if (isStaging) {
  // Staging protection: completely disallow crawlers
  robotsContent = `# Staging Environment Protection (Vercel Preview / Pre-launch)
User-agent: *
Disallow: /
`
} else {
  // Production configuration: permit crawlers & point to sitemap
  robotsContent = `# Production Robots Configuration for YUKTI '27
User-agent: *
Allow: /
Disallow: /admin
Disallow: /committee

Sitemap: ${siteUrl}/sitemap.xml
`
}

fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsContent, 'utf-8')
if (fs.existsSync(distDir)) {
  fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsContent, 'utf-8')
}
console.log(`✅ Generated robots.txt (${isStaging ? 'STAGING DISALLOWED' : 'PRODUCTION ALLOWED'})`)
