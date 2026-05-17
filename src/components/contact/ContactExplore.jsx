import { Link } from 'react-router-dom'
import Container from '../ui/Container'
import Section from '../ui/Section'

const links = [
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
  { to: '/about#about-process', label: 'How we work' },
]

export default function ContactExplore() {
  return (
    <Section id="contact-explore" className="bg-background" aria-labelledby="contact-explore-heading">
      <Container>
        <div className="mx-auto max-w-2xl rounded-2xl border border-primary/[0.07] bg-gradient-to-br from-[#f5f8ff] to-white px-7 py-10 text-center shadow-[0_8px_32px_-14px_rgba(2,29,65,0.08)] sm:px-10 sm:py-12">
          <h2 id="contact-explore-heading" className="text-lg font-bold tracking-tight text-primary sm:text-xl">
            Not ready to start?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-[1.65] text-textSecondary sm:text-base">
            Learn how we work, what we offer, and whether we are a good fit before you book time.
          </p>
          <nav className="mt-7 flex flex-wrap items-center justify-center gap-3 sm:gap-4" aria-label="Explore KyrithBuilds">
            {links.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="rounded-full border border-primary/[0.08] bg-white/80 px-4 py-2 text-sm font-semibold text-primary/85 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-secondary/22 hover:text-secondary hover:shadow-[0_8px_20px_-8px_rgba(65,114,244,0.2)]"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </Container>
    </Section>
  )
}
