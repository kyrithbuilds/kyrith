import WhatsAppNumberList from './WhatsAppNumberList'

export default function WhatsAppSuccessNote() {
  return (
    <div className="mx-auto mt-8 max-w-md rounded-xl border border-secondary/15 bg-white/60 px-5 py-5 text-left sm:px-6">
      <p className="text-sm font-semibold text-primary">Need a faster response?</p>
      <p className="mt-1.5 text-sm text-textSecondary/85">WhatsApp us directly.</p>
      <WhatsAppNumberList className="mt-4" location="contact_success" />
    </div>
  )
}
