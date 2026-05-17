import PageSEO from '../components/seo/PageSEO'
import { PAGE_SEO } from '../config/site'
import ContactExplore from '../components/contact/ContactExplore'
import ContactFaq from '../components/contact/ContactFaq'
import ContactHero from '../components/contact/ContactHero'

export default function Contact() {
  const seo = PAGE_SEO.contact

  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <PageSEO title={seo.title} description={seo.description} path={seo.path} />
      <ContactHero />
      <ContactFaq />
      <ContactExplore />
    </main>
  )
}
