import { Link } from 'react-router-dom'
import HomeSection from './HomeSection'
import Reveal from '../ui/Reveal'

const services = [
  {
    title: 'Web applications',
    description:
      'Dashboards, portals, and internal tools shaped around how your team actually works.',
    featured: false,
  },
  {
    title: 'No-code & CMS builds',
    description:
      'Bubble, Webflow, WordPress, and Shopify when speed to market and easy content updates matter most.',
    featured: true,
  },
  {
    title: 'Integrations & automation',
    description:
      'Connect the tools you already use so data flows cleanly and repetitive tasks disappear.',
    featured: false,
  },
]

function BuildCard({ title, description, featured = false }) {
  return (
    <article
      className={`group relative flex h-full flex-col rounded-xl border p-7 shadow-card transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_18px_44px_-16px_rgba(65,114,244,0.3),0_4px_16px_-4px_rgba(2,29,65,0.08)] sm:p-8 ${
        featured
          ? 'border-secondary/22 bg-gradient-to-b from-[#f5f8ff] to-white ring-1 ring-secondary/10 hover:border-secondary/40'
          : 'border-border bg-background hover:border-secondary/25'
      }`}
    >
      {featured ? (
        <span className="absolute right-5 top-5 rounded-full border border-secondary/15 bg-white/90 px-2.5 py-0.5 text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-secondary">
          Most Requested
        </span>
      ) : null}
      <h3 className={`text-lg font-semibold tracking-tight text-primary ${featured ? 'pr-24' : ''}`}>
        {title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-textSecondary sm:mt-3.5 sm:text-base">
        {description}
      </p>
    </article>
  )
}

export default function WhatWeDo() {
  return (
    <HomeSection
      id="what-we-do"
      sectionClass="bg-background"
      revealDelay={0}
      title="What we build"
      intro="Practical systems for businesses that need results on screen, not slide decks."
    >
      <div className="mt-11 grid gap-7 sm:mt-12 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 lg:gap-9">
        {services.map((service, index) => (
          <Reveal key={service.title} delay={index * 70}>
            <BuildCard {...service} />
          </Reveal>
        ))}
      </div>
      <p className="mt-12 text-center sm:mt-14">
        <Link
          to="/services"
          className="text-sm font-semibold text-secondary transition-colors duration-200 hover:text-secondaryLight"
        >
          View all services →
        </Link>
      </p>
    </HomeSection>
  )
}
