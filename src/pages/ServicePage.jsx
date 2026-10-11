import { Link } from 'react-router-dom'
import blobPng from '../assets/blob.webp'
import BreadcrumbStructuredData from '../components/seo/BreadcrumbStructuredData'
import FaqPageStructuredData from '../components/seo/FaqPageStructuredData'
import PageSEO from '../components/seo/PageSEO'
import ServiceStructuredData from '../components/seo/ServiceStructuredData'
import Container from '../components/ui/Container'
import ContentTable from '../components/ui/ContentTable'
import InlineLinks from '../components/ui/InlineLinks'
import Reveal from '../components/ui/Reveal'
import Section from '../components/ui/Section'
import { primaryLinkClass } from '../components/ui/linkButtons'
import { SERVICE_PAGES } from '../config/servicePages'
import { CTA } from '../config/analytics'
import { PAGE_SEO } from '../config/site'

const bodyClass = 'mt-4 text-base leading-relaxed text-textSecondary'

export default function ServicePage({ page }) {
  const { content, serviceName, serviceType } = SERVICE_PAGES[page]
  const seo = PAGE_SEO[page]
  const { h1, intro, cta, who, ctaEnd, sections } = content
  const faqs = sections.map(({ question, answer }) => ({ question, answer }))

  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <PageSEO title={seo.title} description={seo.description} path={seo.path} />
      <BreadcrumbStructuredData path={seo.path} />
      <ServiceStructuredData
        path={seo.path}
        description={seo.description}
        name={serviceName}
        serviceType={serviceType}
      />
      <FaqPageStructuredData path={seo.path} faqs={faqs} />

      <section
        className="relative overflow-hidden bg-gradient-to-b from-[#eef4ff] via-[#f4f8ff] to-[#f8faff] py-14 sm:py-20 lg:py-24"
        aria-labelledby="service-page-heading"
      >
        <img
          src={blobPng}
          alt=""
          width={800}
          height={800}
          decoding="async"
          className="pointer-events-none absolute top-1/2 right-0 h-auto w-[min(72vw,420px)] max-w-none -translate-y-1/2 translate-x-[min(28%,6rem)] select-none opacity-[0.35] blur-2xl max-sm:opacity-[0.1] sm:w-[min(80vw,560px)]"
          aria-hidden
        />
        <Container className="relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <h1
              id="service-page-heading"
              className="animate-hero-fade-up text-[1.65rem] font-bold leading-[1.14] tracking-tight text-primary sm:text-4xl lg:text-[2.65rem]"
            >
              {h1}
            </h1>
            <p className="animate-hero-fade-up animate-hero-delay-1 mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-textSecondary sm:mt-6 sm:text-lg">
              {intro}
            </p>
            <div className="animate-hero-fade-up animate-hero-delay-2 mt-8 flex justify-center">
              <Link
                to="/contact"
                className={primaryLinkClass}
                data-track-cta={CTA.START_PROJECT}
                data-track-location={`${page}_hero`}
              >
                Start Your Project
              </Link>
            </div>
            <p className="mt-4 text-sm text-textSecondary">
              <InlineLinks text={cta.replace(/^\[Start Your Project\]\([^)]*\) or /, 'Or ')} />
            </p>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-textSecondary/90">{who}</p>
          </div>
        </Container>
      </section>

      {sections.map(({ question, answer, detail, table }, index) => (
        <Section
          key={question}
          variant={index % 2 === 0 ? 'default' : 'muted'}
          aria-labelledby={`service-page-h2-${index}`}
        >
          <Container>
            <Reveal>
              <div className="mx-auto max-w-3xl">
                <h2
                  id={`service-page-h2-${index}`}
                  className="text-2xl font-bold tracking-tight text-primary sm:text-3xl"
                >
                  {question}
                </h2>
                <p className="mt-5 text-base font-medium leading-relaxed text-primary/90 sm:text-lg">
                  <InlineLinks text={answer} />
                </p>
                {detail ? (
                  <p className={bodyClass}>
                    <InlineLinks text={detail} />
                  </p>
                ) : null}
                {table ? <ContentTable table={table} /> : null}
              </div>
            </Reveal>
          </Container>
        </Section>
      ))}

      <Section className="bg-gradient-to-b from-[#e8f0ff] via-[#f2f6fd] to-[#f8faff]" aria-label="Get started">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-base leading-relaxed text-primary/90 sm:text-lg">
              <InlineLinks text={ctaEnd} />
            </p>
          </div>
        </Container>
      </Section>
    </main>
  )
}
