import { createElement } from 'react'
import HomeSection from '../home/HomeSection'
import Reveal from '../ui/Reveal'

const iconClass = 'h-5 w-5'

function IconMessage({ className = iconClass }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
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

function IconClock({ className = iconClass }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
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

const experiences = [
  {
    title: 'Weekly updates, not long silences',
    description:
      'You hear from us regularly: what shipped, what is next, and what needs a decision from you.',
    icon: IconMessage,
    label: 'Fast feedback',
    proofs: ['Clear timelines', 'Milestone check-ins'],
  },
  {
    title: 'Small launches beat long roadmaps',
    description:
      'We break work into phases you can use early, so value shows up before the “big reveal.”',
    icon: IconClock,
    proofs: ['Milestone-based delivery', 'Shippable increments'],
  },
  {
    title: 'Stack choices that fit you',
    description:
      'No-code, custom code, or integrations. We recommend what matches your stage, not our preferences.',
    icon: IconSettings,
    label: 'Remote-first',
    proofs: ['Flexible stack recommendations', 'Honest trade-off conversations'],
  },
  {
    title: 'Support after go-live',
    description:
      'Launch is not the finish line. We stay available for fixes, tuning, and what users teach you next.',
    icon: IconHandshake,
    label: 'Long-term support',
    proofs: ['Post-launch support', 'Iteration when priorities shift'],
  },
]

function ProofList({ items }) {
  return (
    <ul className="mt-4 space-y-1.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-xs leading-snug text-textSecondary/85">
          <span className="mt-px shrink-0 font-medium text-secondary/75" aria-hidden>
            ✓
          </span>
          {item}
        </li>
      ))}
    </ul>
  )
}

function ExperienceCard({ title, description, icon, proofs, label }) {
  return (
    <article className="group relative flex h-full flex-col rounded-xl border border-primary/[0.07] bg-white p-5 shadow-[0_2px_12px_-4px_rgba(2,29,65,0.07)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-secondary/26 hover:shadow-[0_14px_36px_-12px_rgba(65,114,244,0.22),0_4px_12px_-4px_rgba(2,29,65,0.06)] sm:p-6">
      {label ? (
        <span className="absolute right-4 top-4 rounded-full border border-primary/[0.06] bg-section/80 px-2 py-0.5 text-[0.5625rem] font-semibold uppercase tracking-[0.12em] text-textSecondary/70">
          {label}
        </span>
      ) : null}

      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-secondary/12 bg-section/90 text-secondary/90 transition-all duration-300 group-hover:border-secondary/28 group-hover:bg-[#f8faff] group-hover:text-secondary group-hover:shadow-[0_4px_14px_-4px_rgba(65,114,244,0.25)]">
        {createElement(icon)}
      </div>

      <h3 className={`mt-4 text-base font-semibold tracking-tight text-primary sm:text-lg ${label ? 'pr-20' : ''}`}>
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-textSecondary">{description}</p>
      <ProofList items={proofs} />
    </article>
  )
}

export default function AboutClients() {
  return (
    <HomeSection
      id="about-clients"
      sectionClass="bg-background"
      revealDelay={160}
      title="What working together feels like"
      intro="The day-to-day of a project with us: honest updates, practical delivery, and support that does not disappear after launch."
    >
      <div className="mt-11 grid gap-6 sm:mt-12 sm:grid-cols-2 sm:gap-7 lg:gap-8">
        {experiences.map((item, index) => (
          <Reveal key={item.title} delay={index * 70}>
            <ExperienceCard {...item} />
          </Reveal>
        ))}
      </div>
    </HomeSection>
  )
}
