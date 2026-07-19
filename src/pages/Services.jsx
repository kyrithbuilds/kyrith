import BreadcrumbStructuredData from '../components/seo/BreadcrumbStructuredData'
import PageSEO from '../components/seo/PageSEO'
import FaqPageStructuredData from '../components/seo/FaqPageStructuredData'
import { SERVICES_FAQS } from '../config/faqs'
import { PAGE_SEO } from '../config/site'
import ServicesCta from '../components/services/ServicesCta'
import ServicesFaq from '../components/services/ServicesFaq'
import ServicesProof from '../components/services/ServicesProof'
import ServicesGrid from '../components/services/ServicesGrid'
import ServicesHero from '../components/services/ServicesHero'
import ServicesProcess from '../components/services/ServicesProcess'
import ServicesTechStrip from '../components/services/ServicesTechStrip'
import ServicesWhy from '../components/services/ServicesWhy'

export default function Services() {
  const seo = PAGE_SEO.services

  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <PageSEO title={seo.title} description={seo.description} path={seo.path} />
      <BreadcrumbStructuredData path={seo.path} />
      <FaqPageStructuredData path={seo.path} faqs={SERVICES_FAQS} />
      <ServicesHero />
      <ServicesGrid />
      <ServicesTechStrip />
      <ServicesProcess />
      <ServicesWhy />
      <ServicesProof />
      <ServicesFaq />
      <ServicesCta />
    </main>
  )
}
