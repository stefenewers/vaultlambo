import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/site/Container';
import { AvailabilityBadge } from '@/components/vehicles/AvailabilityBadge';
import { SpecRow, SpecSection } from '@/components/vehicles/SpecSection';
import { focusStyle } from '@/lib/media';
import { VehicleGallery } from '@/components/vehicles/VehicleGallery';
import type { SoldVehicle, SpecificVehicle } from '@/lib/types';
import { vehicleHeading, vehicleTitle } from '@/lib/vehicles';
import { siteConfig } from '@/site.config';

type Props = {
  vehicle: SpecificVehicle;
  /** Breadcrumb parent. */
  parent: { label: string; href: string };
  /** Whether an enquiry can actually be delivered. Gates the CTA. */
  canEnquire: boolean;
};

/**
 * Detail page for one specific car, told as a case study rather than a data sheet.
 *
 * Opening: the name at poster scale, the status and any confirmed price, then the lead
 * image wide. After that the story runs overview → key facts → gallery → photographs
 * of the car → full specification → documentation → the next search.
 *
 * Provenance is carried by every image's own caption. The gallery is titled as
 * configuration renderings when that is all it holds, and photographs of the car sit
 * in their own section, so the two are never presented as the same kind of evidence.
 * The documentation note appears exactly once.
 */
