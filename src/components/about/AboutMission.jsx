import developerWorkspace from '../../assets/developer-workspace.png'
import Container from '../ui/Container'
import Reveal from '../ui/Reveal'
import Section from '../ui/Section'

const microStats = ['Fast builds', 'Flexible stacks', 'Long-term support']

const copyBlocks = [
  {
    label: 'Problem',
    text: 'Teams lose hours to spreadsheets, manual handoffs, and tools that never quite connect. The work gets done, but slower than it should.',
  },
  {
    label: 'Approach',
    text: 'We listen first, then build what fits: custom software, no-code when speed wins, and automations that remove repeat work from your week.',
  },
  {
    label: 'Result',
    text: 'Systems you can rely on: clear to use, easy to maintain, and ready to grow when your business does. No bloated roadmaps or jargon decks.',
  },
]

export default function AboutMission() {
  return (
    <Section
      id="about-mission"
      className="relative overflow-x-hidden bg-background"
      aria-labelledby="about-mission-heading"
    >
      <div
        className="pointer-events-none absolute left-0 top-1/2 h-[min(80vw,520px)] w-[min(70vw,480px)] -translate-y-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(65,114,244,0.06),transparent_68%)] blur-3xl lg:left-[4%]"
        aria-hidden
      />

      <Container className="relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16 xl:gap-20">
          <Reveal>
            <div className="relative mx-auto flex w-full max-w-xl items-center justify-center overflow-hidden lg:mx-0 lg:max-w-none lg:justify-start">
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 h-[min(95vw,480px)] w-[min(100vw,520px)] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-[radial-gradient(ellipse_65%_55%_at_50%_50%,rgba(65,114,244,0.14),rgba(2,29,65,0.05)_45%,transparent_72%)] blur-3xl sm:h-[min(88vw,520px)] sm:w-[min(95vw,560px)]"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute left-[18%] top-[22%] h-28 w-28 rounded-full bg-secondary/[0.07] blur-2xl"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute bottom-[18%] right-[12%] h-36 w-36 rounded-full bg-primary/[0.04] blur-3xl"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute left-1/2 top-[48%] h-[min(55vw,280px)] w-[min(70vw,340px)] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-[radial-gradient(closest-side,rgba(88,118,200,0.08),transparent)] blur-2xl"
                aria-hidden
              />

              <img
                src={developerWorkspace}
                alt="Developer workspace with tools for building software and automations"
                width={720}
                height={480}
                loading="lazy"
                decoding="async"
                className="relative z-[1] mx-auto h-auto w-full max-w-[min(100%,560px)] object-contain object-center drop-shadow-[0_20px_50px_-24px_rgba(2,29,65,0.14)] sm:max-w-[600px] lg:mx-0 lg:max-w-full"
              />
            </div>
          </Reveal>

          <Reveal delay={90}>
            <div className="max-w-xl lg:max-w-none">
              <h2
                id="about-mission-heading"
                className="text-2xl font-bold tracking-tight text-primary sm:text-3xl"
              >
                Why KyrithBuilds exists
              </h2>
              <p className="mt-5 text-pretty text-base leading-relaxed text-textSecondary sm:mt-6 sm:text-lg sm:leading-relaxed">
                We started this studio to help businesses fix real operational friction, not sell
                another app they didn&apos;t need.
              </p>

              <div className="mt-11 space-y-9 sm:mt-12 sm:space-y-10">
                {copyBlocks.map(({ label, text }) => (
                  <div key={label}>
                    <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-secondary/85">
                      {label}
                    </p>
                    <p className="mt-3 text-[0.9375rem] leading-relaxed text-textSecondary sm:text-base sm:leading-relaxed">
                      {text}
                    </p>
                  </div>
                ))}
              </div>

              <ul
                className="mt-11 flex flex-wrap gap-x-7 gap-y-3 border-t border-primary/[0.06] pt-9 sm:mt-12"
                aria-label="What clients can expect"
              >
                {microStats.map((stat) => (
                  <li key={stat} className="flex items-center gap-2 text-sm font-medium text-primary/80">
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full bg-secondary/70"
                      aria-hidden
                    />
                    {stat}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}
