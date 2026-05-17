import WhatsAppNumberList from './WhatsAppNumberList'

export default function WhatsAppPreferBlock({ className = 'mt-5', location = 'contact_sidebar' }) {
  return (
    <div
      className={`rounded-xl border border-secondary/15 bg-gradient-to-br from-[#eef4ff]/80 to-white/90 px-5 py-5 shadow-[0_4px_20px_-8px_rgba(65,114,244,0.15)] sm:px-6 ${className}`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-secondary/90">
        Prefer WhatsApp?
      </p>
      <p className="mt-2 text-sm leading-relaxed text-textSecondary/90">
        Need a quicker response? Message us directly.
      </p>
      <WhatsAppNumberList className="mt-4" location={location} />
    </div>
  )
}
