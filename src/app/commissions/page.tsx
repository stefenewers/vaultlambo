import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/site/Container';
import { PageHeader } from '@/components/site/PageHeader';
import { soldCopy } from '@/content/copy';
import type { SoldVehicle } from '@/lib/types';
import { getPublishedSoldVehicles, recordHref, vehicleHeading } from '@/lib/vehicles';

export const metadata: Metadata = {
  title: 'Commissions',
  description: soldCopy.intro,
  alternates: { canonical: '/commissions' },
  openGraph: {
    title: 'Commissions — Marlowe Motorcars',
    description: soldCopy.intro,
    url: '/commissions',
  },
};

/**
 * Commissions.
 *
 * There is exactly one published commission, and the page is built for that rather
 * than against it. A single card in the first cell of a three-column archive grid
 * advertises the two empty cells beside it; one car given the full width reads as a
 * considered case study.
 *
 * The layout adapts if more are added: the first is always the feature, and anything
 * after it falls into a plain two-column list below.
 */
export default function CommissionsPage() {
  const commissions = getPublishedSoldVehicles();
  const [feature, ...rest] = commissions;

  return (
    <>
      <PageHeader title={soldCopy.headline} intro={soldCopy.intro} />

      <Container>
        {!feature ? (
          <p className="rule py-16 text-sm text-steel">{soldCopy.empty}</p>
        ) : (
          <>
            <CommissionFeature vehicle={feature} />

            {rest.length > 0 ? (
              <ul className="mt-24 grid grid-cols-1 gap-x-10 gap-y-14 border-t border-line pt-14 sm:grid-cols-2">
                {rest.map((vehicle) => (
                  <li key={vehicle.slug}>
                    <Link href={recordHref(vehicle)} className="group block">
                      <div className="relative aspect-[3/2] w-full overflow-hidden border border-line bg-ink-panel">
                        <Image
                          src={vehicle.images[0].src}
                          alt={vehicle.images[0].alt}
                          fill
                          sizes="(min-width: 640px) 45vw, 92vw"
                          loading="lazy"
                          className="object-cover"
                        />
                      </div>
                      <h3 className="mt-5 text-lg font-medium tracking-[-0.015em] text-bone">
                        {vehicleHeading(vehicle)}
                      </h3>
                      {vehicle.salePrice ? (
                        <p className="mt-2 text-sm tabular-nums text-steel">
                          Sold for {vehicle.salePrice}
                        </p>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </>
        )}
      </Container>
    </>
  );
}

/**
 * The lead commission, as a case study.
 *
 * Every field rendered here comes off the record. Nothing is inferred and nothing is
 * padded: there is no "challenge / approach / outcome" narrative, because none of that
 * was supplied, and writing one would mean inventing the story of someone else's
 * purchase.
 */
function CommissionFeature({ vehicle }: { vehicle: SoldVehicle }) {
  const lead = vehicle.images[0];

  const facts = [
    { label: 'Status', value: vehicle.statusNote ?? 'Delivered' },
    ...(vehicle.salePrice ? [{ label: 'Sold for', value: vehicle.salePrice }] : []),
    ...vehicle.specs
      .filter((spec) => spec.label === 'Exterior' || spec.label === 'Configuration Code')
      .map((spec) => ({ label: spec.label, value: spec.value })),
  ];

  return (
    <article className="rule pt-12 sm:pt-16">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
        <Link
          href={recordHref(vehicle)}
          aria-label={`${vehicleHeading(vehicle)} — full commission record`}
          className="group relative block overflow-hidden border border-line bg-ink-panel"
        >
          <div className="relative aspect-[4/3] w-full sm:aspect-[3/2]">
            <Image
              src={lead.src}
              alt={lead.alt}
              fill
              priority
              sizes="(min-width: 1024px) 60vw, 92vw"
              className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.02] motion-reduce:transition-none"
            />
          </div>
        </Link>

        <div className="lg:pt-2">
          <h2 className="display-2 text-bone">{vehicleHeading(vehicle)}</h2>
          {vehicle.subtitle ? (
            <p className="mt-4 text-lg text-steel">{vehicle.subtitle}</p>
          ) : null}

          <p className="mt-7 max-w-lg text-[0.9375rem] leading-relaxed text-bone-dim sm:text-base">
            {vehicle.summary}
          </p>

          <dl className="mt-9 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-line pt-7">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="label-xs">{fact.label}</dt>
                <dd className="mt-2 text-[0.9375rem] leading-snug text-bone">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>

          <Link href={recordHref(vehicle)} className="btn btn-secondary mt-9">
            Full specification
          </Link>
        </div>
      </div>
    </article>
  );
}
