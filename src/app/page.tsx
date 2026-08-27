import Link from 'next/link';
import { Container } from '@/components/site/Container';
import { SectionHeading } from '@/components/site/SectionHeading';
import { AvailabilityBadge } from '@/components/vehicles/AvailabilityBadge';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import { VehicleThumb } from '@/components/vehicles/VehicleThumb';
import { homeCopy } from '@/content/copy';
import {
  CATEGORY_BLURB,
  CATEGORY_ORDER,
  countByCategory,
  getCurrentVehicles,
  getSoldVehicles,
  vehicleTitle,
} from '@/lib/vehicles';

export default function HomePage() {
  const current = getCurrentVehicles();
  const sold = getSoldVehicles();

  return (
    <>
      {/*
        Typography-led hero. No single vehicle leads the page — the business sells
        across several categories and the masthead should say so.
      */}
      <section className="border-b border-line">
        <Container>
          <div className="grid gap-14 py-20 sm:py-24 lg:grid-cols-[1.45fr_auto_0.75fr] lg:gap-0 lg:py-28">
            <div className="flex flex-col justify-center lg:pr-16">
              <h1 className="display-1 max-w-[13ch] text-bone">
                {homeCopy.hero.headline}
              </h1>

              <p className="mt-8 max-w-lg text-base leading-relaxed text-bone-dim sm:text-lg">
                {homeCopy.hero.subhead}
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link href={homeCopy.hero.primaryCta.href} className="btn btn-primary">
                  {homeCopy.hero.primaryCta.label}
                </Link>
                <Link href={homeCopy.hero.secondaryCta.href} className="btn btn-secondary">
                  {homeCopy.hero.secondaryCta.label}
                </Link>
              </div>
            </div>

            {/* Vertical hairline, desktop only. */}
            <div aria-hidden="true" className="hidden w-px bg-line lg:block" />

            {/* Live stock summary. Counts come from the vehicle data, not copy. */}
            <div className="flex flex-col justify-center lg:pl-16">
              <h2 className="label-xs">Currently listed</h2>
              <dl className="mt-6 border-t border-line">
                {CATEGORY_ORDER.map((category) => (
                  <div
                    key={category}
                    className="flex items-baseline justify-between gap-6 border-b border-line py-3.5"
                  >
                    <dt className="text-[0.9375rem] text-bone-dim">{category}</dt>
                    <dd className="text-[0.9375rem] tabular-nums text-steel">
                      {countByCategory(category)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Marque line sits on the section's bottom rule. */}
          <ul className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-line py-6">
            {homeCopy.hero.marques.map((marque, i) => (
              <li key={marque} className="flex items-center gap-3">
                {i > 0 ? (
                  <span aria-hidden="true" className="text-steel-dim">
                    ·
                  </span>
                ) : null}
                <span className="text-[0.8125rem] tracking-[0.02em] text-steel">
                  {marque}
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Featured inventory */}
      <Container className="pt-20 sm:pt-28">
        <SectionHeading
          title={homeCopy.featured.title}
          intro={homeCopy.featured.intro}
          action={{ label: 'All inventory', href: '/inventory' }}
        />
        <ul className="mt-12 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 xl:grid-cols-3">
          {current.map((vehicle, i) => (
            <li key={vehicle.slug} className="h-full">
              <VehicleCard vehicle={vehicle} priority={i < 3} />
            </li>
          ))}
        </ul>
      </Container>

      {/* Browse by category */}
      <Container className="pt-24 sm:pt-32">
        <SectionHeading title={homeCopy.categories.title} />
        <ul className="mt-10 grid grid-cols-1 border-t border-line sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORY_ORDER.map((category) => (
            <li key={category} className="border-b border-line lg:border-r lg:last:border-r-0">
              <Link
                href={`/inventory?category=${encodeURIComponent(category)}`}
                className="group flex h-full flex-col justify-between gap-12 py-9 pr-6 transition-colors hover:bg-ink-raised lg:px-7 lg:py-10 lg:first:pl-0"
              >
                <div>
                  <h3 className="text-xl font-medium tracking-[-0.02em] text-bone">
                    {category}
                  </h3>
                  <p className="mt-3 max-w-[26ch] text-sm leading-relaxed text-steel">
                    {CATEGORY_BLURB[category]}
                  </p>
                </div>
                <p className="flex items-center justify-between text-xs text-steel-dim">
                  <span className="tabular-nums">
                    {countByCategory(category)}{' '}
                    {countByCategory(category) === 1 ? 'vehicle' : 'vehicles'}
                  </span>
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </Container>

      {/* Recently sold */}
      {sold.length > 0 ? (
        <Container className="pt-24 sm:pt-32">
          <SectionHeading
            title={homeCopy.sold.title}
            intro={homeCopy.sold.intro}
            action={{ label: 'All sold vehicles', href: '/sold-vehicles' }}
          />
          <ul className="mt-10 divide-y divide-line border-y border-line">
            {sold.map((vehicle) => (
              <li key={vehicle.slug}>
                <Link
                  href={`/inventory/${vehicle.slug}`}
                  className="group flex items-center gap-5 py-5 transition-colors hover:bg-ink-raised sm:gap-8"
                >
                  <div className="relative aspect-[3/2] w-24 shrink-0 overflow-hidden border border-line bg-ink-panel sm:w-28">
                    <VehicleThumb vehicle={vehicle} sizes="112px" panelSize="thumb" />
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
                    <AvailabilityBadge availability={vehicle.availability} size="sm" />
                  </div>
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-steel-dim transition-transform duration-300 group-hover:translate-x-1"
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
      <Container className="pt-24 sm:pt-32">
        <div className="rule grid gap-10 pt-12 lg:grid-cols-[20rem_1fr] lg:gap-20">
          <h2 className="display-2 text-bone">{homeCopy.sourcing.title}</h2>
          <div className="max-w-xl">
            <div className="prose-body">
              {homeCopy.sourcing.body.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
            <Link href={homeCopy.sourcing.cta.href} className="btn btn-primary mt-9">
              {homeCopy.sourcing.cta.label}
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
}
