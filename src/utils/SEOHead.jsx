import React from 'react'
import { Helmet } from 'react-helmet-async'
import { SITE_CONFIG, getSiteUrl, isStagingEnvironment } from './confluenceData'
import eventsDataset from '../../public/events.json'

/**
 * SEOHead Component
 * Manages dynamic page titles, descriptions, canonical URLs,
 * Open Graph, Twitter Cards, robots directives, and JSON-LD structured data.
 */
export default function SEOHead({
  title,
  description,
  path = '',
  image = '/og-image.webp',
  article = false,
  eventSchema = false,
  subEvents = null
}) {
  const siteUrl = getSiteUrl()
  const cleanPath = path ? (path.startsWith('/') ? path : `/${path}`) : ''
  const canonicalUrl = `${siteUrl}${cleanPath}`
  const fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`
  const metaTitle = title ? `${title} | ${SITE_CONFIG.shortTitle} · TSM Madurai` : SITE_CONFIG.title
  const metaDesc = description || SITE_CONFIG.metaDescription
  const isStaging = isStagingEnvironment()

  // Generate Event Schema (JSON-LD) with SubEvents
  let structuredData = null
  if (eventSchema) {
    const rawSubEvents = subEvents || eventsDataset
    const formattedSubEvents = rawSubEvents.map(ev => ({
      "@type": "Event",
      "name": `${ev.title} — YUKTI ’27 Arena`,
      "description": ev.shortDesc || `${ev.domain || ev.category} competition at YUKTI '27.`,
      "startDate": SITE_CONFIG.isoStartDate,
      "endDate": SITE_CONFIG.isoEndDate,
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
      "eventStatus": "https://schema.org/EventScheduled",
      "location": {
        "@type": "Place",
        "name": "Thiagarajar School of Management (TSM)",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Thiruparankundram",
          "addressLocality": "Madurai",
          "addressRegion": "Tamil Nadu",
          "postalCode": "625005",
          "addressCountry": "IN"
        }
      },
      "offers": {
        "@type": "Offer",
        "price": ev.fee ? ev.fee.replace(/[^0-9]/g, '') || "500" : "500",
        "priceCurrency": "INR",
        "url": `${siteUrl}/register`,
        "availability": "https://schema.org/InStock",
        "validFrom": "2026-11-01"
      }
    }))

    structuredData = {
      "@context": "https://schema.org",
      "@type": "Event",
      "name": "YUKTI ’27 — National Management & Cultural Fest",
      "alternateName": "YUKTI 2027 TSM Madurai",
      "description": SITE_CONFIG.metaDescription,
      "startDate": SITE_CONFIG.isoStartDate,
      "endDate": SITE_CONFIG.isoEndDate,
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
      "eventStatus": "https://schema.org/EventScheduled",
      "location": {
        "@type": "Place",
        "name": "Thiagarajar School of Management (TSM) Campus",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "P.B. No. 50, Thiruparankundram",
          "addressLocality": "Madurai",
          "addressRegion": "Tamil Nadu",
          "postalCode": "625005",
          "addressCountry": "IN"
        }
      },
      "image": [
        `${siteUrl}/og-image.webp`,
        `${siteUrl}/og-image.png`,
        `${siteUrl}/yukti-logo.webp`
      ],
      "organizer": {
        "@type": "CollegeOrUniversity",
        "name": "Thiagarajar School of Management",
        "url": SITE_CONFIG.organizerUrl,
        "logo": `${siteUrl}/tsm-logo.webp`,
        "sameAs": [
          "https://tsm.ac.in",
          "https://instagram.com/yukti.tsm"
        ]
      },
      "offers": {
        "@type": "Offer",
        "url": `${siteUrl}/register`,
        "price": "500",
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock",
        "validFrom": "2026-11-01"
      },
      "subEvent": formattedSubEvents
    }
  }

  return (
    <Helmet>
      {/* Title & Description */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDesc} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Indexing Protection (Disallow staging / allow production) */}
      {isStaging ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={article ? 'article' : 'website'} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="YUKTI ’27 · TSM Madurai" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content={fullImageUrl} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  )
}
