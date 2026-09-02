import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/site/Container';
import { Hero } from '@/components/site/Hero';
import { SectionHeading } from '@/components/site/SectionHeading';
import { BriefCategories } from '@/components/vehicles/BriefCategories';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import { homeCopy, sourcingCopy } from '@/content/copy';
import { isReachable } from '@/lib/contact';
import {
  getPublishedInventory,
  getPublishedSoldVehicles,
  getPublishedSourcingCategories,
  recordHref,
  vehicleHeading,
} from '@/lib/vehicles';

/**
 * Homepage.
 *
 * Sequence: typographic hero, representative briefs, the process in three steps, one
 * commission feature, how we work, contact.
 *
 * The only photograph on this page is the Temerario, well below the fold, and it is
 * there because it is the one car the owner actually supplied and the one piece of
 * verifiable proof the business has. Everything above it is type and rules. The
 * previous version opened with a mosaic of unrelated third-party car photography,
 * which made the site look like a listings aggregator.
 *
 * There are no category counts anywhere. Counting model briefs and presenting the
 * total as though it were stock is exactly the kind of manufactured scale this page
 * is meant to avoid.
 */
export default function HomePage() {
  const inventory = getPublishedInventory();
  const commissions = getPublishedSoldVehicles();
  const categories = getPublishedSourcingCategories();
  const canContact = isReachable();

  /** The single most recent commission carries the feature. */
  const feature = commissions[0];

  return (
    <>
      <Hero canContact={canContact} />

      {/* Available inventory — rendered only when real records exist. */}
      {inventory.length > 0 ? (
        <Container className="pt-20 sm:pt-28">
          <SectionHeading
            title="Available now"
            intro="Specific cars currently being offered."
            action={{ label: 'All inventory', href: '/inventory' }}
          />
          <ul className="mt-12 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 xl:grid-cols-3">
            {inventory.slice(0, 6).map((vehicle, i) => (
              <li key={vehicle.slug} className="h-full">
                <VehicleCard vehicle={vehicle} priority={i < 2} />
              </li>
            ))}
          </ul>
        </Container>
      ) : null}

      {/* Representative briefs */}
      <Container className="pt-20 sm:pt-28">
        <SectionHeading
          title={homeCopy.briefs.title}
          intro={homeCopy.briefs.intro}
          action={{ label: 'How sourcing works', href: '/sourcing' }}
        />
        <div className="mt-12">
          <BriefCategories categories={categories} />
        </div>
      </Container>

      {/* Process, condensed to three steps. The full six live on /sourcing. */}
      <Container className="pt-24 sm:pt-32">
        <SectionHeading
          title={homeCopy.process.title}
          action={homeCopy.process.cta}
        />
        <ol className="mt-12 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-3">
          {sourcingCopy.steps.slice(0, 3).map((step, i) => (
            <li key={step.title} className="border-t border-line pt-6">
              <p className="label-xs tabular-nums text-steel-dim">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-4 text-lg font-medium tracking-[-0.015em] text-bone">
                {step.title}
              </h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-steel">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </Container>

      {/*
        Commission feature. One car, given room, rather than a single card stranded in
        a three-column grid pretending to be an archive.
      */}
      {feature ? (
        <Container className="pt-24 sm:pt-32">
          <div className="rule grid gap-10 pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-16">
            <Link
              href={recordHref(feature)}
              aria-label={`${vehicleHeading(feature)} — commission detail`}
              className="group relative block overflow-hidden border border-line bg-ink-panel"
            >
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={feature.images[0].src}
                  alt={feature.images[0].alt}
                  fill
                  sizes="(min-width: 1024px) 45vw, 92vw"
                  loading="lazy"
                  className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.02] motion-reduce:transition-none"
                />
              </div>
            </Link>

            <div>
              <p className="label-xs">{homeCopy.commission.eyebrow}</p>
              <h2 className="display-2 mt-5 text-bone">{vehicleHeading(feature)}</h2>
              {feature.subtitle ? (
                <p className="mt-4 text-lg text-steel">{feature.subtitle}</p>
              ) : null}

              <p className="mt-6 max-w-lg text-[0.9375rem] leading-relaxed text-bone-dim sm:text-base">
                {feature.summary}
              </p>

              <dl className="mt-8 flex flex-wrap gap-x-12 gap-y-5 border-t border-line pt-6">
                <div>
                  <dt className="label-xs">Status</dt>
                  <dd className="mt-2 text-[0.9375rem] text-bone">
                    {feature.statusNote ?? 'Delivered'}
                  </dd>
                </div>
                {feature.salePrice ? (
                  <div>
                    <dt className="label-xs">Sold for</dt>
                    <dd className="mt-2 text-[0.9375rem] tabular-nums text-bone">
                      {feature.salePrice}
                    </dd>
                  </div>
                ) : null}
              </dl>

              <Link
                href={recordHref(feature)}
                className="link-underline mt-8 inline-block text-sm text-bone-dim transition-colors hover:text-bone"
              >
                See the commission
                <span aria-hidden="true"> →</span>
              </Link>
            </div>
          </div>
        </Container>
      ) : null}

      {/* How we work */}
      <Container className="pt-24 sm:pt-32">
        <SectionHeading title={homeCopy.principles.title} />
        <ul className="mt-12 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-3">
          {homeCopy.principles.items.map((item) => (
            <li key={item.title} className="border-t border-line pt-6">
              <h3 className="text-lg font-medium tracking-[-0.015em] text-bone">
                {item.title}
              </h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-steel">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
      </Container>

      {/* Contact — withheld entirely when there is no way to get in touch. */}
      {canContact ? (
        <Container className="pt-24 sm:pt-32">
          <div className="rule grid gap-10 pt-12 lg:grid-cols-[20rem_1fr] lg:gap-20">
            <h2 className="display-2 text-bone">{homeCopy.contactCta.title}</h2>
            <div className="max-w-xl">
              <p className="text-base leading-relaxed text-bone-dim sm:text-[1.0625rem]">
                {homeCopy.contactCta.body}
              </p>
              <Link href={homeCopy.contactCta.cta.href} className="btn btn-primary mt-9">
                {homeCopy.contactCta.cta.label}
              </Link>
            </div>
          </div>
        </Container>
      ) : null}
    </>
  );
}
