import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/site/Container';
import { PageHeader } from '@/components/site/PageHeader';
import { aboutCopy } from '@/content/copy';
import { siteConfig } from '@/site.config';

export const metadata: Metadata = {
  title: 'About',
  description:
    'What Marlowe Motorcars does, how a search runs, and how vehicles and documents ' +
    'are handled.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Marlowe Motorcars',
    description:
      'A sourcing and representation service for performance, luxury and collector ' +
      'vehicles. How a search runs, and how documents are handled.',
    url: '/about',
  },
};

/**
 * About.
 *
 * Explains the operating model and nothing else. No years in business, vehicles sold,
 * staff, partnerships, manufacturer relationships, testimonials, press, showroom,
 * awards, finance or shipping volume — none of those are established, so none of them
 * are claimed. The service area renders only when one has actually been configured.
 */
export default function AboutPage() {
  const { contact } = siteConfig;

  return (
    <>
      <PageHeader title={aboutCopy.headline} intro={aboutCopy.intro} />

      <Container>
        <div className="rule pt-14">
          {aboutCopy.sections.map((section) => (
            <section
              key={section.title}
              className="grid gap-6 border-b border-line py-12 last:border-b-0 lg:grid-cols-[20rem_1fr] lg:gap-20"
            >
              <h2 className="text-lg font-medium tracking-[-0.015em] text-bone">
                {section.title}
              </h2>
              <div className="prose-body">
                {section.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Where we operate — shown only when a truthful service area is configured. */}
        {contact.serviceArea ? (
          <div className="rule grid gap-6 py-12 lg:grid-cols-[20rem_1fr] lg:gap-20">
            <h2 className="text-lg font-medium tracking-[-0.015em] text-bone">
              Where we operate
            </h2>
            <div className="prose-body">
              <p>{contact.serviceArea}</p>
            </div>
          </div>
        ) : null}

        {/* Questions */}
        <section
          aria-labelledby="faq"
          className="rule grid gap-8 py-14 lg:grid-cols-[20rem_1fr] lg:gap-20"
        >
          <h2
            id="faq"
            className="text-lg font-medium tracking-[-0.015em] text-bone lg:sticky lg:top-28 lg:self-start"
          >
            {aboutCopy.faq.title}
          </h2>

          <dl className="max-w-2xl border-t border-line">
            {aboutCopy.faq.items.map((item) => (
              <div key={item.question} className="border-b border-line py-7">
                <dt className="text-[1.0625rem] font-medium leading-snug tracking-[-0.015em] text-bone">
                  {item.question}
                </dt>
                <dd className="mt-3 text-[0.9375rem] leading-relaxed text-bone-dim">
                  {item.answer}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="rule grid gap-6 py-14 lg:grid-cols-[20rem_1fr] lg:gap-20">
          <h2 className="text-lg font-medium tracking-[-0.015em] text-bone">
            Get in touch
          </h2>
          <div>
            <p className="max-w-xl text-[0.9375rem] leading-relaxed text-bone-dim sm:text-base">
              {contact.appointmentPolicy}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/contact" className="btn btn-primary">
                Start a search
              </Link>
              {contact.email ? (
                <a
                  href={`mailto:${contact.email}`}
                  className="link-underline text-sm text-bone-dim transition-colors hover:text-bone"
                >
                  {contact.email}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
