import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/site/Container';
import { Hero } from '@/components/site/Hero';
import { SectionHeading } from '@/components/site/SectionHeading';
import { AvailabilityBadge } from '@/components/vehicles/AvailabilityBadge';
import { SourcingCard } from '@/components/vehicles/SourcingCard';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import { homeCopy, sourcingCopy } from '@/content/copy';
import {
  getPublishedInventory,
  getPublishedSoldVehicles,
  getPublishedSourcingModels,
  recordHref,
  vehicleTitle,
} from '@/lib/vehicles';

/**
 * Homepage.
 *
 * Order is deliberate: a multi-marque hero, then genuine inventory *only if there is
 * any*, then the models we source, how a search runs, and finally the completed
 * archive. The Temerario appears once, near the bottom, as one completed car — not as
 * the reason the business exists.
 *
 * There are no category counts. The previous version counted model briefs and sold
 * cars together and presented the total as "Currently listed", which read as stock.
 */
export default function HomePage() {
  const inventory = getPublishedInventory();
  const sold = getPublishedSoldVehicles();
  const sourcing = getPublishedSourcingModels();

  // The secondary hero action points at whichever section actually has something in it.
  const secondaryCta =
    inventory.length > 0 ? homeCopy.hero.inventoryCta : homeCopy.hero.soldCta;

  return (
    <>
      <Hero secondaryCta={secondaryCta} />

      {/* Available inventory — rendered only when real records exist. */}
      {inventory.length > 0 ? (
        <Container className="pt-20 sm:pt-28">
          <SectionHeading
            title={homeCopy.inventory.title}
            intro={homeCopy.inventory.intro}
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

      {/* Models we source */}
      <Container className="pt-20 sm:pt-28">
        <SectionHeading
          title={homeCopy.sourcing.title}
          intro={homeCopy.sourcing.intro}
          action={{ label: 'All models', href: '/sourcing' }}
        />
        <ul className="mt-12 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
          {sourcing.slice(0, 6).map((model) => (
            <li key={model.slug} className="h-full">
              <SourcingCard model={model} />
            </li>
          ))}
        </ul>
        <p className="mt-10 max-w-xl text-xs leading-relaxed text-steel-dim">
          {sourcingCopy.catalogueNote}
        </p>
      </Container>

      {/* How sourcing works */}
      <Container className="pt-24 sm:pt-32">
        <SectionHeading title={homeCopy.process.title} />
        <ol className="mt-10 grid grid-cols-1 gap-px border-y border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {sourcingCopy.steps.map((step, i) => (
            <li key={step.title} className="bg-ink px-0 py-9 sm:px-6 sm:py-10">
              <p className="label-xs tabular-nums text-steel-dim">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-4 text-lg font-medium tracking-[-0.015em] text-bone">
                {step.title}
              </h3>
              <p className="mt-3 max-w-[34ch] text-[0.9375rem] leading-relaxed text-steel">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </Container>

      {/* Recently completed */}
      {sold.length > 0 ? (
        <Container className="pt-24 sm:pt-32">
          <SectionHeading
            title={homeCopy.completed.title}
            intro={homeCopy.completed.intro}
            action={{ label: 'All completed vehicles', href: '/sold-vehicles' }}
          />
          <ul className="mt-10 divide-y divide-line border-y border-line">
            {sold.slice(0, 4).map((vehicle) => (
              <li key={vehicle.slug}>
                <Link
                  href={recordHref(vehicle)}
                  className="group flex items-center gap-5 py-5 transition-colors hover:bg-ink-raised sm:gap-8"
                >
                  <div className="relative aspect-[3/2] w-24 shrink-0 overflow-hidden border border-line bg-ink-panel sm:w-32">
                    <Image
                      src={vehicle.images[0].src}
                      alt={vehicle.images[0].alt}
                      fill
                      sizes="128px"
                      loading="lazy"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[0.9375rem] font-medium text-bone">
                      {vehicleTitle(vehicle)}
                    </p>
                    <p className="mt-1 truncate text-sm text-steel">
                      {vehicle.subtitle ?? vehicle.category}
                    </p>
                  </div>
                  <div className="hidden shrink-0 sm:block">
                    <AvailabilityBadge availability="sold" size="sm" />
                  </div>
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-steel-dim transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      ) : null}

      {/* Contact */}
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
    </>
  );
}
