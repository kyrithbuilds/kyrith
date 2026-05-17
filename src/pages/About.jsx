import PageSEO from '../components/seo/PageSEO'
import { PAGE_SEO } from '../config/site'
import AboutBeliefs from '../components/about/AboutBeliefs'
import AboutClients from '../components/about/AboutClients'
import AboutCta from '../components/about/AboutCta'
import AboutHero from '../components/about/AboutHero'
import AboutMission from '../components/about/AboutMission'
import AboutProcess from '../components/about/AboutProcess'
import AboutTech from '../components/about/AboutTech'

export default function About() {
  const seo = PAGE_SEO.about

  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <PageSEO title={seo.title} description={seo.description} path={seo.path} />
      <AboutHero />
      <AboutMission />
      <AboutBeliefs />
      <AboutTech />
      <AboutProcess />
      <AboutClients />
      <AboutCta />
    </main>
  )
}
