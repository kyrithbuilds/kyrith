import bubble from '../../assets/tech/bubble.svg'
import react from '../../assets/tech/react.svg'
import make from '../../assets/tech/make.svg'
import Container from '../ui/Container'
import Reveal from '../ui/Reveal'
import Section from '../ui/Section'
import { cardSurfaceHover, sectionIntroClass, techLogoImgClass, techLogoWrapClass } from '../ui/siteStyles'

const approaches = [
  {
    name: 'Bubble',
    src: bubble,
    category: 'Fastest to launch',
    headline: 'Launch fast',
    description:
      'Validate ideas and ship MVPs without months of custom work. We often reach for no-code platforms like Bubble when time-to-market is the priority.',
  },
  {
    name: 'React',
    src: react,
    category: 'Most flexible',
    headline: 'Need flexibility',
    description:
      'Custom interfaces, complex workflows, and long-term control call for a tailored approach. React and modern integrations give you room to grow without starting over.',
  },
  {
    name: 'Make.com',
    src: make,
    category: 'Best for operations',
    headline: 'Reduce repetitive work',
    description:
      'When teams lose hours to copy-paste and handoffs, we connect your tools with workflows through Make.com, webhooks, and integrations that keep operations moving.',
  },
]

export default function AboutTech() {
  return (
    <Section
      id="about-technology"
      className="bg-background"
      aria-labelledby="about-technology-heading"
    >
      <Container>
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2
              id="about-technology-heading"
              className="text-2xl font-bold tracking-tight text-primary sm:text-3xl"
            >
              Our approach to technology
            </h2>
            <p className={sectionIntroClass}>
              We start with your business outcome, then pick the stack that gets you there without
              overbuilding or locking you in.
            </p>
          </div>
        </Reveal>

        <ul className="mt-11 list-none space-y-4 sm:mt-12">
          {approaches.map(({ name, src, category, headline, description }, index) => (
            <Reveal key={name} delay={index * 70}>
              <li
                className={`group flex flex-col gap-4 rounded-xl border border-primary/[0.07] bg-white p-5 sm:flex-row sm:items-center sm:gap-5 sm:p-6 ${cardSurfaceHover}`}
              >
                <div className={techLogoWrapClass}>
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className={techLogoImgClass}
                  />
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <p className="text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-secondary/85">
                    {category}
                  </p>
                  <h3 className="mt-1.5 text-lg font-semibold tracking-tight text-primary">{headline}</h3>
                  <p className="mt-2 max-w-prose text-sm leading-[1.65] text-textSecondary sm:text-[0.9375rem]">
                    {description}
                  </p>
                </div>
              </li>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={240}>
          <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-[1.65] text-textSecondary/90 sm:mt-11 sm:text-[0.9375rem]">
            We recommend what fits your business, not what keeps us locked into one stack.
          </p>
        </Reveal>
      </Container>
    </Section>
  )
}
