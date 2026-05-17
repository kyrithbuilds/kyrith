import Container from '../ui/Container'
import Reveal from '../ui/Reveal'
import Section from '../ui/Section'
import { sectionIntroClass } from '../ui/siteStyles'

const variants = {
  default: 'bg-background',
  muted: 'bg-section',
}

export default function HomeSection({
  id,
  title,
  intro,
  variant = 'default',
  sectionClass = '',
  children,
  className = '',
  revealDelay = 0,
}) {
  const bg = sectionClass || variants[variant] || variants.default

  return (
    <Section
      id={id}
      variant="default"
      className={`${bg} ${className}`.trim()}
      aria-labelledby={`${id}-heading`}
    >
      <Container>
        <Reveal delay={revealDelay}>
          <div className="mx-auto max-w-3xl text-center">
            <h2
              id={`${id}-heading`}
              className="text-2xl font-bold tracking-tight text-primary sm:text-3xl"
            >
              {title}
            </h2>
            {intro ? (
              <p className={sectionIntroClass}>{intro}</p>
            ) : null}
          </div>
        </Reveal>
        <Reveal delay={revealDelay + 90}>{children}</Reveal>
      </Container>
    </Section>
  )
}
