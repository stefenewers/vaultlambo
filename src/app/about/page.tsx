import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/site/Container';
import { PageHeader } from '@/components/site/PageHeader';
import { aboutCopy } from '@/content/copy';
import { siteConfig } from '@/site.config';

export const metadata: Metadata = {
  title: 'About',
  description: aboutCopy.intro,
  alternates: { canonical: '/about' },
};

/**
 * About.
 *
 * Explains the operating model and nothing else. No years in business, vehicles sold,
 * staff, partnerships, manufacturer relationships, testimonials, press, showroom,
 * awards, finance or shipping volume — none of those are established, so none of them
 * are claimed.
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

        <div className="rule mt-2 grid gap-6 py-14 lg:grid-cols-[20rem_1fr] lg:gap-20">
          <h2 className="text-lg font-medium tracking-[-0.015em] text-bone">
            Get in touch
          </h2>
          <div>
            <p className="max-w-xl text-[0.9375rem] leading-relaxed text-bone-dim sm:text-base">
              {contact.appointmentPolicy}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/contact" className="btn btn-primary">
                Contact us
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
