import type { Vehicle } from '@/lib/types';
import { vehicleTitle } from '@/lib/vehicles';
import { siteConfig } from '@/site.config';

/**
 * Schema.org `Vehicle` for a detail page.
 *
 * Deliberately conservative: only fields backed by data actually held are emitted.
 * There is no `offers`, `price`, `vehicleIdentificationNumber`, `mileageFromOdometer`,
 * `itemCondition` or `seller`, because none of those are known.
 */
export function vehicleJsonLd(vehicle: Vehicle): Record<string, unknown> | null {
  const url = `${siteConfig.url}/inventory/${vehicle.slug}`;

  const exterior = vehicle.specs.find((s) => s.label === 'Exterior')?.value;
  const images = vehicle.images.map((i) => `${siteConfig.url}${i.src}`);

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Vehicle',
    '@id': url,
    url,
    name: vehicleTitle(vehicle),
    manufacturer: { '@type': 'Organization', name: vehicle.make },
    model: vehicle.model,
    bodyType: vehicle.bodyStyle,
    description: vehicle.summary,
  };

  if (vehicle.year) data.vehicleModelDate = String(vehicle.year);
  if (exterior) data.color = exterior;
  if (images.length > 0) data.image = images;

  return data;
}

export function organizationJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    '@id': `${siteConfig.url}#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    email: siteConfig.contact.email,
    ...(siteConfig.contact.phone ? { telephone: siteConfig.contact.phone } : {}),
  };
}

/** Renders a JSON-LD script tag. Returns null when there is nothing to emit. */
export function jsonLdScript(data: Record<string, unknown> | null) {
  if (!data) return null;
  return JSON.stringify(data);
}
