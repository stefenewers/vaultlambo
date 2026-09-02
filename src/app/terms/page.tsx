import type { Metadata } from 'next';
import { Container } from '@/components/site/Container';
import { PageHeader } from '@/components/site/PageHeader';
import { isLicensedDealer, siteConfig } from '@/site.config';

export const metadata: Metadata = {
  title: 'Terms',
  description:
    'How to read the information on this site: manufacturer independence, verification ' +
    'of vehicle details, and the status of imagery.',
  alternates: { canonical: '/terms' },
};

/**
 * Terms and disclaimers.
 *
 * Scoped to what this site actually is: a set of statements about vehicles and models.
 * It invents no warranty, no guarantee and no statutory protection, and it claims no
 * authorised-dealer status. Jurisdiction-specific motor trade disclosures are
 * deliberately absent — those depend on a confirmed business location and need legal
 * review before they go anywhere near a live site. See the README.
 */
export default function TermsPage() {
  const { contact } = siteConfig;

  const sections: { title: string; body: string[] }[] = [
    {
      title: 'Independence from manufacturers',
      body: [
        siteConfig.legal.affiliationDisclaimer,
        'Marque and model names are used to identify the vehicles under discussion. ' +
          'Their use does not indicate any approval, sponsorship or authorised ' +
          'appointment by the manufacturer concerned.',
      ],
    },
    {
      title: 'Vehicle information is subject to verification',
      body: [
        'Details published for a specific vehicle are drawn from the records and ' +
          'photography available for that car at the time of writing. They are given ' +
          'in good faith and are subject to verification. Anyone considering a ' +
          'purchase should satisfy themselves independently, including by inspection ' +
          'and by review of the vehicle’s documentation.',
        'Where a fact is not held it is left out rather than estimated. An omission on ' +
          'a listing means the information is not in our hands, not that it does not ' +
          'exist.',
      ],
    },
    {
      title: 'Model briefs are not offers',
      body: [
        'The sourcing catalogue describes models, not cars. A model brief does not ' +
          'mean an example is held, reserved or available, and nothing in it should be ' +
          'read as an offer to sell a particular vehicle.',
        'Model-level descriptions cover how a car was built and what the factory ' +
          'offered. Individual cars vary by specification, market and build date.',
      ],
    },
    {
      title: 'Imagery',
      body: [
        'Photography in the sourcing catalogue is representative of the model and does ' +
          'not show a vehicle held by Marlowe Motorcars. Where a vehicle page shows ' +
          'factory configuration renderings, they are labelled as renderings and are ' +
          'not photographs of the finished car.',
      ],
    },
    {
      title: 'No warranty is created by this site',
      body: [
        'Nothing on this site creates a warranty, guarantee or condition of any kind. ' +
          'Any terms that apply to a transaction are those agreed in writing for that ' +
          'transaction.',
      ],
    },
  ];

  // Only stated when it is true and the licence details are on file.
  if (isLicensedDealer()) {
    sections.splice(1, 0, {
      title: 'Licensing',
      body: [
        `Marlowe Motorcars holds motor vehicle dealer licence ${siteConfig.dealerLicense.number} ` +
          `in ${siteConfig.dealerLicense.jurisdiction}.`,
      ],
    });
  }

  return (
    <>
      <PageHeader
        title="Terms"
        intro="How to read the information published on this site."
      />

      <Container>
        <div className="rule max-w-3xl pt-14">
          {sections.map((section) => (
            <section
              key={section.title}
              className="border-b border-line py-10 last:border-b-0"
            >
              <h2 className="text-lg font-medium tracking-[-0.015em] text-bone">
                {section.title}
              </h2>
              <div className="prose-body mt-4">
                {section.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}

          {contact.email ? (
            <section className="py-10">
              <h2 className="text-lg font-medium tracking-[-0.015em] text-bone">
                Questions
              </h2>
              <p className="prose-body mt-4">
                <a href={`mailto:${contact.email}`} className="link-underline text-bone">
                  {contact.email}
                </a>
              </p>
            </section>
          ) : null}
        </div>
      </Container>
    </>
  );
}
