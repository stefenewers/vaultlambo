import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/site/JsonLd';
import { VehicleDetail } from '@/components/vehicles/VehicleDetail';
import { canAcceptInquiries } from '@/lib/email';
import { vehicleJsonLd } from '@/lib/jsonld';
import {
  getInventoryBySlug,
  getPublishedInventory,
  vehicleHeading,
} from '@/lib/vehicles';
import { siteConfig } from '@/site.config';

type Params = { params: Promise<{ slug: string }> };

/**
 * Only published inventory generates a route. An unpublished draft has no static
 * param, and `getInventoryBySlug` filters on `published` as well, so requesting one
 * directly returns 404 rather than rendering a draft.
 */
export function generateStaticParams() {
  return getPublishedInventory().map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = getInventoryBySlug(slug);
  if (!vehicle) return { title: 'Vehicle not found', robots: { index: false } };

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
      images: [{ url: lead.src, width: lead.width, height: lead.height, alt: lead.alt }],
    },
  };
}

export default async function InventoryVehiclePage({ params }: Params) {
  const { slug } = await params;
  const vehicle = getInventoryBySlug(slug);
  if (!vehicle) notFound();

  return (
    <>
      <JsonLd data={vehicleJsonLd(vehicle)} />
      <VehicleDetail
        vehicle={vehicle}
        parent={{ label: 'Inventory', href: '/inventory' }}
        canEnquire={canAcceptInquiries()}
      />
    </>
  );
}
