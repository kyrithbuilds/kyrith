import { WHATSAPP_NUMBERS } from '../../config/contact'
import WhatsAppIcon from './WhatsAppIcon'
import { whatsappNumberLinkClass } from './whatsappStyles'

export default function WhatsAppNumberList({
  className = '',
  iconClassName = 'h-3.5 w-3.5',
  location = 'unknown',
}) {
  return (
    <ul className={`flex flex-col gap-2 ${className}`}>
      {WHATSAPP_NUMBERS.map(({ display, href }) => (
        <li key={href}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={whatsappNumberLinkClass}
            data-track-whatsapp=""
            data-track-location={location}
            data-track-phone={display}
          >
            <WhatsAppIcon className={`${iconClassName} shrink-0 opacity-80`} />
            {display}
          </a>
        </li>
      ))}
    </ul>
  )
}
