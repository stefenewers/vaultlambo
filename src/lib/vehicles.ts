import { inventory } from '@/data/inventory';
import { soldVehicles } from '@/data/sold';
import { sourcingCatalogue } from '@/data/sourcing';
import type {
  Availability,
  Category,
  InventoryVehicle,
  SoldVehicle,
  SourcingModel,
  SpecificVehicle,
  VehicleRecord,
} from '@/lib/types';

/**
 * Read access to the three collections.
 *
 * Every accessor here filters on `published`. Routes, sitemaps and structured data go
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

/** One short line per category, used on the sourcing catalogue. */
export const CATEGORY_BLURB: Record<Category, string> = {
  Performance: 'Mid- and rear-engined cars built to be driven hard.',
  'Grand Touring': 'Long-legged coupes and saloons for distance.',
  'Luxury SUV': 'Full-size utility, specified properly.',
  Collector: 'Limited runs and cars worth keeping.',
};

const isPublished = <T extends VehicleRecord>(record: T): boolean => record.published;

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

// --- Sold: specific cars, individually documented ----------------------------

export function getPublishedSoldVehicles(): SoldVehicle[] {
  return soldVehicles.filter(isPublished);
}

export function getSoldVehicleBySlug(slug: string): SoldVehicle | undefined {
  return getPublishedSoldVehicles().find((v) => v.slug === slug);
}

// --- Sourcing: models, not cars ----------------------------------------------

export function getPublishedSourcingModels(): SourcingModel[] {
  return sourcingCatalogue.filter(isPublished);
}

export function getSourcingModelBySlug(slug: string): SourcingModel | undefined {
  return getPublishedSourcingModels().find((m) => m.slug === slug);
}

/** Sourcing models grouped by category, in display order, skipping empty groups. */
export function getSourcingByCategory(): { category: Category; models: SourcingModel[] }[] {
  const all = getPublishedSourcingModels();
  return CATEGORY_ORDER.map((category) => ({
    category,
    models: all.filter((m) => m.category === category),
  })).filter((group) => group.models.length > 0);
}

// --- Cross-collection helpers ------------------------------------------------

/** Every specific car the site publishes. Never includes sourcing models. */
export function getPublishedSpecificVehicles(): SpecificVehicle[] {
  return [...getPublishedInventory(), ...getPublishedSoldVehicles()];
}

/** The canonical path for any record. Each kind lives under its own section. */
export function recordHref(record: VehicleRecord): string {
  switch (record.kind) {
    case 'inventory':
      return `/inventory/${record.slug}`;
    case 'sold':
      return `/commissions/${record.slug}`;
    case 'sourcing':
      return `/sourcing/${record.slug}`;
  }
}

/**
 * Full title including the year, for lists and the enquiry select.
 *
 * A sourcing model never carries a year here: a model has no model year, and printing
 * one would imply a particular car.
 */
export function vehicleTitle(record: VehicleRecord): string {
  const year = record.kind === 'sourcing' ? undefined : record.year;
  return [year, record.make, record.model, record.variant].filter(Boolean).join(' ');
}

/** Heading used on a detail page — the year sits in the metadata instead. */
export function vehicleHeading(record: VehicleRecord): string {
  return [record.make, record.model, record.variant].filter(Boolean).join(' ');
}

/** Model name without the marque. */
export function vehicleModelLine(record: VehicleRecord): string {
  return [record.model, record.variant].filter(Boolean).join(' ');
}

/**
 * Other model briefs to surface at the foot of a page. Sourcing models only — a
 * completed sale is never offered as an alternative to buy.
 */
export function getRelatedSourcingModels(slug: string, limit = 3): SourcingModel[] {
  const all = getPublishedSourcingModels();
  const current = all.find((m) => m.slug === slug);

  const scored = all
    .filter((m) => m.slug !== slug)
    .map((model) => {
      let score = 0;
      if (current) {
        if (model.category === current.category) score += 3;
        if (model.bodyStyle === current.bodyStyle) score += 2;
      }
      return { model, score };
    })
    .sort((a, b) => b.score - a.score || a.model.slug.localeCompare(b.model.slug));

  return scored.slice(0, limit).map((s) => s.model);
}

export function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}
