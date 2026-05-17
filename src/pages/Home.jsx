import PageSEO from '../components/seo/PageSEO'
import { PAGE_SEO } from '../config/site'
import Hero from '../components/Hero'
import TechStack from '../components/TechStack'
import HomeCta from '../components/home/HomeCta'
import HomeProof from '../components/home/HomeProof'
import Process from '../components/home/Process'
import WhatWeDo from '../components/home/WhatWeDo'

export default function Home() {
  const seo = PAGE_SEO.home

  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <PageSEO title={seo.title} description={seo.description} path={seo.path} />
      <Hero />
      <HomeProof />
      <WhatWeDo />
      <TechStack />
      <Process />
      <HomeCta />
    </main>
  )
}
