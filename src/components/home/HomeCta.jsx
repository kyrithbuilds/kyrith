import { Link } from 'react-router-dom'
import Container from '../ui/Container'
import Reveal from '../ui/Reveal'
import Section from '../ui/Section'
import { primaryLinkClass, secondaryLinkClass } from '../ui/linkButtons'
import { CTA } from '../../config/analytics'
import WhatsAppCtaHint from '../whatsapp/WhatsAppCtaHint'

export default function HomeCta() {
  return (
    <Section
      id="get-started"
      className="bg-gradient-to-b from-[#e8f0ff] via-[#f2f6fd] to-[#f8faff]"
      aria-labelledby="home-cta-heading"
    >
      <Container>
        <Reveal delay={80}>
          <div className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl border border-secondary/[0.16] bg-gradient-to-br from-[#d8e6ff] via-[#eaf0fc] to-[#f5f8ff] px-5 py-12 text-center shadow-[0_12px_48px_-14px_rgba(65,114,244,0.3),0_2px_16px_-4px_rgba(2,29,65,0.08)] sm:px-10 sm:py-18 lg:px-14 lg:py-22">
            <div
              className="pointer-events-none absolute -left-24 top-0 h-56 w-56 rounded-full bg-secondary/[0.16] blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -right-20 bottom-0 h-48 w-48 rounded-full bg-secondary/[0.12] blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute left-1/2 top-[40%] h-[min(80%,300px)] w-[min(100%,600px)] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-[radial-gradient(ellipse_90%_80%_at_50%_50%,rgba(65,114,244,0.2),rgba(237,242,252,0.05)_45%,transparent_70%)]"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 h-[min(70%,260px)] w-[min(92%,520px)] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(88,118,200,0.12),transparent_62%)] blur-2xl"
              aria-hidden
            />

            <div className="relative z-10">
              <h2
                id="home-cta-heading"
                className="text-[1.65rem] font-bold leading-[1.12] tracking-tight text-primary sm:text-3xl sm:leading-tight lg:text-[2rem]"
              >
                Have an idea? Let&apos;s turn it into something people use.
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-[1.65] text-textSecondary sm:mt-6 sm:text-lg">
                From MVPs to workflow improvements, we help teams ship useful software, simplify
                operations, and support growth over time.
              </p>
              <div className="mt-11 flex flex-col items-stretch justify-center gap-3.5 sm:mt-12 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
                <Link to="/contact" className={primaryLinkClass}>
                  Start Your Project
                </Link>
                <Link to="/services" className={secondaryLinkClass}>
                  View Services
                </Link>
              </div>
              <WhatsAppCtaHint className="mt-5 sm:mt-6" location="home_cta" />
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}
