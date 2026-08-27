import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/site/Container';
import { JsonLd } from '@/components/site/JsonLd';
import { SampleInventoryNotice } from '@/components/site/SampleInventoryNotice';
import { AvailabilityBadge } from '@/components/vehicles/AvailabilityBadge';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import { VehicleGallery } from '@/components/vehicles/VehicleGallery';
import { SpecRow, SpecSection } from '@/components/vehicles/SpecSection';
import { vehicleJsonLd } from '@/lib/jsonld';
import {
  getAllVehicles,
  getSimilarVehicles,
  getVehicleBySlug,
  vehicleHeading,
  vehicleTitle,
} from '@/lib/vehicles';
import { siteConfig } from '@/site.config';

type Params = { params: Promise<{ slug: string }> };

/** Pre-render every listing so detail routes resolve on a cold refresh. */
export function generateStaticParams() {
  return getAllVehicles().map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = getVehicleBySlug(slug);
  if (!vehicle) return { title: 'Vehicle not found' };

  const title = vehicleHeading(vehicle);
  const lead = vehicle.images[0];
  const canonical = `/inventory/${vehicle.slug}`;

  return {
    title,
    description: vehicle.summary,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      title: `${title} — ${siteConfig.name}`,
      description: vehicle.summary,
      url: canonical,
      images: lead
        ? [{ url: lead.src, width: lead.width, height: lead.height, alt: lead.alt }]
        : undefined,
    },
    // Sample records exist to demonstrate the layout, not to be indexed as inventory.
    robots: vehicle.isSample ? { index: false, follow: true } : undefined,
  };
}

export default async function VehiclePage({ params }: Params) {
  const { slug } = await params;
  const vehicle = getVehicleBySlug(slug);
  if (!vehicle) notFound();

  const similar = getSimilarVehicles(vehicle.slug, 3);
  const heading = vehicleHeading(vehicle);
  const isSold = vehicle.availability === 'sold';

  const inquiryHref = `/contact?vehicle=${encodeURIComponent(vehicleTitle(vehicle))}`;

  return (
    <>
      <JsonLd data={vehicleJsonLd(vehicle)} />

      <Container size="wide" className="pt-6 sm:pt-8">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-xs text-steel-dim">
            <li>
              <Link href="/inventory" className="link-underline hover:text-bone">
                Inventory
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-steel">{heading}</li>
          </ol>
        </nav>
      </Container>

      {/* Heading block */}
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
              availability={vehicle.availability}
              size="xl"
              className="lg:justify-end"
            />
            {vehicle.statusNote ? (
              <p className="mt-4 text-[0.9375rem] text-bone-dim">{vehicle.statusNote}</p>
            ) : null}
            <p className="mt-1 text-sm text-steel-dim">{vehicle.priceDisplay}</p>
          </div>
        </div>

        {vehicle.isSample ? <SampleInventoryNotice className="mt-8" /> : null}
      </Container>

      {/* Gallery */}
      <Container size="wide" className="mt-10 sm:mt-12">
        <VehicleGallery images={vehicle.images} vehicleName={heading} />
      </Container>

      {/* Metadata row */}
      <Container size="wide" className="mt-12 sm:mt-16">
        <SpecRow items={vehicle.specs} />
      </Container>

      {/* Description + inquiry rail */}
      <Container size="wide" className="mt-12 sm:mt-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_20rem] lg:gap-20">
          <div className="prose-body">
            <h2 className="label-xs mb-5">
              {isSold ? 'About this vehicle' : 'Overview'}
            </h2>
            {vehicle.description.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="border border-line bg-ink-raised p-6 sm:p-7">
              <h2 className="display-3 text-bone">
                {isSold ? 'No longer available' : 'Interested in this vehicle?'}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-steel">
                {isSold
                  ? 'This vehicle is documented here for reference. Similar cars can be found or commissioned to a comparable specification.'
                  : 'Ask about specification, viewing or delivery. Inquiries are answered directly.'}
              </p>
              <Link
                href={inquiryHref}
                className="mt-7 inline-flex h-12 w-full items-center justify-center border border-giallo bg-giallo px-5 text-center text-[0.75rem] font-medium uppercase tracking-[0.13em] text-[#0a0a0b] transition-colors duration-300 hover:bg-transparent hover:text-giallo"
              >
                {isSold ? 'Inquire about sourcing a similar vehicle' : 'Inquire about this vehicle'}
              </Link>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="link-underline mt-5 block text-center text-xs text-steel transition-colors hover:text-bone"
              >
                {siteConfig.contact.email}
              </a>
            </div>

            {/* Documentation */}
            <div className="mt-6 border-l border-line-strong py-1 pl-5">
              <h2 className="label-xs">Vehicle documentation</h2>
              {vehicle.documentation ? (
                <p className="mt-3 text-xs leading-relaxed text-bone-dim">
                  {vehicle.documentation}
                </p>
              ) : null}
              <p className="mt-3 text-xs leading-relaxed text-steel-dim">
                {siteConfig.legal.documentationNotice}
              </p>
            </div>
          </aside>
        </div>
      </Container>

      {/* Configuration */}
      {vehicle.specGroups && vehicle.specGroups.length > 0 ? (
        <Container size="wide" className="mt-16 sm:mt-24">
          <SpecSection
            title={vehicle.isSample ? 'Specification' : 'Configuration highlights'}
            intro={
              vehicle.isSample
                ? 'Representative of the model. Not a description of an individual vehicle.'
                : 'As specified at the point of order, transcribed from the vehicle’s own factory configuration summary.'
            }
            groups={vehicle.specGroups}
            footnote={
              vehicle.isSample
                ? undefined
                : 'Option names follow the manufacturer’s configurator wording.'
            }
          />
        </Container>
      ) : null}

      {/* Similar vehicles */}
      {similar.length > 0 ? (
        <Container size="wide" className="mt-20 sm:mt-28">
          <div className="rule flex flex-col gap-6 pt-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="label-xs">Elsewhere in the collection</p>
              <h2 className="display-2 mt-3 text-bone">Similar vehicles</h2>
            </div>
            <Link
              href="/inventory"
              className="link-underline shrink-0 self-start text-sm text-bone-dim transition-colors hover:text-bone sm:self-end"
            >
              All inventory
              <span aria-hidden="true"> →</span>
            </Link>
          </div>

          <ul className="mt-10 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
            {similar.map((item) => (
              <li key={item.slug}>
                <VehicleCard
                  vehicle={item}
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
