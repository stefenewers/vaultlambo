import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/site/Container';
import { PageHeader } from '@/components/site/PageHeader';
import { sourcingCopy } from '@/content/copy';
import { siteConfig } from '@/site.config';

export const metadata: Metadata = {
  title: 'Sourcing',
  description: sourcingCopy.intro,
  alternates: { canonical: '/sourcing' },
};

export default function SourcingPage() {
  return (
    <>
      <PageHeader title={sourcingCopy.headline} intro={sourcingCopy.intro} />

      <Container>
        <ol className="rule grid grid-cols-1 gap-px border-b border-line bg-line pt-px sm:grid-cols-2">
          {sourcingCopy.steps.map((step, i) => (
            <li key={step.title} className="bg-ink px-0 py-10 sm:px-8 sm:py-12">
              <p className="label-xs tabular-nums text-steel-dim">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h2 className="mt-4 text-lg font-medium tracking-[-0.015em] text-bone">
                {step.title}
              </h2>
              <p className="mt-3 max-w-sm text-[0.9375rem] leading-relaxed text-steel">
                {step.body}
              </p>
            </li>
          ))}
        </ol>

        <div className="grid gap-10 py-16 lg:grid-cols-[20rem_1fr] lg:gap-20 lg:py-20">
          <h2 className="display-3 text-bone">Send a brief</h2>
          <div className="max-w-xl">
            <p className="text-[0.9375rem] leading-relaxed text-bone-dim sm:text-base">
              Include the model, the specification you want, and how firm each part of
              it is. If timing matters, say when.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href={sourcingCopy.cta.href} className="btn btn-primary">
                {sourcingCopy.cta.label}
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
