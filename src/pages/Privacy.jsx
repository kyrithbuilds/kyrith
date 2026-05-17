import LegalDocument, { LegalSection } from '../components/legal/LegalDocument'
import PageSEO from '../components/seo/PageSEO'
import { PAGE_SEO, SITE_EMAIL } from '../config/site'

const UPDATED = 'May 16, 2026'

export default function Privacy() {
  const seo = PAGE_SEO.privacy

  return (
    <>
      <PageSEO title={seo.title} description={seo.description} path={seo.path} />
      <LegalDocument
        title="Privacy Policy"
        intro="This policy explains how KyrithBuilds collects and uses information when you visit our website or contact us."
        updated={UPDATED}
      >
        <LegalSection title="Information we collect">
          <p>
            When you use our contact form, we collect the details you provide, such as your name,
            email address, company name (if provided), project description, and timeline or budget
            notes.
          </p>
          <p>
            We may also collect basic technical information when you browse our site, such as browser
            type, device type, and pages visited, through standard server logs or analytics tools if
            enabled.
          </p>
        </LegalSection>

        <LegalSection title="How we use your information">
          <p>
            We use contact form submissions to respond to inquiries, evaluate project fit, and
            communicate about potential work. We do not sell your personal information.
          </p>
          <p>
            Email delivery for contact forms may be processed by third-party providers (for example,
            SendGrid) solely to deliver messages to our team.
          </p>
        </LegalSection>

        <LegalSection title="Cookies and analytics">
          <p>
            We use Google Analytics to understand how visitors use our website (for example, pages
            viewed and general interaction patterns). Google may set cookies or use similar
            technologies as part of this service. You can learn more in{' '}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-secondary hover:underline"
            >
              Google&apos;s Privacy Policy
            </a>
            .
          </p>
          <p>
            Our website also uses essential cookies required for basic functionality. We do not use
            advertising cookies at this time.
          </p>
        </LegalSection>

        <LegalSection title="Data retention">
          <p>
            We retain contact inquiries for as long as needed to respond, maintain business records,
            and comply with legal obligations, then delete or anonymize them when no longer required.
          </p>
        </LegalSection>

        <LegalSection title="Your rights">
          <p>
            Depending on your location, you may have rights to access, correct, or delete personal
            information we hold about you. To make a request, email us at{' '}
            <a href={`mailto:${SITE_EMAIL}`} className="font-semibold text-secondary hover:underline">
              {SITE_EMAIL}
            </a>
            .
          </p>
        </LegalSection>

        <LegalSection title="Contact">
          <p>
            Questions about this policy? Email{' '}
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
