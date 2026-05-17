import { createElement } from 'react'
import HomeSection from '../home/HomeSection'

const iconClass = 'h-5 w-5'

function IconTarget({ className = iconClass }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}

function IconSettings({ className = iconClass }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82 1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
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

function IconHandshake({ className = iconClass }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m11 17 2 2a1 1 0 1 0 3-3" />
      <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a2 2 0 0 1-2.83 0l-.88-.88a3 3 0 0 0-4.24 0L2 12.5a1 1 0 1 0 3 3l2.5-2.5" />
      <path d="m7 11 2 2" />
      <path d="m17 11-2 2" />
    </svg>
  )
}

const reasons = [
  {
    title: 'Business-first solutions',
    description:
      'We start with outcomes: time saved, revenue enabled, risk reduced. Not tech for its own sake.',
    icon: IconTarget,
  },
  {
    title: 'Flexible stack choices',
    description:
      'No-code, low-code, or custom code. We recommend what fits your stage, not our favorite tool.',
    icon: IconSettings,
    featured: true,
  },
  {
    title: 'Fast delivery cycles',
    description:
      'Short milestones and visible progress so you are never waiting months to see value.',
    icon: IconLightning,
  },
  {
    title: 'Ongoing support',
    description:
      'Launch is a milestone, not the end. We stay available for fixes, improvements, and growth.',
    icon: IconHandshake,
  },
]

function WhyCard({ title, description, icon, featured = false }) {
  return (
    <article
      className={`group relative flex h-full flex-col rounded-xl border p-7 shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_16px_40px_-14px_rgba(65,114,244,0.26),0_4px_16px_-4px_rgba(2,29,65,0.07)] sm:p-8 ${
        featured
          ? 'border-secondary/20 bg-gradient-to-b from-[#f5f8ff] to-white ring-1 ring-secondary/10 hover:border-secondary/32'
          : 'border-border bg-background hover:border-secondary/20'
      }`}
    >
      {featured ? (
        <span className="absolute right-5 top-5 rounded-full border border-secondary/15 bg-white/90 px-2.5 py-0.5 text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-secondary">
          Popular with startups
        </span>
      ) : null}

      <div
        className={`flex h-11 w-11 items-center justify-center rounded-lg border text-secondary/90 transition-all duration-300 group-hover:border-secondary/30 group-hover:bg-[#f8faff] group-hover:text-secondary group-hover:shadow-[0_6px_18px_-6px_rgba(65,114,244,0.3)] ${
          featured ? 'border-secondary/15 bg-white' : 'border-secondary/10 bg-section'
        }`}
      >
        {createElement(icon)}
      </div>

      <h3 className="mt-5 text-lg font-semibold tracking-tight text-primary sm:mt-6">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-textSecondary sm:text-[0.9375rem]">
        {description}
      </p>
    </article>
  )
}

export default function ServicesWhy() {
  return (
    <HomeSection
      id="services-why"
      sectionClass="bg-background"
      revealDelay={240}
      title="Why teams choose KyrithBuilds"
      intro="Software partners focused on outcomes, not unnecessary complexity."
    >
      <div className="mt-11 grid gap-8 sm:mt-12 sm:grid-cols-2 sm:gap-9 lg:gap-10">
        {reasons.map((reason) => (
          <WhyCard key={reason.title} {...reason} />
        ))}
      </div>
    </HomeSection>
  )
}
