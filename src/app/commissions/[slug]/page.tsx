import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/site/JsonLd';
import { VehicleDetail } from '@/components/vehicles/VehicleDetail';
import { canAcceptInquiries } from '@/lib/email';
import { vehicleJsonLd } from '@/lib/jsonld';
import {
  getPublishedSoldVehicles,
  getRelatedSourcingModels,
  getSoldVehicleBySlug,
  vehicleHeading,
} from '@/lib/vehicles';
import { siteConfig } from '@/site.config';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPublishedSoldVehicles().map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = getSoldVehicleBySlug(slug);
  if (!vehicle) return { title: 'Vehicle not found', robots: { index: false } };

  const title = vehicleHeading(vehicle);
  const canonical = `/commissions/${vehicle.slug}`;

  // Prefer a photograph of the car for the social card; fall back to the lead
  // configuration rendering only when there is no photograph.
  const social =
    vehicle.documentaryImages?.find((i) => i.kind === 'vehicle-photograph') ??
    vehicle.images[0];

  return {
    title,
    description: vehicle.summary,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      title: `${title} — ${siteConfig.name}`,
      description: vehicle.summary,
      url: canonical,
      images: [
        { url: social.src, width: social.width, height: social.height, alt: social.alt },
      ],
    },
  };
}

export default async function SoldVehiclePage({ params }: Params) {
  const { slug } = await params;
  const vehicle = getSoldVehicleBySlug(slug);
  if (!vehicle) notFound();

  return (
    <>
      <JsonLd data={vehicleJsonLd(vehicle)} />
      <VehicleDetail
        vehicle={vehicle}
        parent={{ label: 'Past commissions', href: '/commissions' }}
        related={getRelatedSourcingModels(vehicle.slug, 3)}
        canEnquire={canAcceptInquiries()}
      />
    </>
  );
}
