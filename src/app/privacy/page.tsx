import type { Metadata } from 'next';
import { Container } from '@/components/site/Container';
import { PageHeader } from '@/components/site/PageHeader';
import { siteConfig } from '@/site.config';

export const metadata: Metadata = {
  title: 'Privacy',
  description:
    'What Marlowe Motorcars collects through the enquiry form, why, and how to have it removed.',
  alternates: { canonical: '/privacy' },
};

/**
 * Privacy notice.
 *
 * Describes what this site actually does — an enquiry form that sends an email — and
 * nothing else. There is no analytics, advertising or tracking on the site, so none is
 * described. No jurisdiction-specific rights language is asserted, because the
 * operating location has not been confirmed; see the README.
 */
const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: 'What we collect',
    body: [
      'The enquiry form asks for your name, email address, an optional phone number, ' +
        'the vehicle or model you are asking about, and your message. That is the ' +
        'whole of it. We do not ask for anything else, and the site sets no ' +
        'advertising or analytics cookies.',
    ],
  },
  {
    title: 'Why we collect it',
    body: [
      'So that we can answer you. Your email address is used as the reply address on ' +
        'the enquiry, and your message is read by the person who responds to it.',
    ],
  },
  {
    title: 'How it reaches us',
    body: [
      'Enquiries are delivered by email through Resend, our email provider, which ' +
        'processes the message in order to send it. The message then sits in our ' +
        'email account like any other correspondence.',
    ],
  },
  {
    title: 'How long we keep it',
    body: [
      'Enquiry correspondence is kept while it is useful — during a search, and for ' +
        'as long as we may reasonably need to refer back to it afterwards. It is not ' +
        'added to a mailing list, and you will not receive marketing because you sent ' +
        'an enquiry.',
    ],
  },
  {
    title: 'We do not sell enquiry information',
    body: [
      'Enquiry details are not sold, rented or passed to third parties for their own ' +
        'marketing. They are shared only where a transaction genuinely requires it — ' +
        'for example with an inspector or transporter you have asked us to arrange — ' +
        'and only to the extent needed.',
    ],
  },
  {
    title: 'Removing your information',
    body: [
      'Ask us and we will delete your enquiry and our correspondence about it. Reply ' +
        'to any message from us, or write to the address below, and say what you want ' +
        'removed.',
    ],
  },
];

export default function PrivacyPage() {
  const { contact } = siteConfig;

  return (
    <>
      <PageHeader
        title="Privacy"
        intro="What this site collects, why, and how to have it removed."
      />

      <Container>
        <div className="rule max-w-3xl pt-14">
          {SECTIONS.map((section) => (
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
                Contact
              </h2>
              <p className="prose-body mt-4">
                <a
                  href={`mailto:${contact.email}`}
                  className="link-underline text-bone"
                >
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
