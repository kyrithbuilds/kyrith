import { useEffect } from 'react'
import { WHATSAPP_NUMBERS } from '../../config/contact'
import { SITE_EMAIL, SITE_NAME, SITE_TAGLINE, SITE_URL } from '../../config/site'
// import { LINKEDIN_URL } from '../../config/site'

const SCRIPT_ID = 'kyrithbuilds-structured-data'

function buildSchema() {
  const base = SITE_URL.replace(/\/$/, '')
  const logo = `${base}/android-chrome-512x512.png`

  const organization = {
    '@type': 'Organization',
    '@id': `${base}/#organization`,
    name: SITE_NAME,
    url: base,
    logo,
    description: SITE_TAGLINE,
    email: SITE_EMAIL,
    sameAs: [...WHATSAPP_NUMBERS.map((n) => n.href)],
    // sameAs: [LINKEDIN_URL, ...WHATSAPP_NUMBERS.map((n) => n.href)],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: SITE_EMAIL,
        telephone: WHATSAPP_NUMBERS[0].display,
        availableLanguage: ['English'],
      },
    ],
  }

  const website = {
    '@type': 'WebSite',
    '@id': `${base}/#website`,
    url: base,
    name: SITE_NAME,
    description: SITE_TAGLINE,
    publisher: { '@id': `${base}/#organization` },
    inLanguage: 'en-US',
  }

  const localBusiness = {
    '@type': 'ProfessionalService',
    '@id': `${base}/#business`,
    name: SITE_NAME,
    url: base,
    image: logo,
    description: SITE_TAGLINE,
    email: SITE_EMAIL,
    telephone: WHATSAPP_NUMBERS[0].display,
    areaServed: 'Worldwide',
    priceRange: '$$',
    sameAs: [...WHATSAPP_NUMBERS.map((n) => n.href)],
    // sameAs: [LINKEDIN_URL],
    knowsAbout: [
      'Custom software development',
      'Workflow automation',
      'Bubble.io development',
      'MVP development',
      'Web applications',
      'Internal tools',
    ],
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [organization, website, localBusiness],
  }
}

export default function StructuredData() {
  useEffect(() => {
    const payload = JSON.stringify(buildSchema())
    let script = document.getElementById(SCRIPT_ID)
    if (!script) {
      script = document.createElement('script')
      script.id = SCRIPT_ID
      script.type = 'application/ld+json'
      document.head.appendChild(script)
    }
    script.textContent = payload
    return () => {
      script?.remove()
    }
  }, [])

  return null
}
