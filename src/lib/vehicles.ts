import { vehicles } from '@/data/vehicles';
import type { Availability, Category, Vehicle } from '@/lib/types';

export const AVAILABILITY_ORDER: Availability[] = ['available', 'reserved', 'sold'];

export const AVAILABILITY_LABEL: Record<Availability, string> = {
  available: 'Available',
  reserved: 'Reserved',
  sold: 'Sold',
};

export const CATEGORY_ORDER: Category[] = [
  'Performance',
  'Grand Touring',
  'Luxury SUV',
  'Collector',
];

/** One short line per category, used on the browse-by-category row. */
export const CATEGORY_BLURB: Record<Category, string> = {
  Performance: 'Mid- and rear-engined cars built to be driven hard.',
  'Grand Touring': 'Long-legged coupes and saloons for distance.',
  'Luxury SUV': 'Full-size utility, specified properly.',
  Collector: 'Limited runs and cars worth keeping.',
};

export function getAllVehicles(): Vehicle[] {
  return vehicles;
}

export function getVehicleBySlug(slug: string): Vehicle | undefined {
  return vehicles.find((v) => v.slug === slug);
}

export function getSoldVehicles(): Vehicle[] {
  return vehicles.filter((v) => v.availability === 'sold');
}

/** Available and reserved cars — everything currently on the books. */
export function getCurrentVehicles(): Vehicle[] {
  return vehicles.filter((v) => v.availability !== 'sold');
}

export function countByCategory(category: Category): number {
  return vehicles.filter((v) => v.category === category).length;
}

/** Other vehicles to surface at the foot of a detail page. */
export function getSimilarVehicles(slug: string, limit = 3): Vehicle[] {
  const current = getVehicleBySlug(slug);
  if (!current) return vehicles.slice(0, limit);

  const scored = vehicles
    .filter((v) => v.slug !== slug)
    .map((v) => {
      let score = 0;
      if (v.category === current.category) score += 3;
      if (v.bodyStyle === current.bodyStyle) score += 2;
      if (v.availability !== 'sold') score += 1;
      return { vehicle: v, score };
    })
    .sort((a, b) => b.score - a.score || a.vehicle.slug.localeCompare(b.vehicle.slug));

  return scored.slice(0, limit).map((s) => s.vehicle);
}

export function vehicleTitle(v: Vehicle): string {
  return [v.year, v.make, v.model, v.variant].filter(Boolean).join(' ');
}

/** Heading used on the detail page — the year sits in the metadata instead. */
export function vehicleHeading(v: Vehicle): string {
  return [v.make, v.model, v.variant].filter(Boolean).join(' ');
}

/** Model name without the marque, for the typographic image panel. */
export function vehicleModelLine(v: Vehicle): string {
  return [v.model, v.variant].filter(Boolean).join(' ');
}

export function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}