export function VehicleDetail({ vehicle, parent, canEnquire }: Props) {
  const heading = vehicleHeading(vehicle);
  const isSold = vehicle.kind === 'sold';
  const sold = isSold ? (vehicle as SoldVehicle) : null;
  const documentary = sold?.documentaryImages ?? [];
  const lead = vehicle.images[0];

  const enquiryHref = `/contact?vehicle=${encodeURIComponent(vehicleTitle(vehicle))}`;

  const specTitle = sold?.specSectionTitle ?? 'Specification';
  const allRenders = vehicle.images.every((image) => image.kind === 'factory-render');
  /*
   * The lead image is already shown full width at the top of the page, so the gallery
   * starts from the next one rather than opening on the same picture twice.
   */
  const galleryImages = vehicle.images.length > 1 ? vehicle.images.slice(1) : [...vehicle.images];

  return (
    <>
      {/* Opening */}
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

        <p className="label-xs mt-10 sm:mt-14">
          {[isSold ? 'Commission' : 'Available', vehicle.year, vehicle.category]
            .filter(Boolean)
            .join(' · ')}
        </p>
        {/* Full width: the model name is the image until the image arrives. */}
        <h1 className="display-mega rise mt-6 text-[clamp(3.25rem,13.5vw,14rem)] text-bone [overflow-wrap:break-word]">
          <span className="block text-[0.3em] leading-none tracking-[-0.02em] text-bone-dim">
            {vehicle.make}
          </span>{' '}
          <span className="mt-[0.2em] block">
            {[vehicle.model, vehicle.variant].filter(Boolean).join(' ')}
          </span>
        </h1>

        <div className="mt-8 flex flex-col gap-8 border-t border-line pt-8 sm:mt-10 lg:flex-row lg:items-end lg:justify-between">
          {vehicle.subtitle ? (
            <p className="text-xl tracking-[-0.01em] text-bone-dim sm:text-2xl">
              {vehicle.subtitle}
            </p>
          ) : (
            <span />
          )}

          <div className="flex flex-wrap items-end gap-x-12 gap-y-6">
            <div>
              <AvailabilityBadge availability={isSold ? 'sold' : vehicle.availability} size="lg" />
              {vehicle.statusNote ? (
                <p className="mt-3 text-base text-bone-dim">{vehicle.statusNote}</p>
              ) : null}
              {vehicle.kind === 'inventory' ? (
                <p className="mt-1 text-sm text-steel">{vehicle.priceDisplay}</p>
              ) : null}
            </div>
            {/*
              A sold price is shown only when the owner has confirmed the figure. When
              `salePrice` is absent nothing is rendered — no "price on request", no
              "undisclosed", nothing that invites a guess.
            */}
            {sold?.salePrice ? (
              <p>
                <span className="label-xs block">Sold for</span>
                <span className="mt-2 block text-2xl tabular-nums text-bone sm:text-3xl">
                  {sold.salePrice}
                </span>
              </p>
            ) : null}
          </div>
        </div>
      </Container>

      {/* Lead image — the page's one priority image. */}
      <Container size="wide" className="mt-12 sm:mt-16">
        <figure>
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-black lg:aspect-[21/9]">
            <Image
              src={lead.src}
              alt={lead.alt}
              fill
              priority
              sizes="(min-width: 1664px) 1600px, 96vw"
              className="hero-settle object-cover"
              style={focusStyle(lead)}
            />
          </div>
          {lead.caption ? (
            <figcaption className="mt-3 text-xs leading-relaxed text-steel">
              {lead.caption}
            </figcaption>
          ) : null}
        </figure>
      </Container>

      {/* Overview */}
      <Container size="wide" className="mt-20 sm:mt-28">
        <section
          aria-labelledby="overview"
          className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-24"
        >
          <h2 id="overview" className="display-2 text-bone">
            Overview
          </h2>
          <div className="prose-body reveal [&_p]:max-w-[58ch] [&_p]:text-lg sm:[&_p]:text-xl [&_p]:leading-relaxed">
            {vehicle.description.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
        </section>
      </Container>

      {/* Key facts */}
      <Container size="wide" className="mt-16 sm:mt-20">
        <SpecRow items={[...vehicle.specs]} />
      </Container>

      {/* Gallery */}
      <Container size="wide" className="mt-20 sm:mt-28">
        <section aria-labelledby="gallery">
          <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
            <h2 id="gallery" className="display-2 text-bone">
              {allRenders ? 'Configuration renderings' : 'Gallery'}
            </h2>
            {allRenders ? (
              <p className="max-w-md text-sm leading-relaxed text-steel">
                Factory configurator output for this exact specification. Renderings,
                not photographs.
              </p>
            ) : null}
          </div>
          <VehicleGallery
            images={galleryImages}
            vehicleName={heading}
            priority={false}
          />
        </section>
      </Container>

      {/* Photographs of the car itself, kept apart from the renderings above. */}
      {documentary.length > 0 ? (
        <section aria-labelledby="delivery" className="surface-paper mt-24 sm:mt-32">
          <Container size="wide" className="py-20 sm:py-28">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-24">
              <div className="lg:order-2">
                <p className="label-xs">Photograph</p>
                <h2 id="delivery" className="display-1 mt-6 max-w-[12ch] text-ink">
                  Photographed on delivery.
                </h2>
                <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">
                  A photograph of the finished car, kept separate from the factory
                  configuration renderings.
                </p>
              </div>
              <ul className="grid gap-5 sm:grid-cols-2 lg:order-1 lg:grid-cols-1">
                {documentary.map((image) => (
                  <li key={image.src} className="reveal">
                    <figure className="mx-auto max-w-[26rem] lg:mx-0">
                      <div className="relative w-full overflow-hidden bg-ink-panel">
                        <Image
                          src={image.src}
                          alt={image.alt}
                          width={image.width}
                          height={image.height}
                          sizes="(min-width: 1024px) 26rem, 92vw"
                          loading="lazy"
                          className="h-auto w-full object-cover"
                        />
                      </div>
                      {image.caption ? (
                        <figcaption className="mt-3 text-xs leading-relaxed text-ink-soft">
                          {image.caption}
                        </figcaption>
                      ) : null}
                    </figure>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>
      ) : null}

      {/* Full specification */}
      {vehicle.specGroups && vehicle.specGroups.length > 0 ? (
        <Container size="wide" className="mt-20 sm:mt-28">
          <SpecSection
            title={specTitle}
            intro={sold?.specSectionIntro}
            groups={vehicle.specGroups}
            footnote={sold?.specSectionFootnote}
          />
        </Container>
      ) : null}

      {/* Documentation — stated once, here and nowhere else. */}
      <Container size="wide" className="mt-20 sm:mt-24">
        <section
          aria-labelledby="documentation"
          className="rule grid gap-4 pt-8 lg:grid-cols-[18rem_1fr] lg:gap-16"
        >
          <h2 id="documentation" className="label-xs">
            Vehicle documentation
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-bone-dim">
            {siteConfig.legal.documentationNotice}
          </p>
        </section>
      </Container>

      {/*
        The next search. Only when an enquiry has somewhere to go — a button that
        silently discards a message is worse than no button.
      */}
      {canEnquire ? (
        <Container size="wide" className="mt-24 sm:mt-32">
          <section
            aria-labelledby="next-search"
            className="relative border-t border-line-strong pt-14 sm:pt-20"
          >
            <span aria-hidden="true" className="absolute left-0 top-0 h-px w-16 bg-giallo" />
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <h2 id="next-search" className="display-1 max-w-[14ch] text-bone">
                {isSold ? 'Looking for something similar?' : 'Interested in this car?'}
              </h2>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link href={enquiryHref} className="group btn btn-primary btn-lg w-full sm:w-auto">
                  {isSold ? 'Source a similar vehicle' : 'Enquire about this vehicle'}
                  <span aria-hidden="true" className="arrow-nudge ml-3">
                    →
                  </span>
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
          </section>
        </Container>
      ) : null}
    </>
  );
}
