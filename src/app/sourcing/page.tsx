import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/site/Container';
import { PageHeader } from '@/components/site/PageHeader';
import { BriefCategories } from '@/components/vehicles/BriefCategories';
import { sourcingCopy } from '@/content/copy';
import { contactAvailability } from '@/lib/contact';
import { getPublishedSourcingCategories } from '@/lib/vehicles';

export const metadata: Metadata = {
  title: 'Sourcing',
  description:
    'How a vehicle search runs at Marlowe Motorcars: agreeing a brief, identifying ' +
    'candidates, reviewing history and documentation, and handover.',
  alternates: { canonical: '/sourcing' },
  openGraph: {
    title: 'Sourcing — Marlowe Motorcars',
    description:
      'How a vehicle search runs, from the first conversation to the car arriving.',
    url: '/sourcing',
  },
};

/**
 * Sourcing.
 *
 * One page explaining the service, in place of a photo catalogue and seven per-model
 * pages. Those pages carried third-party photography and manufacturer specifications;
 * neither was evidence of anything, and the old `/sourcing/[slug]` URLs now redirect
 * here.
 *
 * The process is the substance of the page and leads it. Categories come afterwards,
 * as scope, with the availability caveat stated once directly beneath the heading.
 */
export default function SourcingPage() {
  const categories = getPublishedSourcingCategories();
  const { reachable, email } = contactAvailability();

  return (
    <>
      <PageHeader title={sourcingCopy.headline} intro={sourcingCopy.intro} />

      <Container>
        {/* The process */}
        <section aria-labelledby="process" className="rule pt-12 sm:pt-16">
          <h2 id="process" className="sr-only">
            The process
          </h2>
          <ol className="grid grid-cols-1 gap-x-16 gap-y-12 md:grid-cols-2">
            {sourcingCopy.steps.map((step, i) => (
              <li key={step.title} className="grid grid-cols-[3rem_1fr] gap-x-2">
                <p className="label-xs tabular-nums text-steel-dim">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <div className="border-t border-line pt-1">
                  <h3 className="text-lg font-medium tracking-[-0.015em] text-bone">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-[46ch] text-[0.9375rem] leading-relaxed text-steel">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Scope */}
        <section aria-labelledby="briefs" className="pt-20 sm:pt-28">
          <div className="rule pt-10">
            <h2 id="briefs" className="display-2 text-bone">
              {sourcingCopy.briefs.title}
            </h2>
            <p className="mt-5 max-w-xl text-[0.9375rem] leading-relaxed text-steel">
              {sourcingCopy.briefs.intro}
            </p>
          </div>
          <div className="mt-12">
            <BriefCategories categories={categories} />
          </div>
        </section>

        {/* Send a brief — withheld when there is nowhere for it to go. */}
        {reachable ? (
          <section
            aria-labelledby="send-a-brief"
            className="rule mt-20 grid gap-10 py-16 sm:mt-28 lg:grid-cols-[20rem_1fr] lg:gap-20 lg:py-20"
          >
            <h2 id="send-a-brief" className="display-3 text-bone">
              {sourcingCopy.cta.title}
            </h2>
            <div className="max-w-xl">
              <p className="text-[0.9375rem] leading-relaxed text-bone-dim sm:text-base">
                {sourcingCopy.cta.body}
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-5">
                <Link href={sourcingCopy.cta.href} className="btn btn-primary">
                  {sourcingCopy.cta.label}
                </Link>
                {email ? (
                  <a
                    href={`mailto:${email}`}
                    className="text-sm text-bone-dim underline underline-offset-4 transition-colors hover:text-bone"
                  >
                    {email}
                  </a>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}
      </Container>
    </>
  );
}
