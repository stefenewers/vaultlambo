import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/site/Container';
import { PageHeader } from '@/components/site/PageHeader';
import { soldCopy } from '@/content/copy';
import { focusStyle } from '@/lib/media';
import type { SoldVehicle } from '@/lib/types';
import { getPublishedSoldVehicles, recordHref } from '@/lib/vehicles';

export const metadata: Metadata = {
  title: 'Commissions',
  description: soldCopy.intro,
  alternates: { canonical: '/commissions' },
  openGraph: {
    title: 'Commissions | Marlowe Motorcars',
    description: soldCopy.intro,
    url: '/commissions',
  },
};

/**
 * Commissions.
 *
 * One treatment for every car, in order: a wide frame, then the index number, the name
 * at display size and the facts on the record. Earlier versions gave the first car a
 * feature layout and dropped the rest into a two-column grid, which mixed crops,
 * stranded an odd card on its own row, and forced wide studio panoramas into 3:2 boxes
 * that cut the cars off. A single wide format suits every source the site holds.
 */
export default function CommissionsPage() {
  const commissions = getPublishedSoldVehicles();

  return (
    <>
      <PageHeader title={soldCopy.headline} intro={soldCopy.intro} />

      <Container size="wide">
        {commissions.length === 0 ? (
          <p className="rule py-16 text-sm text-steel">{soldCopy.empty}</p>
        ) : (
          <ol className="border-t border-line">
            {commissions.map((vehicle, i) => (
              <li key={vehicle.slug} className="border-b border-line py-14 sm:py-20">
                <CommissionRow vehicle={vehicle} priority={i === 0} />
              </li>
            ))}
          </ol>
        )}
      </Container>
    </>
  );
}

function CommissionRow({
  vehicle,
  priority,
}: {
  vehicle: SoldVehicle;
  priority: boolean;
}) {
  const lead = vehicle.images[0];
  const href = recordHref(vehicle);

  const facts = [
    { label: 'Status', value: vehicle.statusNote ?? 'Delivered' },
    ...(vehicle.year ? [{ label: 'Year', value: String(vehicle.year) }] : []),
    ...vehicle.specs
      .filter((spec) => spec.label === 'Exterior')
      .map((spec) => ({ label: spec.label, value: spec.value })),
    ...(vehicle.salePrice ? [{ label: 'Sold for', value: vehicle.salePrice }] : []),
  ];

  return (
    <article className="group">
      <figure>
        <Link href={href} tabIndex={-1} aria-hidden="true" className="block">
          <div className="media-zoom relative aspect-[16/9] w-full overflow-hidden bg-black lg:aspect-[21/9]">
            <Image
              src={lead.src}
              alt={lead.alt}
              fill
              priority={priority}
              loading={priority ? undefined : 'lazy'}
              sizes="(min-width: 1664px) 1600px, 96vw"
              className="object-cover"
              style={focusStyle(lead)}
            />
          </div>
        </Link>
        {lead.caption ? (
          <figcaption className="mt-3 text-xs leading-relaxed text-steel">
            {lead.caption}
          </figcaption>
        ) : null}
      </figure>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-20">
        <div>
          <h2 className="display-1 text-bone">
            <Link href={href} className="transition-colors hover:text-bone-dim">
              {vehicle.make}{' '}
              <span className="block">
                {[vehicle.model, vehicle.variant].filter(Boolean).join(' ')}
              </span>
            </Link>
          </h2>
          {vehicle.subtitle ? (
            <p className="mt-5 text-lg text-steel">{vehicle.subtitle}</p>
          ) : null}
        </div>

        <div className="flex flex-col justify-end">
          <p className="max-w-xl text-base leading-relaxed text-bone-dim sm:text-lg">
            {vehicle.summary}
          </p>
          <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-line pt-7">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="label-xs">{fact.label}</dt>
                <dd className="mt-2 text-[0.9375rem] leading-snug tabular-nums text-bone">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
          <Link
            href={href}
            className="mt-9 inline-flex items-center self-start text-sm font-medium text-bone"
          >
            <span className="link-underline">View commission</span>
            <span aria-hidden="true" className="arrow-nudge ml-2">
              →
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}
