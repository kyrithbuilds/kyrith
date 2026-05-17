import { Link } from 'react-router-dom'
import aboutIllustration from '../../assets/about-hero-illustration.png'
import Container from '../ui/Container'
import { primaryLinkClass, secondaryLinkClass } from '../ui/linkButtons'
import { CTA } from '../../config/analytics'
import WhatsAppCtaHint from '../whatsapp/WhatsAppCtaHint'

const trustChips = ['Bubble.io', 'React', 'Automation', 'APIs', 'Shopify']

export default function AboutHero() {
  return (
    <section
      className="relative overflow-x-hidden bg-gradient-to-b from-[#eef4ff] via-[#f4f8ff] to-[#f8faff] py-14 sm:py-20 lg:py-28"
      aria-labelledby="about-hero-heading"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-80 w-[min(100%,900px)] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(65,114,244,0.08),transparent_68%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-32 top-[18%] h-72 w-72 rounded-full bg-secondary/[0.07] blur-3xl"
        aria-hidden
      />

      <Container className="relative z-10">
        <div className="grid items-center gap-10 sm:gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-12 xl:gap-16">
          <div className="max-w-xl lg:max-w-none">
            <h1
              id="about-hero-heading"
              className="animate-hero-fade-up text-[1.65rem] font-bold leading-[1.18] tracking-tight text-primary min-[375px]:text-[1.85rem] sm:text-4xl sm:leading-[1.14] lg:text-[2.65rem] lg:leading-[1.12]"
            >
              Building software that solves problems,{' '}
              <span className="font-semibold text-[#2f4575] sm:font-bold">
                not software that creates more.
              </span>
            </h1>
            <p className="animate-hero-fade-up animate-hero-delay-1 mt-7 max-w-xl text-pretty text-base leading-relaxed text-textSecondary sm:mt-8 sm:text-lg sm:leading-relaxed lg:mt-9">
              KyrithBuilds helps businesses streamline operations with reliable software, no-code
              tools, and integrations that remove manual work.
            </p>
            <div className="animate-hero-fade-up animate-hero-delay-2 mt-10 flex flex-col gap-3.5 sm:mt-11 sm:flex-row sm:items-center sm:gap-4 lg:mt-12">
              <Link
                to="/contact"
                className={primaryLinkClass}
                data-track-cta={CTA.START_PROJECT}
                data-track-location="about_hero"
              >
                Start Your Project
              </Link>
              <Link to="/services" className={secondaryLinkClass}>
                View Services
              </Link>
            </div>
            <WhatsAppCtaHint className="mt-4" location="about_hero" />
            <ul
              className="animate-hero-fade-up animate-hero-delay-3 mt-10 flex flex-wrap gap-2 sm:mt-11 lg:mt-12"
              aria-label="Technologies and capabilities"
            >
              {trustChips.map((chip) => (
                <li
                  key={chip}
                  className="rounded-full border border-primary/[0.05] bg-white/35 px-3 py-1 text-[0.6875rem] font-medium tracking-tight text-textSecondary/70 backdrop-blur-sm transition-colors duration-200 hover:border-primary/[0.08] hover:bg-white/50 hover:text-textSecondary/85"
                >
                  {chip}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative mx-auto flex w-full max-w-lg items-center justify-center overflow-hidden sm:max-w-xl lg:mx-0 lg:max-w-none lg:min-h-[420px] lg:justify-end">
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 h-[min(95vw,520px)] w-[min(110vw,580px)] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(65,114,244,0.12),rgba(2,29,65,0.06)_42%,transparent_72%)] blur-3xl sm:h-[min(88vw,560px)] sm:w-[min(105vw,640px)] lg:left-[55%] lg:h-[min(520px,92%)] lg:w-[min(680px,115%)]"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute left-1/2 top-[52%] h-[min(70vw,380px)] w-[min(85vw,440px)] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-[radial-gradient(closest-side,rgba(65,114,244,0.1),transparent)] blur-2xl lg:left-[58%]"
              aria-hidden
            />

            <div className="animate-hero-fade-up animate-hero-delay-1 relative z-[1] w-full lg:translate-x-[4%]">
              <img
                src={aboutIllustration}
                alt="Team collaborating on software and automation projects"
                width={800}
                height={600}
                decoding="async"
                className="animate-about-hero-float mx-auto h-auto w-full max-w-[min(100%,440px)] object-contain drop-shadow-[0_24px_48px_-20px_rgba(2,29,65,0.12)] sm:max-w-[500px] lg:max-w-[min(100%,640px)] lg:w-[110%] xl:max-w-[720px]"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
