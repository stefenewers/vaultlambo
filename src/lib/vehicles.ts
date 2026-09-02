import { inventory } from '@/data/inventory';
import { soldVehicles } from '@/data/sold';
import { sourcingCategories } from '@/data/sourcing';
import type {
  Availability,
  Category,
  InventoryVehicle,
  SoldVehicle,
  SourcingCategory,
  SpecificVehicle,
} from '@/lib/types';

/**
 * Read access to the published content.
 *
 * Every accessor filters on `published`. Routes, sitemaps and structured data go
 * through these functions and never touch the raw arrays, so an unpublished draft
 * cannot leak into a generated route or an indexed URL.
 */

export const AVAILABILITY_LABEL: Record<Availability, string> = {
  available: 'Available',
  reserved: 'Reserved',
  sold: 'Sold',
};

/** Filter options offered on the inventory page. 'sold' is not one — it has its own page. */
export const INVENTORY_AVAILABILITY: Extract<Availability, 'available' | 'reserved'>[] = [
  'available',
  'reserved',
];

export const CATEGORY_ORDER: Category[] = [
  'Performance',
  'Grand Touring',
  'Luxury SUV',
  'Collector',
];

const isPublished = <T extends { published: boolean }>(record: T): boolean =>
  record.published;

// --- Inventory: specific cars currently offered ------------------------------

export function getPublishedInventory(): InventoryVehicle[] {
  return inventory.filter(isPublished);
}

export function getInventoryBySlug(slug: string): InventoryVehicle | undefined {
  return getPublishedInventory().find((v) => v.slug === slug);
}

/** True when there is anything genuine to show under "Available Inventory". */
export function hasPublishedInventory(): boolean {
  return getPublishedInventory().length > 0;
}

// --- Commissions: specific cars, individually documented ---------------------

export function getPublishedSoldVehicles(): SoldVehicle[] {
  return soldVehicles.filter(isPublished);
}

export function getSoldVehicleBySlug(slug: string): SoldVehicle | undefined {
  return getPublishedSoldVehicles().find((v) => v.slug === slug);
}

// --- Sourcing: categories of brief, not cars ---------------------------------

/**
 * Published sourcing categories, in the site's category order.
 *
 * There is no `getSourcingCategoryBySlug`, because a category has no page of its own.
 * Seven thin model pages were removed in favour of one Sourcing page that explains the
 * service; the old `/sourcing/[slug]` URLs redirect there.
 */
export function getPublishedSourcingCategories(): SourcingCategory[] {
  const published = sourcingCategories.filter(isPublished);
  return CATEGORY_ORDER.flatMap((category) =>
    published.filter((entry) => entry.category === category),
  );
}

// --- Cross-collection helpers ------------------------------------------------

/** Every specific car the site publishes. Never includes sourcing categories. */
export function getPublishedSpecificVehicles(): SpecificVehicle[] {
  return [...getPublishedInventory(), ...getPublishedSoldVehicles()];
}

/**
 * The canonical path for a specific car.
 *
 * Typed to `SpecificVehicle`, so a sourcing category cannot be handed to it. There is
 * no sourcing branch to get wrong.
 */
export function recordHref(vehicle: SpecificVehicle): string {
  return vehicle.kind === 'inventory'
    ? `/inventory/${vehicle.slug}`
    : `/commissions/${vehicle.slug}`;
}

/** Full title including the year, for lists and the enquiry select. */
export function vehicleTitle(vehicle: SpecificVehicle): string {
  return [vehicle.year, vehicle.make, vehicle.model, vehicle.variant]
    .filter(Boolean)
    .join(' ');
}

/** Heading used on a detail page — the year sits in the metadata instead. */
export function vehicleHeading(vehicle: SpecificVehicle): string {
  return [vehicle.make, vehicle.model, vehicle.variant].filter(Boolean).join(' ');
}

export function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}
