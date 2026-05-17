import HomeSection from '../home/HomeSection'
import ProcessStep from '../process/ProcessStep'
import { IconBuild, IconGrowth, IconRocket, IconSearch } from '../process/processIcons'

const steps = [
  {
    step: '01',
    title: 'Discover',
    description: 'Clarify goals, users, and constraints before we commit to a build path.',
    icon: IconSearch,
  },
  {
    step: '02',
    title: 'Build',
    description: 'Ship in focused milestones with the stack that fits your timeline and budget.',
    icon: IconBuild,
  },
  {
    step: '03',
    title: 'Launch',
    description: 'Deploy, test, and hand off with documentation your team can rely on.',
    icon: IconRocket,
  },
  {
    step: '04',
    title: 'Improve & Scale',
    description: 'Iterate, optimize, and grow as real usage shows what matters next.',
    icon: IconGrowth,
  },
]

export default function ServicesProcess() {
  return (
    <HomeSection
      id="services-process"
      sectionClass="bg-section"
      revealDelay={160}
      title="How we work with you"
      intro="A clear path from first conversation to live product, without surprises."
    >
      <div className="relative mx-auto mt-12 max-w-5xl sm:mt-14">
        <div
          className="pointer-events-none absolute left-[8%] right-[8%] top-6 hidden h-[2px] rounded-full bg-gradient-to-r from-secondary/10 via-secondary/45 to-secondary/10 lg:block"
          aria-hidden
        />

        <ol className="flex list-none flex-col lg:grid lg:grid-cols-4 lg:gap-8">
          {steps.map((item, index) => (
            <ProcessStep
              key={item.step}
              step={item.step}
              title={item.title}
              description={item.description}
              icon={item.icon}
              stepLabel={item.step}
              compact
              showConnector={index < steps.length - 1}
            />
          ))}
        </ol>
      </div>
    </HomeSection>
  )
}
