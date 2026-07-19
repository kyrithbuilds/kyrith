import { useState } from 'react'
import { CONTACT_FAQS } from '../../config/faqs'
import Container from '../ui/Container'
import Section from '../ui/Section'

const faqs = CONTACT_FAQS

function Chevron({ open }) {
  return (
    <svg
      className={`h-5 w-5 shrink-0 text-secondary/80 transition-all duration-300 ease-out ${open ? 'rotate-180 text-secondary' : ''}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

export default function ContactFaq() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <Section id="contact-faq" className="bg-section" aria-labelledby="contact-faq-heading">
      <Container>
        <div className="mx-auto max-w-2xl">
          <h2
            id="contact-faq-heading"
            className="text-center text-xl font-bold tracking-tight text-primary sm:text-2xl"
          >
            Before you reach out
          </h2>
          <ul className="mt-8 list-none space-y-3 sm:mt-10">
            {faqs.map(({ question, answer }, index) => {
              const isOpen = openIndex === index
              const panelId = `contact-faq-panel-${index}`
              const buttonId = `contact-faq-button-${index}`

              return (
                <li key={question}>
                  <div
                    className={`group overflow-hidden rounded-xl border bg-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-10px_rgba(65,114,244,0.15)] ${
                      isOpen
                        ? 'border-secondary/22 shadow-[0_4px_16px_-8px_rgba(65,114,244,0.12)]'
                        : 'border-primary/[0.07] hover:border-secondary/18'
                    }`}
                  >
                    <h3>
                      <button
                        type="button"
                        id={buttonId}
                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-secondary/25 sm:px-6"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => setOpenIndex(isOpen ? -1 : index)}
                      >
                        <span className="text-sm font-semibold text-primary sm:text-base">
                          {question}
                        </span>
                        <Chevron open={isOpen} />
                      </button>
                    </h3>
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
                        isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="max-w-prose px-5 pb-5 pt-0 text-sm leading-[1.65] text-textSecondary sm:px-6 sm:pb-6">
                          {answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </Container>
    </Section>
  )
}
