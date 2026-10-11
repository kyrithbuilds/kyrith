import { BUBBLE_DEV } from './bubbleDeveloper'
import { MVP_DEV } from './mvpDevelopment'
import { WORKFLOW_AUTO } from './workflowAutomation'

/**
 * Service landing pages rendered by pages/ServicePage.jsx.
 * To add one: write its copy in a config file, register it here, then add the route in App.jsx,
 * PAGE_SEO (site.js), PAGE_BREADCRUMBS, public/sitemap.xml and any internal links.
 */
export const SERVICE_PAGES = {
  'bubble-developer': {
    path: '/bubble-developer',
    content: BUBBLE_DEV,
    serviceName: 'Bubble developer for MVPs',
    serviceType: 'Bubble.io MVP development',
  },
  'mvp-development': {
    path: '/mvp-development',
    content: MVP_DEV,
    serviceName: 'MVP development services',
    serviceType: 'MVP development',
  },
  'workflow-automation': {
    path: '/workflow-automation',
    content: WORKFLOW_AUTO,
    serviceName: 'Workflow automation services',
    serviceType: 'Workflow automation',
  },
}
