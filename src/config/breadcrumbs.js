/**
 * Breadcrumb trails for inner pages (matches navbar/footer hierarchy).
 * Home is always first; current page is last.
 */

const HOME = { name: 'Home', path: '/' }

/** @type {Record<string, { name: string, path: string }[]>} */
export const PAGE_BREADCRUMBS = {
  '/services': [HOME, { name: 'Services', path: '/services' }],
  '/about': [HOME, { name: 'About Us', path: '/about' }],
  '/contact': [HOME, { name: 'Contact', path: '/contact' }],
  '/privacy': [HOME, { name: 'Privacy Policy', path: '/privacy' }],
  '/terms': [HOME, { name: 'Terms of Service', path: '/terms' }],
}
