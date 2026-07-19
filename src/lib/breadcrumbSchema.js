/**
 * Build BreadcrumbList JSON-LD (Google Rich Results compatible).
 * @see https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
 */

/**
 * @param {{ name: string, path: string }[]} crumbs
 * @param {string} siteUrl - e.g. https://kyrithbuilds.com
 */
export function buildBreadcrumbListSchema(crumbs, siteUrl) {
  const base = siteUrl.replace(/\/$/, '')

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => {
      const path = crumb.path.startsWith('/') ? crumb.path : `/${crumb.path}`
      const itemUrl = path === '/' ? `${base}/` : `${base}${path}`

      return {
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: itemUrl,
      }
    }),
  }
}
