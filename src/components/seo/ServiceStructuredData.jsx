import { useEffect } from 'react'
import { SITE_EMAIL, SITE_NAME, SITE_URL } from '../../config/site'
import { WHATSAPP_PRIMARY } from '../../config/contact'

const SCRIPT_ID = 'kyrithbuilds-service-schema'

/**
 * Injects Service JSON-LD for a single service landing page.
 * @param {string} path - Route path (e.g. /bubble-developer)
 * @param {string} description - Same text as the page meta description
 */
export default function ServiceStructuredData({ path, description }) {
  useEffect(() => {
    const base = SITE_URL.replace(/\/$/, '')
    const telephone = `+${WHATSAPP_PRIMARY.href.replace(/\D/g, '')}`
    const payload = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': `${base}${path}#service`,
      name: 'Bubble developer for MVPs',
      serviceType: 'Bubble.io MVP development',
      description,
      url: `${base}${path}`,
      areaServed: 'Worldwide',
      audience: {
        '@type': 'Audience',
        audienceType: 'Founders, small teams and growing businesses',
      },
      provider: {
        '@type': 'Organization',
        '@id': `${base}/#organization`,
        name: SITE_NAME,
        url: base,
        email: SITE_EMAIL,
        telephone,
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'sales',
          telephone,
          email: SITE_EMAIL,
          availableLanguage: 'English',
        },
      },
    })

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
  }, [path, description])

  return null
}
