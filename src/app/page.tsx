import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/site/Container';
import { SampleInventoryNotice } from '@/components/site/SampleInventoryNotice';
import { SectionHeading } from '@/components/site/SectionHeading';
import { AvailabilityBadge } from '@/components/vehicles/AvailabilityBadge';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import { VehicleThumb } from '@/components/vehicles/VehicleThumb';
import { homeCopy } from '@/content/copy';
import {
  getAvailableVehicles,
  getFeaturedVehicle,
  getSoldVehicles,
  vehicleHeading,
} from '@/lib/vehicles';

export default function HomePage() {
  const featured = getFeaturedVehicle();
  const current = getAvailableVehicles().slice(0, 6);
  // The strip is a record of real sold vehicles. Sample archive entries stay on /sold.
  const sold = getSoldVehicles().filter((v) => !v.isSample);
  const heroImage = featured?.images[0];

  return (
    <>
      {/* Hero */}
      <section className="relative">
        <div className="relative h-[74vh] min-h-[30rem] w-full overflow-hidden bg-ink-panel sm:h-[82vh]">
          {heroImage ? (
            <Image
              src={heroImage.src}
              alt={heroImage.alt}
              fill
              priority
              sizes="100vw"
              className="object-cover object-[60%_center] sm:object-center"
            />
          ) : null}
          {/* Two-stop scrim: keeps type legible without washing the photograph out. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 via-45% to-ink/15"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/25 to-transparent"
          />

          <Container className="relative flex h-full flex-col justify-end pb-12 sm:pb-16">
            <p className="label-xs text-giallo">{homeCopy.hero.eyebrow}</p>
            <h1 className="display-1 mt-5 max-w-[16ch] text-bone">
              {homeCopy.hero.headline}
            </h1>
            <p className="mt-6 max-w-xl text-[0.9375rem] leading-relaxed text-bone-dim sm:text-base">
              {homeCopy.hero.subhead}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href={homeCopy.hero.primaryCta.href}
                className="inline-flex h-12 items-center border border-giallo bg-giallo px-7 text-[0.8125rem] font-medium uppercase tracking-[0.14em] text-[#0a0a0b] transition-colors duration-300 hover:bg-transparent hover:text-giallo"
              >
                {homeCopy.hero.primaryCta.label}
              </Link>
              <Link
                href={homeCopy.hero.secondaryCta.href}
                className="inline-flex h-12 items-center border border-line-strong px-7 text-[0.8125rem] uppercase tracking-[0.14em] text-bone transition-colors duration-300 hover:border-bone"
              >
                {homeCopy.hero.secondaryCta.label}
              </Link>
            </div>
          </Container>
        </div>
      </section>

      <Container>
        <SampleInventoryNotice className="mt-10" />
      </Container>

      {/* Featured vehicle */}
      {featured ? (
        <Container className="mt-14 sm:mt-20">
          <SectionHeading
            eyebrow={homeCopy.featured.eyebrow}
            title={homeCopy.featured.title}
            intro={homeCopy.featured.intro}
          />

          <article className="group relative mt-10 grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:items-stretch lg:gap-12">
            <Link
              href={`/inventory/${featured.slug}`}
              className="relative block aspect-[4/3] overflow-hidden border border-line bg-ink-panel lg:aspect-auto"
            >
              <VehicleThumb
                vehicle={featured}
                sizes="(min-width: 1024px) 58vw, 92vw"
                className="group-hover:scale-[1.025]"
              />
              <span className="sr-only">View {vehicleHeading(featured)}</span>
            </Link>

            <div className="flex flex-col justify-center lg:py-6">
              <AvailabilityBadge
                availability={featured.availability}
                note={featured.statusNote}
                size="lg"
              />
              <h3 className="display-2 mt-6 text-bone">
                {vehicleHeading(featured)}
              </h3>
              {featured.subtitle ? (
                <p className="mt-3 text-base text-steel">{featured.subtitle}</p>
              ) : null}
              <p className="mt-6 max-w-md text-[0.9375rem] leading-relaxed text-bone-dim">
                {featured.summary}
              </p>

              <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-line pt-6">
                {featured.specs.slice(0, 4).map((spec) => (
                  <div key={spec.label}>
                    <dt className="label-xs">{spec.label}</dt>
                    <dd className="mt-1.5 text-sm leading-snug text-bone-dim">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <Link
                href={`/inventory/${featured.slug}`}
                className="link-underline mt-8 self-start text-sm text-bone transition-colors hover:text-giallo"
              >
                View the full configuration
                <span aria-hidden="true"> →</span>
              </Link>
            </div>
          </article>
        </Container>
      ) : null}

      {/* Current inventory */}
      <Container className="mt-20 sm:mt-28">
        <SectionHeading
          eyebrow={homeCopy.inventory.eyebrow}
          title={homeCopy.inventory.title}
          intro={homeCopy.inventory.intro}
          action={{ label: 'All inventory', href: '/inventory' }}
        />
        <ul className="mt-10 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
          {current.map((vehicle) => (
            <li key={vehicle.slug}>
              <VehicleCard vehicle={vehicle} />
            </li>
          ))}
        </ul>
      </Container>

      {/* Recently sold strip */}
      {sold.length > 0 ? (
        <Container className="mt-20 sm:mt-28">
          <SectionHeading
            eyebrow={homeCopy.sold.eyebrow}
            title={homeCopy.sold.title}
            intro={homeCopy.sold.intro}
            action={{ label: 'Full archive', href: '/sold' }}
          />
          <ul className="mt-8 divide-y divide-line border-y border-line">
            {sold.map((vehicle) => (
              <li key={vehicle.slug}>
                <Link
                  href={`/inventory/${vehicle.slug}`}
                  className="group flex items-center gap-5 py-5 transition-colors hover:bg-ink-raised sm:gap-8"
                >
                  <div className="relative aspect-[3/2] w-24 shrink-0 overflow-hidden border border-line bg-ink-panel sm:w-32">
                    <VehicleThumb vehicle={vehicle} sizes="128px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[0.9375rem] font-medium text-bone">
                      {vehicleHeading(vehicle)}
                    </p>
                    <p className="mt-1 truncate text-sm text-steel">
                      {vehicle.subtitle ?? vehicle.category}
                    </p>
                  </div>
                  <div className="hidden shrink-0 sm:block">
                    <AvailabilityBadge
                      availability={vehicle.availability}
                      note={vehicle.statusNote}
                      size="sm"
                    />
                  </div>
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-steel-dim transition-colors group-hover:text-giallo"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      ) : null}

      {/* Sourcing */}
      <Container className="mt-20 sm:mt-28">
        <div className="rule grid gap-8 pt-10 lg:grid-cols-[18rem_1fr] lg:gap-16">
          <p className="label-xs">{homeCopy.sourcing.eyebrow}</p>
          <div className="max-w-2xl">
            <h2 className="display-2 text-bone">{homeCopy.sourcing.title}</h2>
            <p className="mt-6 text-[0.9375rem] leading-relaxed text-bone-dim sm:text-base">
              {homeCopy.sourcing.body}
            </p>
            <Link
              href={homeCopy.sourcing.cta.href}
              className="link-underline mt-8 inline-block text-sm text-bone transition-colors hover:text-giallo"
            >
              {homeCopy.sourcing.cta.label}
              <span aria-hidden="true"> →</span>
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
}
