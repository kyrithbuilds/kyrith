import { useEffect } from 'react'
import { buildFaqPageSchema } from '../../lib/faqSchema'
import { SITE_URL } from '../../config/site'

const SCRIPT_ID = 'kyrithbuilds-faq-schema'

/**
 * Injects FAQPage JSON-LD for pages with visible FAQ sections.
 * @param {string} path - Route path (e.g. /services)
 * @param {{ question: string, answer: string }[]} faqs
 */
export default function FaqPageStructuredData({ path, faqs }) {
  useEffect(() => {
    if (!faqs?.length) return

    const base = SITE_URL.replace(/\/$/, '')
    const pageUrl = `${base}${path.startsWith('/') ? path : `/${path}`}`
    const payload = JSON.stringify(buildFaqPageSchema(faqs, pageUrl))

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
  }, [path, faqs])

  return null
}
