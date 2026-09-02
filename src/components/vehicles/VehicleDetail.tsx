import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/site/Container';
import { AvailabilityBadge } from '@/components/vehicles/AvailabilityBadge';
import { SourcingCard } from '@/components/vehicles/SourcingCard';
import { SpecRow, SpecSection } from '@/components/vehicles/SpecSection';
import { VehicleGallery } from '@/components/vehicles/VehicleGallery';
import type { SoldVehicle, SourcingModel, SpecificVehicle } from '@/lib/types';
import { vehicleHeading, vehicleTitle } from '@/lib/vehicles';
import { siteConfig } from '@/site.config';

type Props = {
  vehicle: SpecificVehicle;
  /** Breadcrumb parent. */
  parent: { label: string; href: string };
  /** Model briefs shown at the foot of the page. */
  related: SourcingModel[];
  /** Whether an enquiry can actually be delivered. Gates the CTA. */
  canEnquire: boolean;
};

/**
 * Detail page for one specific car.
 *
 * The documentation note appears exactly once, in its own block. It used to be
 * repeated in the description, the enquiry panel and the footer, which made the page
 * read as though it were explaining itself to somebody rather than describing a car.
 */
export function VehicleDetail({ vehicle, parent, related, canEnquire }: Props) {
  const heading = vehicleHeading(vehicle);
  const isSold = vehicle.kind === 'sold';
  const documentary = isSold ? (vehicle as SoldVehicle).documentaryImages ?? [] : [];

  const enquiryHref = `/contact?vehicle=${encodeURIComponent(vehicleTitle(vehicle))}`;

  const specTitle =
    (isSold ? (vehicle as SoldVehicle).specSectionTitle : undefined) ?? 'Specification';
  const specIntro = isSold ? (vehicle as SoldVehicle).specSectionIntro : undefined;
  const specFootnote = isSold ? (vehicle as SoldVehicle).specSectionFootnote : undefined;

  return (
    <>
      <Container size="wide" className="pt-6 sm:pt-8">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-xs text-steel-dim">
            <li>
              <Link href={parent.href} className="link-underline hover:text-bone">
                {parent.label}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-steel">{heading}</li>
          </ol>
        </nav>
      </Container>

      {/* Heading */}
      <Container size="wide" className="pt-8 sm:pt-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="min-w-0">
            <p className="label-xs">
              {[vehicle.year, vehicle.category].filter(Boolean).join(' · ')}
            </p>
            <h1 className="display-1 mt-4 text-bone">{heading}</h1>
            {vehicle.subtitle ? (
              <p className="mt-4 text-lg tracking-[-0.01em] text-steel sm:text-xl">
                {vehicle.subtitle}
              </p>
            ) : null}
          </div>

          <div className="shrink-0 border-t border-line pt-6 lg:border-l lg:border-t-0 lg:pb-1 lg:pl-10 lg:pt-0 lg:text-right">
            <AvailabilityBadge
              availability={isSold ? 'sold' : vehicle.availability}
              size="lg"
              className="lg:justify-end"
            />
            {vehicle.statusNote ? (
              <p className="mt-4 text-[0.9375rem] text-bone-dim">{vehicle.statusNote}</p>
            ) : null}
            {vehicle.kind === 'inventory' ? (
              <p className="mt-1 text-sm text-steel">{vehicle.priceDisplay}</p>
            ) : null}
            {/*
              A sold price is shown only when the owner has confirmed the figure. When
              `salePrice` is absent nothing is rendered — no "price on request", no
              "undisclosed", nothing that invites a guess.
            */}
            {isSold && vehicle.salePrice ? (
              <p className="mt-3 lg:mt-4">
                <span className="label-xs block">Sold for</span>
                <span className="mt-1.5 block text-lg tabular-nums text-bone sm:text-xl">
                  {vehicle.salePrice}
                </span>
              </p>
            ) : null}
          </div>
        </div>
      </Container>

      {/* Gallery */}
      <Container size="wide" className="mt-10 sm:mt-12">
        <VehicleGallery images={[...vehicle.images]} vehicleName={heading} />
      </Container>

      {/* Metadata row */}
      <Container size="wide" className="mt-12 sm:mt-16">
        <SpecRow items={[...vehicle.specs]} />
      </Container>

      {/* Description + enquiry rail */}
      <Container size="wide" className="mt-12 sm:mt-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_20rem] lg:gap-20">
          <div className="prose-body">
            <h2 className="label-xs mb-5">About this vehicle</h2>
            {vehicle.description.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            {/*
              The CTA only appears when an enquiry has somewhere to go. A button that
              silently discards a message is worse than no button.
            */}
            {canEnquire ? (
              <div className="border border-line bg-ink-raised p-6 sm:p-7">
                <h2 className="text-lg font-medium tracking-[-0.015em] text-bone">
                  {isSold ? 'Source a similar vehicle' : 'Enquire'}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-steel">
                  {isSold
                    ? 'Tell us the model, colour and specification you are looking for.'
                    : 'Ask about specification, inspection, viewing or delivery.'}
                </p>
                <Link href={enquiryHref} className="btn btn-primary mt-6 w-full">
                  {isSold ? 'Source a similar vehicle' : 'Enquire about this vehicle'}
                </Link>
                {siteConfig.contact.email ? (
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="link-underline mt-5 block text-center text-xs text-steel transition-colors hover:text-bone"
                  >
                    {siteConfig.contact.email}
                  </a>
                ) : null}
              </div>
            ) : null}

            {/* Documentation — stated once, here and nowhere else. */}
            <div className={`border-t border-line pt-6 ${canEnquire ? 'mt-8' : ''}`}>
              <h2 className="label-xs">Vehicle documentation</h2>
              <p className="mt-3 text-xs leading-relaxed text-bone-dim">
                {siteConfig.legal.documentationNotice}
              </p>
            </div>
          </aside>
        </div>
      </Container>

      {/* Documentary photography, kept apart from the configuration renderings. */}
      {documentary.length > 0 ? (
        <Container size="wide" className="mt-16 sm:mt-20">
          <div className="rule grid gap-8 pt-8 lg:grid-cols-[18rem_1fr] lg:gap-16">
            <div>
              <h2 className="display-3 text-bone">Photographed on delivery</h2>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-steel">
                Photographs of the finished car, kept separate from the factory
                configuration renderings above.
              </p>
            </div>
            <ul className="flex flex-wrap gap-5">
              {documentary.map((image) => (
                <li key={image.src} className="w-full max-w-[18rem]">
                  <figure>
                    <div className="relative w-full overflow-hidden border border-line bg-ink-panel">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        width={image.width}
                        height={image.height}
                        sizes="(min-width: 640px) 18rem, 92vw"
                        loading="lazy"
                        className="h-auto w-full object-cover"
                      />
                    </div>
                    {image.caption ? (
                      <figcaption className="mt-3 text-xs leading-relaxed text-steel">
                        {image.caption}
                      </figcaption>
                    ) : null}
                  </figure>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      ) : null}

      {/* Specification */}
      {vehicle.specGroups && vehicle.specGroups.length > 0 ? (
        <Container size="wide" className="mt-16 sm:mt-24">
          <SpecSection
            title={specTitle}
            intro={specIntro}
            groups={vehicle.specGroups}
            footnote={specFootnote}
          />
        </Container>
      ) : null}

      {/* Related model briefs */}
      {related.length > 0 ? (
        <Container size="wide" className="mt-20 sm:mt-28">
          <div className="rule flex flex-col gap-6 pt-8 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="display-2 text-bone">Models we source</h2>
            <Link
              href="/sourcing"
              className="link-underline shrink-0 self-start text-sm text-bone-dim transition-colors hover:text-bone sm:self-end"
            >
              All models
              <span aria-hidden="true"> →</span>
            </Link>
          </div>

          <ul className="mt-10 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
            {related.map((model) => (
              <li key={model.slug} className="h-full">
                <SourcingCard
                  model={model}
                  sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 92vw"
                />
              </li>
            ))}
          </ul>
        </Container>
      ) : null}
    </>
  );
}
