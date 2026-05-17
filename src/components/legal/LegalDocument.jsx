import Container from '../ui/Container'
import Section from '../ui/Section'

export default function LegalDocument({ title, intro, children, updated }) {
  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <Section className="bg-gradient-to-b from-[#eef4ff] via-[#f8faff] to-white">
        <Container className="max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">{title}</h1>
          {intro ? (
            <p className="mt-4 text-base leading-relaxed text-textSecondary sm:text-lg">{intro}</p>
          ) : null}
          {updated ? (
            <p className="mt-3 text-sm text-textSecondary/75">Last updated: {updated}</p>
          ) : null}
        </Container>
      </Section>
      <Section className="bg-background">
        <Container className="max-w-3xl">
          <div className="prose-legal space-y-8 text-sm leading-relaxed text-textSecondary sm:text-[0.9375rem]">
            {children}
          </div>
        </Container>
      </Section>
    </main>
  )
}

export function LegalSection({ title, children }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-primary sm:text-xl">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  )
}
