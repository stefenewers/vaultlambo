import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/site/Container';
import { PageHeader } from '@/components/site/PageHeader';
import { SourcingCard } from '@/components/vehicles/SourcingCard';
import { sourcingCopy } from '@/content/copy';
import { creditLine } from '@/data/image-sources';
import { getSourcingByCategory } from '@/lib/vehicles';
import { siteConfig } from '@/site.config';

export const metadata: Metadata = {
  title: 'Sourcing',
  description: sourcingCopy.intro,
  alternates: { canonical: '/sourcing' },
};

const BAND = {
  src: '/images/editorial/sourcing-band.webp',
  alt: 'A yellow Ferrari 296 GTB photographed from the front three-quarter.',
  width: 2400,
  height: 1029,
};

/**
 * Sourcing catalogue and process.
 *
 * Model briefs, grouped by category. Nothing on this page carries availability, a
 * price or a model year, and the representative-imagery note is stated once beneath
 * the catalogue rather than repeated on every card.
 */
export default function SourcingPage() {
  const groups = getSourcingByCategory();
  const bandCredit = creditLine(BAND.src);

  return (
    <>
      <PageHeader title={sourcingCopy.headline} intro={sourcingCopy.intro} />

      {/* Editorial band */}
      <div className="relative w-full overflow-hidden border-y border-line bg-ink-panel">
        <div className="relative aspect-[3/2] w-full sm:aspect-[21/9] lg:aspect-[28/9]">
          <Image
            src={BAND.src}
            alt={BAND.alt}
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          {/* Scrim so the credit stays legible over a light image. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ink/80 to-transparent"
          />
        </div>
        {bandCredit ? (
          <p className="absolute bottom-3 right-4 text-[0.625rem] text-bone-dim sm:right-8">
            {bandCredit}
          </p>
        ) : null}
      </div>

      <Container>
        {/* Catalogue */}
        {groups.map((group, groupIndex) => (
          <section key={group.category} className="pt-16 sm:pt-20">
            <h2 className="rule display-3 pt-8 text-bone">{group.category}</h2>
            <ul className="mt-10 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
              {group.models.map((model, i) => (
                <li key={model.slug} className="h-full">
                  <SourcingCard model={model} priority={groupIndex === 0 && i < 2} />
                </li>
              ))}
            </ul>
          </section>
        ))}

        <p className="mt-12 max-w-xl text-xs leading-relaxed text-steel-dim">
          {sourcingCopy.catalogueNote}
        </p>

        {/* Process */}
        <section className="pt-20 sm:pt-28">
          <h2 className="rule display-2 pt-8 text-bone">How sourcing works</h2>
          <ol className="mt-10 grid grid-cols-1 gap-px border-y border-line bg-line sm:grid-cols-2">
            {sourcingCopy.steps.map((step, i) => (
              <li key={step.title} className="bg-ink px-0 py-10 sm:px-8 sm:py-12">
                <p className="label-xs tabular-nums text-steel-dim">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-4 text-lg font-medium tracking-[-0.015em] text-bone">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-sm text-[0.9375rem] leading-relaxed text-steel">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* Send a brief */}
        <div className="grid gap-10 py-16 lg:grid-cols-[20rem_1fr] lg:gap-20 lg:py-20">
          <h2 className="display-3 text-bone">Send a brief</h2>
          <div className="max-w-xl">
            <p className="text-[0.9375rem] leading-relaxed text-bone-dim sm:text-base">
              Include the model, the specification you want, and how firm each part of it
              is. If timing matters, say when.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href={sourcingCopy.cta.href} className="btn btn-primary">
                {sourcingCopy.cta.label}
              </Link>
              {siteConfig.contact.email ? (
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="link-underline text-sm text-bone-dim transition-colors hover:text-bone"
                >
                  {siteConfig.contact.email}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
