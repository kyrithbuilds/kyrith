import { Link } from 'react-router-dom'
import blobPng from '../../assets/blob.png'
import Container from '../ui/Container'
import { primaryLinkClass } from '../ui/linkButtons'
import { CTA } from '../../config/analytics'
import WhatsAppCtaHint from '../whatsapp/WhatsAppCtaHint'

export default function ServicesHero() {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-[#eef4ff] via-[#f4f8ff] to-[#f8faff] py-14 sm:py-20 lg:py-24"
      aria-labelledby="services-hero-heading"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-64 w-[min(100%,720px)] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(65,114,244,0.1),transparent_70%)]"
        aria-hidden
      />
      <img
        src={blobPng}
        alt=""
        width={800}
        height={800}
        decoding="async"
        className="pointer-events-none absolute top-1/2 right-0 z-[1] h-auto w-[min(72vw,420px)] max-w-none -translate-y-1/2 translate-x-[min(28%,6rem)] select-none opacity-[0.35] blur-2xl max-sm:opacity-[0.1] sm:w-[min(80vw,560px)] sm:translate-x-[min(40%,10rem)] sm:opacity-[0.4] lg:w-[min(90vw,720px)] lg:translate-x-[min(48%,14rem)] lg:opacity-[0.45]"
        aria-hidden
      />

      <Container className="relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <h1
            id="services-hero-heading"
            className="animate-hero-fade-up text-[1.65rem] font-bold leading-[1.14] tracking-tight text-primary min-[375px]:text-[1.85rem] sm:text-4xl sm:leading-[1.1] lg:text-[2.65rem]"
          >
            <span className="block">Build Faster.</span>
            <span className="block">Automate Smarter.</span>
            <span className="mt-1 block bg-gradient-to-r from-[#4A62A8] via-[#556FAE] to-[#5E78B4] bg-clip-text text-transparent">
              Operations That Hold.
            </span>
          </h1>
          <p className="animate-hero-fade-up animate-hero-delay-1 mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-textSecondary sm:mt-6 sm:text-lg">
            Software and connected workflows designed around how your business actually runs day to day.
          </p>
          <div className="animate-hero-fade-up animate-hero-delay-2 mt-8 flex flex-col items-center sm:mt-10">
            <Link
              to="/contact"
              className={primaryLinkClass}
              data-track-cta={CTA.START_PROJECT}
              data-track-location="services_hero"
            >
              Start Your Project
            </Link>
            <WhatsAppCtaHint className="mt-4 text-center" location="services_hero" />
          </div>
        </div>
      </Container>
    </section>
  )
}
