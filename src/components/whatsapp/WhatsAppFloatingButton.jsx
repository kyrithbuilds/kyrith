import { WHATSAPP_PRIMARY } from '../../config/contact'
import WhatsAppIcon from './WhatsAppIcon'

export default function WhatsAppFloatingButton() {
  return (
    <a
      href={WHATSAPP_PRIMARY.href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-secondary/20 bg-white/95 text-secondary shadow-[0_8px_28px_-6px_rgba(65,114,244,0.35),0_2px_8px_-2px_rgba(2,29,65,0.08)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-secondary/35 hover:bg-white hover:shadow-[0_12px_36px_-8px_rgba(65,114,244,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 sm:bottom-6 sm:right-6 sm:h-auto sm:w-auto sm:gap-2 sm:rounded-full sm:px-4 sm:py-2.5"
      data-track-whatsapp=""
      data-track-location="floating_button"
      data-track-phone={WHATSAPP_PRIMARY.display}
      aria-label="WhatsApp us"
    >
      <WhatsAppIcon className="h-[1.125rem] w-[1.125rem] sm:h-4 sm:w-4" />
      <span className="hidden text-sm font-semibold sm:inline">WhatsApp us</span>
    </a>
  )
}
