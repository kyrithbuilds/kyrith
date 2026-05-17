import { WHATSAPP_PRIMARY } from '../../config/contact'
import { whatsappLinkClass } from './whatsappStyles'

export default function WhatsAppCtaHint({ className = 'mt-4', location = 'cta_section' }) {
  return (
    <p className={`text-sm text-textSecondary/80 ${className}`}>
      Prefer messaging?{' '}
      <a
        href={WHATSAPP_PRIMARY.href}
        target="_blank"
        rel="noopener noreferrer"
        className={whatsappLinkClass}
        data-track-whatsapp=""
        data-track-location={location}
        data-track-phone={WHATSAPP_PRIMARY.display}
      >
        WhatsApp us
      </a>
    </p>
  )
}
