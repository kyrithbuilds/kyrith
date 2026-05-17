import { Link } from 'react-router-dom'
import blobPng from '../assets/blob.png'
import Container from './ui/Container'
import { CTA } from '../config/analytics'
import WhatsAppCtaHint from './whatsapp/WhatsAppCtaHint'

const primaryBtnClass =
  'inline-flex min-h-[52px] w-full items-center justify-center rounded-xl bg-secondary px-8 py-3.5 text-sm font-semibold text-white shadow-[0_8px_32px_-6px_rgba(65,114,244,0.52),0_4px_14px_-4px_rgba(2,29,65,0.12)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#3568E8] hover:shadow-[0_14px_44px_-8px_rgba(65,114,244,0.55),0_6px_20px_-6px_rgba(65,114,244,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 active:translate-y-0 active:shadow-[0_6px_26px_-5px_rgba(65,114,244,0.45),0_2px_10px_-2px_rgba(2,29,65,0.1)] sm:w-auto sm:min-w-[168px]'

const secondaryBtnClass =
  'inline-flex min-h-[52px] w-full items-center justify-center rounded-xl border border-primary/[0.06] bg-white/35 px-8 py-3.5 text-sm font-medium text-primary/80 shadow-none backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-primary/10 hover:bg-white/55 hover:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/20 focus-visible:ring-offset-2 active:translate-y-0 sm:w-auto sm:min-w-[168px]'

const trustStats = [
  { value: '10+', label: 'Projects' },
  { value: '15+', label: 'Automations' },
  { value: '5+', label: 'Platforms' },
]

export default function Hero() {
  return (
    <section
      className="relative flex min-h-0 flex-col justify-center overflow-hidden bg-gradient-to-b from-[#eef4ff] via-[#fafcff] to-[#f4f8ff] py-16 sm:min-h-[calc(100dvh-7.5rem)] sm:py-24 lg:min-h-[calc(100dvh-8rem)] lg:py-32"
      aria-labelledby="hero-heading"
    >
      {/* Abstract blob: right, layered glow, subtle float */}
      <div
        className="pointer-events-none absolute top-1/2 right-0 z-[1] h-auto w-[min(118vw,1024px)] max-w-none animate-hero-blob-float max-sm:w-[min(72vw,300px)] max-sm:opacity-[0.16] lg:w-[min(105vw,1180px)]"
        aria-hidden
      >
        <div
          className="pointer-events-none absolute inset-0 -translate-x-[8%] scale-110 rounded-full bg-[radial-gradient(closest-side,rgba(65,114,244,0.14),transparent_70%)] blur-2xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-[10%] translate-x-[6%] scale-95 rounded-full bg-[radial-gradient(closest-side,rgba(88,118,200,0.1),transparent_65%)] blur-xl"
          aria-hidden
        />
        <img
          src={blobPng}
          alt=""
          width={800}
          height={800}
          decoding="async"
          className="relative h-auto w-full select-none opacity-[0.62] blur-lg sm:opacity-[0.58] sm:blur-xl"
        />
      </div>

      {/* Ambient wash */}
      <div
        className="pointer-events-none absolute left-1/2 top-[8%] z-[2] h-[min(72vw,520px)] w-[min(100%,900px)] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(closest-side,rgba(65,114,244,0.08),transparent)] blur-3xl sm:top-[10%]"
        aria-hidden
      />

      {/* Radial glow behind headline */}
      <div
        className="pointer-events-none absolute left-1/2 top-[38%] z-[3] h-[min(52vh,380px)] w-[min(92vw,720px)] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-[radial-gradient(ellipse_80%_70%_at_50%_50%,rgba(88,118,200,0.09),rgba(245,248,255,0.05)_45%,transparent_72%)] blur-3xl sm:top-[40%]"
        aria-hidden
      />

      {/* Accent blobs */}
      <div
        className="pointer-events-none absolute -left-32 top-1/3 z-[2] h-[380px] w-[380px] rounded-full bg-secondary/[0.08] blur-3xl sm:-left-20 sm:h-[440px] sm:w-[440px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-36 bottom-[12%] z-[2] h-[320px] w-[320px] rounded-full bg-secondary/[0.06] blur-3xl sm:-right-24 sm:bottom-[18%] sm:h-[400px] sm:w-[400px]"
        aria-hidden
      />

      {/* Bottom blend */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-40 bg-gradient-to-t from-[#f4f8ff]/90 to-transparent"
        aria-hidden
      />

      <Container className="relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <h1
            id="hero-heading"
            className="animate-hero-fade-up text-[1.65rem] font-bold leading-[1.08] tracking-[-0.02em] text-primary min-[375px]:text-[1.85rem] min-[414px]:text-[2rem] sm:text-5xl sm:leading-[1.03] lg:text-[3.35rem] lg:leading-[1.04]"
          >
            We Build Software That Businesses{' '}
            <span className="bg-gradient-to-r from-[#4A62A8] via-[#556FAE] to-[#5E78B4] bg-clip-text text-transparent">
              Rely On
            </span>
          </h1>
          <p className="animate-hero-fade-up animate-hero-delay-1 mx-auto mt-7 max-w-2xl text-pretty text-base font-medium leading-[1.65] text-textSecondary/90 sm:mt-8 sm:max-w-3xl sm:text-lg sm:leading-[1.7] lg:mt-9 lg:text-xl lg:leading-relaxed">
            Reliable software and clearer workflows that save time, remove manual work, and support
            steady business growth.
          </p>
          <div className="animate-hero-fade-up animate-hero-delay-2 mt-12 flex flex-col items-stretch justify-center gap-4 sm:mt-14 sm:flex-row sm:items-center sm:justify-center sm:gap-5">
            <Link
              to="/contact"
              className={primaryBtnClass}
              data-track-cta={CTA.GET_IN_TOUCH}
              data-track-location="home_hero"
            >
              Get in Touch
            </Link>
            <Link to="/services" className={secondaryBtnClass}>
              View Services
            </Link>
          </div>
          <WhatsAppCtaHint
            className="animate-hero-fade-up animate-hero-delay-2 mt-5 text-center sm:mt-6"
            location="home_hero"
          />

          <div
            className="animate-hero-fade-up animate-hero-delay-3 mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 border-t border-primary/[0.06] pt-10 sm:mt-14 sm:gap-x-12 sm:pt-11"
            aria-label="Track record"
          >
            {trustStats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-xl font-bold tracking-tight text-secondary sm:text-2xl">{value}</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-textSecondary/80 sm:text-[0.8125rem]">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
