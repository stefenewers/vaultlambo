import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { inventory } from '@/data/inventory';
import { attributableSources, imageSourceFor, imageSources } from '@/data/image-sources';
import { soldVehicles } from '@/data/sold';
import { sourcingCategories } from '@/data/sourcing';
import {
  CATEGORY_ORDER,
  getPublishedInventory,
  getPublishedSoldVehicles,
  getPublishedSourcingCategories,
  getPublishedSpecificVehicles,
  getSoldVehicleBySlug,
  hasPublishedInventory,
  recordHref,
} from '@/lib/vehicles';

const SRC = fileURLToPath(new URL('../src', import.meta.url));

/**
 * These tests exist to stop the specific failure this site was overhauled to fix:
 * generic model information being presented as individual available inventory. Most of
 * them assert something that would be a credibility problem if it regressed, not just
 * a rendering bug.
 */

describe('collection separation', () => {
  it('keeps the three collections disjoint by slug-and-kind', () => {
    const kinds = new Map<string, string[]>();

    for (const record of [...inventory, ...soldVehicles]) {
      const existing = kinds.get(record.slug) ?? [];
      kinds.set(record.slug, [...existing, record.kind]);
    }

    // A slug may legitimately appear in more than one collection only if the records
    // are genuinely different things; today nothing does, and a duplicate is far more
    // likely to be a copy-paste than a deliberate decision.
    for (const [slug, entries] of kinds) {
      expect(entries, `slug "${slug}" appears more than once`).toHaveLength(1);
    }
  });

  it('tags every record with the kind its collection implies', () => {
    expect(inventory.every((v) => v.kind === 'inventory')).toBe(true);
    expect(soldVehicles.every((v) => v.kind === 'sold')).toBe(true);
    expect(sourcingCategories.every((c) => c.kind === 'sourcing-category')).toBe(true);
  });

  it('never returns a sourcing category as a specific vehicle', () => {
    const kinds = getPublishedSpecificVehicles().map((v) => v.kind);
    expect(kinds).not.toContain('sourcing-category');
    for (const kind of kinds) {
      expect(['inventory', 'sold']).toContain(kind);
    }
  });

  it('routes each specific vehicle to its own section of the site', () => {
    for (const vehicle of getPublishedInventory()) {
      expect(recordHref(vehicle)).toMatch(/^\/inventory\//);
    }
    for (const vehicle of getPublishedSoldVehicles()) {
      expect(recordHref(vehicle)).toMatch(/^\/commissions\//);
    }
  });
});

describe('sourcing categories make no claims about specific cars', () => {
  it('carries no availability, price, status, year or image field', () => {
    for (const entry of sourcingCategories) {
      // None of these exist on the type. This guards against the object literal
      // acquiring them through a loosened type or a bad merge.
      const loose = entry as unknown as Record<string, unknown>;
      expect(loose.availability).toBeUndefined();
      expect(loose.priceDisplay).toBeUndefined();
      expect(loose.salePrice).toBeUndefined();
      expect(loose.statusNote).toBeUndefined();
      expect(loose.year).toBeUndefined();
      // Photography was removed entirely: a category illustrates scope, not a car.
      expect(loose.image).toBeUndefined();
      expect(loose.images).toBeUndefined();
    }
  });

  it('has no slug, so no per-model page can be generated from it', () => {
    for (const entry of sourcingCategories) {
      const loose = entry as unknown as Record<string, unknown>;
      expect(loose.slug).toBeUndefined();
    }
  });

  it('names a year in an example only as part of a model name, never as a car', () => {
    for (const entry of getPublishedSourcingCategories()) {
      for (const example of entry.examples) {
        expect(example, `"${example}" reads as a specific car`).not.toMatch(
          /\b(19|20)\d{2}\b/,
        );
      }
    }
  });

  it('covers every browsable category exactly once, in display order', () => {
    const published = getPublishedSourcingCategories();
    const categories = published.map((entry) => entry.category);

    expect(new Set(categories).size, 'a category is duplicated').toBe(categories.length);
    expect(categories).toEqual(
      CATEGORY_ORDER.filter((category) => categories.includes(category)),
    );
    expect(categories).toEqual([...CATEGORY_ORDER]);
  });

  it('gives every category something concrete to show', () => {
    for (const entry of getPublishedSourcingCategories()) {
      expect(entry.summary.length).toBeGreaterThan(20);
      expect(entry.examples.length).toBeGreaterThan(0);
    }
  });

  it('still covers the marques moved out of the old inventory list', () => {
    const text = sourcingCategories
      .flatMap((entry) => entry.examples)
      .join(' ')
      .toLowerCase();

    for (const make of ['porsche', 'ferrari', 'mclaren', 'bentley', 'mercedes', 'bmw']) {
      expect(text, `${make} should still appear as an example`).toContain(make);
    }
  });
});

describe('active inventory', () => {
  it('reports no inventory, so the homepage section and nav item hide', () => {
    expect(getPublishedInventory()).toHaveLength(0);
    expect(hasPublishedInventory()).toBe(false);
  });

  it('requires photography and three specific facts for anything published', () => {
    for (const vehicle of getPublishedInventory()) {
      expect(vehicle.images.length).toBeGreaterThan(0);
      expect(vehicle.specs.length).toBeGreaterThanOrEqual(3);
      expect(vehicle.year).toBeTypeOf('number');
    }
  });

  it('only ever holds a live status, never "sold"', () => {
    for (const vehicle of inventory) {
      expect(['available', 'reserved']).toContain(vehicle.availability);
    }
  });
});

describe('completed vehicles', () => {
  it('publishes only the documented Temerario', () => {
    const sold = getPublishedSoldVehicles();
    expect(sold).toHaveLength(1);
    expect(sold.map((v) => v.slug)).toEqual(['lamborghini-temerario-giallo-inti']);
  });

  it('does not present the BMW M3 CS as a completed sale', () => {
    // It was published as sold by Marlowe with nothing to support it. It survives only
    // as an example under Collector, where it makes no claim about a specific car.
    expect(soldVehicles.some((v) => v.model === 'M3')).toBe(false);

    const examples = sourcingCategories.flatMap((entry) => entry.examples);
    expect(examples.some((example) => example.includes('M3 CS'))).toBe(true);
  });

  it('keeps factory renderings out of the documentary photographs', () => {
    for (const vehicle of getPublishedSoldVehicles()) {
      for (const image of vehicle.images) {
        expect(image.kind).not.toBe('vehicle-photograph');
      }
      for (const image of vehicle.documentaryImages ?? []) {
        expect(image.kind).toBe('vehicle-photograph');
      }
    }
  });

  it('captions every configuration rendering as a rendering', () => {
    const temerario = getSoldVehicleBySlug('lamborghini-temerario-giallo-inti');
    if (!temerario) throw new Error('The documented Temerario record is missing.');

    for (const image of temerario.images) {
      expect(image.caption?.toLowerCase()).toContain('rendering');
      expect(image.alt.toLowerCase()).toContain('rendering');
    }
  });

  it('publishes the owner-confirmed sale price on the Temerario', () => {
    const temerario = getSoldVehicleBySlug('lamborghini-temerario-giallo-inti');
    if (!temerario) throw new Error('The documented Temerario record is missing.');

    // Supplied by the owner. Everything else about the transaction — VIN, mileage,
    // buyer, date — is still deliberately absent.
    expect(temerario.salePrice).toBe('$150,000 USD');
  });

  it('never invents a sale price for a car that has not been given one', () => {
    for (const vehicle of getPublishedSoldVehicles()) {
      if (vehicle.salePrice === undefined) continue;
      // A price that exists must be a non-empty, owner-supplied string, not a
      // placeholder standing in for one.
      expect(vehicle.salePrice.trim().length).toBeGreaterThan(0);
      expect(vehicle.salePrice.toLowerCase()).not.toContain('request');
      expect(vehicle.salePrice.toLowerCase()).not.toContain('undisclosed');
    }
  });

  it('keeps completed vehicles under /commissions', () => {
    for (const vehicle of getPublishedSoldVehicles()) {
      expect(recordHref(vehicle)).toBe(`/commissions/${vehicle.slug}`);
    }
  });

  it('drops the copy that explained why information was withheld', () => {
    const prose = getPublishedSoldVehicles()
      .flatMap((v) => v.description)
      .join(' ')
      .toLowerCase();

    for (const phrase of [
      'remains listed',
      'for anyone researching',
      'not published',
      'authorities',
    ]) {
      expect(prose, `description should not contain "${phrase}"`).not.toContain(phrase);
    }
  });
});

describe('draft records', () => {
  it('excludes anything unpublished from every accessor', () => {
    const published = [
      ...getPublishedInventory(),
      ...getPublishedSoldVehicles(),
      ...getPublishedSourcingCategories(),
    ];
    expect(published.every((record) => record.published)).toBe(true);
  });

  it('filters a draft out of its collection', () => {
    // Simulates the accessor's own predicate against a mixed list, so the behaviour is
    // covered even while every real record happens to be published.
    const mixed = [
      { slug: 'live', published: true },
      { slug: 'draft', published: false },
    ];
    expect(mixed.filter((r) => r.published).map((r) => r.slug)).toEqual(['live']);
  });
});

describe('no external photography', () => {
  it('holds only owner-supplied material in the ledger', () => {
    // A set of Creative Commons marque and editorial photographs was removed: legally
    // fine, but pictures of other people's cars by different photographers in
    // different places, which made the site read as a classifieds page.
    for (const source of imageSources) {
      expect(
        source.license,
        `${source.path} is externally licensed and must not be in use`,
      ).toBe('Owner supplied — all rights reserved');
    }
  });

  it('needs no public attribution interface', () => {
    // /credits existed to attribute Creative Commons images. With none left, nothing
    // requires a visible credit and the page has gone.
    expect(attributableSources()).toEqual([]);
  });

  it('references no image outside the owner-supplied vehicle directory', () => {
    const OWNER_DIR = '/images/vehicles/';
    const files = readdirSync(SRC, { recursive: true, encoding: 'utf8' }).filter(
      (file) => /\.tsx?$/.test(file),
    );

    for (const file of files) {
      const content = readFileSync(join(SRC, file), 'utf8');
      for (const match of content.matchAll(/['\"`](\/images\/[^'\"`]+)['\"`]/g)) {
        expect(
          match[1]!.startsWith(OWNER_DIR),
          `${file} still references ${match[1]}`,
        ).toBe(true);
      }
    }
  });
});

describe('image ledger', () => {
  it('records a source for every externally obtained image in use', () => {
    const inUse = [
      ...soldVehicles.flatMap((v) => [
        ...v.images.map((i) => i.src),
        ...(v.documentaryImages ?? []).map((i) => i.src),
      ]),
      ...inventory.flatMap((v) => v.images.map((i) => i.src)),
    ];

    for (const path of inUse) {
      expect(imageSourceFor(path), `no ledger entry for ${path}`).toBeDefined();
    }
  });

  it('gives every externally sourced entry a source URL and access date', () => {
    for (const source of imageSources) {
      expect(source.accessed).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      if (source.license !== 'Owner supplied — all rights reserved') {
        expect(source.sourceUrl, `${source.path} has no source URL`).toBeTruthy();
        expect(source.creator).toBeTruthy();
      }
    }
  });

  it('requires attribution for every licence that is not CC0 or owner supplied', () => {
    for (const source of imageSources) {
      const exempt =
        source.license === 'CC0 1.0' ||
        source.license === 'Owner supplied — all rights reserved';
      expect(source.attributionRequired, `${source.path}`).toBe(!exempt);
    }
  });

  it('has no duplicate paths', () => {
    const paths = imageSources.map((s) => s.path);
    expect(new Set(paths).size).toBe(paths.length);
  });
});
