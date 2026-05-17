import { createElement } from 'react'
import HomeSection from '../home/HomeSection'
import Reveal from '../ui/Reveal'

const iconClass = 'h-6 w-6'

function IconTarget({ className = iconClass }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}

function IconLayers({ className = iconClass }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m12 2 8 4.5v7L12 18l-8-4.5v-7L12 2Z" />
      <path d="M12 18v4" />
      <path d="m7 15.5 5 3 5-3" />
    </svg>
  )
}

function IconZap({ className = iconClass }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" />
    </svg>
  )
}

function IconLifeRing({ className = iconClass }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <path d="M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M4.93 19.07l4.24-4.24M14.83 9.17l4.24-4.24" />
    </svg>
  )
}

const beliefs = [
  {
    title: 'Build for outcomes',
    description:
      'Every feature should tie to a real result: time saved, revenue enabled, or risk reduced.',
    icon: IconTarget,
    tags: ['Revenue', 'Time saved', 'Automation'],
    featured: true,
    badge: 'Core principle',
  },
  {
    title: 'Use the right stack',
    description:
      'No-code, low-code, or custom code. We pick what fits your stage, not what looks impressive.',
    icon: IconLayers,
    tags: ['Bubble', 'React', 'APIs'],
  },
  {
    title: 'Move fast',
    description:
      'Short cycles and visible progress beat months of planning with nothing shipped.',
    icon: IconZap,
    tags: ['Fast cycles', 'Milestones'],
  },
  {
    title: 'Support after launch',
    description:
      'Go-live is a milestone. We stay available for fixes, improvements, and what comes next.',
    icon: IconLifeRing,
    tags: ['Maintenance', 'Scaling'],
  },
]

function BeliefCard({ title, description, icon, tags, featured = false, badge }) {
  return (
    <article
      className={`group relative flex h-full flex-col rounded-xl border p-7 transition-all duration-300 ease-out hover:-translate-y-1.5 sm:p-8 ${
        featured
          ? 'border-secondary/22 bg-gradient-to-b from-white via-[#fafcff] to-white shadow-[0_4px_20px_-6px_rgba(65,114,244,0.12),0_2px_8px_-2px_rgba(2,29,65,0.06)] ring-1 ring-secondary/10 hover:border-secondary/35 hover:shadow-[0_20px_48px_-14px_rgba(65,114,244,0.28),0_6px_20px_-6px_rgba(2,29,65,0.08)]'
          : 'border-primary/[0.07] bg-white shadow-[0_2px_12px_-4px_rgba(2,29,65,0.07),0_1px_3px_rgba(2,29,65,0.04)] hover:border-secondary/25 hover:shadow-[0_18px_44px_-14px_rgba(65,114,244,0.22),0_4px_16px_-4px_rgba(2,29,65,0.07)]'
      }`}
    >
      {featured && badge ? (
        <span className="absolute right-5 top-5 rounded-full border border-secondary/12 bg-white/95 px-2.5 py-0.5 text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-secondary/90">
          {badge}
        </span>
      ) : null}

      <div
        className={`relative flex h-12 w-12 items-center justify-center rounded-xl border text-secondary transition-all duration-300 group-hover:border-secondary/35 group-hover:text-secondary group-hover:shadow-[0_8px_24px_-6px_rgba(65,114,244,0.38),0_0_20px_-4px_rgba(65,114,244,0.25)] ${
          featured
            ? 'border-secondary/18 bg-white shadow-[0_4px_14px_-4px_rgba(65,114,244,0.2)]'
            : 'border-secondary/12 bg-[#f8faff] shadow-[0_2px_10px_-4px_rgba(65,114,244,0.15)]'
        }`}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-xl bg-[radial-gradient(ellipse_at_center,rgba(65,114,244,0.08),transparent_70%)] opacity-80"
          aria-hidden
        />
        <span className="relative">{createElement(icon)}</span>
      </div>

      <h3 className={`mt-5 text-lg font-semibold tracking-tight text-primary sm:mt-6 ${featured ? 'pr-24' : ''}`}>
        {title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-textSecondary sm:text-[0.9375rem]">
        {description}
      </p>

      {tags?.length ? (
        <ul className="mt-6 flex flex-wrap gap-1.5 sm:mt-7">
          {tags.map((tag) => (
            <li
              key={tag}
              className="rounded-md border border-primary/[0.05] bg-section/70 px-2 py-0.5 text-[0.625rem] font-medium tracking-tight text-textSecondary/75 transition-colors duration-300 group-hover:border-secondary/10 group-hover:bg-white/80 group-hover:text-textSecondary/90"
            >
              {tag}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  )
}

export default function AboutBeliefs() {
  return (
    <HomeSection
      id="about-beliefs"
      sectionClass="bg-section"
      revealDelay={0}
      title="What we believe"
      intro="Principles that guide every project, from first call to long after launch."
    >
      <div className="mt-11 grid gap-8 sm:mt-12 sm:grid-cols-2 sm:gap-9 lg:gap-10">
        {beliefs.map((belief, index) => (
          <Reveal key={belief.title} delay={index * 70}>
            <BeliefCard {...belief} />
          </Reveal>
        ))}
      </div>
    </HomeSection>
  )
}
