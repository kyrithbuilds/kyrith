import { createElement } from 'react'
import HomeSection from '../home/HomeSection'
import Reveal from '../ui/Reveal'

const iconClass = 'h-5 w-5'

function IconCode({ className = iconClass }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
      <path d="m10 9 2 2 4-4" />
    </svg>
  )
}

function IconWeb({ className = iconClass }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
    </svg>
  )
}

function IconBlocks({ className = iconClass }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}

function IconLightning({ className = iconClass }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" />
    </svg>
  )
}

function IconCart({ className = iconClass }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  )
}

function IconWrench({ className = iconClass }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z" />
    </svg>
  )
}

const services = [
  {
    title: 'Custom Software Development',
    description: 'Purpose-built systems aligned to how your team works and grows.',
    chips: ['Dashboards', 'Internal Tools', 'Workflow Systems'],
    icon: IconCode,
  },
  {
    title: 'Web Application Development',
    description: 'Reliable web apps for customers, partners, and internal teams.',
    chips: ['Portals', 'SaaS Products', 'Admin Panels'],
    icon: IconWeb,
  },
  {
    title: 'No-Code & Low-Code Solutions',
    description: 'Launch faster when speed and validation matter more than custom code.',
    chips: ['MVPs', 'Bubble.io', 'Webflow', 'Internal Apps'],
    icon: IconBlocks,
    featured: true,
  },
  {
    title: 'Automation & Integrations',
    description: 'Connect tools and remove repetitive work across your stack.',
    chips: ['APIs', 'Twilio', 'Make.com', 'Webhooks'],
    icon: IconLightning,
  },
  {
    title: 'E-commerce Solutions',
    description: 'Stores and checkout flows built to convert and stay manageable.',
    chips: ['Shopify', 'WordPress', 'Checkout Flows'],
    icon: IconCart,
  },
  {
    title: 'Maintenance & Scaling',
    description: 'Keep systems healthy after launch with fixes, tuning, and growth work.',
    chips: ['Bug Fixes', 'Performance', 'Feature Updates'],
    icon: IconWrench,
  },
]

function ServiceCard({ title, description, chips, icon, featured = false }) {
  return (
    <article
      className={`group relative flex h-full flex-col rounded-xl border p-7 shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_16px_40px_-14px_rgba(65,114,244,0.28),0_4px_16px_-4px_rgba(2,29,65,0.08)] sm:p-8 ${
        featured
          ? 'border-secondary/20 bg-gradient-to-b from-[#f5f8ff] to-white ring-1 ring-secondary/10 hover:border-secondary/35'
          : 'border-border bg-background hover:border-secondary/22'
      }`}
    >
      {featured ? (
        <span className="absolute right-5 top-5 rounded-full border border-secondary/15 bg-white/90 px-2.5 py-0.5 text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-secondary">
          Most Requested
        </span>
      ) : null}

      <div
        className={`flex h-11 w-11 items-center justify-center rounded-lg border text-secondary/90 transition-all duration-300 group-hover:border-secondary/30 group-hover:bg-[#f8faff] group-hover:text-secondary group-hover:shadow-[0_6px_18px_-6px_rgba(65,114,244,0.3)] ${
          featured ? 'border-secondary/15 bg-white' : 'border-secondary/10 bg-section'
        }`}
      >
        {createElement(icon)}
      </div>

      <h3 className={`mt-5 text-lg font-semibold tracking-tight text-primary sm:mt-6 ${featured ? 'pr-24' : 'pr-2'}`}>
        {title}
      </h3>
      <p className="mt-2.5 text-sm leading-relaxed text-textSecondary">{description}</p>

      <ul className="mt-6 flex flex-wrap gap-2 sm:mt-7">
        {chips.map((chip) => (
          <li
            key={chip}
            className="rounded-full border border-primary/[0.07] bg-section/90 px-3 py-1 text-xs font-medium text-primary/75 transition-colors duration-300 group-hover:border-secondary/12 group-hover:bg-white group-hover:text-primary/85"
          >
            {chip}
          </li>
        ))}
      </ul>
    </article>
  )
}

export default function ServicesGrid() {
  return (
    <HomeSection
      id="services-offerings"
      sectionClass="bg-background"
      revealDelay={0}
      title="Solutions We Build"
      intro="Services shaped around how your business operates, not one-size-fits-all packages."
    >
      <div className="mt-11 grid grid-cols-1 gap-8 sm:mt-12 sm:grid-cols-2 sm:gap-9 lg:grid-cols-3 lg:gap-10">
        {services.map((service, index) => (
          <Reveal key={service.title} delay={index * 70}>
            <ServiceCard {...service} />
          </Reveal>
        ))}
      </div>
    </HomeSection>
  )
}
