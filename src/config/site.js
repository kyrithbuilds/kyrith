/** Site-wide constants for SEO, schema, and contact. */
export const SITE_NAME = 'KyrithBuilds'
export const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://kyrithbuilds.com'
export const SITE_EMAIL = 'info@kyrithbuilds.com'
export const SITE_TAGLINE =
  'Custom software, Bubble apps, workflow automations, MVPs, and internal tools for businesses that want to move faster and reduce manual work.'
// Re-enable when LinkedIn profile is ready:
// export const LINKEDIN_URL = 'https://www.linkedin.com/company/kyrithbuilds'

export const PAGE_SEO = {
  home: {
    title: 'Custom Software, Bubble Apps & Workflow Automation | KyrithBuilds',
    description:
      'KyrithBuilds builds custom software, Bubble apps, workflow automations, MVPs, and internal tools for businesses that want to move faster and reduce manual work.',
    path: '/',
  },
  services: {
    title: 'Custom Software, Bubble & Automation Services | KyrithBuilds',
    description:
      'Explore KyrithBuilds services: custom software, web apps, Bubble and no-code MVPs, workflow automations, integrations, Shopify builds, and ongoing support.',
    path: '/services',
  },
  about: {
    title: 'About KyrithBuilds | Software Built for Real Operations',
    description:
      'Meet KyrithBuilds: a remote-first studio helping businesses ship practical software, Bubble apps, automations, and integrations without bloated roadmaps.',
    path: '/about',
  },
  contact: {
    title: 'Contact KyrithBuilds | Start Your Project',
    description:
      'Get in touch about MVPs, custom software, Bubble apps, or workflow automation. Email or WhatsApp KyrithBuilds; we reply within 1 to 2 business days.',
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
