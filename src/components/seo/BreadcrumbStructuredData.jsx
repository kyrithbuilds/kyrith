import { useEffect } from 'react'
import { PAGE_BREADCRUMBS } from '../../config/breadcrumbs'
import { buildBreadcrumbListSchema } from '../../lib/breadcrumbSchema'
import { SITE_URL } from '../../config/site'

const SCRIPT_ID = 'kyrithbuilds-breadcrumb-schema'

/**
 * Injects BreadcrumbList JSON-LD for inner pages (not home).
 * @param {string} path - Route path (e.g. /services)
 */
export default function BreadcrumbStructuredData({ path }) {
  const crumbs = PAGE_BREADCRUMBS[path]

  useEffect(() => {
    if (!crumbs?.length) return

    const payload = JSON.stringify(buildBreadcrumbListSchema(crumbs, SITE_URL))

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
  }, [path, crumbs])

  return null
}
