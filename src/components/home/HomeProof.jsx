import HomeSection from './HomeSection'
import Reveal from '../ui/Reveal'

const stats = [
  { value: '10+', label: 'Projects' },
  { value: '15+', label: 'Automations' },
  { value: '5+', label: 'Platforms' },
  { value: '100%', label: 'Custom builds' },
]

export default function HomeProof() {
  return (
    <HomeSection
      id="home-proof"
      sectionClass="bg-background"
      revealDelay={0}
      title="Why businesses choose KyrithBuilds"
      intro="Focused delivery for teams that need software that works in daily operations, not another vendor deck."
    >
      <div className="mt-11 grid grid-cols-1 gap-4 min-[400px]:grid-cols-2 sm:mt-12 sm:gap-5 lg:grid-cols-4 lg:gap-6">
        {stats.map(({ value, label }, index) => (
          <Reveal key={label} delay={index * 70}>
            <div className="group rounded-xl border border-border/90 bg-background px-5 py-6 text-center shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:border-secondary/18 hover:shadow-[0_14px_36px_-14px_rgba(65,114,244,0.22)] sm:px-6 sm:py-7">
              <p className="text-2xl font-bold tracking-tight text-secondary transition-colors duration-300 group-hover:text-secondary sm:text-3xl">
                {value}
              </p>
              <p className="mt-2 text-xs font-medium leading-snug text-textSecondary/90 sm:text-sm">
                {label}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </HomeSection>
  )
}
