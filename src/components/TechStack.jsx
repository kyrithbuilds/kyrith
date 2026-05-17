import bubble from '../assets/tech/bubble.svg'
import webflow from '../assets/tech/webflow.svg'
import wordpress from '../assets/tech/wordpress.svg'
import shopify from '../assets/tech/shopify.svg'
import react from '../assets/tech/react.svg'
import nodejs from '../assets/tech/nodejs.svg'
import make from '../assets/tech/make.svg'
import google from '../assets/tech/google.svg'
import calendar from '../assets/tech/calendar.svg'
import sendgrid from '../assets/tech/sendgrid.svg'
import twilio from '../assets/tech/twilio.svg'
import HomeSection from './home/HomeSection'
import { techLogoStripImgClass, techLogoStripWrapClass } from './ui/siteStyles'

const capabilities = [
  { name: 'Bubble.io', src: bubble, label: 'Rapid SaaS Development' },
  { name: 'Webflow', src: webflow, label: 'Marketing & Web Design' },
  { name: 'WordPress', src: wordpress, label: 'CMS & Content Sites' },
  { name: 'Shopify', src: shopify, label: 'E-commerce Solutions' },
  { name: 'React', src: react, label: 'Custom Frontends' },
  { name: 'Node.js', src: nodejs, label: 'Backend APIs' },
  { name: 'Make.com', src: make, label: 'Workflow Automation' },
  { name: 'Google APIs', src: google, label: 'Cloud Integrations' },
  { name: 'Google Calendar API', src: calendar, label: 'Scheduling & Bookings' },
  { name: 'SendGrid', src: sendgrid, label: 'Email Delivery' },
  { name: 'Twilio', src: twilio, label: 'Messaging & SMS' },
]

export default function TechStack() {
  return (
    <HomeSection
      id="capabilities"
      sectionClass="bg-section"
      revealDelay={80}
      title="Technologies We Use To Ship Faster"
      intro="Platforms and integrations we reach for when they match your timeline, workflow, and growth plans."
    >
      <ul className="mx-auto mt-11 flex w-full max-w-4xl list-none flex-wrap justify-center gap-x-6 gap-y-8 sm:mt-12 sm:max-w-5xl sm:gap-x-8 sm:gap-y-9 lg:max-w-6xl">
        {capabilities.map(({ name, src, label }) => (
          <li
            key={name}
            className="group flex w-[calc(50%-0.75rem)] max-w-[8.5rem] flex-col items-center justify-center sm:w-28 md:w-32"
          >
            <div className={`${techLogoStripWrapClass} w-full`}>
              <img
                src={src}
                alt={name}
                loading="lazy"
                decoding="async"
                className={techLogoStripImgClass}
              />
            </div>
            <p className="mx-auto mt-2.5 max-w-[9.5rem] text-center text-[0.6875rem] font-semibold leading-snug text-textSecondary/90 transition-colors duration-300 group-hover:text-primary/85 sm:mt-3 sm:text-xs">
              {label}
            </p>
          </li>
        ))}
      </ul>
    </HomeSection>
  )
}
