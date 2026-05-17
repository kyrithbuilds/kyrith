import HomeSection from './HomeSection'
import ProcessStep from '../process/ProcessStep'
import Reveal from '../ui/Reveal'
import { IconBuild, IconRocket, IconSearch } from '../process/processIcons'

const steps = [
  {
    step: '01',
    title: 'Understand Your Goal',
    description:
      'We identify problems, constraints, and opportunities before writing code.',
    icon: IconSearch,
  },
  {
    step: '02',
    title: 'Build With The Right Stack',
    description:
      'Choose the fastest and most maintainable approach: no-code, low-code, or custom development.',
    icon: IconBuild,
  },
  {
    step: '03',
    title: 'Launch, Improve & Scale',
    description:
      'Deploy confidently and continue improving as your business grows.',
    icon: IconRocket,
  },
]

export default function Process() {
  return (
    <HomeSection
      id="how-we-work"
      sectionClass="bg-background"
      revealDelay={120}
      title="How We Turn Ideas Into Products"
      intro="A simple, transparent process designed to move from concept to launch without unnecessary complexity."
    >
      <div className="relative mx-auto mt-14 max-w-5xl sm:mt-16 lg:mt-[4.75rem]">
        <Reveal className="pointer-events-none absolute left-[10%] right-[10%] top-6 hidden lg:block">
          <div
            className="process-line-inner h-[2px] w-full origin-left rounded-full bg-gradient-to-r from-secondary/12 via-secondary/50 to-secondary/12"
            aria-hidden
          />
        </Reveal>

        <ol className="flex list-none flex-col lg:flex-row lg:items-start lg:justify-between lg:gap-10 xl:gap-14">
          {steps.map((item, index) => (
            <ProcessStep
              key={item.step}
              {...item}
              showConnector={index < steps.length - 1}
            />
          ))}
        </ol>
      </div>
    </HomeSection>
  )
}
