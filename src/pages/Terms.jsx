import LegalDocument, { LegalSection } from '../components/legal/LegalDocument'
import PageSEO from '../components/seo/PageSEO'
import { PAGE_SEO, SITE_EMAIL } from '../config/site'

const UPDATED = 'May 16, 2026'

export default function Terms() {
  const seo = PAGE_SEO.terms

  return (
    <>
      <PageSEO title={seo.title} description={seo.description} path={seo.path} />
      <LegalDocument
        title="Terms of Service"
        intro="These terms govern your use of the KyrithBuilds website. Separate agreements apply to paid project work."
        updated={UPDATED}
      >
        <LegalSection title="Use of this website">
          <p>
            You may browse this website for lawful purposes. You agree not to misuse the site,
            attempt unauthorized access, or interfere with its operation.
          </p>
        </LegalSection>

        <LegalSection title="Services and proposals">
          <p>
            Information on this site is general in nature and does not constitute a binding offer.
            Project scope, timelines, fees, and deliverables are defined only in a written agreement
            or statement of work signed by both parties.
          </p>
        </LegalSection>

        <LegalSection title="Intellectual property">
          <p>
            Content on this website, including text, branding, and design, is owned by KyrithBuilds
            unless otherwise stated. You may not copy or redistribute site content without permission.
          </p>
          <p>
            Client project deliverables and ownership terms are defined in your project agreement.
          </p>
        </LegalSection>

        <LegalSection title="Disclaimer">
          <p>
            This website and any communications are provided &quot;as is&quot; without warranties of
            any kind. We do not guarantee specific business outcomes from using our site or services.
          </p>
        </LegalSection>

        <LegalSection title="Limitation of liability">
          <p>
            To the fullest extent permitted by law, KyrithBuilds is not liable for indirect,
            incidental, or consequential damages arising from your use of this website. Our total
            liability related to the site alone is limited to the amount you paid us for website-related
            services in the twelve months before the claim, if any.
          </p>
        </LegalSection>

        <LegalSection title="Changes">
          <p>
            We may update these terms from time to time. Continued use of the site after changes are
            posted constitutes acceptance of the updated terms.
          </p>
        </LegalSection>

        <LegalSection title="Contact">
          <p>
            Questions about these terms? Email{' '}
            <a href={`mailto:${SITE_EMAIL}`} className="font-semibold text-secondary hover:underline">
              {SITE_EMAIL}
            </a>
            .
          </p>
        </LegalSection>
      </LegalDocument>
    </>
  )
}
