import { Link } from 'react-router-dom'
import BreadcrumbStructuredData from '../components/seo/BreadcrumbStructuredData'
import PageSEO from '../components/seo/PageSEO'
import Container from '../components/ui/Container'
import Section from '../components/ui/Section'
import { BLOG_POSTS } from '../config/blogPosts'
import { PAGE_SEO } from '../config/site'

export default function BlogIndex() {
  const seo = PAGE_SEO.blog

  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <PageSEO title={seo.title} description={seo.description} path={seo.path} />
      <BreadcrumbStructuredData path={seo.path} />
      <Section className="bg-gradient-to-b from-[#eef4ff] via-[#f4f8ff] to-[#f8faff]" aria-labelledby="blog-heading">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h1
              id="blog-heading"
              className="text-[1.65rem] font-bold leading-[1.14] tracking-tight text-primary sm:text-4xl lg:text-[2.5rem]"
            >
              Notes on building with Bubble, MVPs and automation
            </h1>
            <p className="mt-5 text-base leading-relaxed text-textSecondary sm:text-lg">
              Practical answers from the KyrithBuilds team, based on what we build for clients.
            </p>
            <ul className="mt-10 flex list-none flex-col gap-5">
              {BLOG_POSTS.map(({ slug, path, h1, excerpt, date }) => (
                <li key={slug}>
                  <article className="rounded-xl border border-border bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-secondary/25">
                    <h2 className="text-xl font-semibold tracking-tight text-primary">
                      <Link to={path} className="hover:text-secondary">
                        {h1}
                      </Link>
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-textSecondary">{excerpt}</p>
                    <p className="mt-3 text-xs text-textSecondary/80">
                      <time dateTime={date}>{date}</time>
                    </p>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>
    </main>
  )
}
