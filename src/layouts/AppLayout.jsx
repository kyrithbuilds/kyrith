import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import StructuredData from '../components/seo/StructuredData'
import WhatsAppFloatingButton from '../components/whatsapp/WhatsAppFloatingButton'

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col antialiased">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-secondary"
      >
        Skip to main content
      </a>
      <StructuredData />
      <Navbar />
      <Outlet />
      <Footer />
      <WhatsAppFloatingButton />
    </div>
  )
}
