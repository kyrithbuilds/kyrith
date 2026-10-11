import { Link, Navigate, useParams } from 'react-router-dom'
import ArticleStructuredData from '../components/seo/ArticleStructuredData'
import BreadcrumbStructuredData from '../components/seo/BreadcrumbStructuredData'
import FaqPageStructuredData from '../components/seo/FaqPageStructuredData'
import PageSEO from '../components/seo/PageSEO'
import ContentTable from '../components/ui/ContentTable'
import Container from '../components/ui/Container'
import InlineLinks from '../components/ui/InlineLinks'
import Section from '../components/ui/Section'
import { BLOG_POSTS } from '../config/blogPosts'

const formatDate = (iso) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })

export default function BlogPost() {
  const { slug } = useParams()
  const post = BLOG_POSTS.find((item) => item.slug === slug)
  if (!post) return <Navigate to="/blog" replace />

  const { h1, intro, sections, ctaEnd, author, date, updated, title, meta, path } = post
  const faqs = sections.map(({ question, answer }) => ({ question, answer }))

  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <PageSEO title={title} description={meta} path={path} />
      <BreadcrumbStructuredData path={path} />
      <ArticleStructuredData post={post} />
      <FaqPageStructuredData path={path} faqs={faqs} />

      <Section className="bg-gradient-to-b from-[#eef4ff] via-[#f4f8ff] to-[#f8faff]" aria-labelledby="blog-post-heading">
        <Container>
          <div className="mx-auto max-w-3xl">
            <p className="text-sm text-textSecondary">
              <Link to="/blog" className="font-medium text-secondary underline-offset-2 hover:underline">
                Blog
              </Link>
            </p>
            <h1
              id="blog-post-heading"
              className="mt-3 text-[1.65rem] font-bold leading-[1.14] tracking-tight text-primary sm:text-4xl lg:text-[2.5rem]"
            >
              {h1}
            </h1>
            <p className="mt-3 text-sm text-textSecondary">
              By the KyrithBuilds team · Published <time dateTime={date}>{formatDate(date)}</time>
              {updated && updated !== date ? (
                <>
                  {' '}
                  · Updated <time dateTime={updated}>{formatDate(updated)}</time>
                </>
              ) : null}
            </p>
            <p className="mt-6 text-base leading-relaxed text-textSecondary sm:text-lg">{intro}</p>
          </div>
        </Container>
      </Section>

      {sections.map(({ question, answer, detail, table }, index) => (
        <Section key={question} variant={index % 2 === 0 ? 'default' : 'muted'} aria-labelledby={`blog-h2-${index}`}>
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 id={`blog-h2-${index}`} className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
                {question}
              </h2>
              <p className="mt-5 text-base font-medium leading-relaxed text-primary/90 sm:text-lg">
                <InlineLinks text={answer} />
              </p>
              {detail ? (
                <p className="mt-4 text-base leading-relaxed text-textSecondary">
                  <InlineLinks text={detail} />
                </p>
              ) : null}
              {table ? <ContentTable table={table} /> : null}
            </div>
          </Container>
        </Section>
      ))}

      <Section className="bg-gradient-to-b from-[#e8f0ff] via-[#f2f6fd] to-[#f8faff]" aria-label="About this article">
        <Container>
          <div className="mx-auto max-w-3xl">
            <p className="text-base leading-relaxed text-primary/90 sm:text-lg">
              <InlineLinks text={ctaEnd} />
            </p>
            <p className="mt-6 border-t border-primary/[0.08] pt-6 text-sm leading-relaxed text-textSecondary">{author}</p>
          </div>
        </Container>
      </Section>
    </main>
  )
}
