import { useEffect } from 'react'
import { SITE_NAME, SITE_URL } from '../../config/site'

const SCRIPT_ID = 'kyrithbuilds-article-schema'

/**
 * Injects Article JSON-LD for a blog post.
 * @param {{ path: string, h1: string, meta: string, date: string, updated?: string }} post
 */
export default function ArticleStructuredData({ post }) {
  useEffect(() => {
    const base = SITE_URL.replace(/\/$/, '')
    const organization = { '@type': 'Organization', name: SITE_NAME, url: base }
    const payload = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.h1,
      description: post.meta,
      datePublished: post.date,
      dateModified: post.updated || post.date,
      mainEntityOfPage: `${base}${post.path}`,
      inLanguage: 'en',
      author: organization,
      publisher: organization,
    })

    let script = document.getElementById(SCRIPT_ID)
    if (!script) {
      script = document.createElement('script')
      script.id = SCRIPT_ID
      script.type = 'application/ld+json'
      document.head.appendChild(script)
    }
    script.textContent = payload

    return () => {
      script?.remove()
    }
  }, [post])

  return null
}
