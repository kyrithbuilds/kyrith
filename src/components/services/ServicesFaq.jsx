import { useState } from 'react'
import { SERVICES_FAQS } from '../../config/faqs'
import HomeSection from '../home/HomeSection'

const faqs = SERVICES_FAQS

function Chevron({ open }) {
  return (
    <svg
      className={`h-5 w-5 shrink-0 text-secondary/80 transition-all duration-300 ease-out group-hover:text-secondary ${open ? 'rotate-180 text-secondary' : ''}`}
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

export default function ServicesFaq() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <HomeSection
      id="services-faq"
      sectionClass="bg-background"
      revealDelay={400}
      title="Questions We're Often Asked"
      intro="Clear answers before you reach out, so you know what working with KyrithBuilds looks like."
    >
      <ul className="mx-auto mt-11 flex max-w-2xl list-none flex-col gap-3 sm:mt-12 sm:gap-3.5">
        {faqs.map(({ question, answer }, index) => {
          const isOpen = openIndex === index
          const panelId = `faq-panel-${index}`
          const buttonId = `faq-button-${index}`

          return (
            <li key={question}>
              <div
                className={`group overflow-hidden rounded-xl border transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-10px_rgba(65,114,244,0.15)] ${
                  isOpen
                    ? 'border-secondary/22 bg-[#f6f9ff]'
                    : 'border-border/90 bg-background hover:border-secondary/18 hover:bg-section/50'
                }`}
              >
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-secondary/25 sm:px-6 sm:py-[1.125rem]"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  >
                    <span
                      className={`text-base font-semibold transition-colors duration-300 sm:text-[1.0625rem] ${
                        isOpen ? 'text-primary' : 'text-primary/90 group-hover:text-primary'
                      }`}
                    >
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
                    <p className="max-w-prose px-5 pb-5 pt-0 text-sm leading-[1.65] text-textSecondary sm:px-6 sm:pb-6 sm:text-[0.9375rem]">
                      {answer}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </HomeSection>
  )
}
