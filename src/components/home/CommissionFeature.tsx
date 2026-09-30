import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/site/Container';
import { homeCopy } from '@/content/copy';
import { focusStyle, isPanorama } from '@/lib/media';
import type { SoldVehicle, VehicleImage } from '@/lib/types';
import { recordHref } from '@/lib/vehicles';

type Props = {
  vehicle: SoldVehicle;
  /** The hero's image, so the feature leads with a different view of the car. */
  avoidSrc?: string;
};

/** In-page anchor for the feature. */
export const COMMISSION_ANCHOR = 'recent-commission';

/**
 * The most recent commission, directly under the hero, as proof at scale.
 *
 * Poster-sized model name, one large image, the facts that are on the record, and a
 * strip of detail views. Every image carries its own caption from the record, so a
 * factory configuration rendering is always labelled as a rendering, and a photograph
 * of the delivered car as a photograph — the two are never presented as the same kind
 * of evidence. Nothing is written here that is not on the record itself.
 */
export function CommissionFeature({ vehicle, avoidSrc }: Props) {
  const href = recordHref(vehicle);
  const lead = vehicle.images.find((image) => image.src !== avoidSrc) ?? vehicle.images[0];

  /* Up to three further views, then the photograph of the car if there is one. */
  const photograph = vehicle.documentaryImages?.find(
    (image) => image.kind === 'vehicle-photograph',
  );
  const details: VehicleImage[] = [
    ...vehicle.images
      .filter((image) => image.src !== lead.src && image.src !== avoidSrc)
      /* Square crops: no portraits, and no studio panoramas, which lose the car. */
      .filter((image) => image.width / image.height >= 0.95 && !isPanorama(image))
      .slice(0, photograph ? 3 : 4),
    ...(photograph ? [photograph] : []),
  ];

  const facts = [
    ...(vehicle.subtitle ? [{ label: 'Specification', value: vehicle.subtitle }] : []),
    { label: 'Status', value: vehicle.statusNote ?? 'Delivered' },
    ...(vehicle.salePrice ? [{ label: 'Sold for', value: vehicle.salePrice }] : []),
    ...vehicle.specs
      .filter((spec) => spec.label === 'Configuration Code')
      .map((spec) => ({ label: spec.label, value: spec.value })),
  ];

  return (
    <section
      id={COMMISSION_ANCHOR}
      aria-labelledby={`${COMMISSION_ANCHOR}-heading`}
      className="scroll-mt-20 overflow-hidden bg-ink"
    >
      <Container size="wide" className="pt-20 sm:pt-28 lg:pt-32">
        <div className="flex items-center justify-between gap-6">
          <p className="label-xs text-bone-dim">
            <span className="tabular-nums text-giallo">{homeCopy.commission.index}</span>
            <span aria-hidden="true" className="mx-3 text-steel-dim">
              /
            </span>
            {homeCopy.commission.eyebrow}
          </p>
          <Link
            href={homeCopy.commission.archive.href}
            className="link-underline text-sm text-bone-dim transition-colors hover:text-bone"
          >
            {homeCopy.commission.archive.label}
            <span aria-hidden="true"> →</span>
          </Link>
        </div>

        <h2
          id={`${COMMISSION_ANCHOR}-heading`}
          className="reveal display-mega mt-10 text-bone [overflow-wrap:anywhere] sm:mt-14"
        >
          <span className="block text-[0.3em] leading-none tracking-[-0.02em] text-bone-dim">
            {vehicle.make}
          </span>{' '}
          <span className="mt-[0.2em] block">{vehicle.model}</span>
        </h2>
      </Container>

      {/* The lead image, wide. Held inside the wide measure rather than bled to the
          viewport edge: the supplied files are 1123px across and soften beyond it. */}
      <Container size="wide" className="mt-10 sm:mt-14">
        <figure className="reveal">
          <Link
            href={href}
            aria-label={`${vehicle.make} ${vehicle.model} — view commission`}
            className="group block"
          >
            <div className="media-zoom relative aspect-[16/9] w-full overflow-hidden bg-black lg:aspect-[21/9]">
              <Image
                src={lead.src}
                alt={lead.alt}
                fill
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
      </Container>

      <Container size="wide" className="pb-20 pt-12 sm:pb-28 sm:pt-16 lg:pb-32">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-20">
          <div>
            <p className="max-w-2xl text-lg leading-relaxed text-bone-dim sm:text-xl sm:leading-relaxed">
              {vehicle.summary}
            </p>
            <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-7 border-t border-line pt-8 sm:grid-cols-4">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="label-xs">{fact.label}</dt>
                  <dd className="mt-2.5 text-base leading-snug tabular-nums text-bone">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <Link href={href} className="group btn btn-primary btn-lg w-full sm:w-auto">
            {homeCopy.commission.cta.label}
            <span aria-hidden="true" className="arrow-nudge ml-3">
              →
            </span>
          </Link>
        </div>

        {details.length > 0 ? (
          <ul className="mt-16 grid grid-cols-2 gap-3 sm:mt-20 sm:gap-4 lg:grid-cols-4">
            {details.map((image) => (
              <li key={image.src} className="reveal">
                <figure>
                  <div className="relative aspect-square w-full overflow-hidden bg-ink-panel">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      loading="lazy"
                      sizes="(min-width: 1024px) 24vw, 48vw"
                      className="object-cover"
                      style={focusStyle(image)}
                    />
                  </div>
                  <figcaption className="mt-2.5 text-xs leading-snug text-steel">
                    {image.caption ??
                      (image.kind === 'vehicle-photograph'
                        ? 'Photograph of the car'
                        : 'Factory configuration rendering')}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        ) : null}
      </Container>
    </section>
  );
}
