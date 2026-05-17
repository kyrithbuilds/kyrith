import { Link } from 'react-router-dom'
import Container from '../ui/Container'
import Reveal from '../ui/Reveal'
import Section from '../ui/Section'
import { primaryLinkClass, secondaryLinkClass } from '../ui/linkButtons'
import { CTA } from '../../config/analytics'
import WhatsAppCtaHint from '../whatsapp/WhatsAppCtaHint'

export default function AboutCta() {
  return (
    <Section
      id="about-cta"
      className="bg-gradient-to-b from-[#e8f0ff] via-[#f2f6fd] to-[#f8faff]"
      aria-labelledby="about-cta-heading"
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

            <div className="relative z-10">
              <h2
                id="about-cta-heading"
                className="text-[1.65rem] font-bold leading-[1.12] tracking-tight text-primary sm:text-3xl sm:leading-tight lg:text-[2rem]"
              >
                Ready to build something that actually works?
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-textSecondary sm:mt-6 sm:text-lg sm:leading-relaxed">
                Tell us what you&apos;re trying to solve. We&apos;ll help you choose the right path,
                whether that&apos;s an MVP, automation, or a full custom build.
              </p>
              <div className="mt-11 flex flex-col items-stretch justify-center gap-3.5 sm:mt-12 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
                <Link
                  to="/contact"
                  className={primaryLinkClass}
                  data-track-cta={CTA.START_PROJECT}
                  data-track-location="about_cta"
                >
                  Start Your Project
                </Link>
                <Link
                  to="/contact"
                  className={secondaryLinkClass}
                  data-track-cta={CTA.GET_IN_TOUCH}
                  data-track-location="about_cta"
                >
                  Get in Touch
                </Link>
              </div>
              <WhatsAppCtaHint className="mt-5 sm:mt-6" location="about_cta" />
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}
