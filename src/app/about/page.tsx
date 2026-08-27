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

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow={aboutCopy.eyebrow}
        title={aboutCopy.headline}
        intro={aboutCopy.intro}
      />

      <Container>
        <div className="rule pt-12 sm:pt-16">
          {aboutCopy.sections.map((section) => (
            <section
              key={section.title}
              className="grid gap-6 border-b border-line py-10 last:border-b-0 lg:grid-cols-[18rem_1fr] lg:gap-16 lg:py-14"
            >
              <h2 className="display-3 text-bone lg:text-[1.375rem]">
                {section.title}
              </h2>
              <div className="prose-body">
                {section.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="rule mt-4 grid gap-6 pt-12 lg:grid-cols-[18rem_1fr] lg:gap-16">
          <p className="label-xs">Get in touch</p>
          <div>
            <p className="display-2 max-w-lg text-bone">
              Every inquiry is read and answered by a person.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="inline-flex h-12 items-center border border-giallo bg-giallo px-7 text-[0.8125rem] font-medium uppercase tracking-[0.14em] text-[#0a0a0b] transition-colors duration-300 hover:bg-transparent hover:text-giallo"
              >
                Start an inquiry
              </Link>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="link-underline text-sm text-bone-dim transition-colors hover:text-bone"
              >
                {siteConfig.contact.email}
              </a>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
