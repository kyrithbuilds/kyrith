/**
 * Build FAQPage JSON-LD from visible FAQ items (Google Rich Results compatible).
 * @see https://developers.google.com/search/docs/appearance/structured-data/faqpage
 */
export function buildFaqPageSchema(faqs, pageUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${pageUrl}#faq`,
    url: pageUrl,
    mainEntity: faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  }
}
