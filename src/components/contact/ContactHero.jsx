import { useEffect, useRef, useState } from 'react'
import { submitContact } from '../../api/contact'
import { CTA } from '../../config/analytics'
import { trackContactFormSubmit } from '../../lib/analytics'
import { WHATSAPP_PRIMARY } from '../../config/contact'
import Container from '../ui/Container'
import ContactSuccess from './ContactSuccess'
import WhatsAppPreferBlock from '../whatsapp/WhatsAppPreferBlock'
import { inputClass, labelClass, submitClass, textareaClass } from './contactFormStyles'

const helpTopics = ['MVPs', 'Workflow improvements', 'Custom software', 'Existing systems', 'Internal tools']

const reassurance = [
  'Usually reply within 1 to 2 business days',
  'Remote-first, worldwide',
  'No pressure sales conversations',
  'Existing systems welcome',
  'Practical recommendations',
]

function buildMessage({ project, company, timeline }) {
  const sections = []
  if (company.trim()) {
    sections.push(`Company: ${company.trim()}`)
  }
  sections.push(project.trim())
  if (timeline.trim()) {
    sections.push(`Timeline or budget: ${timeline.trim()}`)
  }
  return sections.join('\n\n')
}

export default function ContactHero() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [project, setProject] = useState('')
  const [timeline, setTimeline] = useState('')
  const [status, setStatus] = useState('idle')
  const [feedback, setFeedback] = useState('')
  const successRef = useRef(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    setFeedback('')
    try {
      await submitContact({
        name,
        email,
        company,
        timeline,
        message: buildMessage({ project, company, timeline }),
      })
      setStatus('success')
      trackContactFormSubmit()
      setFeedback('')
      setName('')
      setEmail('')
      setCompany('')
      setProject('')
      setTimeline('')
    } catch (err) {
      setStatus('error')
      const apiMessage = err instanceof Error ? err.message : ''
      setFeedback(apiMessage && !apiMessage.includes('PHP is not running') ? apiMessage : '')
    }
  }

  useEffect(() => {
    if (status !== 'success' || !successRef.current) return
    successRef.current.focus({ preventScroll: true })
    successRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [status])

  const cardClass =
    'rounded-2xl border border-secondary/[0.14] bg-white p-5 shadow-[0_12px_48px_-16px_rgba(65,114,244,0.18),0_4px_16px_-4px_rgba(2,29,65,0.06)] sm:p-8 lg:p-10'

  return (
    <section
      className="relative overflow-x-hidden bg-gradient-to-b from-[#eef4ff] via-[#f4f8ff] to-[#f8faff] py-14 sm:py-20 lg:py-24"
      aria-labelledby="contact-hero-heading"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[min(100%,800px)] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(65,114,244,0.09),transparent_70%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 top-1/4 h-64 w-64 rounded-full bg-secondary/[0.07] blur-3xl"
        aria-hidden
      />

      <Container className="relative z-10">
        <div className="grid items-start gap-10 sm:gap-12 lg:grid-cols-2 lg:gap-14 xl:gap-16">
          <div className="max-w-xl lg:pt-2">
            <h1
              id="contact-hero-heading"
              className="text-[1.65rem] font-bold leading-[1.16] tracking-tight text-primary min-[375px]:text-[1.85rem] sm:text-4xl sm:leading-[1.12] lg:text-[2.5rem]"
            >
              Let&apos;s talk about what you&apos;re trying to solve
            </h1>
            <p className="mt-6 max-w-lg text-pretty text-base leading-[1.65] text-textSecondary sm:text-lg">
              Tell us what is not working today or what you want to improve. We help teams with
              MVPs, workflow improvements, custom software, existing systems, and internal tools.
            </p>

            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Areas we help with">
              {helpTopics.map((topic) => (
                <li
                  key={topic}
                  className="rounded-full border border-primary/[0.06] bg-white/50 px-3 py-1 text-xs font-medium text-textSecondary/80 backdrop-blur-sm"
                >
                  {topic}
                </li>
              ))}
            </ul>

            <ul className="mt-9 space-y-3 border-t border-primary/[0.06] pt-9 sm:mt-10" aria-label="What to expect">
              {reassurance.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-snug text-textSecondary/90 sm:text-[0.9375rem]">
                  <span className="mt-0.5 shrink-0 font-medium text-secondary/80" aria-hidden>
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <p className="mt-8 text-sm text-textSecondary/80">
              Prefer email?{' '}
              <a
                href="mailto:info@kyrithbuilds.com"
                className="font-semibold text-secondary transition-colors hover:text-secondaryLight"
              >
                info@kyrithbuilds.com
              </a>
            </p>
            <WhatsAppPreferBlock className="mt-6" />
          </div>

          <div className="lg:sticky lg:top-28">
            {status === 'success' ? (
              <ContactSuccess ref={successRef} />
            ) : (
            <form onSubmit={handleSubmit} className={cardClass} noValidate>
              <p className="text-sm font-semibold text-primary">Start a conversation</p>
              <p className="mt-1.5 text-sm leading-relaxed text-textSecondary/85">
                Share as much or as little as you like. We will follow up with practical next steps.
              </p>

              <div className="mt-8 space-y-5 sm:space-y-6">
                <div>
                  <label htmlFor="contact-name" className={labelClass}>
                    Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    maxLength={200}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className={labelClass}>
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="contact-company" className={labelClass}>
                    Company <span className="font-normal text-textSecondary/70">(optional)</span>
                  </label>
                  <input
                    id="contact-company"
                    name="company"
                    type="text"
                    autoComplete="organization"
                    maxLength={200}
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="contact-project" className={labelClass}>
                    What are you trying to build or improve?
                  </label>
                  <textarea
                    id="contact-project"
                    name="project"
                    required
                    minLength={10}
                    maxLength={10000}
                    rows={5}
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                    placeholder="Describe the problem, who it affects, and what success looks like."
                    className={textareaClass}
                  />
                </div>
                <div>
                  <label htmlFor="contact-timeline" className={labelClass}>
                    Timeline or budget{' '}
                    <span className="font-normal text-textSecondary/70">(optional)</span>
                  </label>
                  <input
                    id="contact-timeline"
                    name="timeline"
                    type="text"
                    maxLength={500}
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    placeholder="e.g. MVP in 6 weeks, or flexible on scope"
                    className={inputClass}
                  />
                </div>
              </div>

              {status === 'error' ? (
                <div role="alert" className="mt-5 rounded-xl border border-red-200/80 bg-red-50/80 px-4 py-3.5 text-sm leading-relaxed text-red-800">
                  <p className="font-medium">Something went wrong.</p>
                  <p className="mt-1">
                    {feedback || 'Please try again or message us on WhatsApp directly.'}
                  </p>
                  <p className="mt-2">
                    <a
                      href={WHATSAPP_PRIMARY.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-secondary underline-offset-2 hover:underline"
                      data-track-whatsapp=""
                      data-track-location="contact_form_error"
                      data-track-phone={WHATSAPP_PRIMARY.display}
                    >
                      WhatsApp us directly
                    </a>
                  </p>
                </div>
              ) : null}

              <button
                type="submit"
                disabled={status === 'sending'}
                aria-busy={status === 'sending'}
                className={`mt-6 ${submitClass}`}
              >
                {status === 'sending' ? 'Sending…' : 'Start conversation'}
              </button>
            </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
