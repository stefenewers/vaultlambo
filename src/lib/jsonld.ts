import { isProductionReady } from '@/lib/production-readiness';
import type { SpecificVehicle } from '@/lib/types';
import { recordHref, vehicleTitle } from '@/lib/vehicles';
import { isLicensedDealer, siteConfig } from '@/site.config';

/**
 * Structured data.
 *
 * Schema.org markup is a set of machine-readable factual claims, so it is held to the
 * same standard as the visible copy: nothing is emitted that the repository cannot
 * support.
 *
 *   - `AutoDealer` is a claim to be a motor vehicle dealer. It is emitted only when
 *     the business is confirmed as one and the licence details are on file.
 *   - `Vehicle` describes one specific car, so it is emitted only for inventory and
 *     sold vehicles. A sourcing category gets no markup at all — marking a
 *     model brief up as a vehicle is exactly how a search engine ends up presenting
 *     it as stock.
 *   - No `offers`, `price`, `vehicleIdentificationNumber`, `mileageFromOdometer`,
 *     `itemCondition`, `seller` or location, because none of those are known.
 */

/**
 * `Vehicle` for one specific car.
 *
 * Note the type: this function cannot be called with a `SourcingCategory`, so the
 * "don't mark up model briefs as stock" rule is enforced by the compiler rather than
 * by remembering.
 */
export function vehicleJsonLd(vehicle: SpecificVehicle): Record<string, unknown> {
  const url = `${siteConfig.url}${recordHref(vehicle)}`;
  const exterior = vehicle.specs.find((s) => s.label === 'Exterior')?.value;

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

  // Only photographs of the car itself are offered as images of the car. Factory
  // configurator renderings are not photographs and are left out of structured data.
  const photographs = [
    ...vehicle.images,
    ...(vehicle.kind === 'sold' ? (vehicle.documentaryImages ?? []) : []),
  ].filter((image) => image.kind === 'vehicle-photograph');

  if (photographs.length > 0) {
    data.image = photographs.map((i) => `${siteConfig.url}${i.src}`);
  }

  return data;
}

/**
 * Organisation markup, or null.
 *
 * Three outcomes, in decreasing order of what the site is prepared to assert:
 *
 *   AutoDealer   — confirmed licensed dealer, licence on file, contact configured
 *   Organization — contact details configured, classification confirmed
 *   null         — anything less; better to say nothing than to assert a business
 *                  that has not been established
 */
export function organizationJsonLd(): Record<string, unknown> | null {
  const { contact, classification, legalEntity } = siteConfig;

  // Without a real contact address there is no organisation to describe.
  if (!contact.email || !isProductionReady()) return null;
  if (classification === 'unconfirmed') return null;

  const type = isLicensedDealer() ? 'AutoDealer' : 'Organization';

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': type,
    '@id': `${siteConfig.url}#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    email: contact.email,
  };

  if (legalEntity) data.legalName = legalEntity;
  if (contact.phone) data.telephone = contact.phone;
  if (contact.serviceArea) {
    data.areaServed = { '@type': 'Place', name: contact.serviceArea };
  }
  if (siteConfig.social.length > 0) {
    data.sameAs = siteConfig.social.map((s) => s.href);
  }

  return data;
}
