import bubble from '../../assets/tech/bubble.svg'
import webflow from '../../assets/tech/webflow.svg'
import wordpress from '../../assets/tech/wordpress.svg'
import shopify from '../../assets/tech/shopify.svg'
import react from '../../assets/tech/react.svg'
import nodejs from '../../assets/tech/nodejs.svg'
import make from '../../assets/tech/make.svg'
import google from '../../assets/tech/google.svg'
import twilio from '../../assets/tech/twilio.svg'
import HomeSection from '../home/HomeSection'
import { techLogoStripImgClass, techLogoStripWrapClass } from '../ui/siteStyles'

const logos = [
  { name: 'Bubble.io', src: bubble, label: 'Bubble' },
  { name: 'Webflow', src: webflow, label: 'Webflow' },
  { name: 'WordPress', src: wordpress, label: 'WordPress' },
  { name: 'Shopify', src: shopify, label: 'Shopify' },
  { name: 'React', src: react, label: 'React' },
  { name: 'Node.js', src: nodejs, label: 'Node' },
  { name: 'Make.com', src: make, label: 'Make' },
  { name: 'Twilio', src: twilio, label: 'Twilio' },
  { name: 'Google APIs', src: google, label: 'Google APIs' },
]

export default function ServicesTechStrip() {
  return (
    <HomeSection
      id="services-tech"
      sectionClass="bg-section"
      revealDelay={80}
      title="Tools We Use To Ship Faster"
      intro="Proven platforms and integrations chosen for speed, reliability, and fit."
    >
      <ul className="mx-auto mt-10 flex max-w-4xl list-none flex-wrap justify-center gap-x-8 gap-y-8 sm:mt-11 sm:gap-x-10 sm:gap-y-9 lg:max-w-5xl">
        {logos.map(({ name, src, label }) => (
          <li key={name} className="group flex w-[5.5rem] flex-col items-center sm:w-24">
            <div className={`${techLogoStripWrapClass} w-full`}>
              <img
                src={src}
                alt={name}
                loading="lazy"
                decoding="async"
                className={techLogoStripImgClass}
              />
            </div>
            <span className="mt-2 text-[0.625rem] font-medium text-textSecondary/80 transition-colors duration-300 group-hover:text-secondary/90 sm:text-[0.6875rem]">
              {label}
            </span>
          </li>
        ))}
      </ul>
    </HomeSection>
  )
}
