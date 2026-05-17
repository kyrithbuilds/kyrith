import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { primaryLinkClass, secondaryLinkClass } from '../ui/linkButtons'
import WhatsAppSuccessNote from '../whatsapp/WhatsAppSuccessNote'

const nextSteps = [
  'We review your inquiry',
  'We reply within 24 to 48 business hours',
  'We discuss goals and constraints',
  'We recommend the most practical path',
]

function SuccessIcon() {
  return (
    <div
      className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-secondary/20 bg-gradient-to-br from-[#e8f0ff] to-white shadow-[0_8px_24px_-8px_rgba(65,114,244,0.35)] sm:h-[4.5rem] sm:w-[4.5rem]"
      aria-hidden
    >
      <svg
        className="h-8 w-8 text-secondary sm:h-9 sm:w-9"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" strokeWidth="1.5" className="opacity-20" />
        <path
          d="M8 12.5l2.5 2.5L16 9"
          strokeWidth="2.25"
          className="contact-success-check"
        />
      </svg>
    </div>
  )
}

const ContactSuccess = forwardRef(function ContactSuccess(_props, ref) {
  return (
    <div
      ref={ref}
      className="animate-contact-success-in rounded-2xl border border-secondary/20 bg-gradient-to-br from-[#eef4ff] via-[#f5f9ff] to-white p-6 text-center shadow-[0_12px_48px_-16px_rgba(65,114,244,0.22),0_4px_16px_-4px_rgba(2,29,65,0.06)] sm:p-9 lg:p-11"
      role="status"
      aria-live="polite"
      tabIndex={-1}
    >
      <SuccessIcon />

      <h2 className="mt-7 text-2xl font-bold tracking-tight text-primary sm:text-[1.65rem]">
        Conversation started
      </h2>

      <div className="mx-auto mt-5 max-w-md space-y-4 text-left text-sm leading-[1.65] text-textSecondary sm:text-[0.9375rem]">
        <p>
          Thanks for reaching out. We&apos;ve received your inquiry and will review it shortly.
        </p>
        <p>
          You can expect a reply within 24 to 48 business hours. If your project is time-sensitive,
          mention it in your message and we&apos;ll prioritize where possible.
        </p>
      </div>

      <div className="mt-8 rounded-xl border border-primary/[0.06] bg-white/70 px-5 py-5 text-left sm:px-6">
        <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-secondary/90">
          What happens next?
        </h3>
        <ol className="mt-4 space-y-3">
          {nextSteps.map((step, index) => (
            <li key={step} className="flex gap-3 text-sm leading-snug text-textSecondary/90">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-xs font-bold text-secondary">
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <WhatsAppSuccessNote />

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
        <Link to="/services" className={primaryLinkClass}>
          Explore Services
        </Link>
        <Link to="/" className={secondaryLinkClass}>
          Back Home
        </Link>
      </div>
    </div>
  )
})

export default ContactSuccess
