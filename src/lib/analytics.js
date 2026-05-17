import { GA_MEASUREMENT_ID } from '../config/analytics'

/** Load GA in production, or locally when VITE_GA_ENABLED=true */
export function isAnalyticsEnabled() {
  return import.meta.env.PROD || import.meta.env.VITE_GA_ENABLED === 'true'
}

function gtag() {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag(...arguments)
  }
}

export function initGoogleAnalytics() {
  if (!isAnalyticsEnabled() || window.__gaInitialized) return

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtagCommand() {
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false,
    anonymize_ip: true,
  })

  window.__gaInitialized = true
}

export function trackPageView(path, title = document.title) {
  if (!isAnalyticsEnabled()) return
  gtag('event', 'page_view', {
    page_path: path,
    page_title: title,
    send_to: GA_MEASUREMENT_ID,
  })
}

export function trackEvent(eventName, params = {}) {
  if (!isAnalyticsEnabled()) return
  gtag('event', eventName, params)
}

export function trackCtaClick(ctaName, location) {
  trackEvent('cta_click', {
    cta_name: ctaName,
    link_location: location,
  })
}

export function trackWhatsAppClick(location, phone) {
  trackEvent('whatsapp_click', {
    link_location: location,
    phone_number: phone,
  })
}

export function trackContactFormSubmit() {
  trackEvent('contact_form_submit', {
    form_name: 'contact_hero',
  })
}

export function trackFooterContact(contactType) {
  trackEvent('footer_contact', {
    contact_type: contactType,
  })
}

/** Delegated click tracking via data attributes on links and buttons */
export function bindAnalyticsClickTracking() {
  if (!isAnalyticsEnabled()) return () => {}

  const onClick = (event) => {
    const target = event.target
    if (!(target instanceof Element)) return

    const ctaEl = target.closest('[data-track-cta]')
    if (ctaEl instanceof HTMLElement) {
      const ctaName = ctaEl.dataset.trackCta
      const location = ctaEl.dataset.trackLocation || 'unknown'
      if (ctaName) trackCtaClick(ctaName, location)
    }

    const waEl = target.closest('[data-track-whatsapp]')
    if (waEl instanceof HTMLElement) {
      const location = waEl.dataset.trackLocation || 'unknown'
      const phone = waEl.dataset.trackPhone || ''
      trackWhatsAppClick(location, phone)
    }

    const footerEl = target.closest('[data-track-footer]')
    if (footerEl instanceof HTMLElement) {
      const contactType = footerEl.dataset.trackFooter
      if (contactType) {
        trackFooterContact(contactType)
        return
      }
    }
  }

  document.addEventListener('click', onClick, true)
  return () => document.removeEventListener('click', onClick, true)
}
