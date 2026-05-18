import { Link, NavLink } from 'react-router-dom'
import fullLogo from '../assets/Full Logo.svg'
import { WHATSAPP_NUMBERS } from '../config/contact'
import { mainNavItems } from '../config/navigation'
// import { LINKEDIN_URL } from '../config/site'
import WhatsAppIcon from './whatsapp/WhatsAppIcon'
import { whatsappNumberLinkClass } from './whatsapp/whatsappStyles'
import Container from './ui/Container'

const footerLinkClass =
  'inline-flex min-h-[44px] items-center py-1 text-sm text-textSecondary/90 transition-colors duration-200 hover:text-secondary'

const footerNavLinkClass = ({ isActive }) =>
  `${footerLinkClass} ${isActive ? 'font-medium text-secondary' : ''}`

const columnTitleClass =
  'text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-primary/70'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-primary/[0.08] bg-[#e8eef8]">
      <Container className="py-12 sm:py-14 lg:py-16">
        <div className="grid gap-10 sm:gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Brand */}
          <div className="lg:col-span-5">
            <Link to="/" className="inline-block" aria-label="KyrithBuilds home">
              <img
                src={fullLogo}
                alt="KyrithBuilds"
                className="h-8 w-auto sm:h-9"
                width={160}
                height={36}
                loading="lazy"
                decoding="async"
              />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-textSecondary/90 sm:mt-6 sm:text-[0.9375rem] sm:leading-relaxed">
              Building software, automations, and web solutions for businesses that want to
              move faster.
            </p>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-3">
            <h2 className={columnTitleClass}>Navigation</h2>
            <nav className="mt-4 sm:mt-5" aria-label="Footer navigation">
              <ul className="flex flex-col gap-3 sm:gap-3.5">
                {mainNavItems.map(({ to, label, end }) => (
                  <li key={to}>
                    <NavLink to={to} end={end} className={footerNavLinkClass}>
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Contact */}
          <div className="lg:col-span-4">
            <h2 className={columnTitleClass}>Contact</h2>
            <ul className="mt-4 flex flex-col gap-3 sm:mt-5 sm:gap-3.5">
              <li>
                <span className="sr-only">Email</span>
                <a
                  href="mailto:info@kyrithbuilds.com"
                  className={`${footerLinkClass} font-medium`}
                  data-track-footer="email"
                >
                  info@kyrithbuilds.com
                </a>
              </li>
              {/* Re-enable when LinkedIn profile is ready:
              <li>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={footerLinkClass}
                  data-track-footer="linkedin"
                >
                  LinkedIn
                </a>
              </li>
              */}
              <li>
                <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-primary/60">
                  WhatsApp
                </span>
                <ul className="mt-2 flex flex-col gap-2">
                  {WHATSAPP_NUMBERS.map(({ display, href }) => (
                    <li key={href}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={whatsappNumberLinkClass}
                        data-track-footer="whatsapp"
                      >
                        <WhatsAppIcon className="h-3.5 w-3.5 shrink-0 opacity-75" />
                        {display}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="text-sm text-textSecondary/75">Remote-first · Worldwide</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-primary/[0.08] pt-8 sm:mt-14 sm:flex-row sm:items-center sm:justify-between sm:pt-9">
          <p className="text-sm font-medium text-primary/80">
            © {year} KyrithBuilds
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-textSecondary/75">
            <Link
              to="/privacy"
              className="inline-flex min-h-[44px] items-center transition-colors duration-200 hover:text-secondary"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="inline-flex min-h-[44px] items-center transition-colors duration-200 hover:text-secondary"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  )
}
