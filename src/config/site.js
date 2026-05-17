/** Site-wide constants for SEO, schema, and contact. */
export const SITE_NAME = 'KyrithBuilds'
export const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://kyrithbuilds.com'
export const SITE_EMAIL = 'info@kyrithbuilds.com'
export const SITE_TAGLINE =
  'Custom software, automations, Bubble apps, MVPs, and internal tools for growing businesses.'
// Re-enable when LinkedIn profile is ready:
// export const LINKEDIN_URL = 'https://www.linkedin.com/company/kyrithbuilds'

export const PAGE_SEO = {
  home: {
    title: 'Custom Software & Automation Studio | KyrithBuilds',
    description:
      'KyrithBuilds builds custom software, workflow automations, Bubble apps, MVPs, and internal tools so your team ships faster with less manual work.',
    path: '/',
  },
  services: {
    title: 'Software Development Services | KyrithBuilds',
    description:
      'Software development services including custom apps, web applications, Bubble and no-code MVPs, automations, integrations, and long-term support.',
    path: '/services',
  },
  about: {
    title: 'About KyrithBuilds | Practical Software Solutions',
    description:
      'Learn how KyrithBuilds helps businesses solve real operational problems with practical software, automations, and integrations, not bloated roadmaps.',
    path: '/about',
  },
  contact: {
    title: 'Contact KyrithBuilds',
    description:
      'Contact KyrithBuilds about MVPs, custom software, Bubble builds, automations, and internal tools. We reply within 1 to 2 business days.',
    path: '/contact',
  },
  privacy: {
    title: 'Privacy Policy | KyrithBuilds',
    description:
      'How KyrithBuilds collects, uses, and protects information submitted through our website and contact forms.',
    path: '/privacy',
  },
  terms: {
    title: 'Terms of Service | KyrithBuilds',
    description:
      'Terms of service for using the KyrithBuilds website and engaging our software development and automation services.',
    path: '/terms',
  },
}
